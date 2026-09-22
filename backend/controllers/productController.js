const Product = require('../models/Product');
const { uploadImage, deleteImage } = require('../config/cloudinary');

// GET /api/products?category=&fabric=&search=&sort=&page=&limit=
async function getProducts(req, res, next) {
  try {
    const { category, fabric, search, sort = '-createdAt', page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (fabric) filter.fabric = fabric;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    res.json({ success: true, count: products.length, total, page: Number(page), products });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:slug
async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const similar = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
    res.json({ success: true, product, similar });
  } catch (err) {
    next(err);
  }
}

// Simple slug generator so admin renames keep clean, working public URLs.
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// POST /api/products (admin)
async function createProduct(req, res, next) {
  try {
    req.body.slug = (req.body.slug || slugify(req.body.name)).toLowerCase();
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res, next) {
  try {
    // Auto-regenerate the slug on rename so the storefront URL stays in sync.
    if (req.body.name && !req.body.slug) req.body.slug = slugify(req.body.name);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/products/:id (admin)
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    await Promise.all((product.images || []).map((img) => deleteImage(img.publicId, img.url)));
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/products/:id/images (admin, multipart upload via multer)
async function uploadProductImages(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const uploaded = await Promise.all((req.files || []).map((f) => uploadImage(f.path, 'ecopocket/products')));
    product.images.push(...uploaded);
    await product.save();
    res.json({ success: true, images: product.images });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, uploadProductImages };
