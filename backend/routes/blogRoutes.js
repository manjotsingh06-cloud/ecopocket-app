const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, restrictTo('admin'), createBlog);
router.put('/:id', protect, restrictTo('admin'), updateBlog);
router.delete('/:id', protect, restrictTo('admin'), deleteBlog);

module.exports = router;
