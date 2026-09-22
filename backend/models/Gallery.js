const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    image: { url: String, publicId: String },
    category: {
      type: String,
      enum: ['Product Images', 'Manufacturing', 'Quilting', 'Lifestyle', 'Fabric Textures', 'Workshop'],
      required: true,
    },
    caption: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
