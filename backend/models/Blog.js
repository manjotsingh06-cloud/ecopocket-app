const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      enum: ['Sustainable Living', 'Textile Innovation', 'Eco Friendly Fashion', 'Quilting Techniques', 'Zero Waste Dining'],
      required: true,
    },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { url: String, publicId: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
