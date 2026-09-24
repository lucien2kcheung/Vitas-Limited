/**
 * Page bodies. Each export returns a spec for layout.page().
 *
 * `path` is always the canonical English path — the build renders each spec
 * once per language and prefixes the Chinese one with /zh.
 */

import { WA_ICON_PATH,
  SITE,
  t,
  blk,
  plain,
  attr,
  url,
  urlIn,
  getLang,
  sectionHead,
  cta,
  arrow,
  figure,
} from './layout.mjs';
import {
  BRAND,
  SPORTS,
  PURITY,
  PRODUCT,
  PRODUCTS,
  CAPSULE,
  ROLLON,
  CAPSULE_PLANTS,
  SHOP,
  PLANTS,
  STOCKISTS,
  FAQS,
  ABOUT,
} from './data.mjs';

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ASSET_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Sport cards prefer a photograph but ship with an illustration. The photo
 * paths are declared in data.mjs before the files exist, so resolve them at
 * build time: if the file is not on disk, fall back to the SVG rather than
 * deploying a broken image.
 */
function sportArt(sport) {
  if (sport.photo && existsSync(join(ASSET_ROOT, sport.photo.replace(/^\//, '')))) {
    const setParts = (sport.photoSet || '')
      .split(',')
      .map((part) => part.trim())
      .filter((part) => existsSync(join(ASSET_ROOT, part.split(/\s+/)[0].replace(/^\//, ''))));
    return { src: sport.photo, srcset: setParts.join(', '), w: 1600, h: 1067 };
  }
  return { src: sport.art, srcset: '', w: 1200, h: 800 };
}

/* --------------------------------------------------------- shared partials */

const productJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'VITAS Soothing Cream Gel 100ml',
  alternateName: 'VITAS 紓適寧 舒緩啫喱膏 100毫升',
  sku: PRODUCT.sku,
  brand: { '@type': 'Brand', name: 'VITAS 紓適寧' },
  description: plain({
    en: 'A low-odour, non-greasy plant-oil cream gel with eucalyptus, grape seed and niaouli. For warming up before training and massaging tired muscles afterwards. Made in France.',
    zh: '含尤加利、葡萄籽與綠花白千層的低氣味、不油膩植物油啫喱膏。適合訓練前熱身及訓練後按摩疲勞肌肉。法國製造。',
  }),
  image: [
    SITE.url + '/assets/img/product/tube-front-1240.webp',
    SITE.url + '/assets/img/product/tube-angle-1240.webp',
  ],
  countryOfOrigin: 'FR',
  offers: {
    '@type': 'Offer',
    price: String(PRODUCT.price),
    priceCurrency: PRODUCT.currency,
    availability: 'https://schema.org/InStock',
    url: SITE.url + url(PRODUCT.slug),
    seller: { '@type': 'Organization', name: 'VITAS 紓適寧' },
  },
});

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VITAS 紓適寧',
  url: SITE.url,
  logo: SITE.url + '/assets/img/favicon.svg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Unit 411, Lippo Sun Plaza, 28 Canton Road',
    addressLocality: 'Tsim Sha Tsui, Kowloon',
    addressCountry: 'HK',
  },
  sameAs: [SITE.youtube, SITE.facebook, SITE.instagram],
  contactPoint: {
    '@type': 'ContactPoint',
    email: SITE.email,
    telephone: '+852-3167-7081',
    contactType: 'customer service',
    areaServed: 'HK',
    availableLanguage: ['en', 'zh-Hant'],
  },
};

const breadcrumb = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t(item.name),
    item: SITE.url + url(item.path),
  })),
});

const HOME_CRUMB = { name: { en: 'Home', zh: '首頁' }, path: '/' };

/** Breadcrumb trail shown above a page title. */
function crumbs(trail) {
  return `        <nav class="crumbs" aria-label="${attr(t({ en: 'Breadcrumb', zh: '路徑' }))}">
          ${trail
            .map((c, i) =>
              i === trail.length - 1
                ? `<span aria-current="page">${t(c.name)}</span>`
                : `<a href="${url(c.path)}">${t(c.name)}</a><span aria-hidden="true">/</span>`
            )
            .join('\n          ')}
        </nav>`;
}

/** Slim page header used by every page except the homepage. */
function pageHero({ eyebrow, title, lede, trail }) {
  return `    <section class="page-hero">
      <div class="wrap">
${trail ? crumbs(trail) : ''}
        ${blk('p', eyebrow, 'eyebrow')}
        ${blk('h1', title, 'page-hero__title')}
        ${lede ? blk('p', lede, 'page-hero__lede') : ''}
      </div>
    </section>`;
}

/** Orange band listing what is deliberately absent from the formula. */
function freeFromBand() {
  return `    <section class="band band--brand reveal">
      <div class="wrap band__inner">
        <div class="band__head">
          ${blk('p', { en: 'Formulation', zh: '配方' }, 'eyebrow eyebrow--light')}
          ${blk('h2', { en: 'What is deliberately not in it', zh: '刻意不加入的成分' }, 'band__title')}
          ${blk(
            'p',
            {
              en: 'Most muscle rubs work by shouting. The 100ml Soothing Cream Gel is built around the things it leaves out. (The roll-on is a different formula — its full ingredient list is on its own page.)',
              zh: '大多數肌肉按摩產品，都盲目追求「強烈」取勝。100 毫升舒緩啫喱膏的配方天然溫和，重點不在於加了什麼，而在於它不含什麼。（走珠裝屬另一配方，完整成分表載於其產品頁。）',
            },
            'band__lede'
          )}
        </div>
        <ul class="chips">
          ${PRODUCT.freeFrom.map((f) => `<li class="chip">${t(f)}</li>`).join('\n          ')}
        </ul>
      </div>
    </section>`;
}

/** Buy strip: price, size and the two retail chains. */
function buyStrip() {
  return `    <section class="buy reveal" id="buy">
      <div class="wrap buy__inner">
        <div class="buy__art">
          <img src="/assets/img/product/tube-front-620.webp"
               srcset="/assets/img/product/tube-front-620.webp 620w, /assets/img/product/tube-front-1240.webp 1240w"
               sizes="(max-width: 900px) 55vw, 30vw" alt="${attr(
            t({
              en: 'VITAS Soothing Cream Gel 100ml tube',
              zh: 'VITAS 舒緩啫喱膏 100毫升',
            })
          )}" width="620" height="1500" loading="lazy" decoding="async">
        </div>
        <div class="buy__body">
          ${blk('p', { en: 'Pre + post workout', zh: '運動前後' }, 'eyebrow')}
          ${blk('h2', { en: 'Soothing Cream Gel', zh: '舒緩啫喱膏' }, 'buy__title')}
          <p class="buy__meta"><span>${PRODUCT.size}</span><span aria-hidden="true">·</span><span>${
            PRODUCT.priceLabel
          }</span><span aria-hidden="true">·</span><span>${t(PRODUCT.origin)}</span></p>
          ${blk(
            'p',
            {
              en: 'Order online with free delivery from HK$250, or pick it up at Watsons and Mannings across Hong Kong.',
              zh: '網上訂購，滿 HK$250 免運費；亦可於全港屈臣氏及萬寧門市選購。',
            },
            'buy__text'
          )}
          <div class="buy__actions">
            ${cta('/shop/', { en: 'Shop now', zh: '立即選購' })}
            ${cta('/stockists/', { en: 'Where to buy', zh: '購買地點' }, 'btn--ghost')}
          </div>
        </div>
      </div>
    </section>`;
}

/** Newsletter block. The form posts nowhere until an endpoint is configured. */
function newsletter() {
  return `    <section class="signup reveal">
      <div class="wrap signup__inner">
        <div>
          ${blk('h2', { en: 'Slow letters, not spam', zh: '慢一點的通訊，不是垃圾郵件' }, 'signup__title')}
          ${blk(
            'p',
            {
              en: 'Occasional notes on training, recovery and what we are changing about this brand. Roughly monthly.',
              zh: '偶爾分享訓練、恢復，以及這個品牌正在改變的事。大約每月一次。',
            },
            'signup__text'
          )}
        </div>
        <form class="signup__form" data-newsletter action="#" method="post" novalidate>
          <label class="sr-only" for="email">${t({ en: 'Email address', zh: '電郵地址' })}</label>
          <input id="email" name="email" type="email" required autocomplete="email"
                 placeholder="you@example.com">
          <button class="btn btn--light" type="submit">${t({ en: 'Sign up', zh: '訂閱' })}</button>
          <p class="signup__note" data-newsletter-note hidden></p>
        </form>
      </div>
    </section>`;
}

function plantCard(p, { role = true } = {}) {
  return `<article class="card card--plant">
            <a class="card__link" href="${url('/ingredients/' + p.id + '/')}">
              <span class="card__art card__art--tint"><img src="${p.art}" alt="" width="1000" height="1000" loading="lazy" decoding="async"></span>
              ${role ? `<span class="card__meta">${t(p.role)}</span>` : ''}
              ${blk('span', { en: p.nameEn, zh: p.nameZh }, 'card__title')}
              <span class="card__latin">${p.latin}</span>
              ${blk('span', p.short, 'card__lede')}
            </a>
          </article>`;
}



/** The master slogan, always paired with its compliance sub-copy. */
function sloganBlock(className = '') {
  const [line1, line2] = t(BRAND.slogan);
  return `<h1 class="slogan ${className}"><span>${line1}</span><span>${line2}</span></h1>`;
}

/** Prime · Perform · Recover. */
function triptych() {
  return `<ol class="triptych">
            ${BRAND.triptych
              .map(
                (step, i) =>
                  `<li class="triptych__step"><span class="triptych__num">0${i + 1}</span>${t(step)}</li>`
              )
              .join('\n            ')}
          </ol>`;
}

/** Sport module card — links to the sport's own page. */
function sportCard(sport) {
  return `<article class="sport-card">
            <a class="sport-card__link" href="${url('/for/' + sport.id + '/')}">
              <span class="sport-card__art"><img src="${sportArt(sport).src}"${sportArt(sport).srcset ? ` srcset="${sportArt(sport).srcset}" sizes="(max-width: 900px) 92vw, 30vw"` : ''} alt="" width="${sportArt(sport).w}" height="${sportArt(sport).h}" loading="lazy" decoding="async"></span>
              <span class="sport-card__who">${t(sport.who)}</span>
              ${blk('span', sport.name, 'sport-card__name')}
              ${blk('span', sport.hook, 'sport-card__hook')}
              <span class="sport-card__go">${t({ en: 'The routine', zh: '這個運動的用法' })} →</span>
            </a>
          </article>`;
}

/** Ingredient purity: what is out, what is in, and the three marks. */
function puritySection() {
  return `    <section class="section purity reveal" id="purity">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Ingredient purity', zh: '成分純淨' },
  heading: { en: "What's inside matters.", zh: '成分，才是真正的重點。' },
  lede: {
    en: 'Grape seed. Niaouli. Eucalyptus. Three plant-based actives, formulated in France — and a list of things we left out.',
    zh: '葡萄籽、綠花白千層、尤加利：三大植物精華，法國精心研製——以及一張我們選擇不加入的清單。',
  },
})}
        <div class="purity__grid">
          <div class="purity__col purity__col--out">
            <h3 class="purity__title">${t({ en: 'What competitors use', zh: '同類產品常用' })}</h3>
            <ul class="purity__list purity__list--out">
              ${PURITY.out.map((i) => `<li>${t(i)}</li>`).join('\n              ')}
            </ul>
          </div>
          <div class="purity__col purity__col--in">
            <h3 class="purity__title">${t({ en: 'What VITAS uses instead', zh: 'VITAS 用的是' })}</h3>
            <ul class="purity__list purity__list--in">
              ${PURITY.in.map((i) => `<li>${t(i)}</li>`).join('\n              ')}
            </ul>
          </div>
        </div>
        <ul class="marks">
          ${PURITY.marks.map((m) => `<li class="mark">${t(m)}</li>`).join('\n          ')}
        </ul>
      </div>
    </section>`;
}

