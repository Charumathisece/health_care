# SoulScribe Backend API

A comprehensive Node.js/Express backend for the SoulScribe mental health platform, providing secure APIs for mood tracking, journaling, AI chat interactions, and analytics.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Mood Tracking**: Comprehensive mood logging with emotions, activities, and environmental factors
- **Digital Journaling**: Rich journaling system with categories, tags, and AI insights
- **AI Chat Support**: Chat sessions with context-aware AI assistance
- **Analytics Dashboard**: Detailed insights and trends analysis
- **User Management**: Profile management and preferences
- **Data Security**: Input validation, rate limiting, and security headers

## 📁 Project Structure

```
backend/
├── models/           # MongoDB schemas
│   ├── User.js      # User model with authentication
│   ├── Mood.js      # Mood tracking model
│   ├── Journal.js   # Journal entries model
│   └── Chat.js      # AI chat sessions model
├── routes/          # API route handlers
│   ├── auth.js      # Authentication endpoints
│   ├── users.js     # User management endpoints
│   ├── moods.js     # Mood tracking endpoints
│   ├── journals.js  # Journal management endpoints
│   ├── chats.js     # Chat session endpoints
│   └── analytics.js # Analytics and insights endpoints
├── middleware/      # Custom middleware
│   └── auth.js      # JWT authentication middleware
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── .env.example     # Environment variables template
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Configure other variables as needed

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "profile": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Mood Tracking Endpoints

#### Create Mood Entry
```http
POST /api/moods
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "mood": "happy",
  "moodScore": 4,
  "emotions": ["grateful", "energetic"],
  "activities": ["exercise", "socializing"],
  "notes": "Had a great workout and lunch with friends",
  "stressLevel": 2,
  "energyLevel": 8,
  "sleepHours": 7.5
}
```

#### Get Mood Entries
```http
GET /api/moods?page=1&limit=20&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <jwt_token>
```

#### Get Mood Statistics
```http
GET /api/moods/stats?period=month
Authorization: Bearer <jwt_token>
```

### Journal Endpoints

#### Create Journal Entry
```http
POST /api/journals
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Reflections on Today",
  "content": "Today was a good day. I accomplished my goals and felt productive...",
  "mood": "happy",
  "category": "daily",
  "tags": ["productivity", "goals"],
  "isPrivate": true
}
```

#### Get Journal Entries
```http
GET /api/journals?page=1&limit=20&category=daily&search=productivity
Authorization: Bearer <jwt_token>
```

### Chat Endpoints

#### Create Chat Session
```http
POST /api/chats/sessions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "context": {
    "topic": "anxiety",
    "mood": "sad"
  },
  "aiPersonality": "supportive"
}
```

#### Add Message to Chat
```http
POST /api/chats/sessions/{sessionId}/messages
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "role": "user",
  "content": "I'm feeling anxious about work tomorrow"
}
```

### Analytics Endpoints

#### Get Dashboard Analytics
```http
GET /api/analytics/dashboard?period=month
Authorization: Bearer <jwt_token>
```

#### Get Mood Trends
```http
GET /api/analytics/mood-trends?period=quarter&granularity=week
Authorization: Bearer <jwt_token>
```

#### Get Wellness Insights
```http
GET /api/analytics/insights
Authorization: Bearer <jwt_token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Data Sanitization**: Protection against injection attacks

## 🗄 Database Schema

### User Model
- Authentication fields (username, email, password)
- Profile information (name, bio, avatar, etc.)
- Preferences (theme, notifications, privacy)
- Account status and verification

### Mood Model
- Mood score and descriptive mood
- Emotions and activities arrays
- Environmental factors (weather, location)
- Physical metrics (sleep, stress, energy levels)
- Personal notes and tags

### Journal Model
- Title and rich content
- Category and tags for organization
- Mood association and emotions
- Privacy settings and favorites
- AI-generated insights and sentiment analysis
- Word count and reading time

### Chat Model
- Session-based conversation tracking
- Message history with roles and timestamps
- Context and topic categorization
- AI personality settings
- User feedback and ratings

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soulscribe
JWT_SECRET=your-super-secure-production-secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=5000
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

The API includes:
- Request logging with Morgan
- Error handling and logging
- Health check endpoint at `/api/health`
- Performance monitoring ready

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add proper error handling and validation
3. Include appropriate tests for new features
4. Update documentation for API changes

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API health endpoint: `GET /api/health`
2. Review server logs for error details
3. Ensure environment variables are properly configured
4. Verify MongoDB connection

---

**Note**: This backend is designed to work with the SoulScribe React frontend. Make sure to update the `FRONTEND_URL` in your environment variables to match your frontend deployment URL.
