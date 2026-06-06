import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../assets/services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './ProfileBuilder.module.css';

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  
  // Recruiter fields
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyWebsite: user?.companyWebsite || '',
    companySize: user?.companySize || '',
    companyDescription: user?.companyDescription || '',
  });

  // Step 1: Avatar Handlers
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Final Submission
  const handleSubmit = async () => {
    if (!contactInfo.name) {
      toast.error('Name/Company Name is required.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (profilePic) formData.append('profilePicture', profilePic);
      
      formData.append('name', contactInfo.name);
      formData.append('phone', contactInfo.phone);
      formData.append('companyWebsite', companyInfo.companyWebsite);
      formData.append('companySize', companyInfo.companySize);
      formData.append('companyDescription', companyInfo.companyDescription);

      const res = await updateProfile(formData);
      
      // Update local storage context with new user data
      const token = localStorage.getItem('token');
      if (token && res.user) {
        // preserve the name if backend didn't update it
        login(token, { ...res.user, name: contactInfo.name });
      }

      toast.success('Recruiter Profile Configured! Ready to hire.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.builderCard}>
          
          <div className={styles.header}>
            <h1>Recruiter Command Center</h1>
            <p>Set up your company profile and recruiter identity to attract top talent.</p>
          </div>

          <div className={styles.stepper}>
            {[1, 2, 3].map(num => (
              <div 
                key={num} 
                className={`${styles.stepDot} ${step === num ? styles.active : ''} ${step > num ? styles.completed : ''}`}
              />
            ))}
          </div>

          {/* STEP 1: AVATAR / LOGO */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Company Logo / Avatar</h2>
              
              <label className={`${styles.avatarUploadZone}`}>
                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                {profilePicPreview ? (
                  <>
                    <img src={profilePicPreview} alt="Avatar Preview" className={styles.avatarPreview} />
                    <div className={styles.avatarOverlay}>Change Photo</div>
                  </>
                ) : (
                  <div className={styles.uploadIcon}>🏢</div>
                )}
              </label>
              <p style={{textAlign: 'center', color: '#94A3B8', marginTop: '16px'}}>Click to upload company logo or your professional photo.</p>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Professional Details</h2>
              
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.inputLabel}>Display Name / Company Name</label>
                  <input 
                    type="text" className={styles.input} placeholder="e.g. Acme Corp HR"
                    value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.inputLabel}>Contact Phone (Optional)</label>
                  <input 
                    type="text" className={styles.input} placeholder="+1 234 567 8900"
                    value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COMPANY DETAILS */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Company Profile</h2>
              
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.inputLabel}>Company Website</label>
                  <input 
                    type="url" className={styles.input} placeholder="https://example.com"
                    value={companyInfo.companyWebsite} onChange={e => setCompanyInfo({...companyInfo, companyWebsite: e.target.value})}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.inputLabel}>Company Size</label>
                  <select 
                    className={styles.input} 
                    value={companyInfo.companySize} 
                    onChange={e => setCompanyInfo({...companyInfo, companySize: e.target.value})}
                  >
                    <option value="">Select Company Size...</option>
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="500+">500+ Employees</option>
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.inputLabel}>Company Description</label>
                  <textarea 
                    className={styles.input} placeholder="Tell candidates what your company does..."
                    value={companyInfo.companyDescription} onChange={e => setCompanyInfo({...companyInfo, companyDescription: e.target.value})}
                    rows="4" style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.actions}>
            {step > 1 ? (
              <button className={styles.btnBack} onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button className={styles.btnNext} onClick={() => setStep(step + 1)}>
                Continue →
              </button>
            ) : (
              <button className={styles.btnNext} onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader message=""/> : 'Complete Setup 🚀'}
              </button>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default RecruiterProfile;
