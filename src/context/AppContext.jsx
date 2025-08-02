import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  isAuthenticated: false,
  user: {
    name: 'User',
    level: 1,
    xp: 0,
    streak: 0,
    badges: []
  },
  moods: [],
  journalEntries: [],
  reminders: [],
  settings: {
    notifications: true,
    darkMode: false,
    privacy: 'private'
  }
};

// Action types
export const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  ADD_MOOD: 'ADD_MOOD',
  ADD_JOURNAL_ENTRY: 'ADD_JOURNAL_ENTRY',
  UPDATE_JOURNAL_ENTRY: 'UPDATE_JOURNAL_ENTRY',
  DELETE_JOURNAL_ENTRY: 'DELETE_JOURNAL_ENTRY',
  UPDATE_USER: 'UPDATE_USER',
  ADD_REMINDER: 'ADD_REMINDER',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  LOAD_DATA: 'LOAD_DATA'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      return { 
        ...state, 
        isAuthenticated: true,
        user: { ...state.user, name: action.payload?.name || 'User' }
      };
    
    case actionTypes.LOGOUT:
      return { 
        ...state, 
        isAuthenticated: false,
        user: { ...initialState.user }
      };
    
    case actionTypes.ADD_MOOD:
      return {
        ...state,
        moods: [...state.moods, action.payload],
        user: {
          ...state.user,
          xp: state.user.xp + 10
        }
      };
    
    case actionTypes.ADD_JOURNAL_ENTRY:
      return {
        ...state,
        journalEntries: [...state.journalEntries, action.payload],
        user: {
          ...state.user,
          xp: state.user.xp + 20
        }
      };
    
    case actionTypes.UPDATE_JOURNAL_ENTRY:
      return {
        ...state,
        journalEntries: state.journalEntries.map(entry => 
          entry.id === action.payload.id ? action.payload : entry
        )
      };
    
    case actionTypes.DELETE_JOURNAL_ENTRY:
      return {
        ...state,
        journalEntries: state.journalEntries.filter(entry => entry.id !== action.payload)
      };
    
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case actionTypes.ADD_REMINDER:
      return {
        ...state,
        reminders: [...state.reminders, action.payload]
      };
    
    case actionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case actionTypes.LOAD_DATA:
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Context Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('soulscribe-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: actionTypes.LOAD_DATA, payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('soulscribe-data', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
