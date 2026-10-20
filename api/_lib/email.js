/**
 * Order emails via Resend (https://resend.com).
 *
 *   RESEND_API_KEY   required to send; without it emails are skipped and logged
 *   MAIL_FROM        default: VITAS 紓適寧 <info@vitas.com.hk> (domain must be verified in Resend)
 *   NOTIFY_EMAIL     where new-order alerts go; default info@vitas.com.hk
 */

import { hkd } from './orders.js';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function send({ to, subject, html, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email skipped: RESEND_API_KEY not set] ${subject} → ${to}`);
    return { skipped: true };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'VITAS 紓適寧 <info@vitas.com.hk>',
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

function itemRows(order, lang) {
  return order.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0">${esc(l.name[lang] || l.name.en)} — ${esc(l.variant[lang] || l.variant.en)} × ${l.qty}</td>` +
        `<td style="padding:6px 0;text-align:right">${hkd(l.amount)}</td></tr>`
    )
    .join('');
}

function totalsRows(order) {
  const row = (label, value) =>
    `<tr><td style="padding:3px 0;color:#555">${label}</td><td style="padding:3px 0;text-align:right">${value}</td></tr>`;
  return [
    row('Subtotal · 小計', hkd(order.subtotal)),
    order.discount ? row(`Discount ${esc(order.coupon)} · 優惠`, `−${hkd(order.discount)}`) : '',
    row('Delivery · 運費', order.shipping ? hkd(order.shipping) : 'Free · 免費'),
    `<tr><td style="padding:8px 0;font-weight:700;border-top:1px solid #ddd">Total paid · 實付</td>` +
      `<td style="padding:8px 0;text-align:right;font-weight:700;border-top:1px solid #ddd">${hkd(order.total)}</td></tr>`,
  ].join('');
}

const shell = (inner) =>
  `<div style="font-family:Arial,'Noto Sans TC',sans-serif;max-width:560px;margin:0 auto;color:#17181a;line-height:1.5">${inner}</div>`;

export async function sendOrderEmails(order) {
  const c = order.customer;
  const address = [c.address1, c.address2, c.district, 'Hong Kong'].filter(Boolean).map(esc).join('<br>');
  const zh = order.lang === 'zh';

  const merchant = shell(`
    <h2 style="margin:0 0 4px">New PayMe order · ${esc(order.id)}</h2>
    <p style="margin:0 0 16px;color:#555">Paid ${esc(order.paidAt)} · PayMe transaction ${esc(order.transactionId || '—')}</p>
    <table style="width:100%;border-collapse:collapse">${itemRows(order, 'en')}${totalsRows(order)}</table>
    <h3 style="margin:20px 0 4px">Ship to</h3>
    <p style="margin:0">${esc(c.name)}<br>${address}<br>📞 ${esc(c.phone)}<br>✉️ ${esc(c.email)}</p>`);

  const customer = shell(`
    <h2 style="margin:0 0 8px">${zh ? '多謝你的訂單' : 'Thank you for your order'}</h2>
    <p style="margin:0 0 16px">${
      zh
        ? `我們已收到你的 PayMe 付款。訂單編號：<strong>${esc(order.id)}</strong>。本地訂單一般 2–4 個工作天送達，發貨後會以電郵通知你。`
        : `We have received your PayMe payment. Order number: <strong>${esc(order.id)}</strong>. Local orders usually arrive within 2–4 working days, and we will email you when yours ships.`
    }</p>
    <table style="width:100%;border-collapse:collapse">${itemRows(order, order.lang)}${totalsRows(order)}</table>
    <h3 style="margin:20px 0 4px">${zh ? '送貨地址' : 'Delivery address'}</h3>
    <p style="margin:0">${esc(c.name)}<br>${address}</p>
    <p style="margin:20px 0 0;color:#555;font-size:13px">${
      zh ? '如有任何疑問，請回覆此電郵或聯絡 info@vitas.com.hk。' : 'Questions? Reply to this email or write to info@vitas.com.hk.'
    }<br>VITAS 紓適寧</p>`);

  const results = await Promise.allSettled([
    send({
      to: process.env.NOTIFY_EMAIL || 'info@vitas.com.hk',
      subject: `New PayMe order ${order.id} — ${hkd(order.total)}`,
      html: merchant,
      replyTo: c.email,
    }),
    send({
      to: c.email,
      subject: zh ? `VITAS 訂單確認 ${order.id}` : `Your VITAS order ${order.id}`,
      html: customer,
      replyTo: 'info@vitas.com.hk',
    }),
  ]);
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`order email ${i === 0 ? 'to merchant' : 'to customer'} failed`, r.reason);
  });
  return results;
}

/** Alert for the rare case where PayMe reports a payment we cannot match. */
export async function sendReviewAlert(order, reason, details) {
  try {
    await send({
      to: process.env.NOTIFY_EMAIL || 'info@vitas.com.hk',
      subject: `PayMe order needs review: ${order.id}`,
      html: shell(
        `<h2>PayMe order needs review</h2><p>Order <strong>${esc(order.id)}</strong>: ${esc(reason)}</p>` +
          `<pre style="white-space:pre-wrap">${esc(JSON.stringify(details, null, 2))}</pre>`
      ),
    });
  } catch (error) {
    console.error('review alert failed', error);
  }
}
