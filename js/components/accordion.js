/* ============================================================
   ACCORDION MODULE (SECTION 12 FAQ)
   ============================================================ */
import { CONFIG } from '../config.js';

export function renderFAQ() {
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  const faqs = CONFIG.faq;
  container.innerHTML = faqs.map((item, idx) => `
    <div class="accordion-item" data-index="${idx}">
      <button class="accordion-header" aria-expanded="false" aria-controls="faq-ans-${idx}" id="faq-head-${idx}">
        <span>${item.question}</span>
        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <div class="accordion-body" id="faq-ans-${idx}" role="region" aria-labelledby="faq-head-${idx}">
        <div class="accordion-content">
          <p>${item.answer}</p>
        </div>
      </div>
    </div>
  `).join('');

  // Accordion toggle behavior
  const items = container.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
        const otherBody = otherItem.querySelector('.accordion-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}
