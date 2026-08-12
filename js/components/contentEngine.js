/* ============================================================
   VICTORY EMPIRE — SECTION 05: CONTENT ENGINE
   Cursor-reactive orbit cards + master core concept
   ============================================================ */
import { CONFIG } from '../config.js';

export function initContentEngine() {
  const stage = document.getElementById('engine-orbit-stage');
  const header = document.querySelector('.engine-header');
  if (!stage) return;

  if (header) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) header.classList.add('is-revealed');
      });
    }, { threshold: 0.2 });
    observer.observe(header);
  }

  const cardsData = CONFIG.contentEngine;

  stage.innerHTML = `
    <div class="engine-master-card" id="engine-master-card">
      <div class="engine-master-badge-wrap">
        <span class="engine-master-dot"></span>
        <span class="engine-master-badge">CORE CONCEPT</span>
      </div>
      <h3 class="engine-master-title">1 STRATEGIC RECORDING SESSION</h3>
      <p class="engine-master-desc">A single high-yield studio recording session mapped directly to your brand narrative.</p>
    </div>
    <div class="engine-orbit-cards-wrap" id="engine-orbit-cards-wrap">
      ${cardsData.map((item, idx) => `
        <div class="engine-orbit-card" data-idx="${idx}">
          <div class="engine-card-inner">
            <div class="engine-card-tag">${item.tag}</div>
            <h4 class="engine-card-title">${item.title}</h4>
            <div class="engine-card-desc-wrap">
              <p class="engine-card-desc">${item.desc}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  const masterCard = document.getElementById('engine-master-card');
  const cardElements = Array.from(stage.querySelectorAll('.engine-orbit-card'));

  let currentAngle = 0;
  let targetSpeed = 0.0022;
  let currentSpeed = 0.0022;
  let hoveredCard = null;
  let rafId = null;
  let pointer = { x: 0.5, y: 0.5, active: false };

  function getRadii() {
    const stageWidth = stage.offsetWidth || window.innerWidth;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return { rx: Math.min(stageWidth * 0.42, 160), ry: 130 };
    if (window.innerWidth < 1024) return { rx: Math.min(stageWidth * 0.44, 300), ry: 160 };
    return { rx: Math.min(stageWidth * 0.45, 420), ry: 200 };
  }

  function updatePositions() {
    const { rx, ry } = getRadii();
    const stageWidth = stage.offsetWidth;
    const stageHeight = stage.offsetHeight;
    const cx = stageWidth / 2;
    const cy = stageHeight / 2;

    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    currentAngle += currentSpeed;

    const rect = stage.getBoundingClientRect();
    const mx = pointer.active ? pointer.x * stageWidth : cx;
    const my = pointer.active ? pointer.y * stageHeight : cy;

    cardElements.forEach((card, idx) => {
      const isHovered = card === hoveredCard;
      const angle = currentAngle + (idx * ((Math.PI * 2) / cardElements.length));

      let x = cx + rx * Math.cos(angle);
      let y = cy + ry * Math.sin(angle);

      const cardRect = { left: rect.left + x - 80, top: rect.top + y - 60, width: 160, height: 120 };
      const cardCx = cardRect.left + cardRect.width / 2;
      const cardCy = cardRect.top + cardRect.height / 2;
      const dx = mx - (rect.left + x);
      const dy = my - (rect.top + y);
      const dist = Math.hypot(dx, dy);
      const magnet = pointer.active ? Math.max(0, 1 - dist / 280) : 0;

      if (magnet > 0 && !isHovered) {
        x += dx * magnet * 0.08;
        y += dy * magnet * 0.08;
      }

      const depth = (Math.sin(angle) + 1) / 2;
      const scale = isHovered ? 1.18 : (0.82 + depth * 0.22 + magnet * 0.06);
      const zIndex = isHovered ? 500 : Math.round(10 + depth * 100);
      const opacity = isHovered ? 1 : (hoveredCard ? 0.35 : (0.65 + depth * 0.35));

      const tiltX = pointer.active ? ((my - (rect.top + y)) / stageHeight) * -12 : 0;
      const tiltY = pointer.active ? ((mx - (rect.left + x)) / stageWidth) * 12 : 0;

      card.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.zIndex = zIndex;
      card.style.opacity = opacity;

      card.classList.toggle('is-hovered', isHovered);
      card.classList.toggle('is-magnetic', magnet > 0.15 && !isHovered);
      card.classList.toggle('is-dimmed', hoveredCard !== null && !isHovered);
    });

    if (masterCard && pointer.active) {
      const mdx = (mx - cx) / stageWidth;
      const mdy = (my - cy) / stageHeight;
      masterCard.style.transform = `translate(${mdx * 8}px, ${mdy * 8}px) rotateX(${mdy * -4}deg) rotateY(${mdx * 4}deg)`;
    } else if (masterCard) {
      masterCard.style.transform = '';
    }
  }

  function renderLoop() {
    updatePositions();
    rafId = requestAnimationFrame(renderLoop);
  }

  cardElements.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      hoveredCard = card;
      targetSpeed = 0;
    });
    card.addEventListener('mouseleave', () => {
      if (hoveredCard === card) {
        hoveredCard = null;
        targetSpeed = 0.0022;
      }
    });
  });

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) / rect.width;
    pointer.y = (e.clientY - rect.top) / rect.height;
    pointer.active = true;
    stage.classList.add('is-cursor-active');
  });

  stage.addEventListener('mouseleave', () => {
    pointer.active = false;
    stage.classList.remove('is-cursor-active');
  });

  window.addEventListener('resize', updatePositions, { passive: true });

  if (rafId) cancelAnimationFrame(rafId);
  renderLoop();
}
