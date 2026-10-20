/**
 * Pricing and validation for PayMe orders.
 *
 * Prices, names and the shipping rule are re-read from src/data.mjs, exactly as
 * api/checkout.js does for Stripe, so a tampered cart cannot change the amount.
 * All money here is HKD in cents.
 */

import crypto from 'node:crypto';
import { PRODUCTS, SHOP } from '../../src/data.mjs';

export const SHIPPING_FEE = 3000; // HK$30 — same as api/checkout.js
export const MAX_QTY = 20;

/** The only discount code. 10% off the products (delivery is not discounted,
 *  which matches how the same code behaves on the Stripe payment page). */
const COUPONS = {
  EEGU10OFF: { percentOff: 10 },
};

export class OrderError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'OrderError';
    this.status = status;
  }
}

export function priceCart(items, couponCode) {
  if (!Array.isArray(items) || items.length === 0) throw new OrderError('Cart is empty');

  const lines = items.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item?.id);
    if (!product) throw new OrderError(`Unknown product: ${item?.id}`);
    const qty = Math.min(MAX_QTY, Math.max(1, parseInt(item.qty, 10) || 1));
    return {
      id: product.id,
      name: product.name,
      variant: product.variant,
      unit: product.price,
      qty,
      amount: product.price * qty,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  let coupon = null;
  let discount = 0;
  const code = String(couponCode || '').trim().toUpperCase();
  if (code) {
    if (!COUPONS[code]) throw new OrderError('That discount code is not valid.');
    coupon = code;
    discount = Math.round((subtotal * COUPONS[code].percentOff) / 100);
  }

  const shipping = subtotal >= SHOP.freeShippingOver ? 0 : SHIPPING_FEE;
  return { lines, subtotal, coupon, discount, shipping, total: subtotal - discount + shipping };
}

const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function validateCustomer(input = {}) {
  const customer = {
    name: clean(input.name, 100),
    email: clean(input.email, 160).toLowerCase(),
    phone: clean(input.phone, 30),
    address1: clean(input.address1, 160),
    address2: clean(input.address2, 160),
    district: clean(input.district, 80),
  };
  if (customer.name.length < 2) throw new OrderError('Please enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)) throw new OrderError('Please enter a valid email address.');
  if (customer.phone.replace(/\D/g, '').length < 8) throw new OrderError('Please enter a phone number we can reach you on.');
  if (customer.address1.length < 3) throw new OrderError('Please enter your delivery address.');
  return customer;
}

/** e.g. VT261020-K7Q2M9XD — date plus 8 random characters (unguessable). */
export function newOrderId() {
  const d = new Date(Date.now() + 8 * 3600 * 1000); // Hong Kong date
  const stamp = d.toISOString().slice(2, 10).replace(/-/g, '');
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const random = Array.from(crypto.randomBytes(8), (b) => alphabet[b % alphabet.length]).join('');
  return `VT${stamp}-${random}`;
}

export const hkd = (cents) => `HK$${(cents / 100).toFixed(2).replace(/\.00$/, '')}`;
