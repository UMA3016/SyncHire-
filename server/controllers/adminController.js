const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' });
    }

    if (user.role === 'recruiter') {
      // Find all jobs by this recruiter
      const jobs = await Job.find({ recruiterId: user._id });
      const jobIds = jobs.map(j => j._id);
      // Delete all applications for these jobs
      await Application.deleteMany({ jobId: { $in: jobIds } });
      // Delete all jobs by this recruiter
      await Job.deleteMany({ recruiterId: user._id });
    } else if (user.role === 'candidate') {
      // Delete all applications by this candidate
      await Application.deleteMany({ candidateId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User and all associated data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllJobs
};
