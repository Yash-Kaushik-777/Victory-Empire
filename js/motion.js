/* ============================================================
   MOTION & SCROLL ANIMATION MODULE
   ============================================================ */

export function initMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.18
  });

  const headingTargets = document.querySelectorAll(
    '.section-header, .proof-panel-centered, .clients-title, .process-flip-header, .outro-top'
  );

  headingTargets.forEach((el) => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
  });

  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.example-pack, .process-flip-card, .work-nav-item, .accordion-item'
  ).forEach((el, i) => {
    el.classList.add('scroll-reveal-item');
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.08}s`;
    cardObserver.observe(el);
  });
}
