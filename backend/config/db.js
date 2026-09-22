const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not set — using persistent zero-config file store.');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️ Local/Cloud MongoDB not active — using persistent zero-config file store.');
  }
}

module.exports = connectDB;
