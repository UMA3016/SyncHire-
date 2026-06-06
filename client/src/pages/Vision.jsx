import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './Vision.module.css';

const Vision = () => {
  const navigate = useNavigate();
  const [hoverCard, setHoverCard] = useState(null);

  const handleGetStarted = () => {
    window.dispatchEvent(new Event('openGatekeeper'));
  };

  return (
    <>
      <Navbar />
      <main className={styles.visionContainer}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Our Vision</h1>
            <p className={styles.heroSubtitle}>
              Revolutionizing the way talent meets opportunity through seamless, 3D immersive technology and intelligent matching.
            </p>
          </div>
          <div className={styles.floatingCubeContainer}>
            <div className={styles.floatingCube}>
              <div className={`${styles.cubeFace} ${styles.front}`}>Innovation</div>
              <div className={`${styles.cubeFace} ${styles.back}`}>Connection</div>
              <div className={`${styles.cubeFace} ${styles.right}`}>Growth</div>
              <div className={`${styles.cubeFace} ${styles.left}`}>Future</div>
              <div className={`${styles.cubeFace} ${styles.top}`}></div>
              <div className={`${styles.cubeFace} ${styles.bottom}`}></div>
            </div>
          </div>
        </div>

        <section className={styles.detailsSection}>
          <div className={styles.perspectiveGrid}>
            
            <div 
              className={`${styles.visionCard} ${hoverCard === 1 ? styles.cardHover : ''}`}
              onMouseEnter={() => setHoverCard(1)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <div className={styles.cardIcon}>👨‍🎓</div>
              <h2>For Candidates</h2>
              <p>
                We believe job hunting shouldn't feel like a black box. Our platform gives you complete transparency into your application pipeline, allowing you to track exactly where you stand.
              </p>
            </div>

            <div 
              className={`${styles.visionCard} ${hoverCard === 2 ? styles.cardHover : ''}`}
              onMouseEnter={() => setHoverCard(2)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <div className={styles.cardIcon}>🏢</div>
              <h2>For Recruiters</h2>
              <p>
                Say goodbye to scattered emails and messy spreadsheets. Our Screening Hub centralizes all applicants, allowing you to shortlist and schedule interviews with a single click.
              </p>
            </div>

            <div 
              className={`${styles.visionCard} ${hoverCard === 3 ? styles.cardHover : ''}`}
              onMouseEnter={() => setHoverCard(3)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <div className={styles.cardIcon}>🚀</div>
              <h2>The Ecosystem</h2>
              <p>
                By bridging the gap with real-time state synchronization, we ensure that when a recruiter moves a candidate forward, the candidate instantly sees the update. 
              </p>
            </div>

          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaWrapper}>
            <h2>Ready to experience the future of hiring?</h2>
            <button className={styles.glowButton} onClick={handleGetStarted}>
              <span className={styles.glowText}>Get Started Now</span>
              <div className={styles.glowEffect}></div>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Vision;
