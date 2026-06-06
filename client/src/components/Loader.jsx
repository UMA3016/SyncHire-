import styles from './Loader.module.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinnerWrapper}>
        {/* Pulsing outer ring */}
        <svg
          className={styles.pulseRing}
          width="64"
          height="64"
          viewBox="0 0 64 64"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#e6f2f2"
            strokeWidth="3"
          />
        </svg>

        {/* Spinning arc */}
        <svg
          className={styles.spinner}
          width="64"
          height="64"
          viewBox="0 0 64 64"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#008080"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="120 60"
          />
        </svg>
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Loader;
