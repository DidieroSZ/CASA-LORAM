import { gsap } from 'gsap';
import brandLogo from '../assets/Casa Loram Beige Longhorn Logo.png';

const createIntro = () => {
  const intro = document.createElement('div');
  intro.className = 'cinematic-intro';
  intro.setAttribute('role', 'dialog');
  intro.setAttribute('aria-modal', 'true');
  intro.setAttribute('aria-label', 'Presentación de Casa Loram');
  intro.innerHTML = `
    <div class="cinematic-intro__identity">
      <img class="cinematic-intro__logo" src="${brandLogo}" alt="Casa Loram — Tradición en cada paso" />
      <span class="cinematic-intro__rule" aria-hidden="true"></span>
      <p class="cinematic-intro__tagline">Tradición <i></i> Carácter <i></i> Estilo</p>
    </div>
    `;
  return intro;
};

export const initAnimations = () => {
  const app = document.querySelector('#app');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  const intro = createIntro();
  const identity = intro.querySelector('.cinematic-intro__identity');
  const rule = intro.querySelector('.cinematic-intro__rule');
  const tagline = intro.querySelector('.cinematic-intro__tagline');
  const heroTitle = document.querySelector('#hero-title');
  let timeline;
  let finished = false;
  const cleanup = () => {
    if (finished) return;
    finished = true;
    timeline?.kill();
    motionPreference.removeEventListener('change', handleMotionPreference);
    const shouldRestoreFocus = intro.contains(document.activeElement);
    if (app) app.inert = false;
    intro.remove();
    if (shouldRestoreFocus) heroTitle?.focus({ preventScroll: true });
  };

  const finishImmediately = () => {
    if (timeline) timeline.progress(1);
    else cleanup();
  };

  const handleMotionPreference = (event) => {
    if (event.matches) finishImmediately();
  };

  try {
    app.inert = true;
    document.body.append(intro);
    motionPreference.addEventListener('change', handleMotionPreference);

    timeline = gsap.timeline({ onComplete: cleanup });
    timeline
      .fromTo(identity,
        { autoAlpha: 0, y: 14, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.58, ease: 'power2.out' },
      )
      .fromTo(rule,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.38, ease: 'power2.out' },
        '-=0.12',
      )
      .fromTo(tagline,
        { autoAlpha: 0, y: 7 },
        { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out' },
        '-=0.08',
      )
      .to({}, { duration: 0.58 })
      .to(intro,
        { clipPath: 'inset(0 0 100% 0)', duration: 0.86, ease: 'power2.inOut' },
        '+=0.04',
      )
      .fromTo('.site-header',
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.56, ease: 'power2.out' },
        '<+=0.16',
      )
      .fromTo('.hero__content > *',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' },
        '<+=0.03',
      )
      .fromTo('.hero__image img',
        { scale: 1.035 },
        { scale: 1, duration: 1.15, ease: 'power2.out' },
        '<',
      );
  } catch {
    cleanup();
  }
};
