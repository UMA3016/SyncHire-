import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './Notifications.module.css';

const Notifications = () => {
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.iconContainer}>🔔</div>
            <h1 className={styles.title}>Notifications</h1>
            <p className={styles.subtitle}>Stay updated on your applications and portal activity.</p>
          </div>
          
          <div className={styles.emptyState}>
            <div className={styles.bellIcon}>🔕</div>
            <h3>You're all caught up!</h3>
            <p>You have no new notifications at this time. We'll alert you when there's an update to your applications or jobs.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Notifications;
