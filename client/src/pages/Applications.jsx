import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById } from '../assets/services/jobService';
import { getApplicationsByJob, updateApplicationStatus } from '../assets/services/applicationService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './Applications.module.css';

const STATUS_LIST = ['Applied', 'Shortlisted', 'Interview Call Received', 'Selection Confirmed', 'Rejected'];

const FILTER_TABS = [
  { key: 'All', label: 'All' },
  { key: 'Applied', label: 'Applied' },
  { key: 'Shortlisted', label: 'Shortlisted' },
  { key: 'Interview Call Received', label: 'Interview' },
  { key: 'Selection Confirmed', label: 'Selected' },
  { key: 'Rejected', label: 'Rejected' },
];

const statusColorMap = {
  'Applied': styles.statusApplied,
  'Shortlisted': styles.statusShortlisted,
  'Interview Call Received': styles.statusInterview,
  'Selection Confirmed': styles.statusSelected,
  'Rejected': styles.statusRejected,
};

function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function Applications() {
  const { id: jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  // Interview Modal State
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [schedulingAppId, setSchedulingAppId] = useState(null);
  const [interviewData, setInterviewData] = useState({ date: '', time: '', link: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [jobRes, appsRes] = await Promise.all([
          getJobById(jobId),
          getApplicationsByJob(jobId),
        ]);
        setJob(jobRes.data);
        const appsList = Array.isArray(appsRes) ? appsRes : appsRes.data || [];
        setApplications(appsList);
      } catch (err) {
        toast.error('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus, extraData = {}) => {
    try {
      setUpdatingId(applicationId);
      const resData = await updateApplicationStatus(applicationId, newStatus, extraData);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus, ...extraData } : app
        )
      );
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const submitInterviewSchedule = async (e) => {
    e.preventDefault();
    if (!interviewData.date || !interviewData.time || !interviewData.link) {
      return toast.error("Please fill all interview fields");
    }
    await handleStatusChange(schedulingAppId, 'Interview Call Received', {
      interviewDate: interviewData.date,
      interviewTime: interviewData.time,
      interviewLink: interviewData.link
    });
    setInterviewModalOpen(false);
    setSchedulingAppId(null);
  };

  const filteredApps =
    activeFilter === 'All'
      ? applications
      : applications.filter((app) => app.status === activeFilter);

  const statusSummary = STATUS_LIST.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  const renderActionButtons = (app) => {
    if (updatingId === app._id) {
      return <span className={styles.updatingText}>Updating…</span>;
    }

    switch (app.status) {
      case 'Applied':
        return (
          <>
            <button
              className={styles.actionBtnPositive}
              onClick={() => handleStatusChange(app._id, 'Shortlisted')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              Shortlist
            </button>
            <button
              className={styles.actionBtnReject}
              onClick={() => handleStatusChange(app._id, 'Rejected')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Reject
            </button>
          </>
        );
      case 'Shortlisted':
        return (
          <>
            <button
              className={styles.actionBtnPositive}
              onClick={() => {
                setSchedulingAppId(app._id);
                setInterviewData({ date: '', time: '', link: '' });
                setInterviewModalOpen(true);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Schedule Interview
            </button>
            <button
              className={styles.actionBtnReject}
              onClick={() => handleStatusChange(app._id, 'Rejected')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Reject
            </button>
          </>
        );
      case 'Interview Call Received':
        return (
          <>
            <button
              className={styles.actionBtnPositive}
              onClick={() => handleStatusChange(app._id, 'Selection Confirmed')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
              Select
            </button>
            <button
              className={styles.actionBtnReject}
              onClick={() => handleStatusChange(app._id, 'Rejected')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Reject
            </button>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loaderWrap}><Loader /></div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Link to="/dashboard" className={styles.backLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to Dashboard
        </Link>

        {job && (
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.jobTitle}>{job.title}</h1>
              <div className={styles.jobMeta}>
                <span className={styles.metaItem}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                  {job.company}
                </span>
                {job.location && (
                  <span className={styles.metaItem}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {job.location}
                  </span>
                )}
                {job.type && (
                  <span className={styles.metaItem}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {job.type}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.totalBadge}>
                <span className={styles.totalCount}>{applications.length}</span>
                <span className={styles.totalLabel}>Total Applicants</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.statusSummaryRow}>
          {STATUS_LIST.map((s) => (
            <div key={s} className={styles.summaryChip}>
              <span className={`${styles.summaryDot} ${statusColorMap[s] || ''}`} />
              <span className={styles.summaryLabel}>{s}</span>
              <span className={styles.summaryValue}>{statusSummary[s]}</span>
            </div>
          ))}
        </div>

        <div className={styles.filterRow}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.filterTab} ${activeFilter === tab.key ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
              {tab.key !== 'All' && (
                <span className={styles.filterCount}>
                  {tab.key === 'All' ? applications.length : applications.filter((a) => a.status === tab.key).length}
                </span>
              )}
              {tab.key === 'All' && (
                <span className={styles.filterCount}>{applications.length}</span>
              )}
            </button>
          ))}
        </div>

        {filteredApps.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#008080" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <h3 className={styles.emptyTitle}>No Applications Found</h3>
            <p className={styles.emptySubtext}>
              {activeFilter === 'All'
                ? 'No candidates have applied for this position yet.'
                : `No candidates with "${activeFilter}" status.`}
            </p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {filteredApps.map((app, idx) => (
              <div
                key={app._id}
                className={styles.card}
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.avatarSection}>
                    {app.profilePicture ? (
                      <img
                        src={app.profilePicture}
                        alt={app.name}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarFallback}>
                        {getInitial(app.name)}
                      </div>
                    )}
                    <div className={styles.nameBlock}>
                      <h3 className={styles.candidateName}>{app.name}</h3>
                      <span className={`${styles.statusBadge} ${statusColorMap[app.status] || ''}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.appliedDate}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    {formatDate(app.appliedAt)}
                  </div>
                </div>

                <div className={styles.contactRow}>
                  <a href={`mailto:${app.email}`} className={styles.contactItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    {app.email}
                  </a>
                  {app.phone && (
                    <a href={`tel:${app.phone}`} className={styles.contactItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                      {app.phone}
                    </a>
                  )}
                </div>

                {app.skills && app.skills.length > 0 && (
                  <div className={styles.skillsSection}>
                    <span className={styles.sectionLabel}>Skills</span>
                    <div className={styles.skillsList}>
                      {app.skills.map((skill, i) => (
                        <span key={i} className={styles.skillPill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {app.qualification && app.qualification.length > 0 && (
                  <div className={styles.qualSection}>
                    <span className={styles.sectionLabel}>Qualifications</span>
                    <ul className={styles.qualList}>
                      {app.qualification.map((q, i) => (
                        <li key={i} className={styles.qualItem}>
                          <span className={styles.qualDegree}>{q.degree}</span>
                          {q.institution && (
                            <span className={styles.qualInst}> — {q.institution}</span>
                          )}
                          {q.year && (
                            <span className={styles.qualYear}> ({q.year})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.cardFooter}>
                  {app.resumePath && (
                    <a
                      href={`http://localhost:5000/${app.resumePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resumeLink}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Download Resume
                    </a>
                  )}
                  <div className={styles.actionRow}>
                    {renderActionButtons(app)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INTERVIEW SCHEDULE MODAL */}
      {interviewModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Schedule Interview</h2>
            <p>Provide the details for the upcoming interview.</p>
            <form onSubmit={submitInterviewSchedule} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input 
                  type="date" 
                  required 
                  value={interviewData.date}
                  onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Time</label>
                <input 
                  type="time" 
                  required 
                  value={interviewData.time}
                  onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Meeting Link</label>
                <input 
                  type="url" 
                  placeholder="https://zoom.us/j/12345" 
                  required 
                  value={interviewData.link}
                  onChange={(e) => setInterviewData({...interviewData, link: e.target.value})}
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.btnSecondary} 
                  onClick={() => setInterviewModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Applications;
