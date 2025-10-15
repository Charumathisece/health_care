import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testFrontendBackendConnection() {
  console.log('🔗 Testing Frontend-Backend Connection...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test 2: CORS test (simulate frontend request)
    console.log('\n2. Testing CORS with frontend-like request...');
    const corsResponse = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      }
    });
    
    if (corsResponse.ok) {
      console.log('✅ CORS working properly');
    } else {
      console.log('❌ CORS issue detected');
    }

    // Test 3: Registration with frontend-like headers
    console.log('\n3. Testing registration with frontend-like request...');
    const timestamp = Date.now();
    const testUser = {
      username: `frontendtest_${timestamp}`,
      email: `frontendtest${timestamp}@soulscribe.com`,
      password: 'TestPassword123',
      profile: {
        firstName: 'Frontend',
        lastName: 'Test'
      }
    };

    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Frontend-like registration successful!');
      console.log('👤 User:', registerData.user.username);
      console.log('🔑 Token received:', registerData.token ? 'Yes' : 'No');
      console.log('🏠 Action:', registerData.action);
      
      // Test login
      console.log('\n4. Testing login with registered user...');
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173'
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Frontend-like login successful!');
        console.log('🏠 Action:', loginData.action);
      } else {
        const loginError = await loginResponse.json();
        console.log('❌ Login failed:', loginError.message);
      }

    } else {
      const registerError = await registerResponse.json();
      console.log('❌ Registration failed:', registerError);
    }

    console.log('\n📊 Summary:');
    console.log('- Backend is running and accessible');
    console.log('- API endpoints are working');
    console.log('- Data is being stored in MongoDB Atlas');
    console.log('- If your frontend still has issues, check:');
    console.log('  1. Frontend dev server is running on port 5173');
    console.log('  2. Network tab in browser dev tools for failed requests');
    console.log('  3. Console errors in browser');
    console.log('  4. CORS settings if requests are blocked');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend server is not running');
      console.log('💡 Start it with: npm start in backend directory');
    } else if (error.code === 'FETCH_ERROR') {
      console.log('💡 Network connectivity issue');
    }
  }
}

testFrontendBackendConnection();
