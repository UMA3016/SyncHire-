const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedData = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini-job-portal');
    console.log('✅ Connected to Database.');
    
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Recruiter
    console.log('👤 Creating Mock Recruiter...');
    const recruiter = await User.create({
      name: 'Acme Corp HR',
      email: 'hr@acme.com',
      phone: '123-456-7890',
      password: hashedPassword,
      role: 'recruiter',
      isVerified: true,
      companySize: '51-200',
      companyWebsite: 'https://acmecorp.com',
      companyDescription: 'Acme Corp is a leading innovator in making things explode (safely).',
    });

    // 2. Create Job
    console.log('💼 Creating Mock Job...');
    const job = await Job.create({
      title: 'Frontend React Developer',
      company: 'Acme Corp',
      location: 'Remote, US',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'We are looking for a VIBEY Frontend Developer to build beautiful UI.',
      requirements: ['React', 'CSS Modules', 'Good Vibes'],
      responsibilities: ['Build UI', 'Write CSS', 'Pass vibe checks'],
      applicationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      recruiterId: recruiter._id,
    });

    // 3. Create Candidates
    console.log('👥 Creating Mock Candidates (Vibe Applicants)...');
    
    const c1 = await User.create({
      name: 'Alex The Coder',
      email: 'alex@vibe.com',
      phone: '555-0101',
      password: hashedPassword,
      role: 'candidate',
      isVerified: true,
      skills: ['React', 'JavaScript', 'Tailwind'],
      resumeFile: 'uploads/mock-resume-1.pdf'
    });

    const c2 = await User.create({
      name: 'Sam The Designer',
      email: 'sam@vibe.com',
      phone: '555-0202',
      password: hashedPassword,
      role: 'candidate',
      isVerified: true,
      skills: ['Figma', 'CSS', 'React'],
      resumeFile: 'uploads/mock-resume-2.pdf'
    });

    const c3 = await User.create({
      name: 'Jordan The Hacker',
      email: 'jordan@vibe.com',
      phone: '555-0303',
      password: hashedPassword,
      role: 'candidate',
      isVerified: true,
      skills: ['Node.js', 'React', 'MongoDB'],
      resumeFile: 'uploads/mock-resume-3.pdf'
    });

    // 4. Create Applications
    console.log('📝 Submitting Applications...');
    
    const app1 = await Application.create({
      jobId: job._id,
      name: c1.name,
      email: c1.email,
      phone: c1.phone,
      candidateId: c1._id,
      resumePath: c1.resumeFile,
      skills: c1.skills,
      status: 'Applied',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    });
    c1.appliedJobs.push({ applicationId: app1._id, jobId: job._id, title: job.title, companyName: job.company, status: 'Applied' });
    await c1.save();

    const app2 = await Application.create({
      jobId: job._id,
      name: c2.name,
      email: c2.email,
      phone: c2.phone,
      candidateId: c2._id,
      resumePath: c2.resumeFile,
      skills: c2.skills,
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    });
    c2.appliedJobs.push({ applicationId: app2._id, jobId: job._id, title: job.title, companyName: job.company, status: 'Shortlisted' });
    await c2.save();

    const app3 = await Application.create({
      jobId: job._id,
      name: c3.name,
      email: c3.email,
      phone: c3.phone,
      candidateId: c3._id,
      resumePath: c3.resumeFile,
      skills: c3.skills,
      status: 'Rejected',
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    });
    c3.appliedJobs.push({ applicationId: app3._id, jobId: job._id, title: job.title, companyName: job.company, status: 'Rejected' });
    await c3.save();

    console.log('\n=======================================');
    console.log('🎉 SEEDING COMPLETE! You can now login:');
    console.log('RECRUITER: hr@acme.com / password123');
    console.log('CANDIDATE 1: alex@vibe.com / password123');
    console.log('=======================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
};

seedData();
