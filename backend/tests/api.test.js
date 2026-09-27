process.env.JWT_SECRET = 'ecopocket_test_secret_key_2026_change_me';
process.env.CLIENT_URL = 'http://localhost:5174';
process.env.NODE_ENV = 'test';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Must be required AFTER the env vars above are set (and calls no connectDB/listen).
const app = require('../app');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

let mongo;
let server;
let base;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  server = app.listen(0);
  const { port } = server.address();
  base = `http://127.0.0.1:${port}/api`;
});

after(async () => {
  if (server) server.close();
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

async function req(method, url, { token, body, status } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(base + url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  assert.equal(res.status, status === undefined ? 200 : status, `${method} ${url} → got ${res.status}: ${JSON.stringify(data)}`);
  return { status: res.status, data };
}

test('GET /health is reachable', async () => {
  const { status, data } = await req('GET', '/health');
  assert.equal(status, 200);
  assert.equal(data.success, true);
});

test('auth: register → duplicate → wrong login → login → /auth/me', async () => {
  const email = `user-${Date.now()}@example.com`;
  await req('POST', '/auth/register', { body: { name: 'Test User', email, password: 'Password123!' }, status: 201 });
  await req('POST', '/auth/register', { body: { name: 'Test User', email, password: 'Password123!' }, status: 409 });
  await req('POST', '/auth/login', { body: { email, password: 'WrongPass123!' }, status: 401 });

  const login = await req('POST', '/auth/login', { body: { email, password: 'Password123!' }, status: 200 });
  assert.ok(login.data.token);

  const me = await req('GET', '/auth/me', { token: login.data.token, status: 200 });
  assert.equal(me.data.user.email, email);
  assert.equal(me.data.user.mustChangePassword, false);
});

test('admin endpoints: 401 unauthenticated, 403 non-admin, 200 admin', async () => {
  await req('GET', '/admin/analytics', { status: 401 });

  const normal = await User.create({ name: 'Normal User', email: `normal-${Date.now()}@example.com`, password: 'Password123!', isEmailVerified: true });
  await req('GET', '/admin/analytics', { token: generateToken(normal._id), status: 403 });

  const admin = await User.create({ name: 'Admin User', email: `adm-${Date.now()}@example.com`, password: 'Password123!', role: 'admin', isEmailVerified: true });
  const analytics = await req('GET', '/admin/analytics', { token: generateToken(admin._id), status: 200 });
  assert.ok(analytics.data.analytics);
});

test('products: create (auto-slug), duplicate slug → 400, update (price+images), delete', async () => {
  const admin = await User.create({ name: 'Crud Admin', email: `crud-${Date.now()}@example.com`, password: 'Password123!', role: 'admin' });
  const token = generateToken(admin._id);

  const created = await req('POST', '/products', {
    token,
    body: {
      name: 'Crud Test Pocket',
      category: 'Snack Bag',
      fabric: 'Linen',
      price: 100,
      stock: 5,
      description: 'Test product.',
      images: [{ url: '/images/products/snack-bag.jpg' }],
    },
    status: 201,
  });
  assert.equal(created.data.product.slug, 'crud-test-pocket');
  const id = created.data.product._id;

  await req('POST', '/products', {
    token,
    body: { name: 'Crud Test Pocket', category: 'Snack Bag', fabric: 'Linen', price: 100, stock: 5, description: 'duplicate slug case' },
    status: 400,
  });

  const updated = await req('PUT', `/products/${id}`, {
    token,
    body: { price: 250, images: [{ url: '/images/products/bread-bag.jpg' }, { url: '/images/products/lunch-wrap.jpg' }] },
    status: 200,
  });
  assert.equal(updated.data.product.price, 250);
  assert.equal(updated.data.product.images.length, 2);

  const del = await req('DELETE', `/products/${id}`, { token, status: 200 });
  assert.equal(del.data.success, true);
});

test('mustChangePassword: blocks other routes, clears after a real password change', async () => {
  const u = await User.create({ name: 'Flagged Admin', email: `flag-${Date.now()}@example.com`, password: 'Password123!', role: 'admin', mustChangePassword: true });
  const token = generateToken(u._id);

  const blocked = await req('GET', '/auth/me', { token, status: 403 });
  assert.equal(blocked.data.code, 'PASSWORD_CHANGE_REQUIRED');

  await req('POST', '/auth/change-password', { token, body: { currentPassword: 'WrongPass123!', newPassword: 'NewPassword123!' }, status: 400 });

  const changed = await req('POST', '/auth/change-password', { token, body: { currentPassword: 'Password123!', newPassword: 'NewPassword123!' }, status: 200 });
  assert.equal(changed.data.user.mustChangePassword, false);
  assert.ok(changed.data.token);

  const me = await req('GET', '/auth/me', { token: changed.data.token, status: 200 });
  assert.equal(me.data.user.mustChangePassword, false);

  await req('POST', '/auth/login', { body: { email: u.email, password: 'Password123!' }, status: 401 });
  await req('POST', '/auth/login', { body: { email: u.email, password: 'NewPassword123!' }, status: 200 });
});