import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getAllJobs } from '../assets/services/jobService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './Jobs.module.css';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Remote', 'Internship'];

const Jobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllJobs();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.type?.toLowerCase().includes(q)
      );
    }
    if (activeFilter !== 'All') {
      result = result.filter((j) => j.type?.trim().toLowerCase() === activeFilter.toLowerCase());
    }
    setFilteredJobs(result);
  }, [jobs, search, activeFilter]);

  const handleShare = (e, jobId) => {
    e.preventDefault(); // prevent navigation
    const link = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied! Share it with your friends.');
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.dashboard}>
          {/* Main Feed Only - Removed Sidebars */}
          <section className={styles.mainFeed}>
            {/* Search and Filters */}
            <div className={styles.searchBarContainer}>
              <input 
                type="text" 
                placeholder="Search by title, company, or location..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.filterChips}>
                {JOB_TYPES.map(type => (
                  <button 
                    key={type}
                    type="button"
                    onClick={() => setActiveFilter(type)}
                    className={`${styles.chip} ${activeFilter === type ? styles.activeChip : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <Loader message="Loading job feed..." />
            ) : filteredJobs.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className={styles.jobGrid}>
                {filteredJobs.map((job) => {
                  const isExpired = new Date() > new Date(job.applicationEndDate);
                  const diffTime = new Date(job.applicationEndDate) - new Date();
                  const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
                  const timeText = isExpired ? `Expired ${diffDays} day${diffDays !== 1 ? 's' : ''} ago` : `Expires in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;

                  return (
                  <Link to={`/jobs/${job._id}`} key={job._id} className={`${styles.jobCard} ${isExpired ? styles.jobCardExpired : ''}`}>
                    <div className={styles.jobCardHeader}>
                      <div className={styles.jobCompanyLogo}>
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className={styles.jobTitle}>{job.title}</h3>
                        <p className={styles.jobCompany}>{job.company}</p>
                      </div>
                      <button 
                        className={styles.shareBtn} 
                        onClick={(e) => handleShare(e, job._id)}
                        title="Share this job"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                      </button>
                    </div>
                    <div className={styles.jobCardBody}>
                      <span className={styles.badge}>{job.type}</span>
                      <span className={styles.location}>📍 {job.location}</span>
                    </div>
                    <div className={styles.jobCardFooter}>
                      <span className={styles.salary}>{job.salary}</span>
                      <span className={`${styles.timeAgo} ${isExpired ? styles.textExpired : ''}`}>{timeText}</span>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Jobs;
