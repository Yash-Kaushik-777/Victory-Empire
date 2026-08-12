/* ============================================================
   VICTORY EMPIRE — HOW WE WORK (FLIP CARDS)
   Inspired by editorial card layout with hover flip reveal.
   ============================================================ */
import { CONFIG } from '../config.js';

const PROCESS_GRAPHICS = {
  scan: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="44" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
      <circle cx="60" cy="60" r="28" stroke="rgba(255,255,255,0.55)" stroke-width="1.2"/>
      <circle cx="60" cy="60" r="12" stroke="rgba(200,180,255,0.75)" stroke-width="1.2"/>
      <line x1="60" y1="16" x2="60" y2="104" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
      <circle cx="78" cy="42" r="3" fill="#C084FC"/>
    </svg>
  `,
  build: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 72 L60 52 L96 72 L60 92 Z" stroke="#E8A090" stroke-width="1.2" opacity="0.45"/>
      <path d="M34 58 L60 42 L86 58 L60 74 Z" stroke="#E8A090" stroke-width="1.2" opacity="0.65"/>
      <path d="M44 44 L60 34 L76 44 L60 54 Z" stroke="#E8A090" stroke-width="1.2" opacity="0.85"/>
      <circle cx="60" cy="44" r="2.5" fill="#E8A090"/>
    </svg>
  `,
  system: `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="4" fill="#E8A090"/>
      <line x1="60" y1="60" x2="60" y2="24" stroke="#E8A090" stroke-width="1.2" opacity="0.7"/>
      <line x1="60" y1="60" x2="92" y2="76" stroke="#E8A090" stroke-width="1.2" opacity="0.7"/>
      <line x1="60" y1="60" x2="28" y2="76" stroke="#E8A090" stroke-width="1.2" opacity="0.7"/>
      <line x1="60" y1="60" x2="84" y2="38" stroke="#E8A090" stroke-width="1.2" opacity="0.7"/>
      <line x1="60" y1="60" x2="36" y2="38" stroke="#E8A090" stroke-width="1.2" opacity="0.7"/>
      <circle cx="60" cy="24" r="8" stroke="#E8A090" stroke-width="1.2"/>
      <circle cx="92" cy="76" r="8" stroke="#E8A090" stroke-width="1.2"/>
      <circle cx="28" cy="76" r="8" stroke="#E8A090" stroke-width="1.2"/>
      <circle cx="84" cy="38" r="8" stroke="#E8A090" stroke-width="1.2"/>
      <circle cx="36" cy="38" r="8" stroke="#E8A090" stroke-width="1.2"/>
    </svg>
  `
};

const STAGE_GRAPHIC_KEYS = ['scan', 'build', 'system'];

export function initProcessScroll() {
  const root = document.getElementById('process-root');
  if (!root) return;

  const stages = CONFIG.processStages || [];

  root.innerHTML = `
    <div class="process-flip-section">
      <div class="container">
        <div class="process-flip-header">
          <h2 class="process-flip-title">How we work</h2>
          <p class="process-flip-subtitle">No lengthy processes like typical agencies. Just engineers, filmmakers, and world-class creatives who move fast.</p>
        </div>

        <div class="process-flip-grid">
          ${stages.map((stage, index) => `
            <article class="process-flip-card">
              <div class="process-flip-inner">
                <div class="process-flip-front">
                  <div class="process-flip-graphic">
                    ${PROCESS_GRAPHICS[STAGE_GRAPHIC_KEYS[index]] || PROCESS_GRAPHICS.scan}
                  </div>
                  <h3 class="process-flip-heading">${stage.title}</h3>
                </div>
                <div class="process-flip-back">
                  <p class="process-flip-desc">${stage.description}</p>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
