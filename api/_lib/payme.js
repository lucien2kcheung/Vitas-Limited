/**
 * PayMe for Business API client (API v0.12).
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   PAYME_ENV              sandbox (default) or live
 *   PAYME_CLIENT_ID        from the PayMe credentials sheet
 *   PAYME_CLIENT_SECRET
 *   PAYME_SIGNING_KEY_ID
 *   PAYME_SIGNING_KEY
 *   PAYME_API_VERSION      optional, defaults to 0.12
 *
 * Every API call except the token request is signed with HMAC-SHA256 using the
 * signing key (base64-decoded). Calls with a body also carry a SHA-256 Digest.
 * Secrets stay on the server — nothing here is ever sent to the browser.
 */

import crypto from 'node:crypto';
import { redis } from './store.js';

const BASES = {
  sandbox: 'https://sandbox.api.payme.hsbc.com.hk',
  live: 'https://api.payme.hsbc.com.hk',
};

export class PaymeError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = 'PaymeError';
    this.status = status;
    this.body = body;
  }
}

export function config() {
  const env = process.env.PAYME_ENV === 'live' ? 'live' : 'sandbox';
  const c = {
    env,
    base: BASES[env],
    clientId: process.env.PAYME_CLIENT_ID,
    clientSecret: process.env.PAYME_CLIENT_SECRET,
    keyId: process.env.PAYME_SIGNING_KEY_ID,
    key: process.env.PAYME_SIGNING_KEY,
    version: process.env.PAYME_API_VERSION || '0.12',
  };
  const missing = [
    ['PAYME_CLIENT_ID', c.clientId],
    ['PAYME_CLIENT_SECRET', c.clientSecret],
    ['PAYME_SIGNING_KEY_ID', c.keyId],
    ['PAYME_SIGNING_KEY', c.key],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new PaymeError(`PayMe is not configured. Missing: ${missing.join(', ')}`);
  }
  return c;
}

/* ------------------------------------------------------------------ signing */

const sha256b64 = (data) => crypto.createHash('sha256').update(data).digest('base64');

function hmacB64(signingString, keyBytes) {
  return crypto.createHmac('sha256', keyBytes).update(signingString).digest('base64');
}

/** The string PayMe signs: one "name: value" line per header, in order. */
function signingString(names, { method, path, headers }) {
  return names
    .map((name) =>
      name === '(request-target)'
        ? `(request-target): ${method.toLowerCase()} ${path}`
        : `${name.toLowerCase()}: ${headers[name]}`
    )
    .join('\n');
}

function signatureHeader(c, names, parts) {
  const signature = hmacB64(signingString(names, parts), Buffer.from(c.key, 'base64'));
  return `keyId="${c.keyId}",algorithm="hmac-sha256",headers="${names.join(' ')}",signature="${signature}"`;
}

/* -------------------------------------------------------------------- token */

let memoryToken = null; // { value, expires } — a warm function reuses it

