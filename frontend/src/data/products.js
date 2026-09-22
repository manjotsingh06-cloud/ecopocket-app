// Curated Pexels product/lifestyle photos, ordered to match the catalogue.
// Direct CDN links avoid the redirect-based image URLs that previously produced
// unrelated or unreliable thumbnails in the product grid.
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

const getProductImageUrl = (product) => {
  if (SLUG_IMAGE_MAP[product.slug]) {
    return SLUG_IMAGE_MAP[product.slug];
  }
  return '/images/products/quilted-sandwich-pocket.jpg';
};

export const PRODUCTS = [
  { _id: '1', name: 'Quilted Sandwich Pocket', slug: 'quilted-sandwich-pocket', category: 'Sandwich Pocket', fabric: 'Organic Cotton', quiltingPattern: 'Diamond', price: 1199, ecoScore: 92, description: 'A leak-resistant, machine-washable pocket sized for a standard sandwich.', features: ['Leak-resistant seam', 'Fits standard sandwich', 'Machine washable'], materialComposition: '100% organic cotton shell, cotton batting, food-safe lining' },
  { _id: '2', name: 'Chapati Pocket', slug: 'chapati-pocket', category: 'Chapati Pocket', fabric: 'Hemp', quiltingPattern: 'Square', price: 999, ecoScore: 88, description: 'Insulated hemp pocket that keeps chapatis warm and soft for hours.', features: ['Heat-retaining lining', 'Insulated batting'], materialComposition: '100% hemp shell, bamboo batting' },
  { _id: '3', name: 'Snack Bag', slug: 'snack-bag', category: 'Snack Bag', fabric: 'Recycled Cotton', quiltingPattern: 'Wave', price: 749, ecoScore: 85, description: 'A compact drawstring bag for snacks on the go.', features: ['Drawstring closure', 'Compact fold'], materialComposition: '100% recycled cotton' },
  { _id: '4', name: 'Bread Bag', slug: 'bread-bag', category: 'Bread Bag', fabric: 'Linen', quiltingPattern: 'Diamond', price: 1299, ecoScore: 90, description: 'A breathable linen bag that keeps bread fresher for longer.', features: ['Breathable weave', 'Extra-long size'], materialComposition: '100% linen' },
  { _id: '5', name: 'Fruit Pocket', slug: 'fruit-pocket', category: 'Fruit Pocket', fabric: 'Organic Cotton', quiltingPattern: 'Square', price: 849, ecoScore: 87, description: 'A ventilated pocket for carrying fruit without bruising.', features: ['Soft interior lining', 'Ventilated seams'], materialComposition: '100% organic cotton' },
  { _id: '6', name: 'Cutlery Holder', slug: 'cutlery-holder', category: 'Cutlery Holder', fabric: 'Hemp', quiltingPattern: 'Wave', price: 899, ecoScore: 86, description: 'A snap-close roll that fits a full reusable place setting.', features: ['Snap closure', 'Fits full place setting'], materialComposition: '100% hemp' },
  { _id: '7', name: 'Lunch Wrap', slug: 'lunch-wrap', category: 'Lunch Wrap', fabric: 'Recycled Cotton', quiltingPattern: 'Diamond', price: 1099, ecoScore: 89, description: 'Ties flat for storage and doubles as a placemat at the table.', features: ['Ties flat for storage', 'Doubles as placemat'], materialComposition: '100% recycled cotton' },
  { _id: '8', name: 'Bottle Sleeve', slug: 'bottle-sleeve', category: 'Bottle Sleeve', fabric: 'Linen', quiltingPattern: 'Square', price: 949, ecoScore: 84, description: 'An insulated sleeve with an adjustable elastic fit for most bottles.', features: ['Insulated layer', 'Adjustable elastic'], materialComposition: '100% linen, cotton batting' },
  { _id: '9', name: 'Coffee Cup Sleeve', slug: 'coffee-cup-sleeve', category: 'Coffee Cup Sleeve', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 649, ecoScore: 91, description: 'A heat-safe sleeve that fits most standard takeaway cups.', features: ['Heat-safe lining', 'Universal cup fit'], materialComposition: '100% organic cotton' },
  { _id: '10', name: 'Picnic Organizer', slug: 'picnic-organizer', category: 'Picnic Organizer', fabric: 'Hemp', quiltingPattern: 'Diamond', price: 2499, ecoScore: 90, description: 'A multi-pocket organizer that rolls up into its own carry strap.', features: ['Multi-pocket layout', 'Rolls into a carry strap'], materialComposition: '100% hemp' },
  { _id: '11', name: 'Tiffin Tote', slug: 'tiffin-tote', category: 'Tiffin Tote', fabric: 'Organic Cotton', quiltingPattern: 'Diamond', price: 1599, ecoScore: 93, description: 'A softly quilted tote designed to carry a lunch box and everyday essentials.', features: ['Padded base', 'Easy-grip handles', 'Machine washable'], materialComposition: 'Organic cotton canvas, recycled cotton batting' },
  { _id: '12', name: 'Reusable Produce Bag Set', slug: 'reusable-produce-bag-set', category: 'Produce Bag', fabric: 'Recycled Cotton', quiltingPattern: 'Plain', price: 799, ecoScore: 94, description: 'A set of three lightweight drawstring bags for fruit, vegetables and pantry staples.', features: ['Set of three', 'Breathable mesh panel', 'Tare-weight label'], materialComposition: 'Recycled cotton and organic cotton mesh' },
  { _id: '13', name: 'Tea Time Wrap', slug: 'tea-time-wrap', category: 'Food Wrap', fabric: 'Linen', quiltingPattern: 'Wave', price: 699, ecoScore: 89, description: 'A versatile fabric wrap for snacks, biscuits and a warm cup on the go.', features: ['Adjustable tie', 'Soft quilted lining'], materialComposition: 'Linen shell, cotton batting' },
  { _id: '14', name: 'Insulated Casserole Cover', slug: 'insulated-casserole-cover', category: 'Casserole Cover', fabric: 'Hemp', quiltingPattern: 'Square', price: 1899, ecoScore: 91, description: 'A warming cover that helps keep rotis and home-cooked dishes cosy at the table.', features: ['Heat-retaining layers', 'Fits standard casserole dishes'], materialComposition: 'Hemp shell, bamboo batting, cotton lining' },
  { _id: '15', name: 'Travel Toiletry Pouch', slug: 'travel-toiletry-pouch', category: 'Travel Pouch', fabric: 'Recycled Cotton', quiltingPattern: 'Diamond', price: 1149, ecoScore: 86, description: 'A washable zip pouch for toiletries, chargers or little travel essentials.', features: ['Water-resistant lining', 'Secure zip closure'], materialComposition: 'Recycled cotton shell, food-safe lining' },
  { _id: '16', name: 'Herb Keeper Wrap', slug: 'herb-keeper-wrap', category: 'Food Wrap', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 549, ecoScore: 95, description: 'A dampened reusable wrap that helps leafy herbs stay fresh for longer.', features: ['Naturally breathable', 'Reusable tie closure'], materialComposition: '100% organic cotton' },
  { _id: '17', name: 'Artisan Bento Roll', slug: 'artisan-bento-roll', category: 'Lunch Wrap', fabric: 'Hemp', quiltingPattern: 'Square', price: 1399, ecoScore: 96, description: 'Insulated hemp and linen roll pouch designed for Japanese bento boxes and meal prep containers.', features: ['Sashiko stitch detailing', 'Adjustable buckle strap', 'Thermal lining'], materialComposition: '50% hemp, 50% organic linen, thermal padding' },
  { _id: '18', name: 'Thermal Soup Jar Pouch', slug: 'thermal-soup-jar-pouch', category: 'Bottle Sleeve', fabric: 'Hemp', quiltingPattern: 'Diamond', price: 1049, ecoScore: 93, description: 'Heavyweight quilted hemp pouch that insulates soup thermoses and food jars.', features: ['Thick thermal core', 'Easy draw cord', 'Padded base'], materialComposition: '100% organic hemp canvas, thermal fleece' },
  { _id: '19', name: 'Zero-Waste Market Tote', slug: 'zero-waste-market-tote', category: 'Tiffin Tote', fabric: 'Recycled Cotton', quiltingPattern: 'Square', price: 1499, ecoScore: 97, description: 'Heavy-duty quilted tote bag with reinforced handles for weekly farmers market hauls.', features: ['Reinforced base', 'Internal bottle loops', 'Heavy canvas weave'], materialComposition: '100% recycled cotton duck canvas' },
  { _id: '20', name: 'Quilted Snack Pod Set', slug: 'quilted-snack-pod-set', category: 'Snack Bag', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 899, ecoScore: 94, description: 'Trio of color-coded quilted snack pods for nuts, dried fruit, and trail mix.', features: ['Set of 3 sizes', 'Food-grade lining', 'Dishwasher safe liner'], materialComposition: '100% organic cotton shell, PEVA eco-liner' },
  { _id: '21', name: 'Vintage Linen Tea Cozy', slug: 'vintage-linen-tea-cozy', category: 'Food Wrap', fabric: 'Linen', quiltingPattern: 'Diamond', price: 799, ecoScore: 91, description: 'Hand-quilted French linen cozy that keeps teapots warm while brewing.', features: ['Heat insulated', 'Hanging loop', 'Soft linen texture'], materialComposition: '100% washed French linen, wool batting' },
  { _id: '22', name: 'Eco Cutlery & Straw Roll', slug: 'eco-cutlery-straw-roll', category: 'Cutlery Holder', fabric: 'Organic Cotton', quiltingPattern: 'Plain', price: 649, ecoScore: 95, description: 'Slender roll-up holder with individual slots for bamboo fork, spoon, knife, and metal straw.', features: ['Individual slots', 'Wipeable interior', 'Tie wrap'], materialComposition: '100% organic cotton' },
  { _id: '23', name: 'Quilted Farmer Carryall', slug: 'quilted-farmer-carryall', category: 'Tiffin Tote', fabric: 'Recycled Cotton', quiltingPattern: 'Diamond', price: 1799, ecoScore: 96, description: 'Extra-roomy quilted tote with interior dividers for fresh produce and baked goods.', features: ['4 interior pockets', 'Extra wide straps', 'Foldable'], materialComposition: '100% recycled heavy cotton' },
  { _id: '24', name: 'Foldable Beeswax Fabric Wrap', slug: 'foldable-beeswax-fabric-wrap', category: 'Food Wrap', fabric: 'Organic Cotton', quiltingPattern: 'Wave', price: 849, ecoScore: 98, description: 'Natural organic cotton wrap infused with organic beeswax and jojoba oil to seal bowls and sandwiches.', features: ['Natural antibacterial', 'Self-sealing warmth', 'Reusable for 1 year'], materialComposition: 'Organic cotton, organic beeswax, tree resin, jojoba oil' },
].map((product) => ({ ...product, images: [{ url: getProductImageUrl(product) }] }));

export const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(price);
