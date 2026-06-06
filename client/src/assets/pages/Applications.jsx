import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaArrowLeft,
  FaFileAlt,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import { getJobById } from '../../assets/services/jobService';
import { getApplicationsByJob } from '../../assets/services/applicationService';
import { formatDate } from '../../utils/helpers';

const Applications = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobRes, appsRes] = await Promise.all([
          getJobById(jobId),
          getApplicationsByJob(jobId),
        ]);
        setJob(jobRes.data || jobRes);
        const appsData = appsRes.data || appsRes;
        setApplications(Array.isArray(appsData) ? appsData : []);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  /* ─── animation variants ─── */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* header band */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-900 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to={job ? `/jobs/${job._id}` : '/jobs'}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium mb-5 transition"
          >
            <FaArrowLeft className="text-xs" /> Back to Job
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Applications
            </h1>
            {job && (
              <p className="mt-2 text-lg text-slate-300">
                for{' '}
                <span className="font-semibold text-white">{job.title}</span>{' '}
                at {job.company}
              </p>
            )}
            <p className="mt-3 text-slate-400">
              {applications.length} application
              {applications.length !== 1 ? 's' : ''} received
            </p>
          </motion.div>
        </div>
      </section>

      {/* content */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <FaFileAlt className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No Applications Yet
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              No one has applied for this position yet. Share the listing to
              attract candidates.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {applications.map((app, idx) => (
              <motion.div
                key={app._id || idx}
                variants={item}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                {/* avatar */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-600 text-white font-bold text-sm shadow">
                    {(app.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {app.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{app.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-slate-500 flex-shrink-0" />
                    <span>{app.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-slate-500 flex-shrink-0" />
                    <span>
                      Applied {formatDate?.(app.createdAt) ?? app.createdAt}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </MainLayout>
  );
};

export default Applications;