export async function getToken() {
  const c = config();
  const cacheKey = `payme:token:${c.env}`;

  if (memoryToken && memoryToken.expires > Date.now()) return memoryToken.value;

  try {
    const cached = await redis().get(cacheKey);
    if (cached) {
      memoryToken = { value: cached, expires: Date.now() + 5 * 60 * 1000 };
      return cached;
    }
  } catch {
    /* Redis hiccup — fall through and request a fresh token */
  }

  const res = await fetch(`${c.base}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'Api-Version': c.version,
    },
    body: new URLSearchParams({ client_id: c.clientId, client_secret: c.clientSecret }).toString(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.accessToken) {
    throw new PaymeError('PayMe token request failed', { status: res.status, body: data });
  }

  /* Tokens last 60 minutes; cache for 50 so none is used right at expiry. */
  memoryToken = { value: data.accessToken, expires: Date.now() + 5 * 60 * 1000 };
  try {
    await redis().set(cacheKey, data.accessToken, { ex: 50 * 60 });
  } catch {
    /* caching is an optimisation only */
  }
  return data.accessToken;
}

/* ------------------------------------------------------------- signed calls */

async function call(method, path, bodyObject) {
  const c = config();
  const token = await getToken();
  const body = bodyObject === undefined ? undefined : JSON.stringify(bodyObject);

  const headers = {
    'Api-Version': c.version,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'en-US',
    'Trace-Id': crypto.randomUUID(),
    'Request-Date-Time': new Date().toISOString(),
    Authorization: `Bearer ${token}`,
  };

  const names = ['(request-target)', 'Api-Version', 'Request-Date-Time', 'Trace-Id', 'Authorization'];
  if (body !== undefined) {
    headers.Digest = `SHA-256=${sha256b64(body)}`;
    names.push('Digest');
  }
  headers.Signature = signatureHeader(c, names, { method, path, headers });

  const res = await fetch(`${c.base}${path}`, { method, headers, body });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new PaymeError(`PayMe ${method} ${path} failed (${res.status})`, { status: res.status, body: data });
  }
  return data;
}

/* ----------------------------------------------------------------- requests */

/**
 * Creates a payment request. `totalCents` is HKD in cents; PayMe takes dollars.
 * Returns PayMe's raw response (paymentRequestId plus the PayCode link fields).
 */
export function createPaymentRequest({
  totalCents,
  orderId,
  description,
  details,
  notificationUri,
  successUrl,
  failUrl,
  durationSeconds = 600,
}) {
  return call('POST', '/payments/paymentrequests', {
    totalAmount: Number((totalCents / 100).toFixed(2)),
    currencyCode: 'HKD',
    effectiveDuration: durationSeconds,
    notificationUri,
    appSuccessCallback: successUrl,
    appFailCallback: failUrl,
    merchantData: {
      orderId,
      orderDescription: description,
      additionalData: details,
    },
  });
}

export const getPaymentRequest = (id) => call('GET', `/payments/paymentrequests/${encodeURIComponent(id)}`);

export const cancelPaymentRequest = (id) =>
  call('PUT', `/payments/paymentrequests/${encodeURIComponent(id)}/cancel`);

/**
 * Pulls the PayCode link and the mobile deep link out of PayMe's create
 * response. Key names are matched loosely, so a minor-version rename of the
 * field does not break checkout; if no link is found the caller gets an error
 * naming the keys PayMe returned.
 */
export function extractLinks(response) {
  const skip = /notification|callback|logo/i;
  const urls = Object.entries(response || {}).filter(
    ([key, value]) => typeof value === 'string' && /^https?:\/\//i.test(value) && !skip.test(key)
  );
  const byKey = (re) => urls.find(([key]) => re.test(key));

  const web = (byKey(/^(web|qr|paycode|payment)/i) || urls[0] || [])[1];
  const app = (byKey(/^(app|deep)/i) || [])[1] || web;

  if (!web) {
    throw new PaymeError(`PayMe response had no PayCode link (keys: ${Object.keys(response || {}).join(', ')})`, {
      body: response,
    });
  }
  return { web, app };
}

/* ----------------------------------------------------------------- webhooks */

function parseSignature(header) {
  const out = {};
  for (const m of String(header || '').matchAll(/(\w+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/**
 * Verifies a webhook POST from PayMe: the Digest must match the raw body and
 * the Signature must match an HMAC made with our signing key.
 * Returns { ok: true } or { ok: false, reason }.
 */
export function verifyWebhook(req, rawBody) {
  const c = config();
  const parsed = parseSignature(req.headers.signature);
  if (!parsed.signature || !parsed.headers) return { ok: false, reason: 'missing signature' };

  const expectedDigest = `sha-256=${sha256b64(rawBody)}`;
  if (!safeEqual(String(req.headers.digest || '').toLowerCase(), expectedDigest.toLowerCase())) {
    return { ok: false, reason: 'digest mismatch' };
  }

  const names = parsed.headers.split(/\s+/).filter(Boolean);
  const pathname = new URL(req.url, 'http://localhost').pathname;
  /* Vercel may add or drop a trailing slash; PayMe signed whichever it called. */
  const paths = [pathname, pathname.endsWith('/') ? pathname.slice(0, -1) : `${pathname}/`];
  const keys = [Buffer.from(c.key, 'base64'), Buffer.from(c.key, 'utf8')];

  for (const path of paths) {
    const lowered = {};
    for (const name of names) lowered[name] = req.headers[name.toLowerCase()];
    const text = signingString(names, { method: 'POST', path, headers: lowered });
    for (const key of keys) {
      if (safeEqual(hmacB64(text, key), parsed.signature)) return { ok: true };
    }
  }
  return { ok: false, reason: 'signature mismatch' };
}
