'use strict';
/* =====================================================================
   NAVES NUEVAS (Fénix, Centinela, Vórtice) y ATAQUES DEFINITIVOS (ULTRA)
   ===================================================================== */

/* ---------------- Sprites de las naves nuevas ---------------- */
SPR.fenix = sprite(100, 100, g => {
  const cx = 50;
  const wing = [cx, 14, cx + 20, 40, cx + 48, 44, cx + 40, 58, cx + 48, 70, cx + 30, 72, cx + 36, 86, cx + 12, 76, cx, 90,
    cx - 12, 76, cx - 36, 86, cx - 30, 72, cx - 48, 70, cx - 40, 58, cx - 48, 44, cx - 20, 40];
  g.shadowColor = '#ff6a2b'; g.shadowBlur = 12; g.fillStyle = '#3a1206'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 14, 0, 90, ['#a8401a', '#2a0a04']); poly(g, wing); g.fill();
  g.strokeStyle = '#ffb02a'; g.lineWidth = 1.8; g.stroke();
  g.strokeStyle = '#ff3d1f'; g.lineWidth = 1.5;
  for (const s of [-1, 1]) {
    g.beginPath(); g.moveTo(cx + s * 14, 46); g.lineTo(cx + s * 44, 48); g.moveTo(cx + s * 14, 56); g.lineTo(cx + s * 42, 66);
    g.moveTo(cx + s * 12, 66); g.lineTo(cx + s * 32, 82); g.stroke();
  }
  g.fillStyle = lg(g, cx - 9, 0, cx + 9, 0, ['#a05030', '#ffe6c8', '#904020']);
  g.beginPath(); g.moveTo(cx, 4); g.quadraticCurveTo(cx + 10, 30, cx + 8, 78); g.lineTo(cx, 88); g.lineTo(cx - 8, 78); g.quadraticCurveTo(cx - 10, 30, cx, 4); g.fill();
  g.fillStyle = lg(g, 0, 24, 0, 46, ['#fff6b0', '#ff8a00']); g.beginPath(); g.ellipse(cx, 34, 4, 10, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, cx, 62, 9, [[0, '#fff'], [0.4, '#ff8a2b'], [1, 'rgba(255,60,0,0)']]); g.beginPath(); g.arc(cx, 62, 9, 0, TAU); g.fill();
});
SPR.sentinel = sprite(100, 100, g => {
  const cx = 50;
  g.strokeStyle = 'rgba(127,246,255,0.45)'; g.lineWidth = 3; g.beginPath(); g.arc(cx, 54, 42, 0, TAU); g.stroke();
  for (const s of [-1, 1]) {
    const pts = [cx + s * 46, 48, cx + s * 14, 38, cx + s * 14, 72, cx + s * 46, 76];
    g.shadowColor = '#7ff6ff'; g.shadowBlur = 8; g.fillStyle = lg(g, 0, 38, 0, 76, ['#3e6080', '#142030']); poly(g, pts); g.fill(); g.shadowBlur = 0;
    g.strokeStyle = '#7ff6ff'; g.lineWidth = 1.5; g.stroke();
    g.fillStyle = 'rgba(127,246,255,0.75)'; rr(g, cx + s * 46 - 4, 44, 8, 36, 3); g.fill();
  }
  g.fillStyle = lg(g, cx - 14, 0, cx + 14, 0, ['#6a7a90', '#f4faff', '#5a6a80']);
  poly(g, [cx, 6, cx + 14, 26, cx + 14, 80, cx, 92, cx - 14, 80, cx - 14, 26]); g.fill();
  g.strokeStyle = '#1a2a3a'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = lg(g, 0, 28, 0, 48, ['#d8fbff', '#0a7aa8']); rr(g, cx - 6, 28, 12, 18, 5); g.fill();
  g.fillStyle = '#7ff6ff'; g.fillRect(cx - 1, 54, 2, 28);
});
SPR.vortex = sprite(100, 100, g => {
  const cx = 50;
  const wing = [cx, 20, cx + 30, 52, cx + 46, 84, cx + 22, 76, cx, 88, cx - 22, 76, cx - 46, 84, cx - 30, 52];
  g.shadowColor = '#ff4fa0'; g.shadowBlur = 12; g.fillStyle = '#2a0a1c'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 20, 0, 88, ['#6a2050', '#1a0612']); poly(g, wing); g.fill();
  g.strokeStyle = '#ff4fa0'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(255,208,232,0.55)'; g.lineWidth = 1;
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx + s * 8, 40); g.lineTo(cx + s * 40, 80); g.stroke(); }
  for (const s of [-1, 1]) { g.fillStyle = '#ff4fa0'; rr(g, cx + s * 28 - 4, 58, 8, 20, 3); g.fill(); }
  g.fillStyle = lg(g, cx - 9, 0, cx + 9, 0, ['#7a5a70', '#ffeef8', '#6a4a60']);
  g.beginPath(); g.moveTo(cx - 6, 14); g.lineTo(cx + 6, 14); g.lineTo(cx + 9, 80); g.lineTo(cx, 90); g.lineTo(cx - 9, 80); g.closePath(); g.fill();
  g.fillStyle = lg(g, 0, 34, 0, 54, ['#ffe0f0', '#c0207a']); rr(g, cx - 4, 34, 8, 18, 4); g.fill();
  g.strokeStyle = '#ff4fa0'; g.lineWidth = 3; g.beginPath(); g.arc(cx, 14, 9, 0, TAU); g.stroke();
  g.fillStyle = radial(g, cx, 14, 8, [[0, '#fff'], [0.5, '#ff8ac8'], [1, 'rgba(255,0,120,0)']]); g.beginPath(); g.arc(cx, 14, 8, 0, TAU); g.fill();
});
SPR.flameR = makeFlame('#ffb02a', 'rgba(255,60,0,0.6)', 'rgba(200,0,0,0)');
SPR.flameK = makeFlame('#ffb0d8', 'rgba(255,60,160,0.6)', 'rgba(200,0,120,0)');
SPR.fireShot = sprite(32, 32, g => {
  g.fillStyle = radial(g, 16, 16, 16, [[0, '#ffffff'], [0.25, '#fff0a0'], [0.5, 'rgba(255,140,30,0.85)'], [1, 'rgba(255,40,0,0)']]);
  g.fillRect(0, 0, 32, 32);
});
for (const k of ['fenix', 'sentinel', 'vortex']) { SHD[k] = tint(SPR[k], 'rgba(0,0,0,0.45)'); FL[k] = tint(SPR[k], 'rgba(255,255,255,0.85)'); }

