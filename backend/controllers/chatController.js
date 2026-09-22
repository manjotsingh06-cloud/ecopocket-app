const ChatMessage = require('../models/ChatMessage');
const Product = require('../models/Product');
const Blog = require('../models/Blog');

/**
 * EcoBot — rule-based assistant.
 *
 * This works out of the box with no external API key: it matches the incoming
 * message against a set of intents (keywords) and replies with canned,
 * fact-checked answers plus live product/blog data pulled from MongoDB.
 *
 * ── Upgrading to a real LLM ──────────────────────────────────────────────
 * To make EcoBot generate genuinely AI-written answers, replace the body of
 * `getBotReply()` below with a call to your provider of choice (e.g. the
 * Anthropic Messages API), passing the user's message plus a short system
 * prompt describing EcoPocket's products/policies, and return the model's
 * text instead of the rule-based reply. Everything else in this file
 * (session history, product-card attachments, escalation) stays the same.
 * ─────────────────────────────────────────────────────────────────────────
 */

const CARE_INSTRUCTIONS = 'Most EcoPocket products are machine washable on a gentle, cold cycle; a few delicate linen styles are hand-wash only — check the product page for your specific item. Avoid bleach and tumble drying on high heat to protect the quilting.';

const NEEDS_MAP = [
  { keywords: ['lunch', 'sandwich'], category: 'Sandwich Pocket' },
  { keywords: ['chapati', 'roti', 'flatbread'], category: 'Chapati Pocket' },
  { keywords: ['snack', 'chips'], category: 'Snack Bag' },
  { keywords: ['bread', 'loaf'], category: 'Bread Bag' },
  { keywords: ['fruit'], category: 'Fruit Pocket' },
  { keywords: ['bottle', 'water bottle', 'drink'], category: 'Bottle Sleeve' },
  { keywords: ['coffee', 'cup', 'tea'], category: 'Coffee Cup Sleeve' },
  { keywords: ['cutlery', 'fork', 'spoon'], category: 'Cutlery Holder' },
  { keywords: ['picnic'], category: 'Picnic Organizer' },
  { keywords: ['wrap', 'meal prep'], category: 'Lunch Wrap' },
];

function matches(text, keywords) {
  return keywords.some((k) => text.includes(k));
}

async function getBotReply(rawMessage) {
  const msg = rawMessage.toLowerCase();

  // 1) Product recommendation based on stated need
  const need = NEEDS_MAP.find((n) => matches(msg, n.keywords));
  if (need) {
    const products = await Product.find({ category: need.category }).limit(3);
    return {
      text: `For ${need.category.toLowerCase()}s, I'd recommend our ${need.category} line — quilted, washable, and built to replace single-use packaging for that exact job.`,
      products,
    };
  }

  // 2) Quilting / fabric explainer
  if (matches(msg, ['quilt', 'stitch', 'pattern', 'fabric', 'material', 'hemp', 'linen', 'cotton'])) {
    return {
      text: "EcoPocket fabric goes through 7 stages: sustainable fabric selection (organic cotton, hemp, linen, or recycled cotton) → cotton/bamboo batting → layering → quilting (diamond, square, or wave pattern) → cutting → stitching → finished pocket. The quilting pattern isn't just decorative — it reinforces the fabric so it survives hundreds of washes.",
    };
  }

  // 3) Care / washing instructions
  if (matches(msg, ['wash', 'clean', 'care', 'maintain'])) {
    return { text: CARE_INSTRUCTIONS };
  }

  // 4) Environmental benefits / zero waste
  if (matches(msg, ['environment', 'sustainab', 'plastic', 'zero waste', 'eco', 'carbon'])) {
    return {
      text: 'A single EcoPocket typically replaces 500+ uses of disposable wrap or bags. Across our customers so far that adds up to over 12,500 plastic bags avoided, roughly 38% less carbon than equivalent single-use packaging, and tens of thousands of litres of water saved through material choice alone.',
    };
  }

  // 5) Suggest related blog articles
  if (matches(msg, ['article', 'blog', 'learn more', 'read'])) {
    const blogs = await Blog.find({ published: true }).sort('-createdAt').limit(3);
    return { text: 'Here are a few articles that go deeper on this:', blogs };
  }

  // 6) Navigation help
  if (matches(msg, ['where', 'find', 'page', 'navigate'])) {
    return {
      text: "You can browse everything from the top navigation: Products for the shop, Quilting Process to see how each pocket is made, Sustainability for our impact dashboard, and Contact if you'd like to reach a human directly.",
    };
  }

  // 7) Fallback — escalate to the contact form
  return {
    text: "I don't have a confident answer for that one yet — let me connect you with our team instead. You can reach us through the contact form and we'll get back to you within 2 business days.",
    escalate: true,
  };
}

// POST /api/chat  { sessionId, message }
async function sendMessage(req, res, next) {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ success: false, message: 'sessionId and message are required.' });
    }

    await ChatMessage.create({ sessionId, user: req.user?._id, role: 'user', text: message });

    const reply = await getBotReply(message);
    await ChatMessage.create({ sessionId, user: req.user?._id, role: 'bot', text: reply.text, meta: reply });

    res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
}

// GET /api/chat/:sessionId/history
async function getHistory(req, res, next) {
  try {
    const history = await ChatMessage.find({ sessionId: req.params.sessionId }).sort('createdAt');
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage, getHistory };
