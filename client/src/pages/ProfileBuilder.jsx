import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../assets/services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import styles from './ProfileBuilder.module.css';

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  
  const [academics, setAcademics] = useState({
    degree: '',
    institution: '',
    year: ''
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const [resume, setResume] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  // Step 1: Avatar Handlers
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Step 3: Skills Handlers
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleNext = () => {
    const newErrors = {};
    if (step === 2) {
      if (!academics.degree.trim()) newErrors.degree = "Degree is required";
      if (!academics.year.trim()) newErrors.year = "Graduation year is required";
      if (!academics.institution.trim()) newErrors.institution = "Institution is required";
    } else if (step === 3) {
      if (skills.length === 0) newErrors.skills = "Please add at least one skill";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setStep(step + 1);
  };

  // Step 4: Resume Dropzone Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResume(e.dataTransfer.files[0]);
    }
  };

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  // Final Submission
  const handleSubmit = async () => {
    if (!resume) {
      setErrors({ resume: 'Resume is mandatory to complete profile.' });
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const formData = new FormData();
      if (profilePic) formData.append('profilePicture', profilePic);
      if (resume) formData.append('resumeFile', resume);
      
      formData.append('qualification', JSON.stringify([academics]));
      formData.append('skills', JSON.stringify(skills));

      const res = await updateProfile(formData);
      
      // Update local storage context with new user data
      const token = localStorage.getItem('token');
      if (token && res.user) {
        login(token, res.user);
      }

      toast.success('Profile Matrix Configured! Welcome aboard.');
      navigate('/jobs');
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
            <h1>AICTE Candidate Engine</h1>
            <p>Construct your professional matrix to unlock intelligent 1-click applications.</p>
          </div>

          <div className={styles.stepper}>
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`${styles.stepDot} ${step === num ? styles.active : ''} ${step > num ? styles.completed : ''}`}
              />
            ))}
          </div>

          {/* STEP 1: PERSONAL BIO */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Let's start with a face</h2>
              
              <label className={`${styles.avatarUploadZone} ${dragActive ? styles.dragActive : ''}`}>
                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                {profilePicPreview ? (
                  <>
                    <img src={profilePicPreview} alt="Avatar Preview" className={styles.avatarPreview} />
                    <div className={styles.avatarOverlay}>Change Photo</div>
                  </>
                ) : (
                  <div className={styles.uploadIcon}>📷</div>
                )}
              </label>
              <p style={{textAlign: 'center', color: '#94A3B8', marginTop: '16px'}}>Click to upload avatar</p>
            </div>
          )}

          {/* STEP 2: ACADEMICS */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Academic Credentials</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Highest Degree</label>
                  <input 
                    type="text" className={`${styles.input} ${errors.degree ? styles.inputError : ''}`} placeholder="e.g. B.Tech Computer Science"
                    value={academics.degree} onChange={e => { setAcademics({...academics, degree: e.target.value}); if(errors.degree) setErrors({...errors, degree: ''}); }}
                  />
                  {errors.degree && <span className={styles.errorText}>{errors.degree}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Graduation Year</label>
                  <input 
                    type="text" className={`${styles.input} ${errors.year ? styles.inputError : ''}`} placeholder="2025"
                    value={academics.year} onChange={e => { setAcademics({...academics, year: e.target.value}); if(errors.year) setErrors({...errors, year: ''}); }}
                  />
                  {errors.year && <span className={styles.errorText}>{errors.year}</span>}
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.inputLabel}>Institution / College Name</label>
                  <input 
                    type="text" className={`${styles.input} ${errors.institution ? styles.inputError : ''}`} placeholder="Indian Institute of Technology"
                    value={academics.institution} onChange={e => { setAcademics({...academics, institution: e.target.value}); if(errors.institution) setErrors({...errors, institution: ''}); }}
                  />
                  {errors.institution && <span className={styles.errorText}>{errors.institution}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Technical Stack Matrix</h2>
              <p style={{textAlign: 'center', color: '#64748B', marginBottom: '20px'}}>Type a skill and press Enter to add.</p>
              
              <div className={styles.skillsContainer}>
                <div className={styles.skillsTags}>
                  {skills.map(skill => (
                    <div key={skill} className={styles.skillChip}>
                      {skill}
                      <button className={styles.removeSkillBtn} onClick={() => removeSkill(skill)}>×</button>
                    </div>
                  ))}
                  <input 
                    type="text" 
                    className={styles.skillInput} 
                    placeholder="Add a skill (e.g. React)..."
                    value={skillInput}
                    onChange={e => { setSkillInput(e.target.value); if(errors.skills) setErrors({...errors, skills: ''}); }}
                    onKeyDown={handleSkillKeyDown}
                  />
                </div>
                {errors.skills && <span className={styles.errorText} style={{marginLeft: '10px', marginTop: '-5px', marginBottom: '10px'}}>{errors.skills}</span>}
              </div>
            </div>
          )}

          {/* STEP 4: RESUME UPLOAD */}
          {step === 4 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Attach Your Legacy</h2>
              
              <label 
                className={`${styles.resumeDropzone} ${dragActive ? styles.dragActive : ''} ${resume ? styles.fileChosen : ''}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} hidden />
                <div className={styles.docIcon}>{resume ? '📄' : '📥'}</div>
                <h3 className={styles.dropzoneText}>
                  {resume ? resume.name : 'Drag & Drop your Resume'}
                </h3>
                <p className={styles.dropzoneSub}>
                  {resume ? 'Click to replace file' : 'Supports .pdf, .doc, .docx'}
                </p>
              </label>
              {errors.resume && <span className={styles.errorText} style={{textAlign: 'center', marginTop: '16px'}}>{errors.resume}</span>}
            </div>
          )}

          {/* Navigation */}
          <div className={styles.actions}>
            {step > 1 ? (
              <button className={styles.btnBack} onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            ) : <div />}
            
            {step < 4 ? (
              <button className={styles.btnNext} onClick={handleNext}>
                Continue →
              </button>
            ) : (
              <button className={styles.btnNext} onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader message=""/> : 'Complete Matrix 🚀'}
              </button>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfileBuilder;
