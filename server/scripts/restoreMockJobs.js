const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const restoreMockJobs = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini-job-portal');
    console.log('✅ Connected.');

    const candidate = await User.findOne({ email: 'umasriguttikonda@gmail.com' });
    const recruiter = await User.findOne({ email: 'guthikondaprasad7@gmail.com' });

    if (!candidate) {
      console.error('❌ Candidate not found. Please ensure the candidate exists first.');
      process.exit(1);
    }
    
    let recruiterId = recruiter ? recruiter._id : new mongoose.Types.ObjectId();

    console.log('💼 Creating Mock Jobs...');
    
    const job1 = await Job.create({
      title: 'Frontend React Developer',
      company: 'TechCorp Solutions',
      location: 'Remote, US',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'Looking for a skilled frontend dev to build scalable UIs.',
      requirements: ['React', 'CSS', 'JavaScript'],
      responsibilities: ['Build UI', 'Write CSS', 'Fix bugs'],
      applicationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      recruiterId
    });

    const job2 = await Job.create({
      title: 'UX/UI Designer',
      company: 'Creative Studio',
      location: 'New York, NY',
      type: 'Part-time',
      salary: '$60/hr',
      description: 'Seeking a creative mind to design beautiful user experiences.',
      requirements: ['Figma', 'UI/UX', 'Prototyping'],
      responsibilities: ['Create mockups', 'User research', 'Design systems'],
      applicationEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      recruiterId
    });

    const job3 = await Job.create({
      title: 'Backend Node.js Engineer',
      company: 'Dataflow Systems',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$110k - $140k',
      description: 'Backend engineer to scale our microservices.',
      requirements: ['Node.js', 'MongoDB', 'Express'],
      responsibilities: ['API development', 'Database tuning', 'Deployment'],
      applicationEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      recruiterId
    });

    console.log('📝 Creating Applications for the candidate...');

    // Job 1: Applied
    const app1 = await Application.create({
      jobId: job1._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      candidateId: candidate._id,
      resumePath: 'uploads/mock.pdf',
      skills: candidate.skills,
      status: 'Applied',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });
    
    // Job 2: Shortlisted
    const app2 = await Application.create({
      jobId: job2._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      candidateId: candidate._id,
      resumePath: 'uploads/mock.pdf',
      skills: candidate.skills,
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    // Job 3: Interview Call Received
    const app3 = await Application.create({
      jobId: job3._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      candidateId: candidate._id,
      resumePath: 'uploads/mock.pdf',
      skills: candidate.skills,
      status: 'Interview Call Received',
      interviewDate: '2026-06-15',
      interviewTime: '14:30',
      interviewLink: 'https://zoom.us/j/123456789',
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    // Add to candidate's appliedJobs array
    candidate.appliedJobs.push(
      { applicationId: app1._id, jobId: job1._id, title: job1.title, companyName: job1.company, status: 'Applied' },
      { applicationId: app2._id, jobId: job2._id, title: job2.title, companyName: job2.company, status: 'Shortlisted' },
      { applicationId: app3._id, jobId: job3._id, title: job3.title, companyName: job3.company, status: 'Interview Call Received', interviewDate: '2026-06-15', interviewTime: '14:30', interviewLink: 'https://zoom.us/j/123456789' }
    );

    await candidate.save();

    console.log('✅ Mock data successfully added for candidate!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Failed:', err);
    process.exit(1);
  }
};

restoreMockJobs();
