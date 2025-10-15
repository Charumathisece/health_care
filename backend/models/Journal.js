import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  mood: {
    type: String,
    enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy']
  },
  emotions: [{
    type: String,
    enum: [
      'anxious', 'stressed', 'overwhelmed', 'depressed', 'lonely',
      'angry', 'frustrated', 'confused', 'tired', 'energetic',
      'calm', 'peaceful', 'grateful', 'hopeful', 'excited',
      'confident', 'loved', 'proud', 'content', 'motivated'
    ]
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  category: {
    type: String,
    enum: ['daily', 'gratitude', 'goals', 'reflection', 'therapy', 'dreams', 'other'],
    default: 'daily'
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number, // in minutes
    default: 0
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'audio', 'video', 'document']
    },
    url: String,
    filename: String,
    size: Number
  }],
  aiInsights: {
    sentiment: {
      type: String,
      enum: ['very-negative', 'negative', 'neutral', 'positive', 'very-positive']
    },
    keyThemes: [String],
    suggestedActions: [String],
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  reminderDate: Date,
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
journalSchema.index({ userId: 1, createdAt: -1 });
journalSchema.index({ userId: 1, category: 1 });
journalSchema.index({ userId: 1, tags: 1 });
journalSchema.index({ userId: 1, isFavorite: 1 });
journalSchema.index({ userId: 1, isArchived: 1 });

// Pre-save middleware to calculate word count and reading time
journalSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const words = this.content.trim().split(/\s+/).length;
    this.wordCount = words;
    this.readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute
  }
  next();
});

// Virtual for excerpt
journalSchema.virtual('excerpt').get(function() {
  return this.content.length > 150 ? 
    this.content.substring(0, 150) + '...' : 
    this.content;
});

export default mongoose.model('Journal', journalSchema);
