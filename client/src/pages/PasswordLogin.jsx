import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { login } from '../assets/services/authService';
import { AuthContext } from '../context/AuthContext';
import styles from './PasswordLogin.module.css';

const PasswordLogin = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }
    
    setErrors({});

    setLoading(true);
    try {
      const response = await login(email, password);
      toast.success(response.message || 'Login successful!');
      
      // Store token and user info
      contextLogin(response.token, response.user);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (response.user.role === 'recruiter') {
        navigate('/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setErrors({ password: errorMsg });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={`${styles.formCard} ${shaking ? styles.shake : ''}`}>
          <div className={styles.header}>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
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

            {/* Password Field */}
            <div className={styles.formGroup}>
              <div className={styles.passwordHeader}>
                <label htmlFor="password">Password</label>
                <a href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>
              <div className={styles.passwordField}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={errors.password ? styles.inputError : ''}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>Don't have an account? <a href="/signup">Create one here</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PasswordLogin;