SHIPS.push(
  { id: 'fenix', name: 'FÉNIX', role: 'Asalto', col: '#ff6a2b', glow: 'orange', speed: 1.05, armor: 3, maxArmor: 5, rate: 0.05, dmg: 0.42, hit: 9, bombs: 2, weapon: 'flame', flame: 'flameR',
    flames: [[-14, 40, 14, 34], [14, 40, 14, 34]], bars: [7, 6, 10, 9], skill: 'Renace una vez por partida',
    desc: 'Lanzallamas devastador que atraviesa enemigos, pero de corto alcance: hay que acercarse.' },
  { id: 'sentinel', name: 'CENTINELA', role: 'Defensor', col: '#7ff6ff', glow: 'cyan', speed: 0.95, armor: 4, maxArmor: 6, rate: 0.12, dmg: 0.85, hit: 10, bombs: 2, weapon: 'twin', flame: 'flame',
    flames: [[-8, 42, 14, 30], [8, 42, 14, 30]], bars: [6, 8, 5, 4], skill: '2 drones propios siempre activos',
    desc: 'Muy resistente y protegido por dos drones que disparan a su lado. Su cañón hace poco daño.' },
  { id: 'vortex', name: 'VÓRTICE', role: 'Rayo continuo', col: '#ff4fa0', glow: 'mag', speed: 1, armor: 2, maxArmor: 3, rate: 0.05, dmg: 0.95, hit: 8, bombs: 1, weapon: 'beam', flame: 'flameK',
    flames: [[-12, 40, 14, 30], [12, 40, 14, 30]], bars: [6, 3, 10, 8], skill: 'Láser que no se detiene nunca',
    desc: 'Un láser continuo de daño altísimo que sigue a la nave. Aguanta muy pocos golpes.' }
);

