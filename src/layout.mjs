/**
 * Layout primitives for the VITAS site.
 *
 * URLs
 * ----
 * Every page is a real, separately addressable URL — including each language
 * and each ingredient. English lives at `/path/`, 繁體中文 at `/zh/path/`, and
 * each page renders in one language only, with <link rel="alternate" hreflang>
 * pointing at its counterpart. Nothing is hidden behind an anchor, a tab or a
 * client-side toggle, so every page can be indexed, linked and shared on its
 * own.
 *
 * Bilingual content is written as `{ en, zh }` pairs; the build sets the
 * current language once per page and `t()` returns the right side.
 */

import { BRAND } from './data.mjs';

/** WhatsApp glyph (Simple Icons, CC0). Shared by the header button and the contact page. */
export const WA_ICON_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

export const SITE = {
  url: 'https://www.vitas.com.hk',
  name: 'VITAS 紓適寧',
  brandEn: 'VITAS',
  brandZh: '紓適寧',
  youtube: 'https://www.youtube.com/@VITASHK',
  facebook: 'https://www.facebook.com/vitashk/',
  instagram: 'https://www.instagram.com/vitashongkong/',
  // PLACEHOLDER — replace with the real Xiaohongshu (小紅書) profile URL.
  xiaohongshu: '#',
  email: 'info@vitas.com.hk',
  // WhatsApp: digits only (country code, no + or spaces) for wa.me links.
  whatsapp: '85260607593',
  whatsappDisplay: '+852 6060 7593',
  phone: '+85231677081',
  phoneDisplay: { en: '(852) 3167 7081', zh: '(852) 3167 7081' },
  whatsappShort: '6060 7593',
  address: {
    en: ['Unit 411, Lippo Sun Plaza,', '28 Canton Road, Tsimshatsui, Kowloon, HK'],
    zh: ['香港九龍尖沙咀廣東道 28 號', '力寶太陽廣場 411 室'],
  },
};

/* ------------------------------------------------------------- language */

let LANG = 'en';

/** Set by the build before rendering each page. */
export const setLang = (lang) => {
  LANG = lang;
};
export const getLang = () => LANG;

/** Bilingual value → the string for the language being rendered. */
export function t(value) {
  if (value == null) return '';
  return typeof value === 'string' ? value : value[LANG];
}

/** Block-level bilingual text. */
export function blk(tag, value, className = '') {
  const cls = className ? ` class="${className}"` : '';
  return `<${tag}${cls}>${t(value)}</${tag}>`;
}

/** Plain text in a specific language, for <title>, meta and JSON-LD. */
export const plain = (value, lang = LANG) =>
  typeof value === 'string' ? value : value[lang];

/** Escape text destined for an HTML attribute. */
export const attr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ------------------------------------------------------------------ urls */

/** Canonical (English) path → the URL for the language being rendered. */
export const url = (path) => (LANG === 'zh' ? '/zh' + path : path);

/** Canonical path → the URL in a named language. */
export const urlIn = (path, lang) => (lang === 'zh' ? '/zh' + path : path);

/* --------------------------------------------------------------- chrome */

const navItems = [
  { href: '/product/', label: { en: 'VITAS Soothing Cream', zh: 'VITAS 舒緩啫喱膏' } },
  { href: '/ingredients/', label: { en: 'Ingredients', zh: '成分' } },
  { href: '/how-to-use/', label: { en: 'How to Use', zh: '使用方法' } },
  { href: '/about/', label: { en: 'About VITAS', zh: '關於 VITAS' } },
  { href: '/faq/', label: { en: 'FAQ', zh: '常見問題' } },
];

