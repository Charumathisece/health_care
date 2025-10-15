import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testUserRegistration() {
  console.log('🧪 Testing User Registration with Atlas...\n');

  try {
    // Test user registration
    console.log('1. Testing user registration...');
    const timestamp = Date.now();
    const registerData = {
      username: `testuser_${timestamp}`,
      email: `test${timestamp}@soulscribe.com`,
      password: 'TestPassword123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    };

    console.log('📝 Registering user:', registerData.username, registerData.email);

    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });

    const registerResult = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful!');
      console.log('👤 User ID:', registerResult.user._id);
      console.log('📧 Email:', registerResult.user.email);
      console.log('🔑 Token received:', registerResult.token ? 'Yes' : 'No');
      console.log('🏠 Action:', registerResult.action);
      
      // Test duplicate registration
      console.log('\n2. Testing duplicate registration...');
      const duplicateResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const duplicateResult = await duplicateResponse.json();
      
      if (duplicateResponse.status === 409) {
        console.log('✅ Duplicate registration properly blocked');
        console.log('📝 Message:', duplicateResult.message);
        console.log('🔄 Action:', duplicateResult.action);
      } else {
        console.log('❌ Duplicate registration not properly handled');
      }

      // Test login with registered user
      console.log('\n3. Testing login with registered user...');
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

      const loginResult = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Login successful!');
        console.log('📝 Message:', loginResult.message);
        console.log('🏠 Action:', loginResult.action);
      } else {
        console.log('❌ Login failed:', loginResult.message);
      }

      // Test login with non-existent user
      console.log('\n4. Testing login with non-existent user...');
      const nonExistentResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
      });

      const nonExistentResult = await nonExistentResponse.json();
      
      if (nonExistentResponse.status === 401) {
        console.log('✅ Non-existent user properly handled');
        console.log('📝 Message:', nonExistentResult.message);
        console.log('🔄 Action:', nonExistentResult.action);
      } else {
        console.log('❌ Non-existent user not properly handled');
      }

    } else {
      console.log('❌ Registration failed:', registerResult);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server is not running on port 5000');
      console.log('💡 Run: npm start in the backend directory');
    }
  }
}

testUserRegistration();
