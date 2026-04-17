const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  registrationNo: {
    type: String,
    required: true,
    unique: true,
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'],
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  phone: String,
  resumeUrl: String,
  skills: [String],
  passingYear: Number,
  profileCompleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);