import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';

const NotFound = () => {
  return (
    <MainLayout>
      <section className="flex items-center justify-center min-h-[70vh] px-6">
        <div className="text-center">
          {/* animated 404 */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
            className="text-[10rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent select-none"
          >
            404
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Page Not Found
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
              Oops! The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.03] transition-all duration-300"
            >
              <FaHome className="text-sm" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NotFound;
