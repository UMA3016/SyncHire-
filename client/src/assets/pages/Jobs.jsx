import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import JobCard from '../../components/jobs/JobCard';
import SearchBar from '../../components/jobs/SearchBar';
import FilterBar from '../../components/jobs/FilterBar';
import { getAllJobs } from '../../assets/services/jobService';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  /* ─── fetch jobs ─── */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await getAllJobs();
        const data = res.data || res;
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* ─── apply search + filter ─── */
  useEffect(() => {
    let result = [...jobs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q)
      );
    }

    if (activeFilter && activeFilter !== 'All') {
      result = result.filter((j) => j.type === activeFilter);
    }

    setFilteredJobs(result);
  }, [jobs, search, activeFilter]);

  /* ─── animation variants ─── */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <MainLayout>
      {/* ─── page header ─── */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white"
          >
            Browse Jobs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-slate-400 text-lg"
          >
            {loading
              ? 'Loading opportunities…'
              : `${filteredJobs.length} opportunit${filteredJobs.length === 1 ? 'y' : 'ies'} available`}
          </motion.p>
        </div>
      </section>

      {/* ─── toolbar ─── */}
      <section className="mx-auto max-w-6xl px-6 -mt-7 relative z-10">
        <div className="rounded-2xl bg-white shadow-lg border border-slate-100 p-5 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:flex-1">
            <SearchBar onSearch={setSearch} />
          </div>
          <div className="w-full md:w-auto">
            <FilterBar onFilter={setActiveFilter} activeFilter={activeFilter} />
          </div>
        </div>
      </section>

      {/* ─── content ─── */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : filteredJobs.length === 0 ? (
          /* empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <FaBriefcase className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No Jobs Found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any jobs matching your criteria. Try adjusting your
              search or filters.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredJobs.map((job) => (
              <motion.div key={job._id} variants={item}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </MainLayout>
  );
};

export default Jobs;
