export const initInteractions = () => {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-navigation');
  if (!toggle || !navigation) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    navigation.classList.remove('is-open');
  };

  const mobileQuery = window.matchMedia('(max-width: 700px)');
  const syncMenuState = () => {
    if (!mobileQuery.matches) closeMenu();
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (mobileQuery.matches && toggle.getAttribute('aria-expanded') === 'true'
      && !navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  mobileQuery.addEventListener('change', syncMenuState);

  const navLinks = [...navigation.querySelectorAll('[data-nav-link]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.1, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
  }
};
