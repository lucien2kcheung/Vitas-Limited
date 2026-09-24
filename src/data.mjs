/**
 * Single source of truth for facts that appear in more than one place:
 * the product, the three plants, stockists and FAQs.
 *
 * Claim discipline: everything here is either a verifiable fact (size, price,
 * ingredients, manufacturing) or a sensory/comfort statement. Physiological
 * claims — lymphatic drainage, "flushing lactic acid", detox, whitening,
 * body-shaping, organ or memory benefits — are deliberately absent. See
 * docs/claims-guide.md.
 */


/**
 * Master positioning — Option A, per VITAS Brand Repositioning Proposal v3.0.
 *
 * COMPLIANCE: the slogan is a brand promise, not a medical claim, and the deck
 * requires it to travel with `sensory` sub-copy wherever it appears, plus the
 * `disclaimer` in the footer of every page. Do not use one without the other.
 * Red-light claims (cures, eliminates lactic acid, speeds lymphatic drainage,
 * treats inflammation) are listed in docs/positioning.md and must stay off the
 * site.
 */
export const BRAND = {
  slogan: {
    en: ['Warm up.', 'Wind down.'],
    zh: ['熱身備戰．', '放鬆收操。'],
  },
  triptych: [
    { en: 'Prime', zh: '喚醒' },
    { en: 'Perform', zh: '投入' },
    { en: 'Recover', zh: '收操' },
  ],
  heroLede: {
    en: 'A fast-absorbing, non-greasy cream gel with three plant-based actives, made in France for your pre- and post-training ritual.',
    zh: '蘊含三大植物活性成分的快速吸收凝膠，質地清爽不黏膩。法國製造，完美融入你每一次運動前後的按摩流程。',
  },
  proof: {
    en: 'Grape seed · Niaouli · Eucalyptus · Made in France — produced with EEC GMP standard',
    zh: '葡萄籽 · 綠花白千層 · 尤加利 · 法國製造 — 按 EEC GMP 標準生產',
  },
  // Vague, per brand decision: no hard dates. Confirm a defensible incorporation
  // or first-formulation date before this graduates back into a number.
  trust: {
    en: 'Trusted for over 20 years',
    zh: '逾 20 年信賴',
  },
  sensory: {
    en: 'VITAS provides a warming sensation when massaged into muscles before training, and a cooling sensation afterwards. These sensory experiences are part of your active warm-up and wind-down routine.',
    zh: 'VITAS 於按摩時帶來溫熱觸感（賽前）與清涼觸感（賽後），融入你的熱身與放鬆步驟。',
  },
  // Mandatory safety caution (compliance guide §10). Kept at "under 6" to match
  // the fuller cautions on /how-to-use/ — stricter than the guide's "under 3",
  // which is allowed.
  safety: {
    en: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Not suitable for children under 5, pregnant or breastfeeding women.',
    zh: '僅供外用。避免接觸眼睛。如出現刺激或不適，請停止使用。不適合 5 歲以下兒童、孕婦或哺乳期婦女使用。',
  },
  disclaimer: {
    en: 'Disclaimer: VITAS is a cosmetic product for massage and external use. References to "warm-up", "wind-down", "prime", "perform", "recover", and warming/cooling describe the intended training ritual and sensory experience during massage. They do not represent medical, therapeutic or performance-enhancement claims. This product is not intended to diagnose, treat, cure or prevent any disease.',
    zh: '免責聲明：本產品為供按摩及外用的化妝品。「熱身」、「收操」、「Prime」、「Perform」、「Recover」以及溫熱／清涼等字眼，只用作描述運動流程及按摩時的感官體驗，並不代表任何醫療、治療或提升運動表現的聲稱。本產品並非用作診斷、治療、治癒或預防任何疾病。',
  },
};

/**
 * Sport modules. Each is its own URL so it can be linked from a club, a KOL
 * post or a shelf talker without landing people on a generic homepage.
 */
