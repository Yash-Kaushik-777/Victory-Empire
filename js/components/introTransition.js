/* ============================================================
   VICTORY EMPIRE — EXACT IMAGE 1 (INTRO) → IMAGE 2 (HERO) ENGINE
   Matches Image 1 (Opening Screen) and Image 2 (Hero Landing Page):
   1. Opening Screen (Image 1): Centered 3D Globe with embedded Crown + VICTORY EMPIRE stacked text, metallic tile floor, purple horizon flare, and diamond star flare on bottom-right.
   2. Hero Section (Image 2): Flying logo glides to header, 3D Earth continent globe with 4 orbital rings glides to right side with 4 floating labels around it. Text & buttons on left with soft floor reflections.
   3. Secluded Hero: Hero canvas switches to absolute position inside #hero when settled, keeping the hero section completely separate from the rest of the website.
   ============================================================ */

export function initIntroTransition() {
  const canvas = document.getElementById('hero-revolving-lines-canvas');
  const heroSection = document.getElementById('hero');
  const introEl = document.getElementById('intro');
  const introBranding = document.getElementById('intro-branding');
  const navbar = document.getElementById('navbar');
  const heroContent = document.querySelector('.hero-content');
  const heroSphereArea = document.querySelector('.hero-sphere-area');
  const heroSphereTarget = document.getElementById('hero-sphere-target');

  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Check reduced motion preference
  const mediaQueryReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = mediaQueryReduced.matches;

  // Screen dimensions & DPR
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Mouse tracking & 3D Parallax
  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = width / 2;
  let targetMouseY = height / 2;

  // Timeline Progress (0 = Intro Image 1, 1 = Settled Hero Image 2)
  let startTime = null;
  let progress = 0;
  let isSettled = false;
  let animationFrameId = null;

  // SLOW Orbital Rotation
  let rotX = 0.25;
  let rotY = 0;
  let rotZ = 0.1;

  // Colors
  const STAR_COLORS = [
    'rgba(255, 255, 255, ',
    'rgba(192, 132, 252, ',
    'rgba(167, 139, 250, ',
    'rgba(125, 211, 252, '
  ];

  let stars = [];
  let earthParticles = [];
  let orbitalRings = [];

  // Continent Sampling Polygons for 3D Earth Globe
  const CONTINENT_BOXES = [
    { minLat: 0.25, maxLat: 1.2, minLon: -2.8, maxLon: -0.9 },  // North America
    { minLat: -0.95, maxLat: 0.2, minLon: -1.4, maxLon: -0.6 }, // South America
    { minLat: 0.6, maxLat: 1.2, minLon: -0.15, maxLon: 0.75 },   // Europe
    { minLat: -0.6, maxLat: 0.6, minLon: -0.3, maxLon: 0.9 },     // Africa
    { minLat: 0.15, maxLat: 1.25, minLon: 0.8, maxLon: 2.5 },   // Asia
    { minLat: -0.75, maxLat: -0.18, minLon: 1.9, maxLon: 2.7 }  // Australia
  ];

  function isPointOnContinent(lat, lon) {
    for (let box of CONTINENT_BOXES) {
      if (lat >= box.minLat && lat <= box.maxLat && lon >= box.minLon && lon <= box.maxLon) {
        const noise = Math.sin(lat * 8) * Math.cos(lon * 8);
        return noise > -0.45;
      }
    }
    return false;
  }

  function initUniverse() {
    const isMobile = width < 991;
    const starCount = isMobile ? 120 : 280;
    stars = [];

    for (let i = 0; i < starCount; i++) {
      const depth = 0.1 + Math.random() * 0.9;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: (0.4 + Math.random() * 1.5) * (0.6 + depth * 0.7),
        depth: depth,
        baseAlpha: 0.15 + depth * 0.7,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        colorPrefix: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
      });
    }

    // 3D Earth Point Cloud Globe
    earthParticles = [];
    const numLat = isMobile ? 48 : 72;
    const numLon = isMobile ? 96 : 144;

    for (let i = 0; i < numLat; i++) {
      const lat = ((i / numLat) - 0.5) * Math.PI;
      const cosLat = Math.cos(lat);
      const sinLat = Math.sin(lat);

      for (let j = 0; j < numLon; j++) {
        const lon = ((j / numLon) - 0.5) * Math.PI * 2;
        const isLand = isPointOnContinent(lat, lon);

        if (isLand || (i % 6 === 0 && j % 8 === 0)) {
          earthParticles.push({
            x: cosLat * Math.sin(lon),
            y: -sinLat,
            z: cosLat * Math.cos(lon),
            isLand: isLand,
            size: isLand ? (1.0 + Math.random() * 0.8) : 0.6,
            baseAlpha: isLand ? (0.45 + Math.random() * 0.5) : 0.18
          });
        }
      }
    }

    // 4 Thin Wireframe Orbital Rings
    orbitalRings = [
      { pitch: 0.2,  yaw: 0,     roll: 0.25,  radiusScale: 1.08, color: 'rgba(192, 132, 252, ' },
      { pitch: 1.1,  yaw: 0.4,   roll: -0.3,  radiusScale: 1.15, color: 'rgba(167, 139, 250, ' },
      { pitch: -0.85,yaw: 0.85,  roll: 0.55,  radiusScale: 1.22, color: 'rgba(125, 211, 252, ' },
      { pitch: 0.45, yaw: -1.25, roll: -0.45, radiusScale: 1.28, color: 'rgba(255, 255, 255, ' }
    ];
  }

  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = isSettled ? rect.height : window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    initUniverse();
  }

  // 3D Matrix Projection Helper
  function project3D(x, y, z, cx, cy, radius, rx, ry, rz) {
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;

    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;

    const cosZ = Math.cos(rz), sinZ = Math.sin(rz);
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;

    const perspective = 650;
    const scale = perspective / (perspective + z2 * radius * 0.75);

    return {
      px: cx + x3 * radius * scale,
      py: cy + y3 * radius * scale,
      pz: z2,
      scale: scale
    };
  }

  function cubicEase(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Helper to draw Diamond Star Flare ✦
  function drawDiamondStar(cx, cy, size, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
    ctx.shadowColor = 'rgba(192, 132, 252, 0.9)';
    ctx.shadowBlur = 16;

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  let time = 0;

  function render(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;

    // Timeline Calculation
    if (prefersReducedMotion) {
      progress = 1.0;
    } else {
      const transitionDuration = 2.2;
      const holdTime = 1.2;
      if (elapsed < holdTime) {
        progress = 0;
      } else {
        progress = Math.min(1.0, (elapsed - holdTime) / transitionDuration);
      }
    }

    const easedProgress = cubicEase(progress);

    // Mouse Damping
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    const mouseOffsetX = (mouseX - width / 2) * 0.03;
    const mouseOffsetY = (mouseY - height / 2) * 0.03;

    // SLOW Rotation Cycle
    time += 0.01;
    rotY = time * 0.16;
    rotX = 0.25 + Math.sin(time * 0.08) * 0.04 + mouseOffsetY * 0.004;

    ctx.clearRect(0, 0, width, height);

    // 1. DRAW DEEP SPACE STARFIELD
    stars.forEach(star => {
      const px = star.x + mouseOffsetX * star.depth * 0.8;
      const py = star.y + mouseOffsetY * star.depth * 0.8;
      const twinkle = Math.sin(time * star.twinkleSpeed * 40 + star.twinklePhase);
      const currentAlpha = Math.max(0.05, Math.min(0.95, star.baseAlpha + twinkle * 0.2));

      ctx.fillStyle = `${star.colorPrefix}${currentAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. DRAW METALLIC TILE FLOOR & PURPLE HORIZON FLARE (Image 1 & Image 2)
    const horizonY = height * 0.74;

    // Metallic Floor Gradient
    const floorGrad = ctx.createLinearGradient(0, horizonY - 20, 0, height);
    floorGrad.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    floorGrad.addColorStop(0.15, 'rgba(18, 14, 28, 0.88)');
    floorGrad.addColorStop(1, 'rgba(5, 5, 5, 0.98)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, horizonY - 20, width, height - horizonY + 20);

    // Metallic Tile Perspective Grid Lines
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.18)';
    ctx.lineWidth = 0.8;

    for (let i = 0; i < 8; i++) {
      const py = horizonY + Math.pow(i / 7, 2) * (height - horizonY);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    const numRays = 14;
    for (let r = 0; r <= numRays; r++) {
      const rx = (r / numRays) * width;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, horizonY);
      ctx.lineTo((rx - width * 0.5) * 2.5 + width * 0.5, height);
      ctx.stroke();
    }

    // Horizon Bright Purple Light Source Flare
    const flareRadius = width * 0.45;
    const flareGrad = ctx.createRadialGradient(
      width * 0.5, horizonY, 0,
      width * 0.5, horizonY, flareRadius
    );
    flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
    flareGrad.addColorStop(0.08, 'rgba(192, 132, 252, 0.75)');
    flareGrad.addColorStop(0.3, 'rgba(139, 92, 246, 0.38)');
    flareGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');

    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, horizonY - 60, width, 120);

    // Sharp Horizon Edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(width, horizonY);
    ctx.stroke();

    // Bottom-Right Metallic Floor Diamond Star Flare ✦ (As in Image 1 & Image 2)
    drawDiamondStar(width * 0.9, height * 0.85, 14, 0.85);

    // 3. COMPUTE SPHERE TRANSFORMATION
    const isMobile = width < 991;
    let targetCenterX = width * 0.5;
    let targetCenterY = height * 0.48;

    if (heroSphereTarget) {
      const rect = heroSphereTarget.getBoundingClientRect();
      targetCenterX = rect.left + rect.width / 2;
      targetCenterY = rect.top + rect.height / 2;
    } else {
      targetCenterX = isMobile ? width * 0.5 : width * 0.74;
      targetCenterY = isMobile ? height * 0.72 : height * 0.46;
    }

    const startCenterX = width * 0.5;
    const startCenterY = height * 0.45;

    const sphereX = startCenterX + (targetCenterX - startCenterX) * easedProgress + mouseOffsetX * 0.5;
    const sphereY = startCenterY + (targetCenterY - startCenterY) * easedProgress + mouseOffsetY * 0.5;

    const startRadius = isMobile ? 180 : 255;
    const endRadius = isMobile ? 135 : 185;
    const sphereRadius = startRadius + (endRadius - startRadius) * easedProgress;

    // 4. DRAW 3D SLOW ORBITAL RINGS
    orbitalRings.forEach(ring => {
      const ringPoints = [];
      const numSegs = isMobile ? 48 : 72;
      const ringRadius = sphereRadius * ring.radiusScale;

      for (let s = 0; s <= numSegs; s++) {
        const theta = (s / numSegs) * Math.PI * 2;
        const rx0 = Math.cos(theta);
        const ry0 = Math.sin(theta);
        const rz0 = 0;

        const proj = project3D(
          rx0, ry0, rz0,
          sphereX, sphereY, ringRadius,
          rotX + ring.pitch, rotY + ring.yaw, rotZ + ring.roll
        );
        ringPoints.push(proj);
      }

      ctx.lineWidth = isMobile ? 1.0 : 1.25;
      for (let i = 0; i < ringPoints.length - 1; i++) {
        const p1 = ringPoints[i];
        const p2 = ringPoints[i + 1];
        const avgZ = (p1.pz + p2.pz) / 2;
        const depthAlpha = Math.max(0.08, Math.min(0.85, 0.45 + avgZ * 0.4));

        ctx.strokeStyle = `${ring.color}${depthAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
    });

    // 5. DRAW 3D EARTH CONTINENT POINT CLOUD GLOBE
    earthParticles.forEach(pt => {
      const proj = project3D(pt.x, pt.y, pt.z, sphereX, sphereY, sphereRadius, rotX, rotY, rotZ);
      if (proj.pz < -0.65) return;

      const depthAlpha = Math.max(0.08, Math.min(0.98, pt.baseAlpha + proj.pz * 0.45));
      const renderSize = pt.size * proj.scale;

      if (pt.isLand) {
        ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, renderSize, 0, Math.PI * 2);
        ctx.fill();

        if (proj.pz > 0.2) {
          ctx.fillStyle = `rgba(192, 132, 252, ${(depthAlpha * 0.45).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, renderSize * 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = `rgba(167, 139, 250, ${(depthAlpha * 0.4).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, renderSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. CONTINUOUS LOGO GLIDE TRANSFORMATION (Image 1 -> Image 2)
    if (introBranding && navbar) {
      const navLogo = navbar.querySelector('.nav-logo');
      if (navLogo) {
        if (easedProgress < 0.02) {
          introBranding.style.transform = 'translate3d(0, 0, 0) scale(1)';
          introBranding.style.opacity = '1';
          navbar.classList.add('nav-intro-mode');
          navbar.classList.remove('nav-revealed');
        } else if (easedProgress < 0.98) {
          const navRect = navLogo.getBoundingClientRect();

          const targetX = navRect.left + navRect.width / 2 - (window.innerWidth / 2);
          const targetY = navRect.top + navRect.height / 2 - (window.innerHeight / 2);

          const currentX = targetX * easedProgress;
          const currentY = targetY * easedProgress;
          const currentScale = 1 - (0.68 * easedProgress);
          const currentOpacity = 1 - Math.pow(easedProgress, 3.5) * 0.25;

          introBranding.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
          introBranding.style.opacity = currentOpacity.toFixed(3);
        } else {
          introBranding.style.opacity = '0';
          if (introEl) introEl.classList.add('intro-complete');
          navbar.classList.remove('nav-intro-mode');
          navbar.classList.add('nav-revealed');
        }
      }
    }

    // 7. OVERLAPPING HERO UI REVEAL TRIGGERS
    if (progress > 0.42 && heroContent && !heroContent.classList.contains('hero-revealed')) {
      heroContent.classList.add('hero-revealed');
    }

    if (progress > 0.62 && heroSphereArea && !heroSphereArea.classList.contains('hero-revealed')) {
      heroSphereArea.classList.add('hero-revealed');
    }

    // 8. SETTLED HERO STATE & HERO CANVAS SCOPING
    if (progress >= 1.0 && !isSettled) {
      isSettled = true;
      document.body.style.overflow = 'auto';
      
      if (introEl) {
        introEl.classList.add('intro-complete');
        introEl.style.display = 'none';
        introEl.style.pointerEvents = 'none';
      }
      if (navbar) {
        navbar.classList.remove('nav-intro-mode');
        navbar.classList.add('nav-revealed');
      }

      // Scope canvas to #hero section so Hero is separate from lower website sections
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Event Listeners
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    resizeCanvas();
  }, { passive: true });

  // Boot Engine
  resizeCanvas();
  document.body.style.overflow = 'hidden';
  animationFrameId = requestAnimationFrame(render);
}
