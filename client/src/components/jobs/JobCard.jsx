import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBuilding, FaMoneyBillWave } from 'react-icons/fa';
import { getTypeBadgeColor } from '../../utils/helpers';

const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        whileHover={{ y: -4 }}
        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-500/10"
      >
        {/* Hover accent bar */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-slate-600 to-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug text-slate-800 transition-colors duration-200 group-hover:text-slate-600">
            {job.title}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-3 py-0.5 text-xs font-semibold ${getTypeBadgeColor(job.type)}`}
          >
            {job.type}
          </span>
        </div>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <FaBuilding className="text-xs text-slate-400" />
            {job.company}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-xs text-slate-400" />
            {job.location}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5">
              <FaMoneyBillWave className="text-xs text-slate-500" />
              <span className="font-medium text-slate-600">{job.salary}</span>
            </span>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
            {job.description}
          </p>
        )}

        {/* Bottom shimmer on hover */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-slate-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.div>
    </Link>
  );
};

export default JobCard;
