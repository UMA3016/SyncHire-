const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { getAdminStats, getAllUsers, deleteUser, getAllJobs } = require('../controllers/adminController');

// All routes require both authentication and admin role
router.use(authMiddleware, adminMiddleware);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);

module.exports = router;
