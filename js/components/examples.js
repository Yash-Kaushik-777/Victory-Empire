import { CONFIG } from '../config.js';
import { openVideoModal } from './videoModal.js';

// Section 09 — More Examples (compact scroll packets)
export function renderExamples() {
  const track = document.getElementById('examples-grid');
  if (!track) return;

  const items = CONFIG.moreExamples;
  if (!items || !items.length) return;

  track.innerHTML = items.map((item, idx) => `
    <div class="example-pack" data-index="${idx}" style="--pop-i: ${idx}">
      <div class="example-card" role="button" tabindex="0"
           data-video-url="${item.videoUrl}"
           aria-label="Play ${item.title}">
        <video class="example-video-thumb" src="${item.videoUrl}" muted playsinline preload="metadata"></video>
        <div class="example-play-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="example-overlay">
          <span class="example-cat">${item.category}</span>
          <span class="example-title">${item.title}</span>
        </div>
      </div>
    </div>
  `).join('');

  track.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.videoUrl;
      const title = card.querySelector('.example-title')?.textContent || '';
      if (url) openVideoModal(url, title);
    });
  });

  initExamplesScrollPop(track);
}

function initExamplesScrollPop(track) {
  const packs = track.querySelectorAll('.example-pack');
  if (!packs.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    packs.forEach((pack) => pack.classList.add('is-popped'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-popped');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.35
  });

  packs.forEach((pack) => observer.observe(pack));
}
