const Review = require('../models/Review');
const Product = require('../models/Product');

// GET /api/reviews/:productSlug
exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({ productSlug: req.params.productSlug }).sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

// POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { productSlug, customerName, customerEmail, rating, title, comment } = req.body;

    if (!productSlug || !customerName || !rating || !title || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all required review fields.' });
    }

    const review = await Review.create({
      productSlug,
      customerName,
      customerEmail: customerEmail || 'guest@ecopocket.com',
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: true,
    });

    // Recalculate average rating for product if it exists in DB
    const allReviews = await Review.find({ productSlug });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findOneAndUpdate(
      { slug: productSlug },
      { ratingAverage: Number(avg.toFixed(1)), ratingCount: allReviews.length }
    );

    res.status(201).json({ success: true, message: 'Review submitted successfully!', review });
  } catch (err) {
    next(err);
  }
};

