const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  loadDemoData,
} = require('../controllers/jobController');

const authMiddleware = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(authMiddleware, createJob);
router.route('/load-demo-data').post(authMiddleware, loadDemoData);
router.route('/:id').get(getJobById).put(authMiddleware, updateJob).delete(authMiddleware, deleteJob);

// Apply to job endpoint
router.post('/:jobId/apply', authMiddleware, applyToJob);

module.exports = router;
