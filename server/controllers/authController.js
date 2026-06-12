const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendOTPEmail = require('../utils/sendOTPEmailService');

// ── JWT helper ──────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// ── Generate OTP for signup & password recovery ──
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ── Send OTP Email ──
const sendOTPEmailHelper = async (email, otp) => {
  console.log('\n========================================');
  console.log(`🔐 DEVELOPMENT OTP CODE : ${otp}`);
  console.log(`📧 Recipient            : ${email}`);
  console.log('========================================\n');

  try {
    await sendOTPEmail(email, otp);
  } catch (err) {
    console.error('⚠️  Brevo SDK Error:', err.message || err);
    if (err.body) {
      console.error('📋 Brevo rejection payload:', JSON.stringify(err.body, null, 2));
    }
    console.log('💡 TIP: Use the DEVELOPMENT OTP CODE printed above to continue.\n');
  }
};

// ─────────────────────────────────────────────────────────────
// 1. POST /api/auth/signup
// New User Registration - Creates account and sends OTP
// ─────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isVerified: false,
      otpCode: otp,
      otpExpires,
    });

    await newUser.save();

    // Send OTP email
    await sendOTPEmailHelper(email, otp);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Verification OTP sent to your email.',
      email: newUser.email,
    });
  } catch (error) {
    console.error('signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// 2. POST /api/auth/verify-signup-otp
// Verify signup OTP and activate account
// ─────────────────────────────────────────────────────────────
exports.verifySignupOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ message: 'Email and OTP code are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Account verified successfully! You can now log in.',
    });
  } catch (error) {
    console.error('verifySignupOTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// 3. POST /api/auth/login
// Traditional Login - Email + Password (NO OTP)
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Account email has not been verified yet' });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// 4. POST /api/auth/forgot-password-request
// Send OTP for password recovery
// ─────────────────────────────────────────────────────────────
exports.forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await sendOTPEmailHelper(email, otp);

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
      email: user.email,
    });
  } catch (error) {
    console.error('forgotPasswordRequest error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// 5. POST /api/auth/reset-password
// Reset password with OTP verification
// ─────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword, confirmPassword } = req.body;

    if (!email || !otpCode || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// Returns the currently authenticated user's profile
// ─────────────────────────────────────────────────────────────
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        qualification: user.qualification,
        skills: user.skills,
        resumeFile: user.resumeFile,
        companySize: user.companySize,
        companyWebsite: user.companyWebsite,
        companyDescription: user.companyDescription,
        appliedJobs: user.appliedJobs || [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/auth/profile
// Updates the candidate profile (Profile Builder)
// ─────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.skills) {
      user.skills = JSON.parse(req.body.skills);
    }
    
    if (req.body.qualification) {
      user.qualification = JSON.parse(req.body.qualification);
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.companySize) user.companySize = req.body.companySize;
    if (req.body.companyWebsite) user.companyWebsite = req.body.companyWebsite;
    if (req.body.companyDescription) user.companyDescription = req.body.companyDescription;

    if (req.files) {
      if (req.files.profilePicture) {
        user.profilePicture = req.files.profilePicture[0].path.replace(/\\/g, '/');
      }
      if (req.files.resumeFile) {
        user.resumeFile = req.files.resumeFile[0].path.replace(/\\/g, '/');
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        qualification: user.qualification,
        skills: user.skills,
        resumeFile: user.resumeFile,
        companySize: user.companySize,
        companyWebsite: user.companyWebsite,
        companyDescription: user.companyDescription,
      },
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/auth/update-password
// Updates the user's password
// ─────────────────────────────────────────────────────────────
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/auth/update-email
// Updates the user's email
// ─────────────────────────────────────────────────────────────
exports.updateEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) {
      return res.status(400).json({ message: 'New email is required' });
    }

    const existing = await User.findOne({ email: newEmail.toLowerCase() });
    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Email is already in use by another account' });
    }

    const user = await User.findById(req.user._id);
    user.email = newEmail.toLowerCase();
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Email updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
