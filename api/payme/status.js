/**
 * GET /api/payme/status?orderId=… — what the cart page polls while the QR is up.
 *
 * Normally the answer comes from Redis, written by the webhook. If no webhook
 * has arrived 60 seconds after the order was created, this asks PayMe directly
 * (at most once every 10 seconds, as PayMe recommends).
 */

import { markPaid } from '../_lib/fulfil.js';
import { getPaymentRequest } from '../_lib/payme.js';
import { getOrder, updateOrder } from '../_lib/store.js';

/** a***z@gmail.com — enough for a customer to spot a typo, not enough to harvest. */
export function maskEmail(email) {
  const [local = '', domain = ''] = String(email || '').split('@');
  if (!local || !domain) return '';
  const shown = local.length <= 2 ? local[0] : `${local[0]}***${local[local.length - 1]}`;
  return `${shown}@${domain}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let order = await getOrder(String(req.query.orderId || ''));
    if (!order) return res.status(404).json({ status: 'unknown' });

    const age = Date.now() - new Date(order.createdAt).getTime();
    const sincePoll = Date.now() - (order.lastPoll || 0);

    if (order.status === 'pending' && order.paymentRequestId && age > 60_000 && sincePoll > 10_000) {
      order = (await updateOrder(order.id, { lastPoll: Date.now() })) || order;
      try {
        const pr = await getPaymentRequest(order.paymentRequestId);
        const state = String(pr.paymentState || pr.state || pr.status || '');
        const tx = Array.isArray(pr.transactions) ? pr.transactions[0] : null;

        if (pr.statusCode === 'PR005' || /complete/i.test(state)) {
          const result = await markPaid(order.id, { transactionId: tx?.transactionId, paidAmount: pr.totalAmount });
          if (result.order) order = result.order;
        } else if (pr.statusCode === 'PR007' || /expire/i.test(state)) {
          order = (await updateOrder(order.id, { status: 'expired' })) || order;
        } else if (/abort/i.test(state)) {
          order = (await updateOrder(order.id, { status: 'cancelled' })) || order;
        }
      } catch (error) {
        console.error('payme status check failed', error?.message, error?.status);
      }
    }

    return res.status(200).json({ status: order.status, emailHint: maskEmail(order.customer?.email) });
  } catch (error) {
    console.error('payme status failed', error);
    return res.status(500).json({ error: 'Could not check status' });
  }
}
