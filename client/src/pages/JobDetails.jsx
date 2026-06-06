import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getJobById, deleteJob } from '../assets/services/jobService';
import { applyForJob } from '../assets/services/applicationService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './JobDetails.module.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchUser } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (!user.resumeFile) {
      toast.warn('Please complete your Profile Builder first');
      navigate('/profile-builder');
      return;
    }

    try {
      await applyForJob(id);
      await fetchUser(); // Refresh user context instantly
      toast.success('One-Click Application submitted successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.loaderContainer}><Loader message="Loading job details..." /></main>
        <Footer />
      </>
    );
  }

  if (!job) return null;

  const isOwner = user?.role === 'recruiter' && job.recruiterId === user.id;
  const isExpired = new Date() > new Date(job.applicationEndDate);

  const calculateDaysLeft = (endDate) => {
    const diffTime = new Date(endDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const daysLeft = calculateDaysLeft(job.applicationEndDate);

  const userApplication = user?.appliedJobs?.find((app) => app.jobId === id);
  const hasApplied = !!userApplication;

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.headerBanner}></div>
        
        <div className={styles.contentWrapper}>
          {/* Main Content */}
          <div className={styles.mainCol}>
            <div className={styles.jobHeader}>
              <div className={styles.companyLogo}>
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div className={styles.titleArea}>
                <h1 className={styles.title}>{job.title}</h1>
                <div className={styles.metaRow}>
                  <span className={styles.company}>{job.company}</span>
                  <span className={styles.location}>📍 {job.location}</span>
                  <span className={styles.postedDate}>
                    Posted: {new Date(job.applicationStartDate).toLocaleDateString()}
                  </span>
                  <span className={styles.deadlineDate}>
                    Deadline: {new Date(job.applicationEndDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.badges}>
              <span className={styles.badgeType}>{job.type}</span>
              <span className={styles.badgeSalary}>💰 {job.salary}</span>
            </div>

            <div className={styles.descriptionSection}>
              <h2>About the role</h2>
              <div className={styles.descriptionText}>
                {job.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sideCol}>
            <div className={styles.actionCard}>
              {isOwner ? (
                <>
                  <Link to={`/edit-job/${id}`} className={styles.btnSecondary}>
                    Edit Job
                  </Link>
                  <Link to={`/applications/${id}`} className={styles.btnSecondary}>
                    View Applications
                  </Link>
                  <button onClick={handleDelete} className={styles.btnDanger}>
                    Delete Job
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`${styles.btnPrimary} ${!isExpired && !hasApplied ? styles.pulseGlow : ''}`}
                    onClick={handleApply}
                    disabled={isExpired || hasApplied}
                    style={(isExpired || hasApplied) ? { background: '#94a3b8', cursor: 'not-allowed', boxShadow: 'none' } : {}}
                  >
                    {hasApplied ? `Status: ${userApplication.status}` : isExpired ? 'Applications Closed' : '1-Click Apply ⚡'}
                  </button>
                  <button className={styles.btnSecondary}>Save Job</button>
                  {isExpired && !hasApplied && <p className={styles.expiredWarning}>This job posting has expired and is no longer accepting applications.</p>}
                  {hasApplied && <p className={styles.expiredWarning} style={{color: '#008080'}}>You have applied for this position. Check your pipeline for updates!</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default JobDetails;
