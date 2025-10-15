import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Mood from '../models/Mood.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create new mood entry
router.post('/', [
  body('mood')
    .isIn(['very-sad', 'sad', 'neutral', 'happy', 'very-happy'])
    .withMessage('Invalid mood value'),
  body('moodScore')
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be between 1 and 5'),
  body('emotions')
    .optional()
    .isArray()
    .withMessage('Emotions must be an array'),
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('stressLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress level must be between 1 and 10'),
  body('energyLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Energy level must be between 1 and 10'),
  body('sleepHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const moodData = {
      ...req.body,
      userId: req.user._id
    };

    const mood = new Mood(moodData);
    await mood.save();

    res.status(201).json({
      message: 'Mood entry created successfully',
      mood
    });

  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({
      error: 'Failed to create mood entry',
      message: 'Internal server error'
    });
  }
});

// Get user's mood entries with pagination and filtering
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  query('mood')
    .optional()
    .isIn(['very-sad', 'sad', 'neutral', 'happy', 'very-happy'])
    .withMessage('Invalid mood filter')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { userId: req.user._id };
    
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    if (req.query.mood) {
      filter.mood = req.query.mood;
    }

    const [moods, total] = await Promise.all([
      Mood.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Mood.countDocuments(filter)
    ]);

    res.json({
      moods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({
      error: 'Failed to fetch mood entries',
      message: 'Internal server error'
    });
  }
});

// Get mood statistics
router.get('/stats', [
  query('period')
    .optional()
    .isIn(['week', 'month', 'quarter', 'year'])
    .withMessage('Period must be week, month, quarter, or year')
], async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    const stats = await Mood.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          averageMoodScore: { $avg: '$moodScore' },
          totalEntries: { $sum: 1 },
          moodDistribution: {
            $push: '$mood'
          },
          averageStressLevel: { $avg: '$stressLevel' },
          averageEnergyLevel: { $avg: '$energyLevel' },
          averageSleepHours: { $avg: '$sleepHours' }
        }
      }
    ]);

    // Calculate mood distribution
    const moodCounts = {};
    if (stats[0]) {
      stats[0].moodDistribution.forEach(mood => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });
    }

    res.json({
      period,
      stats: stats[0] || {
        averageMoodScore: 0,
        totalEntries: 0,
        averageStressLevel: 0,
        averageEnergyLevel: 0,
        averageSleepHours: 0
      },
      moodDistribution: moodCounts
    });

  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch mood statistics',
      message: 'Internal server error'
    });
  }
});

// Get specific mood entry
router.get('/:id', async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mood) {
      return res.status(404).json({
        error: 'Mood entry not found'
      });
    }

    res.json({ mood });

  } catch (error) {
    console.error('Get mood error:', error);
    res.status(500).json({
      error: 'Failed to fetch mood entry',
      message: 'Internal server error'
    });
  }
});

// Update mood entry
router.put('/:id', [
  body('mood')
    .optional()
    .isIn(['very-sad', 'sad', 'neutral', 'happy', 'very-happy'])
    .withMessage('Invalid mood value'),
  body('moodScore')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be between 1 and 5'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const mood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!mood) {
      return res.status(404).json({
        error: 'Mood entry not found'
      });
    }

    res.json({
      message: 'Mood entry updated successfully',
      mood
    });

  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({
      error: 'Failed to update mood entry',
      message: 'Internal server error'
    });
  }
});

// Delete mood entry
router.delete('/:id', async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!mood) {
      return res.status(404).json({
        error: 'Mood entry not found'
      });
    }

    res.json({
      message: 'Mood entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({
      error: 'Failed to delete mood entry',
      message: 'Internal server error'
    });
  }
});

export default router;
