import express from 'express';
import { query, validationResult } from 'express-validator';
import Mood from '../models/Mood.js';
import Journal from '../models/Journal.js';
import Chat from '../models/Chat.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get comprehensive dashboard analytics
router.get('/dashboard', [
  query('period')
    .optional()
    .isIn(['week', 'month', 'quarter', 'year'])
    .withMessage('Period must be week, month, quarter, or year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

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

    const userId = req.user._id;

    // Parallel queries for better performance
    const [moodStats, journalStats, chatStats, recentActivity] = await Promise.all([
      // Mood statistics
      Mood.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalEntries: { $sum: 1 },
            averageMoodScore: { $avg: '$moodScore' },
            averageStressLevel: { $avg: '$stressLevel' },
            averageEnergyLevel: { $avg: '$energyLevel' },
            averageSleepHours: { $avg: '$sleepHours' },
            moodDistribution: { $push: '$mood' },
            emotionFrequency: { $push: '$emotions' }
          }
        }
      ]),

      // Journal statistics
      Journal.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: startDate },
            isArchived: { $ne: true }
          }
        },
        {
          $group: {
            _id: null,
            totalEntries: { $sum: 1 },
            totalWords: { $sum: '$wordCount' },
            averageWordsPerEntry: { $avg: '$wordCount' },
            categoryDistribution: { $push: '$category' },
            favoriteCount: { $sum: { $cond: ['$isFavorite', 1, 0] } }
          }
        }
      ]),

      // Chat statistics
      Chat.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalMessages: { $sum: { $size: '$messages' } },
            topicDistribution: { $push: '$context.topic' },
            averageRating: { $avg: '$feedback.rating' }
          }
        }
      ]),

      // Recent activity summary
      Promise.all([
        Mood.find({ userId, createdAt: { $gte: startDate } })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('mood moodScore createdAt'),
        Journal.find({ userId, createdAt: { $gte: startDate }, isArchived: { $ne: true } })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title category createdAt'),
        Chat.find({ userId, createdAt: { $gte: startDate } })
          .sort({ updatedAt: -1 })
          .limit(3)
          .select('sessionId context.topic updatedAt')
      ])
    ]);

    // Process mood distribution
    const moodDistribution = {};
    if (moodStats[0]) {
      moodStats[0].moodDistribution.forEach(mood => {
        moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
      });
    }

    // Process emotion frequency
    const emotionFrequency = {};
    if (moodStats[0] && moodStats[0].emotionFrequency) {
      moodStats[0].emotionFrequency.flat().forEach(emotion => {
        emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
      });
    }

    // Process journal category distribution
    const journalCategoryDistribution = {};
    if (journalStats[0]) {
      journalStats[0].categoryDistribution.forEach(category => {
        journalCategoryDistribution[category] = (journalCategoryDistribution[category] || 0) + 1;
      });
    }

    // Process chat topic distribution
    const chatTopicDistribution = {};
    if (chatStats[0]) {
      chatStats[0].topicDistribution.forEach(topic => {
        chatTopicDistribution[topic] = (chatTopicDistribution[topic] || 0) + 1;
      });
    }

    const [recentMoods, recentJournals, recentChats] = recentActivity;

    res.json({
      period,
      summary: {
        mood: moodStats[0] || {
          totalEntries: 0,
          averageMoodScore: 0,
          averageStressLevel: 0,
          averageEnergyLevel: 0,
          averageSleepHours: 0
        },
        journal: journalStats[0] || {
          totalEntries: 0,
          totalWords: 0,
          averageWordsPerEntry: 0,
          favoriteCount: 0
        },
        chat: chatStats[0] || {
          totalSessions: 0,
          totalMessages: 0,
          averageRating: 0
        }
      },
      distributions: {
        mood: moodDistribution,
        emotions: emotionFrequency,
        journalCategories: journalCategoryDistribution,
        chatTopics: chatTopicDistribution
      },
      recentActivity: {
        moods: recentMoods,
        journals: recentJournals,
        chats: recentChats
      }
    });

  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard analytics',
      message: 'Internal server error'
    });
  }
});