export const SPORTS = [
  {
    id: 'hyrox',
    art: '/assets/img/sport-hyrox.svg',
    // Drop a 1600x1067 JPEG/WebP at this path to replace the illustration.
    // See assets/img/sport/README.txt for licensing and crop notes.
    photo: '/assets/img/sport/hyrox.webp',
    photoSet: '/assets/img/sport/hyrox-800.webp 800w, /assets/img/sport/hyrox.webp 1600w',
    name: { en: 'Hyrox', zh: 'Hyrox' },
    who: { en: 'For Hyrox athletes', zh: '給 Hyrox 選手' },
    hook: {
      en: 'From burpees to broad jumps — keep your legs feeling light.',
      zh: '從波比跳到立定跳遠，讓雙腿保持輕盈。',
    },
    lede: {
      en: 'Eight workouts, eight kilometres, and a sled that does not care how you feel. The work between stations is where the session is won — and the two minutes before and ten minutes after are the part you control.',
      zh: '八個項目、八公里，還有一台不理會你感受的冷酷無情的雪橇。真正決定表現的，是站與站之間的處理——而賽前兩分鐘和賽後十分鐘，就是你能控制勝負的關鍵部分。',
    },
    before: {
      en: 'Ten minutes before the first station, massage into quads, calves and shoulders. The warming sensation is your cue that the muscle has had attention — then go and do the dynamic warm-up properly.',
      zh: '第一站前十分鐘，按摩股四頭肌、小腿與肩膊。溫熱的觸感在提醒你：這些肌肉已經被妥善照顧——接著，認真完成動態熱身。',
    },
    after: {
      en: 'After the last sled push, shower, then work upward along the legs in long slow strokes. Cooling, non-greasy, absorbed before you put your kit back on.',
      zh: '最後一次推雪橇後先洗澡，再以長而緩慢的手勢沿雙腿向上按摩。讓你感覺清涼而不油膩，在你穿回衣服前，已被迅速吸收。',
    },
  },
  {
    id: 'padel',
    art: '/assets/img/sport-padel.svg',
    // Drop a 1600x1067 JPEG/WebP at this path to replace the illustration.
    // See assets/img/sport/README.txt for licensing and crop notes.
    photo: '/assets/img/sport/padel.webp',
    photoSet: '/assets/img/sport/padel-800.webp 800w, /assets/img/sport/padel.webp 1600w',
    name: { en: 'Padel', zh: '板式網球' },
    who: { en: 'For padel players', zh: '給板式網球員' },
    hook: {
      en: 'Stay quick on your feet through the third set.',
      zh: '到第三盤，腳步依然靈活。',
    },
    lede: {
      en: 'Padel is played in short, explosive bursts — and the bill arrives the next morning in your calves, forearms and lower back. A weekend sport deserves a weekday routine.',
      zh: '板式網球由短促而爆發的動作組成，而代價會在第二天早上出現在小腿、前臂與下背。這類激烈的球類運動，你需要養成一套平日照顧肌肉的好習慣。',
    },
    before: {
      en: 'Before you step on court: calves, forearms and shoulders. Two minutes, both sides, paying attention to whichever one is complaining.',
      zh: '上場前：用兩分鐘，分別用在兩邊小腿、前臂與肩膊，再特別照顧比較不適的一邊。',
    },
    after: {
      en: 'After the match — before the drinks, ideally — a cooling massage through the legs and forearms. It is a small ritual, and it is the one padel players skip most.',
      zh: '賽後——最好在喝東西之前——為雙腿與前臂做一次清涼按摩。這是很小的步驟，也是板式網球員最常略過的一步。',
    },
  },
  {
    id: 'running',
    art: '/assets/img/sport-running.svg',
    // Drop a 1600x1067 JPEG/WebP at this path to replace the illustration.
    // See assets/img/sport/README.txt for licensing and crop notes.
    photo: '/assets/img/sport/running.webp',
    photoSet: '/assets/img/sport/running-800.webp 800w, /assets/img/sport/running.webp 1600w',
    name: { en: 'Running', zh: '跑步' },
    who: { en: 'For running clubs', zh: '給跑團' },
    hook: {
      en: 'For the legs that feel like cement after intervals.',
      zh: '給間歇跑後像水泥一樣的雙腿。',
    },
    lede: {
      en: 'Three to five runs a week, one of them hard. Whether you run Happy Valley loops or the harbourfront, the routine that keeps you consistent is the one that takes two minutes and does not smell.',
      zh: '每週三至五課，其中一課是硬課。無論你跑運動場還是海濱長廊，能讓你持續的就是那個只花兩分鐘、又沒有氣味的習慣。',
    },
    before: {
      en: 'Calves, hamstrings and hip flexors before you start — especially on interval days, and especially on the side that always tightens first.',
      zh: '起跑前先處理小腿、膕繩肌與髖屈肌——這在間歇日尤其重要，特別是那條總是先緊繃的腿。',
    },
    after: {
      en: 'After the cool-down jog: long upward strokes on the calves and quads while your heart rate settles. It travels well in a running belt or a club bag.',
      zh: '緩跑放鬆後，趁著心率回落，用長而向上的手勢按摩小腿與股四頭肌。隨身帶上一支 VITAS，塞在跑步腰包或跑團袋裡都非常方便。',
    },
  },
];

export const PRODUCT = {
  slug: '/product/',
  nameEn: 'Soothing Cream Gel',
  nameZh: '舒緩啫喱膏',
  size: '100ml',
  price: 250,
  currency: 'HKD',
  priceLabel: 'HK$250',
  sku: 'VTS001',
  origin: { en: 'Made in France', zh: '法國製造' },
  gmp: {
    en: 'Made in France, produced to EEC GMP standard.',
    zh: '法國製造，並嚴格遵循 EEC GMP 標準生產。',
  },
  texture: {
    en: 'A light cream-gel that absorbs in under a minute and leaves no shine at all.',
    zh: '清爽的啫喱質地，一分鐘內快速吸收，表面完全不留油光。',
  },
  freeFrom: [
    { en: 'No methyl salicylate', zh: '不含水楊酸甲酯' },
    { en: 'No camphor', zh: '不含樟腦' },
    { en: 'No hormones', zh: '不含激素' },
    { en: 'No steroids', zh: '不含類固醇' },
    { en: 'No parabens', zh: '不含對羥基苯甲酸酯' },
    { en: 'No synthetic dyes', zh: '不含合成色素' },
  ],
};

/**
 * The shop catalogue. Prices are in cents (HKD) because that is what Stripe
 * expects; `priceLabel` is what the site shows.
 *
 * PLACEHOLDER: `duo` is a bundle of the same SKU, not a second product. When a
 * genuine second SKU exists (a travel size, a larger tube), replace it here and
 * the shop page picks it up with no other change.
 */