/** The sensory sub-copy the compliance framework requires beside the slogan. */
function sensoryNote(className = 'sensory-note') {
  return blk('p', BRAND.sensory, className);
}

/** Product card used on the shop page and the homepage shop strip. */
function shopCard(p) {
  return `<article class="shop-card reveal" data-product="${p.id}">
          <div class="shop-card__art">
            <img src="${p.art}" alt="${attr(t(p.name))}" width="${p.artW || 620}" height="${p.artH || 1500}" loading="lazy" decoding="async">
            ${p.badge ? `<span class="shop-card__badge">${t(p.badge)}</span>` : ''}
          </div>
          <div class="shop-card__body">
            ${blk('h2', p.name, 'shop-card__title')}
            <p class="shop-card__variant">${t(p.variant)}</p>
            ${blk('p', p.blurb, 'shop-card__blurb')}
            <ul class="shop-card__points">
              ${p.points.map((pt) => `<li>${t(pt)}</li>`).join('\n              ')}
            </ul>
            <p class="shop-card__price">${
              p.wasLabel ? `<s class="shop-card__was">${p.wasLabel}</s> ` : ''
            }${p.priceLabel}</p>
            <div class="shop-card__actions">
              <button class="btn" type="button" data-add-to-cart="${p.id}"
                      data-name="${attr(t(p.name))}" data-variant="${attr(t(p.variant))}"
                      data-price="${p.price}" data-art="${p.art}">
                ${t({ en: 'Add to cart', zh: '加入購物車' })}
              </button>
              ${arrow(p.slug, { en: 'Read about it', zh: '了解更多' })}
            </div>
          </div>
        </article>`;
}

/* ------------------------------------------------------------------- pages */

export function home() {
  const body = `    <section class="hero">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="wrap hero__inner">
        <div class="hero__copy">
          ${blk('p', { en: 'Pre + Post Workout', zh: '運動前後' }, 'eyebrow')}
${sloganBlock('hero__slogan')}
          ${blk('p', BRAND.heroLede, 'hero__lede')}
          ${triptych()}
          <div class="hero__actions">
            ${cta('/shop/', { en: 'Shop performance', zh: '選購' })}
            ${cta('/for/', { en: 'Find your sport', zh: '找你的運動' }, 'btn--ghost')}
          </div>
          <p class="hero__meta">${t(BRAND.proof)}</p>
        </div>
        <div class="hero__art">
          <img src="/assets/img/product/tube-angle-620.webp"
               srcset="/assets/img/product/tube-angle-620.webp 620w, /assets/img/product/tube-angle-1240.webp 1240w"
               sizes="(max-width: 900px) 62vw, 34vw" alt="${attr(
            t({
              en: 'VITAS Soothing Cream Gel, 100ml tube',
              zh: 'VITAS 舒緩啫喱膏 100毫升',
            })
          )}" width="620" height="1632" fetchpriority="high" decoding="async">
        </div>
      </div>
      <div class="wrap">
        ${sensoryNote('hero__sensory')}
      </div>
    </section>

    <section class="section sports reveal" id="sports">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Your sport', zh: '你的運動' },
  heading: {
    en: 'Built into the session, not the medicine cabinet',
    zh: '屬於訓練的夥伴，而不是在藥箱裡的備品。',
  },
  lede: {
    en: 'The routine changes with the sport. Hyrox, padel, run club — three examples of how people actually train in Hong Kong. Your sport? Same ritual.',
    zh: '不同的運動，用法自然也不同。以下三種情境，是專為香港人的真實訓練節奏所寫。你的運動呢？同一套流程，一樣適用。',
  },
})}
        <div class="grid grid--3">
          ${SPORTS.map(sportCard).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section moments reveal">
      <div class="wrap moments__inner">
        <article class="moment moment--warm">
          <span class="moment__tag">${t({ en: 'Before · Activate', zh: '賽前 · 激活' })}</span>
          ${blk('h2', { en: 'The pre-session ritual', zh: '賽前儀式' }, 'moment__title')}
          ${blk(
            'p',
            {
              en: 'Apply VITAS 10 minutes before training. The warming sensation helps your muscles feel ready — part of a proper dynamic warm-up for Hyrox, padel, or your run club session. Make it a regular habit before every workout.',
              zh: '訓練前 10 分鐘塗抹 VITAS。溫熱的觸感能讓肌肉瞬間進入狀態——無論是 Hyrox、板式網球或跑團課前的動態熱身，都能完美融入。不妨把它變成每次出發前的固定習慣。',
            },
            'moment__text'
          )}
          <p>${arrow('/how-to-use/#before', { en: 'The full warm-up', zh: '完整熱身步驟' })}</p>
        </article>
        <article class="moment moment--cool">
          <span class="moment__tag">${t({ en: 'After · Accelerate', zh: '賽後 · 加速' })}</span>
          ${blk('h2', { en: 'The post-session wind-down', zh: '賽後放鬆' }, 'moment__title')}
          ${blk(
            'p',
            {
              en: 'Massage VITAS into tired muscles after effort. The cooling sensation provides soothing relief as you stretch and recover.',
              zh: '運動後按摩疲勞的肌肉，搭配清涼的觸感，在你進行伸展與放鬆時，帶來舒緩感受。',
            },
            'moment__text'
          )}
          <p>${arrow('/how-to-use/#after', { en: 'The full wind-down', zh: '完整放鬆步驟' })}</p>
        </article>
      </div>
    </section>

    <section class="section plants reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Three plants', zh: '三種植物' },
  heading: { en: 'A short ingredient list, on purpose', zh: '刻意簡短的成分表' },
  lede: {
    en: 'Grape seed carries it, niaouli warms it, eucalyptus cools it. Each one has its own page.',
    zh: '葡萄籽承載，綠花白千層帶來暖感，尤加利帶來清涼。每一種都有獨立頁面。',
  },
})}
        <div class="grid grid--3">
          ${PLANTS.map((p) => plantCard(p)).join('\n          ')}
        </div>
      </div>
    </section>

${puritySection()}

    <section class="section finder-teaser reveal">
      <div class="wrap finder-teaser__inner">
        <div>
          ${blk('p', { en: 'Guided', zh: '引導' }, 'eyebrow')}
          ${blk('h2', { en: 'Not sure how to use it?', zh: '不確定該怎樣用？' }, 'finder-teaser__title')}
          ${blk(
            'p',
            {
              en: 'Three questions — what you do, when you ache, how much time you have — and we will give you a routine you will actually keep.',
              zh: '三條問題：你做甚麼運動、甚麼時候痠痛、有多少時間。我們會給你一套你真的會持續使用的方法。',
            },
            'finder-teaser__text'
          )}
          ${cta('/how-to-use/#finder', { en: 'Start the three questions', zh: '開始三條問題' })}
        </div>
        <img class="finder-teaser__art" src="/assets/img/art-desk.svg" alt="" width="1200" height="800" loading="lazy" decoding="async">
      </div>
    </section>

${buyStrip()}

${newsletter()}`;

  return {
    title: {
      en: 'Low-odour muscle cream for before and after training',
      zh: '運動前後適用的低氣味肌肉按摩膏',
    },
    description: {
      en: 'VITAS 紓適寧 Soothing Cream Gel: a low-odour, non-greasy plant-oil cream gel with eucalyptus, grape seed and niaouli. 100ml, HK$250, at Watsons and Mannings in Hong Kong.',
      zh: 'VITAS 紓適寧舒緩啫喱膏：含尤加利、葡萄籽及綠花白千層的低氣味、不油膩植物油啫喱膏。100毫升，HK$250，香港屈臣氏及萬寧有售。',
    },
    path: '/',
    active: '/',
    body,
    jsonLd: [orgJsonLd, productJsonLd()],
    bodyClass: 'page-home',
  };
}

