import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [hoveredSide, setHoveredSide] = useState(null);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Floating background decorations */}
        <div className={styles.bgDecorations}>
          <div className={`${styles.floatingCircle} ${styles.circle1}`}></div>
          <div className={`${styles.floatingCircle} ${styles.circle2}`}></div>
          <div className={`${styles.floatingCircle} ${styles.circle3}`}></div>
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroHeader}>
            <div className={styles.heroLogo}>
              <img src="/logo.svg" alt="SyncHire Logo" className={styles.logoImage} />
              <span className={styles.logoText}>SyncHire</span>
            </div>
            <h1 className={styles.heroHeadline}>The Intelligent Way to Hire and Get Hired</h1>
            <p className={styles.heroTagline}>
              Experience a seamless, 3D immersive platform that connects world-class talent with leading organizations instantly.
            </p>
          </div>

          <div className={styles.splitContainer}>
            {/* Candidate Side */}
            <div
              className={`${styles.splitPanel} ${styles.candidatePanel} ${
                hoveredSide === 'candidate' ? styles.panelActive : ''
              } ${hoveredSide === 'recruiter' ? styles.panelInactive : ''}`}
              onMouseEnter={() => setHoveredSide('candidate')}
              onMouseLeave={() => setHoveredSide(null)}
              onClick={() => handleNavigate('/password-login?role=candidate')}
            >
              <div className={styles.panelContent}>
                <div className={styles.icon3d}>🚀</div>
                <h2 className={styles.panelTitle}>For Candidates</h2>
                <h3 className={styles.panelHeading}>Find Your Dream Job</h3>
                <p className={styles.panelDescription}>
                  Build your master profile once. Explore thousands of mock jobs across tech, and track your application pipeline in real-time.
                </p>
                <button className={styles.actionBtn}>Enter Candidate Portal</button>
              </div>
              <div className={styles.panelOverlay}></div>
            </div>

            {/* Recruiter Side */}
            <div
              className={`${styles.splitPanel} ${styles.recruiterPanel} ${
                hoveredSide === 'recruiter' ? styles.panelActive : ''
              } ${hoveredSide === 'candidate' ? styles.panelInactive : ''}`}
              onMouseEnter={() => setHoveredSide('recruiter')}
              onMouseLeave={() => setHoveredSide(null)}
              onClick={() => handleNavigate('/password-login?role=recruiter')}
            >
              <div className={styles.panelContent}>
                <div className={styles.icon3d}>🏢</div>
                <h2 className={styles.panelTitle}>For Recruiters</h2>
                <h3 className={styles.panelHeading}>Streamline Hiring</h3>
                <p className={styles.panelDescription}>
                  Post your openings, manage portfolios, and screen candidates through our unified applicant tracking hub.
                </p>
                <button className={styles.actionBtnRecruiter}>Enter Recruiter Hub</button>
              </div>
              <div className={styles.panelOverlay}></div>
            </div>
          </div>
        </section>
        
        {/* Descriptive Platform Section */}
        <section className={styles.platformOverview}>
          <div className={styles.overviewHeader}>
            <h2>Why Choose Our Portal?</h2>
            <p>We've engineered the perfect ecosystem to bridge the gap between talent and opportunity.</p>
          </div>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <div className={styles.cardIcon}>⚡</div>
              <h3>Real-Time Sync</h3>
              <p>When a recruiter updates your status, you see it instantly on your candidate pipeline timeline.</p>
            </div>
            <div className={styles.overviewCard}>
              <div className={styles.cardIcon}>🎨</div>
              <h3>Immersive 3D UI</h3>
              <p>Navigate a stunning, glassmorphic environment built entirely with modern Vanilla CSS architecture.</p>
            </div>
            <div className={styles.overviewCard}>
              <div className={styles.cardIcon}>📊</div>
              <h3>Rich Ecosystem</h3>
              <p>Start instantly with over 50+ dynamically seeded mock jobs and realistic candidate profiles.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
