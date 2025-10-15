import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('profile.firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('profile.dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('profile.gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender value'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profile.timezone')
    .optional()
    .isString()
    .withMessage('Timezone must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const updateData = {};
    if (req.body.profile) {
      Object.keys(req.body.profile).forEach(key => {
        updateData[`profile.${key}`] = req.body.profile[key];
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Internal server error'
    });
  }
});

// Update user preferences
router.put('/preferences', [
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('preferences.notifications.moodReminders')
    .optional()
    .isBoolean()
    .withMessage('Mood reminders must be a boolean'),
  body('preferences.notifications.journalReminders')
    .optional()
    .isBoolean()
    .withMessage('Journal reminders must be a boolean'),
  body('preferences.privacy.profileVisibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Profile visibility must be public or private'),
  body('preferences.privacy.dataSharing')
    .optional()
    .isBoolean()
    .withMessage('Data sharing must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const updateData = {};
    if (req.body.preferences) {
      // Handle nested preference updates
      const flattenPreferences = (obj, prefix = 'preferences') => {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            flattenPreferences(value, `${prefix}.${key}`);
          } else {
            updateData[`${prefix}.${key}`] = value;
          }
        });
      };
      
      flattenPreferences(req.body.preferences);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Preferences updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Failed to update preferences',
      message: 'Internal server error'
    });
  }
});

// Change password
router.put('/password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password field
    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid current password'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Failed to change password',
      message: 'Internal server error'
    });
  }
});

// Deactivate account
router.patch('/deactivate', async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    );

    res.json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      error: 'Failed to deactivate account',
      message: 'Internal server error'
    });
  }
});

// Delete account (soft delete by deactivating)
router.delete('/account', [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Get user with password field
    const user = await User.findById(req.user._id);
    
    // Verify password
    const isPasswordValid = await user.comparePassword(req.body.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password'
      });
    }

    // Deactivate account instead of hard delete
    user.isActive = false;
    await user.save();

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      message: 'Internal server error'
    });
  }
});

export default router;
