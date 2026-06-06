const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const User = require('../models/User');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding...');

    // Need a dummy recruiter to own the jobs
    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'System Admin',
        email: 'admin@minijobportal.com',
        role: 'recruiter',
      });
      console.log('Created dummy recruiter.');
    }

    const jobs = [
      {
        title: 'Software Engineer',
        company: 'Acme Corp',
        location: 'Bangalore',
        type: 'Full-time',
        salary: '₹12,00,000 - ₹15,00,000 PA',
        description: 'Design and build high-performance distributed systems using Node.js, React, and MongoDB. You will lead small engineering pods and scale our microservices architecture.',
        recruiterId: recruiter._id,
        status: 'Active',
      },
      {
        title: 'Frontend Developer',
        company: 'TechNexus',
        location: 'Hyderabad',
        type: 'Part-time',
        salary: '₹6,00,000 - ₹8,00,000 PA',
        description: 'Craft stunning, interactive web applications using React Hooks and CSS Modules. We focus on modern 3D designs and micro-animations to wow our users.',
        recruiterId: recruiter._id,
        status: 'Active',
      },
      {
        title: 'MERN Stack Intern',
        company: 'InnovateLabs',
        location: 'Remote',
        type: 'Internship',
        salary: '₹4,00,000 PA',
        description: 'Join our fully remote incubator. You will learn the ropes of full-stack engineering, from MongoDB schemas to Express routing and React view rendering.',
        recruiterId: recruiter._id,
        status: 'Active',
      },
      {
        title: 'Data Analyst',
        company: 'AlphaAnalytics',
        location: 'Mumbai',
        type: 'Full-time',
        salary: '₹9,00,000 - ₹11,00,000 PA',
        description: 'Uncover patterns in massive datasets. You will write complex SQL aggregations and build Python pipelines to fuel our business intelligence dashboards.',
        recruiterId: recruiter._id,
        status: 'Active',
      },
    ];

    // Clear existing jobs to prevent duplicates during multiple seeds
    await Job.deleteMany({});
    console.log('Cleared existing jobs.');

    await Job.insertMany(jobs);
    console.log('✅ Successfully seeded 4 realistic technical positions.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