function header(active, path) {
  const links = navItems
    .map(
      (item) =>
        `<a class="nav__link${active === item.href ? ' is-active' : ''}" href="${url(item.href)}"${
          active === item.href ? ' aria-current="page"' : ''
        }>${t(item.label)}</a>`
    )
    .join('\n          ');

  const other = LANG === 'zh' ? 'en' : 'zh';

  return `  <a class="skip-link" href="#main">${t({ en: 'Skip to content', zh: '跳至主要內容' })}</a>
  <header class="site-header" id="site-header">
    <div class="site-header__inner">
      <a class="wordmark" href="${url('/')}" aria-label="VITAS 紓適寧">
        <img src="/assets/img/logo/logo_lockup.svg" alt="VITAS 紓適寧" width="144" height="50">
      </a>
      <nav class="nav" id="primary-nav" aria-label="${attr(t({ en: 'Primary', zh: '主要' }))}">
        <div class="nav__links">
          ${links}
        </div>
        <div class="nav__actions">
          <a class="lang-toggle" href="${urlIn(path, other)}" hreflang="${
            other === 'zh' ? 'zh-Hant' : 'en'
          }" lang="${other === 'zh' ? 'zh-Hant' : 'en'}">${other === 'zh' ? '中文' : 'EN'}</a>
          <a class="btn btn--sm" href="${url('/shop/')}">${t({ en: 'Shop', zh: '選購' })}</a>
        </div>
      </nav>
      <div class="header-icons">
      <a class="wa-button" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="${attr(
        t({ en: 'Chat with us on WhatsApp', zh: '透過 WhatsApp 與我們對話' })
      )}" title="WhatsApp">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor"><path d="${WA_ICON_PATH}"/></svg>
      </a>
      <a class="cart-button" href="${url('/cart/')}" data-cart-link>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8Z"/>
          <path d="M9 9V6.5a3 3 0 0 1 6 0V9"/>
        </svg>
        <span class="cart-button__count" data-cart-count hidden>0</span>
        <span class="sr-only">${t({ en: 'Cart', zh: '購物車' })}</span>
      </a>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle>
        <span class="nav-toggle__bar"></span>
        <span class="sr-only">${t({ en: 'Menu', zh: '選單' })}</span>
      </button>
    </div>
  </header>`;
}

function footer() {
  const col = (heading, links) => `
        <div class="footer__col">
          <h3 class="footer__heading">${t(heading)}</h3>
          <ul class="footer__list">
            ${links
              .map(
                (l) =>
                  `<li><a href="${l.external ? l.href : url(l.href)}"${
                    l.external ? ' target="_blank" rel="noopener"' : ''
                  }>${t(l.label)}</a></li>`
              )
              .join('\n            ')}
          </ul>
        </div>`;

  return `  <footer class="site-footer">
    <div class="footer__top">
      <div class="footer__intro">
        <span class="wordmark wordmark--footer">
          <img src="/assets/img/logo/logo_lockup.svg" alt="VITAS 紓適寧" width="184" height="64">
        </span>
        <p class="footer__slogan">${t(BRAND.slogan)[0]}<br>${t(BRAND.slogan)[1]}</p>
        ${blk('p', {
          en: 'The clean performance cream gel — grape seed, niaouli and eucalyptus, made in France for your pre- and post-training ritual. Trusted in Hong Kong for over 20 years.',
          zh: '源自法國的乾淨表現霜凝膠，結合葡萄籽、綠花白千層與尤加利精華，完美融入你的運動前後保養流程。20 年來深得香港信賴。',
        })}
        <div class="footer__social">
          <a class="social-icon" href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="Facebook">
            <img src="/assets/img/social/facebook.svg" alt="" width="30" height="30" loading="lazy">
          </a>
          <a class="social-icon" href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">
            <img src="/assets/img/social/instagram.svg" alt="" width="30" height="30" loading="lazy">
          </a>
          <a class="social-icon" href="${SITE.xiaohongshu}" target="_blank" rel="noopener" aria-label="Xiaohongshu">
            <img src="/assets/img/social/xiaohongshu.svg" alt="" width="30" height="30" loading="lazy">
          </a>
          <a class="social-icon" href="${SITE.youtube}" target="_blank" rel="noopener" aria-label="YouTube">
            <img src="/assets/img/social/youtube.svg" alt="" width="30" height="30" loading="lazy">
          </a>
        </div>
      </div>
      <div class="footer__cols">
        ${col({ en: 'Shop', zh: '購買' }, [
          { href: '/shop/', label: { en: 'Shop now', zh: '網上商店' } },
          { href: '/product/', label: { en: 'VITAS Soothing Cream', zh: 'VITAS 舒緩啫喱膏' } },
          { href: '/cart/', label: { en: 'Cart', zh: '購物車' } },
          { href: '/stockists/', label: { en: 'Where to buy', zh: '購買地點' } },
        ])}
        ${col({ en: 'Brand', zh: '品牌' }, [
          { href: '/about/', label: { en: 'About VITAS', zh: '關於 VITAS' } },
          { href: '/ingredients/', label: { en: 'Ingredients', zh: '成分' } },
          { href: '/how-to-use/', label: { en: 'How to use', zh: '使用方法' } },
          { href: '/faq/', label: { en: 'FAQ', zh: '常見問題' } },
          { href: '/contact/', label: { en: 'Contact', zh: '聯絡我們' } },
        ])}
        ${col({ en: 'Legal', zh: '條款' }, [
          { href: '/legal/privacy/', label: { en: 'Privacy', zh: '私隱政策' } },
          { href: '/legal/terms/', label: { en: 'Terms', zh: '使用條款' } },
        ])}
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer__legal">
        ${blk('p', BRAND.safety, 'footer__safety')}
        ${blk('p', BRAND.disclaimer, 'footer__disclaimer')}
        <p class="footer__copy">© ${new Date().getFullYear()} VITAS 紓適寧. ${t({
          en: 'All rights reserved.',
          zh: '版權所有。',
        })}</p>
      </div>
      <address class="footer__contact">
        <dl>
          <div><dt>${t({ en: 'Tel', zh: '電話' })}</dt><dd><a href="tel:${SITE.phone}">${t(SITE.phoneDisplay)}</a></dd></div>
          <div><dt>WhatsApp</dt><dd><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">${SITE.whatsappShort}</a></dd></div>
          <div><dt>${t({ en: 'Email', zh: '電郵' })}</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd></div>
          <div><dt>${t({ en: 'Address', zh: '地址' })}</dt><dd>${t(SITE.address).join('<br>')}</dd></div>
        </dl>
      </address>
    </div>
  </footer>`;
}