export function product() {
  const body = `${pageHero({
    eyebrow: { en: 'VITAS Soothing Cream', zh: 'VITAS 舒緩啫喱膏' },
    title: { en: 'One tube, three plants, two moments', zh: '一支軟管，三種植物，兩個時刻' },
    lede: {
      en: 'A clean, French-made cream gel for warming up before effort and cooling down after it. 100ml, HK$250. Here is what it feels like, where it fits in your day, and what is inside.',
      zh: '一支純淨、法國製造的啫喱膏，陪伴你度過運動前的熱身與運動後的放鬆。100 毫升，HK$250。以下，將為你完整介紹它的奇妙膚感、如何自然融入你的日常，以及它的成分。',
    },
    trail: [HOME_CRUMB, { name: { en: 'VITAS Soothing Cream', zh: 'VITAS 舒緩啫喱膏' }, path: '/product/' }],
  })}

    <section class="section product-main">
      <div class="wrap product-main__inner">
        <div class="product-main__art">
          <img src="/assets/img/product/tube-angle-620.webp"
               srcset="/assets/img/product/tube-angle-620.webp 620w, /assets/img/product/tube-angle-1240.webp 1240w"
               sizes="(max-width: 900px) 70vw, 38vw" alt="${attr(
            t({ en: 'VITAS Soothing Cream Gel 100ml', zh: 'VITAS 舒緩啫喱膏 100毫升' })
          )}" width="620" height="1632" loading="lazy" decoding="async">
        </div>
        <div class="product-main__body">
          <dl class="spec">
            <div class="spec__row"><dt>${t({ en: 'Size', zh: '容量' })}</dt><dd>${
              PRODUCT.size
            }</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Price', zh: '售價' })}</dt><dd>${
              PRODUCT.priceLabel
            }</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Texture', zh: '質地' })}</dt><dd>${t(
              PRODUCT.texture
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Scent', zh: '氣味' })}</dt><dd>${t({
              en: 'A faint green eucalyptus note that fades naturally within about a minute.',
              zh: '帶有淡淡的尤加利草本清香，大約一分鐘內便會自然散去。',
            })}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Made in', zh: '生產地' })}</dt><dd>${t(
              PRODUCT.gmp
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Best for', zh: '適合' })}</dt><dd>${t({
              en: 'Pre-training preparation, post-training massage, desk-bound neck and shoulders.',
              zh: '訓練前準備、訓練後按摩、久坐引起的頸肩緊繃。',
            })}</dd></div>
          </dl>
          <div class="buy__actions">
            ${cta('/shop/', { en: 'Shop now', zh: '立即選購' })}
            ${cta('/stockists/', { en: 'Where to buy', zh: '購買地點' }, 'btn--ghost')}
          </div>
          ${blk(
            'p',
            {
              en: 'Order here with free Hong Kong delivery from HK$250, or pick it up at Watsons and Mannings.',
              zh: '可於本網站訂購，滿 HK$250 免香港運費；亦可於屈臣氏及萬寧門市選購。',
            },
            'product-main__note'
          )}
        </div>
      </div>
    </section>

    <section class="section feel reveal" id="what-you-feel">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'On the skin', zh: '膚感' },
  heading: { en: 'What you will feel', zh: '你會感受到的' },
  lede: {
    en: 'One cream gel, two moments: warming when you massage it in before training, cooling when you massage it in after.',
    zh: '一支啫喱膏，對應兩個關鍵時刻：訓練前按摩帶來溫熱感，訓練後按摩帶來清涼感。',
  },
})}
        <div class="feel__grid">
          ${[
            {
              mod: 'warm',
              icon: '<path d="M12 3c2.5 3 4 5.3 4 8a4 4 0 0 1-8 0c0-1.4.5-2.6 1.4-3.6.3 1.3 1 2 1.6 2.2C11 7.5 11.3 5.2 12 3Z"/><path d="M12 21v-3"/>',
              h: { en: 'Warming before', zh: '運動前 · 溫熱' },
              p: {
                en: 'Massage it in ten minutes before training. The warming sensation is your cue to start the warm-up properly.',
                zh: '訓練前十分鐘按摩塗抹。溫熱的觸感像是一個提醒，告訴自己：是時候認真開始熱身了。',
              },
            },
            {
              mod: 'cool',
              icon: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.5 4.5 12 6l2.5-1.5M9.5 19.5 12 18l2.5 1.5"/>',
              h: { en: 'Cooling after', zh: '運動後 · 清涼' },
              p: {
                en: 'Massage it into tired legs, shoulders and back after training — a fresh, cooling feel while you stretch and wind down.',
                zh: '訓練後按摩疲勞的雙腿、肩膊與背部——在伸展與放鬆的同時，帶來陣陣清新的涼感。',
              },
            },
            {
              mod: 'plain',
              icon: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
              h: { en: 'Absorbed in under a minute', zh: '一分鐘內吸收' },
              p: {
                en: 'A light, non-greasy texture that leaves no shine, so you can dress and get on with your day.',
                zh: '輕盈不黏膩的清爽質地，絕不留油光。塗抹後即可輕鬆著裝，無縫接軌你的每一個日常行程。',
              },
            },
            {
              mod: 'plain',
              icon: '<path d="M4 9c2-2 4-2 6 0s4 2 6 0 3-1.5 4-1"/><path d="M4 15c2-2 4-2 6 0s4 2 6 0 3-1.5 4-1"/><path d="M3 3l18 18"/>',
              h: { en: 'No medicated smell', zh: '沒有藥油味' },
              p: {
                en: 'A faint eucalyptus note that fades within a minute. Fine for the gym, the office or the MTR.',
                zh: '散發淡淡的尤加利清香，大約一分鐘內就會散去。無論是在健身室、辦公室，甚至是擁擠的港鐵上隨時使用，都完全沒有問題。',
              },
            },
          ]
            .map(
              (c) => `<article class="feel-card feel-card--${c.mod}">
            <svg class="feel-card__icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${c.icon}</svg>
            ${blk('h3', c.h, 'feel-card__title')}
            ${blk('p', c.p, 'feel-card__text')}
          </article>`
            )
            .join('\n          ')}
        </div>

        <div class="fit">
          ${blk('h3', { en: 'Where it fits in your day', zh: '融入你的一天' }, 'fit__title')}
          <ul class="fit__list">
            ${[
              {
                href: '/how-to-use/#before',
                h: { en: 'Before every workout', zh: '每次運動前' },
                p: { en: 'Two minutes. Make it a regular habit.', zh: '兩分鐘，養成固定習慣。' },
              },
              {
                href: '/how-to-use/#after',
                h: { en: 'After training', zh: '訓練後' },
                p: { en: 'Ten minutes while you stretch.', zh: '伸展時的十分鐘。' },
              },
              {
                href: '/how-to-use/#desk',
                h: { en: 'At your desk', zh: '辦公桌前' },
                p: { en: 'Three minutes for neck and shoulders.', zh: '三分鐘照顧頸肩。' },
              },
            ]
              .map(
                (f) => `<li><a class="fit__item" href="${url(f.href)}">
              ${blk('span', f.h, 'fit__name')}
              ${blk('span', f.p, 'fit__text')}
              <span class="fit__go" aria-hidden="true">→</span>
            </a></li>`
              )
              .join('\n            ')}
          </ul>
        </div>

        ${blk(
          'p',
          {
            en: 'A cosmetic massage gel, not a medicine. It does not replace a warm-up, rest or a physio.',
            zh: '本品為按摩護理凝膠，並非藥物，不能取代熱身、休息或物理治療。',
          },
          'feel__honest'
        )}
      </div>
    </section>

${puritySection()}

    <section class="section ingredients-list reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Inside the tube', zh: '軟管裡有甚麼' },
  heading: { en: 'The three that matter', zh: '關鍵的三種成分' },
})}
        <div class="grid grid--3">
          ${PLANTS.map((p) => plantCard(p, { role: false })).join('\n          ')}
        </div>
        ${blk(
          'p',
          {
            en: 'Full INCI list is printed on the carton. If you have a known sensitivity to essential oils, patch test on the inner forearm first.',
            zh: '完整 INCI 成分表印於外盒。如你對精油有已知敏感，請先於前臂內側試用。',
          },
          'note'
        )}
      </div>
    </section>

${newsletter()}`;

  return {
    title: { en: 'VITAS Soothing Cream', zh: 'VITAS 舒緩啫喱膏' },
    description: {
      en: 'VITAS Soothing Cream Gel (100ml, HK$250): warming before training, cooling after, absorbed in under a minute, no medicated smell. Made in France.',
      zh: 'VITAS 舒緩啫喱膏（100毫升，HK$250）：運動前溫熱、運動後清涼，一分鐘內吸收，沒有藥油味。法國製造。',
    },
    path: '/product/',
    active: '/product/',
    body,
    jsonLd: [
      productJsonLd(),
      breadcrumb([HOME_CRUMB, { name: { en: 'VITAS Soothing Cream', zh: 'VITAS 舒緩啫喱膏' }, path: '/product/' }]),
    ],
  };
}

export function howToUse() {
  // Set VIDEO_ID to the YouTube id once the video is ready; empty shows the placeholder.
  const VIDEO_ID = '';

  const routines = [
    {
      id: 'before',
      eyebrow: { en: '2 minutes · before training', zh: '2 分鐘 · 訓練前' },
      title: { en: 'The pre-session check-in', zh: '賽前自我檢查' },
      steps: [
        {
          en: 'Warm the tube in your hand and take an amount the size of a five-cent coin per muscle group.',
          zh: '先將啫喱膏置於掌心微微回溫，接著針對每個肌群取約五毫硬幣大小的份量，均勻塗抹。',
        },
        {
          en: 'Work it in with the heel of your hand, following the length of the muscle — calves and hamstrings for running, shoulders and lats for climbing or swimming, quads and hips for lifting.',
          zh: '以掌心順著肌肉紋理推開——跑步後對焦小腿與膕繩肌；攀岩或游泳後舒緩肩膊與背闊肌；進行負重訓練後則鎖定股四頭肌與髖部。',
        },
        {
          en: 'Note anything that feels stiffer than usual. That information is the point of the two minutes.',
          zh: '留意哪裡比平時更繃更僵硬——這短短兩分鐘的價值，就在身體給你的誠實訊息裡。',
        },
        {
          en: 'Then do a real warm-up: five to ten minutes of easy movement, building to your first working set.',
          zh: '接著進行完整的動態熱身：以 5 到 10 分鐘的輕鬆活動，讓身體逐步進入狀態，無縫接軌第一組正式訓練。',
        },
      ],
    },
    {
      id: 'after',
      eyebrow: { en: '10 minutes · after training', zh: '10 分鐘 · 訓練後' },
      title: { en: 'The evening wind-down', zh: '運動後放鬆' },
      steps: [
        {
          en: 'Shower first. Clean, dry skin absorbs it faster and you will use less.',
          zh: '建議於洗澡後使用。乾淨、乾爽的肌膚能加速吸收，用量也更精省。',
        },
        {
          en: 'Work upwards along the limb in long, slow strokes, then circle the areas that took the most load.',
          zh: '沿著肢體以長而舒緩的手勢向上推展，並在受力最多的部位畫圈按揉。',
        },
        {
          en: 'Give it a minute to absorb before you dress. It should not feel slick.',
          zh: '穿衣前靜待的一分鐘讓其充分吸收，確保肌膚表面乾爽、不留油膩感。',
        },
        {
          en: 'Pair it with the boring things that work: water, food, and going to bed at a reasonable hour.',
          zh: '配合真正有效、卻往往引不起注意的基本功：適時補水、進食，以及在合適的時間準時入睡。',
        },
      ],
    },
    {
      id: 'desk',
      eyebrow: { en: '3 minutes · at a desk', zh: '3 分鐘 · 辦公桌前' },
      title: { en: 'The office reset', zh: '辦公室重設' },
      steps: [
        {
          en: 'A pea-sized amount along each side of the neck and across the top of the shoulders.',
          zh: '豌豆大小的份量，塗於頸部兩側及肩膊上方。',
        },
        {
          en: 'Slow circles towards the collarbone, thumbs doing the work, jaw relaxed.',
          zh: '以拇指緩慢向鎖骨方向打圈，放鬆下顎。',
        },
        {
          en: 'Ten shoulder rolls backwards, ten chin tucks, then stand up.',
          zh: '向後轉肩十次、收下巴十次，然後站起來。',
        },
        {
          en: 'Twice a day beats once a week. Mid-morning and mid-afternoon are the natural slots.',
          zh: '每天兩次，勝過每週一次。上午與下午中段是最自然的舒緩時機。',
        },
      ],
    },
  ];

  const opt = (name, v, label) =>
    `<label class="opt"><input type="radio" name="${name}" value="${v}"><span>${t(label)}</span></label>`;

  const body = `${pageHero({
    eyebrow: { en: 'How to use', zh: '使用方法' },
    title: { en: 'Simple to use — three routines, none of them complicated', zh: '用法簡單，三套用法輕鬆上手' },
    lede: {
      en: 'Apply once or twice a day to clean, unbroken skin. Avoid the eyes and face. That is the whole instruction — the rest is how to make it a habit.',
      zh: '每日一到兩次，塗抹在清潔、無破損的皮膚上，避開眼睛與面部。簡單易明——接下來要做的，是如何把它變成習慣。',
    },
    trail: [HOME_CRUMB, { name: { en: 'How to Use', zh: '使用方法' }, path: '/how-to-use/' }],
  })}

    <section class="section video reveal" id="video">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Watch', zh: '影片' },
  heading: { en: 'See it in two minutes', zh: '兩分鐘看懂用法' },
})}
        ${
          /* Paste the YouTube video id below (the part after v=) to replace the placeholder. */
          VIDEO_ID
            ? `<div class="video__frame"><iframe src="https://www.youtube-nocookie.com/embed/${VIDEO_ID}" title="VITAS" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
            : `<div class="video__placeholder">[YOUTUBE VIDEO LINK]</div>`
        }
      </div>
    </section>

    <section class="section ppr reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Prime · Perform · Recover', zh: '喚醒 · 投入 · 收操' },
  heading: { en: 'Prime. Perform. Recover.', zh: '喚醒．投入．收操。' },
  align: 'center',
})}
        <ol class="ppr__steps">
          <li class="ppr__step">
            <span class="ppr__num">01</span>
            ${blk('h3', { en: 'Prime — before training', zh: '喚醒 — 運動前' }, 'ppr__title')}
            ${blk('p', {
              en: 'Apply a thin layer to thighs, calves, shoulders or other target areas. Massage in circular motions as part of your warm-up and experience the warming sensation. Make it a regular habit before every workout.',
              zh: '取適量薄薄塗抹於大腿、小腿、肩膊或其他目標部位。以打圈方式按摩，融入熱身流程並感受溫熱體感。不妨把它變成每次運動前的固定習慣。',
            }, 'ppr__text')}
          </li>
          <li class="ppr__step">
            <span class="ppr__num">02</span>
            ${blk('h3', { en: 'Perform — move', zh: '投入 — 運動中' }, 'ppr__title')}
            ${blk('p', {
              en: 'Move. Train. Run. Lift. Play.',
              zh: '跑步、訓練、舉重、比賽——在每一次呼吸裡，專注當下。',
            }, 'ppr__text')}
          </li>
          <li class="ppr__step">
            <span class="ppr__num">03</span>
            ${blk('h3', { en: 'Recover — after training', zh: '收操 — 運動後' }, 'ppr__title')}
            ${blk('p', {
              en: 'Reapply and massage into tired areas after training. Enjoy the cooling sensation as part of your post-workout wind-down.',
              zh: '運動結束後，再次塗抹於緊繃部位並輕柔按摩，感受舒適的清涼體感，為每一次訓練畫下放鬆的句點。',
            }, 'ppr__text')}
          </li>
        </ol>
      </div>
    </section>

    <section class="section routines">
      <div class="wrap">
        ${routines
          .map(
            (r, i) => `<article class="routine reveal" id="${r.id}">
          <div class="routine__head">
            <span class="routine__num">0${i + 1}</span>
            ${blk('p', r.eyebrow, 'eyebrow')}
            ${blk('h2', r.title, 'routine__title')}
          </div>
          <ol class="routine__steps">
            ${r.steps.map((s) => `<li>${t(s)}</li>`).join('\n            ')}
          </ol>
        </article>`
          )
          .join('\n        ')}
      </div>
    </section>

    <section class="section finder reveal" id="finder">
      <div class="wrap finder__inner">
