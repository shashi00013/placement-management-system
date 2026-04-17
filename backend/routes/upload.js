const express = require('express');
const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload resume
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const result = await uploadToCloudinary(req.file.buffer, 'resumes', {
      resource_type: 'auto',
    });
    
    await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { resumeUrl: result.secure_url }
    );
    
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload offer letter (TPO only)
router.post('/offer-letter/:applicationId', protect, upload.single('offerLetter'), async (req, res) => {
  try {
    if (req.user.role !== 'tpo' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const result = await uploadToCloudinary(req.file.buffer, 'offer-letters', {
      resource_type: 'auto',
    });
    
    await Application.findByIdAndUpdate(req.params.applicationId, {
      offerLetterUrl: result.secure_url,
      status: 'offer_letter_generated',
    });
    
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;