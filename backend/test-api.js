// Simple API test script to verify backend endpoints
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing SoulScribe Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    console.log('');

    // Test 2: User Registration
    console.log('2. Testing User Registration...');
    const testUser = {
      username: 'testuser123',
      email: 'test@soulscribe.com',
      password: 'TestPass123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ User Registration successful');
      console.log('User ID:', registerData.user._id);
      
      const token = registerData.token;
      console.log('Token received:', token ? 'Yes' : 'No');
      console.log('');

      // Test 3: Create Mood Entry
      console.log('3. Testing Mood Entry Creation...');
      const moodData = {
        mood: 'happy',
        moodScore: 4,
        emotions: ['grateful', 'energetic'],
        activities: ['exercise', 'socializing'],
        notes: 'Great day with friends!',
        stressLevel: 2,
        energyLevel: 8,
        sleepHours: 7.5
      };

      const moodResponse = await fetch(`${API_BASE}/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(moodData)
      });

      if (moodResponse.ok) {
        const moodResult = await moodResponse.json();
        console.log('✅ Mood Entry created successfully');
        console.log('Mood ID:', moodResult.mood._id);
        console.log('');

        // Test 4: Get Mood Entries
        console.log('4. Testing Get Mood Entries...');
        const getMoodsResponse = await fetch(`${API_BASE}/moods`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (getMoodsResponse.ok) {
          const moodsData = await getMoodsResponse.json();
          console.log('✅ Retrieved mood entries:', moodsData.moods.length);
          console.log('');
        }
      }

      // Test 5: Create Journal Entry
      console.log('5. Testing Journal Entry Creation...');
      const journalData = {
        title: 'My First Journal Entry',
        content: 'Today was a wonderful day. I feel grateful for all the positive experiences and the progress I\'m making on my mental health journey.',
        mood: 'happy',
        category: 'daily',
        tags: ['gratitude', 'progress'],
        isPrivate: true
      };

      const journalResponse = await fetch(`${API_BASE}/journals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(journalData)
      });

      if (journalResponse.ok) {
        const journalResult = await journalResponse.json();
        console.log('✅ Journal Entry created successfully');
        console.log('Journal ID:', journalResult.journal._id);
        console.log('Word Count:', journalResult.journal.wordCount);
        console.log('');
      }

      // Test 6: Create Chat Session
      console.log('6. Testing Chat Session Creation...');
      const chatData = {
        context: {
          topic: 'general',
          mood: 'happy'
        },
        aiPersonality: 'supportive'
      };

      const chatResponse = await fetch(`${API_BASE}/chats/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(chatData)
      });

      if (chatResponse.ok) {
        const chatResult = await chatResponse.json();
        console.log('✅ Chat Session created successfully');
        console.log('Session ID:', chatResult.chat.sessionId);
        console.log('');

        // Test 7: Add Message to Chat
        console.log('7. Testing Add Chat Message...');
        const messageData = {
          role: 'user',
          content: 'Hello! I\'m feeling great today and wanted to share my positive mood.'
        };

        const messageResponse = await fetch(`${API_BASE}/chats/sessions/${chatResult.chat.sessionId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(messageData)
        });

        if (messageResponse.ok) {
          const messageResult = await messageResponse.json();
          console.log('✅ Chat Message added successfully');
          console.log('Message content:', messageResult.chatMessage.content);
          console.log('');
        }
      }

      // Test 8: Get Dashboard Analytics
      console.log('8. Testing Dashboard Analytics...');
      const analyticsResponse = await fetch(`${API_BASE}/analytics/dashboard?period=month`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        console.log('✅ Dashboard Analytics retrieved successfully');
        console.log('Period:', analyticsData.period);
        console.log('Mood entries:', analyticsData.summary.mood.totalEntries);
        console.log('Journal entries:', analyticsData.summary.journal.totalEntries);
        console.log('');
      }

      console.log('🎉 All API tests completed successfully!');
      console.log('Your SoulScribe backend is ready for integration with the frontend.');

    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData.message);
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    console.log('\n🔧 Make sure your backend server is running on port 5000');
    console.log('Run: npm run dev (in the backend directory)');
  }
}

// Run the tests
testAPI();
