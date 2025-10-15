import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  Grid
} from '@mui/material';
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  EmailOutlined,
  LockOutlined,
  PersonOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { colors } from '../theme/theme';

export default function Signup() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    profile: {
      firstName: '',
      lastName: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'firstName' || name === 'lastName') {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'agreeToTerms' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.profile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.profile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);
    
    try {
      // Call real backend API
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile: formData.profile
      });
      
      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth integration
    console.log('Google signup not yet implemented');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              SoulScribe
            </Typography>
            <Typography variant="h6" sx={{ color: colors.text.secondary }}>
              Begin your mental wellness journey today
            </Typography>
          </Box>

          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                Create Account
              </Typography>

              {(apiError || error) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {apiError || error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {/* Name Fields */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="firstName"
                      label="First Name"
                      value={formData.profile.firstName}
                      onChange={handleChange}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlined sx={{ color: colors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      value={formData.profile.lastName}
                      onChange={handleChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Grid>
                </Grid>

                {/* Username */}
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined sx={{ color: colors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Email */}
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: colors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password */}
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: colors.primary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirm Password */}
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: colors.primary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Terms and Conditions */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      sx={{
                        color: colors.primary,
                        '&.Mui-checked': {
                          color: colors.primary,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      I agree to the{' '}
                      <Link href="#" sx={{ color: colors.primary }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" sx={{ color: colors.primary }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />

                {errors.agreeToTerms && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.agreeToTerms}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading || loading}
                  sx={{
                    py: 2,
                    mb: 3,
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`,
                    },
                    '&:disabled': {
                      background: colors.text.light
                    }
                  }}
                >
                  {(isLoading || loading) ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Divider sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleSignup}
                  disabled={isLoading || loading}
                  sx={{
                    py: 2,
                    mb: 3,
                    borderColor: colors.primary,
                    color: colors.primary,
                    '&:hover': {
                      borderColor: colors.primaryDark,
                      backgroundColor: `${colors.primary}10`
                    }
                  }}
                >
                  🔍 Sign up with Google
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    Already have an account?{' '}
                    <Link 
                      onClick={() => navigate('/login')}
                      sx={{ 
                        color: colors.primary,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link 
              onClick={() => navigate('/')}
              sx={{ 
                color: colors.text.secondary,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              ← Back to Home
            </Link>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
