/**
 * Receipt PDF for PayMe orders — the same layout Stripe produces for card
 * orders (Letter page, orange top bar, logo, Bill to / Ship to, items,
 * totals, payment history), so every customer receives one receipt style.
 *
 * Built with pdf-lib. Noto Sans TC (SIL Open Font License) is embedded so
 * Chinese product names and customer addresses print correctly; only the glyphs
 * used on the page end up in the PDF. A character the font lacks prints as "?"
 * instead of failing the receipt.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import subsetFont from 'subset-font';

const asset = (name) => readFileSync(fileURLToPath(new URL(`./assets/${name}`, import.meta.url)));

/* Fonts are read once per warm function instance. The files hold ~7,600
   characters (Latin, common Traditional and Simplified Chinese, Hong Kong
   Cantonese characters, and every character the site itself uses). */
let loaded;
function assets() {
  if (!loaded) {
    const regular = asset('NotoSansTC-Regular.subset.ttf');
    loaded = {
      regular,
      bold: asset('NotoSansTC-Bold.subset.ttf'),
      logo: asset('logo-receipt.png'),
      supported: new Set(fontkit.create(regular).characterSet),
    };
  }
  return loaded;
}

/* The seller block, exactly as it appears on the Stripe receipt. */
const SELLER = [
  '九龍',
  'Unit 411, Lippo Sun Plaza,',
  '28 Canton Road,',
  'Tsimshatsui, Kowloon',
  'Hong Kong',
  '+852 3167 7081',
];
const FOOTER = 'VITAS 紓適寧 · Unit 411, Lippo Sun Plaza, 28 Canton Road, Tsimshatsui, Kowloon, Hong Kong · info@vitas.com.hk';
const DESCRIPTION = 'VITAS 紓適寧 online order · 網上訂單';

const BRAND = rgb(254 / 255, 80 / 255, 0);
const INK = rgb(0.09, 0.09, 0.1);
const GREY = rgb(0.4, 0.42, 0.45);
const RULE = rgb(0.9, 0.9, 0.9);

/* The Stripe sample was measured at 80 dpi; positions below are in those pixels. */
const K = 72 / 80;
const PAGE_W = 612;
const PAGE_H = 792;
const px = (n) => n * K;
const yAt = (n) => PAGE_H - px(n); // pixel-from-top → pdf y

