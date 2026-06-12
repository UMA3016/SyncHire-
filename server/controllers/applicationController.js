const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendStatusEmail = require('../utils/sendStatusEmail');
const { parseResumeForSkills } = require('../utils/resumeParserService');

// @desc    Submit an application for a job (One-Click)
// @route   POST /api/applications
// @access  Private (Candidate)
const applyForJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply for jobs' });
    }

    const { jobId } = req.body;

    // Validate that the referenced job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user.resumeFile) {
      return res.status(400).json({ message: 'Please complete your Profile Builder first (Resume missing)' });
    }

    // Ensure they haven't already applied
    const existingApplication = await Application.findOne({ jobId, candidateId: user._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this position' });
    }

    // Create the Application document
    const application = await Application.create({
      jobId,
      name: user.name,
      email: user.email,
      phone: user.phone || 'N/A',
      candidateId: user._id,
      resumePath: user.resumeFile,
      profilePicture: user.profilePicture,
      skills: user.skills,
      qualification: user.qualification,
      status: 'Applied',
    });

    // Push tracking subdocument into User.appliedJobs
    user.appliedJobs.push({
      applicationId: application._id,
      jobId: job._id,
      title: job.title,
      companyName: job.company,
      status: 'Applied',
    });
    await user.save();

    // Fire and forget email notification
    sendStatusEmail(user.email, user.name, job.title, job.company, 'Applied').catch(err => console.error(err));

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getApplicationsByJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can view applications' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (recruiter action)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can update application status' });
    }

    const { status, interviewDate, interviewTime, interviewLink } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Interview Call Received', 'Selection Confirmed', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Update the Application document
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the recruiter owns the job this application belongs to
    const job = await Job.findById(application.jobId);
    if (!job || job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    if (interviewDate) application.interviewDate = interviewDate;
    if (interviewTime) application.interviewTime = interviewTime;
    if (interviewLink) application.interviewLink = interviewLink;
    await application.save();

    // Mongoose positional operator: update the matching subdocument in User.appliedJobs
    const updateFields = { 'appliedJobs.$.status': status };
    if (interviewDate) updateFields['appliedJobs.$.interviewDate'] = interviewDate;
    if (interviewTime) updateFields['appliedJobs.$.interviewTime'] = interviewTime;
    if (interviewLink) updateFields['appliedJobs.$.interviewLink'] = interviewLink;

    await User.updateOne(
      { 'appliedJobs.applicationId': application._id },
      { $set: updateFields }
    );

    // Fire and forget email notification
    sendStatusEmail(
      application.email,
      application.name,
      job.title,
      job.company,
      status,
      { interviewDate, interviewTime, interviewLink }
    ).catch(err => console.error(err));

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in candidate's application pipeline
// @route   GET /api/applications/my-pipeline
// @access  Private (Candidate)
const getMyPipeline = async (req, res, next) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can view their pipeline' });
    }

    const user = await User.findById(req.user._id).select('appliedJobs');
    res.status(200).json({
      success: true,
      appliedJobs: user.appliedJobs || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Parse resume to extract skills
// @route   POST /api/applications/:id/parse-resume
// @access  Private (Recruiter)
const parseResume = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can parse resumes' });
    }

    const { id } = req.params;
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.resumePath) {
      return res.status(400).json({ message: 'No resume file found for this application' });
    }

    // Parse the PDF
    const extractedSkills = await parseResumeForSkills(application.resumePath);

    // Filter out skills that are already in the application
    const existingSkillsLower = application.skills.map(s => s.toLowerCase());
    const newSkills = extractedSkills.filter(s => !existingSkillsLower.includes(s.toLowerCase()));

    if (newSkills.length > 0) {
      application.skills = [...application.skills, ...newSkills];
      await application.save();
      
      // Update the User's master profile
      const user = await User.findById(application.candidateId);
      if (user) {
        const userExistingSkillsLower = user.skills.map(s => s.toLowerCase());
        const userNewSkills = newSkills.filter(s => !userExistingSkillsLower.includes(s.toLowerCase()));
        if (userNewSkills.length > 0) {
          user.skills = [...user.skills, ...userNewSkills];
          await user.save();
        }
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Resume parsed successfully',
      extractedSkills: newSkills,
      allSkills: application.skills
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getApplicationsByJob,
  updateApplicationStatus,
  getMyPipeline,
  parseResume
};
