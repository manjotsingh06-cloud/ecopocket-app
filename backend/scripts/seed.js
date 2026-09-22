require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const User = require('../models/User');

// Keep seeded products visually consistent with the frontend fallback catalogue.
const SLUG_IMAGE_MAP = {
  'quilted-sandwich-pocket':   '/images/products/quilted-sandwich-pocket.jpg',
  'chapati-pocket':            '/images/products/chapati-pocket.jpg',
  'snack-bag':                 '/images/products/snack-bag.jpg',
  'bread-bag':                 '/images/products/bread-bag.jpg',
  'fruit-pocket':              '/images/products/fruit-pocket.jpg',
  'cutlery-holder':            '/images/products/cutlery-holder.jpg',
  'lunch-wrap':                '/images/products/lunch-wrap.jpg',
  'bottle-sleeve':             '/images/products/bottle-sleeve.jpg',
  'coffee-cup-sleeve':         '/images/products/coffee-cup-sleeve.jpg',
  'tiffin-tote':               '/images/products/tiffin-tote.jpg',
  'beeswax-fabric-wrap':       '/images/products/beeswax-fabric-wrap.jpg',
  'foldable-beeswax-fabric-wrap': '/images/products/beeswax-fabric-wrap.jpg',
  'picnic-organizer':          '/images/products/picnic-organizer.jpg',
  'reusable-produce-bag-set':  '/images/products/reusable-produce-bag-set.jpg',
  'tea-time-wrap':             '/images/products/tea-time-wrap.jpg',
  'insulated-casserole-cover': '/images/products/insulated-casserole-cover.jpg',
  'travel-toiletry-pouch':     '/images/products/travel-toiletry-pouch.jpg',
  'herb-keeper-wrap':          '/images/products/herb-keeper-wrap.jpg',
  'artisan-bento-roll':        '/images/products/artisan-bento-roll.jpg',
  'thermal-soup-jar-pouch':    '/images/products/thermal-soup-jar-pouch.jpg',
  'zero-waste-market-tote':    '/images/products/zero-waste-market-tote.jpg',
  'quilted-snack-pod-set':     '/images/products/quilted-snack-pod-set.jpg',
  'vintage-linen-tea-cozy':    '/images/products/vintage-linen-tea-cozy.jpg',
  'eco-cutlery-straw-roll':    '/images/products/eco-cutlery-straw-roll.jpg',
  'quilted-farmer-carryall':   '/images/products/quilted-farmer-carryall.jpg',
};

const getProductImageUrl = (slug) => SLUG_IMAGE_MAP[slug] || '/images/products/quilted-sandwich-pocket.jpg';

