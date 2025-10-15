import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUpOutlined,
  InsightsOutlined,
  LocalFireDepartmentOutlined,
  BookOutlined,
  SentimentSatisfiedAltOutlined,
  AssessmentOutlined
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../services/api';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range based on selection
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      // Fetch analytics data from backend
      const response = await apiClient.getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        timeRange
      });

      setAnalyticsData(response);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data');
      
      // Set fallback data for demonstration
      setAnalyticsData({
        moodTrends: [
          { date: '12/28', avgMood: 3.5 },
          { date: '12/29', avgMood: 4.2 },
          { date: '12/30', avgMood: 3.8 },
          { date: '12/31', avgMood: 4.5 },
          { date: '1/1', avgMood: 4.1 },
          { date: '1/2', avgMood: 3.9 },
          { date: '1/3', avgMood: 4.3 }
        ],
        moodDistribution: [
          { name: 'Very Happy', value: 8, color: '#44cc44' },
          { name: 'Happy', value: 12, color: '#88cc00' },
          { name: 'Neutral', value: 5, color: '#ffcc00' },
          { name: 'Sad', value: 2, color: '#ff8800' },
          { name: 'Very Sad', value: 1, color: '#ff4444' }
        ],
        journalActivity: [
          { date: '12/28', entries: 1 },
          { date: '12/29', entries: 2 },
          { date: '12/30', entries: 1 },
          { date: '12/31', entries: 3 },
          { date: '1/1', entries: 1 },
          { date: '1/2', entries: 2 },
          { date: '1/3', entries: 1 }
        ],
        summary: {
          avgMood: 4.1,
          moodImprovement: 0.6,
          totalEntries: 28,
          streakDays: 7,
          mostCommonMood: 'Happy',
          journalEntries: 11
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatMoodValue = (value) => {
    const moodLabels = {
      1: 'Very Sad',
      2: 'Sad', 
      3: 'Neutral',
      4: 'Happy',
      5: 'Very Happy'
    };
    return moodLabels[Math.round(value)] || 'Unknown';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <InsightsOutlined sx={{ mr: 2, color: colors.primary }} />
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your mental health journey with detailed insights and trends
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} - Showing sample data for demonstration.
        </Alert>
      )}

      {/* Time Range Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 90 Days</MenuItem>
            <MenuItem value="1year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {analyticsData && (
        <>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                border: `1px solid ${colors.primary}40`
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SentimentSatisfiedAltOutlined sx={{ color: colors.primary, mr: 1 }} />
                    <Typography variant="h6">Avg Mood</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: colors.secondary }}>
                    {analyticsData.summary?.avgMood?.toFixed(1) || '0.0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analyticsData.summary?.moodImprovement > 0 ? '↗️' : '↘️'} {Math.abs(analyticsData.summary?.moodImprovement || 0).toFixed(1)} from start
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.primary}20)`,
                border: `1px solid ${colors.secondary}40`
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalFireDepartmentOutlined sx={{ color: colors.secondary, mr: 1 }} />
                    <Typography variant="h6">Streak</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: colors.primary }}>
                    {analyticsData.summary?.streakDays || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    days in a row
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                border: `1px solid ${colors.primary}40`
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AssessmentOutlined sx={{ color: colors.primary, mr: 1 }} />
                    <Typography variant="h6">Mood Entries</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: colors.secondary }}>
                    {analyticsData.summary?.totalEntries || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    total logged
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.primary}20)`,
                border: `1px solid ${colors.secondary}40`
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BookOutlined sx={{ color: colors.secondary, mr: 1 }} />
                    <Typography variant="h6">Journal Entries</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: colors.primary }}>
                    {analyticsData.summary?.journalEntries || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    entries written
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Mood Trends */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <TrendingUpOutlined sx={{ mr: 1, color: colors.primary }} />
                    Mood Trends Over Time
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.moodTrends || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 5]} />
                        <Tooltip 
                          formatter={(value) => [formatMoodValue(value), 'Mood']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgMood" 
                          stroke={colors.primary} 
                          strokeWidth={3}
                          dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Mood Distribution */}
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <SentimentSatisfiedAltOutlined sx={{ mr: 1, color: colors.secondary }} />
                    Mood Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.moodDistribution || []}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                        >
                          {(analyticsData.moodDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Journal Activity */}
            <Grid item xs={12} lg={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <BookOutlined sx={{ mr: 1, color: colors.primary }} />
                    Journal Activity
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.journalActivity || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="entries" 
                          fill={colors.secondary}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Insights Panel */}
            <Grid item xs={12} lg={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <InsightsOutlined sx={{ mr: 1, color: colors.primary }} />
                    Key Insights
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, background: `${colors.primary}10` }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Most Common Mood
                        </Typography>
                        <Typography variant="body1">
                          Your most frequent mood this period is <strong>{analyticsData.summary?.mostCommonMood || 'Unknown'}</strong>
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, background: `${colors.secondary}10` }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Progress Trend
                        </Typography>
                        <Typography variant="body1">
                          {analyticsData.summary?.moodImprovement > 0 ? (
                            <>Your mood has improved by {analyticsData.summary.moodImprovement.toFixed(1)} points! 🎉 Keep up the great work!</>
                          ) : analyticsData.summary?.moodImprovement < 0 ? (
                            <>Your mood has decreased by {Math.abs(analyticsData.summary.moodImprovement).toFixed(1)} points. Remember, it's okay to have ups and downs. 💙</>
                          ) : (
                            <>Your mood has remained stable. Consistency is also a form of progress! 🌟</>
                          )}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
