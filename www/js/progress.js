'use strict';
/* =====================================================================
   PROGRESO — niveles de nave (XP), vidas, power-ups y mejoras temporales
   ===================================================================== */
const MAX_LVL = 10;
const xpNeed = l => 6 + l * 4;                      // XP para pasar del nivel l al l+1
const minLvl = () => (SHIP.id === 'falcon' ? 3 : 1);
const lvlDmg = () => (1 + (P.lvl - 1) * 0.07) * (1 + 0.06 * upg('dmg'));        // +7 % de daño por nivel
const lvlRate = () => (1 - (P.lvl - 1) * 0.025) * (1 - 0.04 * upg('rate'));      // disparo un 2,5 % más rápido por nivel
function syncWeapon() { P.wl = Math.min(5, Math.ceil(P.lvl / 2)); }
const START_LIVES = { easy: 4, normal: 3, hard: 2 };

/* ---------------- Sprites ---------------- */
function makePU2(label, col, size = 19) {
  return sprite(46, 46, g => {
    g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.lineTo(23 + Math.cos(a) * 18, 23 + Math.sin(a) * 18); } g.closePath();
    g.shadowColor = col; g.shadowBlur = 12; g.fillStyle = 'rgba(8,12,28,0.88)'; g.fill();
    g.strokeStyle = col; g.lineWidth = 3; g.stroke();
    g.shadowBlur = 8; g.fillStyle = '#fff'; g.font = `900 ${size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(label, 23, 24);
  });
}
// t: clave, label, color, nombre visible, peso en el sorteo de premios
const PUDEF = {
  P: ['P', '#00e5ff', 'NIVEL +1', 30], S: ['S', '#39ff88', 'ESCUDO', 14], B: ['B', '#ff8a2b', 'BOMBA', 8],
  D: ['D', '#7c4dff', 'DRONES ESCOLTA', 8], E: ['E', '#7ff6ff', 'BARRERA', 8], H: ['H', '#ffe14d', 'HIPER-CADENCIA', 9],
  M: ['M', '#ff2bd6', 'IMÁN', 8], U: ['ULT', '#e8e8ff', 'CARGA ULTRA', 6], T: ['T', '#9ab8ff', 'TIEMPO LENTO', 6], X: ['×2', '#ffb800', 'PUNTOS ×2', 7], V: ['1UP', '#ff3355', 'VIDA EXTRA', 2]
};
for (const k in PUDEF) SPR['pu' + k] = makePU2(PUDEF[k][0], PUDEF[k][1], PUDEF[k][0].length > 2 ? 13 : PUDEF[k][0].length > 1 ? 16 : 19);
const BUFFS = { D: ['drone', 20], H: ['hyper', 10], M: ['magnet', 15], T: ['slow', 6], X: ['mult', 15] };
SPR.xc1 = sprite(14, 20, g => {
  g.fillStyle = lg(g, 0, 0, 14, 20, ['#d8fff4', '#2bf0c0', '#0a8a70']); poly(g, [7, 0, 14, 10, 7, 20, 0, 10]); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.8)'; poly(g, [7, 2, 10, 9, 7, 8]); g.fill();
});
SPR.xc5 = sprite(20, 28, g => {
  g.fillStyle = lg(g, 0, 0, 20, 28, ['#f6e0ff', '#c86bff', '#5a1a9a']); poly(g, [10, 0, 20, 14, 10, 28, 0, 14]); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 1; g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.85)'; poly(g, [10, 3, 14, 12, 10, 11]); g.fill();
});
SPR.escort = sprite(30, 30, g => {
  g.fillStyle = lg(g, 0, 0, 30, 30, ['#c8b8ff', '#4a2aa0']); poly(g, [15, 0, 28, 20, 15, 15, 2, 20]); g.fill();
  g.strokeStyle = '#7c4dff'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = radial(g, 15, 14, 6, [[0, '#fff'], [0.4, '#7ff6ff'], [1, 'rgba(0,200,255,0)']]); g.beginPath(); g.arc(15, 14, 6, 0, TAU); g.fill();
});
SPR.ebolt = sprite(10, 22, g => {
  g.fillStyle = lg(g, 0, 0, 0, 22, ['#ffffff', '#b8a0ff', 'rgba(124,77,255,0)']); rr(g, 3, 1, 4, 20, 2); g.fill();
});

/* ---------------- Estado de progreso ---------------- */
let XC = [];
function initProgress() {
  P.lvl = minLvl(); P.xp = 0; syncWeapon();
  P.lives = START_LIVES[D.id]; P.barrier = 0; P.lvlFx = 0;
  P.buf = { drone: 0, hyper: 0, magnet: 0, slow: 0, mult: 0 };
  P.esc = [{ x: P.x - 50, y: P.y + 10, ft: 0 }, { x: P.x + 50, y: P.y + 10, ft: 0.09 }];
  XC = [];
}
const slowK = () => (P && P.ultT > 0 && SHIP.id === 'rayo' ? 0.35 : P && P.buf && P.buf.slow > 0 ? 0.45 : 1);
const scoreMult = () => (P && P.buf && P.buf.mult > 0 ? 2 : 1);

/* ---------------- Cristales de XP ---------------- */
function dropXP(x, y, total) {
  total = Math.max(1, Math.round(total));
  const big = Math.floor(total / 5), small = Math.min(12, total - big * 5);
  const n = Math.min(big, 20);
  for (let i = 0; i < n + small; i++) {
    const a = rand(0, TAU), v = rand(60, 220);
    XC.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, v: i < n ? 5 : 1, t: 0 });
  }
}
function gainXP(v) {
  if (P.lvl >= MAX_LVL) { score += v * 20; return; }
  P.xp += v;
  while (P.lvl < MAX_LVL && P.xp >= xpNeed(P.lvl)) { P.xp -= xpNeed(P.lvl); levelUp(); }
  if (P.lvl >= MAX_LVL) P.xp = 0;
}
function levelUp() {
  P.lvl++; syncWeapon(); P.lvlFx = 1.2;
  RINGS.push({ x: P.x, y: P.y, t: 0, dur: 0.6, r: 140, c: 'rgba(0,229,255,' });
  burst(P.x, P.y, 26, 'cyan', 300, 0.6, 0.9);
  FT.push({ x: P.x, y: P.y - 70, t: 0, s: P.lvl >= MAX_LVL ? 'NIVEL MÁXIMO' : 'NIVEL ' + P.lvl, big: true, col: '#7ff6ff' });
  SFX.levelUp();
}
function updateXP(dt) {
  const mag = P.alive && P.buf.magnet > 0, rad = mag ? 2000 : magRadius(), damp = Math.pow(0.08, dt);
  for (const c of XC) {
    c.t += dt; c.vx *= damp; c.vy *= damp;
    if (P.alive) {
      const dx = P.x - c.x, dy = P.y - c.y, d = Math.hypot(dx, dy);
      if (d < rad && c.t > 0.25) { const sp = mag ? 700 : 520; c.x += dx / d * sp * dt; c.y += dy / d * sp * dt; }
      if (d < 30) { c.dead = true; if (c.coin) { addCoins(c.v); SFX.coin(); } else { gainXP(c.v); SFX.xp(); } continue; }
    }
    c.x += c.vx * dt; c.y += (c.vy + bgSpeed * 0.8) * dt;
    if (c.t > 9 || c.y > H + 30) c.dead = true;
  }
  XC = XC.filter(c => !c.dead);
}
function drawXP() {
  ctx.globalCompositeOperation = 'lighter';
  for (const c of XC) drawSpr(c.coin ? GLOW.amber : c.v > 1 ? GLOW.purple : GLOW.green, c.x, c.y, 0, c.v > 1 ? 1.1 : 0.7);
  ctx.globalCompositeOperation = 'source-over';
  for (const c of XC) {
    if (c.t > 7 && Math.floor(c.t * 10) % 2) continue;
    if (c.coin) { const sx = Math.abs(Math.cos(c.t * 5 + c.x)); ctx.save(); ctx.translate(c.x, c.y); ctx.scale(0.3 + sx * 0.7, 1); const sp = c.v > 1 ? SPR.coinBig : SPR.coin; ctx.drawImage(sp, -sp.w / 2, -sp.h / 2, sp.w, sp.h); ctx.restore(); }
    else drawSpr(c.v > 1 ? SPR.xc5 : SPR.xc1, c.x, c.y, Math.sin(c.t * 4 + c.x) * 0.3);
  }
}

/* ---------------- Daño, vidas y reaparición ---------------- */
function hurtPlayer() {
  if (P.inv > 0 || !P.alive) return;
  if (P.barrier > 0) {
    P.barrier--; P.inv = 0.6; SFX.barrier(); vib(40);
    RINGS.push({ x: P.x, y: P.y, t: 0, dur: 0.35, r: 70, c: 'rgba(127,246,255,' });
    return;
  }
  P.shield--; shake = 14; SFX.hurt(); vib(90);
  if (P.lvl > minLvl()) { P.lvl--; syncWeapon(); FT.push({ x: P.x, y: P.y - 60, t: 0, s: 'NIVEL ' + P.lvl, col: '#ff7a8a' }); }
  P.xp = 0; P.inv = D.inv; comboBreak();
  burst(P.x, P.y, 18, 'cyan', 260, 0.6, 1.1);
  if (P.shield > 0) return;
  if (P.revive) {
    P.revive = false; P.shield = startShield(); P.inv = 3.2; flash = 0.7; vib(250);
    NOVA = { x: P.x, y: P.y, r: 0, hit: [], bossHit: false }; P.reviveT = 1.3;
    FT.push({ x: W / 2, y: H * 0.5, t: 0, s: '¡RENACER!', big: true, col: '#ff6a2b' }); SFX.bomb();
    return;
  }
  if (P.lives > 1) {
    P.lives--; explode(P.x, P.y, 2.5); flash = 0.6; vib(250);
    for (const b of eB) if (Math.hypot(b.x - P.x, b.y - P.y) < 220) b.dead = true;
    P.shield = startShield(); P.inv = 3.2;
    P.x = P.tx = W / 2; P.y = P.ty = H - 180; P.esc.forEach(e => { e.x = P.x; e.y = P.y; });
    FT.push({ x: W / 2, y: H * 0.5, t: 0, s: 'VIDAS: ' + P.lives, big: true, col: '#ff3355' });
    return;
  }
  P.lives = 0; P.alive = false; explode(P.x, P.y, 3); flash = 0.8; vib(400); laserHum(false);
  if (score > hi) { hi = score; newRecord = true; try { localStorage.setItem('ns_hi_' + D.id, hi); } catch (e) { } }
}

/* ---------------- Power-ups ---------------- */
function rollDrop(big) {
  if (Math.random() > (big ? 0.85 : 0.09) * D.drop) return null;
  const pool = Object.keys(PUDEF).filter(k => k !== 'V' || big);
  let r = Math.random() * pool.reduce((s, k) => s + PUDEF[k][3], 0);
  for (const k of pool) { r -= PUDEF[k][3]; if (r <= 0) return k; }
  return 'P';
}
function collectPU(u) {
  const def = PUDEF[u.t]; let label = def[2];
  SFX.power(); burst(u.x, u.y, 14, 'cyan', 200, 0.5, 0.8);
  switch (u.t) {
    case 'P': if (P.lvl < MAX_LVL) { P.xp = 0; levelUp(); return; } score += 1000; label = '+1000'; break;
    case 'S': if (P.shield < P.maxShield) P.shield++; else { score += 1000; label = '+1000'; } break;
    case 'B': if (P.bombs < 5) P.bombs++; else { score += 1000; label = '+1000'; } break;
    case 'E': P.barrier = 3; break;
    case 'U': if (P.ult < 100 && !(P.ultT > 0)) gainUlt(50); else { score += 1000; label = '+1000'; } break;
    case 'V': if (P.lives < 5) P.lives++; else { score += 5000; label = '+5000'; } break;
    default: { const [k, dur] = BUFFS[u.t]; P.buf[k] = dur; }
  }
  FT.push({ x: u.x, y: u.y - 20, t: 0, s: label, col: def[1] });
}
function updateBuffs(dt) {
  for (const k in P.buf) P.buf[k] = Math.max(0, P.buf[k] - dt);
  P.lvlFx = Math.max(0, P.lvlFx - dt); P.webT = Math.max(0, (P.webT || 0) - dt);
  // drones escolta
  const own = SHIP.id === 'sentinel';
  if ((P.buf.drone > 0 || own) && P.alive) {
    P.esc.forEach((e, i) => {
      const s = i ? 1 : -1, oa = G.t * 2.4 + i * Math.PI;
      const tx = own ? P.x + Math.cos(oa) * 58 : P.x + s * 52, ty = own ? P.y + Math.sin(oa) * 40 : P.y + 12 + Math.sin(G.t * 4 + i * 2) * 6;
      e.x += (tx - e.x) * Math.min(1, dt * 9); e.y += (ty - e.y) * Math.min(1, dt * 9);
      e.ft -= dt;
      if (e.ft <= 0) { e.ft = own && P.buf.drone <= 0 ? 0.24 : 0.17; pB.push({ x: e.x, y: e.y - 14, vx: 0, vy: -1100, r: 6, dmg: 0.6 * lvlDmg(), rot: 0, spr: SPR.ebolt }); }
    });
  } else P.esc.forEach(e => { e.x = P.x; e.y = P.y; });
}
function drawEscorts() {
  const own = SHIP.id === 'sentinel';
  if (!P.alive || (P.buf.drone <= 0 && !own)) return;
  const fade = !own && P.buf.drone < 2 && Math.floor(G.t * 10) % 2;
  if (fade) return;
  for (const e of P.esc) {
    ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW.purple, e.x, e.y + 14, 0, 0.7); ctx.globalCompositeOperation = 'source-over';
    drawSpr(SPR.escort, e.x, e.y);
  }
}
function drawPlayerFx() {
  if (!P.alive) return;
  // aura según nivel
  if (P.lvl >= 4) {
    ctx.globalCompositeOperation = 'lighter';
    const gold = P.lvl >= MAX_LVL, k = (P.lvl - 3) / 7;
    ctx.globalAlpha = 0.25 + 0.35 * k + Math.sin(G.t * 5) * 0.1;
    drawSpr(gold ? GLOW.amber : GLOW[SHIP.glow], P.x, P.y, 0, 2.6 + k * 1.4);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (P.lvl >= 7 && Math.random() < 0.5) PA.push({ x: P.x + rand(-40, 40), y: P.y + 30, vx: 0, vy: 120, life: 0.35, max: 0.35, s: 0.4, c: gold ? 'amber' : 'white' });
  }
  if (P.webT > 0) { ctx.globalAlpha = Math.min(1, P.webT); drawSpr(SPR.eo_web, P.x, P.y, G.t, 3.2); ctx.globalAlpha = 1; }
  if (P.barrier > 0) {
    ctx.strokeStyle = 'rgba(127,246,255,0.75)'; ctx.lineWidth = 2 + P.barrier;
    ctx.beginPath(); ctx.arc(P.x, P.y, 48, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 0.12; ctx.fillStyle = '#7ff6ff'; ctx.fill(); ctx.globalAlpha = 1;
  }
  if (P.lvlFx > 0) {
    ctx.globalAlpha = Math.min(1, P.lvlFx); ctx.strokeStyle = '#7ff6ff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(P.x, P.y, 40 + (1.2 - P.lvlFx) * 90, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
  }
}
function drawProgressHUD() {
  // vidas (arriba a la izquierda, debajo del récord)
  for (let i = 0; i < P.lives; i++) drawSpr(SPR[SHIP.id], 28 + i * 24, H - 92, 0, 0.22);
  // nivel + barra de XP
  const x = 30 + P.maxShield * 20, y = H - 64;
  txt('NIVEL ' + P.lvl + (P.lvl >= MAX_LVL ? ' MAX' : ''), x, y, 11, '#7ff6ff', 'left', null, 800);
  const bw = 120, k = P.lvl >= MAX_LVL ? 1 : P.xp / xpNeed(P.lvl);
  ctx.fillStyle = 'rgba(0,229,255,0.15)'; ctx.fillRect(x, H - 50, bw, 10);
  ctx.fillStyle = P.lvl >= MAX_LVL ? '#ffb800' : '#2bf0c0'; ctx.fillRect(x, H - 50, bw * k, 10);
  ctx.strokeStyle = 'rgba(127,246,255,0.6)'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, H - 49.5, bw, 10);
  for (let i = 0; i < MAX_LVL; i++) { ctx.fillStyle = i < P.lvl ? '#7ff6ff' : 'rgba(127,246,255,0.18)'; ctx.fillRect(x + i * 12, H - 36, 9, 5); }
  // mejoras temporales activas
  let bx = 26;
  const by = H - 136;
  const act = Object.entries(BUFFS).filter(([, [k]]) => P.buf[k] > 0);
  if (P.barrier > 0) act.unshift(['E', ['barrier', 3]]);
  for (const [t, [k, dur]] of act) {
    const left = k === 'barrier' ? P.barrier / 3 : P.buf[k] / dur;
    drawSpr(SPR['pu' + t], bx, by, 0, 0.72);
    ctx.strokeStyle = PUDEF[t][1]; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(bx, by, 20, -Math.PI / 2, -Math.PI / 2 + TAU * left); ctx.stroke();
    bx += 44;
  }
  if (P.buf.slow > 0) { ctx.fillStyle = 'rgba(80,120,255,0.08)'; ctx.fillRect(0, 0, W, H); }
}