${sectionHead({
  eyebrow: { en: 'Three questions', zh: '三條問題' },
  heading: { en: 'Find the routine you will actually keep', zh: '找出你真的會持續的用法' },
  align: 'center',
})}
        <form class="finder__form" data-finder data-lang="${getLang()}">
          <fieldset class="finder__step">
            <legend>${t({ en: '1. What are you doing?', zh: '1. 你在做甚麼？' })}</legend>
            <div class="finder__options">
              ${opt('q1', 'run', { en: 'Running, cycling, hiking', zh: '跑步、單車、行山' })}
              ${opt('q1', 'gym', { en: 'Gym, lifting, climbing', zh: '健身、負重、攀岩' })}
              ${opt('q1', 'desk', { en: 'Mostly sitting at a desk', zh: '大部分時間坐在辦公桌前' })}
            </div>
          </fieldset>
          <fieldset class="finder__step">
            <legend>${t({ en: '2. When does it bother you?', zh: '2. 甚麼時候最不舒服？' })}</legend>
            <div class="finder__options">
              ${opt('q2', 'before', { en: 'Stiff before I start', zh: '開始前就已經僵硬' })}
              ${opt('q2', 'after', { en: 'Sore the next day', zh: '第二天痠痛' })}
              ${opt('q2', 'always', { en: 'A constant background ache', zh: '長期隱隱作痛' })}
            </div>
          </fieldset>
          <fieldset class="finder__step">
            <legend>${t({
              en: '3. How much time will you give it?',
              zh: '3. 你願意花多少時間？',
            })}</legend>
            <div class="finder__options">
              ${opt('q3', 'two', { en: 'Two minutes, honestly', zh: '老實說，兩分鐘' })}
              ${opt('q3', 'ten', { en: 'Ten minutes in the evening', zh: '晚上十分鐘' })}
              ${opt('q3', 'split', { en: 'A little, twice a day', zh: '每天兩次，每次少少' })}
            </div>
          </fieldset>
          <div class="finder__result" data-finder-result hidden aria-live="polite"></div>
        </form>
      </div>
    </section>

    <section class="section safety reveal">
      <div class="wrap safety__inner">
        ${blk('h2', { en: 'Sensible cautions', zh: '使用注意' }, 'safety__title')}
        <ul class="safety__list">
          ${[
            {
              en: 'External use only. Keep away from eyes, mouth and broken skin.',
              zh: '只供外用。避免接觸眼睛、口腔及破損皮膚。',
            },
            { en: 'Not recommended for children under 5.', zh: '不建議 5 歲以下兒童使用。' },
            {
              en: 'If pregnant or breastfeeding, ask your doctor before use.',
              zh: '懷孕或哺乳期間，請先諮詢醫生。',
            },
            {
              en: 'Patch test on the inner forearm if you have sensitive skin.',
              zh: '皮膚敏感者請先於前臂內側試用。',
            },
            { en: 'Stop if the skin becomes red or irritated.', zh: '如皮膚出現泛紅或不適，請停止使用。' },
            {
              en: 'Severe, sudden or post-injury pain needs a doctor, not a cream.',
              zh: '劇烈、突發或受傷後的疼痛，請求醫，而非依賴按摩膏。',
            },
          ]
            .map((i) => `<li>${t(i)}</li>`)
            .join('\n          ')}
        </ul>
      </div>
    </section>

    <section class="section sports reveal" id="your-sport">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Your sport', zh: '你的運動' },
  heading: { en: 'Routines for the way you actually train', zh: '按你真正的訓練方式而設的用法' },
  lede: {
    en: 'Hyrox, padel and running load the body differently, so the two minutes before and the ten minutes after look different too. Pick yours.',
    zh: 'Hyrox、板式網球與跑步對身體的負荷各異，賽前兩分鐘與賽後十分鐘的做法也不同。選擇你的運動。',
  },
})}
        <div class="grid grid--3">
          ${SPORTS.map(sportCard).join('\n          ')}
        </div>
        ${sensoryNote('note')}
      </div>
    </section>`;

  return {
    title: { en: 'How to use', zh: '使用方法' },
    description: {
      en: 'How to use VITAS Soothing Cream Gel: a pre-training warm-up, a post-training wind-down, a three-minute desk reset, plus routines for Hyrox, padel and running.',
      zh: 'VITAS 舒緩啫喱膏的使用方法：訓練前熱身、訓練後放鬆、辦公桌前三分鐘重設，以及 Hyrox、板式網球與跑步的專屬用法。',
    },
    path: '/how-to-use/',
    active: '/how-to-use/',
    body,
    jsonLd: [
      breadcrumb([HOME_CRUMB, { name: { en: 'How to use', zh: '使用方法' }, path: '/how-to-use/' }]),
    ],
  };
}

/* ------------------------------------------------------------- capsule */

const capsuleJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'VITAS Capsule',
  sku: CAPSULE.sku,
  brand: { '@type': 'Brand', name: 'VITAS 紓適寧' },
  description: t({
    en: 'A plant-based food supplement: red grape leaf, bilberry, soy lecithin and garlic. 60 capsules, made in France to EEC GMP standard.',
    zh: '植物配方食品補充品：紅葡萄葉、北歐藍莓、大豆卵磷脂與大蒜。60 粒，法國製造，按 EEC GMP 標準生產。',
  }),
  image: SITE.url + '/assets/img/product/capsule-set-1240.webp',
  offers: {
    '@type': 'Offer',
    price: String(CAPSULE.price),
    priceCurrency: 'HKD',
    availability: 'https://schema.org/InStock',
    url: SITE.url + url('/capsule/'),
  },
});


export function capsule() {
  const body = `${pageHero({
    eyebrow: { en: 'VITAS Capsule', zh: 'VITAS 淋巴管理膠囊' },
    title: { en: 'Four plants, one capsule', zh: '四種植物，一粒膠囊' },
    lede: {
      en: 'Red grape leaf, bilberry, soy lecithin and garlic, in a capsule made in France. 60 capsules.',
      zh: '紅葡萄葉、北歐藍莓、大豆卵磷脂與大蒜，裝入法國製造的膠囊。60 粒。',
    },
    trail: [HOME_CRUMB, { name: { en: 'VITAS Capsule', zh: 'VITAS 淋巴管理膠囊' }, path: '/capsule/' }],
  })}

    <section class="section product-main">
      <div class="wrap product-main__inner">
        <div class="product-main__art">
          <div class="gallery" data-gallery>
            <div class="gallery__main">
              <img data-gallery-main src="${CAPSULE.photos[0].base}-620.webp"
                   srcset="${CAPSULE.photos[0].base}-620.webp 620w, ${CAPSULE.photos[0].base}-1240.webp 1240w"
                   sizes="(max-width: 900px) 80vw, 38vw" alt="${attr(t(CAPSULE.photos[0].alt))}"
                   width="620" height="620" decoding="async">
            </div>
            <ul class="gallery__thumbs">
              ${CAPSULE.photos
                .map(
                  (ph, i) => `<li><button type="button" class="gallery__thumb" data-gallery-thumb
                data-src="${ph.base}-620.webp"
                data-srcset="${ph.base}-620.webp 620w, ${ph.base}-1240.webp 1240w"
                data-alt="${attr(t(ph.alt))}" aria-current="${i === 0 ? 'true' : 'false'}">
                <img src="${ph.base}-620.webp" alt="${attr(t(ph.alt))}" width="620" height="620" loading="lazy" decoding="async">
              </button></li>`
                )
                .join('\n              ')}
            </ul>
          </div>
        </div>
        <div class="product-main__body">
          <dl class="spec">
            <div class="spec__row"><dt>${t({ en: 'Size', zh: '容量' })}</dt><dd>${t(
              CAPSULE.size
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Price', zh: '售價' })}</dt><dd><s class="spec__was">${
              CAPSULE.wasLabel
            }</s> ${CAPSULE.priceLabel}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Ingredients', zh: '主要成份' })}</dt><dd>${t({
              en: 'Red grape leaf, bilberry, soy lecithin, garlic.',
              zh: '紅葡萄葉、北歐藍莓、大豆卵磷脂、大蒜。',
            })}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'How to take', zh: '服用方法' })}</dt><dd>${t(
              CAPSULE.dosage
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Made in', zh: '生產地' })}</dt><dd>${t(
              CAPSULE.gmp
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Storage', zh: '貯存' })}</dt><dd>${t(
              CAPSULE.storage
            )}</dd></div>
          </dl>
          <div class="buy__actions">
            ${cta('/shop/', { en: 'Shop now', zh: '立即選購' })}
            ${cta('/stockists/', { en: 'Where to buy', zh: '購買地點' }, 'btn--ghost')}
          </div>
          ${blk(
            'p',
            {
              en: 'Order here with free Hong Kong delivery from HK$250, or pick it up at Watsons and Mannings.',
              zh: '可於本網站訂購，滿 HK$250 免香港運費；亦可於屈臣氏及萬寧門市選購。',
            },
            'product-main__note'
          )}
        </div>
      </div>
    </section>

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'What is in it', zh: '成分' },
  heading: { en: 'Four plants, each named on the box', zh: '四種植物，全部印在外盒上' },
  lede: {
    en: 'Short ingredient list, no proprietary blend, no filler names you cannot look up. Here is each one and what it is.',
    zh: '成分表很短，沒有所謂的「專利複方」，也沒有你查不到的名字。以下逐一說明每種成分是甚麼。',
  },
})}
        <div class="capsule-plants">
          ${CAPSULE_PLANTS.map(
            (p) => `<article class="capsule-plant reveal">
            <img class="capsule-plant__art" src="${p.art}" alt="${attr(t(p.name))}" width="1000" height="1000" loading="lazy" decoding="async">
            <div class="capsule-plant__body">
              ${blk('p', p.eyebrow, 'eyebrow')}
              ${blk('h3', p.name, 'capsule-plant__name')}
              <p class="capsule-plant__latin">${p.latin}</p>
              ${blk('p', p.text, 'capsule-plant__text')}
            </div>
          </article>`
          ).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section band band--wash reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'How to take it', zh: '服用方法' },
  heading: { en: 'Twice a day, with the rest of your routine', zh: '每天兩次，融入你的日常' },
})}
        <ol class="capsule-steps">
          ${[
            {
              h: { en: 'Morning', zh: '早上' },
              p: {
                en: '1 to 3 capsules, before or after a meal, with a glass of water.',
                zh: '1 至 3 粒，餐前或餐後服用，配一杯水。',
              },
            },
            {
              h: { en: 'Evening', zh: '晚上' },
              p: {
                en: 'The second dose, roughly 6 to 7 hours after the first. Same amount.',
                zh: '第二次服用，與第一次相隔約 6 至 7 小時，份量相同。',
              },
            },
            {
              h: { en: 'Keep it visible', zh: '放在看得見的地方' },
              p: {
                en: 'Supplements work the same way the massage routine does: only if you actually keep taking them. Leave the bottle where you will see it.',
                zh: '補充品和按摩流程一樣：持續做才有意義。把它放在你會看見的位置。',
              },
            },
          ]
            .map(
              (st) => `<li class="capsule-step">
            ${blk('h3', st.h, 'capsule-step__title')}
            ${blk('p', st.p, 'capsule-step__text')}
          </li>`
            )
            .join('\n          ')}
        </ol>
      </div>
    </section>

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Before you take it', zh: '服用前請留意' },
  heading: { en: 'Read this first', zh: '請先閱讀' },
})}
        <ul class="capsule-cautions">
          ${CAPSULE.cautions.map((c) => `<li>${t(c)}</li>`).join('\n          ')}
        </ul>
      </div>
    </section>

