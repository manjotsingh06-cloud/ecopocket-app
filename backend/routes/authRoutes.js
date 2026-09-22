const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  register, login, verifyEmail, forgotPassword, resetPassword, getMe,
} = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  login
);

router.get('/verify-email/:token', verifyEmail);

router.post('/forgot-password', authLimiter, [body('email').isEmail()], validate, forgotPassword);

router.post(
  '/reset-password/:token',
  authLimiter,
  [body('password').isLength({ min: 8 })],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);

module.exports = router;