export const PRODUCTS = [
  {
    id: 'cream-100',
    slug: '/product/',
    art: '/assets/img/product/tube-front-620.webp',
    artW: 620,
    artH: 1500,
    name: { en: 'Soothing Cream Gel', zh: '舒緩啫喱膏' },
    variant: { en: '100ml tube', zh: '100毫升 軟管' },
    price: 25000,
    priceLabel: 'HK$250',
    badge: null,
    blurb: {
      en: 'Grape seed, eucalyptus and niaouli in a light cream gel that absorbs in under a minute and does not smell like a pharmacy.',
      zh: '葡萄籽、尤加利與綠花白千層，輕盈啫喱質地，一分鐘內吸收，沒有藥房氣味。',
    },
    points: [
      { en: 'One to two applications a day', zh: '每日一至兩次' },
      { en: 'Roughly 6 weeks of daily use', zh: '每日使用約可用六星期' },
      { en: 'Made in France — produced with EEC GMP standard', zh: '法國製造 — 按 EEC GMP 標準生產' },
    ],
  },
  {
    id: 'capsule-60',
    slug: '/capsule/',
    art: '/assets/img/product/capsule-set-620.webp',
    artW: 620,
    artH: 620,
    name: { en: 'VITAS Capsule', zh: '淋巴管理膠囊' },
    variant: { en: '60 capsules', zh: '60 粒' },
    price: 29800,
    priceLabel: 'HK$298',
    wasLabel: 'HK$538',
    badge: { en: 'Save HK$240', zh: '慳 HK$240' },
    blurb: {
      en: 'Red grape leaf, bilberry, soy lecithin and garlic in a capsule. A plant-based food supplement, made in France to the same standard as the cream gel.',
      zh: '紅葡萄葉、北歐藍莓、大豆卵磷脂與大蒜，裝入膠囊。植物配方食品補充品，與舒緩啫喱膏同樣在法國按相同標準生產。',
    },
    points: [
      { en: '1 to 3 capsules, twice a day', zh: '每天 2 次，每次 1-3 粒' },
      { en: 'Four plant ingredients, nothing added for effect', zh: '四種植物成分，不額外添加' },
      { en: 'Made in France — produced with EEC GMP standard', zh: '法國製造 — 按 EEC GMP 標準生產' },
    ],
  },
  {
    id: 'rollon-50-duo',
    slug: '/roll-on/',
    art: '/assets/img/product/rollon-set-620.webp',
    artW: 620,
    artH: 620,
    name: { en: 'Soothing Cream Gel Roll-On', zh: '舒緩啫喱膏走珠裝' },
    variant: { en: '2 × 50ml', zh: '2 × 50 毫升' },
    price: 32000,
    priceLabel: 'HK$320',
    badge: { en: 'Two-pack', zh: '孖裝' },
    blurb: {
      en: 'The same three plants in a roll-on, with menthol added for a sharper cool. No hands, no mess — roll it on over the calf or the neck and go.',
      zh: '同樣三種植物，改以走珠形式，另加薄荷腦帶來更明顯的清涼感。不用手、不弄髒——直接滾塗小腿或頸部即可。',
    },
    points: [
      { en: 'Two 50ml roll-ons', zh: '兩支 50 毫升走珠裝' },
      { en: 'With menthol — a sharper cooling feel', zh: '含薄荷腦——清涼感更明顯' },
      { en: 'Made in France — produced with EEC GMP standard', zh: '法國製造 — 按 EEC GMP 標準生產' },
    ],
  },
  {
    id: 'cream-duo',
    slug: '/product/',
    art: '/assets/img/product/tube-duo-700.webp',
    artW: 700,
    artH: 1104,
    name: { en: 'Recovery Duo', zh: '雙支裝' },
    variant: { en: '2 × 100ml tubes', zh: '2 × 100毫升' },
    price: 45000,
    priceLabel: 'HK$450',
    badge: { en: 'Save HK$50', zh: '慳 HK$50' },
    blurb: {
      en: 'Two tubes: one for the gym bag, one for the desk drawer. The routine you can see is the one you keep — and this is how most people get past week three.',
      zh: '兩支裝：一支放運動袋，一支放辦公桌抽屜。看得見的習慣才會持續——大部分人能撐過第三週，靠的就是這個。',
    },
    points: [
      { en: 'Two 100ml tubes', zh: '兩支 100毫升' },
      { en: 'HK$225 each — HK$50 off', zh: '每支 HK$225——減 HK$50' },
      { en: 'Free local delivery', zh: '免費本地送遞' },
    ],
  },
];

export const PURITY = {
  out: [
    { en: 'Methyl salicylate — synthetic, skin irritant', zh: '水楊酸甲酯——合成物，可刺激皮膚' },
    { en: 'Camphor — neurotoxic in high doses', zh: '樟腦——高劑量具神經毒性' },
    { en: 'Synthetic steroids — long-term health risk', zh: '合成類固醇——長期健康風險' },
    { en: 'Artificial fragrance — hidden allergens', zh: '人造香料——隱藏致敏原' },
  ],
  in: [
    { en: 'Grape seed extract — the light, fast carrier', zh: '葡萄籽萃取——輕盈快吸的基底' },
    { en: 'Niaouli oil — the gentle warming note', zh: '綠花白千層油——溫和的暖感' },
    { en: 'Eucalyptus oil — the cooling note', zh: '尤加利油——清涼感' },
    { en: 'Water-based gel — fast absorption, no residue', zh: '水基啫喱——快速吸收，不留殘膜' },
  ],
  marks: [
    { en: 'Clean', zh: '純淨' },
    { en: 'Transparent', zh: '透明' },
    { en: 'Trusted for over 20 years', zh: '逾 20 年信賴' },
  ],
};

export const SHOP = {
  freeShippingOver: 25000,
  currency: 'hkd',
  welcomeCode: 'WELCOME50',
  welcomeValue: 5000,
};

