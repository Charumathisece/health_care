import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  DashboardOutlined,
  MoodOutlined,
  BookOutlined,
  SpaOutlined,
  NotificationsOutlined,
  PsychologyOutlined,
  ConnectWithoutContactOutlined,
  HomeOutlined,
  SmartToyOutlined
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../theme/theme';

const drawerWidth = 280;

const menuItems = [
  { text: 'Home', icon: <HomeOutlined />, path: '/home' },
  { text: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
  { text: 'Mood Log', icon: <MoodOutlined />, path: '/mood' },
  { text: 'Journal', icon: <BookOutlined />, path: '/journal' },
  { text: 'Analytics', icon: <PsychologyOutlined />, path: '/analytics' },
  { text: 'Calming Toolkit', icon: <SpaOutlined />, path: '/toolkit' },
  { text: 'AI Chat', icon: <SmartToyOutlined />, path: '/ai-chat' },
  { text: 'Reminders', icon: <NotificationsOutlined />, path: '/reminders' },
  { text: 'Counselor Connect', icon: <ConnectWithoutContactOutlined />, path: '/counselor' }
];

export default function Sidebar({ open, onClose, variant = 'temporary' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path) => {
    navigate(path);
    // Always close sidebar after navigation for cleaner UX
    onClose();
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Modern Header */}
      <Box sx={{
        p: 4,
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: 'white',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(255,255,255,0.2)'
        }
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
          SoulScribe
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 300 }}>
          Your mental wellness companion
        </Typography>
      </Box>

      {/* Modern Navigation Items */}
      <Box sx={{ flexGrow: 1, px: 3, py: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Box
              key={index}
              onClick={() => handleNavigation(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                mb: 1,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: `${colors.primary}08`,
                  transform: 'translateX(4px)',
                  '&::before': {
                    width: '4px'
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: isActive ? '4px' : '0px',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  transition: 'width 0.3s ease'
                },
                ...(isActive && {
                  backgroundColor: `${colors.primary}12`,
                  transform: 'translateX(4px)',
                  boxShadow: `0 2px 8px ${colors.primary}20`
                })
              }}
            >
              <Box sx={{ 
                color: isActive ? colors.primary : colors.text.secondary,
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease'
              }}>
                {item.icon}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? colors.primary : colors.text.primary,
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem'
                }}
              >
                {item.text}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ mx: 2 }} />
      
      <Box sx={{ p: 2 }}>
        <Box sx={{
          background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
          borderRadius: 2,
          p: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
            Daily Streak
          </Typography>
          <Typography variant="h4" sx={{ color: colors.secondary, fontWeight: 700 }}>
            7
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            days
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="temporary" // Always temporary for modern UX
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.98)'
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
