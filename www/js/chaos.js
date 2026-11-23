'use strict';
/* =====================================================================
   CAOS — eventos aleatorios, enemigos élite, chatarra, combos y
   disparos que anticipan el movimiento del jugador
   ===================================================================== */

/* ---------------- Chatarra que cae ---------------- */
SPR.debris = sprite(44, 44, g => {
  const R = mulberry(5), pts = [];
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = 14 + R() * 8; pts.push(22 + Math.cos(a) * r, 22 + Math.sin(a) * r); }
  g.fillStyle = lg(g, 0, 0, 44, 44, ['#7a8498', '#2a2f3c']); poly(g, pts); g.fill();
  g.strokeStyle = '#ff8a2b'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(12, 18); g.lineTo(30, 26); g.moveTo(20, 32); g.lineTo(28, 12); g.stroke();
  g.fillStyle = 'rgba(255,140,40,0.8)'; g.beginPath(); g.arc(28, 28, 4, 0, TAU); g.fill();
});
SHD.debris = tint(SPR.debris, 'rgba(0,0,0,0.45)'); FL.debris = tint(SPR.debris, 'rgba(255,255,255,0.85)');
DEF.debris = { hp: 4, r: 19, score: 60 };

/* ---------------- Disparo con anticipación ---------------- */
function aimAt(x, y, spd) {
  if (!P || Math.random() > D.lead) return aim(x, y);
  const d = Math.hypot(P.x - x, P.y - y), t = d / Math.max(60, spd);
  const px = clamp(P.x + (P.vx || 0) * t * 0.85, 10, W - 10), py = P.y + (P.vy || 0) * t * 0.85;
  return Math.atan2(py - y, px - x);
}

