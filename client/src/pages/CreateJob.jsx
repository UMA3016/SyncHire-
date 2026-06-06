import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createJob } from '../assets/services/jobService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './CreateJob.module.css';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Internship'];

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    applicationStartDate: '',
    applicationEndDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.location || !formData.salary || !formData.description || !formData.applicationStartDate || !formData.applicationEndDate) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      await createJob(formData);
      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.iconContainer}>💼</div>
            <h2>Post a New Job</h2>
            <p>Reach top candidates by providing clear details about the role.</p>
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
                placeholder="e.g. Senior Frontend Engineer" 
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
                  placeholder="e.g. Acme Corp" 
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
                  placeholder="e.g. New York, NY" 
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
                  placeholder="e.g. $100k - $120k" 
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="applicationStartDate">Start Date *</label>
                <input 
                  type="date" 
                  id="applicationStartDate" 
                  name="applicationStartDate" 
                  value={formData.applicationStartDate} 
                  onChange={handleChange} 
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="applicationEndDate">End Date (Deadline) *</label>
                <input 
                  type="date" 
                  id="applicationEndDate" 
                  name="applicationEndDate" 
                  value={formData.applicationEndDate} 
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
                placeholder="Describe the role, responsibilities, and requirements..." 
                className={styles.textarea}
                rows="6"
              />
            </div>

            <div className={styles.actions}>
              <button 
                type="button" 
                className={styles.btnSecondary} 
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CreateJob;
