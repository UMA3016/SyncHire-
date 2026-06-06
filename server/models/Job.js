const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: {
        values: ['Full-time', 'Part-time', 'Remote', 'Internship'],
        message: '{VALUE} is not a valid job type',
      },
    },
    salary: {
      type: String,
      required: [true, 'Salary is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active',
    },
    applicationStartDate: {
      type: Date,
      default: Date.now,
    },
    applicationEndDate: {
      type: Date,
      required: [true, 'Application end date is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
