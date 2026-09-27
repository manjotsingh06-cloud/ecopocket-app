import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice } from './products.js';

test('formatPrice renders plain rupee amounts without decimals', () => {
  assert.equal(formatPrice(799), '₹799');
});

test('formatPrice uses Indian grouping for thousands', () => {
  assert.equal(formatPrice(99999), '₹99,999');
});

test('formatPrice handles zero', () => {
  assert.equal(formatPrice(0), '₹0');
});