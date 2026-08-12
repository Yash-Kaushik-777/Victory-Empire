/* ============================================================
   PORTFOLIO MODULE (SECTION 06) — SELECTED WORK
   Click-based category navigation: clicking a topic on the right
   switches the video on the left. No scroll pinning, no blank space.
   ============================================================ */
import { CONFIG } from '../config.js';
import { openVideoModal } from './videoModal.js';

export function renderPortfolio() {
  const root = document.getElementById('work');
  if (!root) return;

  const items = CONFIG.selectedWork;
  if (!items || !items.length) return;

  // Replace the inner container content with the new layout
  const container = root.querySelector('.container');
  if (!container) return;

  // Keep the section header, replace the grid/filter divs
  const header = container.querySelector('.section-header');
  const headerHTML = header ? header.outerHTML : '';

  container.innerHTML = `
    ${headerHTML}
    <div class="work-layout">
      <!-- Left: Video Frame -->
      <div class="work-video-col">
        <div class="work-video-frame" id="work-video-frame">
          <img
            id="work-poster"
            src="${items[0].posterUrl}"
            alt="${items[0].title}"
            class="work-poster-img"
          />
          <div class="work-video-overlay">
            <button class="work-play-btn" id="work-play-btn" aria-label="Play video">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          <div class="work-video-label" id="work-video-label">
            <span class="work-label-cat" id="work-label-cat">${items[0].category}</span>
            <span class="work-label-title" id="work-label-title">${items[0].title}</span>
          </div>
        </div>
      </div>

      <!-- Right: Category Navigation List -->
      <div class="work-nav-col">
        <ul class="work-nav-list" id="work-nav-list">
          ${items.map((item, idx) => `
            <li class="work-nav-item ${idx === 0 ? 'is-active' : ''}" data-idx="${idx}" role="button" tabindex="0" aria-label="View ${item.category}">
              <span class="work-nav-num">${String(idx + 1).padStart(2, '0')}</span>
              <div class="work-nav-info">
                <span class="work-nav-cat">${item.category}</span>
                <span class="work-nav-desc">${item.title}</span>
              </div>
              <span class="work-nav-arrow">→</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;

  // --- Wire up interactions ---
  const frame = container.querySelector('#work-video-frame');
  const poster = container.querySelector('#work-poster');
  const labelCat = container.querySelector('#work-label-cat');
  const labelTitle = container.querySelector('#work-label-title');
  const playBtn = container.querySelector('#work-play-btn');
  const navItems = Array.from(container.querySelectorAll('.work-nav-item'));

  let activeIdx = 0;

  function activate(idx) {
    if (idx === activeIdx && idx !== 0) return;
    activeIdx = idx;
    const item = items[idx];

    // Fade transition
    frame.classList.add('is-switching');
    setTimeout(() => {
      poster.src = item.posterUrl;
      poster.alt = item.title;
      labelCat.textContent = item.category;
      labelTitle.textContent = item.title;
      frame.classList.remove('is-switching');
    }, 220);

    navItems.forEach((el, i) => {
      el.classList.toggle('is-active', i === idx);
    });
  }

  navItems.forEach((el, i) => {
    el.addEventListener('click', () => activate(i));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') activate(i);
    });
  });

  // Click play button or frame to open modal
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = items[activeIdx];
      if (item && item.youtubeId) openVideoModal(item.youtubeId, item.title);
    });
  }
  if (frame) {
    frame.addEventListener('click', () => {
      const item = items[activeIdx];
      if (item && item.youtubeId) openVideoModal(item.youtubeId, item.title);
    });
  }
}
