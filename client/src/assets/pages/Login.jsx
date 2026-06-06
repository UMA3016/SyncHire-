import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { sendOTP, verifyOTP } from '../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { FiMail, FiKey, FiArrowRight } from 'react-icons/fi';
import { FaBriefcase, FaSearchLocation } from 'react-icons/fa';

const Login = () => {
  const [view, setView] = useState('selection'); // selection | email | otp
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setView('email');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    if (!name) return toast.error('Please enter your full name');
    
    setLoading(true);
    try {
      await sendOTP(email, role, name);
      toast.success('OTP sent to your email!');
      setView('otp');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');
    
    setLoading(true);
    try {
      const data = await verifyOTP(email, otp, role);
      login(data.token, data.user);
      toast.success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6F0EB] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <svg className="absolute top-[10%] left-[5%] w-96 h-96 text-teal-600/10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M42.7,-73.4C55.9,-65.8,67.6,-54.6,76.5,-41.6C85.4,-28.6,91.5,-14.3,92.5,0.6C93.5,15.5,89.5,31,80.6,44.1C71.7,57.2,57.9,67.9,42.7,75.4C27.5,82.9,10.9,87.2,-4.8,88.7C-20.5,90.2,-35.3,88.9,-49.2,81.8C-63.1,74.7,-76.1,61.8,-83.4,46.5C-90.7,31.2,-92.3,13.5,-89.2,-3C-86.1,-19.5,-78.3,-34.8,-67.7,-47.2C-57.1,-59.6,-43.7,-69.1,-29.6,-75.4C-15.5,-81.7,-0.7,-84.8,14.6,-83.3C29.9,-81.8,45.6,-75.7,42.7,-73.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] text-teal-600/5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M51.8,-73.4C66.5,-63.5,77.5,-48.5,83.9,-31.8C90.3,-15.1,92.1,3.3,86.5,19.3C80.9,35.3,67.9,48.9,53.2,59.3C38.5,69.7,22.1,76.9,4.4,79.5C-13.3,82.1,-32.3,80.1,-48.2,71.2C-64.1,62.3,-76.9,46.5,-83.4,28.7C-89.9,10.9,-90.1,-8.9,-82.9,-25.4C-75.7,-41.9,-61.1,-55.1,-45.5,-64.7C-29.9,-74.3,-15,-80.3,1.3,-82C17.6,-83.7,35.2,-81.1,51.8,-73.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {view === 'selection' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl bg-[#F2F6F4] rounded-[24px] p-8 shadow-2xl relative z-10 border border-white/60"
          >
            {/* Top Navbar inside modal */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-[#0E7A6B] text-2xl" />
                <span className="text-2xl font-bold text-[#0E7A6B] tracking-tight">MJP</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleRoleSelect('candidate')}
                  className="px-6 py-2 bg-[#0E7A6B] text-white text-sm font-semibold rounded-lg hover:bg-[#0a6356] transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleRoleSelect('candidate')}
                  className="px-6 py-2 bg-[#0E7A6B] text-white text-sm font-semibold rounded-lg hover:bg-[#0a6356] transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Split Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recruiter Section */}
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Recruiter</h3>
                <div className="w-full bg-white rounded-[20px] p-8 flex flex-col items-center text-center shadow-sm min-h-[320px] border border-gray-100">
                  <FaBriefcase className="text-[#0E7A6B] text-[5rem] mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Post a Job</h4>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed px-2">
                    Create a job that enform your opportunities.
                  </p>
                  <div className="flex gap-3 mt-auto w-full">
                    <button 
                      onClick={() => handleRoleSelect('recruiter')}
                      className="flex-1 py-2.5 bg-[#0E7A6B] text-white text-sm font-bold rounded-lg hover:bg-[#0a6356] transition-colors"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => handleRoleSelect('recruiter')}
                      className="flex-1 py-2.5 bg-[#0E7A6B] text-white text-sm font-bold rounded-lg hover:bg-[#0a6356] transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>

              {/* Candidate Section */}
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Candidate</h3>
                <div className="w-full bg-[#0E7A6B] rounded-[20px] p-8 flex flex-col items-center text-center shadow-md min-h-[320px]">
                  <FaSearchLocation className="text-white text-[5rem] mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Find Your Dream Job</h4>
                  <p className="text-teal-100 text-sm mb-6 leading-relaxed px-2">
                    Find the best map to find your dream Jobs.
                  </p>
                  <div className="mt-auto w-full px-4">
                    <button 
                      onClick={() => handleRoleSelect('candidate')}
                      className="w-full py-2.5 bg-white text-[#0E7A6B] text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Browse Jobs
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {view === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100"
          >
            <div className="bg-[#0E7A6B] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-10 -translate-y-10"></div>
              <FaBriefcase className="text-white text-4xl mx-auto mb-4 drop-shadow-md" />
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {role === 'recruiter' ? 'Recruiter Access' : 'Candidate Access'}
              </h2>
              <p className="text-teal-100 font-medium">Enter your details to continue</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-[#0E7A6B] focus:border-transparent transition-all outline-none"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-[#0E7A6B] focus:border-transparent transition-all outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setView('selection')}
                    className="flex-1 py-3.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] flex items-center justify-center gap-2 bg-[#0E7A6B] text-white py-3.5 rounded-xl hover:bg-[#0a6356] transition-colors font-bold shadow-lg shadow-teal-600/30 disabled:opacity-70"
                  >
                    {loading ? 'Sending...' : 'Continue'}
                    {!loading && <FiArrowRight size={18} />}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {view === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100"
          >
             <div className="bg-[#0E7A6B] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-10 -translate-y-10"></div>
              <FiKey className="text-white text-4xl mx-auto mb-4 drop-shadow-md" />
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Verify Email</h2>
              <p className="text-teal-100 font-medium">We sent a secure code to you</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-gray-900 font-bold bg-gray-100 py-2 px-4 rounded-lg inline-block border border-gray-200">{email}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                    Enter 6-digit OTP
                  </label>
                  <div className="relative max-w-[240px] mx-auto">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#0E7A6B] focus:border-transparent transition-all outline-none tracking-[0.5em] text-center text-2xl font-black"
                      placeholder="••••••"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setView('email')}
                    className="flex-1 py-3.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="flex-[2] py-3.5 text-sm font-bold bg-[#0E7A6B] text-white rounded-xl hover:bg-[#0a6356] transition-colors disabled:opacity-70 shadow-lg shadow-teal-600/30"
                  >
                    {loading ? 'Verifying...' : 'Secure Sign In'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
