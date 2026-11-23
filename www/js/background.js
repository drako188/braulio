'use strict';
/* ---------------- Background (ciudad neón procedural) ---------------- */
const CH = 640, BG_SS = 1.6;
const ROADV = [[112, 48], [380, 48]];
var CUR_BEACONS = null;
function lightDot(g, x, y, c, r = 6) {
  if (CUR_BEACONS && r <= 6 && Math.random() < 0.6) CUR_BEACONS.push({ x, y, c, ph: rand(0, TAU) });
  g.fillStyle = radial(g, x, y, r, [[0, '#fff'], [0.3, c], [1, 'rgba(0,0,0,0)']]); g.fillRect(x - r, y - r, r * 2, r * 2);
}
function building(g, x, y, w, h) {
  if (w < 14 || h < 14) return;
  const tops = pick([['#1b2440', '#111728'], ['#222c44', '#141a2b'], ['#261d3a', '#16112a'], ['#172a31', '#0d181c']]);
  g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(x + 5, y + 5, w, h);
  g.fillStyle = lg(g, x, y, x + w, y + h, tops); g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(x, y, w, 2); g.fillRect(x, y, 2, h);
  const n = pick(NEON), r = Math.random();
  if (r < 0.2 && w > 46 && h > 46) {
    const cx = x + w / 2, cy = y + h / 2, rad = Math.min(w, h) * 0.32;
    g.globalAlpha = 0.75; g.strokeStyle = n; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, rad, 0, TAU); g.stroke();
    g.fillStyle = n; g.font = `800 ${Math.round(rad)}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', cx, cy + 1);
    g.globalAlpha = 1;
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) lightDot(g, cx + dx * rad * 1.15, cy + dy * rad * 1.15, n, 4);
  } else if (r < 0.45) {
    const s = 12; for (let yy = y + 8; yy + s < y + h - 6; yy += s + 6) for (let xx = x + 8; xx + s < x + w - 6; xx += s + 6) {
      if (Math.random() < 0.3) continue;
      g.fillStyle = '#2c3552'; g.fillRect(xx, yy, s, s); g.fillStyle = '#121729'; g.beginPath(); g.arc(xx + s / 2, yy + s / 2, s * 0.32, 0, TAU); g.fill();
    }
  } else if (r < 0.65) {
    for (let yy = y + 7; yy + 8 < y + h - 5; yy += 11) {
      g.fillStyle = '#12305a'; g.fillRect(x + 7, yy, w - 14, 8);
      g.fillStyle = 'rgba(120,200,255,0.25)'; g.fillRect(x + 7, yy, w - 14, 1);
    }
  } else if (r < 0.82 && w > 30 && h > 30) {
    g.fillStyle = lg(g, x, y, x + w, y + h, [n + '55', n + '10']); g.fillRect(x + 8, y + 8, w - 16, h - 16);
    g.strokeStyle = n; g.globalAlpha = 0.8; g.lineWidth = 1.5; g.strokeRect(x + 8.5, y + 8.5, w - 17, h - 17); g.globalAlpha = 1;
  } else {
    for (let xx = x + 6; xx + 5 < x + w - 4; xx += 9) { g.fillStyle = Math.random() < 0.15 ? 'rgba(255,220,140,0.35)' : '#1b3150'; g.fillRect(xx, y + 6, 5, h - 12); }
  }
  if (Math.random() < 0.55) { g.globalAlpha = 0.5; g.strokeStyle = n; g.lineWidth = 1.2; g.strokeRect(x + 3.5, y + 3.5, w - 7, h - 7); g.globalAlpha = 1; }
  for (let k = ri(0, 2); k > 0; k--) lightDot(g, x + rand(5, w - 5), y + rand(5, h - 5), pick(['#ff3355', '#00e5ff', '#ffffff']));
}
function park(g, x, y, w, h) {
  g.fillStyle = '#0a1a19'; g.fillRect(x, y, w, h);
  g.strokeStyle = 'rgba(57,255,136,0.35)'; g.lineWidth = 1; g.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  for (let i = 0; i < w * h / 500; i++) {
    const tx = rand(x + 8, x + w - 8), ty = rand(y + 8, y + h - 8), tr = rand(5, 10);
    g.fillStyle = radial(g, tx, ty, tr, [[0, '#3fdc8a'], [0.5, '#17694a'], [1, 'rgba(10,40,30,0)']]);
    g.beginPath(); g.arc(tx, ty, tr, 0, TAU); g.fill();
  }
  if (w > 60 && h > 60) {
    const cx = x + w / 2, cy = y + h / 2;
    g.strokeStyle = 'rgba(0,229,255,0.7)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 16, 0, TAU); g.stroke();
    lightDot(g, cx, cy, '#00e5ff', 12);
  }
}
function split(g, x, y, w, h, d) {
  if (((w > 140 || h > 150) && d < 4) || (d < 2 && w > 70 && h > 70 && Math.random() < 0.6)) {
    if (w > h) { const s = w * rand(0.35, 0.65); split(g, x, y, s - 3, h, d + 1); split(g, x + s + 3, y, w - s - 3, h, d + 1); }
    else { const s = h * rand(0.35, 0.65); split(g, x, y, w, s - 3, d + 1); split(g, x, y + s + 3, w, h - s - 3, d + 1); }
  } else building(g, x, y, w, h);
}
function makeChunk() {
  const c = document.createElement('canvas'); c.width = W * BG_SS; c.height = CH * BG_SS;
  const g = c.getContext('2d'); g.scale(BG_SS, BG_SS); CUR_BEACONS = [];
  g.fillStyle = '#060a14'; g.fillRect(0, 0, W, CH);
  const hy = ri(290, 350);
  for (const [x, w] of ROADV) {
    g.fillStyle = '#0b1020'; g.fillRect(x, 0, w, CH);
    g.fillStyle = 'rgba(0,229,255,0.35)'; g.fillRect(x, 0, 1.5, CH); g.fillRect(x + w - 1.5, 0, 1.5, CH);
    g.fillStyle = 'rgba(140,200,255,0.25)'; for (let y = 0; y < CH; y += 32) g.fillRect(x + w / 2 - 1, y, 2, 16);
  }
  for (const [y, h] of [[0, 44], [hy, 38]]) {
    g.fillStyle = '#0b1020'; g.fillRect(0, y, W, h);
    g.fillStyle = 'rgba(255,43,214,0.3)'; g.fillRect(0, y, W, 1.5); g.fillRect(0, y + h - 1.5, W, 1.5);
    g.fillStyle = 'rgba(140,200,255,0.22)'; for (let x = 0; x < W; x += 30) g.fillRect(x, y + h / 2 - 1, 15, 2);
    g.fillStyle = 'rgba(255,255,255,0.12)';
    for (const [rx, rw] of ROADV) for (let k = 0; k < 6; k++) { g.fillRect(rx - 12, y + 5 + k * (h - 10) / 6, 8, 3); g.fillRect(rx + rw + 4, y + 5 + k * (h - 10) / 6, 8, 3); }
  }
  for (const [x0, x1] of [[0, 112], [160, 380], [428, W]]) for (const [y0, y1] of [[44, hy], [hy + 38, CH]]) {
    const x = x0 + 8, y = y0 + 8, w = x1 - x0 - 16, h = y1 - y0 - 16;
    g.fillStyle = '#0f1628'; g.fillRect(x - 4, y - 4, w + 8, h + 8);
    if (Math.random() < 0.16) park(g, x, y, w, h); else split(g, x, y, w, h, 0);
  }
  c.beacons = CUR_BEACONS; CUR_BEACONS = null;
  return c;
}
let CHUNKS = [makeChunk(), makeChunk(), makeChunk(), makeChunk()];
const BEACON_GLOW = { '#ff3355': 'red', '#00e5ff': 'cyan', '#ffffff': 'white', '#ff2bd6': 'mag', '#7c4dff': 'purple', '#39ff88': 'green', '#ffb800': 'amber' };
let tiles = [], cars = [], clouds = [], lights = [], marks = [], bgSpeed = 70;
function updateBG(dt) {
  const dy = bgSpeed * dt;
  for (const t of tiles) t.y += dy;
  tiles = tiles.filter(t => t.y < H);
  if (!tiles.length) tiles.push({ img: pick(CHUNKS), y: H - CH });
  while (tiles[tiles.length - 1].y > 0) { const top = tiles[tiles.length - 1]; tiles.push({ img: pick(CHUNKS), y: top.y - CH, seam: seamPending }); seamPending = false; }
  if (THEMES[THEME].cars && cars.length < 16 && Math.random() < dt * 4) {
    const [rx, rw] = pick(ROADV), down = Math.random() < 0.5;
    cars.push({ x: rx + (down ? 14 : rw - 14), y: down ? -20 : H + 20, v: down ? rand(90, 170) : -rand(110, 190) });
  }
  for (const c of cars) c.y += (c.v + bgSpeed) * dt;
  cars = cars.filter(c => c.y > -40 && c.y < H + 40);
  if (clouds.length < 3 && Math.random() < dt * 0.25) clouds.push({ x: rand(-60, W + 60), y: -120, s: rand(0.9, 1.6) });
  for (const c of clouds) c.y += bgSpeed * 2.6 * dt;
  clouds = clouds.filter(c => c.y < H + 160);
  if (THEMES[THEME].lights && lights.length < 3 && Math.random() < dt * 0.35) lights.push({ x: rand(30, W - 30), y: -10, a0: rand(-0.5, 0.5), ph: rand(0, TAU), sp: rand(0.4, 0.9) });
  for (const l of lights) l.y += dy;
  lights = lights.filter(l => l.y < H + 320);
  for (const m of marks) m.y += dy;
  marks = marks.filter(m => m.y < H + 60);
  updateAmbient(dt);
}
function drawBG() {
  for (const t of tiles) ctx.drawImage(t.img, 0, Math.floor(t.y), W, CH + 1);
  drawSeams();
  for (const m of marks) drawSpr(SPR.scorch, m.x, m.y, 0, m.s);
  ctx.globalCompositeOperation = 'lighter';
  for (const t of tiles) for (const b of t.img.beacons) {
    const a = 0.5 + 0.5 * Math.sin(G.t * 3 + b.ph);
    if (a < 0.15) continue;
    ctx.globalAlpha = a; drawSpr(GLOW[BEACON_GLOW[b.c] || 'white'], b.x, t.y + b.y, 0, 0.8);
  }
  ctx.globalAlpha = 1;
  for (const c of cars) {
    const down = c.v > 0;
    drawSpr(down ? GLOW.white : GLOW.red, c.x, c.y + (down ? 9 : -9), 0, 0.45);
    drawSpr(down ? GLOW.red : GLOW.white, c.x, c.y + (down ? -9 : 9), 0, 0.3);
  }
  for (const l of lights) {
    ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.a0 + Math.sin(G.t * l.sp + l.ph) * 0.7);
    ctx.drawImage(SPR.beam, -45, -320, 90, 320); ctx.restore();
    drawSpr(GLOW.white, l.x, l.y, 0, 0.6);
  }
  ctx.globalCompositeOperation = 'source-over';
  for (const c of cars) { ctx.fillStyle = '#1e2438'; ctx.fillRect(c.x - 4, c.y - 8, 8, 16); }
}
function drawClouds() { const cs = themeCloud(); for (const c of clouds) drawSpr(cs, c.x, c.y, 0, c.s); drawAmbient(); }
var VIG = null;
function makeVig() {
  VIG = document.createElement('canvas'); VIG.width = W / 2; VIG.height = Math.round(H / 2);
  const g = VIG.getContext('2d'), w = W / 2, h = H / 2;
  let gr = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.62);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,12,0.6)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, 'rgba(255,43,214,0.08)'); gr.addColorStop(0.3, 'rgba(255,43,214,0)');
  gr.addColorStop(0.7, 'rgba(0,229,255,0)'); gr.addColorStop(1, 'rgba(0,229,255,0.08)');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
}
makeVig();

