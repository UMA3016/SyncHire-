import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { updatePassword, updateEmail } from '../assets/services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './Settings.module.css';

const Settings = () => {
  const { user, login } = useContext(AuthContext);

  const [activeForm, setActiveForm] = useState(null); // 'password' | 'email' | null
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [emailData, setEmailData] = useState({ newEmail: user?.email || '' });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password updated successfully!');
      setActiveForm(null);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateEmail(emailData.newEmail);
      toast.success('Email updated successfully!');
      
      // Update local storage context with new user data
      const token = localStorage.getItem('token');
      if (token && res.user) {
        login(token, res.user);
      }

      setActiveForm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconContainer}>🛠️</div>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>Manage your account preferences, security, and notifications.</p>
          
          <div className={styles.card}>
            
            {/* PASSWORD SECTION */}
            <div className={styles.settingRow}>
              <div>
                <h3>Change Password</h3>
                <p>Update your password to keep your account secure.</p>
              </div>
              <button 
                className={styles.btnSecondary} 
                onClick={() => setActiveForm(activeForm === 'password' ? null : 'password')}
              >
                {activeForm === 'password' ? 'Cancel' : 'Update'}
              </button>
            </div>
            
            {activeForm === 'password' && (
              <form className={styles.inlineForm} onSubmit={handlePasswordSubmit}>
                <div className={styles.formGroup}>
                  <label>Current Password</label>
                  <input 
                    type="password" required 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>New Password</label>
                  <input 
                    type="password" required minLength={6}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Password'}
                </button>
              </form>
            )}

            <div className={styles.divider}></div>
            
            {/* EMAIL SECTION */}
            <div className={styles.settingRow}>
              <div>
                <h3>Email Preferences</h3>
                <p>Manage what email you use to login and receive notifications. (Current: {user?.email})</p>
              </div>
              <button 
                className={styles.btnSecondary} 
                onClick={() => {
                  setActiveForm(activeForm === 'email' ? null : 'email');
                  setEmailData({ newEmail: user?.email || '' });
                }}
              >
                {activeForm === 'email' ? 'Cancel' : 'Manage'}
              </button>
            </div>

            {activeForm === 'email' && (
              <form className={styles.inlineForm} onSubmit={handleEmailSubmit}>
                <div className={styles.formGroup}>
                  <label>New Email Address</label>
                  <input 
                    type="email" required 
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})}
                  />
                </div>
                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Email'}
                </button>
              </form>
            )}

            <div className={styles.divider}></div>
            
            <div className={styles.settingRow}>
              <div>
                <h3 className={styles.dangerText}>Delete Account</h3>
                <p>Permanently remove your account and all data.</p>
              </div>
              <button className={styles.btnDanger} onClick={() => toast.info('Contact support to delete your account.')}>Delete</button>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Settings;