/* ---------------- Enemigos élite ---------------- */
function maybeElite(e, o) {
  if (e.type === 'debris' || e.type === 'mine') return;
  const ch = D.elite * (1 + level * 0.06);
  if (!(o && o.forceElite) && Math.random() > ch) return;
  e.elite = true; e.hp = e.maxhp = Math.round(e.hp * 2.2); e.score = Math.round(e.score * 2.5);
}
function drawEliteFx(e) {
  if (!e.elite) return;
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.6 + Math.sin(G.t * 8 + e.x) * 0.25;
  drawSpr(GLOW.amber, e.x, e.y, 0, e.r / 9); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
function drawEliteRing(e) {
  if (!e.elite) return;
  ctx.strokeStyle = 'rgba(255,210,63,0.85)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 8, G.t * 3, G.t * 3 + Math.PI * 1.4); ctx.stroke();
}

/* ---------------- Combos ---------------- */
const COMBO = { n: 0, t: 0, best: 0 };
const comboMult = () => 1 + Math.min(COMBO.n, 40) / 10;
function comboKill(x, y) {
  COMBO.n++; COMBO.t = 2.4; COMBO.best = Math.max(COMBO.best, COMBO.n); ACH.combo(COMBO.n);
  if (COMBO.n % 10 === 0) { FT.push({ x: W / 2, y: H * 0.3, t: 0, s: 'COMBO ' + COMBO.n + '!', big: true, col: '#ffd23f' }); SFX.ultReady(); }
}
function comboBreak() { if (COMBO.n >= 5) FT.push({ x: W / 2, y: 70, t: 0, s: 'COMBO PERDIDO', col: '#ff7a8a' }); COMBO.n = 0; COMBO.t = 0; }
function drawCombo() {
  if (COMBO.n < 3) return;
  const x = W / 2 + 10, k = COMBO.t / 2.4, pulse = 1 + Math.max(0, COMBO.t - 2.1) * 1.2;
  txt('COMBO ' + COMBO.n, x, 26, 15 * pulse, '#ffd23f', 'center', '#ff8a00', 900);
  txt('×' + comboMult().toFixed(1).replace('.', ','), x, 46, 13, '#ffffff', 'center', null, 900);
  ctx.fillStyle = 'rgba(255,210,63,0.2)'; ctx.fillRect(x - 40, 56, 80, 4);
  ctx.fillStyle = '#ffd23f'; ctx.fillRect(x - 40, 56, 80 * k, 4);
}

/* ---------------- Eventos aleatorios ---------------- */
function evAmbush() {
  const n = 3 + Math.min(3, level);
  for (let i = 0; i < n; i++) { const s = i % 2 ? -1 : 1; addEnemy('hunter', s > 0 ? -30 + i * 10 : W + 30 - i * 10, H + 40, { up: true, dir: s, delay: 1.3 + i * 0.35 }); }
}
function evElite() {
  addEnemy('cruiser', rand(140, W - 140), -70, { forceElite: true });
  const s = Math.random() < 0.5 ? 1 : -1;
  for (let i = 0; i < 2; i++) addEnemy('hunter', s > 0 ? -40 : W + 40, 160 + i * 60, { dir: s, by: 160 + i * 60, delay: 1 + i * 0.6, forceElite: true });
}
function evDebris() {
  const n = 9 + Math.min(8, level * 2);
  for (let i = 0; i < n; i++) addEnemy('debris', rand(20, W - 20), -40 - rand(0, 60), { delay: i * 0.28, vx: rand(-90, 90), vy: rand(260, 420), vr: rand(-5, 5) });
}
function evSwarm() {
  const n = 8 + Math.min(6, level);
  for (let i = 0; i < n; i++) {
    const side = i % 3;
    addEnemy('kamikaze', side === 0 ? rand(40, W - 40) : side === 1 ? -30 : W + 30, side === 0 ? -40 : rand(80, 260), { delay: i * 0.22 });
  }
}
function evCross() {
  addEnemy('spinner', W * 0.2, -60, { holdY: rand(160, 260) }); addEnemy('spinner', W * 0.8, -60, { holdY: rand(160, 260) });
  for (const s of [1, -1]) for (let i = 0; i < 5; i++) addEnemy('drone', s > 0 ? -30 : W + 30, 110 + (s > 0 ? 0 : 60), { mode: 'snake', dir: s, delay: 0.8 + i * 0.22 });
}
const EVENTS = [
  ['¡EMBOSCADA POR DETRÁS!', '#ff3355', evAmbush, 0], ['¡ESCUADRÓN ÉLITE!', '#ffd23f', evElite, 15],
  ['¡LLUVIA DE CHATARRA!', '#ff8a2b', evDebris, 0], ['¡ENJAMBRE!', '#ff5a1f', evSwarm, 10], ['¡FUEGO CRUZADO!', '#ff2bd6', evCross, 20]
];
let eventT = 12, lastEvent = -1;
function runEvent() {
  const opts = EVENTS.map((e, i) => i).filter(i => i !== lastEvent && stageT >= EVENTS[i][3] / level);
  const i = pick(opts); lastEvent = i;
  const [name, col, fn] = EVENTS[i];
  FT.push({ x: W / 2, y: H * 0.28, t: 0, s: name, big: true, col });
  SFX.warn(); fn(); ACH.event();
}
function updateChaos(dt) {
  COMBO.t -= dt; if (COMBO.t <= 0 && COMBO.n) { COMBO.n = 0; }
  if (G.state !== 'play') return;
  bgSpeed += ((G.phase === 'waves' ? 70 + Math.min(70, stageT * 0.9) : 70) - bgSpeed) * Math.min(1, dt);
  if (G.phase !== 'waves' || stageT < 8 || stageT > 60 + level * 5 - 6) return;
  eventT -= dt;
  if (eventT <= 0 && EN.length < 20) { eventT = rand(12, 19) * D.spawn; runEvent(); }
}
function drawAmbushWarn() {
  for (const e of EN) {
    if (!(e.up && e.delay > 0)) continue;
    if (Math.floor(G.t * 8) % 2) continue;
    const x = clamp(e.x + e.dir * 60, 24, W - 24), y = H - 28;
    ctx.fillStyle = '#ff3355'; poly(ctx, [x, y - 18, x + 14, y + 6, x - 14, y + 6]); ctx.fill();
    txt('!', x, y - 1, 13, '#ffffff', 'center', null, 900);
  }
}
