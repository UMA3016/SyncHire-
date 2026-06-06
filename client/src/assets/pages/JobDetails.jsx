import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaEdit,
  FaTrash,
  FaEye,
  FaPaperPlane,
  FaArrowLeft,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import ApplyJobForm from '../../components/applications/ApplyJobForm';
import { getJobById, deleteJob } from '../../assets/services/jobService';
import { formatDate, getTypeBadgeColor } from '../../utils/helpers';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ─── fetch job ─── */
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getJobById(id);
        setJob(res.data || res);
      } catch (err) {
        console.error(err);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  /* ─── delete handler ─── */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      setDeleting(true);
      await deleteJob(id);
      toast.success('Job deleted successfully!');
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job.');
    } finally {
      setDeleting(false);
    }
  };

  /* ─── loading / error ─── */
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  if (error || !job) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <h2 className="text-2xl font-bold text-slate-700 mb-3">
            {error || 'Job not found'}
          </h2>
          <Link
            to="/jobs"
            className="text-blue-600 hover:underline font-medium flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" /> Back to Jobs
          </Link>
        </div>
      </MainLayout>
    );
  }

  const badgeColor = getTypeBadgeColor?.(job.type) ?? 'bg-blue-100 text-blue-700';

  return (
    <MainLayout>
      {/* header band */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 pt-14 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium mb-6 transition"
          >
            <FaArrowLeft className="text-xs" /> All Jobs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-4 ${badgeColor}`}
            >
              {job.type}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              {job.title}
            </h1>
            <p className="text-xl text-blue-300 font-medium">{job.company}</p>
          </motion.div>
        </div>
      </section>

      {/* content card */}
      <section className="mx-auto max-w-4xl px-6 -mt-14 relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* meta row */}
          <div className="flex flex-wrap gap-6 px-8 py-6 border-b border-slate-100 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" /> {job.location}
            </span>
            <span className="flex items-center gap-2">
              <FaMoneyBillWave className="text-slate-600" /> {job.salary}
            </span>
            <span className="flex items-center gap-2">
              <FaClock className="text-purple-600" /> Posted{' '}
              {formatDate?.(job.createdAt) ?? job.createdAt}
            </span>
          </div>

          {/* description */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Job Description
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* action buttons */}
          <div className="flex flex-wrap gap-3 px-8 pb-8">
            <button
              onClick={() => setShowApply((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              <FaPaperPlane className="text-xs" />
              {showApply ? 'Hide Form' : 'Apply Now'}
            </button>

            <Link
              to={`/edit-job/${job._id}`}
              className="flex items-center gap-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 px-6 py-2.5 text-sm font-semibold hover:bg-amber-100 hover:scale-[1.03] transition-all duration-300"
            >
              <FaEdit className="text-xs" /> Edit
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 px-6 py-2.5 text-sm font-semibold hover:bg-rose-100 hover:scale-[1.03] transition-all duration-300 disabled:opacity-50"
            >
              <FaTrash className="text-xs" />
              {deleting ? 'Deleting…' : 'Delete'}
            </button>

            <Link
              to={`/applications/${job._id}`}
              className="flex items-center gap-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 px-6 py-2.5 text-sm font-semibold hover:bg-purple-100 hover:scale-[1.03] transition-all duration-300"
            >
              <FaEye className="text-xs" /> View Applications
            </Link>
          </div>

          {/* apply form */}
          {showApply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 px-8 py-8"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-5">
                Submit Your Application
              </h2>
              <ApplyJobForm jobId={job._id} />
            </motion.div>
          )}
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default JobDetails;
