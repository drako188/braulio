'use strict';
/* =====================================================================
   NOVA STRIKE — shooter vertical futurista (original)
   ===================================================================== */
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 540; let H = 960, VS = 1, DPR = 1;
function resize() {
  const iw = innerWidth, ih = innerHeight;
  H = Math.round(Math.min(1170, Math.max(800, W * ih / iw)));
  VS = Math.min(iw / W, ih / H);
  DPR = Math.min(window.devicePixelRatio || 1, typeof Q === 'function' ? Q().dpr : 2);
  cv.style.width = (W * VS) + 'px'; cv.style.height = (H * VS) + 'px';
  cv.width = Math.round(W * VS * DPR); cv.height = Math.round(H * VS * DPR);
  if (typeof makeVig === 'function') makeVig();
}
addEventListener('resize', resize); resize();

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rand(a, b + 1));
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const pick = a => a[Math.floor(Math.random() * a.length)];
const FONT = 'system-ui, Roboto, "Segoe UI", sans-serif';
const NEON = ['#00e5ff', '#ff2bd6', '#7c4dff', '#39ff88', '#ffb800'];
const SECTORS = ['NEO-METRÓPOLIS', 'ÓRBITA BAJA', 'ZONA CUARENTENA', 'DESIERTO DE CRISTAL', 'DISTRITO INDUSTRIAL', 'CAVERNAS PROFUNDAS', 'OCÉANO TORMENTA', 'PANTANO TÓXICO', 'TUNDRA FANTASMA', 'SECTOR OMEGA'];

/* ---------------- Sprite helpers ---------------- */
const SS = 2;
function sprite(w, h, fn) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * SS); c.height = Math.ceil(h * SS);
  const g = c.getContext('2d'); g.scale(SS, SS); fn(g, w, h);
  c.w = w; c.h = h; return c;
}
function tint(src, color) {
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const g = c.getContext('2d'); g.drawImage(src, 0, 0);
  g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, c.width, c.height);
  c.w = src.w; c.h = src.h; return c;
}
function rr(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function poly(g, p) { g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.closePath(); }
function lg(g, x0, y0, x1, y1, stops) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr;
}
function radial(g, x, y, r, stops) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr;
}
function glowDot(r, color) {
  return sprite(r * 2, r * 2, g => {
    g.fillStyle = radial(g, r, r, r, [[0, '#fff'], [0.22, color], [1, 'rgba(0,0,0,0)']]);
    g.fillRect(0, 0, r * 2, r * 2);
  });
}
function drawSpr(s, x, y, rot = 0, sc = 1) {
  const w = s.w * sc, h = s.h * sc;
  if (rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(s, -w / 2, -h / 2, w, h); ctx.restore(); }
  else ctx.drawImage(s, x - w / 2, y - h / 2, w, h);
}

