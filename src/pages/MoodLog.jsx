import React, { useState, useEffect } from 'react';
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
  Fab,
  Alert,
  CircularProgress
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
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../services/api';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

const moodEmojis = ['😭', '😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😆', '🥰'];
const moodLabels = ['Devastated', 'Very Sad', 'Worried', 'Sad', 'Neutral', 'Content', 'Happy', 'Very Happy', 'Joyful', 'Blissful'];
const moodColors = ['#d32f2f', '#f44336', '#ff7043', '#ff9800', '#9e9e9e', '#66bb6a', '#4caf50', '#2e7d32', '#1976d2', '#e91e63'];

const predefinedTags = [
  'Work', 'Family', 'Friends', 'Health', 'Exercise', 'Sleep', 
  'Stress', 'Anxiety', 'Grateful', 'Excited', 'Tired', 'Motivated'
];

// AI-Powered Suggestions System (simplified for demo)
const getAISuggestions = (moodRating) => {
  const suggestions = {
    1: { // Devastated
      songs: [
        { title: "Weightless", artist: "Marconi Union", genre: "Ambient", mood: "Calming" },
        { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", mood: "Peaceful" }
      ],
      activities: [
        { title: "Deep Breathing Exercise", duration: "5 min", type: "Breathing" },
        { title: "Call a Trusted Friend", duration: "15 min", type: "Social" }
      ],
      quotes: [
        "This too shall pass. You are stronger than you know.",
        "It's okay to not be okay. Healing takes time."
      ],
      affirmations: [
        "I am worthy of love and compassion",
        "This feeling is temporary"
      ]
    },
    2: { // Very Sad
      songs: [
        { title: "The Sound of Silence", artist: "Simon & Garfunkel", genre: "Folk", mood: "Reflective" },
        { title: "Breathe Me", artist: "Sia", genre: "Pop", mood: "Healing" }
      ],
      activities: [
        { title: "Journaling", duration: "15 min", type: "Reflection" },
        { title: "Warm Bath", duration: "20 min", type: "Self-care" }
      ],
      quotes: [
        "Tears are words that need to be written.",
        "You are allowed to feel your feelings."
      ],
      affirmations: [
        "I allow myself to feel and heal",
        "My emotions are valid and temporary"
      ]
    },
    // Add more mood suggestions as needed
  };

  // Default suggestions for higher moods
  const defaultSuggestions = {
    songs: [
      { title: "Happy", artist: "Pharrell Williams", genre: "Pop", mood: "Uplifting" },
      { title: "Good as Hell", artist: "Lizzo", genre: "Pop", mood: "Empowering" }
    ],
    activities: [
      { title: "Dance to your favorite song", duration: "5 min", type: "Physical" },
      { title: "Call someone you love", duration: "10 min", type: "Social" }
    ],
    quotes: [
      "Life is beautiful and so are you.",
      "Keep shining, the world needs your light."
    ],
    affirmations: [
      "I am grateful for this moment",
      "I radiate positive energy"
    ]
  };

  return suggestions[moodRating] || defaultSuggestions;
};

export default function MoodLog() {
  const { user } = useAuth();
  const [moodRating, setMoodRating] = useState(5);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [recentMoods, setRecentMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMoods, setLoadingMoods] = useState(true);

  // Load recent mood entries on component mount
  useEffect(() => {
    loadRecentMoods();
  }, []);

  const loadRecentMoods = async () => {
    try {
      setLoadingMoods(true);
      const response = await apiClient.getMoodEntries({ limit: 5 });
      setRecentMoods(response.moods || []);
    } catch (error) {
      console.error('Failed to load recent moods:', error);
      setError('Failed to load recent mood entries');
    } finally {
      setLoadingMoods(false);
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to save your mood');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const moodData = {
        rating: moodRating,
        note: note.trim(),
        tags: selectedTags,
        emoji: moodEmojis[moodRating - 1],
        label: moodLabels[moodRating - 1],
        color: moodColors[moodRating - 1]
      };

      await apiClient.createMoodEntry(moodData);
      
      // Get AI suggestions
      const suggestions = getAISuggestions(moodRating);
      setAiSuggestions(suggestions);
      setShowSuggestions(true);

      // Reset form
      setNote('');
      setSelectedTags([]);
      
      // Reload recent moods
      await loadRecentMoods();
      
      toast.success('Mood logged successfully! 🎉');
    } catch (error) {
      console.error('Failed to save mood:', error);
      setError(error.message || 'Failed to save mood entry');
      toast.error('Failed to save mood entry');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            How are you feeling today?
          </Typography>
          <Typography variant="h6" sx={{ color: colors.text.secondary }}>
            Track your emotions and get personalized wellness suggestions
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Mood Logger */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <CardContent>
                {/* Mood Scale */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Rate your mood (1-10)
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2,
                    overflowX: 'auto',
                    pb: 1
                  }}>
                    {moodEmojis.map((emoji, index) => (
                      <Box
                        key={index}
                        onClick={() => setMoodRating(index + 1)}
                        sx={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          p: 1,
                          borderRadius: 2,
                          minWidth: 60,
                          backgroundColor: moodRating === index + 1 ? `${moodColors[index]}20` : 'transparent',
                          border: moodRating === index + 1 ? `2px solid ${moodColors[index]}` : '2px solid transparent',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: `${moodColors[index]}10`,
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <Typography variant="h4" sx={{ mb: 0.5 }}>
                          {emoji}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: moodColors[index],
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}>
                          {index + 1}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ 
                    textAlign: 'center',
                    color: moodColors[moodRating - 1],
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}>
                    {moodLabels[moodRating - 1]}
                  </Typography>
                </Box>

                {/* Note */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    What's on your mind? (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Share your thoughts, experiences, or what led to this mood..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>

                {/* Tags */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    <TagOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Add tags (Optional)
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {predefinedTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleTagToggle(tag)}
                        color={selectedTags.includes(tag) ? 'primary' : 'default'}
                        variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                        sx={{
                          '&:hover': {
                            backgroundColor: selectedTags.includes(tag) 
                              ? colors.primaryDark 
                              : `${colors.primary}10`
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    py: 2,
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
                    },
                    '&:disabled': {
                      background: colors.text.light
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <MoodOutlined sx={{ mr: 1 }} />
                      Log My Mood
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Moods */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  <CalendarTodayOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Moods
                </Typography>
                
                {loadingMoods ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : recentMoods.length === 0 ? (
                  <Typography variant="body2" sx={{ 
                    color: colors.text.secondary,
                    textAlign: 'center',
                    py: 3
                  }}>
                    No mood entries yet. Start by logging your first mood!
                  </Typography>
                ) : (
                  recentMoods.map((mood, index) => (
                    <Box
                      key={mood._id || index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: `${mood.color || moodColors[4]}10`,
                        border: `1px solid ${mood.color || moodColors[4]}30`
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        {mood.emoji || moodEmojis[4]}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {mood.label || 'Neutral'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                          {formatDate(mood.createdAt)}
                        </Typography>
                        {mood.note && (
                          <Typography variant="body2" sx={{ 
                            mt: 0.5,
                            color: colors.text.secondary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {mood.note}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* AI Suggestions Dialog */}
      <Dialog
        open={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: 'white',
          py: 3
        }}>
          <AutoAwesomeOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
          AI-Powered Wellness Suggestions
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {aiSuggestions && (
            <Grid container spacing={3}>
              {/* Music Suggestions */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', background: `linear-gradient(135deg, #1976d210 0%, #2e7d3210 100%)` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MusicNoteOutlined sx={{ mr: 1, color: '#1976d2' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Mood-Boosting Music
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
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                      }}>
                        <PlayArrowOutlined sx={{ mr: 2, color: colors.primary }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {song.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {song.artist} • {song.genre}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Activity Suggestions */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', background: `linear-gradient(135deg, #2e7d3210 0%, #4caf5010 100%)` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FitnessCenterOutlined sx={{ mr: 1, color: '#2e7d32' }} />
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
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
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
