const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Sandwich Pocket', 'Chapati Pocket', 'Lunch Wrap', 'Snack Bag', 'Bread Bag',
        'Fruit Pocket', 'Bottle Sleeve', 'Coffee Cup Sleeve', 'Cutlery Holder', 'Picnic Organizer',
        'Tiffin Tote', 'Produce Bag', 'Food Wrap', 'Casserole Cover', 'Travel Pouch',
      ],
    },
    description: { type: String, required: true },
    images: [{ url: String, publicId: String }],
    fabric: { type: String, required: true, enum: ['Organic Cotton', 'Hemp', 'Linen', 'Recycled Cotton'] },
    quiltingPattern: { type: String, enum: ['Diamond', 'Square', 'Wave', 'Plain'], default: 'Diamond' },
    materialComposition: { type: String },
    careInstructions: { type: String },
    usageInstructions: { type: String },
    features: [{ type: String }],
    ecoScore: { type: Number, min: 0, max: 100, default: 80 },
    price: { type: Number, required: true },
    stock: { type: Number, default: 50 },
    ratingAverage: { type: Number, default: 4.8, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
