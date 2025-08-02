import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  SpaOutlined,
  AirOutlined,
  MusicNoteOutlined,
  FormatQuoteOutlined,
  PlayArrowOutlined,
  PauseOutlined,
  RefreshOutlined,
  FavoriteOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

const breathingExercises = [
  {
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    duration: 4,
    pattern: [4, 7, 8],
    color: colors.primary
  },
  {
    name: 'Box Breathing',
    description: 'Equal counts for inhale, hold, exhale, hold',
    duration: 4,
    pattern: [4, 4, 4, 4],
    color: colors.secondary
  },
  {
    name: 'Calm Breathing',
    description: 'Simple 4-6 breathing pattern',
    duration: 5,
    pattern: [4, 6],
    color: '#4caf50'
  }
];

const affirmations = [
  "I am worthy of love and respect.",
  "I choose peace over worry.",
  "I am stronger than my challenges.",
  "I trust in my ability to overcome difficulties.",
  "I am grateful for this moment.",
  "I deserve happiness and joy.",
  "I am in control of my thoughts and emotions.",
  "I choose to focus on what I can control.",
  "I am enough, just as I am.",
  "I welcome positive energy into my life."
];

const motivationalQuotes = [
  {
    text: "The only way out is through.",
    author: "Robert Frost"
  },
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne"
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "The greatest revolution of our generation is the discovery that human beings can alter their lives by altering their attitudes of mind.",
    author: "William James"
  },
  {
    text: "You have been assigned this mountain to show others it can be moved.",
    author: "Mel Robbins"
  }
];

export default function CalmingToolkit() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  const breathingPhases = ['Inhale', 'Hold', 'Exhale', 'Hold'];

  useEffect(() => {
    let interval;
    if (isBreathing && selectedExercise) {
      const currentPattern = selectedExercise.pattern[breathingPhase % selectedExercise.pattern.length];
      interval = setInterval(() => {
        setBreathingCount(prev => {
          if (prev >= currentPattern - 1) {
            setBreathingPhase(prevPhase => (prevPhase + 1) % selectedExercise.pattern.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, selectedExercise, breathingPhase]);

  const startBreathing = (exercise) => {
    setSelectedExercise(exercise);
    setIsBreathing(true);
    setBreathingPhase(0);
    setBreathingCount(0);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setSelectedExercise(null);
    setBreathingPhase(0);
    setBreathingCount(0);
  };

  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(randomIndex);
  };

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(randomIndex);
  };

  const toolkitSections = [
    {
      title: 'Breathing Exercises',
      icon: <AirOutlined />,
      color: colors.primary,
      description: 'Guided breathing techniques to help you relax and center yourself'
    },
    {
      title: 'Daily Affirmations',
      icon: <FavoriteOutlined />,
      color: colors.secondary,
      description: 'Positive statements to boost your self-confidence and mindset'
    },
    {
      title: 'Motivational Quotes',
      icon: <FormatQuoteOutlined />,
      color: '#4caf50',
      description: 'Inspiring words from great minds to uplift your spirit'
    },
    {
      title: 'Meditation Sounds',
      icon: <MusicNoteOutlined />,
      color: '#ff9800',
      description: 'Calming sounds and music to enhance your meditation practice'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Calming Toolkit
      </Typography>
      <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 4 }}>
        Your collection of tools for peace, mindfulness, and emotional well-being
      </Typography>

      {/* Toolkit Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {toolkitSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ 
                height: '100%',
                '&:hover': { 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-4px)'
                },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    backgroundColor: `${section.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: section.color
                  }}>
                    {React.cloneElement(section.icon, { sx: { fontSize: 32 } })}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Breathing Exercises */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <AirOutlined sx={{ mr: 1, color: colors.primary }} />
                Breathing Exercises
              </Typography>
              
              <Grid container spacing={2}>
                {breathingExercises.map((exercise, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ 
                      border: `2px solid ${exercise.color}20`,
                      '&:hover': { 
                        borderColor: `${exercise.color}40`,
                        boxShadow: `0 4px 20px ${exercise.color}20`
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: exercise.color }}>
                              {exercise.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                              {exercise.description}
                            </Typography>
                            <Chip 
                              label={`${exercise.duration} minutes`}
                              size="small"
                              sx={{ backgroundColor: `${exercise.color}20`, color: exercise.color }}
                            />
                          </Box>
                          <Button
                            variant="contained"
                            onClick={() => startBreathing(exercise)}
                            sx={{
                              backgroundColor: exercise.color,
                              '&:hover': { backgroundColor: `${exercise.color}dd` }
                            }}
                          >
                            Start
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Affirmations & Quotes */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={3}>
            {/* Daily Affirmations */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <FavoriteOutlined sx={{ mr: 1, color: colors.secondary }} />
                    Daily Affirmations
                  </Typography>
                  
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    backgroundColor: `${colors.secondary}10`,
                    borderRadius: 2,
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontStyle: 'italic', 
                      color: colors.secondary,
                      mb: 2,
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      "{affirmations[currentAffirmation]}"
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshOutlined />}
                      onClick={getRandomAffirmation}
                      sx={{
                        borderColor: colors.secondary,
                        color: colors.secondary,
                        '&:hover': {
                          borderColor: colors.secondaryDark,
                          backgroundColor: `${colors.secondary}10`
                        }
                      }}
                    >
                      New Affirmation
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Motivational Quotes */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <FormatQuoteOutlined sx={{ mr: 1, color: '#4caf50' }} />
                    Motivational Quotes
                  </Typography>
                  
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    backgroundColor: '#4caf5010',
                    borderRadius: 2,
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontStyle: 'italic', 
                      color: '#4caf50',
                      mb: 1,
                      minHeight: '72px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      "{motivationalQuotes[currentQuote].text}"
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                      — {motivationalQuotes[currentQuote].author}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshOutlined />}
                      onClick={getRandomQuote}
                      sx={{
                        borderColor: '#4caf50',
                        color: '#4caf50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: '#4caf5010'
                        }
                      }}
                    >
                      New Quote
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Breathing Exercise Dialog */}
      <Dialog 
        open={Boolean(selectedExercise)} 
        onClose={stopBreathing} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${selectedExercise?.color}10 0%, ${selectedExercise?.color}05 100%)`
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {selectedExercise?.name}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={(breathingCount + 1) / (selectedExercise?.pattern[breathingPhase % selectedExercise?.pattern.length] || 1) * 100}
              size={200}
              thickness={4}
              sx={{
                color: selectedExercise?.color,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Box sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: selectedExercise?.color }}>
                {selectedExercise?.pattern.length === 2 
                  ? (breathingPhase % 2 === 0 ? 'Inhale' : 'Exhale')
                  : breathingPhases[breathingPhase % breathingPhases.length]
                }
              </Typography>
              <Typography variant="h6" sx={{ color: colors.text.secondary }}>
                {(selectedExercise?.pattern[breathingPhase % selectedExercise?.pattern.length] || 0) - breathingCount}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 2 }}>
            {selectedExercise?.description}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={stopBreathing}
            sx={{
              backgroundColor: selectedExercise?.color,
              '&:hover': { backgroundColor: `${selectedExercise?.color}dd` },
              px: 4
            }}
          >
            Stop Exercise
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
