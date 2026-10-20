/**
 * POST /api/payme/cancel — the customer closed the QR window.
 * Body: { orderId }. Cancels the PayMe payment request so the QR can no longer
 * be paid, unless the payment has already gone through.
 */

import { cancelPaymentRequest } from '../_lib/payme.js';
import { getOrder, updateOrder } from '../_lib/store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const order = await getOrder(String(req.body?.orderId || ''));
    if (!order) return res.status(404).json({ status: 'unknown' });
    if (order.status !== 'pending') return res.status(200).json({ status: order.status });

    try {
      if (order.paymentRequestId) await cancelPaymentRequest(order.paymentRequestId);
    } catch (error) {
      /* EB021: already completed. The webhook will confirm it, so keep it pending. */
      const code = JSON.stringify(error?.body || '');
      if (code.includes('EB021') || code.includes('EB022')) return res.status(200).json({ status: 'pending' });
      console.error('payme cancel failed', error?.message, code);
    }

    const next = await updateOrder(order.id, { status: 'cancelled' });
    return res.status(200).json({ status: next?.status || 'cancelled' });
  } catch (error) {
    console.error('payme cancel error', error);
    return res.status(500).json({ error: 'Could not cancel' });
  }
}
