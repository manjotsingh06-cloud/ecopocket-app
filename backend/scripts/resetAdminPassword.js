require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function resetAdminPassword() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI) throw new Error('MONGODB_URI must point to the same database used by the deployed app.');
  if (!ADMIN_EMAIL || !ADMIN_EMAIL.includes('@')) throw new Error('Set ADMIN_EMAIL to the admin account email.');
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) throw new Error('Set ADMIN_PASSWORD to a password of at least 8 characters.');

  await mongoose.connect(MONGODB_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  let admin = await User.findOne({ email }).select('+password');

  if (!admin) {
    admin = new User({ name: 'EcoPocket Admin', email, password: ADMIN_PASSWORD });
  } else {
    admin.password = ADMIN_PASSWORD;
  }

  admin.role = 'admin';
  admin.isEmailVerified = true;
  admin.mustChangePassword = false;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();
  console.log(`Admin password updated for ${email}.`);
}

resetAdminPassword()
  .catch((error) => {
    console.error(`Could not update admin password: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
