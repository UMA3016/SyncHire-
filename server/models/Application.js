const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  resumePath: {
    type: String,
    required: [true, 'Resume is required'],
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Application pipeline status
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Call Received', 'Selection Confirmed', 'Rejected'],
    default: 'Applied',
  },
  interviewDate: { type: String },
  interviewTime: { type: String },
  interviewLink: { type: String },
  // Profile snapshot at time of application
  profilePicture: String,
  skills: [String],
  qualification: [
    {
      degree: String,
      institution: String,
      year: String,
    },
  ],
});

module.exports = mongoose.model('Application', applicationSchema);
