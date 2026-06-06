const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../.env' });

const User = require('../models/User');

const restoreData = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini-job-portal');
    console.log('✅ Connected to Database.');
    
    const hashedPassword = await bcrypt.hash('Umasri@3016', 10);

    // 1. Create Candidate
    console.log('👥 Restoring Candidate...');
    
    // Check if exists
    const candidateExists = await User.findOne({ email: 'umasriguttikonda@gmail.com' });
    if (!candidateExists) {
        await User.create({
            name: 'Umasri',
            email: 'umasriguttikonda@gmail.com',
            phone: '000-000-0000',
            password: hashedPassword,
            role: 'candidate',
            isVerified: true,
            skills: ['React', 'JavaScript', 'Node.js'],
        });
        console.log('✅ Restored Candidate: umasriguttikonda@gmail.com');
    } else {
        console.log('Candidate already exists.');
    }

    // 2. Create Recruiter
    console.log('👥 Restoring Recruiter...');
    const recruiterExists = await User.findOne({ email: 'guthikondaprasad7@gmail.com' });
    if (!recruiterExists) {
        await User.create({
            name: 'Prasad',
            email: 'guthikondaprasad7@gmail.com',
            phone: '000-000-0000',
            password: hashedPassword,
            role: 'recruiter',
            isVerified: true,
            companySize: '1-10',
            companyWebsite: 'https://example.com',
            companyDescription: 'Recruiting top talent.',
        });
        console.log('✅ Restored Recruiter: guthikondaprasad7@gmail.com');
    } else {
        console.log('Recruiter already exists.');
    }

    console.log('\n=======================================');
    console.log('🎉 RESTORE COMPLETE! You can now login:');
    console.log('CANDIDATE: umasriguttikonda@gmail.com / Umasri@3016');
    console.log('RECRUITER: guthikondaprasad7@gmail.com / Umasri@3016');
    console.log('=======================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ RESTORE FAILED:', error);
    process.exit(1);
  }
};

restoreData();
