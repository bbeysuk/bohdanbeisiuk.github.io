(() => {
  const nav = document.querySelector('body > nav');
  if (!nav) return;
  const links = nav.querySelector('.nav-links, .navlinks');
  if (!links) return;
  let toggle = nav.querySelector('.nav-toggle, .toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'bb-menu-toggle';
    toggle.textContent = 'Menu';
    toggle.setAttribute('aria-expanded', 'false');
    nav.insertBefore(toggle, links);
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  if (!links.id) links.id = 'primary-navigation';
  toggle.setAttribute('aria-controls', links.id);
  toggle.setAttribute('aria-label', 'Toggle navigation menu');
  const close = () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  links.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('click', event => { if (!nav.contains(event.target)) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links.classList.contains('open')) { close(); toggle.focus(); }
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', close);
})();