export const PLANTS = [
  {
    id: 'eucalyptus',
    art: '/assets/img/plant-eucalyptus.svg',
    latin: 'Eucalyptus globulus',
    nameEn: 'Eucalyptus',
    nameZh: '尤加利',
    role: { en: 'The cool one', zh: '清涼感' },
    short: {
      en: 'Gives the cream its quiet coolness on the skin — noticeable, never fierce.',
      zh: '為啫喱膏帶來恰到好處的皮膚清涼感——清晰有感，溫和但不刺激。',
    },
    long: {
      en: 'Eucalyptus globulus leaf oil is rich in 1,8-cineole, the compound behind its clean, faintly camphoraceous scent and the cool feeling it leaves behind. In VITAS it is dosed for comfort rather than shock: enough to register as you rub it in, not enough to announce itself to the person sitting next to you.',
      zh: '尤加利葉油富含 1,8-桉葉素，能帶來清新氣息與塗抹後的清涼感。在 VITAS 配方中，它的比例以「舒適」為原則：搓揉時自己感覺得到，氣味不會濃郁到讓身旁的人聞到。',
    },
    facts: [
      {
        h: { en: 'What you feel', zh: '你會感覺到' },
        p: {
          en: 'A cool note that arrives a few seconds after you rub it in and fades over the next few minutes. It is a sensation on the skin, not a change in the temperature of the muscle underneath.',
          zh: '搓揉後數秒內便會浮現清涼感，並在數分鐘內漸漸散去。這純粹是皮膚表面的舒爽感覺，並不會改變下層肌肉的實際溫度。',
        },
      },
      {
        h: { en: 'Why not menthol or camphor', zh: '為何不用薄荷腦或樟腦' },
        p: {
          en: 'Both are stronger, cheaper and carry a medicated smell across a room. Eucalyptus gives a gentler version of the same cool sensation, which is the whole point of a cream you can use at your desk.',
          zh: '兩者確實更強烈、成本也更低，但氣味往往會傳遍整個房間。相比之下，尤加利能提供溫和同類的清涼感——而這，正是打造一款「能在辦公室內隨時使用」的按摩膏的真正意義。',
        },
      },
      {
        h: { en: 'Where it comes from', zh: '來源' },
        p: {
          en: 'Steam-distilled from the leaves of the blue gum tree. In the finished cream it appears on the INCI list as Eucalyptus Globulus Leaf Oil.',
          zh: '以蒸餾法自藍桉樹葉萃取。在成品的 INCI 成分表上，標示為 Eucalyptus Globulus Leaf Oil。',
        },
      },
    ],
  },
  {
    id: 'grape-seed',
    art: '/assets/img/plant-grape.svg',
    latin: 'Vitis vinifera',
    nameEn: 'Grape seed',
    nameZh: '葡萄籽',
    role: { en: 'The carrier', zh: '基底' },
    short: {
      en: 'A light, fast-absorbing oil pressed from wine-grape seeds. It is why the cream slides and then disappears.',
      zh: '由釀酒葡萄籽壓榨而成的輕質油，易推開、吸收快，是不油膩的關鍵。',
    },
    long: {
      en: 'Grape seed oil is one of the lightest cosmetic carrier oils there is — high in linoleic acid, low in tack. It gives your hands enough glide to work a muscle properly, then sinks in fast enough that you can put a shirt back on straight away. It is also, unglamorously, why the cream feels expensive.',
      zh: '葡萄籽油是最輕盈的基底油之一，亞油酸含量高、黏膩感低。它讓雙手有足夠的滑度按摩肌肉還能極速吸收，讓你按摩後無需等待即可俐落著裝——這也是這款啫喱膏膚感如此細緻的關鍵。',
    },
    facts: [
      {
        h: { en: 'What it does here', zh: '它在配方中的角色' },
        p: {
          en: 'Carries the two essential oils and gives your hands glide. Without a good carrier you cannot work a muscle for ten minutes — the cream drags, and you stop after two.',
          zh: '承載兩種精油，並為雙手提供滑度。沒有好的基底油，就無法持續按摩十分鐘——膏體會拉扯皮膚，兩分鐘就會停下來。',
        },
      },
      {
        h: { en: 'Why it does not feel greasy', zh: '為何不油膩' },
        p: {
          en: 'Grape seed oil is high in linoleic acid and light in texture, so it absorbs rather than sitting on the surface. You can dress within a minute of using it.',
          zh: '葡萄籽油亞油酸含量高、質地輕盈，會被吸收而非停留在表面。使用後約一分鐘即可穿衣。',
        },
      },
      {
        h: { en: 'An honest note', zh: '誠實的補充' },
        p: {
          en: 'Grape seed extract is often sold on its antioxidant content. That evidence is for oral and cosmetic-skin use — we make no claim that it does anything for circulation or recovery from the outside.',
          zh: '葡萄籽萃取常以抗氧化作賣點，但相關證據多來自口服或護膚用途。我們不會宣稱它由外用途徑改善循環或恢復。',
        },
      },
    ],
  },
  {
    id: 'niaouli',
    art: '/assets/img/plant-niaouli.svg',
    latin: 'Melaleuca viridiflora',
    nameEn: 'Niaouli',
    nameZh: '綠花白千層',
    role: { en: 'The rounding note', zh: '氣味平衡' },
    short: {
      en: 'A soft green aromatic from the same family as tea tree. It rounds the eucalyptus so the cream smells like a plant, not a pharmacy.',
      zh: '與茶樹同科的溫和芳香植物，巧妙柔化了尤加利的氣味，讓啫喱膏聞起來更像天然植物，而非刺鼻的藥物。',
    },
    long: {
      en: 'Niaouli essential oil sits between eucalyptus and tea tree — fresh, slightly sweet, far less sharp than either. Its job in this formula is aromatic balance. Remove it and the cream smells clinical; with it, the scent fades to almost nothing within a few minutes of application.',
      zh: '綠花白千層精油的氣味介乎尤加利與茶樹之間：清新、微甜，比兩者都柔和。它在配方中的角色是平衡香氣——沒有它，膏體聞起來會很「醫療」；有了它，塗抹數分鐘後氣味幾乎完全散去。',
    },
    facts: [
      {
        h: { en: 'The smallest of the three', zh: '三者中比例最小' },
        p: {
          en: 'Niaouli is present in a small proportion. Its job is the finish of the scent rather than the feel of the cream.',
          zh: '綠花白千層的比例最小，作用在於氣味的收尾，而非膏體的膚感。',
        },
      },
      {
        h: { en: 'Family resemblance', zh: '同科植物' },
        p: {
          en: 'Melaleuca viridiflora is a relative of tea tree and cajeput, native to New Caledonia and northern Australia.',
          zh: '綠花白千層與茶樹、白千層同屬，原產於新喀里多尼亞及澳洲北部。',
        },
      },
      {
        h: { en: 'If you are sensitive', zh: '如你屬敏感肌' },
        p: {
          en: 'Essential oils are the part of any natural formula most likely to irritate sensitive skin. Patch test on the inner forearm before using it over a large area.',
          zh: '在天然配方中，精油是最可能引起敏感的成分。大面積使用前，請先於前臂內側試用。',
        },
      },
    ],
  },
];

