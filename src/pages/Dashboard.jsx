import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip
} from '@mui/material';
import {
  TrendingUpOutlined,
  EmojiEventsOutlined,
  LocalFireDepartmentOutlined,
  BookOutlined
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/theme';
import { useNavigate } from 'react-router-dom';

const moodEmojis = ['😭', '😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😆', '🥰'];

export default function Dashboard() {
  const { state } = useApp();

  // Process mood data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const moodChartData = last7Days.map(date => {
    const dayMoods = state.moods.filter(mood => 
      mood.date.split('T')[0] === date
    );
    const avgMood = dayMoods.length > 0 
      ? dayMoods.reduce((sum, mood) => sum + mood.rating, 0) / dayMoods.length
      : 0;
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: Math.round(avgMood * 10) / 10,
      entries: dayMoods.length
    };
  });

  // Calculate streak
  const calculateStreak = () => {
    const sortedMoods = [...state.moods].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    
    for (let mood of sortedMoods) {
      const moodDate = new Date(mood.date);
      const diffTime = Math.abs(currentDate - moodDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= streak + 1) {
        streak++;
        currentDate = moodDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Stats cards data
  const stats = [
    {
      title: 'Current Streak',
      value: `${currentStreak} days`,
      icon: <LocalFireDepartmentOutlined />,
      color: '#ff6b35',
      change: '+2 from last week'
    },
    {
      title: 'Total Mood Logs',
      value: state.moods.length,
      icon: <TrendingUpOutlined />,
      color: colors.primary,
      change: `${state.moods.filter(m => {
        const today = new Date();
        const moodDate = new Date(m.date);
        return today.getTime() - moodDate.getTime() < 7 * 24 * 60 * 60 * 1000;
      }).length} this week`
    },
    {
      title: 'Journal Entries',
      value: state.journalEntries.length,
      icon: <BookOutlined />,
      color: colors.secondary,
      change: `${state.journalEntries.filter(e => {
        const today = new Date();
        const entryDate = new Date(e.date);
        return today.getTime() - entryDate.getTime() < 7 * 24 * 60 * 60 * 1000;
      }).length} this week`
    },
    {
      title: 'Current Level',
      value: `Level ${state.user.level}`,
      icon: <EmojiEventsOutlined />,
      color: '#4caf50',
      change: `${state.user.xp} XP earned`
    }
  ];

  // Use the useNavigate hook from react-router-dom
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 4 }}>
        Your mental wellness journey at a glance
      </Typography>

      {/* Quick Navigation Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Chip
          label="Mood Log"
          color="primary"
          variant="outlined"
          onClick={() => navigate('/mood')}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        />
        <Chip
          label="Journal"
          color="secondary"
          variant="outlined"
          onClick={() => navigate('/journal')}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        />
        <Chip
          label="Analytics"
          color="success"
          variant="outlined"
          onClick={() => navigate('/analytics')}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        />
        <Chip
          label="Calming Toolkit"
          color="info"
          variant="outlined"
          onClick={() => navigate('/toolkit')}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        />
        <Chip
          label="Patient Details"
          color="warning"
          variant="outlined"
          onClick={() => navigate('/patient-details')}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              '&:hover': { 
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: `${stat.color}20`, 
                    color: stat.color,
                    mr: 2,
                    width: 48,
                    height: 48
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: colors.text.light }}>
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Mood Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Mood Trend (Last 7 Days)
              </Typography>
              
              {state.moods.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke={colors.text.secondary} />
                    <YAxis domain={[0, 10]} stroke={colors.text.secondary} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: `1px solid ${colors.primary}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke={colors.primary}
                      strokeWidth={3}
                      dot={{ fill: colors.secondary, strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: colors.secondary }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                    Start logging your moods to see trends here
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {state.moods.slice(-5).reverse().map((mood, index) => (
                  <Box key={mood.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    backgroundColor: `${colors.primary}05`,
                    border: `1px solid ${colors.primary}20`
                  }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                      {moodEmojis[mood.rating - 1]}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Mood logged
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        {new Date(mood.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${mood.rating}/5`}
                      size="small"
                      sx={{ 
                        backgroundColor: colors.primary,
                        color: 'white'
                      }}
                    />
                  </Box>
                ))}

                {state.journalEntries.slice(-3).reverse().map((entry, index) => (
                  <Box key={entry.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    backgroundColor: `${colors.secondary}05`,
                    border: `1px solid ${colors.secondary}20`
                  }}>
                    <BookOutlined sx={{ mr: 2, color: colors.secondary }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Journal entry: {entry.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                        {new Date(entry.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                {state.moods.length === 0 && state.journalEntries.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      No recent activity
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Your Progress
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Level Progress
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {state.user.xp}/1000 XP
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(state.user.xp % 1000) / 10} 
                      sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        backgroundColor: `${colors.primary}20`,
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          borderRadius: 6
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                      Weekly Goals
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Daily mood check-ins</Typography>
                        <Chip 
                          label={`${Math.min(7, state.moods.filter(m => {
                            const today = new Date();
                            const moodDate = new Date(m.date);
                            return today.getTime() - moodDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                          }).length)}/7`}
                          size="small"
                          color={state.moods.filter(m => {
                            const today = new Date();
                            const moodDate = new Date(m.date);
                            return today.getTime() - moodDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                          }).length >= 7 ? 'success' : 'default'}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Journal entries</Typography>
                        <Chip 
                          label={`${Math.min(3, state.journalEntries.filter(e => {
                            const today = new Date();
                            const entryDate = new Date(e.date);
                            return today.getTime() - entryDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                          }).length)}/3`}
                          size="small"
                          color={state.journalEntries.filter(e => {
                            const today = new Date();
                            const entryDate = new Date(e.date);
                            return today.getTime() - entryDate.getTime() < 7 * 24 * 60 * 60 * 1000;
                          }).length >= 3 ? 'success' : 'default'}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                    Achievements
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {state.moods.length >= 1 && (
                      <Chip 
                        icon={<EmojiEventsOutlined />}
                        label="First Mood Log"
                        sx={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                      />
                    )}
                    {state.journalEntries.length >= 1 && (
                      <Chip 
                        icon={<BookOutlined />}
                        label="First Journal Entry"
                        sx={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}
                      />
                    )}
                    {currentStreak >= 3 && (
                      <Chip 
                        icon={<LocalFireDepartmentOutlined />}
                        label="3-Day Streak"
                        sx={{ backgroundColor: '#ff6b3520', color: '#ff6b35' }}
                      />
                    )}
                    {currentStreak >= 7 && (
                      <Chip 
                        icon={<LocalFireDepartmentOutlined />}
                        label="Week Warrior"
                        sx={{ backgroundColor: '#4caf5020', color: '#4caf50' }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
