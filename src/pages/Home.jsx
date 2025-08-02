import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Container,
  TextField,
  InputAdornment,
  Paper,
  Fade
} from '@mui/material';
import {
  MoodOutlined,
  BookOutlined,
  TrendingUpOutlined,
  SpaOutlined,
  EmojiEventsOutlined,
  AddOutlined,
  SearchOutlined,
  PlayArrowOutlined,
  FavoriteOutlined,
  SelfImprovementOutlined,
  SmartToyOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/theme';

const moodEmojis = ['😭', '😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😆', '🥰'];

export default function Home() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const todaysMood = state.moods.filter(mood => 
    new Date(mood.date).toDateString() === new Date().toDateString()
  );

  const recentJournalEntries = state.journalEntries.slice(-3);

  const quickActions = [
    {
      title: 'Log Mood',
      icon: <MoodOutlined />,
      color: colors.primary,
      path: '/mood',
      description: 'How are you feeling today?'
    },
    {
      title: 'Write Journal',
      icon: <BookOutlined />,
      color: colors.secondary,
      path: '/journal',
      description: 'Capture your thoughts'
    },
    {
      title: 'Calming Tools',
      icon: <SpaOutlined />,
      color: '#4caf50',
      path: '/toolkit',
      description: 'Find your peace'
    },
    {
      title: 'View Analytics',
      icon: <TrendingUpOutlined />,
      color: '#ff9800',
      path: '/analytics',
      description: 'Track your progress'
    }
  ];

  const handleStartJourney = () => {
    if (searchQuery.trim()) {
      // Navigate to relevant section based on search
      if (searchQuery.toLowerCase().includes('mood')) {
        navigate('/mood');
      } else if (searchQuery.toLowerCase().includes('journal')) {
        navigate('/journal');
      } else if (searchQuery.toLowerCase().includes('calm') || searchQuery.toLowerCase().includes('relax')) {
        navigate('/toolkit');
      } else {
        navigate('/analytics');
      }
    } else {
      navigate('/mood'); // Default action
    }
  };

  const dashboardFeatures = [
    {
      title: 'Mood Tracking',
      subtitle: 'Daily Emotional Insights',
      description: 'Track your daily emotions with our intuitive system and discover patterns in your mental health journey.',
      icon: <MoodOutlined sx={{ fontSize: 48 }} />,
      path: '/mood',
      color: colors.primary
    },
    {
      title: 'Digital Journal',
      subtitle: 'Private Thought Space',
      description: 'Express your thoughts in a secure, private environment with rich-text editing capabilities.',
      icon: <BookOutlined sx={{ fontSize: 48 }} />,
      path: '/journal',
      color: colors.secondary
    },
    {
      title: 'Analytics Dashboard',
      subtitle: 'Progress Visualization',
      description: 'Visualize your mental health trends with beautiful charts and comprehensive insights.',
      icon: <TrendingUpOutlined sx={{ fontSize: 48 }} />,
      path: '/analytics',
      color: '#4caf50'
    },
    {
      title: 'Calming Toolkit',
      subtitle: 'Mindfulness Resources',
      description: 'Access breathing exercises, meditation guides, and positive affirmations for instant relief.',
      icon: <SpaOutlined sx={{ fontSize: 48 }} />,
      path: '/toolkit',
      color: '#ff9800'
    },
    {
      title: 'AI Chat Assistant',
      subtitle: 'Conversational Support',
      description: 'Chat with our AI mental health companion for personalized guidance and emotional support.',
      icon: <SmartToyOutlined sx={{ fontSize: 48 }} />,
      path: '/ai-chat',
      color: '#9c27b0'
    },
    {
      title: 'Personalized Support',
      subtitle: 'AI-Powered Guidance',
      description: 'Receive personalized recommendations and support based on your unique wellness profile.',
      icon: <SelfImprovementOutlined sx={{ fontSize: 48 }} />,
      path: '/profile',
      color: '#2196f3'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: colors.text.primary,
            mb: 1,
            textAlign: 'center'
          }}
        >
          SoulScribe Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: colors.text.secondary,
            textAlign: 'center',
            mb: 3
          }}
        >
          Your Mental Wellness Command Center
        </Typography>
        
        {/* Welcome Message */}
        <Paper 
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
            borderLeft: `4px solid ${colors.primary}`,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome back, {state.user.name}! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Ready to continue your wellness journey? Choose from the features below to get started.
          </Typography>
        </Paper>
      </Box>

      {/* Dashboard Features Grid */}
      <Grid container spacing={3}>
        {dashboardFeatures.map((feature, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  borderColor: feature.color
                }
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Icon */}
                <Box 
                  sx={{ 
                    mb: 3,
                    color: feature.color,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {feature.icon}
                </Box>
                
                {/* Title */}
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    color: colors.text.primary
                  }}
                >
                  {feature.title}
                </Typography>
                
                {/* Subtitle */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: feature.color,
                    fontWeight: 500,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem'
                  }}
                >
                  {feature.subtitle}
                </Typography>
                
                {/* Description */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: colors.text.secondary,
                    lineHeight: 1.6,
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Quick Stats Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Your Wellness Journey
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`
              }}
            >
              <Typography variant="h3" sx={{ color: colors.primary, fontWeight: 700, mb: 1 }}>
                {state.user.streak}
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                Day Streak
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.primary}15 100%)`
              }}
            >
              <Typography variant="h3" sx={{ color: colors.secondary, fontWeight: 700, mb: 1 }}>
                {state.moods.length}
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                Mood Entries
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                background: `linear-gradient(135deg, #4caf5015 0%, #ff980015 100%)`
              }}
            >
              <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700, mb: 1 }}>
                {state.journalEntries.length}
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                Journal Entries
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