${buyStrip()}

${newsletter()}`;

  return {
    title: { en: 'VITAS Capsule', zh: 'VITAS 淋巴管理膠囊' },
    description: {
      en: 'VITAS Capsule: red grape leaf, bilberry, soy lecithin and garlic. 60 capsules, HK$298, made in France to EEC GMP standard. A plant-based food supplement.',
      zh: 'VITAS 淋巴管理膠囊：紅葡萄葉、北歐藍莓、大豆卵磷脂與大蒜。60 粒，HK$298，法國製造，按 EEC GMP 標準生產。植物配方食品補充品。',
    },
    path: '/capsule/',
    active: '/capsule/',
    body,
    jsonLd: [capsuleJsonLd()],
  };
}

/* ------------------------------------------------------------- roll-on */

const rollOnJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'VITAS Soothing Cream Gel Roll-On, 2 × 50ml',
  sku: ROLLON.sku,
  brand: { '@type': 'Brand', name: 'VITAS 紓適寧' },
  description: t({
    en: 'Grape seed, niaouli and eucalyptus with menthol, in a 50ml roll-on. Two-pack, made in France to EEC GMP standard.',
    zh: '葡萄籽、綠花白千層與尤加利，加入薄荷腦，50 毫升走珠裝。孖裝發售，法國製造，按 EEC GMP 標準生產。',
  }),
  image: SITE.url + '/assets/img/product/rollon-set-1240.webp',
  offers: {
    '@type': 'Offer',
    price: String(ROLLON.price),
    priceCurrency: 'HKD',
    availability: 'https://schema.org/InStock',
    url: SITE.url + url('/roll-on/'),
  },
});

export function rollOn() {
  const body = `${pageHero({
    eyebrow: { en: 'Soothing Cream Gel Roll-On', zh: '舒緩啫喱膏走珠裝' },
    title: { en: 'No hands. Roll it on and go.', zh: '不用手，滾一滾就出發。' },
    lede: {
      en: 'The same three plants as the cream gel, in a 50ml roll-on with menthol added for a sharper cool. Sold as a two-pack, HK$320 — one for the bag, one for the desk.',
      zh: '與啫喱膏相同的三種植物，改為 50 毫升走珠裝，並加入薄荷腦，清涼感更明顯。孖裝發售，HK$320——一支放袋，一支放辦公桌。',
    },
    trail: [
      HOME_CRUMB,
      { name: { en: 'Soothing Cream Gel Roll-On', zh: '舒緩啫喱膏走珠裝' }, path: '/roll-on/' },
    ],
  })}

    <section class="section product-main">
      <div class="wrap product-main__inner">
        <div class="product-main__art">
          <div class="gallery" data-gallery>
            <div class="gallery__main">
              <img data-gallery-main src="${ROLLON.photos[0].base}-620.webp"
                   srcset="${ROLLON.photos[0].base}-620.webp 620w, ${ROLLON.photos[0].base}-1240.webp 1240w"
                   sizes="(max-width: 900px) 80vw, 38vw" alt="${attr(t(ROLLON.photos[0].alt))}"
                   width="620" height="620" decoding="async">
            </div>
            <ul class="gallery__thumbs">
              ${ROLLON.photos
                .map(
                  (ph, i) => `<li><button type="button" class="gallery__thumb" data-gallery-thumb
                data-src="${ph.base}-620.webp"
                data-srcset="${ph.base}-620.webp 620w, ${ph.base}-1240.webp 1240w"
                data-alt="${attr(t(ph.alt))}" aria-current="${i === 0 ? 'true' : 'false'}">
                <img src="${ph.base}-620.webp" alt="${attr(t(ph.alt))}" width="620" height="620" loading="lazy" decoding="async">
              </button></li>`
                )
                .join('\n              ')}
            </ul>
          </div>
        </div>
        <div class="product-main__body">
          <dl class="spec">
            <div class="spec__row"><dt>${t({ en: 'Size', zh: '容量' })}</dt><dd>${t(
              ROLLON.size
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Price', zh: '售價' })}</dt><dd>${
              ROLLON.priceLabel
            }</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Feel', zh: '膚感' })}</dt><dd>${t({
              en: 'Cooler and sharper than the cream gel — menthol on top of the eucalyptus.',
              zh: '比啫喱膏更清涼、更鮮明——在尤加利之上加入薄荷腦。',
            })}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'How to use', zh: '使用方法' })}</dt><dd>${t(
              ROLLON.use
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Made in', zh: '生產地' })}</dt><dd>${t(
              ROLLON.gmp
            )}</dd></div>
          </dl>
          <div class="buy__actions">
            ${cta('/shop/', { en: 'Shop now', zh: '立即選購' })}
            ${cta('/stockists/', { en: 'Where to buy', zh: '購買地點' }, 'btn--ghost')}
          </div>
          ${blk(
            'p',
            {
              en: 'Order here with free Hong Kong delivery from HK$250, or pick it up at Watsons and Mannings.',
              zh: '可於本網站訂購，滿 HK$250 免香港運費；亦可於屈臣氏及萬寧門市選購。',
            },
            'product-main__note'
          )}
        </div>
      </div>
    </section>

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Which one', zh: '如何選擇' },
  heading: { en: 'Roll-on or cream gel?', zh: '走珠裝還是啫喱膏？' },
  lede: {
    en: 'Two different jobs, two different formulas. Most people end up with one of each.',
    zh: '兩種用途，兩種配方。大部分人最後兩款都會有一支。',
  },
})}
        <div class="grid grid--2">
          ${[
            {
              h: { en: 'The roll-on, for speed', zh: '走珠裝：講求快' },
              p: {
                en: 'Courtside, in the changing room, at your desk. It goes on without getting anything on your hands, and the menthol makes the cooling obvious straight away. Best on calves, forearms, neck and shoulders.',
                zh: '場邊、更衣室、辦公桌前皆宜。塗抹時不會沾手，薄荷腦令清涼感即時明顯。最適合小腿、前臂、頸部與肩膊。',
              },
            },
            {
              h: { en: 'The 100ml gel, for the massage', zh: '100 毫升啫喱膏：講求按摩' },
              p: {
                en: 'When you have ten minutes and want to work an area properly, the cream gel gives your hands enough glide for a real massage — and it is the simpler formula, without menthol or colourants.',
                zh: '當你有十分鐘、想認真處理某個部位時，啫喱膏能為雙手提供足夠滑度，完成真正的按摩——而且配方更簡單，不含薄荷腦與色素。',
              },
            },
          ]
            .map(
              (c) => `<article class="reveal">
            ${blk('h3', c.h)}
            ${blk('p', c.p)}
          </article>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section band band--wash reveal">
      <div class="wrap prose">
        ${blk('h2', { en: 'Everything in it', zh: '完整成分' })}
        ${blk('p', {
          en: 'The full INCI list, exactly as it appears on the bottle. Note that this formula is not the same as the 100ml cream gel: it adds menthol for the cooling, a preservative and colourants.',
          zh: '以下為瓶身上的完整 INCI 成分表。請留意，此配方與 100 毫升啫喱膏並不相同：它額外加入薄荷腦帶來清涼感，以及防腐劑與色素。',
        })}
        <p class="inci">${ROLLON.inci}</p>
      </div>
    </section>

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Before you use it', zh: '使用前請留意' },
  heading: { en: 'Read this first', zh: '請先閱讀' },
})}
        <ul class="capsule-cautions">
          ${ROLLON.cautions.map((c) => `<li>${t(c)}</li>`).join('\n          ')}
        </ul>
      </div>
    </section>

${buyStrip()}

${newsletter()}`;

  return {
    title: { en: 'Soothing Cream Gel Roll-On', zh: '舒緩啫喱膏走珠裝' },
    description: {
      en: 'VITAS Soothing Cream Gel Roll-On: grape seed, niaouli and eucalyptus with menthol. Two 50ml roll-ons, HK$320, made in France to EEC GMP standard.',
      zh: 'VITAS 舒緩啫喱膏走珠裝：葡萄籽、綠花白千層與尤加利，加入薄荷腦。兩支 50 毫升，HK$320，法國製造，按 EEC GMP 標準生產。',
    },
    path: '/roll-on/',
    active: '/roll-on/',
    body,
    jsonLd: [rollOnJsonLd()],
  };
}

export function ingredients() {
  const body = `${pageHero({
    eyebrow: { en: 'Ingredients', zh: '成分' },
    title: { en: 'Three plants, and why each one is there', zh: '三種植物，各有其理由' },
    lede: {
      en: 'Every ingredient in this cream has a job you can feel. None of them has been asked to do anything a plant oil cannot do. Each has its own page.',
      zh: '三種植物，各有所司。這支啫喱膏中的每一種成分，都帶來你切身感受得到的功效；我們從不強求植物油去承擔它做不到的事。想了解更多？每一種成分，都有它的專屬頁面。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' }],
  })}

    <section class="section">
      <div class="wrap">
        <div class="grid grid--3">
          ${PLANTS.map((p) => plantCard(p)).join('\n          ')}
        </div>
        ${blk(
          'p',
          {
            en: 'Grape seed carries the oils and lets your hands keep moving. Niaouli softens the eucalyptus so it smells like a plant, not a pharmacy. Eucalyptus brings the cooling. Together: no steroids, no camphor, no methyl salicylate — just the ritual.',
            zh: '葡萄籽承載精油，讓雙手保持順暢；綠花白千層柔化尤加利的氣味，讓它聞起來像植物，而非藥房；尤加利帶來清涼。三者合一：不含類固醇、不含樟腦、不含水楊酸甲酯——只有屬於你的保養流程。',
          },
          'plants__why'
        )}
      </div>
    </section>

${freeFromBand()}

    <section class="section reveal">
      <div class="wrap prose">
        ${blk('h2', { en: 'On "natural"', zh: '關於「天然」' })}
        ${blk('p', {
          en: '"Natural" is not a regulated word and it is not, by itself, a benefit — poison ivy is natural. What we mean by it is narrower and checkable: the active character of this cream comes from three plant extracts rather than from methyl salicylate or camphor, the formula is made in France — produced with EEC GMP standard, and the full INCI list is printed on the carton rather than hidden behind a marketing word.',
          zh: '「天然」並非受規管的字眼，本身也不等於好處——毒藤同樣天然。我們所指的意思更狹窄、也可以查證：這支啫喱膏的感受來自三種植物萃取，而非水楊酸甲酯或樟腦；配方法國製造，按 EEC GMP 標準生產；完整 INCI 成分表印在外盒上，而不是躲在一個營銷字眼背後。',
        })}
        ${blk('h2', { en: 'Sourcing and manufacture', zh: '來源與生產' })}
        ${blk('p', {
          en: 'The cream is produced by a contract manufacturer in France producing with EEC GMP standard for cosmetics, and shipped to Hong Kong in finished retail packs. Batch numbers and expiry dates are printed on the crimp of each tube; if you ever want the documentation behind a specific batch, write to us and we will send it.',
          zh: '產品由法國一間按 EEC GMP 標準生產的代工廠製造，以零售包裝形式運抵香港。每支軟管末端摺口均印有批號及有效期；如需查閱某一批次的相關文件，歡迎來信索取。',
        })}
      </div>
    </section>

${buyStrip()}`;

  return {
    title: { en: 'Ingredients', zh: '成分' },
    description: {
      en: 'Eucalyptus globulus, Vitis vinifera grape seed and Melaleuca viridiflora niaouli — the three plants in VITAS Soothing Cream Gel, and what each one actually does.',
      zh: '尤加利、葡萄籽與綠花白千層——VITAS 舒緩啫喱膏中的三種植物，以及它們各自的實際作用。',
    },
    path: '/ingredients/',
    active: '/ingredients/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' }])],
  };
}

