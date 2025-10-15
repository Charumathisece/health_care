// Simple API test using CommonJS
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testHealthCheck() {
  console.log('🧪 Testing SoulScribe Backend API Health Check...\n');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(options);
    
    if (response.status === 200) {
      console.log('✅ Backend Health Check: SUCCESS');
      console.log('Response:', response.data.message);
      console.log('Timestamp:', response.data.timestamp);
      console.log('\n🎉 Your SoulScribe backend is running correctly!');
      console.log('Backend server is ready for frontend integration.');
    } else {
      console.log('❌ Health check failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.log('\n🔧 Make sure your backend server is running:');
    console.log('1. Open terminal in backend directory');
    console.log('2. Run: npm run dev');
    console.log('3. Server should start on http://localhost:5000');
  }
}

testHealthCheck();
