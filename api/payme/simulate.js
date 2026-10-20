/**
 * GET /api/payme/simulate[?orderId=…] — TEST ONLY.
 *
 * PayMe's sandbox gives no way to complete a payment from the website's side,
 * so this stands in for PayMe's "payment succeeded" notification: it marks the
 * most recent pending PayMe order (or the one named) as paid and sends the
 * order emails, exactly as the real webhook would.
 *
 * It refuses to run on the live site and whenever PAYME_ENV=live, so it can
 * never mark a real order as paid.
 */

import { markPaid } from '../_lib/fulfil.js';
import { getOrder, redis } from '../_lib/store.js';

export default async function handler(req, res) {
  const onPreview = process.env.VERCEL_ENV === 'preview';
  const sandbox = process.env.PAYME_ENV !== 'live';
  if (!onPreview || !sandbox) return res.status(404).json({ error: 'Not found' });

  try {
    const orderId = String(req.query.orderId || (await redis().get('payme:last')) || '');
    const order = await getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'No recent PayMe order found. Start a PayMe payment first.' });
    if (order.status !== 'pending') return res.status(200).json({ orderId, status: order.status, note: 'Order was not pending, so nothing changed.' });

    const result = await markPaid(orderId, { transactionId: 'SIMULATED-TEST', paidAmount: order.total / 100 });
    return res.status(200).json({
      orderId,
      status: result.ok ? 'paid' : 'not paid',
      note: 'Simulated test payment. Watch the QR window on the cart page, and check the two emails.',
    });
  } catch (error) {
    console.error('payme simulate failed', error);
    return res.status(500).json({ error: String(error?.message || error) });
  }
}
