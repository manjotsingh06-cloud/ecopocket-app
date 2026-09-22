const Blog = require('../models/Blog');

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function getBlogs(req, res, next) {
  try {
    const { category, page = 1, limit = 9 } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    const blogs = await Blog.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    const total = await Blog.countDocuments(filter);
    res.json({ success: true, total, blogs });
  } catch (err) {
    next(err);
  }
}

async function getBlogBySlug(req, res, next) {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true }).populate('author', 'name');
    if (!blog) return res.status(404).json({ success: false, message: 'Article not found.' });
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
}

async function createBlog(req, res, next) {
  try {
    const blog = await Blog.create({ ...req.body, slug: (req.body.slug || slugify(req.body.title)).toLowerCase(), author: req.user._id });
    res.status(201).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
}

async function updateBlog(req, res, next) {
  try {
    if (req.body.title && !req.body.slug) req.body.slug = slugify(req.body.title);
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Article not found.' });
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Article not found.' });
    res.json({ success: true, message: 'Article deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
