import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getAdminStats, getAllUsers, deleteUser, getAllJobs } from '../assets/services/adminService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import AdminDashboardImage from '../assets/admin_dashboard_3d.png';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [statsData, usersData, jobsData] = await Promise.all([
          getAdminStats(),
          getAllUsers(),
          getAllJobs()
        ]);
        setStats(statsData.stats);
        setUsers(usersData.users);
        setJobs(jobsData.jobs);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.container}>
          <Loader message="Loading Admin Panel..." />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>Admin Control Panel</h1>
            <p>System Overview & Management</p>
          </div>
          <div className={styles.headerImageContainer}>
            <img src={AdminDashboardImage} alt="Admin Dashboard 3D UI" className={styles.headerImage} />
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={activeTab === 'Overview' ? styles.activeTab : ''} onClick={() => setActiveTab('Overview')}>Overview</button>
          <button className={activeTab === 'Users' ? styles.activeTab : ''} onClick={() => setActiveTab('Users')}>Manage Users</button>
          <button className={activeTab === 'Jobs' ? styles.activeTab : ''} onClick={() => setActiveTab('Jobs')}>Manage Jobs</button>
        </div>

        {activeTab === 'Overview' && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Users</h3>
              <p className={styles.statValue}>{stats?.totalUsers || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Candidates</h3>
              <p className={styles.statValue}>{stats?.totalCandidates || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Recruiters</h3>
              <p className={styles.statValue}>{stats?.totalRecruiters || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Jobs</h3>
              <p className={styles.statValue}>{stats?.totalJobs || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Applications</h3>
              <p className={styles.statValue}>{stats?.totalApplications || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`${styles.badge} ${styles[u.role]}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className={styles.btnDelete} onClick={() => handleDeleteUser(u._id)}>Ban User</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan="5" className={styles.empty}>No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Jobs' && (
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Posted</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j._id}>
                    <td>{j.title}</td>
                    <td>{j.company}</td>
                    <td>{j.location}</td>
                    <td><span className={`${styles.badge} ${styles[j.status] || styles.defaultBadge}`}>{j.status}</span></td>
                    <td>{new Date(j.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {jobs.length === 0 && <tr><td colSpan="5" className={styles.empty}>No jobs found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;
