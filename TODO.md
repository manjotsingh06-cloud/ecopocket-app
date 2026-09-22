# EcoPocket – Frontend-Backend Connection Analysis & Setup

## 1. Project Architecture

```
ecopocket-app/
├── backend/                  # Backend (Node + Express + MongoDB)
│   ├── package.json
│   ├── server.js             # Express server entry point
│   └── src/
│       ├── models/           # Mongoose models (User, Product, Order, Category)
│       └── seed.js           # Database seeding script
├── frontend/                 # React + Vite frontend
│   ├── package.json
│   ├── .env.development      # Vite env: VITE_API_URL=http://localhost:5173/api
│   ├── vite.config.js        # Vite proxy: /api → http://localhost:5000
│   └── src/                  # React source files (App.tsx, etc.)
├── index.html
├── package.json              # Root: concurrently + scripts
├── seed.js                   # Database seeding script
└── server/                   # Backend
    ├── server.js             # Express server on port 5000
    ├── package.json
    ├── config/db.js
    └── (controllers, models, routes folders)