require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected.');

    const adminEmail = 'admin@synchire.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin account already exists.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    await adminUser.save();
    console.log('Admin account created successfully.');
    console.log('Email: admin@synchire.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
