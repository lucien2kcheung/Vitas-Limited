/* VITAS — cart and Stripe checkout.
   Progressive enhancement: with JavaScript off the shop pages still read, and
   the stockist links still work. Prices shown here are for display only —
   /api/checkout re-prices every line from the server-side catalogue before it
   creates a Stripe session. */
(function () {
  'use strict';

  var CART_KEY = 'vitas-cart-v2'; // v2: products and prices changed; old carts are discarded
  var SHIPPING = 3000;
  var FREE_OVER = 25000; // keep in sync with SHOP.freeShippingOver in src/data.mjs

  var lang = document.body.getAttribute('data-lang') === 'zh' ? 'zh' : 'en';
  var zh = lang === 'zh';
  var base = zh ? '/zh' : '';

  var T = {
    added: { en: 'Added to cart', zh: '已加入購物車' },
    remove: { en: 'Remove', zh: '移除' },
    qty: { en: 'Quantity', zh: '數量' },
    free: { en: 'Free', zh: '免費' },
    working: { en: 'Taking you to Stripe…', zh: '正前往 Stripe…' },
    failed: {
      en: 'Checkout is not connected yet. Add STRIPE_SECRET_KEY in Vercel to enable it (see README).',
      zh: '結帳功能尚未連接。請在 Vercel 設定 STRIPE_SECRET_KEY 以啟用（見 README）。',
    },
    pmWorking: { en: 'Preparing your PayMe payment…', zh: '正在準備 PayMe 付款…' },
    pmError: {
      en: 'Could not start PayMe payment. Please try again or choose another payment method.',
      zh: '無法開始 PayMe 付款。請重試或選擇其他付款方式。',
    },
    pmWaiting: { en: 'Waiting for your payment…', zh: '正在等候付款…' },
    pmScanLede: {
      en: 'Open the PayMe app, tap Scan, and scan this code.',
      zh: '開啟 PayMe 應用程式，點選「掃描」，掃描此二維碼。',
    },
    pmPhoneLede: {
      en: 'Tap the button to open the PayMe app and confirm the payment.',
      zh: '點擊下方按鈕開啟 PayMe 應用程式，確認付款。',
    },
    pmTotal: { en: 'Total to pay', zh: '應付總額' },
    pmDiscount: { en: 'discount applied', zh: '優惠已套用' },
    pmExpiredTitle: { en: 'This QR code has expired', zh: '二維碼已過期' },
    pmExpiredText: {
      en: 'Nothing was charged. You can start again to get a new code.',
      zh: '沒有任何扣款。你可以重新開始以取得新的二維碼。',
    },
    pmFailedTitle: { en: 'The payment did not go through', zh: '付款未能完成' },
    pmFailedText: {
      en: 'Nothing was charged to you. Please try again, or use another payment method.',
      zh: '你的帳戶沒有被扣款。請重試，或選擇其他付款方式。',
    },
    pmLeft: { en: 'Code valid for', zh: '二維碼有效時間' },
    pmReview: {
      en: 'Your payment needs a quick check by our team. Please email info@vitas.com.hk with your order details.',
      zh: '你的付款需由我們檢查。請電郵 info@vitas.com.hk 並提供訂單資料。',
    },
  };
  var say = function (key) {
    return T[key][lang];
  };
  var money = function (cents) {
    return 'HK$' + Math.round(cents / 100);
  };

  /* ---------------------------------------------------------------- state */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* private mode — the cart lives for this page view only */
    }
  }

  var cart = read(CART_KEY, []);
  if (!Array.isArray(cart)) cart = [];

  /* Discount codes are handled only on the Stripe payment page. Clear the
     values the old on-site coupon and welcome pop-up left in returning
     visitors' browsers. */
  try {
    localStorage.removeItem('vitas-promo');
    localStorage.removeItem('vitas-cart');
    localStorage.removeItem('vitas-welcome-seen');
  } catch (e) {}

  var subtotal = function () {
    return cart.reduce(function (sum, line) {
      return sum + line.price * line.qty;
    }, 0);
  };

  var count = function () {
    return cart.reduce(function (sum, line) {
      return sum + line.qty;
    }, 0);
  };

  function persist() {
    save(CART_KEY, cart);
    paintBadge();
    paintCart();
  }

  /* ---------------------------------------------------------------- badge */

  function paintBadge() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
  }

  /* ------------------------------------------------------ package options */

  /* A card with a package selector (e.g. the capsule: 1 box / Monthly package)
     re-points its Add to cart button at the chosen product id and price. */
  document.querySelectorAll('[data-options]').forEach(function (group) {
    var card = group.closest('[data-product]');
    var btn = card.querySelector('[data-add-to-cart]');
    var out = card.querySelector('[data-price-out]');
    group.addEventListener('change', function (e) {
      var input = e.target.closest('input[type="radio"]');
      if (!input) return;
      btn.setAttribute('data-add-to-cart', input.value);
      btn.setAttribute('data-variant', input.getAttribute('data-variant'));
      btn.setAttribute('data-price', input.getAttribute('data-price'));
      if (out) out.textContent = input.getAttribute('data-price-label');
    });
  });

  /* ----------------------------------------------------------- add to cart */

  document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-add-to-cart');
      var line = cart.filter(function (l) {
        return l.id === id;
      })[0];

      if (line) {
        line.qty += 1;
      } else {
        cart.push({
          id: id,
          name: btn.getAttribute('data-name'),
          variant: btn.getAttribute('data-variant'),
          price: parseInt(btn.getAttribute('data-price'), 10),
          art: btn.getAttribute('data-art'),
          qty: 1,
        });
      }
      persist();

      var original = btn.textContent;
      btn.textContent = say('added');
      btn.classList.add('is-added');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('is-added');
      }, 1600);
    });
  });

  /* ------------------------------------------------------------- cart page */

  var itemsEl = document.querySelector('[data-cart-items]');

  function paintCart() {
    if (!itemsEl) return;

    if (!cart.length) {
      itemsEl.innerHTML =
        '<p class="cart__empty">' +
        (zh ? '購物車是空的。 ' : 'Your cart is empty. ') +
        '<a href="' + base + '/shop/">' +
        (zh ? '前往商店' : 'Go to the shop') +
        '</a></p>';
    } else {
      itemsEl.innerHTML = cart
        .map(function (line, i) {
          return (
            '<article class="cart-line">' +
            '<img class="cart-line__art" src="' + line.art + '" alt="" width="120" height="160">' +
            '<div class="cart-line__body">' +
            '<h2 class="cart-line__name">' + line.name + '</h2>' +
            '<p class="cart-line__variant">' + line.variant + '</p>' +
            '<button class="cart-line__remove" type="button" data-remove="' + i + '">' +
            say('remove') +
            '</button>' +
            '</div>' +
            '<div class="cart-line__qty">' +
            '<label class="sr-only" for="qty-' + i + '">' + say('qty') + '</label>' +
            '<button type="button" data-step="-1" data-index="' + i + '" aria-label="−">−</button>' +
            '<input id="qty-' + i + '" type="number" min="1" max="20" value="' + line.qty + '" data-qty="' + i + '">' +
            '<button type="button" data-step="1" data-index="' + i + '" aria-label="+">+</button>' +
            '</div>' +
            '<p class="cart-line__price">' + money(line.price * line.qty) + '</p>' +
            '</article>'
          );
        })
        .join('');
    }

    var sub = subtotal();
    var shipping = !cart.length ? 0 : sub >= FREE_OVER ? 0 : SHIPPING;

    var set = function (sel, value) {
      var el = document.querySelector(sel);
      if (el) el.textContent = value;
    };
    set('[data-cart-subtotal]', money(sub));
    set('[data-cart-shipping]', !cart.length ? '—' : shipping === 0 ? say('free') : money(shipping));
    set('[data-cart-total]', money(sub + shipping));

    var checkoutBtn = document.querySelector('[data-checkout]');
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    var paymeBtn = document.querySelector('[data-payme-open]');
    if (paymeBtn) paymeBtn.disabled = cart.length === 0;
  }

  if (itemsEl) {
    itemsEl.addEventListener('click', function (e) {
      var remove = e.target.closest('[data-remove]');
      var step = e.target.closest('[data-step]');
      if (remove) {
        cart.splice(parseInt(remove.getAttribute('data-remove'), 10), 1);
        persist();
      } else if (step) {
        var i = parseInt(step.getAttribute('data-index'), 10);
        cart[i].qty = Math.min(20, Math.max(1, cart[i].qty + parseInt(step.getAttribute('data-step'), 10)));
        persist();
      }
    });

    itemsEl.addEventListener('change', function (e) {
      var input = e.target.closest('[data-qty]');
      if (!input) return;
      var i = parseInt(input.getAttribute('data-qty'), 10);
      cart[i].qty = Math.min(20, Math.max(1, parseInt(input.value, 10) || 1));
      persist();
    });
  }

  /* -------------------------------------------------------------- checkout */

  var checkout = document.querySelector('[data-checkout]');
  if (checkout) {
    checkout.addEventListener('click', function () {
      var note = document.querySelector('[data-checkout-note]');
      checkout.disabled = true;
      if (note) {
        note.textContent = say('working');
        note.hidden = false;
        note.className = 'cart__note';
      }

      fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(function (l) {
            return { id: l.id, qty: l.qty };
          }),
          lang: lang,
        }),
      })
        .then(function (res) {
          return res.ok ? res.json() : Promise.reject(new Error('HTTP ' + res.status));
        })
        .then(function (data) {
          if (!data.url) throw new Error('no session url');
          window.location.href = data.url;
        })
        .catch(function () {
          checkout.disabled = false;
          if (note) {
            note.textContent = say('failed');
            note.className = 'cart__note is-bad';
            note.hidden = false;
          }
        });
    });
  }

  /* ------------------------------------------------------------------ PayMe */

  /* The server (api/payme/*) re-prices the cart, saves the order and creates
     the PayMe payment request. This block only collects delivery details,
     shows the QR code it returns, and polls until the order is paid. */

  var pm = document.querySelector('[data-payme-modal]');
  if (pm) {
    var pmOpen = document.querySelector('[data-payme-open]');
    var pmForm = pm.querySelector('[data-payme-form]');
    var pmError = pm.querySelector('[data-payme-error]');
    var pmSubmit = pm.querySelector('[data-payme-submit]');
    var pmSteps = pm.querySelectorAll('[data-payme-step]');
    var pmOrder = null; // { id } while a QR is on screen
    var pmPoll = null;
    var pmTick = null;
    var pmLastFocus = null;

    var pmStep = function (name) {
      pmSteps.forEach(function (el) {
        el.hidden = el.getAttribute('data-payme-step') !== name;
      });
    };

    var pmStop = function () {
      clearInterval(pmPoll);
      clearInterval(pmTick);
      pmPoll = pmTick = null;
    };

    /* Tell the server so the QR can no longer be paid. */
    var pmCancelOnServer = function (id) {
      fetch('/api/payme/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id }),
        keepalive: true,
      }).catch(function () {});
    };

    var pmClose = function (cancelOrder) {
      pmStop();
      if (cancelOrder && pmOrder) pmCancelOnServer(pmOrder.id);
      pmOrder = null;
      pm.hidden = true;
      document.body.classList.remove('pm-open');
      if (pmLastFocus) pmLastFocus.focus();
    };

    var pmProblem = function (title, text) {
      pmStop();
      pmOrder = null;
      pm.querySelector('[data-payme-problem-title]').textContent = title;
      pm.querySelector('[data-payme-problem-text]').textContent = text;
      pmStep('problem');
    };

    var pmPaid = function (id) {
      pmStop();
      cart = [];
      persist();
      window.location.href = base + '/checkout/success/?payme=' + encodeURIComponent(id);
    };

    var pmCheck = function () {
      if (!pmOrder) return;
      var id = pmOrder.id;
      fetch('/api/payme/status?orderId=' + encodeURIComponent(id))
        .then(function (res) {
          return res.ok ? res.json() : null;
        })
        .then(function (data) {
          if (!data || !pmOrder || pmOrder.id !== id) return;
          if (data.status === 'paid') pmPaid(id);
          else if (data.status === 'expired') pmProblem(say('pmExpiredTitle'), say('pmExpiredText'));
          else if (data.status === 'failed' || data.status === 'cancelled') pmProblem(say('pmFailedTitle'), say('pmFailedText'));
          else if (data.status === 'needs_review') pmProblem(say('pmFailedTitle'), say('pmReview'));
        })
        .catch(function () {});
    };

    var pmShowQr = function (data) {
      pmOrder = { id: data.orderId };
      var s = data.summary || {};
      var total = say('pmTotal') + ': ' + s.total;
      if (s.coupon) total += ' (' + s.coupon + ' · ' + say('pmDiscount') + ')';
      pm.querySelector('[data-payme-total]').textContent = total;

      /* Phones get the deep link; desktops and tablets get the QR code. */
      var phone = window.matchMedia('(pointer: coarse) and (max-width: 820px)').matches;
      var qr = pm.querySelector('[data-payme-qr]');
      var app = pm.querySelector('[data-payme-app]');
      qr.innerHTML = data.qrSvg; // SVG generated by our own server from the PayMe link
      qr.hidden = phone;
      app.href = data.appLink || '#';
      app.hidden = !phone;
      pm.querySelector('[data-payme-lede]').textContent = phone ? say('pmPhoneLede') : say('pmScanLede');

      var status = pm.querySelector('[data-payme-status]');
      var left = data.expiresIn || 600;
      var paint = function () {
        var m = Math.floor(left / 60);
        var sec = ('0' + (left % 60)).slice(-2);
        status.textContent = say('pmWaiting') + ' · ' + say('pmLeft') + ' ' + m + ':' + sec;
      };
      paint();
      pmTick = setInterval(function () {
        left -= 1;
        if (left <= 0) {
          if (pmOrder) pmCancelOnServer(pmOrder.id);
          pmProblem(say('pmExpiredTitle'), say('pmExpiredText'));
          return;
        }
        paint();
      }, 1000);
      pmPoll = setInterval(pmCheck, 3000);
      pmStep('qr');
    };

    pmOpen.addEventListener('click', function () {
      if (!cart.length) return;
      pmLastFocus = pmOpen;
      pmError.hidden = true;
      pmStep('form');
      pm.hidden = false;
      document.body.classList.add('pm-open');
      var first = pm.querySelector('input');
      if (first) first.focus();
    });

    pm.addEventListener('click', function (e) {
      if (e.target === pm) pmClose(!!pmOrder);
    });
    pm.querySelector('[data-payme-close]').addEventListener('click', function () {
      pmClose(!!pmOrder);
    });
    pm.querySelector('[data-payme-cancel]').addEventListener('click', function () {
      pmClose(true);
    });
    pm.querySelector('[data-payme-retry]').addEventListener('click', function () {
      pmError.hidden = true;
      pmStep('form');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !pm.hidden) pmClose(!!pmOrder);
    });

    pmForm.addEventListener('submit', function (e) {
      e.preventDefault();
      pmError.hidden = true;
      var field = function (name) {
        return pmForm.elements[name].value;
      };
      pmSubmit.disabled = true;
      var label = pmSubmit.textContent;
      pmSubmit.textContent = say('pmWorking');

      fetch('/api/payme/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(function (l) {
            return { id: l.id, qty: l.qty };
          }),
          customer: {
            name: field('name'),
            email: field('email'),
            phone: field('phone'),
            address1: field('address1'),
            address2: field('address2'),
            district: field('district'),
          },
          coupon: field('coupon'),
          lang: lang,
        }),
      })
        .then(function (res) {
          return res.json().then(function (body) {
            if (!res.ok) {
              var msg = body && body.error ? body.error : say('pmError');
              /* Preview deployments include the technical reason after the message. */
              if (body && body.detail) msg += ' [' + body.detail + ']';
              throw new Error(msg);
            }
            return body;
          });
        })
        .then(pmShowQr)
        .catch(function (err) {
          pmError.textContent = err && err.message ? err.message : say('pmError');
          pmError.hidden = false;
        })
        .then(function () {
          pmSubmit.disabled = false;
          pmSubmit.textContent = label;
        });
    });
  }

  /* After a PayMe payment the cart is empty; also covers a customer who paid
     on their phone and landed on the success page there. */
  if (/[?&]payme=/.test(window.location.search) && /\/checkout\/success\//.test(window.location.pathname)) {
    cart = [];
    persist();
  }

  /* PayMe sent the customer back after a failed payment. */
  if (/[?&]payme=failed/.test(window.location.search)) {
    var failNote = document.querySelector('[data-checkout-note]');
    if (failNote) {
      failNote.textContent = say('pmFailedTitle') + '. ' + say('pmFailedText');
      failNote.className = 'cart__note is-bad';
      failNote.hidden = false;
    }
  }

  /* ------------------------------------------------------------------ init */

  paintBadge();
  paintCart();
})();
