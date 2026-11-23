'use strict';
/* =====================================================================
   JEFES FINALES — 10 jefes, cada uno con virtud, debilidad y ataque especial
   ===================================================================== */

/* ---------------- Proyectiles enemigos de colores ---------------- */
function makeOrb(size, c1, c2) {
  return sprite(size, size, g => {
    const r = size / 2;
    g.fillStyle = radial(g, r, r, r, [[0, '#ffffff'], [0.3, c1], [0.45, '#ffffff'], [0.6, c2], [1, 'rgba(0,0,0,0)']]);
    g.fillRect(0, 0, size, size);
  });
}
SPR.eo_acid = makeOrb(28, '#6aff3a', 'rgba(60,200,30,0.7)');
SPR.eo_ice = makeOrb(32, '#9ae8ff', 'rgba(80,160,255,0.7)');
SPR.eo_elec = makeOrb(26, '#fff35a', 'rgba(255,220,0,0.7)');
SPR.eo_fire = makeOrb(26, '#ffb02a', 'rgba(255,80,0,0.7)');
SPR.eo_web = sprite(34, 34, g => {
  g.strokeStyle = 'rgba(240,240,255,0.95)'; g.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.moveTo(17, 17); g.lineTo(17 + Math.cos(a) * 16, 17 + Math.sin(a) * 16); g.stroke(); }
  for (const r of [6, 11, 15]) { g.beginPath(); for (let i = 0; i <= 8; i++) { const a = i / 8 * TAU; g.lineTo(17 + Math.cos(a) * r, 17 + Math.sin(a) * r); } g.stroke(); }
});

