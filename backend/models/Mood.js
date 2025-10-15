import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['very-sad', 'sad', 'neutral', 'happy', 'very-happy']
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5
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
  activities: [{
    type: String,
    enum: [
      'work', 'exercise', 'socializing', 'family-time', 'hobbies',
      'meditation', 'reading', 'music', 'movies', 'cooking',
      'shopping', 'traveling', 'studying', 'gaming', 'sleeping',
      'eating', 'therapy', 'volunteering', 'nature', 'art'
    ]
  }],
  triggers: [{
    type: String,
    maxlength: 100
  }],
  notes: {
    type: String,
    maxlength: 1000
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'foggy']
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  socialInteraction: {
    type: String,
    enum: ['none', 'minimal', 'moderate', 'high']
  },
  location: {
    type: String,
    enum: ['home', 'work', 'school', 'outdoors', 'social-venue', 'other']
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
moodSchema.index({ userId: 1, createdAt: -1 });
moodSchema.index({ userId: 1, mood: 1 });
moodSchema.index({ userId: 1, moodScore: 1 });
moodSchema.index({ createdAt: 1 });

// Virtual for mood trend analysis
moodSchema.virtual('moodTrend').get(function() {
  // This would be calculated based on recent mood entries
  return 'stable'; // placeholder
});

export default mongoose.model('Mood', moodSchema);
