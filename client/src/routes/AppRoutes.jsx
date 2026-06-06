import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Jobs from '../pages/Jobs';
import JobDetails from '../pages/JobDetails';
import CreateJob from '../pages/CreateJob';
import EditJob from '../pages/EditJob';
import Applications from '../pages/Applications';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import PasswordLogin from '../pages/PasswordLogin';
import ForgotPassword from '../pages/ForgotPassword';
import RecruiterDashboard from '../pages/RecruiterDashboard';
import ProfileBuilder from '../pages/ProfileBuilder';
import RecruiterProfile from '../pages/RecruiterProfile';
import CandidatePipeline from '../pages/CandidatePipeline';
import Vision from '../pages/Vision';
import Plans from '../pages/Plans';
import About from '../pages/About';
import Settings from '../pages/Settings';
import Notifications from '../pages/Notifications';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vision" element={<Vision />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/about" element={<About />} />
      <Route path="/jobs" element={<Jobs />} />
      
      {/* Protected Job Details */}
      <Route 
        path="/jobs/:id" 
        element={
          <ProtectedRoute allowedRoles={['candidate', 'recruiter']}>
            <JobDetails />
          </ProtectedRoute>
        } 
      />
      
      {/* Auth Routes */}
      <Route path="/login" element={<PasswordLogin />} />
      <Route path="/password-login" element={<PasswordLogin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Candidate Protected Routes */}
      <Route 
        path="/profile-builder" 
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <ProfileBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pipeline" 
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidatePipeline />
          </ProtectedRoute>
        } 
      />

      {/* Recruiter Protected Routes */}
      <Route 
        path="/create-job" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <CreateJob />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter-profile" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-job/:id" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <EditJob />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/applications/:id" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <Applications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/screening" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Shared Protected Routes */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute allowedRoles={['candidate', 'recruiter']}>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute allowedRoles={['candidate', 'recruiter']}>
            <Notifications />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
