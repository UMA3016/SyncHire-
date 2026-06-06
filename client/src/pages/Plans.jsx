import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './Plans.module.css';

const Plans = () => {
  const navigate = useNavigate();
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handleGetStarted = () => {
    navigate('/password-login?role=recruiter');
  };

  return (
    <>
      <Navbar />
      <main className={styles.plansContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Our Plans</h1>
          <p className={styles.subtitle}>
            Simple, transparent pricing built to scale with your hiring needs.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {/* Candidate Plan */}
          <div 
            className={`${styles.pricingCard} ${hoveredPlan === 1 ? styles.hovered : ''}`}
            onMouseEnter={() => setHoveredPlan(1)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div className={styles.cardHeader}>
              <span className={styles.badge}>For Candidates</span>
              <h2>Free Forever</h2>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>0<span className={styles.period}>/mo</span>
              </div>
            </div>
            <ul className={styles.featuresList}>
              <li>✅ Advanced Job Search</li>
              <li>✅ Real-time Application Tracking</li>
              <li>✅ Profile Builder</li>
              <li>✅ AI Job Recommendations</li>
            </ul>
            <button className={styles.actionBtn} onClick={() => navigate('/password-login?role=candidate')}>
              Join as Candidate
            </button>
          </div>

          {/* Recruiter Pro Plan */}
          <div 
            className={`${styles.pricingCard} ${styles.proCard} ${hoveredPlan === 2 ? styles.hovered : ''}`}
            onMouseEnter={() => setHoveredPlan(2)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div className={styles.cardHeader}>
              <span className={styles.badgePro}>Most Popular</span>
              <h2>Recruiter Pro</h2>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>49<span className={styles.period}>/mo</span>
              </div>
            </div>
            <ul className={styles.featuresList}>
              <li>✅ Unlimited Job Postings</li>
              <li>✅ Advanced Screening Hub</li>
              <li>✅ 1-Click Interview Scheduling</li>
              <li>✅ Export Applicant Data</li>
              <li>✅ Priority Support</li>
            </ul>
            <button className={styles.actionBtnPro} onClick={handleGetStarted}>
              Start Hiring Now
            </button>
          </div>

          {/* Enterprise Plan */}
          <div 
            className={`${styles.pricingCard} ${hoveredPlan === 3 ? styles.hovered : ''}`}
            onMouseEnter={() => setHoveredPlan(3)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div className={styles.cardHeader}>
              <span className={styles.badge}>For Teams</span>
              <h2>Enterprise</h2>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>199<span className={styles.period}>/mo</span>
              </div>
            </div>
            <ul className={styles.featuresList}>
              <li>✅ Everything in Pro</li>
              <li>✅ Multiple Recruiter Seats</li>
              <li>✅ Custom Branding</li>
              <li>✅ API Access</li>
              <li>✅ Dedicated Account Manager</li>
            </ul>
            <button className={styles.actionBtn} onClick={handleGetStarted}>
              Contact Sales
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Plans;