const PRODUCTS = [
  { name: 'Quilted Sandwich Pocket', category: 'Sandwich Pocket', fabric: 'Organic Cotton', quiltingPattern: 'Diamond', price: 1199, ecoScore: 92, description: 'A leak-resistant, machine-washable pocket sized for a standard sandwich.', features: ['Leak-resistant seam', 'Fits standard sandwich', 'Machine washable'], materialComposition: '100% organic cotton shell, cotton batting, food-safe lining' },
  { name: 'Chapati Pocket', category: 'Chapati Pocket', fabric: 'Hemp', quiltingPattern: 'Square', price: 999, ecoScore: 88, description: 'Insulated hemp pocket that keeps chapatis warm and soft for hours.', features: ['Heat-retaining lining', 'Insulated batting'], materialComposition: '100% hemp shell, bamboo batting' },
  { name: 'Snack Bag', category: 'Snack Bag', fabric: 'Recycled Cotton', quiltingPattern: 'Wave', price: 749, ecoScore: 85, description: 'A compact drawstring bag for snacks on the go.', features: ['Drawstring close', 'Compact fold'], materialComposition: '100% recycled cotton' },
  { name: 'Bread Bag', category: 'Bread Bag', fabric: 'Linen', quiltingPattern: 'Diamond', price: 1299, ecoScore: 90, description: 'Breathable linen bag that keeps bread fresher for longer.', features: ['Breathable weave', 'Extra-long size'], materialComposition: '100% linen' },
  { name: 'Fruit Pocket', category: 'Fruit Pocket', fabric: 'Organic Cotton', quiltingPattern: 'Square', price: 849, ecoScore: 87, description: 'Ventilated pocket for carrying fruit without bruising.', features: ['Soft interior lining', 'Ventilated seams'], materialComposition: '100% organic cotton' },
  { name: 'Cutlery Holder', category: 'Cutlery Holder', fabric: 'Hemp', quiltingPattern: 'Wave', price: 899, ecoScore: 86, description: 'A snap-close roll that fits a full reusable place setting.', features: ['Snap closure', 'Fits full place setting'], materialComposition: '100% hemp' },
  { name: 'Lunch Wrap', category: 'Lunch Wrap', fabric: 'Recycled Cotton', quiltingPattern: 'Diamond', price: 1099, ecoScore: 89, description: 'Ties flat for storage and doubles as a placemat at the table.', features: ['Ties flat for storage', 'Doubles as placemat'], materialComposition: '100% recycled cotton' },
  { name: 'Bottle Sleeve', category: 'Bottle Sleeve', fabric: 'Linen', quiltingPattern: 'Square', price: 949, ecoScore: 84, description: 'Insulated sleeve with an adjustable elastic fit for most bottles.', features: ['Insulated layer', 'Adjustable elastic'], materialComposition: '100% linen, cotton batting' },
  { name: 'Coffee Cup Sleeve', category: 'Coffee Cup Sleeve', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 649, ecoScore: 91, description: 'Heat-safe sleeve that fits most standard takeaway cups.', features: ['Heat-safe lining', 'Universal cup fit'], materialComposition: '100% organic cotton' },
  { name: 'Picnic Organizer', category: 'Picnic Organizer', fabric: 'Hemp', quiltingPattern: 'Diamond', price: 2499, ecoScore: 90, description: 'A multi-pocket organizer that rolls up into its own carry strap.', features: ['Multi-pocket layout', 'Rolls into a carry strap'], materialComposition: '100% hemp' },
  { name: 'Tiffin Tote', category: 'Tiffin Tote', fabric: 'Organic Cotton', quiltingPattern: 'Diamond', price: 1599, ecoScore: 93, description: 'A softly quilted tote designed to carry a lunch box and everyday essentials.', features: ['Padded base', 'Easy-grip handles', 'Machine washable'], materialComposition: 'Organic cotton canvas, recycled cotton batting' },
  { name: 'Reusable Produce Bag Set', category: 'Produce Bag', fabric: 'Recycled Cotton', quiltingPattern: 'Plain', price: 799, ecoScore: 94, description: 'A set of three lightweight drawstring bags for fruit, vegetables and pantry staples.', features: ['Set of three', 'Breathable mesh panel', 'Tare-weight label'], materialComposition: 'Recycled cotton and organic cotton mesh' },
  { name: 'Tea Time Wrap', category: 'Food Wrap', fabric: 'Linen', quiltingPattern: 'Wave', price: 699, ecoScore: 89, description: 'A versatile fabric wrap for snacks, biscuits and a warm cup on the go.', features: ['Adjustable tie', 'Soft quilted lining'], materialComposition: 'Linen shell, cotton batting' },
  { name: 'Insulated Casserole Cover', category: 'Casserole Cover', fabric: 'Hemp', quiltingPattern: 'Square', price: 1899, ecoScore: 91, description: 'A warming cover that helps keep rotis and home-cooked dishes cosy at the table.', features: ['Heat-retaining layers', 'Fits standard casserole dishes'], materialComposition: 'Hemp shell, bamboo batting, cotton lining' },
  { name: 'Travel Toiletry Pouch', category: 'Travel Pouch', fabric: 'Recycled Cotton', quiltingPattern: 'Diamond', price: 1149, ecoScore: 86, description: 'A washable zip pouch for toiletries, chargers or little travel essentials.', features: ['Water-resistant lining', 'Secure zip closure'], materialComposition: 'Recycled cotton shell, food-safe lining' },
  { name: 'Herb Keeper Wrap', category: 'Food Wrap', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 549, ecoScore: 95, description: 'A dampened reusable wrap that helps leafy herbs stay fresh for longer.', features: ['Naturally breathable', 'Reusable tie closure'], materialComposition: '100% organic cotton' },
  { name: 'Artisan Bento Roll', category: 'Lunch Wrap', fabric: 'Hemp', quiltingPattern: 'Square', price: 1399, ecoScore: 96, description: 'Insulated hemp and linen roll pouch designed for Japanese bento boxes and meal prep containers.', features: ['Sashiko stitch detailing', 'Adjustable buckle strap', 'Thermal lining'], materialComposition: '50% hemp, 50% organic linen, thermal padding' },
  { name: 'Thermal Soup Jar Pouch', category: 'Bottle Sleeve', fabric: 'Hemp', quiltingPattern: 'Diamond', price: 1049, ecoScore: 93, description: 'Heavyweight quilted hemp pouch that insulates soup thermoses and food jars.', features: ['Thick thermal core', 'Easy draw cord', 'Padded base'], materialComposition: '100% organic hemp canvas, thermal fleece' },
  { name: 'Zero-Waste Market Tote', category: 'Tiffin Tote', fabric: 'Recycled Cotton', quiltingPattern: 'Square', price: 1499, ecoScore: 97, description: 'Heavy-duty quilted tote bag with reinforced handles for weekly farmers market hauls.', features: ['Reinforced base', 'Internal bottle loops', 'Heavy canvas weave'], materialComposition: '100% recycled cotton duck canvas' },
  { name: 'Quilted Snack Pod Set', category: 'Snack Bag', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 899, ecoScore: 94, description: 'Trio of color-coded quilted snack pods for nuts, dried fruit, and trail mix.', features: ['Set of 3 sizes', 'Food-grade lining', 'Dishwasher safe liner'], materialComposition: '100% organic cotton shell, PEVA eco-liner' },
  { name: 'Vintage Linen Tea Cozy', category: 'Food Wrap', fabric: 'Linen', quiltingPattern: 'Diamond', price: 799, ecoScore: 91, description: 'Hand-quilted French linen cozy that keeps teapots warm while brewing.', features: ['Heat insulated', 'Hanging loop', 'Soft linen texture'], materialComposition: '100% washed French linen, wool batting' },
  { name: 'Eco Cutlery & Straw Roll', category: 'Cutlery Holder', fabric: 'Organic Cotton', quiltingPattern: 'Plain', price: 649, ecoScore: 95, description: 'Slender roll-up holder with individual slots for bamboo fork, spoon, knife, and metal straw.', features: ['Individual slots', 'Wipeable interior', 'Tie wrap'], materialComposition: '100% organic cotton' },
  { name: 'Quilted Farmer Carryall', category: 'Tiffin Tote', fabric: 'Recycled Cotton', quiltingPattern: 'Diamond', price: 1799, ecoScore: 96, description: 'Extra-roomy quilted tote with interior dividers for fresh produce and baked goods.', features: ['4 interior pockets', 'Extra wide straps', 'Foldable'], materialComposition: '100% recycled heavy cotton' },
  { name: 'Foldable Beeswax Fabric Wrap', category: 'Food Wrap', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 849, ecoScore: 98, description: 'Natural organic cotton wrap infused with organic beeswax and jojoba oil to seal bowls and sandwiches.', features: ['Natural antibacterial', 'Self-sealing warmth', 'Reusable for 1 year'], materialComposition: 'Organic cotton, organic beeswax, tree resin, jojoba oil' },
];

