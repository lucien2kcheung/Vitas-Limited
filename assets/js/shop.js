/* VITAS — cart and Stripe checkout.
   Progressive enhancement: with JavaScript off the shop pages still read, and
   the stockist links still work. Prices shown here are for display only —
   /api/checkout re-prices every line from the server-side catalogue before it
   creates a Stripe session. */
(function () {
  'use strict';

  var CART_KEY = 'vitas-cart';
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

  /* ------------------------------------------------------------------ init */

  paintBadge();
  paintCart();
})();
