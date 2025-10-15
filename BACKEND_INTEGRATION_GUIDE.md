# 🚀 SoulScribe Backend Integration Guide

## ✅ What's Been Completed

Your SoulScribe backend is now **fully functional** with the following features:

### 🏗️ Backend Architecture
- **Node.js/Express** server running on port 5000
- **MongoDB** database connection (local)
- **JWT Authentication** with secure password hashing
- **RESTful API** with comprehensive endpoints
- **Input validation** and error handling
- **Security middleware** (CORS, rate limiting, helmet)

### 📊 Database Models Created
1. **User Model** - Authentication, profiles, preferences
2. **Mood Model** - Mood tracking with emotions, activities, environmental factors
3. **Journal Model** - Rich journaling with categories, tags, AI insights
4. **Chat Model** - AI chat sessions with context and feedback

### 🛠️ API Endpoints Available
- **Authentication**: `/api/auth/*` (register, login, profile)
- **Mood Tracking**: `/api/moods/*` (CRUD operations, statistics)
- **Journaling**: `/api/journals/*` (CRUD, favorites, archiving)
- **AI Chat**: `/api/chats/*` (sessions, messages, feedback)
- **Analytics**: `/api/analytics/*` (dashboard, trends, insights)
- **User Management**: `/api/users/*` (profile, preferences)

### 🔧 Frontend Integration Tools Created
- **API Client** (`src/services/api.js`) - Complete API wrapper
- **Auth Hook** (`src/hooks/useAuth.js`) - Authentication management
- **Mood Hook** (`src/hooks/useMood.js`) - Mood tracking functionality
- **Journal Hook** (`src/hooks/useJournal.js`) - Journal management

## 🚦 Current Status

✅ **Backend Server**: Running on http://localhost:5000  
✅ **Database**: Connected to MongoDB  
✅ **API Endpoints**: All implemented and ready  
✅ **Frontend Hooks**: Created for easy integration  
✅ **Documentation**: Complete API documentation available  

## 🔗 Next Steps for Frontend Integration

### 1. Add Environment Variable
Create or update your frontend `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Wrap Your App with AuthProvider
Update your main App component:

```jsx
// src/App.jsx
import { AuthProvider } from './hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Your existing app components */}
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 3. Update Login Component
Replace your existing login logic:

```jsx
// src/pages/Login.jsx
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function Login() {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      // User will be automatically redirected after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
```

### 4. Update MoodLog Component
Integrate with backend:

```jsx
// src/pages/MoodLog.jsx
import { useMood } from '../hooks/useMood';
import { useState, useEffect } from 'react';

export default function MoodLog() {
  const { moods, loading, createMoodEntry, fetchMoods } = useMood();
  const [moodData, setMoodData] = useState({
    mood: 'neutral',
    moodScore: 3,
    emotions: [],
    activities: [],
    notes: '',
    stressLevel: 5,
    energyLevel: 5,
    sleepHours: 8
  });

  useEffect(() => {
    fetchMoods(); // Load existing mood entries
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMoodEntry(moodData);
      // Reset form or show success message
      setMoodData({
        mood: 'neutral',
        moodScore: 3,
        emotions: [],
        activities: [],
        notes: '',
        stressLevel: 5,
        energyLevel: 5,
        sleepHours: 8
      });
    } catch (error) {
      console.error('Failed to create mood entry:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Your existing mood form components */}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Mood'}
        </button>
      </form>
      
      {/* Display existing mood entries */}
      <div>
        <h3>Recent Moods</h3>
        {moods.map(mood => (
          <div key={mood._id}>
            <p>Mood: {mood.mood} ({mood.moodScore}/5)</p>
            <p>Date: {new Date(mood.createdAt).toLocaleDateString()}</p>
            {mood.notes && <p>Notes: {mood.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Update Journal Component
Similar integration for journaling:

```jsx
// src/pages/Journal.jsx
import { useJournal } from '../hooks/useJournal';
import { useState, useEffect } from 'react';

export default function Journal() {
  const { journals, loading, createJournalEntry, fetchJournals } = useJournal();
  
  useEffect(() => {
    fetchJournals();
  }, []);

  const handleCreateEntry = async (journalData) => {
    try {
      await createJournalEntry(journalData);
      // Handle success
    } catch (error) {
      console.error('Failed to create journal entry:', error);
    }
  };

  // Your existing journal component logic
}
```

## 🧪 Testing Your Integration

### 1. Start Both Servers
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

### 2. Test Authentication Flow
1. Go to your login page
2. Try registering a new user
3. Login with the credentials
4. Check if user data is properly stored

### 3. Test Data Operations
1. Create a mood entry
2. Create a journal entry
3. View the data in your components
4. Check MongoDB for stored data

## 🔒 Security Notes

- JWT tokens are stored in localStorage
- All API calls include proper authentication headers
- Password hashing is handled automatically
- Input validation is implemented on both frontend and backend

## 📊 Available API Features

Your backend now supports:
- User registration and authentication
- Mood tracking with detailed metrics
- Rich journaling with categories and tags
- AI chat sessions (ready for AI integration)
- Comprehensive analytics and insights
- User profile management
- Data export capabilities

## 🚀 Production Deployment

When ready for production:
1. Set up MongoDB Atlas (cloud database)
2. Deploy backend to services like Railway, Render, or Heroku
3. Update frontend environment variables
4. Configure proper CORS settings

## 🆘 Troubleshooting

**Backend not starting?**
- Check if MongoDB is running
- Verify environment variables in `.env`
- Check port 5000 is available

**API calls failing?**
- Verify VITE_API_URL in frontend `.env`
- Check network tab in browser dev tools
- Ensure backend server is running

**Authentication issues?**
- Clear localStorage and try again
- Check JWT token expiration
- Verify user credentials

---

## 🎉 Congratulations!

You now have a complete, production-ready backend for your SoulScribe mental health platform! The backend includes:

- ✅ Secure user authentication
- ✅ Comprehensive mood tracking
- ✅ Rich journaling system
- ✅ AI chat infrastructure
- ✅ Analytics and insights
- ✅ Complete API documentation
- ✅ Frontend integration tools

Your mental health platform is ready for users to start tracking their moods, writing journal entries, and engaging with AI support features!
