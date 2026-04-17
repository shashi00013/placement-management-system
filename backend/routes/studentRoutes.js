const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');

router.use(protect);
router.use(roleCheck('student'));

// Get/Update profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { registrationNo, branch, cgpa, phone, skills, passingYear } = req.body;
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { registrationNo, branch, cgpa, phone, skills, passingYear, profileCompleted: true },
      { new: true, runValidators: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View jobs
router.get('/jobs', async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const jobs = await Job.find({ 
      status: 'open',
      deadline: { $gt: new Date() }
    }).sort('-createdAt');
    
    // Filter jobs based on eligibility
    const eligibleJobs = jobs.filter(job => {
      if (job.eligibilityCriteria.minCgpa && profile.cgpa < job.eligibilityCriteria.minCgpa) {
        return false;
      }
      if (job.eligibilityCriteria.allowedBranches?.length > 0 && 
          !job.eligibilityCriteria.allowedBranches.includes(profile.branch)) {
        return false;
      }
      return true;
    });
    
    res.json(eligibleJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for job
router.post('/jobs/:jobId/apply', async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile.resumeUrl) {
      return res.status(400).json({ message: 'Please upload your resume before applying' });
    }
    
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'open') {
      return res.status(404).json({ message: 'Job not available' });
    }
    
    const existingApp = await Application.findOne({ studentId: req.user._id, jobId: job._id });
    if (existingApp) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }
    
    const application = await Application.create({
      studentId: req.user._id,
      jobId: job._id,
    });
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId')
      .sort('-appliedAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;