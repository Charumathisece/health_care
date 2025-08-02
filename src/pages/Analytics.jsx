import React, { useState } from 'react';
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
  Paper
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
import { useApp } from '../context/AppContext';
import { colors } from '../theme/theme';

// Sample data for demonstration
const sampleMoodData = [
  { date: '12/28', avgMood: 3.5 },
  { date: '12/29', avgMood: 4.2 },
  { date: '12/30', avgMood: 3.8 },
  { date: '12/31', avgMood: 4.5 },
  { date: '1/1', avgMood: 4.1 },
  { date: '1/2', avgMood: 3.9 },
  { date: '1/3', avgMood: 4.3 }
];

const sampleMoodDistribution = [
  { name: 'Very Happy', value: 8, color: '#44cc44' },
  { name: 'Happy', value: 12, color: '#88cc00' },
  { name: 'Neutral', value: 5, color: '#ffcc00' },
  { name: 'Sad', value: 2, color: '#ff8800' },
  { name: 'Very Sad', value: 1, color: '#ff4444' }
];

const sampleJournalActivity = [
  { date: '12/28', entries: 1 },
  { date: '12/29', entries: 2 },
  { date: '12/30', entries: 1 },
  { date: '12/31', entries: 3 },
  { date: '1/1', entries: 1 },
  { date: '1/2', entries: 2 },
  { date: '1/3', entries: 1 }
];

export default function Analytics() {
  const { state } = useApp();
  const [timeRange, setTimeRange] = useState('7days');

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
                4.1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ↗️ 0.6 from start
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
                <Typography variant="h6">Journal Streak</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: colors.primary }}>
                5
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
                28
              </Typography>
              <Typography variant="body2" color="text.secondary">
                in selected period
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
                11
              </Typography>
              <Typography variant="body2" color="text.secondary">
                written
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Mood Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingUpOutlined sx={{ mr: 1, color: colors.primary }} />
                Mood Trend Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleMoodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
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
                      data={sampleMoodDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    >
                      {sampleMoodDistribution.map((entry, index) => (
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
                  <BarChart data={sampleJournalActivity}>
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
                      Your most frequent mood this period is <strong>Happy</strong>
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, background: `${colors.secondary}10` }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Progress Trend
                    </Typography>
                    <Typography variant="body1">
                      Your mood has improved by 0.6 points! 🎉 Keep up the great work!
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