/**
 * Welcome offer. Shown once per visitor (a localStorage flag suppresses it
 * afterwards), never on the checkout pages. The email goes to the same endpoint
 * as the newsletter — see README, "Forms".
 */
function welcomeModal() {
  return `  <div class="welcome" data-welcome hidden>
    <div class="welcome__scrim" data-welcome-close></div>
    <div class="welcome__panel" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-text">
      <button class="welcome__close" type="button" data-welcome-close aria-label="${attr(
        t({ en: 'Close', zh: '關閉' })
      )}">&times;</button>
      <p class="welcome__eyebrow">${t({ en: 'Welcome offer', zh: '迎新優惠' })}</p>
      ${blk('h2', { en: 'HK$50 off your first order', zh: '首次訂購減 HK$50' }, 'welcome__title')
        .replace('<h2', '<h2 id="welcome-title"')}
      ${blk(
        'p',
        {
          en: 'Leave your email and we will send the code — and, once a month or so, a note on training and recovery. No spam, unsubscribe in one click.',
          zh: '留下你的電郵，我們會把優惠碼寄給你；並約每月一次分享訓練與恢復的內容。不發垃圾郵件，一鍵取消訂閱。',
        },
        'welcome__text'
      ).replace('<p class', '<p id="welcome-text" class')}
      <form class="welcome__form" data-welcome-form novalidate>
        <label class="sr-only" for="welcome-email">${t({
          en: 'Email address',
          zh: '電郵地址',
        })}</label>
        <input id="welcome-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com">
        <button class="btn" type="submit">${t({ en: 'Get the code', zh: '取得優惠碼' })}</button>
      </form>
      <div class="welcome__done" data-welcome-done hidden>
        <p class="welcome__code" data-welcome-code>WELCOME50</p>
        ${blk(
          'p',
          {
            en: 'Use it at checkout for HK$50 off. It is saved to this browser, so the cart will remind you.',
            zh: '結帳時輸入即減 HK$50。優惠碼已儲存於此瀏覽器，購物車會提醒你。',
          },
          'welcome__small'
        )}
        <a class="btn" href="${url('/shop/')}">${t({ en: 'Start shopping', zh: '開始選購' })}</a>
      </div>
      ${blk(
        'p',
        {
          en: 'One use per customer, on orders from this website. Not valid at Watsons, Mannings or other retailers.',
          zh: '每位顧客限用一次，只適用於本網站訂單，不適用於屈臣氏、萬寧或其他零售商。',
        },
        'welcome__terms'
      )}
    </div>
  </div>`;
}

