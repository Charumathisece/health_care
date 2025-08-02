import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,

  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab
} from '@mui/material';
import {
  MoodOutlined,
  AddOutlined,
  CalendarTodayOutlined,
  TagOutlined,
  MusicNoteOutlined,
  SelfImprovementOutlined,
  FormatQuoteOutlined,
  FitnessCenterOutlined,
  AutoAwesomeOutlined,
  PlayArrowOutlined,
  FavoriteOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { actionTypes } from '../context/AppContext';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

const moodEmojis = ['😭', '😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😆', '🥰'];
const moodLabels = ['Devastated', 'Very Sad', 'Worried', 'Sad', 'Neutral', 'Content', 'Happy', 'Very Happy', 'Joyful', 'Blissful'];
const moodColors = ['#d32f2f', '#f44336', '#ff7043', '#ff9800', '#9e9e9e', '#66bb6a', '#4caf50', '#2e7d32', '#1976d2', '#e91e63'];

const predefinedTags = [
  'Work', 'Family', 'Friends', 'Health', 'Exercise', 'Sleep', 
  'Stress', 'Anxiety', 'Grateful', 'Excited', 'Tired', 'Motivated'
];

// AI-Powered Suggestions System
const getAISuggestions = (moodRating, note, tags, userHistory) => {
  const suggestions = {
    1: { // Devastated
      songs: [
        { title: "Weightless", artist: "Marconi Union", genre: "Ambient", mood: "Calming" },
        { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", mood: "Peaceful" },
        { title: "Mad World", artist: "Gary Jules", genre: "Alternative", mood: "Understanding" }
      ],
      activities: [
        { title: "Deep Breathing Exercise", duration: "5 min", type: "Breathing" },
        { title: "Call a Trusted Friend", duration: "15 min", type: "Social" },
        { title: "Gentle Stretching", duration: "10 min", type: "Physical" }
      ],
      quotes: [
        "This too shall pass. You are stronger than you know.",
        "It's okay to not be okay. Healing takes time.",
        "You've survived 100% of your difficult days so far.",
        "Rock bottom became the solid foundation on which I rebuilt my life.",
        "The wound is the place where the Light enters you.",
        "Sometimes you need to sit lonely on the floor in a quiet room in order to hear your own voice.",
        "Your current situation is not your final destination.",
        "Even the darkest night will end and the sun will rise."
      ],
      affirmations: [
        "I am worthy of love and compassion",
        "This feeling is temporary",
        "I have the strength to get through this",
        "I am brave enough to feel my emotions",
        "I trust in my ability to heal",
        "I am not alone in this journey",
        "Every breath I take brings me closer to peace",
        "I give myself permission to rest and recover",
        "My pain has purpose and will lead to growth",
        "I am resilient beyond measure"
      ]
    },
    2: { // Very Sad
      songs: [
        { title: "The Sound of Silence", artist: "Simon & Garfunkel", genre: "Folk", mood: "Reflective" },
        { title: "Hurt", artist: "Johnny Cash", genre: "Country", mood: "Cathartic" },
        { title: "Breathe Me", artist: "Sia", genre: "Pop", mood: "Healing" }
      ],
      activities: [
        { title: "Journaling", duration: "15 min", type: "Reflection" },
        { title: "Warm Bath", duration: "20 min", type: "Self-care" },
        { title: "Listen to Nature Sounds", duration: "10 min", type: "Relaxation" }
      ],
      quotes: [
        "Tears are words that need to be written.",
        "You are allowed to feel your feelings.",
        "Healing isn't linear, and that's perfectly okay.",
        "Sadness is a wall between two gardens.",
        "The deeper that sorrow carves into your being, the more joy you can contain.",
        "What we plant in the soil of contemplation, we shall reap in the harvest of action.",
        "Your feelings are valid, and you deserve to be heard.",
        "Sometimes the heart sees what is invisible to the eye.",
        "Allow yourself to feel deeply. It's the path to healing."
      ],
      affirmations: [
        "I honor my emotions",
        "I am gentle with myself",
        "Tomorrow is a new day",
        "I allow myself to grieve and heal at my own pace",
        "My sadness is temporary, my strength is permanent",
        "I am learning and growing through this experience",
        "I deserve compassion, especially from myself",
        "Each tear I shed waters the seeds of my healing",
        "I am safe to feel all of my emotions",
        "My vulnerability is a sign of my courage"
      ]
    },
    3: { // Worried
      songs: [
        { title: "Don't Stop Me Now", artist: "Queen", genre: "Rock", mood: "Uplifting" },
        { title: "Three Little Birds", artist: "Bob Marley", genre: "Reggae", mood: "Reassuring" },
        { title: "Here Comes the Sun", artist: "The Beatles", genre: "Rock", mood: "Hopeful" }
      ],
      activities: [
        { title: "Meditation", duration: "10 min", type: "Mindfulness" },
        { title: "Progressive Muscle Relaxation", duration: "15 min", type: "Relaxation" },
        { title: "Write Down Worries", duration: "10 min", type: "Reflection" }
      ],
      quotes: [
        "Worry does not empty tomorrow of its sorrow, it empties today of its strength.",
        "You can't control everything. Focus on what you can.",
        "Anxiety is the dizziness of freedom.",
        "Worrying is like a rocking chair: it gives you something to do but never gets you anywhere.",
        "Peace comes from within. Do not seek it without.",
        "The present moment is the only time over which we have dominion.",
        "Breathe in peace, breathe out worry.",
        "You have been assigned this mountain to show others it can be moved.",
        "Calm mind brings inner strength and self-confidence."
      ],
      affirmations: [
        "I can handle whatever comes my way",
        "I focus on the present moment",
        "I trust in my ability to cope",
        "I release what I cannot control",
        "I am safe and protected in this moment",
        "My worries do not define my reality",
        "I choose peace over anxiety",
        "I have overcome challenges before, and I will again",
        "I breathe in calm and breathe out tension",
        "I am stronger than my fears"
      ]
    },
    4: { // Sad
      songs: [
        { title: "Lean on Me", artist: "Bill Withers", genre: "Soul", mood: "Supportive" },
        { title: "The Climb", artist: "Miley Cyrus", genre: "Pop", mood: "Motivational" },
        { title: "Stronger", artist: "Kelly Clarkson", genre: "Pop", mood: "Empowering" }
      ],
      activities: [
        { title: "Take a Walk", duration: "20 min", type: "Physical" },
        { title: "Creative Expression", duration: "30 min", type: "Creative" },
        { title: "Practice Gratitude", duration: "5 min", type: "Reflection" }
      ],
      quotes: [
        "Every storm runs out of rain.",
        "You are braver than you believe.",
        "Small steps still move you forward."
      ],
      affirmations: [
        "I am resilient",
        "I choose hope over fear",
        "I am worthy of happiness"
      ]
    },
    5: { // Neutral
      songs: [
        { title: "Good Vibrations", artist: "The Beach Boys", genre: "Pop", mood: "Positive" },
        { title: "Walking on Sunshine", artist: "Katrina and the Waves", genre: "Pop", mood: "Energetic" },
        { title: "I Can See Clearly Now", artist: "Johnny Nash", genre: "Reggae", mood: "Optimistic" }
      ],
      activities: [
        { title: "Try Something New", duration: "30 min", type: "Exploration" },
        { title: "Connect with Nature", duration: "20 min", type: "Outdoor" },
        { title: "Practice Mindfulness", duration: "10 min", type: "Mindfulness" }
      ],
      quotes: [
        "Today is a blank canvas. Paint it beautiful.",
        "Neutral is the perfect starting point for growth.",
        "Balance is not something you find, it's something you create."
      ],
      affirmations: [
        "I am open to new possibilities",
        "I create my own happiness",
        "I am exactly where I need to be"
      ]
    },
    6: { // Content
      songs: [
        { title: "Happy", artist: "Pharrell Williams", genre: "Pop", mood: "Joyful" },
        { title: "Count on Me", artist: "Bruno Mars", genre: "Pop", mood: "Warm" },
        { title: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz", mood: "Grateful" }
      ],
      activities: [
        { title: "Share Your Joy", duration: "15 min", type: "Social" },
        { title: "Creative Project", duration: "45 min", type: "Creative" },
        { title: "Help Someone", duration: "20 min", type: "Service" }
      ],
      quotes: [
        "Contentment is natural wealth.",
        "Happiness is not a destination, it's a way of life.",
        "Gratitude turns what we have into enough."
      ],
      affirmations: [
        "I appreciate this moment",
        "I am grateful for my journey",
        "I radiate positive energy"
      ]
    },
    7: { // Happy
      songs: [
        { title: "Can't Stop the Feeling", artist: "Justin Timberlake", genre: "Pop", mood: "Energetic" },
        { title: "Uptown Funk", artist: "Bruno Mars", genre: "Funk", mood: "Fun" },
        { title: "Dancing Queen", artist: "ABBA", genre: "Pop", mood: "Celebratory" }
      ],
      activities: [
        { title: "Dance Party", duration: "15 min", type: "Physical" },
        { title: "Call Friends/Family", duration: "20 min", type: "Social" },
        { title: "Plan Something Fun", duration: "10 min", type: "Planning" }
      ],
      quotes: [
        "Happiness is contagious. Spread it everywhere.",
        "Joy is the simplest form of gratitude.",
        "Your smile is your logo, your personality is your business card.",
        "The secret of being happy is accepting where you are in life and making the most out of everyday.",
        "Happiness is not something ready-made. It comes from your own actions.",
        "Count your age by friends, not years. Count your life by smiles, not tears.",
        "The happiest people don't have the best of everything, they make the best of everything.",
        "Happiness is when what you think, what you say, and what you do are in harmony.",
        "Every day may not be good, but there's something good in every day."
      ],
      affirmations: [
        "I deserve to be happy",
        "My happiness inspires others",
        "I choose joy in every moment",
        "I am grateful for all the good in my life",
        "My positive energy attracts wonderful experiences",
        "I celebrate the small victories in my day",
        "I am a source of light and positivity",
        "My happiness is a gift I give to the world",
        "I find joy in simple pleasures",
        "I am exactly where I need to be right now"
      ]
    },
    8: { // Very Happy
      songs: [
        { title: "I Want It That Way", artist: "Backstreet Boys", genre: "Pop", mood: "Nostalgic" },
        { title: "Mr. Blue Sky", artist: "Electric Light Orchestra", genre: "Rock", mood: "Euphoric" },
        { title: "Good as Hell", artist: "Lizzo", genre: "Pop", mood: "Confident" }
      ],
      activities: [
        { title: "Celebrate Achievement", duration: "30 min", type: "Celebration" },
        { title: "Share Good News", duration: "15 min", type: "Social" },
        { title: "Capture the Moment", duration: "10 min", type: "Memory" }
      ],
      quotes: [
        "Success is not the key to happiness. Happiness is the key to success.",
        "The best way to pay for a lovely moment is to enjoy it.",
        "Happiness is not by chance, but by choice."
      ],
      affirmations: [
        "I celebrate my victories",
        "I am proud of my progress",
        "I attract positive experiences"
      ]
    },
    9: { // Joyful
      songs: [
        { title: "Celebration", artist: "Kool & The Gang", genre: "Funk", mood: "Party" },
        { title: "I Feel Good", artist: "James Brown", genre: "Soul", mood: "Energetic" },
        { title: "Best Day of My Life", artist: "American Authors", genre: "Indie", mood: "Triumphant" }
      ],
      activities: [
        { title: "Organize a Gathering", duration: "60 min", type: "Social" },
        { title: "Try Adventure Activity", duration: "90 min", type: "Adventure" },
        { title: "Express Gratitude", duration: "10 min", type: "Reflection" }
      ],
      quotes: [
        "Joy is what happens when we allow ourselves to recognize how good things really are.",
        "Find joy in the ordinary.",
        "The most wasted of days is one without laughter."
      ],
      affirmations: [
        "I am filled with joy and light",
        "I spread happiness wherever I go",
        "Life is beautiful and I embrace it fully"
      ]
    },
    10: { // Blissful
      songs: [
        { title: "Lovely Day", artist: "Bill Withers", genre: "Soul", mood: "Blissful" },
        { title: "Pure Imagination", artist: "Gene Wilder", genre: "Musical", mood: "Magical" },
        { title: "Somewhere Over the Rainbow", artist: "Israel Kamakawiwoʻole", genre: "Hawaiian", mood: "Peaceful" }
      ],
      activities: [
        { title: "Meditation & Gratitude", duration: "20 min", type: "Spiritual" },
        { title: "Create Art", duration: "60 min", type: "Creative" },
        { title: "Connect with Nature", duration: "45 min", type: "Outdoor" }
      ],
      quotes: [
        "Bliss is a state of being, not a destination.",
        "In every moment, there is infinite possibility.",
        "Peace comes from within. Do not seek it without.",
        "The present moment is a gift. That's why it's called the present.",
        "When you realize there is nothing lacking, the whole world belongs to you.",
        "Happiness is your nature. It is not wrong to desire it.",
        "The secret of health for both mind and body is not to mourn for the past, nor to worry about the future, but to live the present moment wisely and earnestly.",
        "Bliss is not a feeling but a state of being. In the state of bliss, everything is loved.",
        "True happiness is to enjoy the present, without anxious dependence upon the future."
      ],
      affirmations: [
        "I am at peace with myself and the world",
        "I am connected to infinite love and wisdom",
        "I am grateful for this perfect moment",
        "I am one with the universe and all its beauty",
        "I radiate love and light to all beings",
        "I am living my highest potential",
        "I am blessed beyond measure",
        "I trust in the divine flow of life",
        "I am complete and whole exactly as I am",
        "Every breath fills me with divine love and peace"
      ]
    }
  };
  
  return suggestions[moodRating] || suggestions[5];
};

export default function MoodLog() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [mood, setMood] = useState({
    rating: 5,
    note: '',
    tags: [],
    date: new Date().toISOString()
  });

  const handleTagToggle = (tag) => {
    setMood(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = () => {
    if (mood.rating === 0) {
      toast.error('Please select a mood rating');
      return;
    }

    const newMood = {
      ...mood,
      id: Date.now(),
      date: new Date().toISOString()
    };

    dispatch({ type: actionTypes.ADD_MOOD, payload: newMood });
    
    // Generate AI suggestions based on mood
    const suggestions = getAISuggestions(mood.rating, mood.note, mood.tags, state.moods);
    setAiSuggestions(suggestions);
    setShowSuggestions(true);
    
    toast.success('Mood logged successfully! +10 XP');
    
    // Reset form
    setMood({
      rating: 5,
      note: '',
      tags: [],
      date: new Date().toISOString()
    });
    setOpen(false);
  };

  const recentMoods = state.moods.slice(-7).reverse();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Mood Log
      </Typography>
      <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 4 }}>
        Track your emotional journey day by day
      </Typography>

      {/* Today's Mood Summary */}
      <Card sx={{ mb: 4, background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)` }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                How are you feeling today?
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                Take a moment to check in with yourself and log your current mood.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddOutlined />}
                  onClick={() => setOpen(true)}
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
                    }
                  }}
                >
                  Log Your Mood
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Moods */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Recent Mood History
      </Typography>

      {recentMoods.length > 0 ? (
        <Grid container spacing={2}>
          {recentMoods.map((moodEntry, index) => (
            <Grid item xs={12} sm={6} md={4} key={moodEntry.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ 
                  '&:hover': { 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h3" sx={{ mr: 2 }}>
                        {moodEmojis[moodEntry.rating - 1]}
                      </Typography>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {moodLabels[moodEntry.rating - 1]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                          {new Date(moodEntry.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    {moodEntry.note && (
                      <Typography variant="body2" sx={{ mb: 2, color: colors.text.primary }}>
                        "{moodEntry.note}"
                      </Typography>
                    )}

                    {moodEntry.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {moodEntry.tags.map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: `${colors.primary}20`,
                              color: colors.secondary,
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <MoodOutlined sx={{ fontSize: 64, color: colors.text.light, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No mood entries yet
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>
              Start tracking your emotional journey today
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                '&:hover': {
                  borderColor: colors.primaryDark,
                  backgroundColor: `${colors.primary}10`
                }
              }}
            >
              Log First Mood
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mood Logging Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            How are you feeling?
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h1" sx={{ mb: 2, fontSize: '4rem' }}>
              {moodEmojis[mood.rating - 1]}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: moodColors[mood.rating - 1], fontWeight: 600 }}>
              {moodLabels[mood.rating - 1]}
            </Typography>
            
            {/* Custom Emoji Mood Selector */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: 1,
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              {moodEmojis.map((emoji, index) => (
                <IconButton
                  key={index}
                  onClick={() => setMood(prev => ({ ...prev, rating: index + 1 }))}
                  sx={{
                    fontSize: '2rem',
                    width: 60,
                    height: 60,
                    border: mood.rating === index + 1 ? `3px solid ${moodColors[index]}` : '2px solid transparent',
                    borderRadius: '50%',
                    backgroundColor: mood.rating === index + 1 ? `${moodColors[index]}20` : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: `${moodColors[index]}30`,
                      transform: 'scale(1.1)',
                      borderColor: moodColors[index]
                    }
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, color: colors.text.secondary }}>
              Tap an emoji to select your mood
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Add a note (optional)"
            placeholder="What's on your mind? How are you feeling and why?"
            value={mood.note}
            onChange={(e) => setMood(prev => ({ ...prev, note: e.target.value }))}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Tags (optional)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {predefinedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagToggle(tag)}
                variant={mood.tags.includes(tag) ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: mood.tags.includes(tag) ? colors.primary : 'transparent',
                  color: mood.tags.includes(tag) ? 'white' : colors.text.primary,
                  borderColor: colors.primary,
                  '&:hover': {
                    backgroundColor: mood.tags.includes(tag) ? colors.primaryDark : `${colors.primary}10`
                  }
                }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
              }
            }}
          >
            Save Mood
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Suggestions Dialog */}
      <Dialog 
        open={showSuggestions} 
        onClose={() => setShowSuggestions(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${colors.primary}05 0%, ${colors.secondary}05 100%)`,
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <AutoAwesomeOutlined sx={{ mr: 1, color: colors.primary, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary }}>
              AI-Powered Suggestions
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Personalized recommendations based on your current mood
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {aiSuggestions && (
            <Grid container spacing={3}>
              {/* Song Recommendations */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MusicNoteOutlined sx={{ mr: 1, color: colors.primary }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Mood-Matched Music
                      </Typography>
                    </Box>
                    {aiSuggestions.songs.map((song, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2, 
                        mb: 1, 
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <PlayArrowOutlined sx={{ mr: 2, color: colors.secondary }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {song.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {song.artist} • {song.genre}
                          </Typography>
                          <Chip 
                            label={song.mood} 
                            size="small" 
                            sx={{ 
                              mt: 0.5, 
                              backgroundColor: `${colors.primary}20`,
                              color: colors.primary,
                              fontSize: '0.7rem'
                            }} 
                          />
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Activity Suggestions */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.primary}10 100%)` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FitnessCenterOutlined sx={{ mr: 1, color: colors.secondary }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Recommended Activities
                      </Typography>
                    </Box>
                    {aiSuggestions.activities.map((activity, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 2, 
                        mb: 1, 
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <SelfImprovementOutlined sx={{ mr: 2, color: colors.primary }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {activity.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {activity.duration} • {activity.type}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Inspirational Quotes */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', background: `linear-gradient(135deg, #4caf5010 0%, #ff980010 100%)` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FormatQuoteOutlined sx={{ mr: 1, color: '#4caf50' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Inspirational Quotes
                      </Typography>
                    </Box>
                    {aiSuggestions.quotes.map((quote, index) => (
                      <Box key={index} sx={{ 
                        p: 2, 
                        mb: 1, 
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.7)',
                        borderLeft: `4px solid #4caf50`
                      }}>
                        <Typography variant="body1" sx={{ 
                          fontStyle: 'italic',
                          color: colors.text.primary,
                          lineHeight: 1.6
                        }}>
                          "{quote}"
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Positive Affirmations */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', background: `linear-gradient(135deg, #ff980010 0%, #e91e6310 100%)` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FavoriteOutlined sx={{ mr: 1, color: '#e91e63' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Positive Affirmations
                      </Typography>
                    </Box>
                    {aiSuggestions.affirmations.map((affirmation, index) => (
                      <Box key={index} sx={{ 
                        p: 2, 
                        mb: 1, 
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.7)',
                        textAlign: 'center'
                      }}>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 500,
                          color: '#e91e63',
                          lineHeight: 1.6
                        }}>
                          {affirmation}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={() => setShowSuggestions(false)}
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
              },
              px: 4
            }}
          >
            Thank You, AI! 🤖✨
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
