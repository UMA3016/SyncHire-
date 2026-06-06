import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { applyForJob } from '../../assets/services/applicationService';
import { validateApplicationForm } from '../../utils/validators';

const ApplyJobForm = ({ jobId, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateApplicationForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    if (!resume) {
      setErrors((prev) => ({ ...prev, resume: 'Resume is required' }));
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('jobId', jobId);
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('resume', resume);

      await applyForJob(data);
      toast.success('Application submitted successfully! 🎉');
      setFormData({ name: '', email: '', phone: '' });
      setResume(null);
      setErrors({});
      onSuccess?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: FaUser },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', icon: FaEnvelope },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', icon: FaPhone },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8"
    >
      <div className="mb-2">
        <h3 className="text-lg font-bold text-slate-800">Apply for this position</h3>
        <p className="mt-1 text-sm text-slate-500">Fill in your details and we&apos;ll get back to you soon.</p>
      </div>

      {inputFields.map((field) => {
        const Icon = field.icon;
        const hasError = !!errors[field.name];
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-slate-700">
              {field.label} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Icon className={`text-xs ${hasError ? 'text-rose-400' : 'text-slate-400'}`} />
              </div>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:ring-4 focus:outline-none ${
                  hasError
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10'
                    : 'border-slate-200 focus:border-slate-400 focus:ring-slate-500/10'
                }`}
              />
            </div>
            {hasError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs font-medium text-rose-500"
              >
                {errors[field.name]}
              </motion.p>
            )}
          </div>
        );
      })}

      <div>
        <label htmlFor="resume" className="mb-1.5 block text-sm font-medium text-slate-700">
          Resume (PDF, DOC, DOCX) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              setResume(e.target.files[0]);
              if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
            }}
            className={`w-full rounded-xl border py-2 pl-3 pr-4 text-sm text-slate-700 transition-all duration-200 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 focus:ring-4 focus:outline-none ${
              errors.resume
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10'
                : 'border-slate-200 focus:border-slate-400 focus:ring-slate-500/10'
            }`}
          />
        </div>
        {errors.resume && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs font-medium text-rose-500"
          >
            {errors.resume}
          </motion.p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:ring-4 focus:ring-slate-500/20 focus:outline-none disabled:pointer-events-none disabled:opacity-60 mt-6"
      >
        {loading ? (
          <>
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Submitting...
          </>
        ) : (
          <>
            <FaPaperPlane className="text-xs" />
            Submit Application
          </>
        )}
      </button>
    </motion.form>
  );
};

export default ApplyJobForm;
