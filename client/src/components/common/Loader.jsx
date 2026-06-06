import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-500 to-slate-400 opacity-20 blur-xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Spinning ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-slate-600 border-r-slate-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-gradient-to-br from-slate-600 to-slate-400"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default Loader;
