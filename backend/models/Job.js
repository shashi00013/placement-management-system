const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: String,
  requirements: [String],
  eligibilityCriteria: {
    minCgpa: Number,
    allowedBranches: [String],
  },
  location: String,
  package: String,
  openings: Number,
  deadline: Date,
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);