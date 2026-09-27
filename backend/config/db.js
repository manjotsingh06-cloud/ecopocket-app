const mongoose = require('mongoose');

// Storage mode is decided ONCE at startup and never changes while the process
// runs. Previously every request checked `mongoose.connection.readyState === 1`,
// which flips between 0 (disconnected) / 2 (connecting) / 1 (connected) during
// startup & reconnects. Accounts registered while the flag read "not connected"
// were written to backend/data/users.json instead of MongoDB and appeared to
// "vanish" from the database. That can't happen anymore.
let dbMode = 'none'; // 'mongo' | 'file' | 'none' (process not booted through connectDB yet)

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    dbMode = 'file';
    console.warn('⚠️ MONGODB_URI is not set — using the zero-config file store.');
    return;
  }

  const maxAttempts = 3;
  let lastErr = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      });
      dbMode = 'mongo';
      console.log('✅ MongoDB connected — all reads/writes now go through MongoDB.');
      return;
    } catch (err) {
      lastErr = err;
      console.warn(`⚠️ MongoDB connection attempt ${attempt}/${maxAttempts} failed: ${err.message}`);
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (process.env.NODE_ENV === 'production') {
    // Never silently run on the file store in production — credentials/data would
    // be lost (serverless FS is ephemeral) and the app would misreport data.
    const host = String(process.env.MONGODB_URI).split('@').pop();
    throw new Error(
      `Could not connect to MongoDB at ${host} after ${maxAttempts} attempts. ` +
      'Fix MONGODB_URI / network access (check Atlas IP allow-list) and restart.'
    );
  }

  // Development only: fall back to the file store — but loudly, so this is never
  // mistaken for MongoDB.
  dbMode = 'file';
  console.warn('⚠️ MongoDB not reachable — running on the zero-config file store instead.');
  console.warn('   Registrations/logins now will NOT appear in MongoDB. Fix MONGODB_URI or start MongoDB.');
}

// Stable "are we on MongoDB?" check. When the process boots through server.js this
// is resolved before any request is accepted, so the answer can never change
// mid-run. The 'none' branch only happens in tests that connect mongoose directly
// (e.g. mongodb-memory-server) — there we trust mongoose's live state.
function isMongo() {
  if (dbMode === 'mongo') return true;
  if (dbMode === 'file') return false;
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isMongo, dbMode };
