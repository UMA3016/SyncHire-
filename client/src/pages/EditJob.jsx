import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById, updateJob } from '../assets/services/jobService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './CreateJob.module.css'; // Reusing CreateJob styles

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(id);
        const job = res.data;
        setFormData({
          title: job.title || '',
          company: job.company || '',
          location: job.location || '',
          type: job.type || 'Full-time',
          salary: job.salary || '',
          description: job.description || ''
        });
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.location || !formData.salary || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    try {
      setSubmitting(true);
      await updateJob(id, formData);
      toast.success('Job updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to update job.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.container} style={{ alignItems: 'center' }}>
          <Loader message="Loading job details..." />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.iconContainer}>✏️</div>
            <h2>Edit Job Posting</h2>
            <p>Update the details of your job posting.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Job Title *</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="company">Company Name *</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleChange} 
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="location">Location *</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="type">Job Type *</label>
                <select 
                  id="type" 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange} 
                  className={styles.select}
                >
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="salary">Salary Range *</label>
                <input 
                  type="text" 
                  id="salary" 
                  name="salary" 
                  value={formData.salary} 
                  onChange={handleChange} 
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Job Description *</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className={styles.textarea}
                rows="6"
              />
            </div>

            <div className={styles.actions}>
              <button 
                type="button" 
                className={styles.btnSecondary} 
                onClick={() => navigate('/dashboard')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EditJob;