/* ---------------- Sprites de los jefes nuevos ---------------- */
function hexPath(g, x, y, r) { g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + Math.PI / 6; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); }
SPR.hive = sprite(300, 260, g => {
  const cx = 150, cy = 120;
  g.shadowColor = '#ffb800'; g.shadowBlur = 16;
  g.fillStyle = lg(g, 0, 0, 0, 240, ['#4a3a10', '#1a1406']); g.beginPath(); g.ellipse(cx, cy, 140, 100, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ffb800'; g.lineWidth = 2.5; g.stroke();
  const R = mulberry(77);
  for (let row = -3; row <= 3; row++) for (let col = -5; col <= 5; col++) {
    const x = cx + col * 28 + (row % 2 ? 14 : 0), y = cy + row * 24;
    if (((x - cx) / 128) ** 2 + ((y - cy) / 88) ** 2 > 1) continue;
    hexPath(g, x, y, 13); g.fillStyle = R() < 0.25 ? '#6a4a10' : '#3a2c0c'; g.fill();
    g.strokeStyle = 'rgba(255,184,0,0.45)'; g.lineWidth = 1.5; g.stroke();
    if (R() < 0.2) { g.fillStyle = 'rgba(255,200,60,0.65)'; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill(); }
  }
  g.fillStyle = '#120c02'; g.beginPath(); g.arc(cx, cy, 46, 0, TAU); g.fill();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#c0a060';
  for (const s of [-1, 1]) { poly(g, [cx + s * 40, cy + 80, cx + s * 58, cy + 132, cx + s * 18, cy + 96]); g.fill(); }
});
SPR.pod = sprite(76, 76, g => {
  g.fillStyle = radial(g, 38, 38, 36, [[0, '#eaffb0'], [0.35, '#7aff3a'], [0.75, '#1f6a10'], [1, 'rgba(10,40,5,0)']]);
  g.beginPath(); g.ellipse(38, 38, 30, 34, 0, 0, TAU); g.fill();
  g.strokeStyle = '#d4ff3a'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(20,60,10,0.7)'; g.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(38, 6); g.quadraticCurveTo(14 + i * 12, 38, 38, 70); g.stroke(); }
});
SPR.goliath = sprite(300, 210, g => {
  const cx = 150, cy = 100;
  g.fillStyle = '#20242e'; rr(g, cx - 60, cy - 95, 120, 50, 12); g.fill();
  g.fillStyle = 'rgba(255,90,31,0.8)'; for (let i = 0; i < 4; i++) g.fillRect(cx - 44 + i * 24, cy - 90, 14, 8);
  for (const s of [-1, 1]) {
    g.shadowColor = '#ff5a1f'; g.shadowBlur = 10;
    g.fillStyle = lg(g, cx + s * 140, 0, cx + s * 60, 0, ['#2a2f3c', '#6a7488']); rr(g, s > 0 ? cx + 50 : cx - 140, cy - 60, 90, 100, 22); g.fill(); g.shadowBlur = 0;
    g.strokeStyle = '#ff5a1f'; g.lineWidth = 2; rr(g, s > 0 ? cx + 50 : cx - 140, cy - 60, 90, 100, 22); g.stroke();
    g.save(); rr(g, s > 0 ? cx + 50 : cx - 140, cy - 60, 90, 100, 22); g.clip();
    for (let x = cx - 160; x < cx + 160; x += 18) { g.fillStyle = 'rgba(255,184,0,0.5)'; poly(g, [x, cy + 20, x + 9, cy + 20, x - 5, cy + 40, x - 14, cy + 40]); g.fill(); }
    g.restore();
  }
  g.fillStyle = lg(g, cx - 60, 0, cx + 60, 0, ['#3a4252', '#9aa4b8', '#3a4252']);
  poly(g, [cx - 60, cy - 50, cx + 60, cy - 50, cx + 70, cy + 40, cx + 30, cy + 80, cx - 30, cy + 80, cx - 70, cy + 40]); g.fill();
  g.strokeStyle = '#14171e'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#14171e'; rr(g, cx - 30, cy - 10, 60, 60, 10); g.fill();
  g.strokeStyle = 'rgba(255,90,31,0.6)'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#2a2f3c'; rr(g, cx - 22, cy + 60, 44, 40, 10); g.fill();
  g.fillStyle = radial(g, cx, cy + 82, 10, [[0, '#fff'], [0.4, '#ff3355'], [1, 'rgba(255,0,40,0)']]); g.beginPath(); g.arc(cx, cy + 82, 10, 0, TAU); g.fill();
});
SPR.gfist = sprite(96, 116, g => {
  g.fillStyle = lg(g, 30, 0, 66, 0, ['#3a4252', '#9aa4b8', '#3a4252']); rr(g, 30, 0, 36, 60, 8); g.fill();
  g.fillStyle = lg(g, 0, 50, 0, 116, ['#6a7488', '#2a2f3c']); rr(g, 8, 50, 80, 62, 16); g.fill();
  g.strokeStyle = '#ff5a1f'; g.lineWidth = 2.5; g.stroke();
  for (let i = 0; i < 4; i++) { g.fillStyle = '#ffb800'; g.fillRect(16 + i * 18, 100, 12, 8); }
});
SPR.spider = sprite(190, 240, g => {
  const cx = 95;
  g.shadowColor = '#ff3355'; g.shadowBlur = 14;
  g.fillStyle = lg(g, 0, 10, 0, 130, ['#3a0f18', '#140508']); g.beginPath(); g.ellipse(cx, 70, 60, 64, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ff3355'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(255,51,85,0.4)'; g.lineWidth = 1.5;
  for (let i = 1; i < 5; i++) { g.beginPath(); g.ellipse(cx, 70, 60 - i * 10, 64 - i * 11, 0, 0, TAU); g.stroke(); }
  g.fillStyle = lg(g, cx - 50, 0, cx + 50, 0, ['#2a2f3c', '#7a8498', '#2a2f3c']); g.beginPath(); g.ellipse(cx, 160, 52, 48, 0, 0, TAU); g.fill();
  g.strokeStyle = '#14171e'; g.lineWidth = 2; g.stroke();
  for (const [ex, ey, r] of [[-16, 186, 7], [16, 186, 7], [-30, 176, 5], [30, 176, 5], [-8, 198, 4], [8, 198, 4]]) {
    g.fillStyle = radial(g, cx + ex, ey, r * 1.6, [[0, '#fff'], [0.35, '#ff3355'], [1, 'rgba(255,0,40,0)']]); g.beginPath(); g.arc(cx + ex, ey, r * 1.6, 0, TAU); g.fill();
  }
  g.fillStyle = '#c0c8d8'; for (const s of [-1, 1]) { poly(g, [cx + s * 10, 200, cx + s * 22, 236, cx + s * 4, 210]); g.fill(); }
});
SPR.storm = sprite(300, 300, g => {
  const c = 150;
  g.shadowColor = '#fff35a'; g.shadowBlur = 16;
  g.fillStyle = lg(g, 30, 30, 270, 270, ['#4a5068', '#141824']); g.beginPath(); g.arc(c, c, 118, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#fff35a'; g.lineWidth = 2.5; g.stroke();
  for (const r of [96, 72]) { g.strokeStyle = 'rgba(255,243,90,0.35)'; g.lineWidth = 2; g.beginPath(); g.arc(c, c, r, 0, TAU); g.stroke(); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.fillStyle = 'rgba(255,243,90,0.6)'; g.fillRect(c + Math.cos(a) * 106 - 3, c + Math.sin(a) * 106 - 3, 6, 6); }
  for (const [x, y] of [[-92, -92], [92, -92], [-92, 92], [92, 92]]) {
    g.fillStyle = '#1a1d28'; g.beginPath(); g.arc(c + x, c + y, 26, 0, TAU); g.fill();
    g.strokeStyle = '#c87a3a'; g.lineWidth = 3; for (const r of [22, 16, 10]) { g.beginPath(); g.arc(c + x, c + y, r, 0, TAU); g.stroke(); }
  }
  g.fillStyle = '#0a0c14'; g.beginPath(); g.arc(c, c, 40, 0, TAU); g.fill();
  g.strokeStyle = '#fff35a'; g.lineWidth = 3; g.stroke();
});
SPR.hydra = sprite(280, 180, g => {
  const cx = 140;
  g.shadowColor = '#2bf0c0'; g.shadowBlur = 14;
  g.fillStyle = lg(g, 0, 0, 0, 180, ['#1a4a44', '#0a1c1a']); g.beginPath(); g.ellipse(cx, 80, 130, 70, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#2bf0c0'; g.lineWidth = 2.5; g.stroke();
  const R = mulberry(31);
  for (let i = 0; i < 60; i++) { const a = R() * TAU, d = R(); g.fillStyle = 'rgba(43,240,192,' + (0.15 + R() * 0.25) + ')'; hexPath(g, cx + Math.cos(a) * 115 * d, 80 + Math.sin(a) * 60 * d, 7); g.fill(); }
  g.fillStyle = '#c0c8d8'; for (let i = -4; i <= 4; i++) { poly(g, [cx + i * 24, 20 - Math.abs(i) * 2, cx + i * 24 + 7, 6, cx + i * 24 + 12, 22]); g.fill(); }
});
function hydraHead(col, glow) {
  return sprite(84, 96, g => {
    const cx = 42;
    g.shadowColor = glow; g.shadowBlur = 12;
    g.fillStyle = lg(g, 0, 0, 0, 96, [col, '#141820']); poly(g, [cx, 94, cx + 18, 70, cx + 34, 38, cx + 26, 10, cx, 2, cx - 26, 10, cx - 34, 38, cx - 18, 70]); g.fill(); g.shadowBlur = 0;
    g.strokeStyle = glow; g.lineWidth = 2; g.stroke();
    for (const s of [-1, 1]) {
      g.fillStyle = radial(g, cx + s * 14, 44, 9, [[0, '#fff'], [0.35, glow], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(cx + s * 14, 44, 9, 0, TAU); g.fill();
      g.fillStyle = '#c0c8d8'; poly(g, [cx + s * 24, 14, cx + s * 40, 0, cx + s * 30, 22]); g.fill();
    }
    g.fillStyle = radial(g, cx, 82, 12, [[0, '#fff'], [0.4, glow], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(cx, 82, 12, 0, TAU); g.fill();
  });
}
SPR.hh_fire = hydraHead('#6a2a1a', '#ff8a2b'); SPR.hh_ice = hydraHead('#1a3a6a', '#9ae8ff'); SPR.hh_poison = hydraHead('#2a5a1a', '#6aff3a');
SPR.phantom = sprite(250, 150, g => {
  const cx = 125;
  const wing = [cx, 146, cx + 40, 96, cx + 122, 40, cx + 110, 18, cx + 40, 30, cx, 4, cx - 40, 30, cx - 110, 18, cx - 122, 40, cx - 40, 96];
  g.shadowColor = '#00e5ff'; g.shadowBlur = 16; g.fillStyle = lg(g, 0, 0, 0, 150, ['#1a1f2e', '#05060a']); poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#00e5ff'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(0,229,255,0.45)'; g.lineWidth = 1;
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx, 40); g.lineTo(cx + s * 110, 30); g.moveTo(cx, 70); g.lineTo(cx + s * 70, 60); g.stroke(); }
  g.fillStyle = radial(g, cx, 74, 22, [[0, '#ffffff'], [0.3, '#00e5ff'], [1, 'rgba(0,120,255,0)']]); g.beginPath(); g.arc(cx, 74, 22, 0, TAU); g.fill();
  g.fillStyle = '#c0c8d8'; for (const s of [-1, 1]) { poly(g, [cx + s * 16, 110, cx + s * 4, 146, cx + s * 2, 112]); g.fill(); }
});
SPR.omega = sprite(190, 190, g => {
  const c = 95;
  g.fillStyle = radial(g, c, c, 92, [[0, '#ffffff'], [0.25, '#ffd0e0'], [0.5, '#ff2b6a'], [0.78, '#3a0a1a'], [1, 'rgba(20,0,10,0)']]);
  g.beginPath(); g.arc(c, c, 92, 0, TAU); g.fill();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 3; g.beginPath(); g.arc(c, c, 70, 0, TAU); g.stroke();
  g.setLineDash([8, 8]); g.strokeStyle = 'rgba(255,210,63,0.7)'; g.lineWidth = 2; g.beginPath(); g.arc(c, c, 82, 0, TAU); g.stroke(); g.setLineDash([]);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.fillStyle = '#ffd23f'; g.fillRect(c + Math.cos(a) * 70 - 4, c + Math.sin(a) * 70 - 4, 8, 8); }
});
SPR.oplate = sprite(96, 40, g => {
  g.shadowColor = '#ffd23f'; g.shadowBlur = 10;
  g.fillStyle = lg(g, 0, 0, 0, 40, ['#6a7488', '#20242e']);
  g.beginPath(); g.moveTo(4, 30); g.quadraticCurveTo(48, 0, 92, 30); g.lineTo(84, 38); g.quadraticCurveTo(48, 14, 12, 38); g.closePath(); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ffd23f'; g.lineWidth = 2; g.stroke();
});
for (const k of ['hive', 'storm', 'hydra', 'phantom', 'omega', 'goliath', 'spider', 'pod', 'hh_fire', 'hh_ice', 'hh_poison', 'gfist']) {
  SHD[k] = tint(SPR[k], 'rgba(0,0,0,0.45)'); FL[k] = tint(SPR[k], 'rgba(255,255,255,0.85)');
}

/* ---------------- Utilidades ---------------- */
const shotRing = (x, y, n, spd, k, off = Math.random() * TAU, big = false) => { for (let i = 0; i < n; i++) eShot(x, y, off + i / n * TAU, spd, big, k); };
const shotFan = (x, y, a, n, step, spd, k, big = false) => { for (let i = 0; i < n; i++) eShot(x, y, a + (i - (n - 1) / 2) * step, spd, big, k); };
const nShots = n => Math.max(3, Math.round(n * (D.id === 'easy' ? 0.75 : D.id === 'hard' ? 1.15 : 1)));
function enterTo(b, y, sp, dt) { b.y += sp * dt; if (b.y >= y) { b.y = y; b.enter = false; b.t = 0; return true; } return false; }
function flashFx(b, alpha = 0.22) { if (b.hit > 0) { ctx.globalAlpha = alpha; drawSpr(FL[b.spr || 'boss'], b.x, b.y); ctx.globalAlpha = 1; } }
function jagged(x0, y0, x1, y1, seg, amp) {
  ctx.beginPath(); ctx.moveTo(x0, y0);
  for (let i = 1; i < seg; i++) { const k = i / seg; ctx.lineTo(x0 + (x1 - x0) * k + rand(-amp, amp), y0 + (y1 - y0) * k + rand(-amp, amp)); }
  ctx.lineTo(x1, y1); ctx.stroke();
}
function bossNote(b, s, col) { FT.push({ x: W / 2, y: H * 0.55, t: 0, s, big: true, col }); }

/* ---------------- Definición de los 10 jefes ---------------- */
const BOSS_DEFS = [
  { kind: 'mothership', name: 'NAVE NODRIZA', hp: 650, size: [400, 200],
    virt: 'Torretas que cubren 360° y llama drones de refuerzo', weak: 'Núcleo central: recibe daño ×2', spec: 'Andanada en espiral',
    init(b) { b.y = -170; },
    update: (b, dt) => updateMothership(b, dt),
    boxes: b => BH.map(([ox, oy, r], i) => [b.x + ox, b.y + oy, r, i === 0 ? 2 : 1]),
    weakPts: b => [[b.x, b.y, 40]],
    shadow: b => drawSpr(SHD.boss, b.x + 30, b.y + 50, 0, 0.85) },
  { kind: 'colossus', name: 'COLOSO BLINDADO', hp: 900, size: [380, 240], ground: true,
    virt: 'Blindaje pesado: orugas y torretas reciben la mitad de daño', weak: 'Reactor central: daño ×2', spec: 'Láseres barredores',
    init(b) { b.y = -200; },
    update: (b, dt) => updateColossus(b, dt),
    boxes: b => CH_BOX.map(([ox, oy, r], i) => [b.x + ox, b.y + oy, i === 0 ? 55 : r, i === 0 ? 2 : 0.5]),
    weakPts: b => [[b.x, b.y + 10, 46]], shadow() { } },
  { kind: 'vroar', name: 'VROAR', hp: 800, size: [200, 200],
    virt: 'Cuerpo de 14 segmentos acorazados (solo 35 % de daño)', weak: 'Cabeza: daño ×1,5', spec: 'Rugido y aliento de fuego',
    init(b) {
      b.head = { x: W / 2, y: -80, rot: 0 }; b.pt = 0; b.bt = 0; b.breath = 0;
      b.hist = []; for (let k = 0; k <= VSEG * VGAP + 2; k++) b.hist.push({ x: W / 2, y: -80 - k * 4 });
      b.segs = []; for (let i = 0; i < VSEG; i++) b.segs.push({ x: W / 2, y: -120 - i * 36, rot: 0 });
    },
    update: (b, dt) => updateVroar(b, dt),
    boxes: b => [[b.head.x, b.head.y, 44, 1.5]].concat(b.segs.map(s => [s.x, s.y, 24, 0.35])),
    center: b => [b.head.x, b.head.y], weakPts: b => [[b.head.x, b.head.y, 34]],
    shadow(b) { for (const s of b.segs) drawSpr(SHD.vseg, s.x + 24, s.y + 40, s.rot, 0.8); drawSpr(SHD.vhead, b.head.x + 24, b.head.y + 40, b.head.rot, 0.8); } },

  /* 4 ─ COLMENA */
  { kind: 'hive', name: 'COLMENA', hp: 700, size: [280, 200],
    virt: 'Núcleo blindado mientras vivan sus 3 incubadoras; genera enjambres', weak: 'Destruye las incubadoras: el núcleo queda expuesto (×1,6)', spec: 'Enjambre furioso',
    init(b) {
      b.y = -150; b.spr = 'hive';
      const php = Math.round(b.maxhp * 0.14);
      b.pods = [[-112, 34], [0, 92], [112, 34]].map(([ox, oy]) => ({ ox, oy, hp: php, max: php, hit: 0, dead: false, x: 0, y: 0 }));
    },
    update(b, dt) {
      for (const p of b.pods) { p.x = b.x + p.ox; p.y = b.y + p.oy + Math.sin(b.t * 2 + p.ox) * 4; p.hit = Math.max(0, p.hit - dt); }
      if (b.enter) { enterTo(b, 180, 80, dt); return; }
      b.x = W / 2 + Math.sin(b.t * 0.4) * 60; b.y = 180 + Math.sin(b.t * 0.9) * 12;
      if (!P.alive) return;
      const alive = b.pods.filter(p => !p.dead);
      b.a1 -= dt; b.a2 -= dt; b.a3 -= dt;
      if (b.a1 <= 0) { b.a1 = cd(b.rage ? 1.0 : 1.4); shotFan(b.x, b.y + 30, aim(b.x, b.y + 30), nShots(5), 0.2, bspd(), 'acid', true); }
      if (b.a2 <= 0 && EN.length < 10) {
        b.a2 = cd(alive.length ? 2.4 : 3.5);
        for (const p of (alive.length ? alive : [{ x: b.x, y: b.y }])) addEnemy(Math.random() < 0.5 ? 'kamikaze' : 'drone', p.x, p.y + 20, { mode: 'sine', bx: p.x, amp: 30, ph: Math.random() * 6 });
      }
      if (b.a3 <= 0) {
        b.a3 = cd(10); bossNote(b, '¡ENJAMBRE!', '#ffd23f'); SFX.roar();
        for (let i = 0; i < (b.rage ? 8 : 6); i++) addEnemy('kamikaze', b.x + Math.cos(i / 6 * TAU) * 60, b.y + Math.sin(i / 6 * TAU) * 40, { delay: i * 0.08 });
        shotRing(b.x, b.y, nShots(16), 140 * D.bullet, 'acid');
      }
    },
    boxes(b) {
      const alive = b.pods.some(p => !p.dead), out = [[b.x, b.y, 70, alive ? 0.15 : 1.6]];
      for (const p of b.pods) if (!p.dead) out.push([p.x, p.y, 32, 1, p]);
      return out;
    },
    partDead(b, p) {
      explode(p.x, p.y, 2); addScore(1500, p.x, p.y);
      if (b.pods.every(q => q.dead)) { bossNote(b, '¡NÚCLEO EXPUESTO!', '#d4ff3a'); shake = 16; }
    },
    weakPts: b => (b.pods.every(p => p.dead) ? [[b.x, b.y, 44]] : b.pods.filter(p => !p.dead).map(p => [p.x, p.y, 28])),
    shadow: b => drawSpr(SHD.hive, b.x + 30, b.y + 50, 0, 0.85),
    draw(b) {
      drawSpr(SPR.hive, b.x, b.y);
      const open = b.pods.every(p => p.dead);
      ctx.globalCompositeOperation = 'lighter';
      drawSpr(open ? GLOW.lime : GLOW.amber, b.x, b.y, 0, (open ? 3 : 1.8) + Math.sin(G.t * 6) * 0.3);
      ctx.globalCompositeOperation = 'source-over';
      if (!open) { ctx.strokeStyle = `rgba(255,210,63,${0.5 + Math.sin(G.t * 8) * 0.2})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(b.x, b.y, 50, 0, TAU); ctx.stroke(); }
      for (const p of b.pods) {
        if (p.dead) { ctx.fillStyle = '#1a1406'; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, TAU); ctx.fill(); continue; }
        drawSpr(SPR.pod, p.x, p.y, 0, 1 + Math.sin(G.t * 5 + p.ox) * 0.05);
        if (p.hit > 0) { ctx.globalAlpha = 0.6; drawSpr(FL.pod, p.x, p.y); ctx.globalAlpha = 1; }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(p.x - 24, p.y - 44, 48, 5); ctx.fillStyle = '#d4ff3a'; ctx.fillRect(p.x - 24, p.y - 44, 48 * p.hp / p.max, 5);
      }
      flashFx(b);
    } },

  /* 5 ─ GOLIAT */
  { kind: 'goliath', name: 'GOLIAT', hp: 950, size: [300, 200], ground: true,
    virt: 'Torso blindado (55 % de daño) y puños que bloquean disparos', weak: 'Al cargar un puñetazo abre el pecho: núcleo ×3', spec: 'Puñetazo sísmico',
    init(b) {
      b.y = -230; b.spr = 'goliath'; b.pt = 2.5; b.side = 1; b.chest = 0;
      b.arms = [-1, 1].map(s => ({ s, x: W / 2 + s * 150, y: 40, st: 'rest', t: 0, tx: 0, ty: 0, sc: 1 }));
    },
    update(b, dt) {
      if (b.enter) { enterTo(b, 190, 75, dt); for (const a of b.arms) { a.x = b.x + a.s * 150; a.y = b.y + 50; } return; }
      b.x = W / 2 + Math.sin(b.t * 0.35) * 55; b.y = 190 + Math.abs(Math.sin(b.t * 1.4)) * 6;
      b.chest = Math.max(0, b.chest - dt);
      for (const a of b.arms) {
        const rx = b.x + a.s * 150, ry = b.y + 50;
        a.t += dt;
        if (a.st === 'rest') { a.x += (rx - a.x) * Math.min(1, dt * 6); a.y += (ry - a.y) * Math.min(1, dt * 6); a.sc = 1; }
        else if (a.st === 'wind') { a.sc = 1 + Math.min(1, a.t) * 0.3; a.x += (a.tx - a.x) * Math.min(1, dt * 1.5); a.y += (a.ty - 120 - a.y) * Math.min(1, dt * 1.5); if (a.t > 1.05) { a.st = 'slam'; a.t = 0; } }
        else if (a.st === 'slam') {
          a.x += (a.tx - a.x) * Math.min(1, dt * 20); a.y += (a.ty - a.y) * Math.min(1, dt * 20); a.sc = 1.3 - a.t * 2;
          if (a.t > 0.14) {
            a.st = 'back'; a.t = 0; a.sc = 1;
            explode(a.tx, a.ty, 2.2); shake = 22; vib(120); marks.push({ x: a.tx, y: a.ty, s: 1.4 }); SFX.cannon(a.tx);
            RINGS.push({ x: a.tx, y: a.ty, t: 0, dur: 0.5, r: 160, c: 'rgba(255,184,0,' });
            shotRing(a.tx, a.ty, nShots(b.rage ? 20 : 14), 150 * D.bullet, null, Math.random(), true);
            if (P.alive && Math.hypot(P.x - a.tx, P.y - a.ty) < 85) hurtPlayer();
          }
        } else if (a.st === 'back' && a.t > 0.7) { a.st = 'rest'; a.t = 0; }
      }
      if (!P.alive) return;
      b.pt -= dt; b.a1 -= dt;
      if (b.pt <= 0 && b.arms.every(a => a.st === 'rest')) {
        b.pt = b.rage ? 2.8 : 4;
        const list = b.rage ? b.arms : [b.arms[b.side > 0 ? 1 : 0]]; b.side *= -1;
        list.forEach((a, i) => { a.st = 'wind'; a.t = -i * 0.6; a.tx = clamp(P.x + (i ? rand(-90, 90) : 0), 60, W - 60); a.ty = clamp(P.y, 320, H - 110); });
        b.chest = b.rage ? 2.6 : 1.9; SFX.charge();
      }
      if (b.a1 <= 0) { b.a1 = cd(2.1); for (const s of [-1, 1]) shotFan(b.x + s * 95, b.y - 30, aim(b.x + s * 95, b.y - 30), 3, 0.18, bspd(), 'fire', true); }
    },
    boxes(b) {
      const out = [];
      if (b.chest > 0) out.push([b.x, b.y + 20, 40, 3]);
      out.push([b.x, b.y, 80, 0.55]);
      for (const a of b.arms) out.push([a.x, a.y + 20, 44, 0]);
      return out;
    },
    weakPts: b => (b.chest > 0 ? [[b.x, b.y + 20, 32]] : []),
    shadow() { },
    draw(b) {
      for (const a of b.arms) {
        if (a.st === 'wind' && a.t > 0) {
          const k = Math.min(1, a.t);
          ctx.strokeStyle = `rgba(255,60,60,${0.4 + k * 0.6})`; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(a.tx, a.ty, 85 * (1.4 - k * 0.4), 0, TAU); ctx.stroke();
          ctx.fillStyle = `rgba(255,60,60,${0.1 + k * 0.15})`; ctx.fill();
        }
      }
      for (const a of b.arms) {
        ctx.strokeStyle = '#3a4252'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(b.x + a.s * 95, b.y); ctx.lineTo(a.x, a.y - 20); ctx.stroke();
        ctx.strokeStyle = '#ff5a1f'; ctx.lineWidth = 2; ctx.stroke();
      }
      drawSpr(SPR.goliath, b.x, b.y);
      if (b.chest > 0) {
        ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW.red, b.x, b.y + 20, 0, 2.6 + Math.sin(G.t * 20) * 0.4); ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#3a4252'; ctx.fillRect(b.x - 62, b.y - 10, 30, 60); ctx.fillRect(b.x + 32, b.y - 10, 30, 60);
      }
      flashFx(b, 0.18);
      for (const a of b.arms) {
        if (a.sc > 1.05) drawSpr(SHD.gfist, a.x + 30 * a.sc, a.y + 60 * a.sc, 0, 0.9);
        drawSpr(SPR.gfist, a.x, a.y, 0, a.sc);
      }
    } },

  /* 6 ─ ARÁCNIDO */
  { kind: 'spider', name: 'ARÁCNIDO', hp: 850, size: [240, 240], ground: true,
    virt: 'Muy rápido: te persigue de lado a lado y salta', weak: 'Abdomen trasero: daño ×2 (atácalo por los lados)', spec: 'Telaraña: te deja lento',
    init(b) { b.y = -220; b.spr = 'spider'; b.jump = 0; b.jt = 7; b.mt = 4; b.jx = W / 2; },
    update(b, dt) {
      if (b.enter) { enterTo(b, 200, 110, dt); return; }
      if (b.jump > 0) {
        b.jump -= dt; const k = 1 - b.jump / 0.9;
        b.x += (b.jx - b.x) * Math.min(1, dt * 6); b.sc = 1 + Math.sin(k * Math.PI) * 0.25;
        if (b.jump <= 0) { b.sc = 1; shake = 18; explode(b.x, b.y + 40, 1.5); shotRing(b.x, b.y, nShots(b.rage ? 22 : 16), 150 * D.bullet, 'acid'); SFX.cannon(b.x); }
        return;
      }
      b.sc = 1;
      if (P.alive) { const sp = 150 * (b.rage ? 1.45 : 1); b.x += clamp(P.x - b.x, -sp * dt, sp * dt); }
      b.x = clamp(b.x, 110, W - 110); b.y = 200 + Math.sin(b.t * 1.2) * 14;
      if (!P.alive) return;
      b.a1 -= dt; b.a2 -= dt; b.jt -= dt; b.mt -= dt;
      if (b.a1 <= 0) { b.a1 = cd(b.rage ? 2.2 : 3); shotFan(b.x, b.y + 90, aim(b.x, b.y + 90), 3, 0.3, 170 * D.bullet, 'web'); }
      if (b.a2 <= 0) { b.a2 = cd(1.5); shotFan(b.x, b.y + 90, aim(b.x, b.y + 90), nShots(5), 0.16, bspd(), 'acid'); }
      if (b.mt <= 0) { b.mt = 5; addEnemy('mine', b.x, b.y + 60); }
      if (b.jt <= 0) { b.jt = b.rage ? 6 : 9; b.jump = 0.9; b.jx = clamp(P.x, 110, W - 110); bossNote(b, '¡SALTO!', '#ff3355'); }
    },
    boxes: b => (b.jump > 0 ? [] : [[b.x, b.y + 34, 50, 1], [b.x, b.y - 52, 44, 2]]),
    weakPts: b => [[b.x, b.y - 52, 34]],
    shadow(b) { if (b.jump > 0) drawSpr(SHD.spider, b.x + 40, b.y + 60, 0, 0.9); },
    draw(b) {
      const sc = b.sc || 1;
      ctx.lineCap = 'round';
      for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
        const ax = b.x + s * 34 * sc, ay = b.y - 40 * sc + i * 28 * sc;
        const fx = b.x + s * (130 + Math.sin(i) * 10) * sc, fy = ay - 40 * sc + i * 12 * sc + Math.sin(b.t * 9 + i * 1.7 + s) * 14;
        const kx = (ax + fx) / 2 + s * 18 * sc, ky = (ay + fy) / 2 - 34 * sc;
        ctx.strokeStyle = '#2a2f3c'; ctx.lineWidth = 9 * sc; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
        ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.lineCap = 'butt';
      drawSpr(SPR.spider, b.x, b.y, 0, sc);
      ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW.red, b.x, b.y - 52 * sc, 0, 2 + Math.sin(G.t * 5) * 0.4); ctx.globalCompositeOperation = 'source-over';
      if (b.hit > 0) { ctx.globalAlpha = 0.2; drawSpr(FL.spider, b.x, b.y, 0, sc); ctx.globalAlpha = 1; }
    } },

  /* 7 ─ TORMENTA */
  { kind: 'storm', name: 'TORMENTA', hp: 800, size: [260, 260],
    virt: 'Escudo eléctrico que lo hace invulnerable a ratos', weak: 'Tras sus rayos se sobrecarga: daño ×2', spec: 'Rayos en columna',
    init(b) { b.y = -170; b.spr = 'storm'; b.mode = 'shield'; b.mt = 3.5; b.bolts = []; },
    update(b, dt) {
      for (const z of b.bolts) z.t += dt;
      b.bolts = b.bolts.filter(z => z.t < z.warn + z.on);
      for (const z of b.bolts) if (z.t > z.warn && z.t < z.warn + z.on && P.alive && Math.abs(P.x - z.x) < 26 && !z.hitP) { z.hitP = true; hurtPlayer(); }
      if (b.enter) { enterTo(b, 200, 80, dt); return; }
      b.x = W / 2 + Math.sin(b.t * 0.5) * 80; b.y = 200 + Math.sin(b.t * 1.1) * 14;
      if (!P.alive) return;
      b.mt -= dt; b.a1 -= dt;
      if (b.mode === 'shield') {
        if (b.a1 <= 0) { b.a1 = cd(1.1); shotRing(b.x, b.y, nShots(12), 140 * D.bullet, 'elec'); }
        if (b.mt <= 0) { b.mode = 'bolt'; b.mt = 2.4; b.vol = 0; }
      } else if (b.mode === 'bolt') {
        if (b.vol < 2 && b.mt < 2.4 - b.vol * 1.1) {
          b.vol++; SFX.charge();
          const xs = [P.x]; const n = (b.rage ? 4 : 3) + (D.id === 'hard' ? 1 : 0);
          while (xs.length < n) xs.push(rand(40, W - 40));
          for (const x of xs) b.bolts.push({ x: clamp(x, 30, W - 30), t: 0, warn: 0.85, on: 0.35 });
        }
        if (b.mt <= 0) { b.mode = 'over'; b.mt = 2.6; bossNote(b, '¡SOBRECARGA!', '#fff35a'); }
      } else if (b.mt <= 0) { b.mode = 'shield'; b.mt = b.rage ? 2.6 : 3.5; }
      if (b.mode === 'bolt') { for (const z of b.bolts) if (Math.abs(z.t - z.warn) < dt) { SFX.boom(0.8, z.x); shake = 8; } }
    },
    boxes: b => [[b.x, b.y, 120, b.mode === 'shield' || b.enter ? 0 : b.mode === 'over' ? 2 : 1]],
    weakPts: b => (b.mode === 'over' ? [[b.x, b.y, 50]] : []),
    shadow: b => drawSpr(SHD.storm, b.x + 30, b.y + 50, 0, 0.85),
    draw(b) {
      for (const z of b.bolts) {
        if (z.t < z.warn) { ctx.strokeStyle = `rgba(255,243,90,${0.3 + 0.3 * Math.sin(z.t * 40)})`; ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(z.x, 0); ctx.lineTo(z.x, H); ctx.stroke(); ctx.setLineDash([]); }
      }
      drawSpr(SPR.storm, b.x, b.y, b.t * 0.3);
      ctx.globalCompositeOperation = 'lighter';
      const coils = [[-92, -92], [92, -92], [92, 92], [-92, 92]].map(([x, y]) => { const a = b.t * 0.3, c = Math.cos(a), s = Math.sin(a); return [b.x + x * c - y * s, b.y + x * s + y * c]; });
      ctx.strokeStyle = 'rgba(255,250,180,0.8)'; ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) if (Math.random() < 0.6) { const [x0, y0] = coils[i], [x1, y1] = coils[(i + 1) % 4]; jagged(x0, y0, x1, y1, 8, 10); }
      for (const [x, y] of coils) drawSpr(GLOW.yellow, x, y, 0, 1 + Math.random() * 0.5);
      drawSpr(b.mode === 'over' ? GLOW.red : GLOW.yellow, b.x, b.y, 0, 2.2 + Math.sin(G.t * 9) * 0.3);
      for (const z of b.bolts) if (z.t >= z.warn) {
        ctx.strokeStyle = 'rgba(255,250,160,0.5)'; ctx.lineWidth = 16; jagged(z.x, 0, z.x, H, 18, 14);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; jagged(z.x, 0, z.x, H, 18, 10);
      }
      if (b.mode === 'shield' && !b.enter) {
        ctx.strokeStyle = `rgba(160,220,255,${0.45 + Math.random() * 0.3})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(b.x, b.y, 140, 0, TAU); ctx.stroke();
        ctx.fillStyle = 'rgba(120,190,255,0.08)'; ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (b.mode === 'over' && Math.random() < 0.5) burst(b.x + rand(-100, 100), b.y + rand(-100, 100), 2, 'yellow', 150, 0.3, 0.6);
      flashFx(b);
    } },

  /* 8 ─ HIDRA */
  { kind: 'hydra', name: 'HIDRA', hp: 1050, size: [300, 260],
    virt: 'Tres cabezas que se regeneran a los 14 s si no las matas todas', weak: 'Cada cabeza cortada hace que las demás reciban +50 % de daño', spec: 'Triple aliento: fuego, hielo y veneno',
    init(b) {
      b.y = -200; b.spr = 'hydra'; b.st = 10; b.breath = 0;
      const hh = Math.round(b.maxhp / 3);
      b.heads = ['fire', 'ice', 'poison'].map((type, i) => ({ type, i, hp: hh, max: hh, dead: false, regen: 0, hit: 0, x: W / 2, y: -100, cd: 1 + i * 0.5 }));
    },
    update(b, dt) {
      const base = [[-115, 100], [0, 128], [115, 100]];
      for (const h of b.heads) {
        h.x = b.x + base[h.i][0] + Math.sin(b.t * 1.5 + h.i) * 16; h.y = b.y + base[h.i][1] + Math.cos(b.t * 1.2 + h.i * 2) * 12; h.hit = Math.max(0, h.hit - dt);
        if (h.dead && b.heads.some(o => !o.dead)) { h.regen -= dt; if (h.regen <= 0) { h.dead = false; h.hp = Math.round(h.max * 0.4); burst(h.x, h.y, 20, 'green', 200, 0.6, 1); FT.push({ x: h.x, y: h.y - 40, t: 0, s: '¡REGENERA!', col: '#6aff3a' }); } }
      }
      b.hp = b.heads.reduce((s, h) => s + (h.dead ? 0 : Math.max(0, h.hp)), 0);
      if (b.enter) { enterTo(b, 150, 80, dt); return; }
      b.x = W / 2 + Math.sin(b.t * 0.45) * 50; b.y = 150 + Math.sin(b.t * 0.8) * 10;
      if (!P.alive) return;
      b.st -= dt;
      if (b.st <= 0) { b.st = b.rage ? 8 : 11; b.breath = 1.3; b.bt2 = 0; bossNote(b, '¡TRIPLE ALIENTO!', '#2bf0c0'); SFX.roar(); }
      for (const h of b.heads) {
        if (h.dead) continue;
        const mx = h.x, my = h.y + 40, a = aim(mx, my);
        if (b.breath > 0) { continue; }
        h.cd -= dt;
        if (h.cd > 0) continue;
        if (h.type === 'fire') { h.cd = cd(1.5); shotFan(mx, my, a, nShots(5), 0.15, bspd() + 20, 'fire'); }
        else if (h.type === 'ice') { h.cd = cd(2.2); shotFan(mx, my, a, 3, 0.3, 120 * D.bullet, 'ice', true); }
        else { h.cd = cd(1.8); shotFan(mx, my, Math.PI / 2, nShots(7), 0.18, 150 * D.bullet, 'acid'); }
      }
      if (b.breath > 0) {
        b.breath -= dt; b.bt2 -= dt;
        if (b.bt2 <= 0) { b.bt2 = cd(0.08); for (const h of b.heads) if (!h.dead) { const mx = h.x, my = h.y + 40; eShot(mx, my, aim(mx, my) + Math.sin(b.t * 7 + h.i) * 0.35, bspd(), false, { fire: 'fire', ice: 'ice', poison: 'acid' }[h.type]); } }
      }
    },
    boxes(b) {
      const dead = b.heads.filter(h => h.dead).length, out = [];
      for (const h of b.heads) if (!h.dead) out.push([h.x, h.y, 38, 1 + 0.5 * dead, h]);
      out.push([b.x, b.y, 90, 0]);
      return out;
    },
    damage(b, d) { const al = b.heads.filter(h => !h.dead); for (const h of al) { h.hp -= d / al.length; h.hit = 0.06; if (h.hp <= 0) this.partDead(b, h); } },
    partHit(b, h) { },
    partDead(b, h) {
      if (h.dead) return;
      h.dead = true; h.hp = 0; h.regen = 14; explode(h.x, h.y, 2);
      b.hp = b.heads.reduce((s, q) => s + (q.dead ? 0 : Math.max(0, q.hp)), 0);
      if (b.heads.some(q => !q.dead)) FT.push({ x: h.x, y: h.y - 40, t: 0, s: 'CABEZA CORTADA', col: '#2bf0c0' });
      else b.hp = 0;
    },
    center: b => [b.x, b.y + 60],
    weakPts: b => b.heads.filter(h => !h.dead).map(h => [h.x, h.y, 28]),
    shadow(b) { drawSpr(SHD.hydra, b.x + 30, b.y + 50, 0, 0.85); for (const h of b.heads) if (!h.dead) drawSpr(SHD['hh_' + h.type], h.x + 26, h.y + 44, 0, 0.8); },
    draw(b) {
      const cols = { fire: '#ff8a2b', ice: '#9ae8ff', poison: '#6aff3a' };
      for (const h of b.heads) {
        const nx = b.x + (h.i - 1) * 60, ny = b.y + 30;
        ctx.strokeStyle = '#1a4a44'; ctx.lineWidth = h.dead ? 14 : 22; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(nx, ny);
        const ex = h.dead ? nx + (h.x - nx) * 0.35 : h.x, ey = h.dead ? ny + (h.y - ny) * 0.35 : h.y - 20;
        ctx.quadraticCurveTo(nx + (h.i - 1) * 30, ny + 60, ex, ey); ctx.stroke();
        ctx.strokeStyle = cols[h.type]; ctx.lineWidth = 2; ctx.stroke(); ctx.lineCap = 'butt';
        if (h.dead) { ctx.fillStyle = '#300'; ctx.beginPath(); ctx.arc(ex, ey, 9, 0, TAU); ctx.fill(); if (Math.random() < 0.3) PA.push({ x: ex, y: ey, vx: rand(-10, 10), vy: -30, life: 0.8, max: 0.8, s: 0.8, smoke: true }); }
      }
      drawSpr(SPR.hydra, b.x, b.y);
      for (const h of b.heads) {
        if (h.dead) continue;
        drawSpr(SPR['hh_' + h.type], h.x, h.y);
        if (h.hit > 0) { ctx.globalAlpha = 0.6; drawSpr(FL['hh_' + h.type], h.x, h.y); ctx.globalAlpha = 1; }
        if (b.breath > 0) { ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW[{ fire: 'orange', ice: 'cyan', poison: 'lime' }[h.type]], h.x, h.y + 40, 0, 2 + Math.random()); ctx.globalCompositeOperation = 'source-over'; }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(h.x - 26, h.y - 58, 52, 5); ctx.fillStyle = cols[h.type]; ctx.fillRect(h.x - 26, h.y - 58, 52 * Math.max(0, h.hp) / h.max, 5);
      }
    } },

  /* 9 ─ FANTASMA */
  { kind: 'phantom', name: 'FANTASMA', hp: 750, size: [240, 150],
    virt: 'Se vuelve invisible, se teletransporta y crea señuelos', weak: 'Visible es frágil (daño ×1,5) y los señuelos caen rápido', spec: 'Guadaña fantasma',
    init(b) { b.y = -160; b.spr = 'phantom'; b.mode = 'show'; b.mt = 4.5; b.alpha = 1; b.decoys = []; b.sweep = 0; },
    update(b, dt) {
      for (const d of b.decoys) { d.hit = Math.max(0, d.hit - dt); d.x += Math.sin(b.t + d.ph) * 20 * dt; }
      if (b.enter) { enterTo(b, 200, 90, dt); return; }
      b.mt -= dt;
      if (b.mode === 'show') {
        b.alpha = Math.min(1, b.alpha + dt * 3); b.cloak = false;
        b.x += Math.sin(b.t * 0.9) * 30 * dt;
        if (P.alive) {
          b.a1 -= dt; b.a2 -= dt;
          if (b.a1 <= 0) { b.a1 = cd(1.2); shotFan(b.x, b.y + 50, aim(b.x, b.y + 50), 3, 0.14, bspd() + 30); }
          if (b.a2 <= 0) { b.a2 = cd(3); b.sweep = 1.1; b.sa = 0.3; }
          if (b.sweep > 0) { b.sweep -= dt; b.sa += dt * 2.3; if (Math.floor(b.sweep / 0.04) !== Math.floor((b.sweep + dt) / 0.04)) eShot(b.x, b.y + 40, b.sa, 170 * D.bullet, true); }
          for (const d of b.decoys) { d.ft -= dt; if (d.ft <= 0 && !d.dead) { d.ft = cd(1.7); eShot(d.x, d.y + 40, aim(d.x, d.y + 40), bspd()); } }
        }
        if (b.mt <= 0) { b.mode = 'cloak'; b.mt = 2.2; SFX.charge(); }
      } else {
        b.alpha = Math.max(0.06, b.alpha - dt * 2.5); b.cloak = true;
        for (const d of b.decoys) d.fade = true;
        if (b.mt <= 0) {
          b.mode = 'show'; b.mt = 4.5; b.cloak = false;
          const slots = [[rand(100, W / 3), rand(140, 300)], [rand(W / 3 + 20, W * 2 / 3 - 20), rand(140, 300)], [rand(W * 2 / 3, W - 100), rand(140, 300)]];
          const real = Math.floor(Math.random() * 3); [b.x, b.y] = slots[real];
          const dhp = Math.round(12 * (1 + 0.3 * (level - 1)) * D.hp);
          b.decoys = slots.filter((_, i) => i !== real).map(([x, y]) => ({ x, y, hp: dhp, max: dhp, hit: 0, dead: false, ft: rand(0.5, 1.5), ph: rand(0, 6) }));
          shotRing(b.x, b.y, nShots(b.rage ? 24 : 18), 160 * D.bullet, null, Math.random(), true);
          for (const d of b.decoys) shotRing(d.x, d.y, 6, 140 * D.bullet);
          SFX.roar(); flash = 0.3;
        }
      }
    },
    boxes(b) {
      if (b.cloak) return [];
      const out = [[b.x, b.y, 64, 1.5]];
      for (const d of b.decoys) if (!d.dead) out.push([d.x, d.y, 56, 1, d]);
      return out;
    },
    partDead(b, d) { explode(d.x, d.y, 1.4); FT.push({ x: d.x, y: d.y - 30, t: 0, s: 'SEÑUELO', col: '#00e5ff' }); },
    weakPts: b => (b.cloak ? [] : [[b.x, b.y, 40]]),
    shadow(b) { if (!b.cloak) drawSpr(SHD.phantom, b.x + 30, b.y + 50, 0, 0.85); },
    draw(b) {
      for (const d of b.decoys) {
        if (d.dead) continue;
        ctx.globalAlpha = b.cloak ? b.alpha : 0.92; drawSpr(SPR.phantom, d.x, d.y);
        if (d.hit > 0) { ctx.globalAlpha = 0.5; drawSpr(FL.phantom, d.x, d.y); }
        ctx.globalAlpha = 1;
      }
      ctx.globalAlpha = b.alpha; drawSpr(SPR.phantom, b.x, b.y);
      ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW.cyan, b.x, b.y + 10, 0, 1.6 * b.alpha); ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      if (b.cloak && Math.random() < 0.3) { ctx.strokeStyle = 'rgba(0,229,255,0.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(b.x, b.y, 120, 60, 0, 0, TAU); ctx.stroke(); }
      if (!b.cloak) flashFx(b, 0.3);
    } },

  /* 10 ─ NÚCLEO OMEGA */
  { kind: 'omega', name: 'NÚCLEO OMEGA', hp: 950, size: [260, 260],
    virt: '4 escudos orbitales que bloquean disparos · 3 fases', weak: 'En la fase final pierde los escudos: núcleo ×1,5', spec: 'Colapso: atrae tu nave hacia el núcleo',
    init(b) { b.y = -200; b.spr = 'omega'; b.pa = 0; b.phase = 1; },
    update(b, dt) {
      const ph = b.hp > b.maxhp * 0.66 ? 1 : b.hp > b.maxhp * 0.33 ? 2 : 3;
      if (ph !== b.phase) {
        b.phase = ph; flash = 0.8; shake = 22; bossNote(b, 'FASE ' + ph, '#ffd23f'); SFX.roar(); eB.length = 0;
        if (ph === 3) for (let i = 0; i < 4; i++) { const a = b.pa + i * Math.PI / 2; explode(b.x + Math.cos(a) * 110, b.y + Math.sin(a) * 110, 2); }
      }
      b.pa += dt * (b.phase === 1 ? 0.8 : 1.5);
      if (b.enter) { enterTo(b, 220, 80, dt); return; }
      b.x = W / 2 + Math.sin(b.t * 0.3) * 40; b.y = 220 + Math.sin(b.t * 0.6) * 15;
      if (!P.alive) return;
      b.a1 -= dt; b.a2 -= dt; b.a3 -= dt;
      const sp = (140 + level * 4) * D.bullet;
      if (b.a1 <= 0) {
        b.a1 = cd(b.phase === 1 ? 0.1 : b.phase === 2 ? 0.08 : 0.07); b.spin += 0.29;
        const arms = b.phase === 3 ? 3 : 2;
        for (let i = 0; i < arms; i++) eShot(b.x, b.y, b.spin + i * TAU / arms, sp, true);
      }
      if (b.a2 <= 0) { b.a2 = cd(b.phase === 3 ? 1.3 : 1.7); shotFan(b.x, b.y + 40, aim(b.x, b.y + 40), nShots(b.phase === 1 ? 3 : 5), 0.15, bspd() + 30); }
      if (b.phase >= 2 && b.a3 <= 0 && !LASERS.length) {
        b.a3 = cd(b.phase === 3 ? 4 : 5.5); const base = aim(b.x, b.y), n = b.phase === 3 ? 3 : 2;
        for (let i = 0; i < n; i++) LASERS.push({ ox: 0, oy: 0, a: base + (i - (n - 1) / 2) * 0.6, va: (i % 2 ? 1 : -1) * 0.25, t: 0, warn: 1, on: 1.4, w: 14 });
        SFX.charge();
        if (EN.length < 6) wKamikaze();
      }
      if (b.phase === 3 && P.alive) {
        const dx = b.x - P.x, dy = b.y - P.y, d = Math.hypot(dx, dy) || 1, pull = 70 * dt;
        P.x += dx / d * pull; P.y += dy / d * pull; P.tx += dx / d * pull; P.ty += dy / d * pull;
        b.a4 = (b.a4 || 0) - dt;
        if (b.a4 <= 0) { b.a4 = cd(1.4); shotRing(b.x, b.y, nShots(24), sp, null, Math.random(), false); }
      }
    },
    boxes(b) {
      const out = [];
      if (b.phase < 3) for (let i = 0; i < 4; i++) { const a = b.pa + i * Math.PI / 2; out.push([b.x + Math.cos(a) * 110, b.y + Math.sin(a) * 110, 38, 0]); }
      out.push([b.x, b.y, 66, b.phase === 3 ? 1.5 : 1]);
      return out;
    },
    weakPts: b => (b.phase === 3 ? [[b.x, b.y, 46]] : []),
    shadow: b => drawSpr(SHD.omega, b.x + 30, b.y + 50, 0, 0.85),
    draw(b) {
      ctx.globalCompositeOperation = 'lighter';
      drawSpr(b.phase === 3 ? GLOW.red : GLOW.amber, b.x, b.y, 0, 5 + Math.sin(G.t * 4) * 0.6);
      if (b.phase === 3) { ctx.strokeStyle = 'rgba(255,43,106,0.25)'; ctx.lineWidth = 3; for (let r = 1; r <= 3; r++) { ctx.beginPath(); ctx.arc(b.x, b.y, ((G.t * 120 + r * 120) % 360) + 80, 0, TAU); ctx.stroke(); } }
      ctx.globalCompositeOperation = 'source-over';
      drawSpr(SPR.omega, b.x, b.y, b.t * 0.6);
      if (b.phase < 3) for (let i = 0; i < 4; i++) {
        const a = b.pa + i * Math.PI / 2, px = b.x + Math.cos(a) * 110, py = b.y + Math.sin(a) * 110;
        ctx.strokeStyle = 'rgba(255,210,63,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x + Math.cos(a) * 60, b.y + Math.sin(a) * 60); ctx.lineTo(px, py); ctx.stroke();
        drawSpr(SPR.oplate, px, py, a + Math.PI / 2);
      }
      flashFx(b, 0.3);
    } }
];

/* ---------------- Motor común de jefes ---------------- */
const bossDef = (b = boss) => BOSS_DEFS[b.idx];
function nextBoss() { return BOSS_DEFS[(level - 1) % BOSS_DEFS.length]; }
function bossCenter(b = boss) { const Df = bossDef(b); return Df.center ? Df.center(b) : [b.x, b.y]; }
function spawnBoss() {
  const idx = (level - 1) % BOSS_DEFS.length, Df = BOSS_DEFS[idx], cycle = Math.floor((level - 1) / BOSS_DEFS.length);
  const hp = Math.round(Df.hp * (1 + 0.3 * (level - 1)) * (1 + cycle * 0.5) * D.hp);
  boss = { idx, kind: Df.kind, name: Df.name, x: W / 2, y: -170, hp, maxhp: hp, t: 0, hit: 0, enter: true, a1: 1, a2: 0.5, a3: 4, spin: 0, dying: 0,
    ta: [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2], rage: false };
  Df.init(boss);
  G.phase = 'boss'; setMusic('boss', idx);
}
function bossBoxes(b) { return bossDef(b).boxes(b); }
function checkBossDeath() {
  if (!boss || boss.dying || boss.hp > 0) return;
  boss.hp = 0; boss.dying = 0.001; SFX.bossDie(); vib(300); setMusic('victory', level + 1); eB.length = 0; LASERS = [];
  const [cx, cy] = bossCenter(); addScore(10000 * level, cx, cy, true);
}
function damageBoss(d, x, y, quiet) {
  if (!boss || boss.dying) return;
  gainUlt(d * 0.05);
  const Df = bossDef();
  if (Df.damage) Df.damage(boss, d); else boss.hp -= d;
  boss.hit = 0.05;
  if (!quiet) { burst(x, y, 3, 'mag', 150, 0.25, 0.5); SFX.hit(x); }
  checkBossDeath();
}
function hitBossBox(box, d, x, y) {
  const m = box[3], part = box[4], Df = bossDef();
  if (m <= 0) { burst(x, y, 2, 'white', 120, 0.15, 0.35); SFX.tink(x); return; }
  if (part) {
    part.hp -= d * m; part.hit = 0.06; gainUlt(d * m * 0.05);
    burst(x, y, 3, 'green', 150, 0.25, 0.5); SFX.hit(x);
    if (Df.partHit) Df.partHit(boss, part, d * m);
    if (part.hp <= 0 && !part.dead) { part.dead = true; if (Df.partDead) Df.partDead(boss, part); checkBossDeath(); }
    return;
  }
  damageBoss(d * m, x, y);
  if (m >= 1.5) { burst(x, y, 3, 'yellow', 200, 0.3, 0.6); if (throttle('crit', 450)) FT.push({ x, y: y - 10, t: 0, s: '×' + String(m).replace('.', ','), col: '#ffd23f' }); }
}
function updateBoss(dt) {
  const b = boss, Df = bossDef(b); b.t += dt; b.hit = Math.max(0, b.hit - dt);
  const [cx, cy] = bossCenter(b);
  if (b.dying) {
    b.dying += dt; if (!Df.ground && b.kind !== 'vroar' && b.kind !== 'hydra') b.y += 22 * dt;
    if (Math.random() < dt * 16) {
      if (b.kind === 'vroar') { const s = pick(b.segs.concat([b.head])); explode(s.x + rand(-20, 20), s.y + rand(-20, 20), rand(0.8, 1.5)); }
      else explode(cx + rand(-Df.size[0] / 2, Df.size[0] / 2), cy + rand(-Df.size[1] / 2, Df.size[1] / 2), rand(0.8, 1.6));
    }
    if (b.dying > 2.4) {
      explode(cx, cy, 5); explode(cx - 120, cy, 3); explode(cx + 120, cy, 3); flash = 1; shake = 24;
      if (Df.ground) marks.push({ x: cx, y: cy, s: 4 });
      dropXP(cx, cy, 60);
      for (const [t, dx] of [['P', -70], ['V', 0], ['S', 70]]) PU.push({ x: clamp(cx + dx, 40, W - 40), y: clamp(cy, 80, H * 0.6), t, tt: 0 });
      if (b.idx === BOSS_DEFS.length - 1) FT.push({ x: W / 2, y: H * 0.45, t: 0, s: '¡OMEGA DERROTADO! CICLO ' + (Math.floor(level / BOSS_DEFS.length) + 1), big: true, col: '#ffd23f' });
      boss = null; level++; stageT = 0; waveT = 4; G.phase = 'waves'; LASERS = []; showBanner();
    }
    return;
  }
  b.rage = b.hp < b.maxhp * 0.5;
  Df.update(b, dt);
  if (b.rage && Math.random() < dt * 6) PA.push({ x: cx + rand(-Df.size[0] / 3, Df.size[0] / 3), y: cy + rand(-40, 40), vx: rand(-15, 15), vy: rand(-40, -10), life: 1, max: 1, s: 1.4, smoke: true });
}
function drawBossAny(b) {
  const Df = bossDef(b);
  if (Df.draw) Df.draw(b); else drawBoss(b);
  if (b.dying || b.enter) return;
  for (const [x, y, r] of (Df.weakPts ? Df.weakPts(b) : [])) {
    const k = 0.5 + 0.5 * Math.sin(G.t * 6);
    ctx.strokeStyle = `rgba(255,210,63,${0.45 + k * 0.4})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, r + k * 4, 0, TAU); ctx.stroke();
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + G.t; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r + 2), y + Math.sin(a) * (r + 2)); ctx.lineTo(x + Math.cos(a) * (r + 12), y + Math.sin(a) * (r + 12)); ctx.stroke(); }
  }
}
function drawBossIntro() {
  const Df = nextBoss(), on = Math.floor(G.t * 4) % 2 === 0, y = H * 0.36;
  ctx.fillStyle = on ? 'rgba(255,0,50,0.22)' : 'rgba(255,0,50,0.1)'; ctx.fillRect(0, y - 70, W, 200);
  ctx.fillStyle = 'rgba(5,6,14,0.7)'; ctx.fillRect(0, y + 28, W, 102);
  txt('⚠  ALERTA  ⚠', W / 2, y - 44, 22, '#ff3355', 'center', '#ff0033', 900);
  txt(Df.name, W / 2, y - 6, 38, '#ffffff', 'center', '#ff3355', 900);
  const cycle = Math.floor((level - 1) / BOSS_DEFS.length);
  txt('JEFE ' + ((level - 1) % BOSS_DEFS.length + 1) + ' / ' + BOSS_DEFS.length + (cycle ? ' · CICLO ' + (cycle + 1) : '') + ' · ESPECIAL: ' + Df.spec.toUpperCase(), W / 2, y + 22, 11, '#ffc0cc', 'center', null, 800);
  ctx.textAlign = 'left';
  txt('▲ VIRTUD', 24, y + 46, 12, '#ff7a8a', 'left', null, 900);
  wrapLeft(Df.virt, 24, y + 64, W - 48, 16, 13, '#e8ecf4');
  txt('▼ DEBILIDAD', 24, y + 96, 12, '#39ff88', 'left', null, 900);
  wrapLeft(Df.weak, 24, y + 114, W - 48, 16, 13, '#e8ecf4');
}
function wrapLeft(s, x, y, maxW, lh, size, col) {
  ctx.font = `600 ${size}px ${FONT}`; let line = '', yy = y;
  for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { txt(line, x, yy, size, col, 'left', null, 600); line = w; yy += lh; } else line = t; }
  if (line) txt(line, x, yy, size, col, 'left', null, 600);
}