export const STOCKISTS = [
  {
    name: 'Watsons 屈臣氏',
    kind: { en: '600+ stores in Hong Kong & Macau', zh: '香港及澳門 600 多間分店' },
    note: {
      en: 'Healthcare aisle, external muscle care. In store and online.',
      zh: '健與美貨架，外用肌肉護理區。門市及網店有售。',
    },
    featured: true,
  },
  {
    name: 'Mannings 萬寧',
    kind: { en: 'Stores across Hong Kong', zh: '全港分店' },
    note: { en: 'In store and online.', zh: '門市及網店有售。' },
    featured: true,
  },
  {
    name: 'Gogo Herbs',
    kind: { en: 'Online health store', zh: '網上健康產品店' },
    note: { en: 'Ships within Hong Kong.', zh: '香港境內配送。' },
  },
  {
    name: 'HK Medical Store',
    kind: { en: 'Online pharmacy', zh: '網上藥房' },
    note: { en: 'Ships within Hong Kong.', zh: '香港境內配送。' },
  },
];

export const FAQS = [
  {
    q: { en: 'Is VITAS a medicine?', zh: 'VITAS 是藥物嗎？' },
    a: {
      en: 'No. VITAS is a cosmetic product for massage and external use. It is not intended to diagnose, treat, cure or prevent any disease.',
      zh: '不是。VITAS 屬於外用按摩保養品，並非用於診斷、治療、治癒或預防任何疾病。',
    },
  },
  {
    q: {
      en: 'How is VITAS different from other soothing products on the market?',
      zh: 'VITAS 紓適寧跟市面上的其他舒緩產品有什麼分別？',
    },
    a: [
      {
        en: 'Many traditional muscle rubs use methyl salicylate, camphor or steroids. These ingredients are legal and widely used — but they are active medicinal substances with known precautions.',
        zh: '不少傳統肌肉按摩膏含有水楊酸甲酯、樟腦或類固醇。這些成分合法，亦被廣泛使用——但它們屬於具藥理活性的物質，使用時有已知的注意事項。',
      },
      {
        en: 'Methyl salicylate (wintergreen oil) is chemically related to aspirin. Medical sources warn that too much absorption — through ingestion, large-area use, broken skin or heat — can cause salicylate toxicity.',
        zh: '水楊酸甲酯（冬青油）在化學結構上與阿士匹靈相近。醫學資料提醒，如吸收過量——例如誤服、大面積塗抹、塗於破損皮膚或配合熱敷——可引致水楊酸中毒。',
      },
      {
        en: 'Camphor is allowed in low concentrations, but accidental ingestion — especially by children — can cause seizures and poisoning. The US FDA limits camphor in over-the-counter products to 11% for this reason.',
        zh: '樟腦在低濃度下獲准使用，但誤服——尤其是兒童——可引致抽搐及中毒。美國 FDA 因此把非處方產品中的樟腦濃度上限定為 11%。',
      },
      {
        en: 'Topical steroids are medicines, not daily wellness ingredients, and should be used under guidance.',
        zh: '外用類固醇是藥物，並非日常保養成分，應在專業指導下使用。',
      },
      {
        en: 'VITAS 紓適寧 contains no methyl salicylate, no camphor and no topical steroids. Instead, it is built around grape seed, niaouli and eucalyptus for your warm-up and wind-down routine, with a cleaner profile — made in France to EEC GMP standard.',
        zh: 'VITAS 紓適寧不含水楊酸甲酯、樟腦及外用類固醇。配方以葡萄籽、綠花白千層與尤加利為核心，融入你的熱身與放鬆流程，成分更簡潔——法國製造，按 EEC GMP 標準生產。',
      },
    ],
  },
  {
    q: { en: 'What is the story behind VITAS?', zh: 'VITAS 紓適寧的歷史？' },
    a: {
      en: 'VITAS was created in Hong Kong to bring a French-made, plant-based recovery cream to a market dominated by strong medicated rubs. The formula — grape seed, niaouli and eucalyptus — comes out of two decades of formulation work in France, and the finished product has been on Hong Kong pharmacy shelves at Watsons and Mannings for over a decade. Today it is still a small, Hong Kong-run brand, and every formula is made in France to the same standard. Read the longer version on our About page.',
      zh: 'VITAS 紓適寧於香港創立，目的是在以強效藥膏為主的市場中，帶來一支法國製造的植物配方恢復啫喱膏。配方以葡萄籽、綠花白千層與尤加利為核心，源自法國二十年的配方研發；成品在香港屈臣氏及萬寧的貨架上已超過十年。時至今日，它仍是一個由香港團隊經營的小品牌，每一款配方都在法國按同一標準生產。詳情請看「關於 VITAS」。',
    },
  },
  {
    q: {
      en: 'What does it feel like? Does it smell, or feel greasy?',
      zh: 'VITAS 紓適寧用起來是甚麼感覺？有氣味嗎？會油膩嗎？',
    },
    a: {
      en: 'Before training, it gives a warming sensation as you massage it in; after training, a fresh, cooling one. It has enough glide for a proper self-massage on legs, shoulders and neck, absorbs in under a minute and leaves no shine, so you can dress straight away. The scent is a faint eucalyptus note that fades within a minute — there is no methyl salicylate or camphor, so it does not carry across a room. It is a cosmetic massage cream: it supports your routine, it does not treat injury or illness.',
      zh: '訓練前按摩時帶來溫熱感；訓練後則帶來清新涼感。質地有足夠滑度，方便為雙腿、肩膊及頸部自我按摩，一分鐘內吸收、不留油光，塗後可即時穿衣。氣味是淡淡的尤加利香，約一分鐘散去——配方不含水楊酸甲酯及樟腦，氣味不會擴散至整個房間。它是按摩護理產品——輔助你的日常習慣，並不能治療受傷或疾病。',
    },
  },
  {
    q: {
      en: 'What is in the VITAS Soothing Cream Gel?',
      zh: 'VITAS 紓適寧舒緩啫喱膏成分？',
    },
    a: {
      en: 'Three plant actives in a light water- and oil-based cream gel: grape seed (Vitis vinifera) as the carrier, eucalyptus (Eucalyptus globulus) for the cooling note, and niaouli (Melaleuca viridiflora) to round the scent. No hormones, no steroids, no methyl salicylate, no camphor. The full INCI list is printed on the carton — if you have a known essential-oil sensitivity, read it before you buy and patch test on the inner forearm.',
      zh: '三種植物成分，配於輕盈的水油啫喱基底：葡萄籽（Vitis vinifera）作基底、尤加利（Eucalyptus globulus）帶來清涼感、綠花白千層（Melaleuca viridiflora）平衡氣味。不含激素、類固醇、水楊酸甲酯或樟腦。完整 INCI 成分表印於外盒——如你對精油有已知敏感，請先閱讀成分並於前臂內側試用。',
    },
  },
  {
    q: { en: 'Where is VITAS made?', zh: 'VITAS 紓適寧是哪裡製造的呢？' },
    a: {
      en: 'In France, by a contract manufacturer producing with EEC GMP standard for cosmetics, then imported to Hong Kong in finished retail packs. Batch number and expiry date are printed on the crimp at the end of each tube. If you want the documentation behind a specific batch, write to us and we will send it.',
      zh: '於法國生產，由按 EEC GMP 標準生產的代工廠製造，再以零售包裝進口到香港。每支軟管末端摺口印有批號及有效期。如需查閱某一批次的相關文件，歡迎來信索取。',
    },
  },
  {
    q: {
      en: 'Who should not use VITAS?',
      zh: '哪些人士不宜使用 VITAS 紓適寧舒緩啫喱膏？',
    },
    a: {
      en: 'Do not use it on broken skin, on the face or near the eyes. It is not recommended for children under 5. If you are pregnant or breastfeeding, check with your doctor or midwife first — the formula contains eucalyptus and niaouli essential oils. If you have sensitive skin or a known reaction to essential oils, patch test on the inner forearm and stop if the skin becomes red or irritated. Severe, sudden or post-injury pain needs a doctor or physiotherapist, not a cream.',
      zh: '請勿用於破損皮膚、面部或眼睛附近。不建議 5 歲以下兒童使用。懷孕或哺乳期間請先諮詢醫生或助產士——配方含尤加利及綠花白千層精油。如屬敏感肌或對精油有已知反應，請先於前臂內側試用；若出現泛紅或不適應立即停用。劇烈、突發或受傷後的疼痛，請諮詢醫生或物理治療師，而非依賴按摩膏。',
    },
  },
  {
    q: { en: 'How often can I use it, and before or after exercise?', zh: '可以多常使用？運動前還是運動後？' },
    a: {
      en: 'One to two applications a day on clean, unbroken skin. Both: before training it is a two-minute check-in on the muscles you are about to load; after training it is a massage medium for tired legs, shoulders and back. There is no need to reapply every few minutes. Neither use replaces a proper warm-up or a rest day.',
      zh: '每日一至兩次，塗於清潔、無破損的皮膚。運動前後皆可：訓練前，是針對即將發力肌群的兩分鐘自我檢查；訓練後，是疲勞腿部、肩背的按摩介質。無需每隔數分鐘重複塗抹。兩者都不能取代正式熱身或休息日。',
    },
  },
  {
    q: {
      en: 'Does it drain lactic acid or "manage the lymphatic system"?',
      zh: '它可以排走乳酸或「管理淋巴」嗎？',
    },
    a: {
      en: 'No. Lactate clears on its own within about an hour of stopping exercise, and no topical cream drains lymph. VITAS is a low-odour, non-greasy massage cream gel for your warm-up and wind-down — warming before training, cooling after.',
      zh: '不能。運動停止後約一小時內乳酸會自行代謝；任何外用膏體都無法「排走淋巴」。VITAS 是低氣味、不油膩的按摩霜凝膠，融入你的熱身與放鬆流程——運動前溫熱，運動後清涼。',
    },
  },
  {
    q: { en: 'How do I order, and how much is delivery?', zh: '如何訂購？運費多少？' },
    a: {
      en: 'Order from the Shop page — checkout is handled by Stripe, which accepts card and Apple Pay / Google Pay. Local delivery within Hong Kong is free on orders of HK$250 or more and HK$30 otherwise, usually 2–4 working days. You can also buy in person at Watsons and Mannings across Hong Kong.',
      zh: '可於「網上商店」下單，付款由 Stripe 處理，支援信用卡及 Apple Pay／Google Pay。香港本地送遞：滿 HK$250 免運費，否則 HK$30，一般 2–4 個工作天送達。亦可於全港屈臣氏及萬寧門市選購。',
    },
  },
  {
    q: { en: 'Can I return it?', zh: '可以退貨嗎？' },
    a: {
      en: 'Unopened tubes can be returned within 14 days of delivery for a full refund — email us and we will arrange it. We cannot accept opened tubes back for hygiene reasons. If something arrived damaged, send a photo and we will replace it.',
      zh: '未開封產品可於收貨後 14 天內退貨並全額退款——請來電郵，我們會安排。基於衞生理由，已開封產品恕不接受退回。如收到的產品有損壞，請提供照片，我們會安排更換。',
    },
  },
];