const hkd = (cents) => `HK$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const longDate = (iso) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Hong_Kong' }).format(
    new Date(iso || Date.now())
  );

/** 29f0bf45-5a09-… → 29F0-BF45, in the same shape as Stripe's 2403-3740. */
export function receiptNumber(order) {
  const source = String(order.transactionId || order.id || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  const eight = (source + '00000000').slice(0, 8);
  return `${eight.slice(0, 4)}-${eight.slice(4)}`;
}

export async function buildReceipt(order) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`Receipt ${receiptNumber(order)}`);
  pdf.setAuthor('VITAS LIMITED');
  pdf.setCreator('vitas.com.hk');
  pdf.setProducer('vitas.com.hk');

  const a = assets();
  const supported = a.supported;

  /* Keep to characters the font can draw; anything else becomes "?". */
  const clean = (value) =>
    Array.from(String(value ?? '').replace(/[\r\n\t]+/g, ' '))
      .map((ch) => (supported.has(ch.codePointAt(0)) ? ch : '?'))
      .join('');

  /* Every character this receipt can print, so the fonts can be cut down to just
     those glyphs (a 2 MB font would otherwise be copied into every PDF). */
  const c = order.customer || {};
  const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
  const everything = clean(
    [
      ascii, '—·…', SELLER.join(''), FOOTER, DESCRIPTION, '本地送遞本地免費送遞',
      order.id, order.coupon, c.name, c.district, c.address1, c.address2, c.phone, c.email,
      ...(order.lines || []).flatMap((l) => [l.name?.en, l.name?.zh, l.variant?.en]),
    ].join('')
  );
  const text = Array.from(new Set(Array.from(everything))).join('');
  const cut = (buf) => subsetFont(buf, text, { targetFormat: 'truetype' });

  const regular = await pdf.embedFont(await cut(a.regular), { subset: false });
  const bold = await pdf.embedFont(await cut(a.bold), { subset: false });
  const logo = await pdf.embedPng(a.logo);
  const page = pdf.addPage([PAGE_W, PAGE_H]);

  /* Noto Sans TC draws "·" a full character wide, so separators are drawn as a
     small dot with even spacing, like the narrow dot on the Stripe receipt. */
  const draw = (text, x, y, { font = regular, size = 8.6, color = INK, align = 'left' } = {}) => {
    const parts = clean(text).split('·').map((p) => p.trim());
    const gap = size * 0.95;
    const width = parts.reduce((sum, p) => sum + font.widthOfTextAtSize(p, size), 0) + gap * (parts.length - 1);
    let cursor = align === 'right' ? x - width : x;
    parts.forEach((part, i) => {
      page.drawText(part, { x: cursor, y, font, size, color });
      cursor += font.widthOfTextAtSize(part, size);
      if (i < parts.length - 1) {
        page.drawCircle({ x: cursor + gap / 2, y: y + size * 0.3, size: size * 0.09, color });
        cursor += gap;
      }
    });
  };

  /* Wrap into lines no wider than maxW; Chinese text may break between characters. */
  const wrap = (text, maxW, { font = regular, size = 8.6 } = {}) => {
    const s = clean(text);
    const lines = [];
    let line = '';
    const tokens = s.match(/[⺀-鿿豈-﫿＀-￯]|[^\s⺀-鿿豈-﫿＀-￯]+|\s+/g) || [];
    /* A word wider than the column (a very long e-mail address) is broken by character. */
    const pieces = tokens.flatMap((token) => (font.widthOfTextAtSize(token, size) > maxW ? Array.from(token) : [token]));
    for (const token of pieces) {
      const next = line + token;
      if (font.widthOfTextAtSize(next, size) <= maxW || !line.trim()) {
        line = next;
      } else {
        lines.push(line.trimEnd());
        line = token.trimStart();
      }
    }
    if (line.trim()) lines.push(line.trimEnd());
    return lines.length ? lines : [''];
  };

  const LEFT = px(33);
  const RIGHT = px(647);
  /* Long addresses push everything below the address blocks down by `dy`. */
  let dy = 0;
  const Y = (n) => yAt(n + dy);
  const rule = (yPx, { color = RULE, thickness = 0.6, from = LEFT, to = RIGHT, fixed = false } = {}) => {
    const y = fixed ? yAt(yPx) : Y(yPx);
    page.drawLine({ start: { x: from, y }, end: { x: to, y }, thickness, color });
  };

  /* ---- top bar, title, logo ------------------------------------------------ */
  page.drawRectangle({ x: 0, y: PAGE_H - px(5), width: PAGE_W, height: px(5), color: BRAND });
  draw('Receipt', LEFT, yAt(54), { font: bold, size: 18 });
  page.drawImage(logo, { x: px(514), y: yAt(79), width: px(134), height: px(134) * (logo.height / logo.width) });

  /* ---- reference numbers -------------------------------------------------- */
  const refs = [
    ['Invoice number', order.id],
    ['Receipt number', receiptNumber(order)],
    ['Date paid', longDate(order.paidAt)],
  ];
  refs.forEach(([label, value], i) => {
    const y = yAt(86 + i * 15);
    draw(label, LEFT, y, { font: bold });
    draw(value, px(116), y);
  });

  /* ---- seller, bill to, ship to -------------------------------------------- */
  const colW = px(170);
  const MAX_ADDRESS_LINES = 8;
  const addressLines = (withEmail) => {
    const lines = [c.name, c.district, c.address1, c.address2, 'Hong Kong', c.phone, withEmail ? c.email : null]
      .filter(Boolean)
      .flatMap((line) => wrap(line, colW));
    if (lines.length <= MAX_ADDRESS_LINES) return lines;
    /* A very long address is cut here; the full text is in the order email to us. */
    const kept = lines.slice(0, MAX_ADDRESS_LINES);
    let last = kept[MAX_ADDRESS_LINES - 1];
    while (last.length > 1 && regular.widthOfTextAtSize(`${last}…`, 8.6) > colW) last = last.slice(0, -1);
    kept[MAX_ADDRESS_LINES - 1] = `${last}…`;
    return kept;
  };
  const block = (title, x, lines) => {
    draw(title, x, yAt(148), { font: bold });
    lines.forEach((line, i) => draw(line, x, yAt(166 + i * 15)));
  };
  const billLines = addressLines(true);
  const shipLines = addressLines(false);
  dy = Math.max(0, 166 + Math.max(billLines.length, shipLines.length, SELLER.length) * 15 + 22 - 314);
  block('VITAS LIMITED', LEFT, SELLER);
  block('Bill to', px(278), billLines);
  block('Ship to', px(462), shipLines);

  /* ---- headline amount ------------------------------------------------------ */
  draw(`${hkd(order.total)} paid on ${longDate(order.paidAt)}`, LEFT, Y(314), { font: bold, size: 13.5 });
  draw(DESCRIPTION, LEFT, Y(339));

  /* ---- items ---------------------------------------------------------------- */
  const QTY_X = px(470);
  const UNIT_X = px(558);
  const AMOUNT_X = RIGHT;
  const headRow = (yPx, cells) => {
    cells.forEach(([label, x, align]) => draw(label, x, Y(yPx), { size: 7.4, color: GREY, align }));
    rule(yPx + 12, { color: INK, thickness: 0.8 });
  };
  headRow(379, [
    ['Description', LEFT, 'left'],
    ['Qty', QTY_X, 'right'],
    ['Unit price', UNIT_X, 'right'],
    ['Amount', AMOUNT_X, 'right'],
  ]);

  /* With four or five products the rows are packed tighter so the page never overflows. */
  const compact = (order.lines || []).length >= 4;
  const NAME_STEP = compact ? 13 : 14;
  const VARIANT_STEP = compact ? 10 : 12;
  const ROW_PAD = compact ? 4 : 8;
  let rowY = 404;
  for (const line of order.lines || []) {
    const name = `${/^VITAS\b/i.test(line.name.en) ? '' : 'VITAS '}${line.name.en} — ${line.name.zh}`;
    const nameLines = wrap(name, px(380));
    nameLines.forEach((text, i) => draw(text, LEFT, Y(rowY + i * NAME_STEP)));
    if (line.variant?.en) {
      draw(line.variant.en, LEFT, Y(rowY + nameLines.length * NAME_STEP - 1), { size: 7.4, color: GREY });
    }
    draw(String(line.qty), QTY_X, Y(rowY), { align: 'right' });
    draw(hkd(line.unit), UNIT_X, Y(rowY), { align: 'right' });
    draw(hkd(line.amount), AMOUNT_X, Y(rowY), { align: 'right' });
    rowY += nameLines.length * NAME_STEP + (line.variant?.en ? VARIANT_STEP : 0) + ROW_PAD;
  }

  /* ---- totals --------------------------------------------------------------- */
  const TOTALS_X = px(340);
  const shippingLabel = order.shipping ? 'Shipping (Local delivery · 本地送遞)' : 'Shipping (Free local delivery · 本地免費送遞)';
  const totals = [
    ['Subtotal', hkd(order.subtotal)],
    ...(order.discount ? [[`Discount (${order.coupon})`, `-${hkd(order.discount)}`]] : []),
    [shippingLabel, hkd(order.shipping || 0)],
    ['Total', hkd(order.total)],
    ['Amount paid', hkd(order.total), true],
  ];
  let ty = Math.max(rowY + 18, 436);
  totals.forEach(([label, value, strong]) => {
    draw(label, TOTALS_X, Y(ty), { font: strong ? bold : regular });
    draw(value, AMOUNT_X, Y(ty), { font: strong ? bold : regular, align: 'right' });
    if (!strong) rule(ty + 5, { from: TOTALS_X });
    ty += 16;
  });

  /* ---- payment history ------------------------------------------------------ */
  const historyY = Math.max(ty + (compact ? 26 : 44), 530);
  draw('Payment history', LEFT, Y(historyY), { font: bold, size: 12.5 });
  headRow(historyY + 42, [
    ['Payment method', LEFT, 'left'],
    ['Date', px(336), 'left'],
    ['Amount paid', px(558), 'right'],
    ['Receipt number', RIGHT, 'right'],
  ]);
  const payY = historyY + 66;
  draw('PayMe', LEFT, Y(payY));
  draw(longDate(order.paidAt), px(336), Y(payY));
  draw(hkd(order.total), px(558), Y(payY), { align: 'right' });
  draw(receiptNumber(order), RIGHT, Y(payY), { align: 'right' });

  draw(FOOTER, LEFT, Y(payY + 44));

  /* ---- page footer ---------------------------------------------------------- */
  rule(812, { thickness: 0.5, fixed: true });
  draw('Page 1 of 1', RIGHT, yAt(836), { size: 7.6, align: 'right' });

  return Buffer.from(await pdf.save());
}
