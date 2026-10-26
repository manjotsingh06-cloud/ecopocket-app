const mongoose = require('mongoose');

let dbMode = 'none'; // 'mongo' | 'file' | 'none'
let connectPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    dbMode = 'mongo';
    return;
  }

  if (connectPromise) {
    return connectPromise;
  }

  if (!process.env.MONGODB_URI) {
    dbMode = 'file';
    console.warn('⚠️ MONGODB_URI is not set — using the file store.');
    return;
  }

  connectPromise = (async () => {
    const maxAttempts = 3;
    let lastErr = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
        });
        dbMode = 'mongo';
        console.log('✅ MongoDB connected.');
        return;
      } catch (err) {
        lastErr = err;
        console.warn(`⚠️ MongoDB connection attempt ${attempt}/${maxAttempts} failed: ${err.message}`);
        if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 1500));
      }
    }

    // If MongoDB could not connect, reset connectPromise so next request can retry
    connectPromise = null;

    if (process.env.NODE_ENV === 'production') {
      const host = String(process.env.MONGODB_URI).split('@').pop();
      throw new Error(`Could not connect to MongoDB at ${host} after ${maxAttempts} attempts: ${lastErr?.message}`);
    }

    dbMode = 'file';
    console.warn('⚠️ MongoDB not reachable — running on file store.');
  })();

  return connectPromise;
}

function isMongo() {
  if (process.env.MONGODB_URI) return true;
  if (mongoose.connection.readyState === 1 || dbMode === 'mongo') return true;
  if (dbMode === 'file') return false;
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isMongo, dbMode };
