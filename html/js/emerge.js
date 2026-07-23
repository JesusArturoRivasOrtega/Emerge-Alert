(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const copyButton = document.querySelector('[data-copy-emergency]');
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('911');
      copyButton.textContent = '911 copiado';
      window.setTimeout(() => { copyButton.textContent = 'Copiar número'; }, 1800);
    } catch (_) {
      copyButton.textContent = 'Número: 911';
    }
  });
})();
