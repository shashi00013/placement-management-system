const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

router.use(protect);
router.use(roleCheck('tpo', 'superadmin'));

// Create job
router.post('/jobs', async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job
router.put('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job
router.delete('/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a job
router.get('/jobs/:jobId/applications', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email')
      .populate('jobId');
    
    // Get student profiles
    const appsWithProfiles = await Promise.all(applications.map(async (app) => {
      const profile = await StudentProfile.findOne({ userId: app.studentId._id });
      return { ...app.toObject(), studentProfile: profile };
    }));
    
    res.json(appsWithProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status
router.put('/applications/:id', async (req, res) => {
  try {
    const { status, interviewDate, interviewLink, remarks } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, interviewDate, interviewLink, remarks },
      { new: true }
    );
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload offer letter
router.post('/applications/:id/offer-letter', async (req, res) => {
  try {
    const { offerLetterUrl } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { offerLetterUrl, status: 'offer_letter_generated' },
      { new: true }
    );
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all applications (overview)
router.get('/applications/all', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('studentId', 'name email')
      .populate('jobId');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;