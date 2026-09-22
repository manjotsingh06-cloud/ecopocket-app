const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getGallery, addGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, restrictTo('admin'), upload.single('image'), addGalleryItem);
router.delete('/:id', protect, restrictTo('admin'), deleteGalleryItem);

module.exports = router;
