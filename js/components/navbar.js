/* ============================================================
   NAVBAR COMPONENT MODULE
   ============================================================ */

const NAV_SECTIONS = ['hero', 'work', 'process', 'testimonials', 'faq'];

export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach((link) => link.classList.remove('nav-link-active', 'active'));

  function updateActiveNav() {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = 'hero';

    NAV_SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      if (scrollPos >= section.offsetTop) {
        currentId = id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isMatch = href === `#${currentId}`;
      link.classList.toggle('active', isMatch);
      link.classList.toggle('nav-link-active', isMatch);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  mobileToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('active');
      mobileToggle?.classList.remove('active');
    });
  });
}
