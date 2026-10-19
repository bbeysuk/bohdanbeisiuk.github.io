(() => {
  'use strict';
  const form = document.getElementById('playbook-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('playbook-status');
  const success = document.getElementById('playbook-success');
  const consentText = "Email me practical B2B outbound advice and information about Bohdan Beisiuk's services. I can unsubscribe at any time.";
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    if (form.elements._gotcha.value) return;
    submitting = true;
    button.disabled = true;
    button.textContent = 'Opening your playbook…';
    status.className = 'form-status';
    status.textContent = 'Submitting your request. Please wait.';
    const data = new FormData(form);
    data.set('email', form.elements.email.value.trim());
    data.set('name', form.elements.name.value.trim());
    data.set('website', form.elements.website.value.trim());
    data.set('marketing_consent', form.elements.marketing_consent.checked ? 'yes' : 'no');
    data.set('consent_text', consentText);
    data.set('consent_version', 'outbound-readiness-2026-10-19-v1');
    data.set('privacy_notice_version', '2026-10-19');
    data.set('submitted_at', new Date().toISOString());
    // Keep visitor contact details out of URLs, analytics, and browser storage.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result || result.ok !== true) {
        if (response.status === 429) throw new Error('Too many requests. Please wait a few minutes and try again.');
        throw new Error('Your request could not be confirmed. Please try again or contact Bohdan below.');
      }
      status.className = 'form-status success';
      status.textContent = 'Your request is confirmed. Opening the download page…';
      success.hidden = false;
      button.hidden = true;
      form.reset();
      window.location.assign(form.dataset.successUrl);
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = error.name === 'AbortError'
        ? 'The connection timed out. Please try again in a moment or contact Bohdan below.'
        : error instanceof TypeError
          ? 'The connection could not be completed. Check your connection and try again, or contact Bohdan below.'
          : error.message;
      status.focus();
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.textContent = 'Get the Free Playbook →';
    }
  });
})();