/* ---------------- Armas especiales ---------------- */
function fireFlame(x, y, L, dm) {
  const n = 1 + Math.ceil(L / 2), spread = 0.14 + L * 0.035;
  for (let i = 0; i < n; i++) {
    const a = rand(-spread, spread), sp = rand(620, 760), life = 0.3 + L * 0.015;
    pB.push({ x: x + rand(-6, 6), y, vx: Math.sin(a) * sp, vy: -Math.cos(a) * sp, r: 13, dmg: dm, rot: 0, spr: SPR.fireShot, life, max: life, grow: true, pierce: true, hits: [] });
  }
}
let BEAM = null;
function beamWidth() { return 5 + P.wl * 3; }
function updateBeam(dt) {
  BEAM = null;
  if (SHIP.weapon !== 'beam' || !P.alive || G.state !== 'play') { humCtl('pbeam', false); return; }
  const w = beamWidth(), x = P.x, y0 = P.y - 46;
  let endY = -20, tgt = null, isBoss = false;
  for (const e of EN) {
    if (e.dead || e.delay > 0 || e.y > y0 || e.y < -20) continue;
    if (Math.abs(e.x - x) < e.r + w && e.y > endY) { endY = e.y; tgt = e; isBoss = false; }
  }
  if (boss && !boss.dying && !boss.enter) for (const box of bossBoxes(boss)) {
    const [bx, by, r] = box;
    if (by > y0 || Math.abs(bx - x) > r + w) continue;
    const yy = by + Math.sqrt(Math.max(0, r * r - (bx - x) ** 2)) * 0.8;
    if (yy > endY) { endY = yy; tgt = box; isBoss = true; }
  }
  BEAM = { x, y0, y1: endY, w };
  P.fireT -= dt;
  if (P.fireT <= 0) {
    P.fireT = SHIP.rate * lvlRate() * (P.buf.hyper > 0 ? 0.5 : 1);
    const d = SHIP.dmg * lvlDmg() * (1 + 0.3 * (P.wl - 1));
    if (tgt && isBoss) hitBossBox(tgt, d, x, endY);
    else if (tgt) hitEnemy(tgt, d, x, endY);
  }
  humCtl('pbeam', true, 392, 588, 0.016, 3, 1500, ['sine', 'triangle']);
}
function drawBeam() {
  if (!BEAM) return;
  const { x, y0, y1, w } = BEAM, f = 0.85 + Math.random() * 0.3;
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(255,79,160,0.28)'; ctx.fillRect(x - w * 1.8 * f, y1, w * 3.6 * f, y0 - y1);
  ctx.fillStyle = 'rgba(255,150,210,0.6)'; ctx.fillRect(x - w * 0.8, y1, w * 1.6, y0 - y1);
  ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fillRect(x - w * 0.3, y1, w * 0.6, y0 - y1);
  drawSpr(GLOW.mag, x, y0, 0, 1.4 * f);
  if (y1 > 0) { drawSpr(GLOW.white, x, y1, 0, 1.6 * f); if (Math.random() < 0.6) burst(x, y1, 1, 'mag', 200, 0.2, 0.5); }
  ctx.globalCompositeOperation = 'source-over';
}

/* ---------------- Carga del ULTRA ---------------- */
function gainUlt(v) {
  if (!P || P.ultT > 0 || P.ult >= 100) return;
  P.ult = Math.min(100, P.ult + v);
  if (P.ult >= 100) { FT.push({ x: W / 2, y: H * 0.62, t: 0, s: '¡ULTRA LISTO!', big: true, col: SHIP.col }); SFX.ultReady(); }
}
function hurtEnemyQuiet(e, d) { if (e.dead || e.delay > 0) return; e.hp -= d; e.hit = 0.05; if (e.hp <= 0) hitEnemy(e, 0, e.x, e.y); }
function hurtBossQuiet(d) { if (!boss || boss.dying || boss.enter) return; damageBoss(d, boss.x, boss.y, true); }
function nearBoss(x, y, pad) { if (!boss || boss.dying || boss.enter) return false; return bossBoxes(boss).some(([bx, by, r]) => Math.hypot(bx - x, by - y) < r + pad); }

