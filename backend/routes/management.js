const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

router.use(protect);
router.use(roleCheck('management', 'superadmin'));

// Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const studentsWithProfile = await StudentProfile.countDocuments({ profileCompleted: true });
    
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    
    const totalApplications = await Application.countDocuments();
    const selectedStudents = await Application.countDocuments({ status: 'selected' });
    const offerLettersGenerated = await Application.countDocuments({ status: 'offer_letter_generated' });
    
    const placementsByBranch = await StudentProfile.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: 'userId',
          foreignField: 'studentId',
          as: 'applications'
        }
      },
      {
        $unwind: {
          path: '$applications',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'applications.status': { $in: ['selected', 'offer_letter_generated'] }
        }
      },
      {
        $group: {
          _id: '$branch',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const topCompanies = await Job.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'jobId',
          as: 'applications'
        }
      },
      {
        $project: {
          company: 1,
          applicationsCount: { $size: '$applications' },
          selectedCount: {
            $size: {
              $filter: {
                input: '$applications',
                cond: { $in: ['$$this.status', ['selected', 'offer_letter_generated']] }
              }
            }
          }
        }
      },
      { $sort: { selectedCount: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      overview: {
        totalStudents,
        studentsWithProfile,
        totalJobs,
        openJobs,
        totalApplications,
        selectedStudents,
        offerLettersGenerated,
        placementPercentage: totalStudents > 0 ? ((selectedStudents + offerLettersGenerated) / totalStudents * 100).toFixed(2) : 0
      },
      branchWisePlacements: placementsByBranch,
      topCompanies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Monthly placement trends
router.get('/trends', async (req, res) => {
  try {
    const monthlyPlacements = await Application.aggregate([
      {
        $match: {
          status: { $in: ['selected', 'offer_letter_generated'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedAt' },
            month: { $month: '$appliedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json(monthlyPlacements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;