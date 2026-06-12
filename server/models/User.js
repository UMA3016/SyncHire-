const mongoose = require('mongoose');

// Applied Job tracking schema
const AppliedJobSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Call Received', 'Selection Confirmed', 'Rejected'],
    default: 'Applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  interviewDate: { type: String },
  interviewTime: { type: String },
  interviewLink: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    // AICTE Profile Builder additions
    profilePicture: {
      type: String,
    },
    qualification: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    resumeFile: {
      type: String,
    },
    // Recruiter Specific additions
    companySize: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    // Candidate job application pipeline tracker
    appliedJobs: [AppliedJobSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
