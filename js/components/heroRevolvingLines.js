/* ============================================================
   VICTORY EMPIRE — HERO UNIVERSE STARS BACKGROUND ANIMATION
   Interactive Galactic Particle & Starfield System
   Reacts to Cursor Movement with 3D Parallax & Luminous Starfield
   ============================================================ */

export function initHeroRevolvingLines() {
  const canvas = document.getElementById('hero-revolving-lines-canvas');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let animationFrameId = null;
  let isVisible = true;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Damped cursor tracking
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let isMouseOver = false;

  const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = mediaQueryReducedMotion.matches;

  // Colors for galaxy stars
  const STAR_COLORS = [
    'rgba(255, 255, 255, ',        // Pure White
    'rgba(255, 255, 255, ',        // Bright Crisp White
    'rgba(192, 132, 252, ',        // Soft Violet Glow (#c084fc)
    'rgba(167, 139, 250, ',        // Accent Purple (#a78bfa)
    'rgba(125, 211, 252, '         // Cyan Nebula Spark (#7dd3fc)
  ];

  let stars = [];
  let nebulae = [];

  function createUniverse() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 140 : 320;
    stars = [];
    nebulae = [];

    // Create Multi-depth Stars
    for (let i = 0; i < count; i++) {
      const depth = 0.1 + Math.random() * 0.9; // 0.1 (far) to 1.0 (near)
      const colorPrefix = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: (0.4 + Math.random() * 1.8) * (0.6 + depth * 0.8),
        depth: depth,
        baseAlpha: 0.15 + depth * 0.7,
        alpha: 0.15 + depth * 0.7,
        twinkleSpeed: 0.008 + Math.random() * 0.025,
        twinklePhase: Math.random() * Math.PI * 2,
        colorPrefix: colorPrefix
      });
    }

    // Create Ambient Floating Nebulae Clouds
    const nebulaCount = isMobile ? 2 : 4;
    for (let n = 0; n < nebulaCount; n++) {
      nebulae.push({
        x: (0.2 + n * 0.25) * width,
        y: (0.3 + (n % 2) * 0.3) * height,
        radius: (200 + Math.random() * 250) * (isMobile ? 0.7 : 1),
        color: n % 2 === 0 ? 'rgba(139, 92, 246, 0.08)' : 'rgba(99, 102, 241, 0.06)',
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.15
      });
    }
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = heroSection.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    if (currentMouseX === 0) {
      targetMouseX = width / 2;
      targetMouseY = height / 2;
      currentMouseX = width / 2;
      currentMouseY = height / 2;
    }

    createUniverse();
    if (prefersReducedMotion) drawFrame();
  }

  let time = 0;

  function drawFrame() {
    time += 0.02;

    // Smooth Damped Mouse Movement
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    const mouseOffsetX = (currentMouseX - width / 2);
    const mouseOffsetY = (currentMouseY - height / 2);

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Ambient Nebulae
    nebulae.forEach(neb => {
      neb.x += neb.driftX;
      neb.y += neb.driftY;

      if (neb.x < -100) neb.x = width + 100;
      if (neb.x > width + 100) neb.x = -100;
      if (neb.y < -100) neb.y = height + 100;
      if (neb.y > height + 100) neb.y = -100;

      // Parallax shift on nebula
      const nebParallaxX = mouseOffsetX * 0.02;
      const nebParallaxY = mouseOffsetY * 0.02;

      const grad = ctx.createRadialGradient(
        neb.x + nebParallaxX, neb.y + nebParallaxY, 0,
        neb.x + nebParallaxX, neb.y + nebParallaxY, neb.radius
      );
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x + nebParallaxX, neb.y + nebParallaxY, neb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw Stars with Parallax and Proximity Cursor Glow
    stars.forEach(star => {
      // Calculate depth-based parallax displacement
      const parallaxX = mouseOffsetX * (star.depth * 0.08);
      const parallaxY = mouseOffsetY * (star.depth * 0.08);

      const renderX = star.x + parallaxX;
      const renderY = star.y + parallaxY;

      // Twinkle calculation
      const twinkle = Math.sin(time * star.twinkleSpeed * 50 + star.twinklePhase);
      let currentAlpha = star.baseAlpha + twinkle * 0.25;
      currentAlpha = Math.max(0.05, Math.min(0.95, currentAlpha));

      // Cursor Proximity Interaction (Stars brighten & swell near mouse)
      const dx = renderX - currentMouseX;
      const dy = renderY - currentMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 180;

      let radiusMultiplier = 1;
      if (dist < maxDist) {
        const proximity = (1 - dist / maxDist);
        currentAlpha = Math.min(1, currentAlpha + proximity * 0.45);
        radiusMultiplier = 1 + proximity * 0.8;

        // Draw subtle star aura line toward cursor for high-depth stars
        if (star.depth > 0.7 && dist < 120 && isMouseOver) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${(proximity * 0.25).toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(renderX, renderY);
          ctx.lineTo(currentMouseX, currentMouseY);
          ctx.stroke();
        }
      }

      // Draw Star Core
      ctx.fillStyle = `${star.colorPrefix}${currentAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(renderX, renderY, star.radius * radiusMultiplier, 0, Math.PI * 2);
      ctx.fill();

      // Outer glow halo for larger/near stars
      if (star.radius * radiusMultiplier > 1.8) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(currentAlpha * 0.35).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius * radiusMultiplier * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function renderLoop() {
    if (!isVisible) return;
    drawFrame();
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  }

  function startLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(renderLoop);
    } else {
      drawFrame();
    }
  }

  // IntersectionObserver to pause loop offscreen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(heroSection);

  // Mouse Interactivity
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    isMouseOver = true;
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    isMouseOver = false;
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
  }, { passive: true });

  // Init
  resizeCanvas();
  startLoop();
}
