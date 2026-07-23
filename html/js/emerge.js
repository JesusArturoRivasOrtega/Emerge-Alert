(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const progress = document.createElement('div');
  const backToTop = document.createElement('button');

  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Volver al inicio de la página');
  backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.prepend(progress);
  document.body.append(backToTop);

  const setScrollState = () => {
    header?.classList.toggle('scrolled', window.scrollY > 12);
    backToTop.classList.toggle('is-visible', window.scrollY > 520);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0})`;
  };
  setScrollState();
  window.addEventListener('scroll', setScrollState, { passive: true });

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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.focus();
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

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

  const manualLinks = [...document.querySelectorAll('.manual-nav a[href^="#"]')];
  const manualSections = manualLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (manualSections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        manualLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    }), { rootMargin: '-20% 0px -68% 0px' });
    manualSections.forEach((section) => sectionObserver.observe(section));
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
