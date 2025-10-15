import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Journal from '../models/Journal.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create new journal entry
router.post('/', [
  body('title')
    .notEmpty()
    .isLength({ max: 200 })
    .withMessage('Title is required and cannot exceed 200 characters'),
  body('content')
    .notEmpty()
    .isLength({ max: 10000 })
    .withMessage('Content is required and cannot exceed 10000 characters'),
  body('mood')
    .optional()
    .isIn(['very-sad', 'sad', 'neutral', 'happy', 'very-happy'])
    .withMessage('Invalid mood value'),
  body('category')
    .optional()
    .isIn(['daily', 'gratitude', 'goals', 'reflection', 'therapy', 'dreams', 'other'])
    .withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const journalData = {
      ...req.body,
      userId: req.user._id
    };

    const journal = new Journal(journalData);
    await journal.save();

    res.status(201).json({
      message: 'Journal entry created successfully',
      journal
    });

  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({
      error: 'Failed to create journal entry',
      message: 'Internal server error'
    });
  }
});

// Get user's journal entries with pagination and filtering
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('category')
    .optional()
    .isIn(['daily', 'gratitude', 'goals', 'reflection', 'therapy', 'dreams', 'other'])
    .withMessage('Invalid category filter'),
  query('tags')
    .optional()
    .isString()
    .withMessage('Tags filter must be a string'),
  query('search')
    .optional()
    .isString()
    .withMessage('Search query must be a string'),
  query('favorites')
    .optional()
    .isBoolean()
    .withMessage('Favorites filter must be a boolean')
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
    const filter = { 
      userId: req.user._id,
      isArchived: { $ne: true }
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',') };
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.favorites === 'true') {
      filter.isFavorite = true;
    }

    const [journals, total] = await Promise.all([
      Journal.find(filter)
        .select('-content') // Exclude full content for list view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Journal.countDocuments(filter)
    ]);

    res.json({
      journals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({
      error: 'Failed to fetch journal entries',
      message: 'Internal server error'
    });
  }
});

// Get specific journal entry
router.get('/:id', async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!journal) {
      return res.status(404).json({
        error: 'Journal entry not found'
      });
    }

    res.json({ journal });

  } catch (error) {
    console.error('Get journal error:', error);
    res.status(500).json({
      error: 'Failed to fetch journal entry',
      message: 'Internal server error'
    });
  }
});

// Update journal entry
router.put('/:id', [
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Content cannot exceed 10000 characters'),
  body('mood')
    .optional()
    .isIn(['very-sad', 'sad', 'neutral', 'happy', 'very-happy'])
    .withMessage('Invalid mood value'),
  body('category')
    .optional()
    .isIn(['daily', 'gratitude', 'goals', 'reflection', 'therapy', 'dreams', 'other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!journal) {
      return res.status(404).json({
        error: 'Journal entry not found'
      });
    }

    res.json({
      message: 'Journal entry updated successfully',
      journal
    });

  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({
      error: 'Failed to update journal entry',
      message: 'Internal server error'
    });
  }
});

// Toggle favorite status
router.patch('/:id/favorite', async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!journal) {
      return res.status(404).json({
        error: 'Journal entry not found'
      });
    }

    journal.isFavorite = !journal.isFavorite;
    await journal.save();

    res.json({
      message: `Journal entry ${journal.isFavorite ? 'added to' : 'removed from'} favorites`,
      journal
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      error: 'Failed to toggle favorite status',
      message: 'Internal server error'
    });
  }
});

// Archive journal entry
router.patch('/:id/archive', async (req, res) => {
  try {
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isArchived: true },
      { new: true }
    );

    if (!journal) {
      return res.status(404).json({
        error: 'Journal entry not found'
      });
    }

    res.json({
      message: 'Journal entry archived successfully',
      journal
    });

  } catch (error) {
    console.error('Archive journal error:', error);
    res.status(500).json({
      error: 'Failed to archive journal entry',
      message: 'Internal server error'
    });
  }
});

// Delete journal entry
router.delete('/:id', async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!journal) {
      return res.status(404).json({
        error: 'Journal entry not found'
      });
    }

    res.json({
      message: 'Journal entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({
      error: 'Failed to delete journal entry',
      message: 'Internal server error'
    });
  }
});

// Get journal statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Journal.aggregate([
      {
        $match: {
          userId: req.user._id,
          isArchived: { $ne: true }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalWords: { $sum: '$wordCount' },
          averageWordsPerEntry: { $avg: '$wordCount' },
          totalReadingTime: { $sum: '$readingTime' },
          categoryCounts: {
            $push: '$category'
          },
          favoriteCount: {
            $sum: { $cond: ['$isFavorite', 1, 0] }
          }
        }
      }
    ]);

    // Calculate category distribution
    const categoryCounts = {};
    if (stats[0]) {
      stats[0].categoryCounts.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    }

    res.json({
      stats: stats[0] || {
        totalEntries: 0,
        totalWords: 0,
        averageWordsPerEntry: 0,
        totalReadingTime: 0,
        favoriteCount: 0
      },
      categoryDistribution: categoryCounts
    });

  } catch (error) {
    console.error('Get journal stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch journal statistics',
      message: 'Internal server error'
    });
  }
});

export default router;