/* ---------------- Ataques definitivos ---------------- */
let STRIKES = [], NOVA = null, HOLE = null;
const ULTS = {
  falcon: { name: 'CAÑÓN NOVA', dur: 3.2,
    tick(dt) {
      const x = P.x, half = 38;
      for (const e of EN) if (e.y < P.y && Math.abs(e.x - x) < e.r + half) hurtEnemyQuiet(e, 55 * dt * lvlDmg());
      if (boss && bossBoxes(boss).some(([bx, by, r]) => by < P.y && Math.abs(bx - x) < r + half)) hurtBossQuiet(140 * dt * lvlDmg());
      for (const b of eB) if (b.y < P.y && Math.abs(b.x - x) < half + 6) b.dead = true;
      shake = Math.max(shake, 4);
    },
    draw() {
      const x = P.x, y0 = P.y - 40, f = 0.9 + Math.random() * 0.2;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(0,229,255,0.25)'; ctx.fillRect(x - 60 * f, 0, 120 * f, y0);
      ctx.fillStyle = 'rgba(0,229,255,0.55)'; ctx.fillRect(x - 36, 0, 72, y0);
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillRect(x - 14 * f, 0, 28 * f, y0);
      drawSpr(GLOW.cyan, x, y0, 0, 4 * f);
      ctx.globalCompositeOperation = 'source-over';
    } },
  rayo: { name: 'SOBREMARCHA', dur: 5,
    tick() { P.inv = Math.max(P.inv, 0.15); if (Math.random() < 0.8) PA.push({ x: P.x + rand(-30, 30), y: P.y + 40, vx: 0, vy: 500, life: 0.25, max: 0.25, s: 0.6, c: 'yellow' }); },
    draw() {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.5 + Math.random() * 0.3; drawSpr(GLOW.yellow, P.x, P.y, 0, 5); ctx.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(255,225,77,0.35)'; ctx.fillRect(rand(0, W), rand(0, H), 2, rand(40, 120)); }
      ctx.globalCompositeOperation = 'source-over';
    } },
  titan: { name: 'BOMBARDEO ORBITAL', dur: 3.6,
    tick() {
      P.ultA = (P.ultA || 0) - 1 / 60;
      if (Math.random() < 0.16) {
        const tg = EN.filter(e => !e.dead && e.delay <= 0 && e.y > 0 && e.y < H);
        let x, y;
        if (tg.length && Math.random() < 0.7) { const e = pick(tg); x = e.x + rand(-20, 20); y = e.y + rand(-20, 20); }
        else if (boss && !boss.dying && Math.random() < 0.6) { x = boss.x + rand(-150, 150); y = boss.y + rand(-60, 60); }
        else { x = rand(40, W - 40); y = rand(60, P.y - 120); }
        STRIKES.push({ x, y, t: 0 });
      }
    } },
  spectre: { name: 'ENJAMBRE', dur: 1.6,
    tick() {
      if (Math.random() < 0.6) {
        const a = rand(-2.6, -0.5);
        pB.push({ x: P.x, y: P.y, vx: Math.cos(a) * 300, vy: Math.sin(a) * 300, r: 9, dmg: 4 * lvlDmg(), missile: true, rot: 0, sp: 300, spr: SPR.missile });
        SFX.missile(P.x);
      }
    } },
  fenix: { name: 'SUPERNOVA', dur: 1.3,
    start() { NOVA = { x: P.x, y: P.y, r: 0, hit: [] , bossHit: false }; SFX.bomb(); },
    tick(dt) {
      if (!NOVA) return;
      NOVA.r += 720 * dt;
      for (const e of EN) if (!NOVA.hit.includes(e) && Math.hypot(e.x - NOVA.x, e.y - NOVA.y) < NOVA.r) { NOVA.hit.push(e); hurtEnemyQuiet(e, 45 * lvlDmg()); }
      for (const b of eB) if (Math.hypot(b.x - NOVA.x, b.y - NOVA.y) < NOVA.r) { b.dead = true; PA.push({ x: b.x, y: b.y, vx: 0, vy: 0, life: 0.3, max: 0.3, s: 0.6, c: 'fire' }); }
      if (!NOVA.bossHit && nearBoss(NOVA.x, NOVA.y, NOVA.r)) { NOVA.bossHit = true; hurtBossQuiet(160 * lvlDmg()); }
    },
    end() { NOVA = null; },
    draw() {
      if (!NOVA) return;
      const k = NOVA.r / 900;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `rgba(255,140,40,${Math.max(0, 0.8 - k * 0.6)})`; ctx.lineWidth = 46;
      ctx.beginPath(); ctx.arc(NOVA.x, NOVA.y, NOVA.r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = `rgba(255,240,180,${Math.max(0, 0.9 - k * 0.7)})`; ctx.lineWidth = 12; ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    } },
  sentinel: { name: 'MURALLA', dur: 7,
    tick() {
      for (const b of eB) {
        const dx = b.x - P.x, dy = b.y - P.y, d = Math.hypot(dx, dy);
        if (dy < -10 && d > 70 && d < 120 && Math.abs(dx) < 120) {
          b.dead = true;
          pB.push({ x: b.x, y: b.y, vx: -b.vx * 0.5, vy: -Math.abs(b.vy) - 500, r: 7, dmg: 2 * lvlDmg(), rot: 0, spr: SPR.ebolt });
          if (Math.random() < 0.3) burst(b.x, b.y, 3, 'cyan', 120, 0.2, 0.5);
        }
      }
    },
    draw() {
      ctx.globalCompositeOperation = 'lighter';
      const f = 0.8 + Math.sin(G.t * 20) * 0.2;
      ctx.strokeStyle = `rgba(127,246,255,${0.35 * f})`; ctx.lineWidth = 40;
      ctx.beginPath(); ctx.arc(P.x, P.y, 95, -Math.PI * 0.85, -Math.PI * 0.15); ctx.stroke();
      ctx.strokeStyle = 'rgba(220,255,255,0.9)'; ctx.lineWidth = 4; ctx.stroke();
      for (let a = -0.85; a <= -0.15; a += 0.1) drawSpr(GLOW.cyan, P.x + Math.cos(a * Math.PI) * 95, P.y + Math.sin(a * Math.PI) * 95, 0, 0.6);
      ctx.globalCompositeOperation = 'source-over';
    } },
  vortex: { name: 'AGUJERO NEGRO', dur: 5.5,
    start() { HOLE = { x: clamp(P.x, 80, W - 80), y: Math.max(170, P.y - 340), t: 0 }; },
    tick(dt) {
      if (!HOLE) return;
      HOLE.t += dt;
      for (const e of EN) {
        if (e.dead || e.delay > 0 || e.ground) continue;
        const dx = HOLE.x - e.x, dy = HOLE.y - e.y, d = Math.hypot(dx, dy) || 1;
        if (d < 420) { e.x += dx / d * 200 * dt; e.y += dy / d * 200 * dt; if (e.bx !== undefined) e.bx += dx / d * 200 * dt; }
        if (d < 70) hurtEnemyQuiet(e, 30 * dt * lvlDmg());
      }
      for (const b of eB) {
        const dx = HOLE.x - b.x, dy = HOLE.y - b.y, d = Math.hypot(dx, dy) || 1;
        if (d < 460) { b.vx += dx / d * 900 * dt; b.vy += dy / d * 900 * dt; }
        if (d < 34) b.dead = true;
      }
      if (nearBoss(HOLE.x, HOLE.y, 90)) hurtBossQuiet(70 * dt * lvlDmg());
    },
    end() { if (HOLE) explode(HOLE.x, HOLE.y, 3); HOLE = null; },
    draw() {
      if (!HOLE) return;
      const { x, y, t } = HOLE, s = Math.min(1, t * 3);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(255,79,160,${0.5 - i * 0.12})`; ctx.lineWidth = 6 - i;
        ctx.beginPath(); ctx.ellipse(x, y, (70 + i * 26) * s, (26 + i * 10) * s, t * (2 + i), 0, TAU); ctx.stroke();
      }
      drawSpr(GLOW.purple, x, y, 0, 5 * s);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x, y, 30 * s, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#ff8ac8'; ctx.lineWidth = 2; ctx.stroke();
    } }
};
function useUltra() {
  if (!P || !P.alive || G.state !== 'play' || P.ult < 100 || P.ultT > 0) return;
  const U = ULTS[SHIP.id];
  P.ult = 0; P.ultT = U.dur; P.ultA = 0;
  if (U.start) U.start();
  flash = 0.5; shake = 14; vib(220); SFX.ultra();
  FT.push({ x: W / 2, y: H * 0.45, t: 0, s: U.name, big: true, col: SHIP.col });
}
function updateUlt(dt) {
  for (const s of STRIKES) {
    s.t += dt;
    if (s.t >= 0.35 && !s.done) {
      s.done = true; explode(s.x, s.y, 1.6);
      for (const e of EN) if (Math.hypot(e.x - s.x, e.y - s.y) < e.r + 70) hurtEnemyQuiet(e, 22 * lvlDmg());
      if (nearBoss(s.x, s.y, 40)) hurtBossQuiet(45 * lvlDmg());
      for (const b of eB) if (Math.hypot(b.x - s.x, b.y - s.y) < 80) b.dead = true;
    }
  }
  STRIKES = STRIKES.filter(s => s.t < 0.6);
  if (P.reviveT > 0) { P.reviveT -= dt; ULTS.fenix.tick(dt); if (P.reviveT <= 0 && !(P.ultT > 0)) NOVA = null; }
  if (!(P.ultT > 0)) return;
  const U = ULTS[SHIP.id];
  if (!P.alive) { P.ultT = 0; if (U.end) U.end(); return; }
  P.ultT -= dt; U.tick(dt);
  if (P.ultT <= 0) { P.ultT = 0; if (U.end) U.end(); }
}
function drawUlt() {
  for (const s of STRIKES) if (!s.done) {
    const k = s.t / 0.35;
    ctx.strokeStyle = `rgba(255,60,60,${0.5 + k * 0.5})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s.x, s.y, 60 * (1 - k) + 12, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s.x - 16, s.y); ctx.lineTo(s.x + 16, s.y); ctx.moveTo(s.x, s.y - 16); ctx.lineTo(s.x, s.y + 16); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,200,120,${k * 0.5})`; ctx.fillRect(s.x - 3, 0, 6, s.y); ctx.globalCompositeOperation = 'source-over';
  }
  if (P && P.ultT > 0 && ULTS[SHIP.id].draw) ULTS[SHIP.id].draw();
  if (NOVA && !(P.ultT > 0 && SHIP.id === 'fenix')) ULTS.fenix.draw();
}
const ULT_BTN = () => [W - 64, H - 176];
function drawUltBtn() {
  const [x, y] = ULT_BTN(), full = P.ult >= 100, act = P.ultT > 0;
  ctx.fillStyle = full ? SHIP.col + '33' : 'rgba(8,12,28,0.6)'; ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 5; ctx.stroke();
  const k = act ? P.ultT / ULTS[SHIP.id].dur : P.ult / 100;
  ctx.strokeStyle = SHIP.col; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + TAU * k); ctx.stroke();
  if (full) {
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5 + Math.sin(G.t * 8) * 0.3;
    drawSpr(GLOW[SHIP.glow], x, y, 0, 3); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  txt('ULTRA', x, y - 3, 13, full ? '#ffffff' : '#8fa0b8', 'center', full ? SHIP.col : null, 900);
  txt(act ? 'ACTIVO' : Math.floor(P.ult) + '%', x, y + 13, 10, full || act ? SHIP.col : '#6f8098', 'center', null, 800);
}
try { selShip = clamp(parseInt(localStorage.getItem('ns_ship') || '0', 10) || 0, 0, SHIPS.length - 1); } catch (e) { }
