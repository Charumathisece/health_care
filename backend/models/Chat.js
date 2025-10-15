import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      model: String,
      tokens: Number,
      confidence: Number,
      processingTime: Number
    }
  }],
  context: {
    topic: {
      type: String,
      enum: [
        'general', 'anxiety', 'depression', 'stress', 'relationships',
        'work', 'sleep', 'self-care', 'goals', 'coping-strategies',
        'therapy', 'medication', 'mindfulness', 'exercise', 'nutrition'
      ],
      default: 'general'
    },
    mood: {
      type: String,
      enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy']
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'crisis'],
      default: 'low'
    },
    tags: [String]
  },
  aiPersonality: {
    type: String,
    enum: ['supportive', 'professional', 'casual', 'empathetic'],
    default: 'supportive'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  summary: {
    type: String,
    maxlength: 500
  },
  insights: {
    keyTopics: [String],
    emotionalTone: String,
    recommendedActions: [String],
    followUpSuggestions: [String]
  },
  feedback: {
    helpful: Boolean,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, sessionId: 1 });
chatSchema.index({ userId: 1, 'context.topic': 1 });
chatSchema.index({ userId: 1, isActive: 1 });

// Virtual for message count
chatSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for last message
chatSchema.virtual('lastMessage').get(function() {
  return this.messages[this.messages.length - 1];
});

export default mongoose.model('Chat', chatSchema);
