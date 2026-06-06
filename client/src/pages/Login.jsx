import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { loginRequest, forgotRequest, verifyOTP } from '../assets/services/authService';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);

  // ── View state machine ────────────────────────────────────
  // 'selection' → 'email' (login)  → 'otp'
  //             → 'forgot'         → 'otp'
  const [view, setView] = useState('selection');
  const [flowType, setFlowType] = useState('login'); // 'login' | 'forgot'

  // ── Form state ────────────────────────────────────────────
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef([]);
  const countdownRef = useRef(null);

  // If a role param arrives via URL, jump straight to the email form
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'recruiter' || roleParam === 'candidate') {
      setRole(roleParam);
      setFlowType('login');
      setView('email');
    }
  }, [searchParams]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── Helpers ───────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    setCountdown(60);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  // ── Selection handlers ────────────────────────────────────
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFlowType('login');
    setView('email');
  };

  const handleForgotClick = () => {
    setFlowType('forgot');
    setView('forgot');
  };

  // ── Send OTP (login path) ────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      triggerShake();
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const res = await loginRequest(email, role, name);
      toast.success(res.message || 'OTP sent to your email!');
      setView('otp');
      startCountdown();
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

  // ── Send OTP (forgot path) ───────────────────────────────
  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const res = await forgotRequest(email);
      toast.success(res.message || 'Recovery OTP sent!');
      setView('otp');
      startCountdown();
      setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send recovery code');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ───────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
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

  // ── Verify OTP (unified for both flows) ──────────────────
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
      const res = await verifyOTP(email, otpString, flowType);
      // res is the raw JSON: { success, flowType, token, user }
      const { token, user } = res;
      login(token, user);
      toast.success(flowType === 'forgot' ? 'Account recovered!' : 'Login successful!');
      if (user.role === 'recruiter') {
        navigate('/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      triggerShake();
      setOtp(['', '', '', '', '', '']);
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP (dispatches correct path) ─────────────────
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      if (flowType === 'login') {
        await loginRequest(email, role, name);
      } else {
        await forgotRequest(email);
      }
      toast.success('OTP resent!');
      startCountdown();
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Back-button logic per view ───────────────────────────
  const handleOtpBack = () => {
    setOtp(['', '', '', '', '', '']);
    setView(flowType === 'login' ? 'email' : 'forgot');
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Floating decorations */}
        <div className={styles.bgDecorations}>
          <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
          <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
          <div className={`${styles.floatingShape} ${styles.shape3}`}></div>
          <div className={`${styles.floatingShape} ${styles.shape4}`}></div>
        </div>

        {/* ── 1. Selection View ──────────────────────────── */}
        {view === 'selection' && (
          <div className={styles.selectionContainer}>
            <div className={styles.selectionHeader}>
              <span className={styles.selectionLogo}>💼</span>
              <h1 className={styles.selectionTitle}>Welcome to MJP</h1>
              <p className={styles.selectionSubtitle}>Choose how you want to continue</p>
            </div>

            <div className={styles.roleCards}>
              <div className={styles.roleCard} onClick={() => handleRoleSelect('recruiter')}>
                <div className={styles.roleIconWrap}>
                  <div className={styles.briefcaseSmall}>
                    <div className={styles.briefcaseSmallBody}>
                      <div className={styles.briefcaseSmallHandle}></div>
                    </div>
                  </div>
                </div>
                <h3 className={styles.roleTitle}>Recruiter</h3>
                <p className={styles.roleDesc}>Post jobs and find talent</p>
                <span className={styles.roleArrow}>→</span>
              </div>

              <div className={styles.roleCard} onClick={() => handleRoleSelect('candidate')}>
                <div className={styles.roleIconWrap}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="18" r="10" stroke="#008080" strokeWidth="3" fill="none" />
                    <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#008080" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className={styles.roleTitle}>Candidate</h3>
                <p className={styles.roleDesc}>Find your dream job</p>
                <span className={styles.roleArrow}>→</span>
              </div>
            </div>

            {/* Forgot Password link */}
            <button className={styles.forgotLink} onClick={handleForgotClick}>
              🔑 Forgot your password? Recover account
            </button>
          </div>
        )}

        {/* ── 2. Email View (Login flow) ────────────────── */}
        {view === 'email' && (
          <div className={styles.formOverlay}>
            <div className={`${styles.formCard} ${shaking ? styles.shake3D : ''}`}>
              <button className={styles.backBtn} onClick={() => setView('selection')}>
                ← Back
              </button>
              <div className={styles.formHeader}>
                <div className={styles.formRoleBadge}>
                  {role === 'recruiter' ? '💼' : '👤'} {role}
                </div>
                <h2 className={styles.formTitle}>Welcome!</h2>
                <p className={styles.formSubtitle}>Enter your details to continue</p>
              </div>

              <form onSubmit={handleSendOTP} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Full Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Email Address</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner}></span> : 'Send OTP'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── 3. Forgot View (Recovery flow) ────────────── */}
        {view === 'forgot' && (
          <div className={styles.formOverlay}>
            <div className={`${styles.formCard} ${shaking ? styles.shake3D : ''}`}>
              <button className={styles.backBtn} onClick={() => setView('selection')}>
                ← Back
              </button>
              <div className={styles.formHeader}>
                <div className={styles.otpIcon}>🔑</div>
                <h2 className={styles.formTitle}>Account Recovery</h2>
                <p className={styles.formSubtitle}>
                  Enter the email associated with your account and we'll send a recovery code.
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Email Address</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner}></span> : 'Send Recovery Code'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── 4. OTP View (Unified for BOTH flows) ──────── */}
        {view === 'otp' && (
          <div className={styles.formOverlay}>
            <div className={`${styles.formCard} ${shaking ? styles.shake3D : ''}`}>
              <button className={styles.backBtn} onClick={handleOtpBack}>
                ← Back
              </button>
              <div className={styles.formHeader}>
                <div className={styles.otpIcon}>✉</div>
                <h2 className={styles.formTitle}>Verify OTP</h2>
                <p className={styles.formSubtitle}>
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className={styles.form}>
                <div className={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className={`${styles.otpInput} ${digit ? styles.otpFilled : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span className={styles.spinner}></span>
                  ) : flowType === 'forgot' ? (
                    'Verify & Recover'
                  ) : (
                    'Verify & Login'
                  )}
                </button>

                <div className={styles.resendRow}>
                  {countdown > 0 ? (
                    <span className={styles.countdownText}>
                      Resend OTP in <strong>{countdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={styles.resendBtn}
                      onClick={handleResendOTP}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Login;
