const express = require('express');
const router = express.Router();
const { getReviewsByProduct, createReview } = require('../controllers/reviewController');

router.get('/:productSlug', getReviewsByProduct);
router.post('/', createReview);

module.exports = router;

