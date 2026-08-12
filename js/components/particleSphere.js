/* ============================================================
   VICTORY EMPIRE — EARTH GLOBE (HERO)
   White monochrome particle globe with continents + grid lines.
   ============================================================ */

export function initParticleSphere(canvas, options = {}) {
  if (!canvas) return null;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  const variant = options.variant || 'hero';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let landPoints = [];
  let oceanPoints = [];
  let gridLines = [];
  let animationId = null;
  let rotX = 0.28;
  let rotY = 0;
  let time = 0;

  const isMobile = () => window.innerWidth < 768;

  /** Simplified procedural land mask from lat/lon (radians) */
  function isLand(lat, lon) {
    const la = lat * (180 / Math.PI);
    const lo = lon * (180 / Math.PI);
    const a =
      Math.sin(la * 0.09 + 1.2) * Math.cos(lo * 0.11 - 0.4) * 0.55 +
      Math.sin(la * 0.14 - 0.8) * Math.sin(lo * 0.08 + 1.1) * 0.45 +
      Math.cos(la * 0.06 + lo * 0.07) * 0.35;
    const b =
      Math.exp(-Math.pow((la - 42) / 18, 2)) * Math.exp(-Math.pow((lo - -95) / 28, 2)) * 1.2 +
      Math.exp(-Math.pow((la - 50) / 12, 2)) * Math.exp(-Math.pow((lo - 10) / 18, 2)) * 1.1 +
      Math.exp(-Math.pow((la - 22) / 14, 2)) * Math.exp(-Math.pow((lo - 78) / 22, 2)) * 1.0 +
      Math.exp(-Math.pow((la - -8) / 20, 2)) * Math.exp(-Math.pow((lo - 20) / 35, 2)) * 0.9 +
      Math.exp(-Math.pow((la - -25) / 16, 2)) * Math.exp(-Math.pow((lo - 135) / 28, 2)) * 0.85;
    return a + b > 0.42;
  }

  function buildGlobe() {
    landPoints = [];
    oceanPoints = [];
    gridLines = [];

    const count = isMobile() ? 1100 : 2200;
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = 1 - t * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const lat = Math.asin(Math.max(-1, Math.min(1, y)));
      const lon = Math.atan2(z, x);
      const land = isLand(lat, lon);

      const pt = {
        x, y, z,
        size: land ? (0.55 + Math.random() * 0.75) : (0.25 + Math.random() * 0.35),
        alpha: land ? (0.55 + Math.random() * 0.4) : (0.12 + Math.random() * 0.18)
      };

      if (land) landPoints.push(pt);
      else oceanPoints.push(pt);
    }

    const latSteps = 9;
    const lonSteps = 18;
    for (let li = 1; li < latSteps; li++) {
      const lat = -Math.PI / 2 + (li / latSteps) * Math.PI;
      const ring = [];
      for (let s = 0; s <= 64; s++) {
        const lon = (s / 64) * Math.PI * 2;
        ring.push({
          x: Math.cos(lat) * Math.cos(lon),
          y: Math.sin(lat),
          z: Math.cos(lat) * Math.sin(lon)
        });
      }
      gridLines.push({ type: 'lat', points: ring });
    }
    for (let lj = 0; lj < lonSteps; lj++) {
      const lon = (lj / lonSteps) * Math.PI * 2;
      const meridian = [];
      for (let s = 0; s <= 64; s++) {
        const lat = -Math.PI / 2 + (s / 64) * Math.PI;
        meridian.push({
          x: Math.cos(lat) * Math.cos(lon),
          y: Math.sin(lat),
          z: Math.cos(lat) * Math.sin(lon)
        });
      }
      gridLines.push({ type: 'lon', points: meridian });
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || 400;
    height = rect.height || 400;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGlobe();
  }

  function project(x, y, z, cx, cy, radius, rx, ry) {
    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;
    const perspective = 640;
    const scale = perspective / (perspective + z2 * radius * 0.75);
    return { px: cx + x2 * radius * scale, py: cy + y1 * radius * scale, pz: z2, scale };
  }

  function drawGrid(cx, cy, radius, rx, ry) {
    gridLines.forEach((line) => {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < line.points.length; i++) {
        const p = line.points[i];
        const proj = project(p.x, p.y, p.z, cx, cy, radius, rx, ry);
        if (proj.pz < -0.2) {
          started = false;
          continue;
        }
        const alpha = Math.max(0.04, Math.min(0.22, 0.08 + proj.pz * 0.14));
        if (!started) {
          ctx.moveTo(proj.px, proj.py);
          started = true;
        } else {
          ctx.lineTo(proj.px, proj.py);
        }
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${line.type === 'lat' ? '0.12' : '0.08'})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });
  }

  function drawPoints(points, cx, cy, radius, rx, ry, bright) {
    const sorted = points
      .map((pt) => ({ pt, proj: project(pt.x, pt.y, pt.z, cx, cy, radius, rx, ry) }))
      .sort((a, b) => a.proj.pz - b.proj.pz);

    sorted.forEach(({ pt, proj }) => {
      if (proj.pz < -0.45) return;
      const depth = Math.max(0.08, Math.min(1, pt.alpha + proj.pz * 0.38));
      const size = pt.size * proj.scale;
      const alpha = bright ? depth : depth * 0.65;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(proj.px, proj.py, size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.36;

    if (!prefersReducedMotion) {
      time += 0.007;
      rotY = time * 0.15;
      rotX = 0.28 + Math.sin(time * 0.05) * 0.025;
    }

    const atmo = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.22);
    atmo.addColorStop(0, 'rgba(255, 255, 255, 0)');
    atmo.addColorStop(0.55, 'rgba(255, 255, 255, 0.04)');
    atmo.addColorStop(0.85, 'rgba(255, 255, 255, 0.1)');
    atmo.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = atmo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
    coreGlow.addColorStop(0.7, 'rgba(255, 255, 255, 0.02)');
    coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    drawGrid(cx, cy, radius, rotX, rotY);
    drawPoints(oceanPoints, cx, cy, radius, rotX, rotY, false);
    drawPoints(landPoints, cx, cy, radius, rotX, rotY, true);

    animationId = requestAnimationFrame(render);
  }

  function start() {
    resize();
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(render);
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  start();
  return { stop, resize, canvas };
}

export function initParticleSpheres() {
  const canvas = document.getElementById('hero-sphere-canvas');
  if (!canvas) return [];
  return [initParticleSphere(canvas, { variant: 'hero' })];
}
