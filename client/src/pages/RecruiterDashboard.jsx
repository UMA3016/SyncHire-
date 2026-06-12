import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getRecruiterJobs, createJob, updateJob, deleteJob, restoreJob } from '../assets/services/jobService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './RecruiterDashboard.module.css';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Unified State Management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' | 'Archived'
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', applicationStartDate: '', applicationEndDate: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // The Asynchronous Sync Fix
  const fetchRecruiterJobs = async () => {
    try {
      const res = await getRecruiterJobs();
      const data = res.data || res;
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load active postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, [user]);

  // Handle Form Submission (Create & Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) errors.title = 'Job title is required';
    if (!formData.company.trim()) errors.company = 'Company name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.salary.trim()) errors.salary = 'Salary range is required';
    if (!formData.applicationStartDate) errors.applicationStartDate = 'Start date is required';
    if (!formData.applicationEndDate) errors.applicationEndDate = 'End date is required';
    
    if (formData.applicationStartDate && formData.applicationEndDate) {
      if (new Date(formData.applicationEndDate) < new Date(formData.applicationStartDate)) {
        errors.applicationEndDate = 'End date cannot be before start date';
      }
    }

    if (!formData.description.trim() || formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setFormLoading(true);

    try {
      if (modalMode === 'create') {
        const res = await createJob(formData);
        const newJob = res.data || res;
        setJobs([newJob, ...jobs]);
        toast.success('Job posted successfully!');
      } else {
        const res = await updateJob(editingJobId, formData);
        const updatedJob = res.data || res;
        setJobs(jobs.map(j => (j._id === editingJobId ? updatedJob : j)));
        toast.success('Job updated successfully!');
      }
      closeModal();
    } catch (err) {
      toast.error(`Failed to ${modalMode} job`);
    } finally {
      setFormLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', applicationStartDate: '', applicationEndDate: '' });
    setFormErrors({});
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      applicationStartDate: job.applicationStartDate ? new Date(job.applicationStartDate).toISOString().split('T')[0] : '',
      applicationEndDate: job.applicationEndDate ? new Date(job.applicationEndDate).toISOString().split('T')[0] : ''
    });
    setFormErrors({});
    setEditingJobId(job._id);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJobId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this job? It will be moved to the Archived tab.')) {
      const card = document.getElementById(`job-card-${id}`);
      if (card) {
        card.classList.add(styles.exiting);
        setTimeout(async () => {
          try {
            await deleteJob(id);
            setJobs(jobs.map(job => job._id === id ? { ...job, status: 'Archived' } : job));
            toast.success('Job archived successfully');
          } catch (err) {
            toast.error('Archiving failed');
            card.classList.remove(styles.exiting);
          }
        }, 300);
      } else {
        await deleteJob(id);
        setJobs(jobs.map(job => job._id === id ? { ...job, status: 'Archived' } : job));
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreJob(id);
      setJobs(jobs.map(job => job._id === id ? { ...job, status: 'Active' } : job));
      toast.success('Job restored successfully');
    } catch (err) {
      toast.error('Restore failed');
    }
  };

  // Filter jobs based on active tab
  const displayedJobs = jobs.filter(job => activeTab === 'Active' ? job.status !== 'Archived' : job.status === 'Archived');

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <Loader message="Loading your portfolios..." />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerTitles}>
            <h1 className={styles.pageTitle}>Active Portfolios</h1>
            <p className={styles.pageSubtitle}>Manage your job postings and applicants</p>
          </div>
          <button className={styles.createBtn} onClick={openCreateModal}>
            <span className={styles.plusIcon}>+</span> Post New Job
          </button>
        </div>

        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'Active' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Active')}
          >
            Active Postings
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'Archived' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('Archived')}
          >
            Archived
          </button>
        </div>

        {displayedJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏢</div>
            <h3>No active portfolios</h3>
            <p>You haven't posted any jobs yet. Create your first posting to start receiving applicants.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button className={styles.emptyActionBtn} onClick={openCreateModal}>
                Create Posting
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.jobGrid}>
            {displayedJobs.map((job) => (
              <div key={job._id} id={`job-card-${job._id}`} className={styles.jobCard}>
                <div className={styles.cardMain}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.jobCompany}>{job.company}</p>
                    </div>
                      {job.status === 'Archived' ? (
                        <span className={`${styles.statusBadge} ${styles.statusBadgeExpired}`}>Archived</span>
                      ) : new Date(job.applicationEndDate) < new Date() ? (
                        <span className={`${styles.statusBadge} ${styles.statusBadgeExpired}`}>Expired</span>
                      ) : (
                        <span className={styles.statusBadge}>Active</span>
                      )}
                  </div>
                  
                  <div className={styles.cardBody}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailIcon}>📍</span>
                      <span className={styles.detailText}>{job.location}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailIcon}>💼</span>
                      <span className={styles.detailText}>{job.type}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailIcon}>💰</span>
                      <span className={styles.detailText}>{job.salary}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  {/* Clean navigation directly to Screening Hub */}
                  <button 
                    className={styles.actionAppsBtn}
                    onClick={() => navigate(`/applications/${job._id}`)}
                  >
                    View Applicants
                  </button>
                  <div className={styles.actionGroup}>
                    {job.status !== 'Archived' ? (
                      <>
                        <button 
                          className={styles.actionEditBtn}
                          onClick={() => openEditModal(job)}
                          aria-label="Edit Job"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className={styles.actionDeleteBtn}
                          onClick={() => handleDelete(job._id)}
                          aria-label="Archive Job"
                        >
                          🗑️ Archive
                        </button>
                      </>
                    ) : (
                      <button 
                        className={styles.actionRestoreBtn}
                        onClick={() => handleRestore(job._id)}
                        aria-label="Restore Job"
                      >
                        ♻️ Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{modalMode === 'create' ? 'Create New Posting' : 'Edit Posting'}</h2>
                <button className={styles.closeBtn} onClick={closeModal}>×</button>
              </div>
              
              <form onSubmit={handleFormSubmit} className={styles.jobForm}>
                <div className={styles.formGroup}>
                  <label>Job Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => { setFormData({...formData, title: e.target.value}); if(formErrors.title) setFormErrors({...formErrors, title: ''}); }} 
                    placeholder="e.g. Senior React Developer"
                    className={formErrors.title ? styles.inputError : ''}
                  />
                  {formErrors.title && <span className={styles.errorText}>{formErrors.title}</span>}
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Company</label>
                    <input 
                      type="text" 
                      value={formData.company} 
                      onChange={e => { setFormData({...formData, company: e.target.value}); if(formErrors.company) setFormErrors({...formErrors, company: ''}); }} 
                      className={formErrors.company ? styles.inputError : ''}
                    />
                    {formErrors.company && <span className={styles.errorText}>{formErrors.company}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Location</label>
                    <input 
                      type="text" 
                      value={formData.location} 
                      onChange={e => { setFormData({...formData, location: e.target.value}); if(formErrors.location) setFormErrors({...formErrors, location: ''}); }} 
                      className={formErrors.location ? styles.inputError : ''}
                    />
                    {formErrors.location && <span className={styles.errorText}>{formErrors.location}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Job Type</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Salary Range</label>
                    <input 
                      type="text" 
                      value={formData.salary} 
                      onChange={e => { setFormData({...formData, salary: e.target.value}); if(formErrors.salary) setFormErrors({...formErrors, salary: ''}); }} 
                      placeholder="e.g. $100k - $120k"
                      className={formErrors.salary ? styles.inputError : ''}
                    />
                    {formErrors.salary && <span className={styles.errorText}>{formErrors.salary}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={formData.applicationStartDate} 
                      onChange={e => { setFormData({...formData, applicationStartDate: e.target.value}); if(formErrors.applicationStartDate) setFormErrors({...formErrors, applicationStartDate: ''}); }} 
                      className={formErrors.applicationStartDate ? styles.inputError : ''}
                    />
                    {formErrors.applicationStartDate && <span className={styles.errorText}>{formErrors.applicationStartDate}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Date (Deadline)</label>
                    <input 
                      type="date" 
                      value={formData.applicationEndDate} 
                      onChange={e => { setFormData({...formData, applicationEndDate: e.target.value}); if(formErrors.applicationEndDate) setFormErrors({...formErrors, applicationEndDate: ''}); }} 
                      className={formErrors.applicationEndDate ? styles.inputError : ''}
                    />
                    {formErrors.applicationEndDate && <span className={styles.errorText}>{formErrors.applicationEndDate}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => { setFormData({...formData, description: e.target.value}); if(formErrors.description) setFormErrors({...formErrors, description: ''}); }} 
                    rows="5"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className={formErrors.description ? styles.inputError : ''}
                  ></textarea>
                  {formErrors.description && <span className={styles.errorText}>{formErrors.description}</span>}
                </div>

                <div className={styles.modalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                  <button type="submit" className={styles.submitBtn} disabled={formLoading}>
                    {formLoading ? 'Saving...' : modalMode === 'create' ? 'Post Job' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default RecruiterDashboard;
