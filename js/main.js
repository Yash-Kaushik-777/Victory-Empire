/* ============================================================
   VICTORY EMPIRE — MAIN APPLICATION BOOTSTRAPPER (REDESIGN PASS)
   ============================================================ */
import { CONFIG } from './config.js';
import { initIntro } from './components/intro.js';
import { initNavbar } from './components/navbar.js';
import { renderTrustWall } from './components/marquee.js';
import { renderPortfolio } from './components/portfolio.js';
import { renderExamples } from './components/examples.js';
import { renderFAQ } from './components/accordion.js';
import { initVideoModal, openVideoModal } from './components/videoModal.js';
import { initContentEngine } from './components/contentEngine.js';
import { initProcessScroll } from './components/processScroll.js';
import { initTestimonialsCarousel } from './components/testimonials.js';
import { initHeroAnim } from './components/heroAnim.js';
import { initOutro } from './components/outro.js';
import { initMotion } from './motion.js';

document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initNavbar();
  renderTrustWall();
  initContentEngine();
  renderPortfolio();
  initProcessScroll();
  renderExamples();
  initTestimonialsCarousel();
  renderFAQ();
  initVideoModal();
  initHeroTrigger();
  initHeroAnim();
  initMotion();
  initOutro();
  bindCTALinks();
});

function initHeroTrigger() {
  const heroTrigger = document.getElementById('hero-media-trigger');
  if (!heroTrigger) return;

  heroTrigger.addEventListener('click', () => {
    const youtubeId = heroTrigger.getAttribute('data-youtube-id') || CONFIG.heroVideo.youtubeId;
    openVideoModal(youtubeId, 'Victory Empire Hero Feature');
  });
}

function bindCTALinks() {
  const bookingBtns = document.querySelectorAll('.btn-booking');
  bookingBtns.forEach(btn => {
    btn.setAttribute('href', CONFIG.launchDependencies.bookingUrl);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  const igLink = document.getElementById('link-instagram');
  if (igLink) igLink.setAttribute('href', CONFIG.launchDependencies.instagramUrl);

  const ytLink = document.getElementById('link-youtube');
  if (ytLink) ytLink.setAttribute('href', CONFIG.launchDependencies.youtubeUrl);

  const liLink = document.getElementById('link-linkedin');
  if (liLink) liLink.setAttribute('href', CONFIG.launchDependencies.linkedinUrl);

  const ltLink = document.getElementById('link-linktree');
  if (ltLink) ltLink.setAttribute('href', CONFIG.launchDependencies.linktreeUrl);
}
