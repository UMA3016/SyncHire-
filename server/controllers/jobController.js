const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all jobs (sorted newest first), with optional search & type filter
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { company: regex },
        { location: regex },
      ];
    }

    if (type) {
      filter.type = type;
    }

    // By default, public query should not return archived jobs
    filter.status = { $ne: 'Archived' };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for logged-in recruiter (includes Archived)
// @route   GET /api/jobs/recruiter/me
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can fetch these jobs' });
    }
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can create jobs' });
    }
    const jobData = { ...req.body, recruiterId: req.user._id, status: req.body.status || 'Active' };
    const job = await Job.create(jobData);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job by ID
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can update jobs' });
    }

    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Archive a job by ID (Soft Delete)
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
const deleteJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can archive jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to archive this job' });
    }

    // Soft delete: change status to Archived and set archivedAt for TTL expiration
    job.status = 'Archived';
    job.archivedAt = new Date();
    await job.save();

    res.status(200).json({ message: 'Job archived successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore an archived job
// @route   PUT /api/jobs/:id/restore
// @access  Private (Recruiter)
const restoreJob = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can restore jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to restore this job' });
    }

    // Restore: change status back to Active and unset archivedAt
    job.status = 'Active';
    job.archivedAt = undefined;
    await job.save();

    res.status(200).json({ success: true, data: job, message: 'Job restored successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to a job - tracks application in user's appliedJobs array
// @route   POST /api/jobs/:jobId/apply
// @access  Private (Candidate)
const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already applied
    const alreadyApplied = user.appliedJobs.some(
      (app) => app.jobId.toString() === jobId
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Add job to user's appliedJobs array
    user.appliedJobs.push({
      jobId: job._id,
      title: job.title,
      companyName: job.company,
      status: 'Applied',
      appliedAt: new Date(),
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully!',
      appliedJobs: user.appliedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Load Demo Data for a Recruiter
// @route   POST /api/jobs/load-demo-data
// @access  Private (Recruiter)
const loadDemoData = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can load demo data' });
    }

    const recruiterId = req.user._id;

    // 1. Create a Mock Job
    const job = await Job.create({
      title: 'Demo Job: UX/UI Designer',
      company: req.user.name || 'Demo Company',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $100k',
      description: 'This is a mock job created for your demo screening process. Feel free to evaluate the mock applicants.',
      requirements: ['Figma', 'Prototyping', 'User Research'],
      responsibilities: ['Create wireframes', 'Conduct usability testing'],
      applicationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      recruiterId
    });

    // 2. Create Mock Applications for this job
    const applicationsToCreate = [
      { name: 'Alice Smith', email: 'alice@demo.com', status: 'Applied' },
      { name: 'Bob Johnson', email: 'bob@demo.com', status: 'Shortlisted' },
      { name: 'Charlie Davis', email: 'charlie@demo.com', status: 'Interview Call Received', interviewDate: '2026-06-20', interviewTime: '10:00', interviewLink: 'https://zoom.us/demo' },
      { name: 'Diana Prince', email: 'diana@demo.com', status: 'Selection Confirmed' },
      { name: 'Ethan Hunt', email: 'ethan@demo.com', status: 'Rejected' },
    ];

    const apps = applicationsToCreate.map((app) => ({
      jobId: job._id,
      name: app.name,
      email: app.email,
      phone: '555-0000',
      candidateId: new mongoose.Types.ObjectId(), // Fake candidate ID
      resumePath: 'uploads/demo-resume.pdf',
      skills: ['Figma', 'CSS', 'HTML'],
      status: app.status,
      interviewDate: app.interviewDate,
      interviewTime: app.interviewTime,
      interviewLink: app.interviewLink,
      appliedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
    }));

    await Application.insertMany(apps);

    res.status(201).json({ success: true, message: 'Demo data loaded successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getRecruiterJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  restoreJob,
  applyToJob,
  loadDemoData,
};
