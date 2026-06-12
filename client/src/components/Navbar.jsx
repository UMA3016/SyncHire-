import { useState, useEffect, useRef, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../assets/services/notificationService';
import styles from './Navbar.module.css';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    const handleOpenGatekeeper = () => {
      setShowGatekeeper(true);
      setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('openGatekeeper', handleOpenGatekeeper);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('openGatekeeper', handleOpenGatekeeper);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setNotifDropdownOpen(false);

    if (user) {
      // Fetch initial notifications
      getNotifications().then(data => {
        if (Array.isArray(data)) setNotifications(data);
      }).catch(console.error);

      // Initialize Socket
      socketRef.current = io(SOCKET_SERVER_URL);
      socketRef.current.emit('join_user_room', user.id || user._id);
      
      socketRef.current.on('receive_notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [user]);

  const handleSignOut = () => {
    setDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setNotifDropdownOpen(false);
  };

  const toggleNotifDropdown = () => {
    setNotifDropdownOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openGatekeeper = (e) => {
    e.preventDefault();
    closeMobileMenu();
    setShowGatekeeper(true);
  };

  const closeGatekeeper = () => {
    setShowGatekeeper(false);
  };

  const navigateToRole = (role) => {
    setShowGatekeeper(false);
    navigate(`/password-login?role=${role}`);
  };

  const getInitial = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const getRoleBadgeLabel = (role) => {
    if (role === 'candidate') return 'Candidate';
    if (role === 'recruiter') return 'Recruiter';
    if (role === 'admin') return 'Admin';
    return role;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif._id);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.error(err);
      }
    }
    setNotifDropdownOpen(false);
    
    // Redirect based on role and notification context
    if (user.role === 'recruiter' && notif.jobId) {
      navigate(`/applications/${notif.jobId}?chat=${notif.applicationId}`);
    } else {
      navigate(`/pipeline?chat=${notif.applicationId}`);
    }
  };

  const renderNotificationsDropdown = () => (
    <div className={styles.notifDropdown}>
      <div className={styles.notifHeader}>
        <h4>Notifications</h4>
        {unreadCount > 0 && (
          <button className={styles.markAllReadBtn} onClick={async () => {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({...n, isRead: true})));
          }}>Mark all read</button>
        )}
      </div>
      <div className={styles.notifList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyNotifs}>No new notifications</div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif._id} 
              className={`${styles.notifItem} ${notif.isRead ? styles.notifRead : styles.notifUnread}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className={styles.notifAvatar}>{getInitial(notif.senderId?.name || 'U')}</div>
              <div className={styles.notifContent}>
                <p className={styles.notifMessage}>
                  <span className={styles.notifSender}>{notif.senderId?.name || 'Someone'}</span>
                  : {notif.message}
                </p>
                <span className={styles.notifTime}>{new Date(notif.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderProfileDropdown = () => (
    <div className={styles.dropdown}>
      <div className={styles.dropdownHeader}>
        <span className={styles.dropdownAvatar}>{getInitial(user.name)}</span>
        <div className={styles.dropdownInfo}>
          <span className={styles.dropdownName}>{user.name}</span>
          <span className={`${styles.roleBadge} ${user.role === 'recruiter' ? styles.roleBadgeRecruiter : styles.roleBadgeCandidate}`}>
            {getRoleBadgeLabel(user.role)}
          </span>
        </div>
      </div>
      <div className={styles.dropdownDivider} />
      <button className={styles.dropdownItem} onClick={() => { 
        setDropdownOpen(false); 
        if (user.role === 'admin') navigate('/admin-profile');
        else navigate(user.role === 'recruiter' ? '/recruiter-profile' : '/profile-builder'); 
      }}>
        <span className={styles.dropdownItemIcon}>⚙️</span> Edit Profile
      </button>
      <button className={styles.dropdownItem} onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
        <span className={styles.dropdownItemIcon}>🛠️</span> Account Settings
      </button>
      <div className={styles.dropdownDivider} />
      <button className={styles.signOutBtn} onClick={handleSignOut} type="button">
        <svg className={styles.signOutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>
    </div>
  );

  if (loading) {
    return (
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.brand}>
            <img src="/logo.svg" alt="SyncHire Logo" className={styles.brandLogo} />
            <span className={styles.brandText}>SyncHire</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.brand}>
            <img src="/logo.svg" alt="SyncHire Logo" className={styles.brandLogo} />
            <span className={styles.brandText}>SyncHire</span>
          </Link>

          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerActive : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

          {!user ? (
            /* ─── PUBLIC HEADER ─── */
            <>
              <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
                <NavLink to="/" className={styles.publicLink} onClick={closeMobileMenu}>Home</NavLink>
                <NavLink to="/vision" className={styles.publicLink} onClick={closeMobileMenu}>Our Vision</NavLink>
                <NavLink to="/plans" className={styles.publicLink} onClick={closeMobileMenu}>Our Plans</NavLink>
                <NavLink to="/about" className={styles.publicLink} onClick={closeMobileMenu}>About Us</NavLink>
              </nav>

              <div className={`${styles.actionGroup} ${mobileMenuOpen ? styles.actionGroupOpen : ''}`}>
                <button className={styles.signInLink} onClick={openGatekeeper}>Sign In</button>
                <Link to="/signup" className={styles.joinNowBtn} onClick={closeMobileMenu}>Join Now</Link>
              </div>
            </>
          ) : user.role === 'candidate' ? (
            /* ─── CANDIDATE HEADER ─── */
            <>
              <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
                <NavLink to="/jobs" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} onClick={closeMobileMenu}>Explore Jobs</NavLink>
                <NavLink to="/pipeline" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} onClick={closeMobileMenu}>My Pipeline</NavLink>
              </nav>

              <div className={styles.profileControls}>
                <div className={styles.notifSection} ref={notifRef}>
                  <button className={styles.notifBellBtn} onClick={toggleNotifDropdown}>
                    🔔
                    {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
                  </button>
                  {notifDropdownOpen && renderNotificationsDropdown()}
                </div>

                <div className={styles.profileSection} ref={dropdownRef}>
                  <button className={styles.avatarBtn} onClick={toggleDropdown} aria-label="Open profile menu" type="button">
                    <span className={styles.avatar}>{getInitial(user.name)}</span>
                  </button>
                  {dropdownOpen && renderProfileDropdown()}
                </div>
              </div>
            </>
          ) : user.role === 'recruiter' ? (
            /* ─── RECRUITER HEADER ─── */
            <>
              <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
                <NavLink to="/create-job" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} onClick={closeMobileMenu}>Create Posting</NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} onClick={closeMobileMenu}>Active Portfolios</NavLink>
              </nav>

              <div className={styles.profileControls}>
                <div className={styles.notifSection} ref={notifRef}>
                  <button className={styles.notifBellBtn} onClick={toggleNotifDropdown}>
                    🔔
                    {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
                  </button>
                  {notifDropdownOpen && renderNotificationsDropdown()}
                </div>

                <div className={styles.profileSection} ref={dropdownRef}>
                  <button className={styles.avatarBtn} onClick={toggleDropdown} aria-label="Open profile menu" type="button">
                    <span className={styles.avatar}>{getInitial(user.name)}</span>
                  </button>
                  {dropdownOpen && renderProfileDropdown()}
                </div>
              </div>
            </>
          ) : user.role === 'admin' ? (
            /* ─── ADMIN HEADER ─── */
            <>
              <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
                <NavLink to="/admin-dashboard" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} onClick={closeMobileMenu}>Admin Panel</NavLink>
              </nav>

              <div className={styles.profileSection} ref={dropdownRef}>
                <button className={styles.avatarBtn} onClick={toggleDropdown} aria-label="Open profile menu" type="button">
                  <span className={styles.avatar}>{getInitial(user.name)}</span>
                </button>
                {dropdownOpen && renderProfileDropdown()}
              </div>
            </>
          ) : (
            /* ─── FALLBACK (unknown role) ─── */
            <div className={styles.profileSection} ref={dropdownRef}>
              <button className={styles.avatarBtn} onClick={toggleDropdown} aria-label="Open profile menu" type="button">
                <span className={styles.avatar}>{getInitial(user.name)}</span>
              </button>
              {dropdownOpen && renderProfileDropdown()}
            </div>
          )}
        </div>
      </header>

      {/* ─── GATEKEEPER MODAL ─── */}
      {showGatekeeper && (
        <div className={styles.gatekeeperOverlay} onClick={closeGatekeeper}>
          <div className={styles.gatekeeperModal} onClick={e => e.stopPropagation()}>
            <button className={styles.gatekeeperClose} onClick={closeGatekeeper}>×</button>
            <h2 className={styles.gatekeeperTitle}>Welcome to SyncHire</h2>
            <p className={styles.gatekeeperSubtitle}>Please select your workspace to continue.</p>
            
            <div className={styles.gatekeeperOptions}>
              <div className={styles.gatekeeperCard} onClick={() => navigateToRole('candidate')}>
                <div className={styles.gatekeeperIcon}>👨‍💻</div>
                <h3>Candidate Portal</h3>
                <p>Find jobs, track applications, and manage your profile.</p>
              </div>
              <div className={styles.gatekeeperCard} onClick={() => navigateToRole('recruiter')}>
                <div className={styles.gatekeeperIcon}>🏢</div>
                <h3>Recruiter Access</h3>
                <p>Post jobs, review applicants, and hire top talent.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
