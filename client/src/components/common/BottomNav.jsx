import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBriefcase, FaPlusCircle, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-slate-200 bg-white pb-safe pt-2 sm:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center p-2 transition-colors ${isActive('/') ? 'text-slate-600' : 'text-slate-500'}`}>
        <FaHome className="mb-1 text-xl" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link to="/jobs" className={`flex flex-col items-center p-2 transition-colors ${isActive('/jobs') ? 'text-slate-600' : 'text-slate-500'}`}>
        <FaBriefcase className="mb-1 text-xl" />
        <span className="text-[10px] font-medium">Jobs</span>
      </Link>
      
      {user?.role === 'Recruiter' && (
        <Link to="/post-job" className={`flex flex-col items-center p-2 transition-colors ${isActive('/post-job') ? 'text-slate-600' : 'text-slate-500'}`}>
          <FaPlusCircle className="mb-1 text-xl" />
          <span className="text-[10px] font-medium">Post</span>
        </Link>
      )}
      
      <Link to="/profile" className={`flex flex-col items-center p-2 transition-colors ${isActive('/profile') ? 'text-slate-600' : 'text-slate-500'}`}>
        <FaUser className="mb-1 text-xl" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;
