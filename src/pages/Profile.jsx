import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Avatar,
  Divider,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  PersonOutlined,
  EditOutlined,
  EmojiEventsOutlined,
  TrendingUpOutlined,
  CalendarTodayOutlined,
  FavoriteOutlined,
  BookOutlined,
  LocalFireDepartmentOutlined,
  StarOutlined,
  SettingsOutlined,
  NotificationsOutlined,
  SecurityOutlined,
  PaletteOutlined,
  LanguageOutlined,
  HelpOutlineOutlined,
  LogoutOutlined,
  CameraAltOutlined,
  InsightsOutlined,
  SentimentSatisfiedAltOutlined,
  TimelineOutlined,
  AssessmentOutlined,
  WorkspacePremiumOutlined,
  MilitaryTechOutlined,
  EmojiEmotionsOutlined,
  SelfImprovementOutlined,
  PsychologyOutlined,
  HealthAndSafetyOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { actionTypes } from '../context/AppContext';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

const achievements = [
  {
    id: 'first_entry',
    title: 'First Steps',
    description: 'Created your first journal entry',
    icon: <BookOutlined />,
    color: colors.primary,
    requirement: 1,
    type: 'journal_entries'
  },
  {
    id: 'mood_tracker',
    title: 'Mood Tracker',
    description: 'Logged 10 mood entries',
    icon: <SentimentSatisfiedAltOutlined />,
    color: colors.secondary,
    requirement: 10,
    type: 'mood_entries'
  },
  {
    id: 'week_streak',
    title: 'Weekly Warrior',
    description: 'Maintained a 7-day streak',
    icon: <LocalFireDepartmentOutlined />,
    color: '#ff6b35',
    requirement: 7,
    type: 'streak'
  },
  {
    id: 'reflection_master',
    title: 'Reflection Master',
    description: 'Written 25 journal entries',
    icon: <PsychologyOutlined />,
    color: '#4ecdc4',
    requirement: 25,
    type: 'journal_entries'
  },
  {
    id: 'mindful_month',
    title: 'Mindful Month',
    description: 'Used the app for 30 days',
    icon: <SelfImprovementOutlined />,
    color: '#45b7d1',
    requirement: 30,
    type: 'days_active'
  },
  {
    id: 'wellness_champion',
    title: 'Wellness Champion',
    description: 'Completed 50 mood logs',
    icon: <HealthAndSafetyOutlined />,
    color: '#96ceb4',
    requirement: 50,
    type: 'mood_entries'
  },
  {
    id: 'storyteller',
    title: 'Storyteller',
    description: 'Written 10,000 words in journal',
    icon: <WorkspacePremiumOutlined />,
    color: '#feca57',
    requirement: 10000,
    type: 'total_words'
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Maintained a 30-day streak',
    icon: <MilitaryTechOutlined />,
    color: '#ff9ff3',
    requirement: 30,
    type: 'streak'
  }
];

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    aria-labelledby={`profile-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

export default function Profile() {
  const { state, dispatch } = useApp();
  const [tabValue, setTabValue] = useState(0);
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: state.user.name || 'User',
    email: 'user@soulscribe.com',
    bio: 'On a journey of self-discovery and mental wellness.',
    location: 'Your City',
    joinDate: '2024-01-01'
  });
  const [settings, setSettings] = useState(state.settings);

  // Calculate user statistics
  const userStats = useMemo(() => {
    const totalMoodEntries = state.moods?.length || 0;
    const totalJournalEntries = state.journalEntries?.length || 0;
    const totalWords = state.journalEntries?.reduce((sum, entry) => sum + (entry.wordCount || 0), 0) || 0;
    const avgMood = totalMoodEntries > 0 
      ? (state.moods.reduce((sum, mood) => sum + mood.rating, 0) / totalMoodEntries).toFixed(1)
      : 0;
    
    // Calculate streak (simplified)
    const currentStreak = state.user.streak || 0;
    
    // Calculate days active (simplified - would be more complex in real app)
    const daysActive = Math.max(totalMoodEntries, totalJournalEntries);
    
    // Calculate level and XP
    const currentXP = state.user.xp || 0;
    const currentLevel = Math.floor(currentXP / 100) + 1;
    const xpForNextLevel = (currentLevel * 100) - currentXP;
    const xpProgress = ((currentXP % 100) / 100) * 100;

    return {
      totalMoodEntries,
      totalJournalEntries,
      totalWords,
      avgMood,
      currentStreak,
      daysActive,
      currentLevel,
      currentXP,
      xpForNextLevel,
      xpProgress
    };
  }, [state.moods, state.journalEntries, state.user]);

  // Calculate earned achievements
  const earnedAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      switch (achievement.type) {
        case 'journal_entries':
          return userStats.totalJournalEntries >= achievement.requirement;
        case 'mood_entries':
          return userStats.totalMoodEntries >= achievement.requirement;
        case 'streak':
          return userStats.currentStreak >= achievement.requirement;
        case 'days_active':
          return userStats.daysActive >= achievement.requirement;
        case 'total_words':
          return userStats.totalWords >= achievement.requirement;
        default:
          return false;
      }
    });
  }, [userStats]);

  const handleProfileUpdate = () => {
    dispatch({
      type: actionTypes.UPDATE_USER,
      payload: { ...state.user, name: profileData.name }
    });
    setEditProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleSettingsUpdate = (newSettings) => {
    setSettings(newSettings);
    dispatch({
      type: actionTypes.UPDATE_SETTINGS,
      payload: newSettings
    });
    toast.success('Settings updated successfully!');
  };

  const getAchievementProgress = (achievement) => {
    let current = 0;
    switch (achievement.type) {
      case 'journal_entries':
        current = userStats.totalJournalEntries;
        break;
      case 'mood_entries':
        current = userStats.totalMoodEntries;
        break;
      case 'streak':
        current = userStats.currentStreak;
        break;
      case 'days_active':
        current = userStats.daysActive;
        break;
      case 'total_words':
        current = userStats.totalWords;
        break;
      default:
        current = 0;
    }
    return Math.min((current / achievement.requirement) * 100, 100);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          mb: 4,
          background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
          border: `1px solid ${colors.primary}40`
        }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: colors.primary,
                        color: 'white',
                        '&:hover': { backgroundColor: colors.secondary }
                      }}
                    >
                      <CameraAltOutlined fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                      fontSize: '3rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {profileData.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </Grid>
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
                    {profileData.name}
                  </Typography>
                  <Chip
                    label={`Level ${userStats.currentLevel}`}
                    sx={{
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {profileData.bio}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    📍 {profileData.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 Joined {new Date(profileData.joinDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    XP Progress:
                  </Typography>
                  <Box sx={{ flexGrow: 1, maxWidth: 200 }}>
                    <LinearProgress
                      variant="determinate"
                      value={userStats.xpProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${colors.primary}20`,
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {userStats.xpForNextLevel} XP to next level
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<EditOutlined />}
                  onClick={() => setEditProfile(true)}
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    '&:hover': {
                      borderColor: colors.secondary,
                      backgroundColor: `${colors.primary}10`
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SentimentSatisfiedAltOutlined sx={{ fontSize: 40, color: colors.primary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary }}>
                  {userStats.avgMood}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Mood
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <LocalFireDepartmentOutlined sx={{ fontSize: 40, color: '#ff6b35', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary }}>
                  {userStats.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Day Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BookOutlined sx={{ fontSize: 40, color: colors.secondary, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary }}>
                  {userStats.totalJournalEntries}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Journal Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEventsOutlined sx={{ fontSize: 40, color: '#feca57', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.secondary }}>
                  {earnedAchievements.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Achievements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Overview" icon={<InsightsOutlined />} />
              <Tab label="Achievements" icon={<EmojiEventsOutlined />} />
              <Tab label="Activity" icon={<TimelineOutlined />} />
              <Tab label="Settings" icon={<SettingsOutlined />} />
            </Tabs>
          </Box>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <AssessmentOutlined sx={{ mr: 1, color: colors.primary }} />
                  Quick Stats
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <BookOutlined sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Words Written"
                      secondary={`${userStats.totalWords.toLocaleString()} words`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayOutlined sx={{ color: colors.secondary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Days Active"
                      secondary={`${userStats.daysActive} days`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SentimentSatisfiedAltOutlined sx={{ color: colors.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mood Entries"
                      secondary={`${userStats.totalMoodEntries} entries logged`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StarOutlined sx={{ color: '#feca57' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Experience Points"
                      secondary={`${userStats.currentXP} XP earned`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpOutlined sx={{ mr: 1, color: colors.secondary }} />
                  Recent Achievements
                </Typography>
                {earnedAchievements.slice(-3).map((achievement) => (
                  <Paper key={achievement.id} sx={{ p: 2, mb: 2, backgroundColor: `${achievement.color}10` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ backgroundColor: achievement.color, mr: 2 }}>
                        {achievement.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Grid>
            </Grid>
          </TabPanel>

          {/* Achievements Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Achievements ({earnedAchievements.length}/{achievements.length})
            </Typography>
            <Grid container spacing={3}>
              {achievements.map((achievement) => {
                const isEarned = earnedAchievements.some(earned => earned.id === achievement.id);
                const progress = getAchievementProgress(achievement);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                    <Card sx={{ 
                      opacity: isEarned ? 1 : 0.6,
                      border: isEarned ? `2px solid ${achievement.color}` : '1px solid #e0e0e0',
                      position: 'relative'
                    }}>
                      {isEarned && (
                        <Box sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: achievement.color,
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <StarOutlined sx={{ fontSize: 16, color: 'white' }} />
                        </Box>
                      )}
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ backgroundColor: achievement.color, mr: 2 }}>
                            {achievement.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {achievement.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {achievement.description}
                            </Typography>
                          </Box>
                        </Box>
                        {!isEarned && (
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Progress</Typography>
                              <Typography variant="body2">{Math.round(progress)}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: `${achievement.color}20`,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: achievement.color
                                }
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>

          {/* Activity Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Recent Activity
            </Typography>
            <List>
              {state.journalEntries?.slice(-5).reverse().map((entry, index) => (
                <ListItem key={entry.id} divider>
                  <ListItemIcon>
                    <BookOutlined sx={{ color: colors.primary }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Created journal entry: "${entry.title}"`}
                    secondary={new Date(entry.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
              {state.moods?.slice(-5).reverse().map((mood, index) => (
                <ListItem key={`mood-${index}`} divider>
                  <ListItemIcon>
                    <SentimentSatisfiedAltOutlined sx={{ color: colors.secondary }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Logged mood: ${mood.rating}/5`}
                    secondary={new Date(mood.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <NotificationsOutlined sx={{ mr: 1, color: colors.primary }} />
                  Notifications
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Daily Reminders" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications}
                          onChange={(e) => handleSettingsUpdate({
                            ...settings,
                            notifications: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Achievement Notifications" />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label=""
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Weekly Summary" />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label=""
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <SecurityOutlined sx={{ mr: 1, color: colors.secondary }} />
                  Privacy & Security
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Dark Mode" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.darkMode}
                          onChange={(e) => handleSettingsUpdate({
                            ...settings,
                            darkMode: e.target.checked
                          })}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Default Privacy" secondary={`Currently: ${settings.privacy}`} />
                    <Button size="small" variant="outlined">
                      Change
                    </Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Data Export" secondary="Download your data" />
                    <Button size="small" variant="outlined">
                      Export
                    </Button>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>
        </Card>
      </motion.div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfile} onClose={() => setEditProfile(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            value={profileData.location}
            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfile(false)}>Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
