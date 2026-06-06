import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.floatingText}>404</div>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.description}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/" className={styles.btnPrimary}>
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