// Get mood trends over time
router.get('/mood-trends', [
  query('period')
    .optional()
    .isIn(['week', 'month', 'quarter', 'year'])
    .withMessage('Period must be week, month, quarter, or year'),
  query('granularity')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Granularity must be day, week, or month')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const period = req.query.period || 'month';
    const granularity = req.query.granularity || 'day';
    
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

    let dateFormat;
    switch (granularity) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-%U';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
    }

    const trends = await Mood.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: '$createdAt'
            }
          },
          averageMoodScore: { $avg: '$moodScore' },
          averageStressLevel: { $avg: '$stressLevel' },
          averageEnergyLevel: { $avg: '$energyLevel' },
          averageSleepHours: { $avg: '$sleepHours' },
          entryCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      period,
      granularity,
      trends
    });

  } catch (error) {
    console.error('Get mood trends error:', error);
    res.status(500).json({
      error: 'Failed to fetch mood trends',
      message: 'Internal server error'
    });
  }
});

// Get wellness insights and recommendations
router.get('/insights', async (req, res) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get recent data for analysis
    const [recentMoods, recentJournals, recentChats] = await Promise.all([
      Mood.find({ userId, createdAt: { $gte: thirtyDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(30),
      Journal.find({ userId, createdAt: { $gte: thirtyDaysAgo }, isArchived: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(20),
      Chat.find({ userId, createdAt: { $gte: thirtyDaysAgo } })
        .sort({ updatedAt: -1 })
        .limit(10)
    ]);

    // Generate insights based on data patterns
    const insights = [];
    const recommendations = [];

    // Mood pattern analysis
    if (recentMoods.length > 0) {
      const averageMood = recentMoods.reduce((sum, mood) => sum + mood.moodScore, 0) / recentMoods.length;
      const recentAverageMood = recentMoods.slice(0, 7).reduce((sum, mood) => sum + mood.moodScore, 0) / Math.min(7, recentMoods.length);
      
      if (recentAverageMood > averageMood) {
        insights.push({
          type: 'positive',
          title: 'Mood Improvement',
          description: 'Your mood has been trending upward in the past week!'
        });
      } else if (recentAverageMood < averageMood - 0.5) {
        insights.push({
          type: 'concern',
          title: 'Mood Decline',
          description: 'Your mood has been lower than usual recently.'
        });
        recommendations.push({
          category: 'mood',
          title: 'Consider Self-Care Activities',
          description: 'Try engaging in activities that usually make you feel better, or consider reaching out to a friend or counselor.'
        });
      }

      // Sleep analysis
      const sleepData = recentMoods.filter(mood => mood.sleepHours).map(mood => mood.sleepHours);
      if (sleepData.length > 0) {
        const averageSleep = sleepData.reduce((sum, hours) => sum + hours, 0) / sleepData.length;
        if (averageSleep < 6) {
          insights.push({
            type: 'concern',
            title: 'Insufficient Sleep',
            description: `Your average sleep is ${averageSleep.toFixed(1)} hours, which may be affecting your mood.`
          });
          recommendations.push({
            category: 'sleep',
            title: 'Improve Sleep Hygiene',
            description: 'Try to maintain a consistent sleep schedule and aim for 7-9 hours of sleep per night.'
          });
        }
      }
    }

    // Journal activity analysis
    if (recentJournals.length > 0) {
      const journalFrequency = recentJournals.length / 30; // entries per day
      if (journalFrequency > 0.5) {
        insights.push({
          type: 'positive',
          title: 'Consistent Journaling',
          description: 'You\'ve been maintaining a good journaling habit!'
        });
      } else if (journalFrequency < 0.1) {
        recommendations.push({
          category: 'journaling',
          title: 'Regular Journaling',
          description: 'Consider writing in your journal more regularly to track your thoughts and feelings.'
        });
      }
    }

    // Chat engagement analysis
    if (recentChats.length > 0) {
      const chatFrequency = recentChats.length / 30;
      if (chatFrequency > 0.2) {
        insights.push({
          type: 'positive',
          title: 'Active Support Seeking',
          description: 'You\'ve been actively using the AI chat for support.'
        });
      }
    }

    // General recommendations
    recommendations.push({
      category: 'general',
      title: 'Stay Consistent',
      description: 'Regular mood tracking and journaling can help you better understand your mental health patterns.'
    });

    res.json({
      insights,
      recommendations,
      dataPoints: {
        moodEntries: recentMoods.length,
        journalEntries: recentJournals.length,
        chatSessions: recentChats.length
      }
    });

  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      error: 'Failed to fetch insights',
      message: 'Internal server error'
    });
  }
});

export default router;
