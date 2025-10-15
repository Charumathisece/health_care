import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing MongoDB connection and data operations...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/soulscribe';
    console.log(`📡 Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully');
    
    // Test database and collection existence
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Test creating a user
    console.log('\n🧪 Testing user creation...');
    const testUser = new User({
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    const savedUser = await testUser.save();
    console.log('✅ User created successfully:', savedUser._id);
    
    // Verify user was saved
    const foundUser = await User.findById(savedUser._id);
    if (foundUser) {
      console.log('✅ User found in database:', foundUser.username);
    } else {
      console.log('❌ User not found in database');
    }
    
    // Count total users
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Clean up test user
    await User.findByIdAndDelete(savedUser._id);
    console.log('🧹 Test user cleaned up');
    
    console.log('\n✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    if (error.name === 'MongoNetworkError') {
      console.error('💡 Network error - check if MongoDB is running');
    } else if (error.name === 'MongoServerError') {
      console.error('💡 Server error - check MongoDB configuration');
    } else if (error.name === 'ValidationError') {
      console.error('💡 Validation error - check data format');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

testDatabaseConnection();
