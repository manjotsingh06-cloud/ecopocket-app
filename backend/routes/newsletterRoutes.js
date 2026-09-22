const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const { subscribe, unsubscribe, getSubscribers } = require('../controllers/newsletterController');

const router = express.Router();

router.post('/subscribe', [body('email').isEmail()], validate, subscribe);
router.post('/unsubscribe', [body('email').isEmail()], validate, unsubscribe);
router.get('/', protect, restrictTo('admin'), getSubscribers);

module.exports = router;
