/**
 * Marks a PayMe order as paid. Called by the webhook and by the status
 * fallback, so it must be safe to run twice: the order is only flipped once and
 * the emails go out once (guarded by a Redis lock).
 */

import { getOrder, saveOrder, redis } from './store.js';
import { sendOrderEmails, sendReviewAlert } from './email.js';

export async function markPaid(orderId, { transactionId, paidAmount } = {}) {
  const order = await getOrder(orderId);
  if (!order) return { ok: false, reason: 'unknown order' };
  if (order.status === 'paid') return { ok: true, already: true, order };

  /* PayMe reports dollars; we store cents. A mismatch is never auto-accepted. */
  if (paidAmount !== undefined && paidAmount !== null && Math.round(Number(paidAmount) * 100) !== order.total) {
    const flagged = { ...order, status: 'needs_review', note: `Paid ${paidAmount}, expected ${order.total / 100}` };
    await saveOrder(flagged);
    await sendReviewAlert(flagged, 'the amount PayMe reported does not match the order total', { paidAmount, expected: order.total / 100, transactionId });
    return { ok: false, reason: 'amount mismatch' };
  }

  const paid = {
    ...order,
    status: 'paid',
    paidAt: new Date().toISOString(),
    transactionId: transactionId || order.transactionId || null,
  };
  await saveOrder(paid);

  const first = await redis().set(`payme:mail:${orderId}`, '1', { nx: true, ex: 60 * 60 * 24 * 30 });
  if (first) await sendOrderEmails(paid);

  return { ok: true, order: paid };
}
