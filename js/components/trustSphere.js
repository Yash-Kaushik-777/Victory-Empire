/* ============================================================
   VICTORY EMPIRE — 3D REVOLVING TRUST SPHERE ENGINE (REFINED AIRY PASS)
   Minimal Orbital Ring Field & Plain Typography 3D Depth Fading
   ============================================================ */

import { CONFIG } from '../config.js';

export function initTrustSphere() {
  const canvas = document.getElementById('trust-sphere-canvas');
  const container = document.getElementById('trust-sphere-container');
  const section = document.getElementById('trust-proof');
  if (!canvas || !container || !section) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrameId = null;
  let isVisible = true;

  // Damped mouse interaction
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  // Rotation angles
  let rotX = 0.25;
  let rotY = 0;
  let rotZ = 0.08;

  // Reduced motion preference
  const mediaQueryReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = mediaQueryReduced.matches;

  mediaQueryReduced.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      drawFrame();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      startLoop();
    }
  });

  // Sphere geometry data
  let sphereRadius = 210;
  let particles = [];
  let rings = [];
  let labels = [];

  function buildSphereData() {
    const isMobile = window.innerWidth < 768;
    sphereRadius = isMobile ? Math.min(width, height) * 0.38 : Math.min(width, height) * 0.35;
    sphereRadius = Math.max(130, Math.min(sphereRadius, 230));

    // 1. Light, Airy Point Cloud (Uncongested - ~220 subtle constellation dots)
    particles = [];
    const pointCount = isMobile ? 120 : 220;

    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

      particles.push({
        x: Math.cos(phi) * r * sphereRadius,
        y: y * sphereRadius,
        z: Math.sin(phi) * r * sphereRadius,
        baseSize: isMobile ? 0.8 : 1.0 + Math.random() * 0.6,
        baseOpacity: 0.12 + Math.random() * 0.35
      });
    }

    // 2. Build 4 Sleek 3D Orbital Wireframe Rings
    rings = [];
    const ringTilts = [
      { pitch: 0.2, yaw: 0, roll: 0.25 },
      { pitch: 1.15, yaw: 0.45, roll: -0.35 },
      { pitch: -0.85, yaw: 0.85, roll: 0.55 },
      { pitch: 0.45, yaw: -1.25, roll: -0.45 }
    ];

    ringTilts.forEach(tilt => {
      const ringPoints = [];
      const numSegs = isMobile ? 48 : 84;
      for (let s = 0; s <= numSegs; s++) {
        const theta = (s / numSegs) * Math.PI * 2;
        ringPoints.push({
          x: sphereRadius * 1.04 * Math.cos(theta),
          y: sphereRadius * 1.04 * Math.sin(theta),
          z: 0
        });
      }
      rings.push({ points: ringPoints, tilt });
    });

    // 3. Build 3D Orbiting Client Labels (Actual Victory Empire 12 Clients)
    labels = [];
    const partnerList = CONFIG.trustedPartners || [];
    const labelCount = partnerList.length;

    for (let i = 0; i < labelCount; i++) {
      const partner = partnerList[i];
      const nameText = typeof partner === 'string' ? partner : partner.name;
      const weight = partner.weight || '700';
      const casing = partner.casing || 'normal';

      // Distribute labels evenly across 3D sphere surface
      const y = 1 - ((i + 0.5) / labelCount) * 1.8;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * Math.PI * (3 - Math.sqrt(5)) * 1.45;

      labels.push({
        text: nameText,
        weight: weight,
        casing: casing,
        x: Math.cos(phi) * r * sphereRadius * 1.06,
        y: y * sphereRadius * 1.06,
        z: Math.sin(phi) * r * sphereRadius * 1.06
      });
    }
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    width = rect.width || 500;
    height = rect.height || 500;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    buildSphereData();

    if (prefersReducedMotion) {
      drawFrame();
    }
  }

  // 3D Matrix Rotation & Perspective Projection
  function project3D(x0, y0, z0, rx, ry, rz, cx, cy, focalLength, zOffset) {
    // Pitch (Rotate X)
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const y1 = y0 * cosX - z0 * sinX;
    const z1 = y0 * sinX + z0 * cosX;

    // Yaw (Rotate Y)
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const x2 = x0 * cosY + z1 * sinY;
    const z2 = -x0 * sinY + z1 * cosY;

    // Roll (Rotate Z)
    const cosZ = Math.cos(rz), sinZ = Math.sin(rz);
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;
    const z3 = z2;

    const perspectiveZ = z3 + zOffset;
    const scale = focalLength / Math.max(perspectiveZ, 100);

    return {
      x: cx + x3 * scale,
      y: cy + y3 * scale,
      z: z3,
      scale
    };
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    // Damped Mouse Parallax
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    const mouseOffsetX = (currentMouseX / width - 0.5) * 0.1;
    const mouseOffsetY = (currentMouseY / height - 0.5) * 0.1;

    if (!prefersReducedMotion) {
      rotY += 0.003;
      rotX += 0.0006;
    }

    const currentRotX = rotX + mouseOffsetY;
    const currentRotY = rotY + mouseOffsetX;
    const currentRotZ = rotZ;

    const cx = width * 0.5;
    const cy = height * 0.5;
    const focalLength = 750;
    const zOffset = 650;

    // A. Subtle Victory Empire Core Ambient Glow
    const glowGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereRadius * 1.2);
    glowGradient.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
    glowGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
    glowGradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, sphereRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // B. Render 4 Sleek Dotted 3D Orbital Rings
    rings.forEach(ring => {
      ctx.beginPath();
      const combinedPitch = currentRotX + ring.tilt.pitch;
      const combinedYaw = currentRotY + ring.tilt.yaw;
      const combinedRoll = currentRotZ + ring.tilt.roll;

      ring.points.forEach((pt, idx) => {
        const proj = project3D(pt.x, pt.y, pt.z, combinedPitch, combinedYaw, combinedRoll, cx, cy, focalLength, zOffset);
        if (idx === 0) {
          ctx.moveTo(proj.x, proj.y);
        } else {
          ctx.lineTo(proj.x, proj.y);
        }
      });
      ctx.closePath();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 5]); // Sleek dotted orbital ring
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // C. Render Uncongested Constellation Points
    particles.forEach(p => {
      const proj = project3D(p.x, p.y, p.z, currentRotX, currentRotY, currentRotZ, cx, cy, focalLength, zOffset);
      const depthFactor = (proj.z + sphereRadius) / (sphereRadius * 2);
      const alpha = Math.max(0.04, Math.min(0.65, p.baseOpacity * (0.15 + depthFactor * 0.85)));

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, p.baseSize * proj.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // D. Render Plain Typography 3D Orbiting Client Labels (NO Capsule Boxes!)
    const projectedLabels = labels.map(label => {
      const proj = project3D(label.x, label.y, label.z, currentRotX, currentRotY, currentRotZ, cx, cy, focalLength, zOffset);
      return { label, proj };
    });

    // Sort back-to-front for proper depth layering
    projectedLabels.sort((a, b) => a.proj.z - b.proj.z);

    projectedLabels.forEach(({ label, proj }) => {
      const normalizedZ = proj.z / sphereRadius; // -1 to +1

      let opacity = 0;
      if (normalizedZ > -0.3) {
        opacity = Math.min(1, Math.pow((normalizedZ + 0.3) / 1.3, 1.1));
      } else {
        opacity = 0;
      }

      if (opacity <= 0.03) return;

      // Smooth font scaling based on 3D depth
      const baseFontSize = 12;
      const fontSize = Math.max(9, Math.min(17, baseFontSize * proj.scale * (0.85 + (normalizedZ + 1) * 0.15)));

      ctx.save();
      ctx.font = `${label.weight} ${fontSize}px 'Geist', 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Color & Opacity Hierarchy (Front-facing bright white, moving back fades to soft grey)
      if (normalizedZ > 0.2) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(opacity * 0.95).toFixed(3)})`;
      } else if (normalizedZ > -0.1) {
        ctx.fillStyle = `rgba(215, 215, 215, ${(opacity * 0.7).toFixed(3)})`;
      } else {
        ctx.fillStyle = `rgba(160, 160, 160, ${(opacity * 0.35).toFixed(3)})`;
      }

      // Format text according to casing metadata
      let displayText = label.text;
      if (label.casing === 'uppercase') displayText = displayText.toUpperCase();
      if (label.casing === 'lowercase') displayText = displayText.toLowerCase();

      // Render Plain Text Directly on Canvas (No Pill Boxes / No Rectangles!)
      ctx.fillText(displayText, proj.x, proj.y);
      ctx.restore();
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

  // IntersectionObserver to pause loop when offscreen
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

  observer.observe(section);

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    resizeCanvas();
  }, { passive: true });

  // Initial boot
  resizeCanvas();
  startLoop();
}
