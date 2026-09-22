import { useState } from 'react';
import Reveal from '../components/ui/Reveal';

const CATEGORIES = ['All', 'Sandwich Pocket', 'Food Wrap', 'Snack Bag', 'Tiffin Tote', 'Bottle Sleeve', 'Cutlery Holder', 'Lunch Wrap'];

const GALLERY_ITEMS = [
  { id: 1,  slug: 'quilted-sandwich-pocket',   caption: 'Quilted Sandwich Pocket',    category: 'Sandwich Pocket',  img: '/images/products/quilted-sandwich-pocket.jpg' },
  { id: 2,  slug: 'chapati-pocket',            caption: 'Chapati Pocket',             category: 'Sandwich Pocket',  img: '/images/products/chapati-pocket.jpg' },
  { id: 3,  slug: 'snack-bag',                 caption: 'Snack Bag',                  category: 'Snack Bag',        img: '/images/products/snack-bag.jpg' },
  { id: 4,  slug: 'bread-bag',                 caption: 'Bread Bag',                  category: 'Sandwich Pocket',  img: '/images/products/bread-bag.jpg' },
  { id: 5,  slug: 'fruit-pocket',              caption: 'Fruit Pocket',               category: 'Snack Bag',        img: '/images/products/fruit-pocket.jpg' },
  { id: 6,  slug: 'cutlery-holder',            caption: 'Cutlery Holder',             category: 'Cutlery Holder',   img: '/images/products/cutlery-holder.jpg' },
  { id: 7,  slug: 'lunch-wrap',                caption: 'Lunch Wrap',                 category: 'Lunch Wrap',       img: '/images/products/lunch-wrap.jpg' },
  { id: 8,  slug: 'bottle-sleeve',             caption: 'Bottle Sleeve',              category: 'Bottle Sleeve',    img: '/images/products/bottle-sleeve.jpg' },
  { id: 9,  slug: 'coffee-cup-sleeve',         caption: 'Coffee Cup Sleeve',          category: 'Bottle Sleeve',    img: '/images/products/coffee-cup-sleeve.jpg' },
  { id: 10, slug: 'tiffin-tote',              caption: 'Tiffin Tote',               category: 'Tiffin Tote',      img: '/images/products/tiffin-tote.jpg' },
  { id: 11, slug: 'beeswax-fabric-wrap',       caption: 'Beeswax Fabric Wrap',        category: 'Food Wrap',        img: '/images/products/beeswax-fabric-wrap.jpg' },
  { id: 12, slug: 'picnic-organizer',          caption: 'Picnic Organizer',           category: 'Tiffin Tote',      img: '/images/products/picnic-organizer.jpg' },
  { id: 13, slug: 'reusable-produce-bag-set',  caption: 'Reusable Produce Bag Set',   category: 'Snack Bag',        img: '/images/products/reusable-produce-bag-set.jpg' },
  { id: 14, slug: 'tea-time-wrap',             caption: 'Tea Time Wrap',              category: 'Food Wrap',        img: '/images/products/tea-time-wrap.jpg' },
  { id: 15, slug: 'insulated-casserole-cover', caption: 'Insulated Casserole Cover',  category: 'Food Wrap',        img: '/images/products/insulated-casserole-cover.jpg' },
  { id: 16, slug: 'travel-toiletry-pouch',     caption: 'Travel Toiletry Pouch',      category: 'Tiffin Tote',      img: '/images/products/travel-toiletry-pouch.jpg' },
  { id: 17, slug: 'herb-keeper-wrap',          caption: 'Herb Keeper Wrap',           category: 'Food Wrap',        img: '/images/products/herb-keeper-wrap.jpg' },
  { id: 18, slug: 'artisan-bento-roll',        caption: 'Artisan Bento Roll',         category: 'Lunch Wrap',       img: '/images/products/artisan-bento-roll.jpg' },
  { id: 19, slug: 'thermal-soup-jar-pouch',    caption: 'Thermal Soup Jar Pouch',     category: 'Bottle Sleeve',    img: '/images/products/thermal-soup-jar-pouch.jpg' },
  { id: 20, slug: 'zero-waste-market-tote',    caption: 'Zero-Waste Market Tote',     category: 'Tiffin Tote',      img: '/images/products/zero-waste-market-tote.jpg' },
  { id: 21, slug: 'quilted-snack-pod-set',     caption: 'Quilted Snack Pod Set',      category: 'Snack Bag',        img: '/images/products/quilted-snack-pod-set.jpg' },
  { id: 22, slug: 'vintage-linen-tea-cozy',    caption: 'Vintage Linen Tea Cozy',     category: 'Food Wrap',        img: '/images/products/vintage-linen-tea-cozy.jpg' },
  { id: 23, slug: 'eco-cutlery-straw-roll',    caption: 'Eco Cutlery & Straw Roll',   category: 'Cutlery Holder',   img: '/images/products/eco-cutlery-straw-roll.jpg' },
  { id: 24, slug: 'quilted-farmer-carryall',   caption: 'Quilted Farmer Carryall',    category: 'Tiffin Tote',      img: '/images/products/quilted-farmer-carryall.jpg' },
];

export default function Gallery() {
  const [category, setCategory] = useState('All');

  const display = category === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === category);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-display font-semibold tracking-widest uppercase text-earth mb-3">Gallery</p>
          <h1 className="font-display font-bold text-4xl text-forest dark:text-sage-soft">Our Product Collection</h1>
          <p className="mt-3 text-sm opacity-60">Handcrafted eco-friendly fabric essentials for everyday sustainable living.</p>
        </Reveal>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                category === c
                  ? 'bg-forest text-cream border-forest'
                  : 'border-forest/20 dark:border-white/20 opacity-75 hover:opacity-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {display.map((item, i) => (
            <Reveal key={item.id} delay={(i % 8) * 0.05} className="break-inside-avoid rounded-xl overflow-hidden relative group shadow-sm">
              <img
                src={item.img}
                alt={item.caption}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs font-semibold leading-tight">{item.caption}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{item.category}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {display.length === 0 && (
          <p className="text-center opacity-50 py-16">No items in this category.</p>
        )}
      </div>
    </div>
  );
}
