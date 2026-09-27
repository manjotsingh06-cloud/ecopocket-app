// One-time data recovery: merge accounts from backend/data/users.json into MongoDB.
//
// Before the startup race in server.js was fixed, registrations/logins could be
// written to the zero-config file store (users.json) while MongoDB was still
// connecting. This script upserts those file-store accounts into MongoDB so the
// database becomes the single source of truth again. Stored bcrypt hashes are
// reused, so existing passwords keep working.
//
// Usage: node scripts/migrateDevStoreToMongo.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const devStore = require('../utils/devStore');

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  console.log('✅ Connected to MongoDB.');

  const fileUsers = devStore.loadUsers();
  console.log(`📂 Found ${fileUsers.length} account(s) in backend/data/users.json`);

  let created = 0;
  let skipped = 0;

  for (const fu of fileUsers) {
    const email = String(fu.email || '').toLowerCase().trim();
    if (!email || !fu.password) {
      console.warn(`⏭ Skipping entry without a valid email/password: ${email || '(no email)'}`, fu.id || '');
      skipped++;
      continue;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⏭ ${email} already in MongoDB — keeping the existing account.`);
      skipped++;
      continue;
    }

    // Insert through the raw driver so the already-bcrypt-hashed password is NOT
    // re-hashed by the User pre-save hook (which runs on every mongoose save).
    await User.collection.insertOne({
      name: fu.name || email.split('@')[0],
      email,
      password: fu.password,
      role: fu.role || 'user',
      isEmailVerified: true,
      mustChangePassword: fu.mustChangePassword || false,
      newsletterSubscribed: fu.newsletterSubscribed || false,
      createdAt: fu.createdAt ? new Date(fu.createdAt) : new Date(),
      updatedAt: new Date(),
    });
    created++;
    console.log(`✅ Imported ${email} (role: ${fu.role || 'user'})`);
  }

  console.log(`\nDone — ${created} imported, ${skipped} skipped/existing.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});