/* Tracking events for GA4, Google Ads and Meta Pixel.
 *
 * GA4 (G-KK5EV8LLLF) and the Google Ads tag are loaded in the <head> by src/layout.mjs.
 * Google Ads conversion labels: leave a label empty ('') and that conversion is simply not
 * sent. Fill them in from Google Ads → Goals → Conversions → (action) → Tag setup →
 * "Use the event snippet": send_to: 'AW-18537536728/<LABEL>'.
 * Meta Pixel events fire only once window.fbq exists (base code in layout.mjs).
 */
(function () {
  var AW = 'AW-18537536728';
  var LABELS = {
    purchase: '',
    whatsapp: '',
    phone: '',
  };

  function ev(name, params) {
    if (window.gtag) window.gtag('event', name, params || {});
  }
  function fb(name, params) {
    if (window.fbq) window.fbq('track', name, params || {});
  }
  function adsConversion(key, extra) {
    if (!LABELS[key] || !window.gtag) return;
    var p = { send_to: AW + '/' + LABELS[key] };
    for (var k in extra) p[k] = extra[k];
    window.gtag('event', 'conversion', p);
  }

  document.addEventListener(
    'click',
    function (e) {
      if (!e.target || !e.target.closest) return;

      var a = e.target.closest('a[href*="wa.me"], a[href^="tel:"]');
      if (a) {
        var phone = a.getAttribute('href').indexOf('tel:') === 0;
        ev(phone ? 'phone_click' : 'whatsapp_click', { page_path: location.pathname });
        adsConversion(phone ? 'phone' : 'whatsapp', {});
        fb('Contact');
      }

      var add = e.target.closest('[data-add-to-cart]');
      if (add) {
        var v = parseInt(add.getAttribute('data-price'), 10) / 100; // prices are stored in cents
        ev('add_to_cart', { currency: 'HKD', value: v });
        fb('AddToCart', { currency: 'HKD', value: v });
      }

      if (e.target.closest('[data-checkout]')) {
        ev('begin_checkout', { currency: 'HKD' });
        fb('InitiateCheckout', { currency: 'HKD' });
      }
    },
    true
  );

  /* Purchase: fires once on the Stripe success page. PayMe orders (?payme=ORDER_ID, no
     session_id) are not tracked yet. */
  if (document.body && document.body.classList.contains('page-checkout--success')) {
    var qs = new URLSearchParams(location.search);
    var id = qs.get('session_id');
    if (id) {
      try {
        if (localStorage.getItem('vitas_tracked') !== id) {
          var order = JSON.parse(sessionStorage.getItem('vitas_order') || '{}');
          var value = order.value || 0;
          ev('purchase', { transaction_id: id, value: value, currency: 'HKD' });
          adsConversion('purchase', { value: value, currency: 'HKD', transaction_id: id });
          fb('Purchase', { value: value, currency: 'HKD' });
          localStorage.setItem('vitas_tracked', id);
          sessionStorage.removeItem('vitas_order');
        }
      } catch (err) {}
    }
  }
})();