const BLOGS = [
  { title: 'Why Zero-Waste Dining Starts in the Kitchen Drawer', category: 'Zero Waste Dining', excerpt: 'The everyday habits around food packaging matter more than the big gestures.', content: 'Zero-waste dining is less about grand lifestyle overhauls and more about the small, repeated choices — what you reach for to wrap a sandwich or store a snack. Reusable fabric pockets remove single-use packaging from that daily loop entirely...' },
  { title: 'Organic Cotton vs Hemp: Choosing a Sustainable Fabric', category: 'Textile Innovation', excerpt: 'Two of our core fabrics compared for durability, breathability, and footprint.', content: 'Organic cotton is soft and breathable, ideal for close food contact. Hemp is more durable and naturally antimicrobial, better suited to insulated pockets. Both outperform synthetic alternatives on biodegradability...' },
  { title: 'Inside the Quilting Process: Diamond vs Wave Patterns', category: 'Quilting Techniques', excerpt: 'The quilting pattern is structural, not just decorative.', content: 'A diamond quilt distributes stress evenly across a seam, ideal for pockets that get folded daily. A wave pattern flexes more, suited to snack bags that need to compress. We choose pattern by product, not aesthetics alone...' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected — seeding...');

  await Promise.all([Product.deleteMany({}), Blog.deleteMany({}), Testimonial.deleteMany({}), Gallery.deleteMany({})]);

  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  await Product.insertMany(PRODUCTS.map((p) => ({ ...p, slug: slugify(p.name), images: [{ url: getProductImageUrl(slugify(p.name)) }] })));
  console.log(`Seeded ${PRODUCTS.length} products`);

  let admin = await User.findOne({ email: 'admin@ecopocket.com' });
  if (!admin) {
    admin = await User.create({ name: 'EcoPocket Admin', email: 'admin@ecopocket.com', password: 'ChangeMe123!', role: 'admin', isEmailVerified: true });
    console.log('Created admin user: admin@ecopocket.com / ChangeMe123! (please change this password)');
  }

  await Blog.insertMany(BLOGS.map((b) => ({ ...b, slug: slugify(b.title), author: admin._id })));
  console.log(`Seeded ${BLOGS.length} blog posts`);

  await Testimonial.insertMany([
    { name: 'Meera K.', role: 'Home cook', text: 'The quilted sandwich pocket has completely replaced cling film in our kitchen.', rating: 5, approved: true },
    { name: 'Daniel O.', role: 'Meal-prep enthusiast', text: 'The bottle sleeve keeps drinks cold for hours and has survived fifty-plus washes.', rating: 5, approved: true },
    { name: 'Priya S.', role: 'Cafe owner', text: 'We switched our takeaway wraps to the Lunch Wrap line — customers love the fabric.', rating: 5, approved: true },
  ]);
  console.log('Seeded testimonials');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => { console.error(err); process.exit(1); });