/**
 * About page content.
 *
 * PLACEHOLDER — VERIFY BEFORE LAUNCH: the founding narrative below follows the
 * brand's own account (VITAS Brand Guidelines v1.0, 2026) and the public retail
 * record. Specific dates, the founder's biography and the "two decades of
 * formulation" line are not independently substantiated here. Confirm every
 * factual detail with Rosana Li before this page goes live, and see
 * docs/positioning.md.
 */
export const ABOUT = {
  founder: { en: 'Rosana Li', zh: 'Rosana Li' },
  chapters: [
    {
      h: { en: 'It started with a smell', zh: '一切由氣味開始' },
      p: [
        {
          en: 'Anyone who has shared a lift in Hong Kong after someone applied a traditional medicated rub knows the problem. The products that work on tired muscles announce themselves — a sharp wall of methyl salicylate and camphor that follows you into the office, the MTR and the meeting you are already late for. Most people solve it by not using anything until they get home, which is to say by not using anything at all.',
          zh: '在香港，只要曾在升降機裡聞到那股藥油味，你就明白問題所在。真正能舒緩疲勞的產品，氣味往往霸道得讓人卻步——水楊酸甲酯與樟腦的刺鼻氣味，會一路跟著你進辦公室、擠地鐵。大部分人的解法是「回家再用」；換句話說，就是索性不用。',
        },
        {
          en: 'VITAS exists because of that gap: something you can actually use in the middle of a working day, on the muscles that are tired now rather than the ones you will get to tonight.',
          zh: 'VITAS 紓適寧就是為了填補這個空隙而存在：一支你真的可以在上班日中途使用的產品，隨時照顧此刻疲勞的肌肉，不必再等今晚才來處理。',
        },
      ],
    },
    {
      h: { en: 'Why France', zh: '為甚麼是法國' },
      p: [
        {
          en: 'The formula was developed and is still made in France, by a cosmetics manufacturer producing with EEC GMP standard. That decision cost more than making it closer to home, and it was made for two reasons: the regulatory framework for cosmetic manufacture in the EU is strict and documented, and the plant-oil expertise — grape seed in particular — sits there.',
          zh: '配方在法國研發，至今仍於當地由按 EEC GMP 標準生產的化妝品廠製造。這個決定比就近生產昂貴，原因有二：歐盟對化妝品生產的規管嚴謹且有完整文件紀錄；而植物油——尤其是葡萄籽——的專業也在那裡。',
        },
        {
          en: 'The result is a short list: grape seed to carry, eucalyptus to cool, niaouli to round the scent. No hormones, no steroids, no methyl salicylate, no camphor. It is a smaller promise than most of the shelf makes, and it is one we can keep.',
          zh: '結果是一張很短的成分表：葡萄籽承載、尤加利清涼、綠花白千層平衡氣味。不含激素、類固醇、水楊酸甲酯或樟腦。這個承諾比貨架上大部分產品都小，但我們守得住。',
        },
      ],
    },
    {
      h: { en: 'On the shelf, in Hong Kong', zh: '在香港的貨架上' },
      p: [
        {
          en: 'Getting a small brand onto the shelf at Watsons and Mannings is the hardest thing to do in Hong Kong retail, and it took years. It is also the part of this business we are proudest of: it means someone can pick the tube up, read the carton and decide for themselves, without a website in between.',
          zh: '在香港的零售市場裡，要把一個小品牌推上屈臣氏與萬寧的貨架，是極其艱難的一條路，而我們花了多年時間走到這裡。這也是我們最引以為傲的事：當顧客親手拿起產品、看清外盒上的每一個字，就能自主做出決定——這過程，不需要透過任何網站或廣告來說服。',
        },
      ],
    },
  ],
  founderNote: {
    h: { en: 'A note from Rosana Li, founder', zh: '創辦人 Rosana Li 的話' },
    p: [
      {
        en: 'I started VITAS because I wanted something I could use at three in the afternoon without changing the air in the room. I trained, I sat at a desk, and I was tired of choosing between a product that worked and a product I could be seen using.',
        zh: '我創立 VITAS，是因為我想要一支下午三時可以使用、又不會改變整個房間空氣的產品。我有訓練習慣，也長時間坐在辦公桌前；在「有效」與「用得出街」之間二選一，我已經受夠了。',
      },
      {
        en: 'The hardest decision of the last year was to say less about what this cream does. It is a good product, honestly described: it warms before training and cools after, it absorbs, it makes a ten-minute massage possible, and it does not follow you around. That is the whole promise, and I would rather earn a customer with it than sell one a story.',
        zh: '過去一年最艱難的決定，是少說一點這支膏的功效。它是一支好產品，值得被誠實地描述：它運動前溫熱、運動後清涼、吸收快，讓十分鐘的按摩成為可能，而且不會跟著你到處走。這就是全部的承諾——我寧願用它換來一位顧客，也不想用一個故事賣出一支產品。',
      },
    ],
  },
};

