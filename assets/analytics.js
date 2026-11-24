/* Shared GA4: one initialization per page; never read form field values. */
(() => {
  'use strict';
  if (window.bbAnalyticsLoaded) return;
  window.bbAnalyticsLoaded = true;
  const production = location.hostname === 'bohdanbeisiuk.com' || location.hostname === 'www.bohdanbeisiuk.com';
  let excluded = !production;
  try { excluded = excluded || localStorage.getItem('bb.analytics.exclude') === '1'; } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.bbTrack = function (name, parameters = {}) {
    if (excluded) return;
    window.gtag('event', name, Object.assign({page_path: location.pathname, page_language: document.documentElement.lang || 'en', transport_type: 'beacon'}, parameters));
  };
  if (excluded) return;
  window.gtag('js', new Date());
  window.gtag('config', 'G-6BQRP4ZKMW');
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6BQRP4ZKMW';
  document.head.appendChild(script);
  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    const context = {link_path: url.pathname, cta_location: link.dataset.location || location.pathname};
    if (url.hostname === 'calendar.app.google' || url.hostname === 'calendar.google.com') {
      window.bbTrack('book_call', context); // Calendar click only, not a completed booking.
    } else if (/\.pdf$/i.test(url.pathname)) {
      window.bbTrack('playbook_download_click', context); // Click, not confirmation of a saved file.
    } else if (link.matches('.bb-whitepaper-cta')) {
      window.bbTrack('playbook_popup_click', context);
    } else if (url.pathname.includes('/resources/outbound-readiness/') && !link.matches('#bb-whitepaper-launcher')) {
      window.bbTrack('playbook_cta_click', context);
    }
  });
})();
