import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: About */}
          <div className={styles.column}>
            <div className={styles.brand}>
              <span className={styles.brandIcon}>💼</span>
              <span className={styles.brandText}>SyncHire</span>
            </div>
            <p className={styles.description}>
              SyncHire connects talented candidates with top recruiters.
              Find your dream job or hire the perfect candidate — all in one
              streamlined platform.
            </p>
          </div>

          {/* Column 2: For Candidates */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>For Candidates</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/jobs" className={styles.link}>
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs" className={styles.link}>
                  Search Companies
                </Link>
              </li>
              <li>
                <Link to="/register" className={styles.link}>
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/jobs" className={styles.link}>
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Recruiters */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>For Recruiters</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/create-job" className={styles.link}>
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={styles.link}>
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className={styles.link}>
                  Sign Up as Recruiter
                </Link>
              </li>
              <li>
                <Link to="/jobs" className={styles.link}>
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Connect</h4>
            <ul className={styles.linkList}>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  ✕ Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  🔗 LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  ⌨ GitHub
                </a>
              </li>
              <li>
                <a href="mailto:support@synchire.com" className={styles.link}>
                  ✉ Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} SyncHire. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link to="/" className={styles.bottomLink}>
              Privacy Policy
            </Link>
            <span className={styles.bottomDot}>·</span>
            <Link to="/" className={styles.bottomLink}>
              Terms of Service
            </Link>
            <span className={styles.bottomDot}>·</span>
            <Link to="/" className={styles.bottomLink}>
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