/**
 * VITAS Capsule — the oral supplement. 60 capsules, made in France to EEC GMP
 * standard. Copy here stays inside the same claims discipline as the gel: it
 * describes the plants and the routine, not physiological or medical effects.
 * See docs/claims-guide.md before editing.
 */
export const CAPSULE = {
  slug: '/capsule/',
  nameEn: 'VITAS Capsule',
  nameZh: '淋巴管理膠囊',
  size: { en: '60 capsules', zh: '60 粒' },
  price: 298,
  priceLabel: 'HK$298',
  wasLabel: 'HK$538',
  photos: [
    {
      id: 'set',
      base: '/assets/img/product/capsule-set',
      alt: { en: 'VITAS Capsule bottle and box', zh: 'VITAS 淋巴管理膠囊 樽裝與外盒' },
    },
    {
      id: 'bottle',
      base: '/assets/img/product/capsule-bottle',
      alt: { en: 'VITAS Capsule, 60 capsules', zh: 'VITAS 淋巴管理膠囊 60 粒' },
    },
    {
      id: 'box',
      base: '/assets/img/product/capsule-box',
      alt: { en: 'VITAS Capsule box, front', zh: 'VITAS 淋巴管理膠囊 外盒正面' },
    },
  ],
  sku: 'VTS002',
  gmp: {
    en: 'Made in France, produced to EEC GMP standard.',
    zh: '法國製造，並嚴格遵循 EEC GMP 標準生產。',
  },
  form: {
    en: 'A plant-based food supplement in a capsule. Four plant ingredients, nothing else added for effect.',
    zh: '植物配方的膠囊裝食品補充品。四種植物成分，不額外添加其他成分。',
  },
  dosage: {
    en: '1 to 3 capsules, twice a day, roughly 6 to 7 hours apart, before or after a meal.',
    zh: '每天 2 次（相隔 6 至 7 小時即可），每次 1-3 粒，餐前或餐後服用。',
  },
  storage: {
    en: 'Keep away from children. Store in a cool, dry place, out of direct sunlight.',
    zh: '遠離兒童，存放於陰涼乾爽處，避光。',
  },
  cautions: [
    {
      en: 'Not suitable for children under 7, or during pregnancy and breastfeeding.',
      zh: '7 歲以下兒童、懷孕及哺乳期間不宜服用。',
    },
    {
      en: 'If you take anti-coagulant or anti-platelet medicine, or are allergic to any of the ingredients, consult your physician before taking it.',
      zh: '如正服用薄血藥／通血管藥，或對成分敏感，請先諮詢醫生。',
    },
    {
      en: 'A food supplement, not a medicine. It does not diagnose, treat, cure or prevent any disease, and it does not replace a varied diet or medical advice.',
      zh: '本品為食品補充品，並非藥物，不能診斷、治療、治癒或預防任何疾病，亦不能取代均衡飲食或醫生的建議。',
    },
  ],
};

