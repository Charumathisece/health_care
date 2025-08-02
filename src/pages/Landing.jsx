import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
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
  SearchOutlined,
  LoginOutlined,
  PersonAddOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme/theme';

const features = [
  {
    icon: <MoodOutlined />,
    title: 'Mood Tracking',
    description: 'Log your daily emotions with our intuitive emoji-based system. Track patterns and understand your emotional journey.',
    color: colors.primary
  },
  {
    icon: <BookOutlined />,
    title: 'Digital Journal',
    description: 'Express your thoughts in a private, secure space with rich-text editing and customizable privacy settings.',
    color: colors.secondary
  },
  {
    icon: <TrendingUpOutlined />,
    title: 'Analytics Dashboard',
    description: 'Visualize your mental health trends with beautiful charts and insights to understand your progress.',
    color: '#4caf50'
  },
  {
    icon: <SpaOutlined />,
    title: 'Calming Toolkit',
    description: 'Access breathing exercises, meditation guides, and positive affirmations whenever you need them.',
    color: '#ff9800'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleStartPlanning = () => {
    if (searchQuery.trim()) {
      // Navigate based on search query
      if (searchQuery.toLowerCase().includes('mood')) {
        navigate('/signup?focus=mood');
      } else if (searchQuery.toLowerCase().includes('journal')) {
        navigate('/signup?focus=journal');
      } else if (searchQuery.toLowerCase().includes('calm') || searchQuery.toLowerCase().includes('relax')) {
        navigate('/signup?focus=toolkit');
      } else {
        navigate('/signup');
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Navigation */}
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          zIndex: 1100
        }}
      >
        <Toolbar>
          <Typography 
            variant="h5" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            SoulScribe
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<LoginOutlined />}
            onClick={handleLogin}
            sx={{ 
              mr: 2,
              color: colors.text.primary,
              '&:hover': {
                backgroundColor: `${colors.primary}10`
              }
            }}
          >
            LOGIN
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PersonAddOutlined />}
            onClick={handleGetStarted}
            sx={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              fontWeight: 600,
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
              }
            }}
          >
            SIGNUP
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(
            135deg,
            rgba(222, 170, 255, 0.9) 0%,
            rgba(166, 99, 204, 0.8) 50%,
            rgba(138, 43, 226, 0.9) 100%
          ),
          url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                FIND YOUR PERFECT MENTAL WELLNESS
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontWeight: 400,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                Receive personalized recommendations for mood tracking, journaling, and wellness activities
              </Typography>
              
              <Paper 
                elevation={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 3,
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <TextField
                  fullWidth
                  placeholder="What would you like to explore today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStartPlanning()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined sx={{ color: colors.primary }} />
                      </InputAdornment>
                    ),
                    sx: {
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      fontSize: '1.1rem',
                      py: 1
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleStartPlanning}
                  sx={{
                    background: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.secondary} 90%)`,
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 0,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${colors.secondary} 30%, ${colors.primary} 90%)`,
                    }
                  }}
                >
                  START JOURNEY
                </Button>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            Your Mental Wellness Companion
          </Typography>
          <Typography variant="h6" sx={{ color: colors.text.secondary }}>
            Track your emotions, journal your thoughts, and discover insights about your mental health journey with SoulScribe.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: `${feature.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: 40, color: feature.color }
                      })}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ 
        py: 8, 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Ready to Start Your Wellness Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who have transformed their mental health with SoulScribe
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              backgroundColor: 'white',
              color: colors.primary,
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
