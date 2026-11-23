'use strict';
/* =====================================================================
   CALIDAD — ajuste gráfico (auto/alta/media/baja), continuar partida y tutorial
   ===================================================================== */
if (!SET.quality) SET.quality = 'auto';
const QLEVELS = {
  high: { dpr: 2, part: 1, amb: 1, fx: true },
  med: { dpr: 1.5, part: 0.7, amb: 0.6, fx: true },
  low: { dpr: 1, part: 0.45, amb: 0.25, fx: false }
};
const QNAME = { auto: 'AUTO', high: 'ALTA', med: 'MEDIA', low: 'BAJA' };
let QA = SET.quality === 'auto' ? 'high' : SET.quality;
const Q = () => QLEVELS[QA];
function setQuality(q) { SET.quality = q; QA = q === 'auto' ? 'high' : q; saveSet(); resize(); }
const PERF = { acc: 0, n: 0 };
function perfTick(raw) {
  if (SET.quality !== 'auto' || G.state !== 'play' || raw > 0.25) return;
  PERF.acc += raw; PERF.n++;
  if (PERF.acc >= 3) {
    const avg = PERF.acc / PERF.n; PERF.acc = 0; PERF.n = 0;
    if (avg > 0.024 && QA !== 'low') { QA = QA === 'high' ? 'med' : 'low'; resize(); }
  }
}
resize();

/* ---------------- Continuar partida (punto de control por sector) ---------------- */
function saveCheckpoint() {
  if (!P || !P.alive || G.mode === 'endless') return;
  SAVE.cp = { ship: SHIP.id, diff: D.id, level, score, lvl: P.lvl, shield: P.shield, lives: P.lives, bombs: P.bombs, ult: P.ult, coins: runCoins, revive: !!P.revive };
  saveData(true);
}
function clearCheckpoint() { if (SAVE.cp) { delete SAVE.cp; saveData(true); } }
function resumeCheckpoint() {
  const c = SAVE.cp; if (!c) return;
  const si = SHIPS.findIndex(s => s.id === c.ship), di = DIFFS.findIndex(d => d.id === c.diff);
  if (si < 0 || di < 0) { clearCheckpoint(); return; }
  selShip = si; selDiff = di;
  startGame(true);
  level = c.level; score = c.score; P.lvl = c.lvl; syncWeapon(); P.shield = c.shield; P.lives = c.lives; P.bombs = c.bombs; P.ult = c.ult; runCoins = c.coins; P.revive = c.revive;
  setTheme((level - 1) % THEMES.length, true); showBanner(); setMusic('stage', level);
}
const CONT_BTN = () => ({ x: W / 2 - 170, y: H * 0.93 - 22, w: 340, h: 44 });

/* ---------------- Tutorial (primera partida) ---------------- */
const TUT = { step: -1, t: 0, moved: 0, lx: 0, ly: 0 };
const TUT_STEPS = [
  { text: 'Arrastra el dedo en cualquier parte de la pantalla para mover la nave', done: () => TUT.moved > 260, finger: true },
  { text: 'Disparas solo. Recoge los cristales ◆ verdes para subir de nivel', done: () => TUT.t > 5 },
  { text: 'BOMBA: borra todas las balas enemigas. Úsala cuando estés en apuros', done: () => TUT.t > 4.5, target: () => [UI.bomb[0], H - 74] },
  { text: 'ULTRA: se carga derrotando enemigos. Es tu ataque definitivo', done: () => TUT.t > 4.5, target: () => ULT_BTN() },
  { text: '¡Listo, piloto! Sobrevive y derrota al jefe del sector', done: () => TUT.t > 3 }
];
function tutStart() { if (SAVE.tutDone) return; TUT.step = 0; TUT.t = 0; TUT.moved = 0; TUT.lx = P.x; TUT.ly = P.y; }
const tutBlocking = () => TUT.step >= 0 && TUT.step < 2;
function updateTut(dt) {
  if (TUT.step < 0 || G.state !== 'play') return;
  TUT.t += dt; TUT.moved += Math.hypot(P.x - TUT.lx, P.y - TUT.ly); TUT.lx = P.x; TUT.ly = P.y;
  if (TUT_STEPS[TUT.step].done()) { TUT.step++; TUT.t = 0; SFX.ui(); if (TUT.step >= TUT_STEPS.length) { TUT.step = -1; SAVE.tutDone = 1; saveData(true); } }
}
function drawTut() {
  if (TUT.step < 0 || G.state !== 'play') return;
  const S = TUT_STEPS[TUT.step], y = H * 0.3, k = Math.min(1, TUT.t * 3);
  ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(6,10,26,0.9)'; rr(ctx, 30, y - 40, W - 60, 80, 14); ctx.fill();
  ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2; ctx.stroke();
  txt('TUTORIAL ' + (TUT.step + 1) + '/' + TUT_STEPS.length, W / 2, y - 24, 11, '#00e5ff', 'center', null, 900);
  ctx.font = `700 15px ${FONT}`; let line = '', yy = y; const lines = [];
  for (const w of S.text.split(' ')) { const t2 = line ? line + ' ' + w : w; if (ctx.measureText(t2).width > W - 100 && line) { lines.push(line); line = w; } else line = t2; }
  lines.push(line); yy = y + (lines.length === 1 ? 4 : -4);
  for (const l of lines) { txt(l, W / 2, yy, 15, '#ffffff', 'center', null, 700); yy += 20; }
  if (S.finger) {
    const fx = P.x + Math.sin(G.t * 3) * 70, fy = P.y + 70;
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(fx, fy, 14, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(0,229,255,0.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, 20 + Math.sin(G.t * 8) * 3, 0, TAU); ctx.stroke();
  }
  if (S.target) {
    const [tx, ty] = S.target(), b = Math.sin(G.t * 8) * 6;
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(tx, ty, 48 + b, 0, TAU); ctx.stroke();
    ctx.fillStyle = '#ffd23f'; poly(ctx, [tx - 60 - b, ty - 60 - b, tx - 36 - b, ty - 50 - b, tx - 50 - b, ty - 36 - b]); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