/** The four plants in VITAS Capsule. Descriptive only — no efficacy claims. */
export const CAPSULE_PLANTS = [
  {
    id: 'red-grape-leaf',
    art: '/assets/img/plant-red-grape-leaf.svg',
    eyebrow: { en: 'The base', zh: '主成分' },
    name: { en: 'Red grape leaf', zh: '紅葡萄葉' },
    latin: 'Vitis vinifera',
    text: {
      en: 'The leaf of the wine grape, red in autumn and long used in European herbal traditions. It is the plant the formula is built around, and the same species as the grape seed in the cream gel.',
      zh: '釀酒葡萄的葉片，入秋轉紅，在歐洲草本傳統中沿用已久。它是這個配方的核心，與舒緩啫喱膏中的葡萄籽同屬一種植物。',
    },
  },
  {
    id: 'bilberry',
    art: '/assets/img/plant-bilberry.svg',
    eyebrow: { en: 'Nordic berry', zh: '北歐莓果' },
    name: { en: 'Bilberry', zh: '北歐藍莓' },
    latin: 'Vaccinium myrtillus',
    text: {
      en: 'A small dark berry that grows wild across northern Europe — a cousin of the blueberry, deeper in colour and more strongly flavoured.',
      zh: '野生於北歐的深色小莓果，與藍莓同屬近親，顏色更深、味道更濃。',
    },
  },
  {
    id: 'soy-lecithin',
    art: '/assets/img/plant-soy.svg',
    eyebrow: { en: 'From the soybean', zh: '來自大豆' },
    name: { en: 'Soy lecithin', zh: '大豆卵磷脂' },
    latin: 'Glycine max',
    text: {
      en: 'A natural fat fraction of the soybean, widely used in food and supplements. If you avoid soy, this is the ingredient to note.',
      zh: '從大豆中提取的天然脂質成分，廣泛用於食品及補充品。如你需要避開大豆，請留意這項成分。',
    },
  },
  {
    id: 'garlic',
    art: '/assets/img/plant-garlic.svg',
    eyebrow: { en: 'The kitchen staple', zh: '廚房常備' },
    name: { en: 'Garlic', zh: '大蒜' },
    latin: 'Allium sativum',
    text: {
      en: 'The same bulb you cook with, in a measured amount inside a capsule rather than on the plate.',
      zh: '與你日常入饌的大蒜相同，只是以定量形式裝入膠囊，而非放在碟上。',
    },
  },
];

/**
 * VITAS Soothing Cream Gel 50ml roll-on, sold as a two-pack. NOTE: this is a
 * different formulation from the 100ml gel — it contains menthol, a
 * formaldehyde-releasing preservative (imidazolidinyl urea) and colourants
 * (CI 15985 / CI 16255 / CI 19140). The "no synthetic dyes" chips apply to the
 * 100ml cream gel only; never show PRODUCT.freeFrom on a roll-on page.
 */
export const ROLLON = {
  slug: '/roll-on/',
  nameEn: 'Soothing Cream Gel Roll-On',
  nameZh: '舒緩啫喱膏走珠裝',
  size: { en: '2 × 50ml roll-on', zh: '2 × 50 毫升走珠裝' },
  price: 320,
  priceLabel: 'HK$320',
  sku: 'VTS003',
  photos: [
    {
      id: 'set',
      base: '/assets/img/product/rollon-set',
      alt: { en: 'VITAS Soothing Cream Gel Roll-On with its box', zh: 'VITAS 舒緩啫喱膏走珠裝 連外盒' },
    },
    {
      id: 'duo',
      base: '/assets/img/product/rollon-duo',
      alt: { en: 'Two VITAS roll-on bottles', zh: 'VITAS 走珠裝 兩支' },
    },
    {
      id: 'bottle',
      base: '/assets/img/product/rollon-bottle',
      alt: { en: 'VITAS Soothing Cream Gel Roll-On, 50ml', zh: 'VITAS 舒緩啫喱膏走珠裝 50 毫升' },
    },
    {
      id: 'box',
      base: '/assets/img/product/rollon-box',
      alt: { en: 'VITAS Roll-On box, front', zh: 'VITAS 走珠裝外盒正面' },
    },
  ],
  gmp: {
    en: 'Made in France, produced to EEC GMP standard.',
    zh: '法國製造，並嚴格遵循 EEC GMP 標準生產。',
  },
  use: {
    en: 'Roll it on and massage briefly until it is fully absorbed. For external use only.',
    zh: '直接滾塗於目標部位，稍加按摩至完全吸收。只供外用。',
  },
  inci:
    'Vitis Vinifera, Melaleuca Viridiflora oil, Eucalyptus Globulus oil, Aqua, Menthol, Ethylhexyl Stearate, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Sorbitan Isostearate, Isohexadecane, Polysorbate-60, Imidazolidinyl urea, CI 15985, CI 16255, CI 19140',
  cautions: [
    {
      en: 'For external use only. Not suitable for children under 5, or during pregnancy and breastfeeding.',
      zh: '只供外用。5 歲以下兒童、懷孕及哺乳期間不宜使用。',
    },
    {
      en: 'This formula contains menthol, a preservative (imidazolidinyl urea) and colourants. If your skin reacts to any of these, the 100ml cream gel is the simpler formula.',
      zh: '此配方含薄荷腦、防腐劑（咪唑烷基脲）及色素。如你的皮膚對以上成分敏感，100 毫升啫喱膏的配方較為簡單。',
    },
    {
      en: 'A cosmetic massage product, not a medicine. It does not diagnose, treat, cure or prevent any condition.',
      zh: '本品為按摩護理化妝品，並非藥物，不能診斷、治療、治癒或預防任何疾病。',
    },
  ],
};
