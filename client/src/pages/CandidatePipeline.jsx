import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import API from '../assets/services/api';
import styles from './CandidatePipeline.module.css';

/* ── Constants ── */

const PIPELINE_STAGES = ['Applied', 'Shortlisted', 'Interview Call', 'Selected'];

const STATUS_TO_STAGE_INDEX = {
  Applied: 0,
  Shortlisted: 1,
  'Interview Call Received': 2,
  'Selection Confirmed': 3,
  Rejected: -1,
};

/* ── Helper: format date ── */

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/* ── Sub-components ── */

function StageNode({ state }) {
  const classMap = {
    completed: styles.stageNodeCompleted,
    current: styles.stageNodeCurrent,
    future: styles.stageNodeFuture,
  };

  return (
    <div className={`${styles.stageNode} ${classMap[state]}`}>
      {state === 'completed' ? (
        <span className={styles.checkmark}>✓</span>
      ) : state === 'current' ? (
        <span className={styles.checkmark}>●</span>
      ) : null}
    </div>
  );
}

function StageLine({ completed }) {
  return (
    <div
      className={`${styles.stageLine} ${
        completed ? styles.stageLineCompleted : styles.stageLineFuture
      }`}
    />
  );
}

function PipelineTimeline({ currentStageIndex }) {
  return (
    <div className={styles.timeline}>
      {PIPELINE_STAGES.map((stage, i) => {
        let state = 'future';
        if (i < currentStageIndex) state = 'completed';
        else if (i === currentStageIndex) state = 'current';

        const lineCompleted = i < currentStageIndex;
        const isLast = i === PIPELINE_STAGES.length - 1;

        return (
          <div className={styles.timelineStage} key={stage}>
            <div className={styles.stageRow}>
              <StageNode state={state} />
              {!isLast && <StageLine completed={lineCompleted} />}
            </div>
            <span
              className={`${styles.stageLabel} ${
                state !== 'future' ? styles.stageLabelActive : ''
              }`}
            >
              {stage}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RejectedBadge() {
  return (
    <div className={styles.rejectedContainer}>
      <div className={styles.rejectedBadge}>
        <span>✕</span> Application Rejected
      </div>
    </div>
  );
}

function ApplicationCard({ application, index }) {
  const stageIndex = STATUS_TO_STAGE_INDEX[application.status] ?? 0;
  const isRejected = application.status === 'Rejected';

  return (
    <div
      className={`${styles.applicationCard} ${
        isRejected ? styles.applicationCardRejected : ''
      }`}
      style={{ animationDelay: `${0.12 + index * 0.06}s` }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          <h3 className={styles.jobTitle}>{application.title}</h3>
          <p className={styles.companyName}>{application.companyName}</p>
        </div>
        <span className={styles.appliedDate}>
          Applied {formatDate(application.appliedAt)}
        </span>
      </div>

      {isRejected ? (
        <RejectedBadge />
      ) : (
        <PipelineTimeline currentStageIndex={stageIndex} />
      )}

      {application.status === 'Interview Call Received' && application.interviewDate && (
        <div className={styles.interviewDetails}>
          <div className={styles.interviewHeader}>
            <span className={styles.interviewIcon}>📅</span>
            <h4>Interview Scheduled</h4>
          </div>
          <div className={styles.interviewGrid}>
            <div className={styles.interviewItem}>
              <span className={styles.itemLabel}>Date</span>
              <span className={styles.itemValue}>{application.interviewDate}</span>
            </div>
            <div className={styles.interviewItem}>
              <span className={styles.itemLabel}>Time</span>
              <span className={styles.itemValue}>{application.interviewTime}</span>
            </div>
            <div className={styles.interviewItem}>
              <span className={styles.itemLabel}>Meeting Link</span>
              <a href={application.interviewLink} target="_blank" rel="noopener noreferrer" className={styles.joinLink}>
                Join Meeting
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}

/* ── Main Component ── */

export default function CandidatePipeline() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/auth/me');
      if (data.success && data.user) {
        setApplications(data.user.appliedJobs || []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Unable to load your applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ── Compute stats ── */
  const totalApplied = applications.length;
  const shortlisted = applications.filter(
    (a) => a.status === 'Shortlisted'
  ).length;
  const interviewCalls = applications.filter(
    (a) => a.status === 'Interview Call Received'
  ).length;
  const selected = applications.filter(
    (a) => a.status === 'Selection Confirmed'
  ).length;

  /* ── Render ── */
  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.container}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            My Application{' '}
            <span className={styles.pageTitleAccent}>Pipeline</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Track every stage of your job applications — from Applied to
            Selected — all in one place.
          </p>
        </header>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader message="Fetching your applications…" />
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <span className={styles.errorEmoji}>⚠️</span>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorSubtitle}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={fetchApplications}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>📭</span>
            <h2 className={styles.emptyTitle}>No Applications Yet</h2>
            <p className={styles.emptySubtitle}>
              You haven't applied to any jobs yet. Browse open positions and
              take the first step toward your career!
            </p>
            <button
              className={styles.emptyButton}
              onClick={() => navigate('/jobs')}
              type="button"
            >
              🔍 Browse Jobs
            </button>
          </div>
        ) : (
          <>
            {/* Summary Stat Cards */}
            <div className={styles.statsGrid}>
              <StatCard icon="📄" value={totalApplied} label="Total Applied" />
              <StatCard icon="⭐" value={shortlisted} label="Shortlisted" />
              <StatCard
                icon="📞"
                value={interviewCalls}
                label="Interview Calls"
              />
              <StatCard icon="🎉" value={selected} label="Selected" />
            </div>

            {/* Applications List */}
            <p className={styles.sectionLabel}>Your Applications</p>
            <div className={styles.applicationsList}>
              {applications.map((app, idx) => (
                <ApplicationCard
                  key={app._id || idx}
                  application={app}
                  index={idx}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
