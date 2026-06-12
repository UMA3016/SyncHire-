import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { forgotPasswordRequest, resetPassword } from '../assets/services/authService';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // ── View state machine ──
  const [view, setView] = useState('email'); // 'email' | 'otp' | 'reset'

  // ── Form state ──
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const otpRefs = useRef([]);

  // ── Helpers ──
  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  // ── Step 1: Request Password Reset OTP ──
  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      triggerShake();
      return;
    }
    
    setErrors({});

    setLoading(true);
    try {
      const response = await forgotPasswordRequest(email);
      toast.success(response.message || 'OTP sent to your email');
      setView('otp');
      setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP and Move to Password Reset ──
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' });
      triggerShake();
      return;
    }
    
    setErrors({});

    setLoading(true);
    try {
      // Just verify the OTP exists - actual reset happens on next step
      setView('reset');
    } catch (err) {
      toast.error('OTP verification failed');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    const newErrors = {};

    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }
    
    setErrors({});

    setLoading(true);
    try {
      const response = await resetPassword(email, otpString, newPassword, confirmPassword);
      toast.success(response.message || 'Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
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

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={`${styles.formCard} ${shaking ? styles.shake : ''}`}>
          {view === 'email' && (
            <>
              <div className={styles.header}>
                <h2>Forgot Password?</h2>
                <p>Enter your email to receive a password reset code</p>
              </div>

              <form onSubmit={handleRequestOTP}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={errors.email ? styles.inputError : ''}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {view === 'otp' && (
            <>
              <div className={styles.header}>
                <h2>Verify Your Email</h2>
                <p>Enter the 6-digit code sent to {email}</p>
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
                      onChange={(e) => {
                        handleOtpChange(index, e.target.value);
                        if (errors.otp) setErrors({});
                      }}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`${styles.otpInput} ${errors.otp ? styles.inputError : ''}`}
                    />
                  ))}
                </div>
                {errors.otp && <span className={styles.errorText} style={{ textAlign: 'center', marginBottom: '16px' }}>{errors.otp}</span>}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>

              <button
                type="button"
                className={styles.backBtn}
                onClick={() => {
                  setView('email');
                  setOtp(['', '', '', '', '', '']);
                }}
              >
                Back to Email Entry
              </button>
            </>
          )}

          {view === 'reset' && (
            <>
              <div className={styles.header}>
                <h2>Create New Password</h2>
                <p>Enter your new password</p>
              </div>

              <form onSubmit={handleResetPassword}>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <div className={styles.passwordField}>
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                      }}
                      className={errors.newPassword ? styles.inputError : ''}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.newPassword && <span className={styles.errorText}>{errors.newPassword}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={styles.passwordField}>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      className={errors.confirmPassword ? styles.inputError : ''}
                    />
                  </div>
                  {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>

              <button
                type="button"
                className={styles.backBtn}
                onClick={() => {
                  setView('otp');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                Back to OTP Verification
              </button>
            </>
          )}

          <div className={styles.footer}>
            <p>Remember your password? <a href="/login">Sign in here</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
