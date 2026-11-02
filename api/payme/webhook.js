/**
 * POST /api/payme/webhook — PayMe's payment notification.
 *
 * PayMe posts here when a payment succeeds or fails (events payment.success and
 * payment.failure). Any other event (e.g. a refund) is forwarded to n8n. The body is signed, so we verify the Digest and Signature
 * before trusting anything. After verification we always answer 200, otherwise
 * PayMe retries up to five times.
 */

import { markPaid } from '../_lib/fulfil.js';
import { verifyWebhook } from '../_lib/payme.js';
import { getOrder, orderIdForPaymentRequest, updateOrder } from '../_lib/store.js';

/**
 * Forward any PayMe event we do not handle ourselves (for example a refund) to the
 * n8n refunds workflow, which records refunds in Master Invoices or emails the raw
 * payload so it can be looked at. Never throws: PayMe must always get its 200.
 */
async function forwardToN8n(eventType, orderId, payload) {
  const base = process.env.N8N_INVOICE_WEBHOOK_URL;
  const secret = process.env.N8N_INVOICE_SECRET;
  if (!base || !secret) {
    console.warn('[payme event forward skipped: N8N_INVOICE_WEBHOOK_URL / N8N_INVOICE_SECRET not set]', eventType);
    return;
  }
  try {
    const url = `${new URL(base).origin}/webhook/vitas-payme-event-jegpeercl0h95clv`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-vitas-key': secret },
      body: JSON.stringify({ eventType, orderId: orderId || '', payload }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('payme event forward failed', res.status, await res.text());
  } catch (error) {
    console.error('payme event forward error', eventType, error);
  }
}

/* Read the raw body: the Digest is computed over the exact bytes PayMe sent. */
async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let raw;
  try {
    raw = await rawBody(req);
    const check = verifyWebhook(req, raw);
    if (!check.ok) {
      console.warn('payme webhook rejected:', check.reason);
      return res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('payme webhook verification error', error);
    return res.status(500).json({ error: 'Webhook error' });
  }

  try {
    const body = JSON.parse(raw);
    const payload = body.payload || body;
    const eventType = String(req.headers['x-event-type'] || '');
    const transaction = Array.isArray(payload.transactions) ? payload.transactions[0] : null;

    const orderId =
      transaction?.orderId ||
      payload.orderId ||
      (await orderIdForPaymentRequest(payload.paymentRequestId));

    const handled = eventType === 'payment.success' || eventType === 'payment.failure' || payload.statusCode === 'PR005';
    if (!handled) {
      await forwardToN8n(eventType, orderId, payload);
      return res.status(200).json({ ok: true });
    }

    if (!orderId || !(await getOrder(orderId))) {
      console.warn('payme webhook for unknown order', orderId, payload.paymentRequestId);
      return res.status(200).json({ ok: true });
    }

    if (eventType === 'payment.success' || payload.statusCode === 'PR005') {
      const result = await markPaid(orderId, {
        transactionId: transaction?.transactionId,
        paidAmount: payload.totalAmount,
      });
      if (!result.ok) console.warn('payme order not marked paid:', orderId, result.reason);
    } else if (eventType === 'payment.failure') {
      const order = await getOrder(orderId);
      if (order && order.status !== 'paid') {
        await updateOrder(orderId, {
          status: 'failed',
          note: `${payload.reasonCode || ''} ${payload.reasonDescription || ''}`.trim(),
        });
      }
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('payme webhook handling failed', error);
    /* 500 makes PayMe retry, which is what we want for a transient failure. */
    return res.status(500).json({ error: 'Webhook error' });
  }
}
