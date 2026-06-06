import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBriefcase, FaHome, FaSearch, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex flex-col items-center justify-center min-w-[80px] h-full border-b-2 transition-all ${
          isActive 
            ? 'border-[#0E7A6B] text-[#0E7A6B]' 
            : 'border-transparent text-gray-500 hover:text-gray-800'
        }`}
      >
        <Icon className="text-xl mb-1" />
        <span className="text-[10px] font-medium hidden md:block">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 h-[60px]">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1 text-[#0E7A6B]">
            <FaBriefcase className="text-3xl" />
            <span className="text-xl font-extrabold tracking-tight hidden sm:block">MJP</span>
          </Link>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search jobs, companies..."
              className="bg-[#EEF3F8] text-sm text-gray-900 rounded-md pl-9 pr-4 py-1.5 w-[240px] focus:w-[320px] transition-all outline-none border border-transparent focus:border-gray-300 focus:bg-white"
            />
          </div>
        </div>

        {/* Right: Navigation Icons */}
        <div className="flex items-center h-full">
          <NavItem to="/" icon={FaHome} label="Home" />
          <NavItem to="/jobs" icon={FaBriefcase} label="Jobs" />
          
          {user ? (
            <>
              <button className="flex flex-col items-center justify-center min-w-[80px] h-full border-b-2 border-transparent text-gray-500 hover:text-gray-800">
                <FaBell className="text-xl mb-1" />
                <span className="text-[10px] font-medium hidden md:block">Notifications</span>
              </button>
              
              <div className="relative h-full flex items-center border-l border-gray-200 ml-2 pl-2">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex flex-col items-center justify-center min-w-[80px] h-full text-gray-500 hover:text-gray-800"
                >
                  <FaUserCircle className="text-xl mb-1" />
                  <span className="text-[10px] font-medium hidden md:block flex items-center gap-1">
                    Me <span className="text-[8px]">▼</span>
                  </span>
                </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
