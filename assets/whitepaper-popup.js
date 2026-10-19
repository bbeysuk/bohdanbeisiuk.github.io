(() => {
  'use strict';
  if (document.getElementById('bb-whitepaper-launcher')) return;
  const resourceUrl = '/resources/outbound-readiness/#get-playbook';
  const storageKey = 'bb.outbound-playbook.dismissed-until.v1';
  const week = 7 * 24 * 60 * 60 * 1000;
  const preview = new URLSearchParams(window.location.search).get('whitepaper') === 'preview';
  const startedAt = Date.now();
  let shown = false;
  let stylesReady = false;
  let previousOverflow = '';
  let previousFocus = null;
  let autoTimer;
  const storage = [];
  for (const name of ['localStorage', 'sessionStorage']) {
    try { storage.push(window[name]); } catch (_) { /* The link remains available without storage. */ }
  }
  function isDismissed() {
    return storage.some(item => {
      try { return Number(item.getItem(storageKey)) > Date.now(); } catch (_) { return false; }
    });
  }
  function rememberDismissal() {
    if (preview) return;
    for (const item of storage) {
      try { item.setItem(storageKey, String(Date.now() + week)); } catch (_) { /* Storage is optional. */ }
    }
  }

  const launcher = document.createElement('a');
  launcher.id = 'bb-whitepaper-launcher';
  launcher.className = 'bb-whitepaper-launcher';
  launcher.href = resourceUrl;
  launcher.hidden = true;
  launcher.textContent = 'Free Outbound Playbook';
  document.body.appendChild(launcher);

  const dialog = document.createElement('dialog');
  dialog.id = 'bb-whitepaper-dialog';
  dialog.className = 'bb-whitepaper-dialog';
  dialog.setAttribute('aria-labelledby', 'bb-whitepaper-title');
  dialog.setAttribute('aria-describedby', 'bb-whitepaper-description');
  const supportsDialog = typeof dialog.showModal === 'function';
  if (supportsDialog) {
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-controls', dialog.id);
    dialog.innerHTML = `
      <button class="bb-whitepaper-close" type="button" aria-label="Close white paper popup" autofocus>×</button>
      <div class="bb-whitepaper-grid">
        <div class="bb-whitepaper-cover"><img src="/assets/images/outbound-readiness-cover.jpg" alt="The B2B Outbound Readiness Playbook cover" width="425" height="600"><span>10 pages · Free PDF</span></div>
        <div class="bb-whitepaper-copy">
          <p class="bb-whitepaper-eyebrow">A practical B2B white paper</p>
          <h2 id="bb-whitepaper-title">Find the gaps in your outbound system.</h2>
          <p id="bb-whitepaper-description">Use a 15-question scorecard, practical templates, and a 30-day improvement plan to choose what to fix first.</p>
          <ul><li>Assess your targeting and messaging</li><li>Improve your sales handoff</li><li>Choose three clear priorities</li></ul>
          <a class="bb-whitepaper-cta" href="${resourceUrl}">Get the Free Playbook →</a>
          <p class="bb-whitepaper-note">By Bohdan Beisiuk · For B2B agencies and service firms</p>
          <button class="bb-whitepaper-later" type="button">Maybe later</button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
  }

  function showPopup(automatic = false) {
    if (!supportsDialog || !stylesReady || dialog.open || document.visibilityState === 'hidden') return;
    if (automatic) {
      if (shown || (!preview && isDismissed()) || document.querySelector('dialog[open]')) return;
      const active = document.activeElement;
      if (active && (active.closest('form') || active.isContentEditable)) return;
    }
    previousFocus = document.activeElement;
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    shown = true;
    // Also cap auto-display across navigation when the visitor follows another link.
    rememberDismissal();
    clearTimeout(autoTimer);
    window.removeEventListener('scroll', onScroll);
  }
  function dismiss() {
    rememberDismissal();
    dialog.close();
  }
  function onScroll() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    if (available > 0 && window.scrollY / available >= 0.35 && Date.now() - startedAt >= 4000) showPopup(true);
  }
  launcher.addEventListener('click', event => {
    if (!supportsDialog || !stylesReady) return;
    event.preventDefault();
    showPopup();
  });
  if (supportsDialog) {
    dialog.querySelector('.bb-whitepaper-close').addEventListener('click', dismiss);
    dialog.querySelector('.bb-whitepaper-later').addEventListener('click', dismiss);
    dialog.querySelector('.bb-whitepaper-cta').addEventListener('click', rememberDismissal);
    dialog.addEventListener('cancel', rememberDismissal);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow;
      if (previousFocus && previousFocus !== document.body && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      else launcher.focus({ preventScroll: true });
    });
    window.addEventListener('pagehide', () => { if (dialog.open) dialog.close(); });
  }

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/assets/whitepaper-popup.css';
  stylesheet.addEventListener('load', () => {
    stylesReady = true;
    launcher.hidden = false;
    if (preview) showPopup();
    else if (!isDismissed()) {
      autoTimer = setTimeout(() => showPopup(true), 8000);
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  });
  stylesheet.addEventListener('error', () => { launcher.hidden = false; });
  document.head.appendChild(stylesheet);
})();
