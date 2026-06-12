import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './AdminProfile.module.css';

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Admin Profile</h2>
            <p>System Administrator Account</p>
          </div>
          
          <div className={styles.profileDetails}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarPlaceholder}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
            
            <div className={styles.infoSection}>
              <div className={styles.infoGroup}>
                <label>Full Name</label>
                <div className={styles.infoValue}>{user?.name}</div>
              </div>
              <div className={styles.infoGroup}>
                <label>Email Address</label>
                <div className={styles.infoValue}>{user?.email}</div>
              </div>
              <div className={styles.infoGroup}>
                <label>Role</label>
                <div className={styles.roleBadge}>System Administrator</div>
              </div>
            </div>
          </div>
          
          <div className={styles.noteBox}>
            <strong>Note:</strong> Admin credentials and profile details can only be modified through direct database access for security reasons.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminProfile;
