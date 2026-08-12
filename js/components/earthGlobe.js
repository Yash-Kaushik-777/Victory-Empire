/* ============================================================
   VICTORY EMPIRE — EARTH GLOBE (Hero)
   White monochrome globe with continents, graticule, atmosphere.
   ============================================================ */

function landMask(lat, lon) {
  const deg = (r) => r * (180 / Math.PI);
  const La = deg(lat);
  const Lo = deg(lon);

  const blobs = [
    { la: 45, lo: -100, rx: 28, ry: 22 },
    { la: 8, lo: -78, rx: 14, ry: 18 },
    { la: 52, lo: 15, rx: 22, ry: 16 },
    { la: 22, lo: 78, rx: 26, ry: 20 },
    { la: -22, lo: 135, rx: 22, ry: 14 },
    { la: -8, lo: -55, rx: 16, ry: 22 },
    { la: 2, lo: 20, rx: 18, ry: 24 },
    { la: 68, lo: 25, rx: 20, ry: 10 },
    { la: -38, lo: 145, rx: 12, ry: 10 },
    { la: 28, lo: 45, rx: 16, ry: 12 },
    { la: -28, lo: 25, rx: 14, ry: 12 },
    { la: 60, lo: -95, rx: 18, ry: 12 }
  ];

  for (const b of blobs) {
    const dx = (Lo - b.lo) / b.rx;
    const dy = (La - b.la) / b.ry;
    if (dx * dx + dy * dy < 1) return true;
  }
  return false;
}

export function initEarthGlobe(canvas) {
  if (!canvas) return null;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let landPoints = [];
  let oceanPoints = [];
  let animationId = null;
  let rotX = 0.28;
  let rotY = 0;
  let time = 0;

  function buildGlobe() {
    landPoints = [];
    oceanPoints = [];
    const count = window.innerWidth < 768 ? 5200 : 9200;
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

      const pt = { x, y, z, lat, lon, size: 0.45 + Math.random() * 0.55, alpha: 0.35 + Math.random() * 0.45 };

      if (landMask(lat, lon)) landPoints.push(pt);
      else if (Math.random() > 0.72) oceanPoints.push(pt);
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

  function spherePoint(lat, lon, radius) {
    const cl = Math.cos(lat);
    return {
      x: cl * Math.cos(lon),
      y: Math.sin(lat),
      z: cl * Math.sin(lon)
    };
  }

  function drawGraticule(cx, cy, radius, rx, ry) {
    const latSteps = 10;
    const lonSteps = 18;

    ctx.lineWidth = 0.6;

    for (let li = 1; li < latSteps; li++) {
      const lat = -Math.PI / 2 + (li / latSteps) * Math.PI;
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= 72; s++) {
        const lon = (s / 72) * Math.PI * 2;
        const p = spherePoint(lat, lon, 1);
        const pr = project(p.x, p.y, p.z, cx, cy, radius, rx, ry);
        if (pr.pz < -0.08) { started = false; continue; }
        const alpha = Math.max(0.04, Math.min(0.22, 0.1 + pr.pz * 0.14));
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        if (!started) { ctx.moveTo(pr.px, pr.py); started = true; }
        else ctx.lineTo(pr.px, pr.py);
      }
      ctx.stroke();
    }

    for (let li = 0; li < lonSteps; li++) {
      const lon = (li / lonSteps) * Math.PI * 2;
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= 48; s++) {
        const lat = -Math.PI / 2 + (s / 48) * Math.PI;
        const p = spherePoint(lat, lon, 1);
        const pr = project(p.x, p.y, p.z, cx, cy, radius, rx, ry);
        if (pr.pz < -0.08) { started = false; continue; }
        const alpha = Math.max(0.04, Math.min(0.2, 0.08 + pr.pz * 0.12));
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        if (!started) { ctx.moveTo(pr.px, pr.py); started = true; }
        else ctx.lineTo(pr.px, pr.py);
      }
      ctx.stroke();
    }
  }

  function drawPoints(points, cx, cy, radius, rx, ry, land) {
    const sorted = points
      .map((pt) => ({ pt, proj: project(pt.x, pt.y, pt.z, cx, cy, radius, rx, ry) }))
      .sort((a, b) => a.proj.pz - b.proj.pz);

    sorted.forEach(({ pt, proj }) => {
      if (proj.pz < -0.35) return;
      const depth = Math.max(0.08, Math.min(1, pt.alpha + proj.pz * 0.5));
      const size = pt.size * proj.scale * (land ? 1.05 : 0.75);
      const alpha = land
        ? depth * (0.55 + proj.pz * 0.45)
        : depth * 0.18;

      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
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
      rotY = time * 0.14;
      rotX = 0.28 + Math.sin(time * 0.05) * 0.025;
    }

    const atmo = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, radius * 1.22);
    atmo.addColorStop(0, 'rgba(255,255,255,0)');
    atmo.addColorStop(0.55, 'rgba(255,255,255,0.04)');
    atmo.addColorStop(0.85, 'rgba(255,255,255,0.12)');
    atmo.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = atmo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.22, 0, Math.PI * 2);
    ctx.fill();

    const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.05);
    coreGlow.addColorStop(0, 'rgba(255,255,255,0.06)');
    coreGlow.addColorStop(0.7, 'rgba(255,255,255,0.02)');
    coreGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();

    const oceanShell = ctx.createRadialGradient(cx - radius * 0.15, cy - radius * 0.1, radius * 0.1, cx, cy, radius);
    oceanShell.addColorStop(0, 'rgba(255,255,255,0.05)');
    oceanShell.addColorStop(0.85, 'rgba(255,255,255,0.015)');
    oceanShell.addColorStop(1, 'rgba(255,255,255,0.03)');
    ctx.fillStyle = oceanShell;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    drawGraticule(cx, cy, radius, rotX, rotY);
    drawPoints(oceanPoints, cx, cy, radius, rotX, rotY, false);
    drawPoints(landPoints, cx, cy, radius, rotX, rotY, true);

    const rim = ctx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.02);
    rim.addColorStop(0, 'rgba(255,255,255,0)');
    rim.addColorStop(1, 'rgba(255,255,255,0.18)');
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    animationId = requestAnimationFrame(render);
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  resize();
  render();
  window.addEventListener('resize', resize, { passive: true });

  return { stop, resize, canvas };
}
