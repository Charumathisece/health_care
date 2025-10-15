import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Chat from '../models/Chat.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create new chat session
router.post('/sessions', [
  body('context.topic')
    .optional()
    .isIn([
      'general', 'anxiety', 'depression', 'stress', 'relationships',
      'work', 'sleep', 'self-care', 'goals', 'coping-strategies',
      'therapy', 'medication', 'mindfulness', 'exercise', 'nutrition'
    ])
    .withMessage('Invalid topic'),
  body('aiPersonality')
    .optional()
    .isIn(['supportive', 'professional', 'casual', 'empathetic'])
    .withMessage('Invalid AI personality')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const chatData = {
      userId: req.user._id,
      sessionId,
      messages: [],
      context: req.body.context || { topic: 'general' },
      aiPersonality: req.body.aiPersonality || 'supportive'
    };

    const chat = new Chat(chatData);
    await chat.save();

    res.status(201).json({
      message: 'Chat session created successfully',
      chat
    });

  } catch (error) {
    console.error('Create chat session error:', error);
    res.status(500).json({
      error: 'Failed to create chat session',
      message: 'Internal server error'
    });
  }
});

// Add message to chat session
router.post('/sessions/:sessionId/messages', [
  body('role')
    .isIn(['user', 'assistant', 'system'])
    .withMessage('Role must be user, assistant, or system'),
  body('content')
    .notEmpty()
    .isLength({ max: 5000 })
    .withMessage('Content is required and cannot exceed 5000 characters'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const chat = await Chat.findOne({
      sessionId: req.params.sessionId,
      userId: req.user._id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat session not found or inactive'
      });
    }

    const message = {
      role: req.body.role,
      content: req.body.content,
      timestamp: new Date(),
      metadata: req.body.metadata || {}
    };

    chat.messages.push(message);
    await chat.save();

    res.status(201).json({
      message: 'Message added successfully',
      chatMessage: message,
      sessionId: chat.sessionId
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      error: 'Failed to add message',
      message: 'Internal server error'
    });
  }
});

// Get user's chat sessions
router.get('/sessions', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('topic')
    .optional()
    .isIn([
      'general', 'anxiety', 'depression', 'stress', 'relationships',
      'work', 'sleep', 'self-care', 'goals', 'coping-strategies',
      'therapy', 'medication', 'mindfulness', 'exercise', 'nutrition'
    ])
    .withMessage('Invalid topic filter'),
  query('active')
    .optional()
    .isBoolean()
    .withMessage('Active filter must be a boolean')
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

    if (req.query.topic) {
      filter['context.topic'] = req.query.topic;
    }

    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }

    const [chats, total] = await Promise.all([
      Chat.find(filter)
        .select('-messages') // Exclude messages for list view
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Chat.countDocuments(filter)
    ]);

    res.json({
      chats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat sessions',
      message: 'Internal server error'
    });
  }
});

// Get specific chat session with messages
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOne({
      sessionId: req.params.sessionId,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat session not found'
      });
    }

    res.json({ chat });

  } catch (error) {
    console.error('Get chat session error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat session',
      message: 'Internal server error'
    });
  }
});

// Update chat session (context, summary, etc.)
router.put('/sessions/:sessionId', [
  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object'),
  body('summary')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Summary cannot exceed 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const chat = await Chat.findOneAndUpdate(
      { sessionId: req.params.sessionId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!chat) {
      return res.status(404).json({
        error: 'Chat session not found'
      });
    }

    res.json({
      message: 'Chat session updated successfully',
      chat
    });

  } catch (error) {
    console.error('Update chat session error:', error);
    res.status(500).json({
      error: 'Failed to update chat session',
      message: 'Internal server error'
    });
  }
});

// Add feedback to chat session
router.post('/sessions/:sessionId/feedback', [
  body('helpful')
    .isBoolean()
    .withMessage('Helpful must be a boolean'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const chat = await Chat.findOneAndUpdate(
      { sessionId: req.params.sessionId, userId: req.user._id },
      { feedback: req.body },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        error: 'Chat session not found'
      });
    }

    res.json({
      message: 'Feedback added successfully',
      chat
    });

  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      error: 'Failed to add feedback',
      message: 'Internal server error'
    });
  }
});

// Delete chat session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      sessionId: req.params.sessionId,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat session not found'
      });
    }

    res.json({
      message: 'Chat session deleted successfully'
    });

  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({
      error: 'Failed to delete chat session',
      message: 'Internal server error'
    });
  }
});

// Get chat statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Chat.aggregate([
      {
        $match: {
          userId: req.user._id
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          activeSessions: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          totalMessages: {
            $sum: { $size: '$messages' }
          },
          topicDistribution: {
            $push: '$context.topic'
          },
          averageRating: {
            $avg: '$feedback.rating'
          }
        }
      }
    ]);

    // Calculate topic distribution
    const topicCounts = {};
    if (stats[0]) {
      stats[0].topicDistribution.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    }

    res.json({
      stats: stats[0] || {
        totalSessions: 0,
        activeSessions: 0,
        totalMessages: 0,
        averageRating: 0
      },
      topicDistribution: topicCounts
    });

  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat statistics',
      message: 'Internal server error'
    });
  }
});

export default router;
