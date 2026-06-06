import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './About.module.css';

const About = () => {
  const navigate = useNavigate();
  const [hoverCard, setHoverCard] = useState(null);

  const handleJoin = () => {
    window.dispatchEvent(new Event('openGatekeeper'));
  };

  return (
    <>
      <Navbar />
      <main className={styles.aboutContainer}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>About Us</h1>
            <p className={styles.heroSubtitle}>
              Building the most intuitive, beautiful, and transparent hiring ecosystem in the world. 
              We're a team of passionate creators dedicated to solving the pain points of modern recruitment.
            </p>
          </div>
          <div className={styles.floatingCubeContainer}>
            <div className={styles.floatingCube}>
              <div className={`${styles.cubeFace} ${styles.front}`}>Trust</div>
              <div className={`${styles.cubeFace} ${styles.back}`}>Speed</div>
              <div className={`${styles.cubeFace} ${styles.right}`}>Scale</div>
              <div className={`${styles.cubeFace} ${styles.left}`}>Impact</div>
              <div className={`${styles.cubeFace} ${styles.top}`}></div>
              <div className={`${styles.cubeFace} ${styles.bottom}`}></div>
            </div>
          </div>
        </div>

        <section className={styles.detailsSection}>
          <div className={styles.perspectiveGrid}>
            
            <div 
              className={`${styles.aboutCard} ${hoverCard === 1 ? styles.cardHover : ''}`}
              onMouseEnter={() => setHoverCard(1)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <div className={styles.cardIcon}>🎯</div>
              <h2>Our Mission</h2>
              <p>
                To eliminate the "black hole" of job applications by providing candidates with real-time pipeline tracking, and empowering recruiters with lightning-fast screening tools.
              </p>
            </div>

            <div 
              className={`${styles.aboutCard} ${hoverCard === 2 ? styles.cardHover : ''}`}
              onMouseEnter={() => setHoverCard(2)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <div className={styles.cardIcon}>💡</div>
              <h2>Our Story</h2>
              <p>
                Born out of the frustration of broken hiring portals, Mini Job Portal was designed from the ground up to prioritize user experience, modern aesthetics, and seamless data flow.
              </p>
            </div>

            <div 
              className={`${styles.aboutCard} ${hoverCard === 3 ? styles.cardHover : ''}`}
              onMouseEnter={() => setHoverCard(3)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <div className={styles.cardIcon}>🤝</div>
              <h2>Our Values</h2>
              <p>
                Transparency, Speed, and Empathy. We believe that applying for a job should be an exciting moment, not an anxiety-inducing one.
              </p>
            </div>

          </div>
        </section>

        <section className={styles.impactSection}>
          <div className={styles.impactWrapper}>
            <h2>Our Impact by the Numbers</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <h3>50K+</h3>
                <p>Candidates Matched</p>
              </div>
              <div className={styles.statBox}>
                <h3>10K+</h3>
                <p>Active Recruiters</p>
              </div>
              <div className={styles.statBox}>
                <h3>99%</h3>
                <p>Faster Screening</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaWrapper}>
            <h2>Join the revolution today.</h2>
            <button className={styles.glowButton} onClick={handleJoin}>
              <span className={styles.glowText}>Create an Account</span>
              <div className={styles.glowEffect}></div>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
