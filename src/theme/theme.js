import { createTheme } from '@mui/material/styles';

// SoulScribe custom color palette
export const colors = {
  primary: '#deaaff',      // Light purple
  secondary: '#a663cc',    // Medium purple
  primaryDark: '#c794ff',  // Darker shade of primary
  secondaryDark: '#9455b8', // Darker shade of secondary
  background: '#fafafa',
  surface: '#ffffff',
  text: {
    primary: '#2d2d2d',
    secondary: '#666666',
    light: '#888888'
  },
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      contrastText: '#ffffff'
    },
    secondary: {
      main: colors.secondary,
      dark: colors.secondaryDark,
      contrastText: '#ffffff'
    },
    background: {
      default: colors.background,
      paper: colors.surface
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: colors.text.primary
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.text.primary
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.text.primary
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: colors.text.primary
    },
    body1: {
      fontSize: '1rem',
      color: colors.text.primary
    },
    body2: {
      fontSize: '0.875rem',
      color: colors.text.secondary
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
});
