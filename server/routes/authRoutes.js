const express = require('express');
const router = express.Router();
const {
  signup,
  verifySignupOTP,
  login,
  forgotPasswordRequest,
  resetPassword,
  me,
  updateProfile,
  updatePassword,
  updateEmail,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// New user registration with OTP verification flow
router.post('/signup', signup);
router.post('/verify-signup-otp', verifySignupOTP);

// Existing user login - Password based (NO OTP)
router.post('/login', login);

// Password recovery flow
router.post('/forgot-password-request', forgotPasswordRequest);
router.post('/reset-password', resetPassword);

// Authenticated profile
router.get('/me', authMiddleware, me);

// Profile builder for candidates
router.put(
  '/profile',
  authMiddleware,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 },
  ]),
  updateProfile
);

router.put('/update-password', authMiddleware, updatePassword);
router.put('/update-email', authMiddleware, updateEmail);

module.exports = router;
