/* Cinematic outro background + line wordmark hover */

export function initOutro() {
  initOutroCanvas();
  initWordmarkHover();
}

function initOutroCanvas() {
  const canvas = document.getElementById('outro-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let t = 0;
  let raf = null;

  const blobs = [
    { x: 0.3, y: 0.55, r: 0.35, speed: 0.00018, alpha: 0.14 },
    { x: 0.7, y: 0.62, r: 0.28, speed: 0.00014, alpha: 0.1 },
    { x: 0.5, y: 0.78, r: 0.42, speed: 0.00011, alpha: 0.08 }
  ];

  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function draw() {
    t += 1;
    ctx.clearRect(0, 0, w, h);

    blobs.forEach((b, i) => {
      const cx = w * (b.x + Math.sin(t * b.speed * 60 + i) * 0.06);
      const cy = h * (b.y + Math.cos(t * b.speed * 45 + i * 2) * 0.04);
      const rad = Math.min(w, h) * b.r;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, `rgba(180, 180, 200, ${b.alpha})`);
      g.addColorStop(0.45, `rgba(100, 80, 140, ${b.alpha * 0.55})`);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) cancelAnimationFrame(raf);
    else if (!raf) draw();
  });
}

function initWordmarkHover() {
  const mark = document.getElementById('outro-wordmark');
  if (!mark) return;

  mark.addEventListener('mousemove', (e) => {
    const rect = mark.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    mark.style.setProperty('--line-shift', `${x * 0.4}px`);
  });

  mark.addEventListener('mouseleave', () => {
    mark.style.setProperty('--line-shift', '0px');
  });
}
