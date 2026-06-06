import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBriefcase,
  FaSearch,
  FaPaperPlane,
  FaBuilding,
  FaUsers,
  FaFileAlt,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';

/* ───────── animated counter hook ───────── */
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

/* ───────── stat card ───────── */
const StatCard = ({ icon: Icon, value, label, suffix = '+', color }) => {
  const count = useCounter(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
      <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-slate-100">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="text-2xl" />
        </div>
        <h3 className="text-4xl font-extrabold text-slate-900">
          {count.toLocaleString()}
          {suffix}
        </h3>
        <p className="mt-1 text-slate-500 font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

/* ───────── step card ───────── */
const StepCard = ({ step, icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: step * 0.15 }}
    className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group"
  >
    <span className="absolute -top-4 -left-2 text-7xl font-black text-blue-600/5 select-none group-hover:text-blue-600/10 transition-colors">
      {step}
    </span>
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25">
      <Icon className="text-xl" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </motion.div>
);

/* ════════════════════════════════════════════
   HOME PAGE
   ════════════════════════════════════════════ */
const Home = () => {
  return (
    <MainLayout>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 py-28 lg:py-36">
        {/* decorative shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-cyan-500/5 blur-2xl" />
          {/* floating dots */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-1/4 h-3 w-3 rounded-full bg-blue-400/30"
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-28 left-1/4 h-4 w-4 rounded-full bg-purple-400/25"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 left-16 h-2 w-2 rounded-full bg-cyan-400/30"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block mb-5 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-1.5 text-sm font-semibold text-blue-300 backdrop-blur">
              🚀 Your Career Starts Here
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Find Your{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Dream Job
              </span>{' '}
              Today
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
              Browse thousands of opportunities from top companies. Apply with one
              click, track your applications, and land the career you deserve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/jobs"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.03] transition-all duration-300"
            >
              <FaSearch className="text-sm transition-transform group-hover:-translate-y-0.5" />
              Explore Jobs
            </Link>
            <Link
              to="/create-job"
              className="group flex items-center gap-2 rounded-xl border border-slate-600 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur hover:bg-white/10 hover:border-slate-500 hover:scale-[1.03] transition-all duration-300"
            >
              <FaBriefcase className="text-sm transition-transform group-hover:-translate-y-0.5" />
              Post a Job
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative -mt-14 z-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard
              icon={FaFileAlt}
              value={1000}
              label="Jobs Posted"
              color="#2563EB"
            />
            <StatCard
              icon={FaBuilding}
              value={500}
              label="Companies"
              color="#7C3AED"
            />
            <StatCard
              icon={FaUsers}
              value={5000}
              label="Applications"
              color="#06B6D4"
            />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block mb-3 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Get started in three easy steps and begin your journey towards your
              dream career.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            <StepCard
              step={1}
              icon={FaSearch}
              title="Search Jobs"
              description="Browse our extensive catalogue. Filter by type, location, and salary to find your perfect match."
            />
            <StepCard
              step={2}
              icon={FaPaperPlane}
              title="Apply Instantly"
              description="Submit your application with just a few clicks. No lengthy forms — we keep it fast and simple."
            />
            <StepCard
              step={3}
              icon={FaBriefcase}
              title="Get Hired"
              description="Companies review your profile and reach out. Track every application in one place."
            />
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-12 lg:p-16 text-center shadow-2xl"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Take the Next Step?
              </h2>
              <p className="mx-auto max-w-xl text-blue-100 mb-8 text-lg">
                Join thousands of professionals who found their dream jobs through
                our platform. Your next opportunity is one click away.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/jobs"
                  className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-blue-700 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/create-job"
                  className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-bold text-white hover:bg-white/10 hover:scale-[1.03] transition-all duration-300"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
