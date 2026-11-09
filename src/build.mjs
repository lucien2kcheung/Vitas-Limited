#!/usr/bin/env node
/**
 * Static site generator for vitas.com.hk.
 *
 *   node src/build.mjs
 *
 * Writes plain HTML into this folder — one file per page, per language:
 *
 *   /index.html              /zh/index.html
 *   /product/index.html      /zh/product/index.html
 *   /ingredients/eucalyptus/index.html …
 *
 * Every page is its own URL. There is no framework and no runtime dependency:
 * commit the output and Vercel serves it as-is.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { page, setLang, urlIn, SITE } from './layout.mjs';
import { PLANTS, SPORTS } from './data.mjs';
import * as pages from './pages.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'zh'];

/** Build the page list for whichever language is currently set. */
const buildSpecs = () => [
  pages.home(),
  pages.shop(),
  pages.cart(),
  pages.checkoutResult('success'),
  pages.checkoutResult('cancelled'),
  pages.product(),
  pages.capsule(),
  pages.rollOn(),
  pages.howToUse(),
  pages.ingredients(),
  ...PLANTS.map((p) => pages.ingredient(p)),
  ...SPORTS.map((sp) => pages.sport(sp)),
  pages.stockists(),
  pages.about(),
  pages.faq(),
  pages.contact(),
  pages.legal('privacy'),
  pages.legal('terms'),
  pages.shippingReturns(),
  pages.notFound(),
];

/** "/product/" → "product/index.html"; "/404.html" → "404.html". */
const fileFor = (path) =>
  path.endsWith('.html') ? path.replace(/^\//, '') : join(path.replace(/^\//, ''), 'index.html');

const written = [];
const canonicalPaths = [];
const htmlByPath = new Map(); // output path -> rendered HTML, used for per-page <lastmod>

for (const lang of LANGS) {
  setLang(lang);
  for (const spec of buildSpecs()) {
    const path = urlIn(spec.path, lang);
    const file = join(root, fileFor(path));
    await mkdir(dirname(file), { recursive: true });
    const html = page(spec);
    await writeFile(file, html, 'utf8');
    htmlByPath.set(path, html);
    written.push(path);
    // /cart/ is disallowed in robots.txt, so it does not belong in the sitemap either.
    const indexable = !spec.path.endsWith('.html') && !spec.path.startsWith('/checkout/') && spec.path !== '/cart/';
    if (lang === 'en' && indexable) canonicalPaths.push(spec.path);
  }
}

/* -------------------------------------------------------------- sitemap.xml */

/* <lastmod> is the date a page's rendered HTML (English + Chinese) last changed. A hash of each
   page is kept in src/lastmod.json; the date only moves when the hash does, so a rebuild that
   changes nothing leaves the sitemap untouched. */
const today = new Date().toISOString().slice(0, 10);
const lastmodFile = join(root, 'src', 'lastmod.json');
let lastmodStore = {};
try { lastmodStore = JSON.parse(await readFile(lastmodFile, 'utf8')); } catch { /* first run */ }
const lastmodOf = (path) => {
  const hash = createHash('sha1')
    .update(htmlByPath.get(urlIn(path, 'en')) ?? '')
    .update(htmlByPath.get(urlIn(path, 'zh')) ?? '')
    .digest('hex')
    .slice(0, 16);
  const prev = lastmodStore[path];
  lastmodStore[path] = prev && prev.hash === hash ? prev : { hash, date: today };
  return lastmodStore[path].date;
};

const entry = (path, lang) => `  <url>
    <loc>${SITE.url}${urlIn(path, lang)}</loc>
    <xhtml:link rel="alternate" hreflang="en-HK" href="${SITE.url}${urlIn(path, 'en')}"/>
    <xhtml:link rel="alternate" hreflang="zh-Hant-HK" href="${SITE.url}${urlIn(path, 'zh')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${urlIn(path, 'en')}"/>
    <lastmod>${lastmodOf(path)}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : path === '/product/' ? '0.9' : '0.7'}</priority>
  </url>`;

const urls = LANGS.flatMap((lang) => canonicalPaths.map((path) => entry(path, lang))).join('\n');

const pruned = Object.fromEntries(Object.entries(lastmodStore).filter(([p]) => canonicalPaths.includes(p)).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(lastmodFile, JSON.stringify(pruned, null, 2) + '\n', 'utf8');

await writeFile(
  join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
  'utf8'
);

console.log(`Built ${written.length} pages (${canonicalPaths.length} × ${LANGS.length} languages + 404):`);
for (const p of written) console.log('  ' + p);
console.log('Wrote sitemap.xml');
