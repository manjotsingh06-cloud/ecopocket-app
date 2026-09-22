const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const devStore = require('../utils/devStore');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

      const user = await User.create({ name, email: normalizedEmail, password });
      const verifyToken = user.createEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      // Send verification email safely
      try {
        const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verifyToken}`;
        await sendEmail({
          to: user.email,
          subject: 'Verify your EcoPocket account',
          html: `<p>Welcome to EcoPocket! Please verify your email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
        });
      } catch (emailErr) {
        console.warn('⚠️ Could not send verification email:', emailErr.message);
      }

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } else {
      // Persistent File Store Fallback
      if (devStore.findUserByEmail(normalizedEmail)) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);
      const fakeId = 'usr_' + Math.random().toString(36).substring(2, 11);
      const userObj = { id: fakeId, name, email: normalizedEmail, password: hashedPassword, role: 'user', createdAt: new Date().toISOString() };

      devStore.addUser(userObj);
      const token = generateToken(fakeId);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: { id: fakeId, name: userObj.name, email: userObj.email, role: userObj.role },
      });
    }
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
      }
      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } else {
      // Persistent File Store Fallback
      const userObj = devStore.findUserByEmail(normalizedEmail);
      const bcrypt = require('bcryptjs');
      if (!userObj || !(await bcrypt.compare(password, userObj.password))) {
        return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
      }
      const token = generateToken(userObj.id);
      return res.json({
        success: true,
        token,
        user: { id: userObj.id, name: userObj.name, email: userObj.email, role: userObj.role },
      });
    }
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/verify-email/:token
async function verifyEmail(req, res, next) {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ emailVerificationToken: hashed });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired verification link.' });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Email verified — you can now log in.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your EcoPocket password',
      html: `<p>Reset your password (valid for 1 hour):</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password/:token
async function resetPassword(req, res, next) {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Password updated.', token });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, verifyEmail, forgotPassword, resetPassword, getMe };