/** One page per plant, each on its own URL. */
export function ingredient(p) {
  const others = PLANTS.filter((x) => x.id !== p.id);
  const path = `/ingredients/${p.id}/`;

  const body = `${pageHero({
    eyebrow: p.role,
    title: { en: p.nameEn, zh: p.nameZh },
    lede: p.short,
    trail: [
      HOME_CRUMB,
      { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' },
      { name: { en: p.nameEn, zh: p.nameZh }, path },
    ],
  })}

    <section class="section">
      <div class="wrap plant">
        ${figure(p.art, { en: p.nameEn, zh: p.nameZh }, 'tint', { w: 1000, h: 1000 })}
        <div class="plant__body">
          <p class="plant__latin">${p.latin}</p>
          ${blk('p', p.long, 'plant__text')}
        </div>
      </div>
    </section>

    <section class="section reveal">
      <div class="wrap grid grid--3">
        ${p.facts
          .map(
            (f) => `<div class="fact">
          ${blk('h2', f.h, 'fact__title')}
          ${blk('p', f.p, 'fact__text')}
        </div>`
          )
          .join('\n        ')}
      </div>
    </section>

${freeFromBand()}

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'The other two', zh: '另外兩種' },
  heading: { en: 'What else is in the tube', zh: '軟管裡還有甚麼' },
})}
        <div class="grid grid--2">
          ${others.map((o) => plantCard(o)).join('\n          ')}
        </div>
      </div>
    </section>

${buyStrip()}`;

  return {
    title: { en: `${p.nameEn} — ingredient`, zh: `${p.nameZh}——成分` },
    description: {
      en: `${p.nameEn} (${p.latin}) in VITAS Soothing Cream Gel: what it contributes, what it feels like, and what we do not claim for it.`,
      zh: `VITAS 舒緩啫喱膏中的${p.nameZh}（${p.latin}）：它的作用、實際感受，以及我們不會宣稱的事。`,
    },
    path,
    active: '/ingredients/',
    body,
    jsonLd: [
      breadcrumb([
        HOME_CRUMB,
        { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' },
        { name: { en: p.nameEn, zh: p.nameZh }, path },
      ]),
    ],
  };
}

export function stockists() {
  const body = `${pageHero({
    eyebrow: { en: 'Where to buy', zh: '購買地點' },
    title: { en: 'On the shelf, and online', zh: '門市與網店' },
    lede: {
      en: 'VITAS Soothing Cream Gel 100ml, HK$250. Sold through Hong Kong pharmacy chains and a small number of online stores.',
      zh: 'VITAS 舒緩啫喱膏 100毫升，HK$250。於香港連鎖藥房及少數網店發售。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Where to Buy', zh: '購買地點' }, path: '/stockists/' }],
  })}

    <section class="section stockists">
      <div class="wrap">
        <div class="grid grid--2">
          ${STOCKISTS.map(
            (s) => `<div class="stockist reveal${s.featured ? ' stockist--featured' : ''}">
            <span class="stockist__name">${s.name}</span>
            <span class="stockist__kind">${t(s.kind)}</span>
            <span class="stockist__note">${t(s.note)}</span>
          </div>`
          ).join('\n          ')}
        </div>
        ${blk(
          'p',
          {
            en: 'Buying elsewhere? Check the tube for a batch number and expiry date on the crimp — we cannot vouch for storage conditions outside our own supply chain.',
            zh: '在其他渠道購買？請檢查軟管末端摺口是否印有批號及有效期——我們無法保證供應鏈以外的儲存狀況。',
          },
          'note'
        )}
      </div>
    </section>

    <section class="band band--brand reveal">
      <div class="wrap band__inner band__inner--stack">
        ${blk('p', { en: 'Trade', zh: '批發' }, 'eyebrow eyebrow--light')}
        ${blk('h2', { en: 'Stocking VITAS', zh: '成為銷售點' }, 'band__title')}
        ${blk(
          'p',
          {
            en: 'Gyms, physiotherapy clinics, climbing walls and running stores: we work with a small number of trade partners in Hong Kong. Tell us about your space and we will send terms.',
            zh: '健身室、物理治療診所、攀石場及跑步用品店：我們與香港少數合作夥伴供貨。請告訴我們你的場地資料，我們會提供條款。',
          },
          'band__lede'
        )}
        ${cta('/contact/', { en: 'Trade enquiries', zh: '批發查詢' }, 'btn--light')}
      </div>
    </section>`;

  return {
    title: { en: 'Where to buy', zh: '購買地點' },
    description: {
      en: 'Buy VITAS Soothing Cream Gel 100ml (HK$250) at Watsons and Mannings across Hong Kong, or online through Gogo Herbs and HK Medical Store.',
      zh: '於全港屈臣氏及萬寧選購 VITAS 舒緩啫喱膏 100毫升（HK$250），或經 Gogo Herbs 及網上藥房購買。',
    },
    path: '/stockists/',
    active: '/stockists/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Where to buy', zh: '購買地點' }, path: '/stockists/' }])],
  };
}

export function sportsIndex() {
  const body = `${pageHero({
    eyebrow: { en: 'Your sport', zh: '你的運動' },
    title: { en: 'Three sports, three routines', zh: '三種運動，三套用法' },
    lede: {
      en: 'Hyrox, padel and running load the body differently — so the two minutes before and the ten minutes after look different too. Pick yours.',
      zh: 'Hyrox、板式網球與跑步對身體的負荷各異，賽前兩分鐘與賽後十分鐘的做法也不同。選擇你的運動。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Your Sport', zh: '你的運動' }, path: '/for/' }],
  })}

    <section class="section">
      <div class="wrap">
        <div class="grid grid--3">
          ${SPORTS.map(sportCard).join('\n          ')}
        </div>
        ${sensoryNote('note')}
      </div>
    </section>

${buyStrip()}`;

  return {
    title: { en: 'Your sport', zh: '你的運動' },
    description: {
      en: 'VITAS routines for Hyrox athletes, padel players and running clubs in Hong Kong — what to do in the two minutes before and the ten minutes after.',
      zh: 'VITAS 為 Hyrox 選手、板式網球員及香港跑團而設的用法——賽前兩分鐘與賽後十分鐘該做甚麼。',
    },
    path: '/for/',
    active: '/for/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Your sport', zh: '你的運動' }, path: '/for/' }])],
  };
}

export function sport(sp) {
  const path = `/for/${sp.id}/`;
  const others = SPORTS.filter((x) => x.id !== sp.id);

  const body = `${pageHero({
    eyebrow: sp.who,
    title: sp.hook,
    lede: sp.lede,
    trail: [
      HOME_CRUMB,
      { name: { en: 'How to Use', zh: '使用方法' }, path: '/how-to-use/' },
      { name: sp.name, path },
    ],
  })}

    <section class="section">
      <div class="wrap sport-hero">
        ${figure(sportArt(sp).src, sp.name, 'tint', { w: sportArt(sp).w, h: sportArt(sp).h })}
        <div class="sport-hero__body">
${sloganBlock('sport-hero__slogan')}
          ${sensoryNote('sensory-note')}
          <div class="hero__actions">
            ${cta('/shop/', { en: 'Shop performance', zh: '選購' })}
            ${cta('/how-to-use/', { en: 'How to use it', zh: '使用方法' }, 'btn--ghost')}
          </div>
        </div>
      </div>
    </section>

    <section class="section moments reveal">
      <div class="wrap moments__inner">
        <article class="moment moment--warm">
          <span class="moment__tag">${t({ en: 'Before · Activate', zh: '賽前 · 激活' })}</span>
          ${blk('h2', { en: 'Warm up', zh: '熱身' }, 'moment__title')}
          ${blk('p', sp.before, 'moment__text')}
          ${blk('p', { en: 'Make it a regular habit before every session.', zh: '把它變成每次訓練前的固定習慣。' }, 'moment__text')}
        </article>
        <article class="moment moment--cool">
          <span class="moment__tag">${t({ en: 'After · Accelerate', zh: '賽後 · 加速' })}</span>
          ${blk('h2', { en: 'Cool down', zh: '放鬆' }, 'moment__title')}
          ${blk('p', sp.after, 'moment__text')}
        </article>
      </div>
    </section>

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Other sports', zh: '其他運動' },
  heading: { en: 'Built into the session, not the medicine cabinet', zh: '屬於訓練的夥伴，而不是在藥箱裡的備品。' },
  lede: {
    en: 'The routine changes with the sport. Hyrox, padel, run club — three examples of how people actually train in Hong Kong. Your sport? Same ritual.',
    zh: '不同的運動，用法自然也不同。以下三種情境，是專為香港人的真實訓練節奏所寫。你的運動呢？同一套流程，一樣適用。',
  },
})}
        <div class="grid grid--2">
          ${others.map(sportCard).join('\n          ')}
        </div>
      </div>
    </section>

${buyStrip()}`;

  return {
    title: { en: `VITAS for ${sp.name.en}`, zh: `VITAS × ${sp.name.zh}` },
    description: {
      en: `${sp.hook.en} How Hong Kong ${sp.name.en.toLowerCase()} athletes use VITAS before and after a session.`,
      zh: `${sp.hook.zh} 香港${sp.name.zh}運動者在訓練前後如何使用 VITAS。`,
    },
    path,
    active: '/how-to-use/',
    body,
    jsonLd: [
      breadcrumb([
        HOME_CRUMB,
        { name: { en: 'How to use', zh: '使用方法' }, path: '/how-to-use/' },
        { name: sp.name, path },
      ]),
    ],
  };
}

