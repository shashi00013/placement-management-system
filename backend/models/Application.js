const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'offer_letter_generated'],
    default: 'applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  interviewDate: Date,
  interviewLink: String,
  offerLetterUrl: String,
  remarks: String,
});

applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);