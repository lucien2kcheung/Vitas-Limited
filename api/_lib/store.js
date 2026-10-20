/**
 * Order storage for PayMe orders — Upstash Redis, connected from the Vercel
 * Marketplace (Project → Storage). Vercel injects KV_REST_API_URL and
 * KV_REST_API_TOKEN; the UPSTASH_REDIS_REST_* names are accepted too.
 *
 * Orders live for 30 days, then expire on their own.
 */

import { Redis } from '@upstash/redis';

const ORDER_TTL = 60 * 60 * 24 * 30;

let client;

export function redis() {
  if (!client) {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error('Upstash Redis is not connected (KV_REST_API_URL / KV_REST_API_TOKEN missing).');
    }
    client = new Redis({ url, token });
  }
  return client;
}

const orderKey = (id) => `payme:order:${id}`;
const requestKey = (id) => `payme:pr:${id}`;

export async function saveOrder(order) {
  await redis().set(orderKey(order.id), order, { ex: ORDER_TTL });
  return order;
}

export async function getOrder(id) {
  if (!id || typeof id !== 'string') return null;
  return (await redis().get(orderKey(id))) || null;
}

export async function updateOrder(id, patch) {
  const order = await getOrder(id);
  if (!order) return null;
  const next = { ...order, ...patch };
  await saveOrder(next);
  return next;
}

/** Lets the webhook find an order from PayMe's paymentRequestId. */
export async function linkPaymentRequest(paymentRequestId, orderId) {
  await redis().set(requestKey(paymentRequestId), orderId, { ex: ORDER_TTL });
}

export async function orderIdForPaymentRequest(paymentRequestId) {
  if (!paymentRequestId) return null;
  return (await redis().get(requestKey(paymentRequestId))) || null;
}
