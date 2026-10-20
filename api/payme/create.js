/**
 * POST /api/payme/create — starts a PayMe payment.
 *
 * Body: { items: [{id, qty}], customer: {...}, coupon?: string, lang?: 'en'|'zh' }
 *
 * Re-prices the cart on the server, saves the order as "pending" in Redis,
 * creates a PayMe payment request, and returns the PayCode (as an SVG QR) plus
 * the mobile deep link. The order is marked paid later, by the webhook.
 */

import QRCode from 'qrcode';
import { hkd, newOrderId, OrderError, priceCart, validateCustomer } from '../_lib/orders.js';
import { createPaymentRequest, extractLinks, PaymeError } from '../_lib/payme.js';
import { linkPaymentRequest, redis, saveOrder, updateOrder } from '../_lib/store.js';

const DURATION = 600; // seconds the QR stays valid

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    /* Light abuse guard: 10 new payment requests per minute per visitor. */
    const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
    const rateKey = `payme:rl:${ip}`;
    const hits = await redis().incr(rateKey);
    if (hits === 1) await redis().expire(rateKey, 60);
    if (hits > 10) return res.status(429).json({ error: 'Too many attempts. Please wait a minute and try again.' });

    const { items, customer: rawCustomer, coupon, lang = 'en' } = req.body || {};
    const language = lang === 'zh' ? 'zh' : 'en';
    const customer = validateCustomer(rawCustomer);
    const priced = priceCart(items, coupon);

    const id = newOrderId();
    const origin = process.env.SITE_URL || (req.headers.origin ? String(req.headers.origin) : `https://${req.headers.host}`);
    const prefix = language === 'zh' ? '/zh' : '';

    await saveOrder({
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      lang: language,
      customer,
      ...priced,
    });

    let pr;
    try {
      pr = await createPaymentRequest({
        totalCents: priced.total,
        orderId: id,
        description: `VITAS online order ${id}`,
        details: priced.lines.map((l) => `${l.id} x${l.qty}`).join(', ') + (priced.coupon ? ` | code ${priced.coupon}` : ''),
        notificationUri: `${origin}/api/payme/webhook`,
        successUrl: `${origin}${prefix}/checkout/success/?payme=${id}`,
        failUrl: `${origin}${prefix}/cart/?payme=failed`,
        durationSeconds: DURATION,
      });
    } catch (error) {
      await updateOrder(id, { status: 'failed', note: 'could not create PayMe payment request' });
      throw error;
    }

    const paymentRequestId = pr.paymentRequestId || pr.id;
    if (!paymentRequestId) throw new PaymeError('PayMe response had no paymentRequestId', { body: pr });

    const links = extractLinks(pr);
    await updateOrder(id, { paymentRequestId, expiresAt: Date.now() + DURATION * 1000 });
    await linkPaymentRequest(paymentRequestId, id);

    const qrSvg = await QRCode.toString(links.web, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' });

    return res.status(200).json({
      orderId: id,
      qrSvg,
      appLink: links.app,
      expiresIn: DURATION,
      summary: {
        subtotal: hkd(priced.subtotal),
        discount: priced.discount ? hkd(priced.discount) : null,
        coupon: priced.coupon,
        shipping: priced.shipping ? hkd(priced.shipping) : null,
        total: hkd(priced.total),
      },
    });
  } catch (error) {
    if (error instanceof OrderError) return res.status(error.status).json({ error: error.message });
    console.error('payme create failed', error?.message, error?.status, JSON.stringify(error?.body || {}));
    return res.status(500).json({ error: 'Could not start PayMe payment. Please try again or choose another payment method.' });
  }
}
