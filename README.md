# EcoPocket — Full-Stack Web App

A sustainable-textile e-commerce site: React/Vite/Tailwind frontend + Express/MongoDB backend, with JWT auth,
an admin dashboard, and a rule-based EcoBot chat widget.

## Quick start

### 1. Backend
```bash
cd backend
cp .env.example .env      # then fill in MONGODB_URI at minimum
npm install
npm run seed               # populates 10 products, 3 blog posts, testimonials, an admin user
npm run dev                 # http://localhost:5000
```
Seeded admin login: `admin@ecopocket.com` / `ChangeMe123!` — **change this password immediately** after first login.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173 (proxies /api to the backend)
```

Open http://localhost:5173 — the whole public site, auth flow, user dashboard, and admin dashboard shell are live.

## What's fully working right now
- Every public page: Home, About, Products (filter/search/sort), Product Details (image slider, similar products),
  Quilting Process timeline, Sustainability dashboard (Chart.js), Gallery (masonry, category filter), Blog + single post,
  FAQ accordion, Contact form (writes to the database and emails you if `EMAIL_*` is set)
- Full auth flow: register, login, email verification, forgot/reset password, JWT stored client-side, protected routes
- User dashboard (profile, wishlist/saved-products placeholders, newsletter toggle, feedback form)
- Admin dashboard: full admin console — Products (create/edit/delete with image URL **and** file uploads, price, stock and
  every detail field), Blog editor, User role management, contact-message triage, Testimonial moderation, Gallery
  manager, Newsletter subscriber list, and live analytics tiles
- EcoBot floating chat widget on every page: rule-based product recommendations, fabric/quilting explainer, care
  instructions, environmental-impact facts, blog suggestions, contact-form escalation, typing indicator, quick
  replies, chat history (saved per session in MongoDB), and voice input/output via the Web Speech API where supported
- Dark/light mode, fully responsive, glassmorphism styling in the brief's exact palette (forest/sage/cream/earth/white)
  and fonts (Poppins/Open Sans)
- Security middleware: Helmet, CORS, rate limiting, express-validator, bcrypt password hashing, Multer file-type/size
  limits

## What needs your own credentials to go fully live
| Feature | What you need | Where |
|---|---|---|
| Database | A free MongoDB Atlas cluster | `backend/.env` → `MONGODB_URI` |
| Image uploads | Optional — files are stored locally under `backend/public/uploads/` and served from `/uploads` until you add a Cloudinary account | `backend/.env` → `CLOUDINARY_*` |
| Emails (verification, reset, contact) | An SMTP provider (Gmail app password, SendGrid, etc.) | `backend/.env` → `EMAIL_*` |
| AI-generated EcoBot replies (optional upgrade) | An LLM API key | Single hook point in `backend/controllers/chatController.js` — see the comment at the top of that file |

Without these, everything still runs: routes that need the DB return a clean error instead of crashing, and EcoBot's
rule-based answers work with no key at all.

## What's intentionally left as a next step
The User Dashboard's Saved Products/Wishlist tabs have the backing schema (on the `User` model) but no product-save UI
wired up yet, and Orders is out of scope per the original brief ("optional"). PWA config, multi-language support, and a
downloadable PDF brochure are not implemented.

## Project structure
```
ecopocket-app/
  backend/
    config/       # MongoDB + Cloudinary setup
    models/       # Mongoose schemas
    controllers/   # Route logic
    routes/        # Express routers
    middleware/     # auth, validation, rate limiting, error handling, uploads
    utils/          # JWT + email helpers
    scripts/seed.js
    server.js
  frontend/
    src/
      api/axios.js       # configured Axios instance with JWT interceptor
      context/            # Auth + Theme React contexts
      components/
        layout/           # Navbar, Footer
        ui/                # ProductCard, StatCounter, Reveal (scroll animation)
        chat/EcoBot.jsx
      pages/               # one file per route, incl. pages/user and pages/admin
      App.jsx, main.jsx
```
