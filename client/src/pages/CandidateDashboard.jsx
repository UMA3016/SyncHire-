import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './CandidateDashboard.module.css';
import API from '../assets/services/api';

const CandidateDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const response = await API.get('/auth/me');
        if (response.data.success) {
          setAppliedJobs(response.data.user.appliedJobs || []);
        }
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppliedJobs();
    }
  }, [user]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Shortlisted':
        return styles.statusShortlisted;
      case 'Interview Call Received':
        return styles.statusInterview;
      case 'Rejected':
        return styles.statusRejected;
      default:
        return styles.statusApplied;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.portalLayout}>
        <h1 className={styles.titleHeader}>My Job Applications</h1>

        {appliedJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't applied to any jobs yet.</p>
            <p>Start exploring opportunities to track your progress here.</p>
          </div>
        ) : (
          <div className={styles.pipelineGrid}>
            {appliedJobs.map((application, index) => (
              <div key={index} className={styles.jobApplicationCard}>
                <div className={styles.metaInfo}>
                  <h3>{application.title}</h3>
                  <p className={styles.company}>{application.companyName}</p>
                  <p className={styles.appliedDate}>
                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className={styles.statusContainer}>
                  <span className={`${styles.badge} ${getStatusBadgeClass(application.status)}`}>
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CandidateDashboard;
