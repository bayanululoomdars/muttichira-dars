const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables.');
    return false;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection runtime error:', err.message);
});

module.exports = connectDB;
