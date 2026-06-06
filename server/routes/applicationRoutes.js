const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getApplicationsByJob,
  updateApplicationStatus,
  getMyPipeline,
} = require('../controllers/applicationController');

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Candidate: submit application
router.route('/').post(authMiddleware, applyForJob);

// Candidate: get own pipeline
router.route('/my-pipeline').get(authMiddleware, getMyPipeline);

// Recruiter: get applications for a job
router.route('/job/:jobId').get(authMiddleware, getApplicationsByJob);

// Recruiter: update application status
router.route('/:id/status').put(authMiddleware, updateApplicationStatus);

module.exports = router;
