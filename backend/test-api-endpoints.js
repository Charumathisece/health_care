import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testAPIEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test user registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      username: `testuser_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    };

    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });

    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ User registration successful:', registerResult.user.username);
      console.log('📧 User email:', registerResult.user.email);
      console.log('🆔 User ID:', registerResult.user._id);
      
      // Test login with the created user
      console.log('\n3. Testing user login...');
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      });

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('✅ User login successful');
        console.log('🔑 Token received:', loginResult.token ? 'Yes' : 'No');
      } else {
        const loginError = await loginResponse.json();
        console.log('❌ Login failed:', loginError);
      }
    } else {
      const registerError = await registerResponse.json();
      console.log('❌ Registration failed:', registerError);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server is not running on port 5000');
    } else if (error.code === 'FETCH_ERROR') {
      console.log('💡 Network error - check server status');
    }
  }
}

testAPIEndpoints();
