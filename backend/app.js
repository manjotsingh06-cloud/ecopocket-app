const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const resolveJwtSecret = require('./utils/jwtSecret');

// Lock in a non-public signing key before any route can be reached. Everything
// downstream keeps reading process.env.JWT_SECRET, so nothing else has to change.
process.env.JWT_SECRET = resolveJwtSecret();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const blogRoutes = require('./routes/blogRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const chatRoutes = require('./routes/chatRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Serve admin-uploaded images (local fallback until Cloudinary keys are added).
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ---------- Security & core middleware ----------
app.use(helmet());
// Allow the configured CLIENT_URL, the Vercel production domain, and any Vercel
// preview URLs. In development fall back to localhost:5174.
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5174',
  'http://localhost:5173',
  'https://ecopocket-app.vercel.app',
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // Allow server-to-server (no origin) and any explicitly listed origin.
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // Also allow any *.vercel.app preview deployment.
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // also guards against oversized payloads
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

// ---------- Health check ----------
const { isMongo } = require('./config/db');
app.get('/api/health', (req, res) => res.json({
  success: true,
  message: 'EcoPocket API is running.',
  storage: isMongo() ? 'mongodb' : 'file-store',
  env: process.env.NODE_ENV || 'not-set',
}));

// ---------- Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// ---------- Error handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;