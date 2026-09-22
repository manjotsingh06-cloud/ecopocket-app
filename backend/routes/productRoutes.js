const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, uploadProductImages,
} = require('../controllers/productController');

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin only
router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);
router.post('/:id/images', protect, restrictTo('admin'), upload.array('images', 6), uploadProductImages);

module.exports = router;