/* ------------------------------------------------------------ shop & cart */

export function shop() {
  const body = `${pageHero({
    eyebrow: { en: 'Shop', zh: '網上商店' },
    title: { en: 'Two ways to buy it', zh: '兩種購買方式' },
    lede: {
      en: 'One tube, or two at a better price. Delivered anywhere in Hong Kong, free from HK$250. Card, Apple Pay and Google Pay, handled by Stripe.',
      zh: '一支，或以更好的價錢買兩支。全港送遞，滿 HK$250 免運費。支援信用卡、Apple Pay 及 Google Pay，由 Stripe 處理付款。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Shop', zh: '網上商店' }, path: '/shop/' }],
  })}

    <section class="section shop">
      <div class="wrap">
        <div class="shop__grid">
          ${PRODUCTS.map(shopCard).join('\n          ')}
        </div>
        <div class="shop__assurances">
          ${[
            {
              h: { en: 'Free local delivery from HK$250', zh: '滿 HK$250 免本地運費' },
              p: { en: 'Otherwise HK$30. Usually 2–4 working days.', zh: '否則 HK$30，一般 2–4 個工作天送達。' },
            },
            {
              h: { en: 'Secure checkout', zh: '安全結帳' },
              p: {
                en: 'Payment is handled by Stripe. We never see your card details.',
                zh: '付款由 Stripe 處理，我們不會接觸你的卡片資料。',
              },
            },
            {
              h: { en: '14-day returns', zh: '14 天退貨' },
              p: {
                en: 'Unopened tubes, returned within 14 days, refunded in full.',
                zh: '未開封產品可於 14 天內退回並全額退款。',
              },
            },
          ]
            .map(
              (a) => `<div class="assurance">
            ${blk('h3', a.h, 'assurance__title')}
            ${blk('p', a.p, 'assurance__text')}
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

${freeFromBand()}

    <section class="section reveal">
      <div class="wrap prose">
        ${blk('h2', { en: 'Prefer to buy in person?', zh: '想親自選購？' })}
        ${blk('p', {
          en: 'The same tube is on the shelf at Watsons and Mannings across Hong Kong, at the same price. We would rather you bought it wherever is easiest.',
          zh: '同一支產品，以同一價錢於全港屈臣氏及萬寧有售。哪裡方便，就在哪裡買。',
        })}
        <p>${arrow('/stockists/', { en: 'See all stockists', zh: '查看所有銷售點' })}</p>
      </div>
    </section>`;

  return {
    title: { en: 'Shop', zh: '網上商店' },
    description: {
      en: 'Buy VITAS Soothing Cream Gel online — one 100ml tube at HK$250 or the Recovery Duo at HK$450. Free Hong Kong delivery from HK$250, secure Stripe checkout.',
      zh: '網上選購 VITAS 舒緩啫喱膏——100毫升 HK$250，雙支裝 HK$450。滿 HK$250 免香港運費，Stripe 安全結帳。',
    },
    path: '/shop/',
    active: '/shop/',
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: PRODUCTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: t(p.name),
            image: SITE.url + p.art,
            offers: {
              '@type': 'Offer',
              price: (p.price / 100).toFixed(2),
              priceCurrency: 'HKD',
              availability: 'https://schema.org/InStock',
              url: SITE.url + url('/shop/'),
            },
          },
        })),
      },
      breadcrumb([HOME_CRUMB, { name: { en: 'Shop', zh: '網上商店' }, path: '/shop/' }]),
    ],
  };
}

export function cart() {
  const body = `${pageHero({
    eyebrow: { en: 'Cart', zh: '購物車' },
    title: { en: 'Your cart', zh: '你的購物車' },
    trail: [HOME_CRUMB, { name: { en: 'Cart', zh: '購物車' }, path: '/cart/' }],
  })}

    <section class="section">
      <div class="wrap cart">
        <div class="cart__items" data-cart-items>
          <p class="cart__empty" data-cart-empty>
            ${t({ en: 'Your cart is empty.', zh: '購物車是空的。' })}
            <a href="${url('/shop/')}">${t({ en: 'Go to the shop', zh: '前往商店' })}</a>
          </p>
        </div>
        <aside class="cart__summary" data-cart-summary>
          ${blk('h2', { en: 'Summary', zh: '訂單摘要' }, 'cart__summary-title')}
          <dl class="cart__totals">
            <div class="cart__row"><dt>${t({ en: 'Subtotal', zh: '小計' })}</dt><dd data-cart-subtotal>HK$0</dd></div>
            <div class="cart__row" data-cart-discount-row hidden><dt>${t({
              en: 'Welcome offer',
              zh: '迎新優惠',
            })}</dt><dd data-cart-discount>−HK$50</dd></div>
            <div class="cart__row"><dt>${t({ en: 'Delivery', zh: '運費' })}</dt><dd data-cart-shipping>—</dd></div>
            <div class="cart__row cart__row--total"><dt>${t({ en: 'Total', zh: '總計' })}</dt><dd data-cart-total>HK$0</dd></div>
          </dl>

          <div class="cart__promo">
            <label for="promo">${t({ en: 'Discount code', zh: '優惠碼' })}</label>
            <div class="cart__promo-row">
              <input id="promo" type="text" data-promo-input placeholder="WELCOME50" autocomplete="off">
              <button class="btn btn--ghost btn--sm" type="button" data-promo-apply>${t({
                en: 'Apply',
                zh: '套用',
              })}</button>
            </div>
            <p class="cart__promo-note" data-promo-note hidden></p>
          </div>

          <button class="btn btn--full" type="button" data-checkout disabled>
            ${t({ en: 'Checkout', zh: '前往結帳' })}
          </button>
          <p class="cart__note" data-checkout-note hidden></p>
          ${blk(
            'p',
            {
              en: 'Payment is handled by Stripe — card, Apple Pay and Google Pay. You will be taken to Stripe to pay and returned here afterwards.',
              zh: '付款由 Stripe 處理，支援信用卡、Apple Pay 及 Google Pay。你會被帶到 Stripe 完成付款，然後返回本網站。',
            },
            'cart__small'
          )}
          <a class="pay-alt" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">
            <span class="pay-alt__marks">
              <span class="pay-alt__payme">PayMe</span>
              <svg class="pay-alt__wa" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="currentColor"><path d="${WA_ICON_PATH}"/></svg>
            </span>
            <span class="pay-alt__body">
              ${blk('span', { en: 'Prefer PayMe or FPS?', zh: '想用 PayMe 或轉數快？' }, 'pay-alt__title')}
              ${blk(
                'span',
                {
                  en: 'Message us on WhatsApp and we will send you a payment request.',
                  zh: '請 WhatsApp 我們，我們會向你發出付款要求。',
                },
                'pay-alt__text'
              )}
            </span>
          </a>
        </aside>
      </div>
    </section>`;

  return {
    title: { en: 'Cart', zh: '購物車' },
    description: {
      en: 'Your VITAS cart. Secure checkout by Stripe, free Hong Kong delivery from HK$250.',
      zh: '你的 VITAS 購物車。Stripe 安全結帳，滿 HK$250 免香港運費。',
    },
    path: '/cart/',
    body,
    bodyClass: 'page-cart',
  };
}

export function checkoutResult(kind) {
  const ok = kind === 'success';
  const path = ok ? '/checkout/success/' : '/checkout/cancelled/';

  const body = `${pageHero({
    eyebrow: ok ? { en: 'Order received', zh: '已收到訂單' } : { en: 'Checkout', zh: '結帳' },
    title: ok
      ? { en: 'Thank you — your order is in', zh: '多謝你——訂單已確認' }
      : { en: 'Your cart is still here', zh: '你的購物車仍然保留' },
    lede: ok
      ? {
          en: 'A confirmation email is on its way. Local orders usually arrive within 2–4 working days; we will email tracking as soon as it ships.',
          zh: '確認電郵將於稍後寄出。本地訂單一般 2–4 個工作天送達，發貨後我們會以電郵提供追蹤資料。',
        }
      : {
          en: 'Nothing was charged, and nothing was lost. Pick up where you left off whenever you are ready.',
          zh: '沒有任何扣款，購物車內容亦已保留。你可以隨時繼續。',
        },
    trail: [HOME_CRUMB, { name: ok ? { en: 'Order received', zh: '已收到訂單' } : { en: 'Checkout', zh: '結帳' }, path }],
  })}

    <section class="section">
      <div class="wrap prose">
        ${
          ok
            ? blk('p', {
                en: 'While you wait: the two minutes before training matter more than the ten minutes after. Read the routines so the first tube actually gets used.',
                zh: '等待期間：訓練前的兩分鐘，其實比訓練後的十分鐘更重要。看看使用方法，讓第一支產品真正被用起來。',
              }) +
              `<p>${arrow('/how-to-use/', { en: 'Read the routines', zh: '閱讀使用方法' })}</p>` +
              blk(
                'p',
                {
                  en: `Questions about your order? Email ${SITE.email} and a person will answer.`,
                  zh: `對訂單有疑問？請電郵 ${SITE.email}，會有真人回覆。`,
                },
                'note'
              )
            : blk('p', {
                en: 'If something went wrong at checkout — a card declined, a code that would not apply — tell us and we will sort it out. If you would rather pay by PayMe or FPS, message us on WhatsApp and we will send you a payment request.',
                zh: '如結帳時遇到問題——卡片被拒、優惠碼無法套用——請告訴我們，我們會處理。如想使用 PayMe 或轉數快付款，請 WhatsApp 我們，我們會向你發出付款要求。',
              }) +
              `<p>${arrow('/cart/', { en: 'Back to the cart', zh: '返回購物車' })}</p>` +
              `<p>${arrow('/contact/', { en: 'Contact us', zh: '聯絡我們' })}</p>`
        }
      </div>
    </section>`;

  return {
    title: ok ? { en: 'Order received', zh: '已收到訂單' } : { en: 'Checkout cancelled', zh: '結帳已取消' },
    description: ok
      ? { en: 'Thank you for your VITAS order.', zh: '多謝你的 VITAS 訂單。' }
      : { en: 'Checkout cancelled. Your cart is still here.', zh: '結帳已取消，購物車內容已保留。' },
    path,
    body,
    bodyClass: ok ? 'page-checkout page-checkout--success' : 'page-checkout',
  };
}

/* ------------------------------------------------------------------ about */

export function about() {
  const body = `${pageHero({
    eyebrow: { en: 'About VITAS', zh: '關於 VITAS' },
    title: { en: 'Made in France. Made for how Hong Kong trains.', zh: '法國製造，為香港人的訓練而生。' },
    lede: {
      en: 'Why VITAS exists, where it is made, and what changed when we stopped saying things we could not prove.',
      zh: 'VITAS 存在的意義、誕生的起點，真正改變的一切。',
    },
    trail: [HOME_CRUMB, { name: { en: 'About VITAS', zh: '關於 VITAS' }, path: '/about/' }],
  })}

    <section class="section">
      <div class="wrap prose">
        ${ABOUT.chapters
          .map((c) => `${blk('h2', c.h)}\n        ${c.p.map((para) => blk('p', para)).join('\n        ')}`)
          .join('\n        ')}
      </div>
    </section>

    <section class="section founder reveal">
      <div class="wrap founder__inner">
        ${figure('/assets/img/founder-rosana-620.webp', { en: 'Rosana Li, founder', zh: '創辦人 Rosana Li' }, 'tint', {
          w: 620,
          h: 620,
        })}
        <div class="founder__body">
          ${blk('p', { en: 'The founder', zh: '創辦人' }, 'eyebrow')}
          ${blk('h2', ABOUT.founderNote.h, 'founder__title')}
          ${ABOUT.founderNote.p.map((para) => blk('p', para, 'founder__text')).join('\n          ')}
          <p class="founder__sign">${t(ABOUT.founder)}</p>
        </div>
      </div>
    </section>

${buyStrip()}`;

  return {
    title: { en: 'About VITAS', zh: '關於 VITAS' },
    description: {
      en: 'The story behind VITAS 紓適寧: why it was created in Hong Kong, why the cream is made in France, and a note from founder Rosana Li.',
      zh: 'VITAS 紓適寧的故事：為何在香港創立、為何於法國生產，以及創辦人 Rosana Li 的話。',
    },
    path: '/about/',
    active: '/about/',
    body,
    jsonLd: [
      breadcrumb([HOME_CRUMB, { name: { en: 'About VITAS', zh: '關於 VITAS' }, path: '/about/' }]),
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: t({ en: 'About VITAS', zh: '關於 VITAS' }),
        inLanguage: getLang() === 'zh' ? 'zh-Hant-HK' : 'en-HK',
        mainEntity: {
          '@type': 'Organization',
          name: 'VITAS 紓適寧',
          founder: { '@type': 'Person', name: 'Rosana Li' },
          url: SITE.url,
        },
      },
    ],
  };
}

export function faq() {
  const body = `${pageHero({
    eyebrow: { en: 'FAQ', zh: '常見問題' },
    title: { en: 'Questions people actually ask', zh: '大家真正會問的問題' },
    trail: [HOME_CRUMB, { name: { en: 'FAQ', zh: '常見問題' }, path: '/faq/' }],
  })}

    <section class="section">
      <div class="wrap wrap--narrow">
        <div class="accordion" data-accordion>
          ${FAQS.map(
            (f, i) => `<div class="acc reveal">
            <button class="acc__q" type="button" aria-expanded="false" aria-controls="acc-${i}">
              ${blk('span', f.q, 'acc__label')}
              <span class="acc__icon" aria-hidden="true"></span>
            </button>
            <div class="acc__a" id="acc-${i}" hidden>
              ${(Array.isArray(f.a) ? f.a : [f.a]).map((a) => blk('p', a)).join('\n              ')}
            </div>
          </div>`
          ).join('\n          ')}
        </div>
        ${blk(
          'p',
          {
            en: 'Something not answered here? Write to us — we answer email ourselves.',
            zh: '找不到答案？歡迎來信，我們會親自回覆。',
          },
          'note'
        )}
        <p class="note">${arrow('/contact/', { en: 'Contact us', zh: '聯絡我們' })}</p>
      </div>
    </section>`;

  return {
    title: { en: 'FAQ', zh: '常見問題' },
    description: {
      en: 'Does it smell? Is it hot or cold? Can I use it before exercise? Straight answers about VITAS Soothing Cream Gel.',
      zh: '有氣味嗎？是熱還是涼？運動前可以用嗎？關於 VITAS 舒緩啫喱膏的直接答案。',
    },
    path: '/faq/',
    active: '/faq/',
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: getLang() === 'zh' ? 'zh-Hant-HK' : 'en-HK',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: t(f.q),
          acceptedAnswer: {
            '@type': 'Answer',
            text: (Array.isArray(f.a) ? f.a : [f.a]).map((a) => t(a)).join(' '),
          },
        })),
      },
      breadcrumb([HOME_CRUMB, { name: { en: 'FAQ', zh: '常見問題' }, path: '/faq/' }]),
    ],
  };
}

export function contact() {
  const body = `${pageHero({
    eyebrow: { en: 'Contact', zh: '聯絡我們' },
    title: { en: 'Talk to a person', zh: '與真人對話' },
    lede: {
      en: 'Product questions, trade enquiries, or anything else.',
      zh: '產品查詢、批發合作，或其他任何事宜。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Contact', zh: '聯絡我們' }, path: '/contact/' }],
  })}

    <section class="section">
      <div class="wrap contact__inner">
        <form class="contact__form" data-contact data-wa="${SITE.whatsapp}" data-wa-title="${attr(
          t({ en: 'Enquiry to VITAS', zh: 'VITAS 查詢' })
        )}" novalidate>
          <div class="field">
            <label for="name">${t({ en: 'Name', zh: '稱呼' })}</label>
            <input id="name" name="name" type="text" required autocomplete="name">
          </div>
          <div class="field">
            <label for="cemail">${t({ en: 'Email', zh: '電郵' })}</label>
            <input id="cemail" name="email" type="email" required autocomplete="email">
          </div>
          <div class="field">
            <label for="topic">${t({ en: 'Topic', zh: '主題' })}</label>
            <select id="topic" name="topic">
              <option value="product">${t({ en: 'Product question', zh: '產品查詢' })}</option>
              <option value="trade">${t({ en: 'Trade / stocking', zh: '批發／銷售點' })}</option>
              <option value="other">${t({ en: 'Something else', zh: '其他' })}</option>
            </select>
          </div>
          <div class="field">
            <label for="message">${t({ en: 'Message', zh: '訊息' })}</label>
            <textarea id="message" name="message" rows="6" required></textarea>
          </div>
          <button class="btn btn--wa" type="submit">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="${WA_ICON_PATH}"/></svg>
            ${t({ en: 'Send via WhatsApp', zh: '透過 WhatsApp 傳送' })}
          </button>
          ${blk(
            'p',
            {
              en: 'This opens WhatsApp with your message ready — just tap send.',
              zh: '按下後會開啟 WhatsApp 並預先填好訊息，你只需按「傳送」。',
            },
            'contact__hint'
          )}
          <p class="signup__note" data-contact-note hidden></p>
        </form>
        <aside class="contact__aside">
          ${blk('h2', { en: 'Direct', zh: '直接聯絡' }, 'contact__h')}
          <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
          <p><a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp — ${SITE.whatsappDisplay}</a></p>
          ${blk('h2', { en: 'Watch', zh: '影片' }, 'contact__h')}
          <p><a href="${SITE.youtube}" target="_blank" rel="noopener">YouTube — @VITASHK</a></p>
          <p><a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook — VITAS 紓適寧</a></p>
          ${blk('h2', { en: 'Instagram', zh: 'Instagram' }, 'contact__h')}
          <p><a href="${SITE.instagram}" target="_blank" rel="noopener">@vitashongkong</a></p>
          ${blk('h2', { en: 'Response time', zh: '回覆時間' }, 'contact__h')}
          ${blk('p', {
            en: 'Two working days, usually less.',
            zh: '通常兩個工作天內回覆。',
          })}
        </aside>
      </div>
    </section>`;

  return {
    title: { en: 'Contact', zh: '聯絡我們' },
    description: {
      en: 'Contact VITAS 紓適寧 — product questions, trade enquiries and press.',
      zh: '聯絡 VITAS 紓適寧——產品查詢、批發合作及傳媒。',
    },
    path: '/contact/',
    active: '/contact/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Contact', zh: '聯絡我們' }, path: '/contact/' }])],
  };
}

export function legal(kind) {
  const isPrivacy = kind === 'privacy';
  const path = isPrivacy ? '/legal/privacy/' : '/legal/terms/';
  const title = isPrivacy ? { en: 'Privacy', zh: '私隱政策' } : { en: 'Terms of use', zh: '使用條款' };

  const body = `${pageHero({
    eyebrow: { en: 'Legal', zh: '條款' },
    title,
    trail: [HOME_CRUMB, { name: title, path }],
  })}
    <section class="section">
      <div class="wrap prose">
        ${
          isPrivacy
            ? blk('p', {
                en: 'This site collects no analytics cookies and runs no third-party trackers. If you submit the contact or newsletter form, the details you type are sent to us and used only to reply to you or to send the newsletter you asked for. Ask us to delete them at any time and we will.',
                zh: '本網站不使用分析 cookie，亦沒有第三方追蹤程式。如你提交聯絡或訂閱表格，所填資料只會用於回覆你，或發送你要求的通訊。你可隨時要求我們刪除相關資料。',
              }) +
              blk('p', {
                en: 'PLACEHOLDER: before launch, replace this page with a Personal Data (Privacy) Ordinance compliant notice reviewed by your legal adviser, covering data classes collected, purpose, transfer, retention and the data access / correction request channel.',
                zh: '（待補：發布前，請由法律顧問審閱並替換為符合《個人資料（私隱）條例》的完整聲明，涵蓋收集的資料類別、用途、轉移、保留期及查閱／更正途徑。）',
              })
            : blk('p', {
                en: 'The information on this site describes a cosmetic massage product. It is general information, not medical advice, and it does not replace an assessment by a doctor or physiotherapist. Product availability, packaging and pricing at third-party retailers are set by those retailers and may differ from what is described here.',
                zh: '本網站資料描述的是一款按摩護理產品，屬一般資訊，並非醫療建議，亦不能取代醫生或物理治療師的評估。第三方零售商的供應情況、包裝及售價由該零售商決定，可能與本網站所述不同。',
              }) +
              blk('p', {
                en: 'PLACEHOLDER: before launch, replace with full terms reviewed by your legal adviser, covering intellectual property, limitation of liability, governing law (Hong Kong SAR) and how disputes are handled.',
                zh: '（待補：發布前，請由法律顧問審閱並替換為完整條款，涵蓋知識產權、責任限制、適用法律（香港特別行政區）及爭議處理方式。）',
              })
        }
      </div>
    </section>`;

  return {
    title,
    description: isPrivacy
      ? { en: 'How VITAS handles the information you send us.', zh: 'VITAS 如何處理你提供的資料。' }
      : { en: 'Terms of use for the VITAS website.', zh: 'VITAS 網站使用條款。' },
    path,
    body,
  };
}

export function notFound() {
  const body = `    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">404</p>
        ${blk('h1', { en: 'That page has moved on', zh: '此頁面不存在' }, 'page-hero__title')}
        ${blk(
          'p',
          {
            en: 'The old VITAS site had a lot of addresses. This one has a few, and they are all in the menu above.',
            zh: '舊版 VITAS 網站有很多網址。新版只有幾個，全部都在上方選單中。',
          },
          'page-hero__lede'
        )}
        <p class="hero__actions">${cta('/', { en: 'Back to the homepage', zh: '返回首頁' })}</p>
      </div>
    </section>`;
  return {
    title: { en: 'Page not found', zh: '找不到頁面' },
    description: { en: 'Page not found.', zh: '找不到頁面。' },
    path: '/404.html',
    body,
  };
}
