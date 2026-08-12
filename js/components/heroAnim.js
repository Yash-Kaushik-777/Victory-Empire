/* Hero text stagger reveal + stat counters */

export function initHeroAnim() {
  initHeroStars();
  initHeroTextReveal();
  initStatCounters();
}

function initHeroStars() {
  const canvas = document.getElementById('hero-stars-canvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let rafId = null;
  let width = 0;
  let height = 0;

  const createStars = (count) => {
    stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random() * 0.78,
      radius: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.55 + 0.25,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.004,
      tint: Math.random() > 0.82 ? 'purple' : 'white',
    }));
  };

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars(Math.max(90, Math.floor((width * height) / 9000)));
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      const flicker = 0.55 + Math.sin(time * 0.001 * star.speed * 60 + star.twinkle) * 0.45;
      const alpha = star.alpha * flicker;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.tint === 'purple'
        ? `rgba(192, 132, 252, ${alpha})`
        : `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });

    rafId = requestAnimationFrame(draw);
  };

  resize();
  rafId = requestAnimationFrame(draw);

  const ro = new ResizeObserver(resize);
  ro.observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      rafId = requestAnimationFrame(draw);
    }
  });
}

function initHeroTextReveal() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const run = () => {
    hero.querySelectorAll('.hero-reveal-item').forEach((el, i) => {
      el.style.transitionDelay = `${0.12 + i * 0.11}s`;
      el.classList.add('is-visible');
    });
  };

  const intro = document.getElementById('intro');
  if (!intro || intro.classList.contains('intro-hidden')) {
    requestAnimationFrame(run);
    return;
  }

  const observer = new MutationObserver(() => {
    if (intro.classList.contains('intro-hidden')) {
      observer.disconnect();
      setTimeout(run, 200);
    }
  });
  observer.observe(intro, { attributes: true, attributeFilter: ['class'] });

  setTimeout(run, 3000);
}

function initStatCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  counters.forEach((el) => observer.observe(el));
}
