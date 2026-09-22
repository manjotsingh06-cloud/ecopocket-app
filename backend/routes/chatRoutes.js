const express = require('express');
const { sendMessage, getHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/', sendMessage);
router.get('/:sessionId/history', getHistory);

module.exports = router;
