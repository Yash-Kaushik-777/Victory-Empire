/* ============================================================
   CLIENT TRUST WALL MARQUEE MODULE
   ============================================================ */
import { CONFIG } from '../config.js';

export function renderTrustWall() {
  const containerRow1 = document.getElementById('trust-marquee-1');
  const containerRow2 = document.getElementById('trust-marquee-2');

  if (!containerRow1 || !containerRow2) return;

  const row1Items = CONFIG.clientLogosRow1 || [];
  const row2Items = CONFIG.clientLogosRow2 || [];

  const loopRow1 = [...row1Items, ...row1Items];
  const loopRow2 = [...row2Items, ...row2Items];

  containerRow1.innerHTML = loopRow1.map((item) => `
    <div class="marquee-item" title="${item.name}">
      ${item.html || `<span>${item.name}</span>`}
    </div>
  `).join('');

  containerRow2.innerHTML = loopRow2.map((item) => `
    <div class="marquee-item" title="${item.name}">
      ${item.html || `<span>${item.name}</span>`}
    </div>
  `).join('');
}