/**
 * Full page shell.
 *
 * @param {object} opts
 * @param {{en:string,zh:string}} opts.title
 * @param {{en:string,zh:string}} opts.description
 * @param {string} opts.path       – canonical (English) path, e.g. "/product/"
 * @param {string} opts.body
 * @param {string} [opts.active]   – nav path to highlight
 * @param {object[]} [opts.jsonLd]
 * @param {string} [opts.bodyClass]
 */
export function page({ title, description, path, body, active, jsonLd = [], bodyClass = '' }) {
  const isZh = LANG === 'zh';
  const canonical = SITE.url + url(path);
  const htmlLang = isZh ? 'zh-Hant-HK' : 'en-HK';
  const structured = jsonLd
    .map((data) => `  <script type="application/ld+json">${JSON.stringify(data)}</script>`)
    .join('\n');

  return `<!doctype html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${attr(t(title))} | VITAS 紓適寧</title>
  <meta name="description" content="${attr(t(description))}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en-HK" href="${SITE.url + urlIn(path, 'en')}">
  <link rel="alternate" hreflang="zh-Hant-HK" href="${SITE.url + urlIn(path, 'zh')}">
  <link rel="alternate" hreflang="x-default" href="${SITE.url + urlIn(path, 'en')}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="VITAS 紓適寧">
  <meta property="og:title" content="${attr(t(title))} | VITAS 紓適寧">
  <meta property="og:description" content="${attr(t(description))}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE.url}/assets/img/og-cover.png">
  <meta property="og:locale" content="${isZh ? 'zh_HK' : 'en_HK'}">
  <meta property="og:locale:alternate" content="${isZh ? 'en_HK' : 'zh_HK'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#FE5000">
  <link rel="icon" href="/assets/img/logo/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/logo/mark_app_icon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&family=Noto+Sans+TC:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="/assets/css/site.css">
${structured}
</head>
<body class="${bodyClass}${isZh ? ' lang-zh' : ''}" data-lang="${isZh ? 'zh' : 'en'}">
${header(active, path)}
  <main id="main">
${body}
  </main>
${footer()}
${welcomeModal()}
  <script src="/assets/js/site.js" defer></script>
  <script src="/assets/js/shop.js" defer></script>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- pieces */

/** Eyebrow + heading + optional lede, used at the top of most sections. */
export function sectionHead({ eyebrow, heading, lede, align = 'left' }) {
  return `      <div class="section-head section-head--${align}">
        ${eyebrow ? blk('p', eyebrow, 'eyebrow') : ''}
        ${blk('h2', heading, 'section-head__title')}
        ${lede ? blk('p', lede, 'section-head__lede') : ''}
      </div>`;
}

/** Call to action. Internal paths are language-prefixed automatically. */
export function cta(href, label, variant = '') {
  const external = /^https?:/.test(href);
  return `<a class="btn${variant ? ' ' + variant : ''}" href="${external ? href : url(href)}"${
    external ? ' target="_blank" rel="noopener"' : ''
  }>${t(label)}</a>`;
}

/** Inline text link with an arrow. Internal paths are language-prefixed. */
export function arrow(href, label) {
  return `<a class="link-arrow" href="${url(href)}">${t(label)}</a>`;
}

/** Illustrated media panel — SVG art on a tinted ground. */
export function figure(src, alt, tone = 'tint', { caption, w = 1200, h = 800 } = {}) {
  return `<figure class="figure figure--${tone}">
          <img src="${src}" alt="${attr(plain(alt))}" loading="lazy" decoding="async" width="${w}" height="${h}">
          ${caption ? blk('figcaption', caption) : ''}
        </figure>`;
}
