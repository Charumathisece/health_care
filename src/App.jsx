import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { theme } from './theme/theme';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Navbar from './components/Navigation/Navbar';
import Sidebar from './components/Navigation/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MoodLog from './pages/MoodLog';
import Journal from './pages/Journal';
import JournalEntry from './pages/JournalEntry';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import CalmingToolkit from './pages/CalmingToolkit';
import AIChat from './pages/AIChat';

// Lazy load PatientDetails to avoid CommonJS `require` in the browser
const PatientDetails = lazy(() => import('./pages/PatientDetails'));

// Placeholder components for remaining pages
const Reminders = () => (
  <Box sx={{ p: 3 }}>
    <h2>Reminders</h2>
    <p>Smart reminders and notifications coming soon...</p>
  </Box>
);

const CounselorConnect = () => (
  <Box sx={{ p: 3 }}>
    <h2>Counselor Connect</h2>
    <p>Connect with mental health professionals coming soon...</p>
  </Box>
);

const Settings = () => (
  <Box sx={{ p: 3 }}>
    <h2>Settings</h2>
    <p>App settings and preferences coming soon...</p>
  </Box>
);

// Component to handle layout based on route
function AppLayout() {
  const location = useLocation();
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get authentication status
  let isAuthenticated = false;
  try {
    const authContext = useAuth();
    isAuthenticated = authContext.isAuthenticated;
  } catch (error) {
    // If useAuth fails, fall back to false
    console.log('Auth context not available, defaulting to unauthenticated');
  }

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Check if current route is a public route
  const isPublicRoute = ['/', '/login', '/signup'].includes(location.pathname);
  
  // If user is not authenticated and trying to access protected route, redirect to landing
  if (!isAuthenticated && !isPublicRoute) {
    return <Landing />;
  }

  if (isPublicRoute) {
    // Render public routes without navbar/sidebar
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  // Render protected routes with navbar/sidebar
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuToggle={handleSidebarToggle} />
      <Sidebar 
        open={sidebarOpen}
        onClose={handleSidebarClose}
        variant={isMobile ? 'temporary' : 'temporary'}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          transition: 'all 0.3s ease',
          width: '100%'
        }}
      >
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodLog />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal-entry" element={<JournalEntry />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/toolkit" element={<CalmingToolkit />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/counselor" element={<CounselorConnect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/patient-details"
            element={
              <Suspense fallback={<Box sx={{ p: 3 }}>Loading patient details...</Box>}>
                <PatientDetails />
              </Suspense>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppLayout />
          </Router>
        </AppProvider>
      </AuthProvider>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            },
            success: {
              iconTheme: {
                primary: theme.palette.primary.main,
                secondary: '#fff'
              }
            }
          }}
        />
    </ThemeProvider>
  );
}

export default App;
