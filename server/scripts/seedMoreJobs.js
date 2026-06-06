const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Job = require('../models/Job');

const seedMoreJobs = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini-job-portal');
    console.log('✅ Connected.');

    const recruiter = await User.findOne({ email: 'guthikondaprasad7@gmail.com' });
    let recruiterId = recruiter ? recruiter._id : new mongoose.Types.ObjectId();

    console.log('💼 Creating 15 Mock Jobs...');

    const jobData = [
      { title: 'Senior Software Engineer', type: 'Full-time', location: 'San Francisco, CA' },
      { title: 'Marketing Intern', type: 'Internship', location: 'Remote, US' },
      { title: 'Customer Support Rep', type: 'Part-time', location: 'Austin, TX' },
      { title: 'Data Scientist', type: 'Full-time', location: 'New York, NY' },
      { title: 'Freelance Graphic Designer', type: 'Remote', location: 'Global' },
      { title: 'Junior Frontend Developer', type: 'Full-time', location: 'Seattle, WA' },
      { title: 'HR Assistant', type: 'Part-time', location: 'Chicago, IL' },
      { title: 'Cybersecurity Analyst Intern', type: 'Internship', location: 'Boston, MA' },
      { title: 'Cloud Architect', type: 'Full-time', location: 'Remote, US' },
      { title: 'Social Media Manager', type: 'Part-time', location: 'Los Angeles, CA' },
      { title: 'DevOps Engineer', type: 'Full-time', location: 'Denver, CO' },
      { title: 'Technical Writer', type: 'Remote', location: 'Global' },
      { title: 'Summer Software Engineering Intern', type: 'Internship', location: 'Atlanta, GA' },
      { title: 'Product Manager', type: 'Full-time', location: 'San Francisco, CA' },
      { title: 'QA Tester', type: 'Part-time', location: 'Miami, FL' }
    ];

    const jobsToCreate = jobData.map((job, index) => ({
      title: job.title,
      company: `TechCorp ${index + 1}`,
      location: job.location,
      type: job.type,
      salary: '$50k - $150k',
      description: `This is a great ${job.type} opportunity for a ${job.title}.`,
      requirements: ['Skill 1', 'Skill 2', 'Skill 3'],
      responsibilities: ['Task 1', 'Task 2'],
      applicationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      recruiterId
    }));

    await Job.insertMany(jobsToCreate);

    console.log('✅ 15 Mock Jobs successfully created!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Failed:', err);
    process.exit(1);
  }
};

seedMoreJobs();
