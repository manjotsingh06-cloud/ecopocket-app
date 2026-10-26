/**
 * Admin/any-user password utility for EcoPocket.
 *
 *   node scripts/setAdminPassword.js inspect
 *   node scripts/setAdminPassword.js check <email> <password>
 *   node scripts/setAdminPassword.js set   <email> <newPassword> --confirm
 *
 * `set` leans on the app's own User model, so the password goes through the
 * schema's pre('save') bcrypt hook — exactly like a normal registration.
 * Run it from the backend/ folder. Reads MONGODB_URI from backend/.env.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');

const [, , cmd, arg1, arg2, arg3] = process.argv;

function describeTarget() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('✗ MONGODB_URI is not set in backend/.env — nothing to do.');
    process.exit(1);
  }
  const hostPart = uri.split('@').pop();
  return { uri, hostPart };
}

async function inspect() {
  const db = mongoose.connection.db;
  const cols = await db.listCollections().toArray();
  console.log('\nCOLLECTIONS');
  for (const c of cols) {
    const n = await db.collection(c.name).countDocuments();
    console.log(`  ${String(n).padStart(5)}  ${c.name}`);
  }

  const users = await db
    .collection('users')
    .find({}, { projection: { email: 1, role: 1, isEmailVerified: 1, mustChangePassword: 1, password: 1, createdAt: 1 } })
    .toArray();

  console.log(`\nUSERS (${users.length})`);
  for (const u of users) {
    console.log(
      `  ${String(u.email).padEnd(34)} role=${String(u.role).padEnd(6)}` +
        ` verified=${String(!!u.isEmailVerified).padEnd(5)}` +
        ` mustChange=${String(!!u.mustChangePassword).padEnd(5)}` +
        ` hasHash=${!!u.password}`
    );
  }

  const prods = await db.collection('products').find({}, { projection: { name: 1 } }).limit(3).toArray();
  console.log('\nPRODUCTS (first 3 names)');
  prods.forEach((p) => console.log('  ' + p.name));
  console.log('\n^ Compare these names with the live API to confirm this is the same database.');
}

async function check(email, password) {
  const User = require('../models/User');
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user) return console.log(`✗ no user with email ${email}`);
  const ok = await user.comparePassword(String(password));
  console.log(`${ok ? '✓ MATCHES' : '✗ does NOT match'} — ${user.email} (role=${user.role})`);
}

async function flag(email) {
  const User = require('../models/User');
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    console.error(`✗ no user with email ${email}`);
    process.exit(1);
  }
  user.mustChangePassword = true;
  await user.save();
  console.log(`✓ mustChangePassword=true for ${user.email} (role=${user.role})`);
  console.log('  Next login on the site will show the "Set a new password" modal.');
}

async function set(email, newPassword, confirmFlag) {
  if (confirmFlag !== '--confirm') {
    console.error('✗ Refusing to change a password without --confirm.');
    console.error('  Usage: node scripts/setAdminPassword.js set <email> <newPassword> --confirm');
    process.exit(1);
  }
  if (!newPassword || newPassword.length < 8) {
    console.error('✗ New password must be at least 8 characters (schema minlength is 8).');
    process.exit(1);
  }

  const User = require('../models/User');
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user) {
    console.error(`✗ no user with email ${email}`);
    process.exit(1);
  }

  user.password = newPassword; // pre('save') hashes with bcrypt(12)
  user.mustChangePassword = false; // we just set a chosen, non-default password
  await user.save();

  const verify = await User.findOne({ email: user.email }).select('+password');
  const ok = await verify.comparePassword(newPassword);
  console.log(`${ok ? '✓' : '✗'} password updated for ${user.email} (role=${user.role}) — verify=${ok}`);
  console.log('  mustChangePassword=false. Log in on the live site with the new password.');
}

(async () => {
  const { hostPart } = describeTarget();
  console.log(`connecting to ${hostPart} ...`);
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 20000,
  });
  console.log(`✓ connected — db=${mongoose.connection.db.databaseName}`);

  try {
    if (cmd === 'inspect') await inspect();
    else if (cmd === 'check') await check(arg1, arg2);
    else if (cmd === 'flag') await flag(arg1);
    else if (cmd === 'set') await set(arg1, arg2, arg3);
    else {
      console.log('Usage:');
      console.log('  node scripts/setAdminPassword.js inspect');
      console.log('  node scripts/setAdminPassword.js check <email> <password>');
      console.log('  node scripts/setAdminPassword.js flag  <email>');
      console.log('  node scripts/setAdminPassword.js set   <email> <newPassword> --confirm');
    }
  } finally {
    await mongoose.disconnect();
  }
})().catch((err) => {
  console.error('💥 ' + err.message);
  process.exit(1);
});
