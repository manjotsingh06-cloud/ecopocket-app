const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const { submitContact, getMessages, updateMessageStatus } = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('message').trim().isLength({ min: 5 }).withMessage('Message is too short.'),
  ],
  validate,
  submitContact
);

router.get('/', protect, restrictTo('admin'), getMessages);
router.put('/:id/status', protect, restrictTo('admin'), updateMessageStatus);

module.exports = router;
