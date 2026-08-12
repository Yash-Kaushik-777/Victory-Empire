/* ============================================================
   VICTORY EMPIRE — TESTIMONIALS (CONTINUOUS HORIZONTAL CAROUSEL)
   Auto-scrolling review cards with avatar sync + center focus.
   ============================================================ */
import { CONFIG } from '../config.js';

export function initTestimonialsCarousel() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  const items = CONFIG.testimonials;
  if (!items || !items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loopCopies = 3;
  const looped = [];

  for (let copy = 0; copy < loopCopies; copy++) {
    items.forEach((item, idx) => looped.push({ ...item, origIdx: idx }));
  }

  container.innerHTML = buildHTML(items, looped);

  const wrapper = container.querySelector('.testimonial-track-wrapper');
  const track = container.querySelector('.testimonial-track-auto');
  const cards = Array.from(container.querySelectorAll('.testimonial-slide-card'));
  const avatarBtns = Array.from(container.querySelectorAll('.testimonial-avatar-btn'));

  if (!wrapper || !track || !cards.length) return;

  let offset = 0;
  let speed = prefersReducedMotion ? 0 : 0.72;
  let paused = false;
  let pauseUntil = 0;
  let activeIdx = Math.floor(items.length / 2);
  let setWidth = 0;
  let rafId = null;

  function gapPx() {
    const style = getComputedStyle(track);
    return parseFloat(style.gap) || 24;
  }

  function measureSetWidth() {
    const gap = gapPx();
    let width = 0;
    for (let i = 0; i < items.length; i++) {
      width += cards[i].offsetWidth + (i < items.length - 1 ? gap : 0);
    }
    return width;
  }

  function centerCard(card) {
    return card.offsetLeft + card.offsetWidth / 2;
  }

  function scrollToCard(card, pauseMs = 3200) {
    const target = centerCard(card) - wrapper.clientWidth / 2;
    offset = target;
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    pauseUntil = Date.now() + pauseMs;
  }

  function initPosition() {
    setWidth = measureSetWidth();
    const startIdx = items.length + Math.floor(items.length / 2);
    scrollToCard(cards[startIdx], 0);
    updateActiveFromCenter();
  }

  function updateActiveFromCenter() {
    const wrapRect = wrapper.getBoundingClientRect();
    const centerX = wrapRect.left + wrapRect.width / 2;

    let closest = 0;
    let minDist = Infinity;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - centerX);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    const origIdx = parseInt(cards[closest].dataset.origIdx, 10);

    if (origIdx !== activeIdx) {
      activeIdx = origIdx;
      avatarBtns.forEach((btn, i) => btn.classList.toggle('is-active', i === origIdx));
    }

    cards.forEach((card, i) => {
      const dist = Math.abs(i - closest);
      card.classList.toggle('is-active', i === closest);
      card.classList.toggle('is-neighbor', dist === 1);
      card.classList.toggle('is-dimmed', dist > 1);
    });
  }

  function normalizeOffset() {
    if (!setWidth) return;
    while (offset >= setWidth * 2) offset -= setWidth;
    while (offset < setWidth * 0.25) offset += setWidth;
  }

  function tick() {
    if (!paused && !prefersReducedMotion && Date.now() > pauseUntil) {
      offset += speed;
      normalizeOffset();
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }
    updateActiveFromCenter();
    rafId = requestAnimationFrame(tick);
  }

  avatarBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const target = cards[items.length + i];
      if (target) scrollToCard(target);
    });
  });

  wrapper.addEventListener('mouseenter', () => { paused = true; });
  wrapper.addEventListener('mouseleave', () => { paused = false; });

  let touchStartX = 0;
  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    paused = true;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    offset += diff;
    normalizeOffset();
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    paused = false;
    pauseUntil = Date.now() + 2000;
  }, { passive: true });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initPosition();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    });
  });

  window.addEventListener('resize', () => {
    setWidth = measureSetWidth();
    const mid = items.length + activeIdx;
    if (cards[mid]) scrollToCard(cards[mid], 0);
  }, { passive: true });
}

function buildHTML(items, looped) {
  return `
    <div class="testimonial-avatar-row">
      ${items.map((t, i) => `
        <button class="testimonial-avatar-btn${i === Math.floor(items.length / 2) ? ' is-active' : ''}"
                type="button"
                data-idx="${i}"
                aria-label="View testimonial from ${t.name}">
          <img src="${t.portraitUrl}" alt="${t.name}" loading="lazy" />
        </button>
      `).join('')}
    </div>

    <div class="testimonial-track-wrapper">
      <div class="testimonial-track-auto">
        ${looped.map((t) => `
          <article class="testimonial-slide-card" data-orig-idx="${t.origIdx}">
            <div class="testimonial-brackets" aria-hidden="true">
              <span class="testimonial-bracket testimonial-bracket-tl"></span>
              <span class="testimonial-bracket testimonial-bracket-tr"></span>
              <span class="testimonial-bracket testimonial-bracket-bl"></span>
              <span class="testimonial-bracket testimonial-bracket-br"></span>
            </div>
            <p class="testimonial-quote-text">${t.quote}</p>
            <div class="testimonial-author-meta">
              <img src="${t.portraitUrl}" alt="${t.name}" class="testimonial-author-avatar" loading="lazy" />
              <div class="testimonial-author-info">
                <p class="testimonial-author-name">${t.name}</p>
                <p class="testimonial-author-role">${t.role} &mdash; <span class="company-accent">${t.company}</span></p>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
      <div class="testimonial-focus-accent" aria-hidden="true"></div>
    </div>
  `;
}
