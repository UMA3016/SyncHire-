import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { signup, verifySignupOTP } from '../assets/services/authService';
import { AuthContext } from '../context/AuthContext';
import styles from './SignUp.module.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ── View state machine ──
  const [view, setView] = useState('registration'); // 'registration' | 'otp'

  // ── Form state ──
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const otpRefs = useRef([]);

  // ── Helpers ──
  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  // ── Handle Registration Submission ──
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      triggerShake();
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      triggerShake();
      return;
    }

    if (!phone.trim() || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      triggerShake();
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      triggerShake();
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const response = await signup(name, email, phone, password, confirmPassword, role);
      toast.success(response.message || 'Registration successful! Verify your email.');
      setView('otp');
      setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── Handle OTP Change ──
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + digits.length, 5);
      if (otpRefs.current[nextIdx]) otpRefs.current[nextIdx].focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // ── Handle OTP Verification ──
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const response = await verifySignupOTP(email, otpString);
      toast.success(response.message || 'Email verified successfully!');
      
      // Auto-login user after verification
      const token = 'verified'; // Placeholder, you'll need to generate actual token
      login(token, { email, name, role });
      
      toast.info('Please log in with your credentials');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
      triggerShake();
      setOtp(['', '', '', '', '', '']);
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.signupContainer}>
        {view === 'registration' ? (
          <div className={`${styles.formCard} ${shaking ? styles.shake : ''}`}>
            <div className={styles.header}>
              <h2>Create Your Account</h2>
              <p>Join our job portal and start your career journey</p>
            </div>

            <form onSubmit={handleSignUp}>
              {/* Role Selection */}
              <div className={styles.roleSelector}>
                <label>I am a</label>
                <div className={styles.roleButtons}>
                  <button
                    type="button"
                    className={`${styles.roleBtn} ${role === 'candidate' ? styles.activeRole : ''}`}
                    onClick={() => setRole('candidate')}
                  >
                    Candidate
                  </button>
                  <button
                    type="button"
                    className={`${styles.roleBtn} ${role === 'recruiter' ? styles.activeRole : ''}`}
                    onClick={() => setRole('recruiter')}
                  >
                    Recruiter
                  </button>
                </div>
              </div>

              {/* Name Field */}
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone Field */}
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password Field */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className={styles.footer}>
              <p>Already have an account? <a href="/login">Log in here</a></p>
            </div>
          </div>
        ) : (
          <div className={`${styles.formCard} ${shaking ? styles.shake : ''}`}>
            <div className={styles.header}>
              <h2>Verify Your Email</h2>
              <p>Enter the 6-digit OTP sent to {email}</p>
            </div>

            <form onSubmit={handleVerifyOTP}>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={styles.otpInput}
                  />
                ))}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <button
              type="button"
              className={styles.backBtn}
              onClick={() => setView('registration')}
            >
              Back to Registration
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
