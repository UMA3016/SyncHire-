import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaBriefcase } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { createJob } from '../../assets/services/jobService';

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];

const CreateJob = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  /* ─── validation ─── */
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Job title is required';
    if (!form.company.trim()) errs.company = 'Company name is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.type) errs.type = 'Job type is required';
    if (!form.salary.trim()) errs.salary = 'Salary is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ─── change handler ─── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* ─── submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await createJob(form);
      toast.success('Job created successfully!');
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create job.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── field component ─── */
  const Field = ({ label, name, type = 'text', as, children, ...rest }) => {
    const Tag = as || 'input';
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          {label}
        </label>
        <Tag
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-500/40 focus:border-slate-500 ${
            errors[name]
              ? 'border-rose-400 focus:ring-rose-400/40'
              : 'border-slate-200'
          }`}
          {...rest}
        >
          {children}
        </Tag>
        {errors[name] && (
          <p className="mt-1 text-xs text-rose-500 font-medium">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      {/* header band */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white"
          >
            Post a New Job
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-slate-400"
          >
            Fill in the details below to publish a new opportunity.
          </motion.p>
        </div>
      </section>

      {/* form card */}
      <section className="mx-auto max-w-3xl px-6 -mt-10 relative z-10 pb-20">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-600 text-white shadow">
              <FaBriefcase />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Job Title"
              name="title"
              placeholder="e.g. Frontend Developer"
            />
            <Field
              label="Company"
              name="company"
              placeholder="e.g. Google"
            />
            <Field
              label="Location"
              name="location"
              placeholder="e.g. New York, NY"
            />
            <Field label="Job Type" name="type" as="select">
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
          </div>

          <Field
            label="Salary"
            name="salary"
            placeholder="e.g. $80,000 - $120,000"
          />

          <Field
            label="Description"
            name="description"
            as="textarea"
            rows={5}
            placeholder="Enter a detailed job description…"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-slate-600 to-slate-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-slate-600/25 hover:shadow-slate-600/40 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? 'Publishing…' : 'Publish Job'}
          </button>
        </motion.form>
      </section>
    </MainLayout>
  );
};

export default CreateJob;
