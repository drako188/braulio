'use strict';
/* =====================================================================
   DISEÑO VISUAL DE LAS NAVES DEL JUGADOR (vista cenital, morro hacia arriba)
   ===================================================================== */
const mirror = (cx, pts) => { const out = pts.slice(); for (let i = pts.length - 2; i >= 0; i -= 2) out.push(2 * cx - pts[i], pts[i + 1]); return out; };
function seams(g, col, lines) { g.strokeStyle = col; g.lineWidth = 1; g.beginPath(); for (const [a, b, c, d] of lines) { g.moveTo(a, b); g.lineTo(c, d); } g.stroke(); }
function glowLine(g, col, w, pts) { g.save(); g.shadowColor = col; g.shadowBlur = 6; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.stroke(); g.restore(); }
function vents(g, x, y, n, col, w = 6, h = 2, gap = 4) { g.save(); g.shadowColor = col; g.shadowBlur = 5; g.fillStyle = col; for (let i = 0; i < n; i++) g.fillRect(x, y + i * gap, w, h); g.restore(); }

/* 1 · HALCÓN — caza plateado con brillo cian */
SPR.falcon = sprite(104, 108, g => {
  const cx = 52;
  const wing = mirror(cx, [cx, 30, cx + 18, 44, cx + 50, 66, cx + 52, 72, cx + 26, 72, cx + 20, 84, cx, 88]);
  g.shadowColor = '#00e5ff'; g.shadowBlur = 10; g.fillStyle = '#9aa4b8'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 30, 0, 88, ['#f4f7fc', '#aab4c8', '#6a7488']); poly(g, wing); g.fill();
  g.strokeStyle = '#3a4252'; g.lineWidth = 1.2; g.stroke();
  for (const s of [-1, 1]) {
    g.fillStyle = '#d8e0ee'; poly(g, [cx + s * 50, 66, cx + s * 56, 58, cx + s * 54, 74]); g.fill();
    glowLine(g, '#00e5ff', 2, [cx + s * 20, 46, cx + s * 48, 66]);
    seams(g, 'rgba(40,48,64,0.55)', [[cx + s * 16, 56, cx + s * 40, 70], [cx + s * 30, 62, cx + s * 26, 72]]);
    g.fillStyle = lg(g, 0, 20, 0, 36, ['#e8eef8', '#8a94a8']); poly(g, [cx + s * 9, 24, cx + s * 30, 20, cx + s * 28, 28, cx + s * 11, 36]); g.fill();
    glowLine(g, '#00e5ff', 1.5, [cx + s * 13, 30, cx + s * 27, 23]);
    g.fillStyle = '#2e3442'; rr(g, cx + (s > 0 ? 12 : -28), 56, 16, 36, 6); g.fill();
    g.fillStyle = '#4a5266'; rr(g, cx + (s > 0 ? 14 : -26), 58, 12, 30, 5); g.fill();
    g.fillStyle = radial(g, cx + s * 20, 91, 8, [[0, '#ffffff'], [0.4, '#4ab8ff'], [1, 'rgba(0,80,255,0)']]); g.beginPath(); g.arc(cx + s * 20, 91, 8, 0, TAU); g.fill();
    g.fillStyle = '#dfe6f2'; g.fillRect(cx + s * 32 - 1.5, 64, 3, 22); glowLine(g, '#00e5ff', 1, [cx + s * 32, 66, cx + s * 32, 84]);
    vents(g, cx + (s > 0 ? 10 : -16), 64, 3, '#00e5ff');
  }
  const body = mirror(cx, [cx, 0, cx + 6, 14, cx + 10, 34, cx + 11, 64, cx + 8, 86]);
  g.fillStyle = lg(g, cx - 11, 0, cx + 11, 0, ['#8a94a8', '#ffffff', '#7a8498']); poly(g, body); g.fill();
  g.strokeStyle = '#3a4252'; g.lineWidth = 1; g.stroke();
  seams(g, 'rgba(40,48,64,0.6)', [[cx - 8, 46, cx + 8, 46], [cx - 9, 58, cx + 9, 58], [cx - 7, 72, cx + 7, 72]]);
  g.fillStyle = lg(g, 0, 14, 0, 42, ['#cdf6ff', '#2a8aff', '#0a2a6a']); poly(g, mirror(cx, [cx, 12, cx + 6, 20, cx + 6, 36, cx, 42])); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.7)'; poly(g, [cx - 2, 16, cx + 1, 16, cx - 3, 30]); g.fill();
  glowLine(g, '#00e5ff', 1.5, [cx, 48, cx, 80]);
});
/* 2 · TITÁN — acorazado gris con franjas rojas y cañones de plasma */
SPR.titan = sprite(112, 108, g => {
  const cx = 56;
  const wing = mirror(cx, [cx, 34, cx + 30, 40, cx + 54, 54, cx + 54, 70, cx + 40, 76, cx + 22, 92, cx, 96]);
  g.shadowColor = '#ff3a2a'; g.shadowBlur = 10; g.fillStyle = '#2a2e36'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 34, 0, 96, ['#5a606c', '#2e323a']); poly(g, wing); g.fill();
  g.strokeStyle = '#14161a'; g.lineWidth = 1.5; g.stroke();
  for (const s of [-1, 1]) {
    seams(g, 'rgba(0,0,0,0.5)', [[cx + s * 24, 44, cx + s * 24, 86], [cx + s * 36, 48, cx + s * 36, 80], [cx + s * 14, 60, cx + s * 52, 60]]);
    g.fillStyle = '#d02a2a'; poly(g, [cx + s * 40, 46, cx + s * 50, 52, cx + s * 46, 56, cx + s * 36, 50]); g.fill();
    g.fillStyle = '#1e2026'; rr(g, cx + (s > 0 ? 40 : -54), 54, 14, 20, 3); g.fill();
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { g.fillStyle = radial(g, cx + s * (44 + c * 6), 59 + r * 8, 3, [[0, '#fff'], [0.4, '#ff3a2a'], [1, 'rgba(255,0,0,0)']]); g.beginPath(); g.arc(cx + s * (44 + c * 6), 59 + r * 8, 3, 0, TAU); g.fill(); }
    const bx = cx + s * 20;
    g.fillStyle = '#3a3e46'; rr(g, bx - 7, 2, 14, 54, 4); g.fill();
    g.fillStyle = '#22252c'; rr(g, bx - 5, 0, 10, 30, 3); g.fill();
    for (let k = 0; k < 3; k++) { g.save(); g.shadowColor = '#4ab8ff'; g.shadowBlur = 6; g.fillStyle = '#7ad0ff'; g.fillRect(bx - 4, 6 + k * 8, 8, 3); g.restore(); }
    g.fillStyle = radial(g, bx, 2, 6, [[0, '#ffffff'], [0.4, '#4ab8ff'], [1, 'rgba(0,100,255,0)']]); g.beginPath(); g.arc(bx, 2, 6, 0, TAU); g.fill();
    g.fillStyle = '#2a2d34'; rr(g, cx + (s > 0 ? 8 : -24), 76, 16, 24, 5); g.fill();
    vents(g, cx + (s > 0 ? 11 : -21), 80, 3, '#ffb02a', 10, 2, 5);
  }
  const body = mirror(cx, [cx, 18, cx + 12, 24, cx + 14, 80, cx + 8, 96]);
  g.fillStyle = lg(g, cx - 14, 0, cx + 14, 0, ['#3a3e46', '#7a808c', '#3a3e46']); poly(g, body); g.fill();
  g.strokeStyle = '#14161a'; g.lineWidth = 1.2; g.stroke();
  g.fillStyle = '#d02a2a'; g.fillRect(cx - 14, 52, 28, 4); g.fillRect(cx - 3, 60, 6, 30);
  g.fillStyle = lg(g, 0, 26, 0, 46, ['#ffe0a0', '#ff8a00', '#8a3a00']); poly(g, mirror(cx, [cx, 24, cx + 8, 30, cx + 8, 44, cx, 48])); g.fill();
  g.fillStyle = radial(g, cx, 70, 4, [[0, '#fff'], [0.4, '#ff3a2a'], [1, 'rgba(255,0,0,0)']]); g.beginPath(); g.arc(cx, 70, 4, 0, TAU); g.fill();
});
/* 3 · CENTINELA — carguero blindado gris y amarillo con torretas */
SPR.sentinel = sprite(104, 112, g => {
  const cx = 52;
  for (const s of [-1, 1]) {
    g.fillStyle = '#3a3e46'; rr(g, cx + (s > 0 ? 22 : -42), 34, 20, 56, 6); g.fill();
    g.strokeStyle = '#ffc83a'; g.lineWidth = 1.5; g.stroke();
    const cols = ['#b04030', '#3a6aa0', '#c0a070', '#a05030'];
    for (let k = 0; k < 4; k++) { g.fillStyle = cols[(k + (s > 0 ? 1 : 0)) % 4]; g.fillRect(cx + (s > 0 ? 25 : -39), 40 + k * 11, 14, 9); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(cx + (s > 0 ? 25 : -39), 44 + k * 11, 14, 1); }
    g.fillStyle = '#2a2d34'; rr(g, cx + (s > 0 ? 22 : -42), 90, 20, 14, 4); g.fill();
    g.fillStyle = radial(g, cx + s * 32, 104, 7, [[0, '#fff'], [0.4, '#2bf0c0'], [1, 'rgba(0,200,160,0)']]); g.beginPath(); g.arc(cx + s * 32, 104, 7, 0, TAU); g.fill();
  }
  g.shadowColor = '#ffc83a'; g.shadowBlur = 8;
  g.fillStyle = lg(g, cx - 22, 0, cx + 22, 0, ['#5a606c', '#a8aebc', '#5a606c']);
  poly(g, mirror(cx, [cx, 2, cx + 14, 8, cx + 22, 22, cx + 22, 100, cx + 16, 108])); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#14161a'; g.lineWidth = 1.5; g.stroke();
  g.save(); poly(g, mirror(cx, [cx, 2, cx + 14, 8, cx + 22, 22, cx + 22, 100, cx + 16, 108])); g.clip();
  for (const y of [16, 46, 80]) { g.fillStyle = '#ffc83a'; g.fillRect(cx - 24, y, 48, 6); g.fillStyle = '#1a1a1a'; for (let x = cx - 24; x < cx + 24; x += 8) { poly(g, [x, y, x + 4, y, x, y + 6, x - 4, y + 6]); g.fill(); } }
  g.restore();
  g.fillStyle = '#1e2228'; rr(g, cx - 10, 54, 20, 22, 4); g.fill();
  for (let k = 0; k < 3; k++) { g.fillStyle = radial(g, cx, 58 + k * 7, 6, [[0, '#ffffff'], [0.4, '#2bf0c0'], [1, 'rgba(0,200,160,0)']]); g.beginPath(); g.ellipse(cx, 58 + k * 7, 8, 3.5, 0, 0, TAU); g.fill(); }
  g.fillStyle = '#4a505c'; rr(g, cx - 12, 26, 24, 16, 4); g.fill();
  g.fillStyle = lg(g, 0, 28, 0, 36, ['#bff8ff', '#1a8aa0']); g.fillRect(cx - 9, 29, 18, 5);
  for (const [tx, ty] of [[cx, 12], [cx - 14, 88], [cx + 14, 88]]) {
    g.fillStyle = '#c8cdd8'; g.fillRect(tx - 3.5, ty - 12, 2.5, 10); g.fillRect(tx + 1, ty - 12, 2.5, 10);
    g.fillStyle = '#3a3e46'; g.beginPath(); g.arc(tx, ty, 6, 0, TAU); g.fill(); g.strokeStyle = '#ffc83a'; g.lineWidth = 1.5; g.stroke();
  }
  g.fillStyle = '#ffc83a'; g.beginPath(); g.arc(cx + 16, 40, 2, 0, TAU); g.fill();
});
/* 4 · ESPECTRO — furtivo negro con aristas moradas */
SPR.spectre = sprite(108, 104, g => {
  const cx = 54;
  const wing = mirror(cx, [cx, 4, cx + 10, 26, cx + 24, 40, cx + 52, 62, cx + 50, 70, cx + 30, 66, cx + 22, 84, cx, 80]);
  g.shadowColor = '#c86bff'; g.shadowBlur = 14; g.fillStyle = '#16121e'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 4, 0, 84, ['#3a3448', '#1a1622', '#0c0a12']); poly(g, wing); g.fill();
  for (const s of [-1, 1]) {
    g.fillStyle = 'rgba(255,255,255,0.05)'; poly(g, [cx, 10, cx + s * 22, 42, cx + s * 8, 50]); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.35)'; poly(g, [cx + s * 22, 42, cx + s * 50, 64, cx + s * 30, 64]); g.fill();
    glowLine(g, '#c86bff', 1.8, [cx + s * 8, 22, cx + s * 24, 40, cx + s * 50, 62]);
    glowLine(g, '#c86bff', 1.5, [cx + s * 30, 66, cx + s * 22, 82]);
    g.fillStyle = '#221c2c'; poly(g, [cx + s * 26, 50, cx + s * 30, 50, cx + s * 34, 82, cx + s * 28, 84]); g.fill();
    glowLine(g, '#e0a8ff', 1, [cx + s * 29, 54, cx + s * 32, 78]);
    g.fillStyle = radial(g, cx + s * 12, 84, 7, [[0, '#fff'], [0.4, '#c86bff'], [1, 'rgba(120,0,255,0)']]); g.beginPath(); g.arc(cx + s * 12, 84, 7, 0, TAU); g.fill();
    seams(g, 'rgba(200,107,255,0.25)', [[cx + s * 12, 56, cx + s * 22, 70], [cx + s * 4, 64, cx + s * 14, 76]]);
  }
  g.fillStyle = lg(g, 0, 22, 0, 50, ['#e0b8ff', '#7a2ad0', '#2a0a4a']); poly(g, mirror(cx, [cx, 20, cx + 7, 30, cx + 6, 46, cx, 52])); g.fill();
  glowLine(g, '#ffffff', 0.8, [cx - 2, 26, cx - 3, 38]);
  glowLine(g, '#c86bff', 1.5, [cx, 56, cx, 76]);
});
/* 5 · RAYO — nave alienígena de garras con energía verde */
SPR.rayo = sprite(108, 108, g => {
  const cx = 54;
  g.shadowColor = '#b6ff3a'; g.shadowBlur = 12;
  for (const s of [-1, 1]) {
    g.fillStyle = lg(g, 0, 10, 0, 100, ['#9a88aa', '#5a4a6a', '#2e2238']);
    g.beginPath(); g.moveTo(cx + s * 8, 30); g.quadraticCurveTo(cx + s * 58, 30, cx + s * 50, 2); g.quadraticCurveTo(cx + s * 44, 34, cx + s * 14, 50); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx + s * 10, 56); g.quadraticCurveTo(cx + s * 60, 62, cx + s * 54, 36); g.quadraticCurveTo(cx + s * 50, 68, cx + s * 12, 76); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx + s * 8, 80); g.quadraticCurveTo(cx + s * 40, 96, cx + s * 30, 104); g.quadraticCurveTo(cx + s * 22, 92, cx + s * 6, 92); g.closePath(); g.fill();
  }
  g.shadowBlur = 0;
  for (const s of [-1, 1]) {
    g.strokeStyle = 'rgba(210,190,150,0.6)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(cx + s * 12, 36); g.quadraticCurveTo(cx + s * 48, 30, cx + s * 50, 6); g.stroke();
    g.beginPath(); g.moveTo(cx + s * 12, 62); g.quadraticCurveTo(cx + s * 52, 62, cx + s * 54, 40); g.stroke();
    for (const [px, py] of [[30, 36], [40, 60], [22, 88]]) { g.fillStyle = radial(g, cx + s * px, py, 6, [[0, '#f0ffb0'], [0.4, '#b6ff3a'], [1, 'rgba(100,200,0,0)']]); g.beginPath(); g.ellipse(cx + s * px, py, 6, 3.5, s * 0.4, 0, TAU); g.fill(); }
  }
  g.fillStyle = lg(g, cx - 12, 0, cx + 12, 0, ['#4a3a58', '#9a86a8', '#4a3a58']);
  g.beginPath(); g.moveTo(cx, 0); g.quadraticCurveTo(cx + 16, 40, cx + 8, 96); g.lineTo(cx - 8, 96); g.quadraticCurveTo(cx - 16, 40, cx, 0); g.fill();
  g.strokeStyle = 'rgba(210,190,150,0.5)'; g.lineWidth = 1; g.stroke();
  for (let k = 0; k < 4; k++) { g.strokeStyle = 'rgba(30,20,40,0.6)'; g.beginPath(); g.moveTo(cx - 8, 54 + k * 9); g.quadraticCurveTo(cx, 58 + k * 9, cx + 8, 54 + k * 9); g.stroke(); }
  g.fillStyle = radial(g, cx, 34, 12, [[0, '#ffffff'], [0.25, '#d8ff7a'], [0.6, '#4a9a10'], [1, 'rgba(20,60,0,0)']]); g.beginPath(); g.ellipse(cx, 34, 7, 13, 0, 0, TAU); g.fill();
});
/* 6 · VÓRTICE — flecha blanca con franjas fucsia */
SPR.vortex = sprite(100, 108, g => {
  const cx = 50;
  const wing = mirror(cx, [cx, 0, cx + 10, 30, cx + 16, 44, cx + 42, 70, cx + 44, 80, cx + 24, 78, cx + 16, 92, cx, 90]);
  g.shadowColor = '#ff2bd6'; g.shadowBlur = 12; g.fillStyle = '#c8b8c8'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 0, 0, 92, ['#ffffff', '#e6dce8', '#a898ac']); poly(g, wing); g.fill();
  g.strokeStyle = '#3a2a3a'; g.lineWidth = 1; g.stroke();
  for (const s of [-1, 1]) {
    g.fillStyle = '#ff2bd6'; poly(g, [cx + s * 12, 40, cx + s * 18, 42, cx + s * 40, 68, cx + s * 34, 70]); g.fill();
    glowLine(g, '#00e5ff', 1.6, [cx + s * 42, 72, cx + s * 44, 80, cx + s * 26, 78]);
    g.fillStyle = '#f4eef4'; poly(g, [cx + s * 8, 22, cx + s * 22, 30, cx + s * 20, 34, cx + s * 9, 30]); g.fill();
    glowLine(g, '#00e5ff', 1, [cx + s * 10, 27, cx + s * 20, 32]);
    g.fillStyle = '#2a1e2e'; rr(g, cx + (s > 0 ? 8 : -20), 70, 12, 24, 5); g.fill();
    g.fillStyle = radial(g, cx + s * 14, 94, 7, [[0, '#ffffff'], [0.4, '#ff2bd6'], [1, 'rgba(255,0,180,0)']]); g.beginPath(); g.arc(cx + s * 14, 94, 7, 0, TAU); g.fill();
    vents(g, cx + (s > 0 ? 18 : -24), 56, 3, '#ff2bd6', 6, 2, 4);
    seams(g, 'rgba(60,40,60,0.4)', [[cx + s * 10, 50, cx + s * 24, 64]]);
  }
  g.fillStyle = lg(g, 0, 18, 0, 46, ['#cdf6ff', '#2a6aff', '#0a1a5a']); poly(g, mirror(cx, [cx, 16, cx + 6, 24, cx + 6, 40, cx, 46])); g.fill();
  glowLine(g, '#00e5ff', 1, [cx - 6, 24, cx - 6, 40]); glowLine(g, '#00e5ff', 1, [cx + 6, 24, cx + 6, 40]);
  g.fillStyle = '#ff2bd6'; g.fillRect(cx - 1.5, 50, 3, 34);
  g.fillStyle = radial(g, cx, 4, 5, [[0, '#ffffff'], [0.5, '#00e5ff'], [1, 'rgba(0,200,255,0)']]); g.beginPath(); g.arc(cx, 4, 5, 0, TAU); g.fill();
});
/* 7 · FÉNIX — buque real blanco y dorado con halo */
SPR.fenix = sprite(112, 112, g => {
  const cx = 56;
  g.strokeStyle = 'rgba(255,210,63,0.75)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, 66, 30, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(80,160,255,0.6)'; g.lineWidth = 1; g.beginPath(); g.arc(cx, 66, 26, 0, TAU); g.stroke();
  const wing = mirror(cx, [cx, 6, cx + 14, 30, cx + 30, 36, cx + 54, 60, cx + 46, 64, cx + 54, 80, cx + 30, 78, cx + 24, 96, cx, 100]);
  g.shadowColor = '#ffd23f'; g.shadowBlur = 14; g.fillStyle = '#d8d4c8'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 6, 0, 100, ['#ffffff', '#ece6d8', '#b8b0a0']); poly(g, wing); g.fill();
  g.strokeStyle = '#c8a030'; g.lineWidth = 2; g.stroke();
  for (const s of [-1, 1]) {
    g.strokeStyle = '#e8b830'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx + s * 16, 34); g.lineTo(cx + s * 50, 60); g.moveTo(cx + s * 28, 78); g.lineTo(cx + s * 50, 78); g.stroke();
    g.fillStyle = '#e8b830'; poly(g, [cx + s * 54, 60, cx + s * 62, 54, cx + s * 58, 64]); g.fill(); poly(g, [cx + s * 54, 80, cx + s * 62, 84, cx + s * 52, 84]); g.fill();
    g.save(); g.shadowColor = '#4ab8ff'; g.shadowBlur = 8; g.fillStyle = '#7ad0ff'; poly(g, [cx + s * 24, 48, cx + s * 36, 56, cx + s * 30, 58, cx + s * 22, 52]); g.fill(); g.restore();
    g.fillStyle = '#2a3a7a'; g.fillRect(cx + s * 38 - 4, 64, 8, 14); g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(cx + s * 38, 70, 2, 0, TAU); g.fill();
    g.fillStyle = '#c8a030'; rr(g, cx + (s > 0 ? 12 : -24), 86, 12, 18, 4); g.fill();
    g.fillStyle = radial(g, cx + s * 18, 104, 8, [[0, '#ffffff'], [0.4, '#4ab8ff'], [1, 'rgba(0,100,255,0)']]); g.beginPath(); g.arc(cx + s * 18, 104, 8, 0, TAU); g.fill();
  }
  const body = mirror(cx, [cx, 0, cx + 8, 16, cx + 12, 50, cx + 10, 96]);
  g.fillStyle = lg(g, cx - 12, 0, cx + 12, 0, ['#c8c0b0', '#ffffff', '#c0b8a8']); poly(g, body); g.fill();
  g.strokeStyle = '#c8a030'; g.lineWidth = 1.5; g.stroke();
  for (const [dx, y, h] of [[0, 58, 22], [-6, 64, 14], [6, 64, 14], [-11, 70, 9], [11, 70, 9]]) { g.fillStyle = lg(g, 0, y - h, 0, y, ['#fff6c0', '#e8b830']); poly(g, [cx + dx, y - h, cx + dx + 3, y, cx + dx - 3, y]); g.fill(); }
  g.fillStyle = radial(g, cx, 66, 7, [[0, '#ffffff'], [0.4, '#4ab8ff'], [1, 'rgba(0,100,255,0)']]); g.beginPath(); g.arc(cx, 66, 7, 0, TAU); g.fill();
  g.fillStyle = lg(g, 0, 16, 0, 38, ['#d8f4ff', '#2a6aff', '#0a1a5a']); poly(g, mirror(cx, [cx, 14, cx + 6, 22, cx + 5, 36, cx, 40])); g.fill();
});

/* ---------- Llamas, sombras, colores y armas a juego ---------- */
SPR.flameB = makeFlame('#9ad8ff', 'rgba(40,120,255,0.6)', 'rgba(0,40,255,0)');
SPR.flameO = makeFlame('#ffd0a0', 'rgba(255,110,20,0.6)', 'rgba(200,40,0,0)');
SPR.flameT = makeFlame('#b0fff0', 'rgba(20,220,180,0.6)', 'rgba(0,120,100,0)');
SPR.flameL = makeFlame('#eaffb0', 'rgba(150,255,40,0.6)', 'rgba(60,160,0,0)');
SPR.flameM = makeFlame('#ffd0f0', 'rgba(255,43,214,0.6)', 'rgba(180,0,140,0)');
SPR.flameV = makeFlame('#e8c8ff', 'rgba(170,80,255,0.6)', 'rgba(90,0,200,0)');
for (const k of ['falcon', 'rayo', 'titan', 'spectre', 'fenix', 'sentinel', 'vortex']) { SHD[k] = tint(SPR[k], 'rgba(0,0,0,0.45)'); FL[k] = tint(SPR[k], 'rgba(255,255,255,0.85)'); }
SPR.needle = sprite(10, 36, g => { g.shadowColor = '#b6ff3a'; g.shadowBlur = 6; g.fillStyle = lg(g, 0, 0, 0, 36, ['#ffffff', '#b6ff3a', 'rgba(60,160,0,0)']); rr(g, 3, 1, 4, 34, 2); g.fill(); });
SPR.shell = sprite(26, 30, g => {
  g.fillStyle = radial(g, 13, 12, 13, [[0, '#ffffff'], [0.3, '#7ad0ff'], [0.6, 'rgba(40,120,255,0.6)'], [1, 'rgba(0,40,200,0)']]); g.fillRect(0, 0, 26, 30);
  g.fillStyle = '#eaf6ff'; g.beginPath(); g.ellipse(13, 12, 4.5, 6.5, 0, 0, TAU); g.fill();
});
const SKIN = {
  falcon: { col: '#00e5ff', glow: 'cyan', flame: 'flameB', flames: [[-20, 40, 16, 38], [20, 40, 16, 38]] },
  rayo: { col: '#b6ff3a', glow: 'lime', flame: 'flameL', flames: [[0, 42, 22, 52]] },
  titan: { col: '#ff4a3a', glow: 'red', flame: 'flameO', flames: [[-16, 46, 14, 34], [16, 46, 14, 34]] },
  spectre: { col: '#c86bff', glow: 'purple', flame: 'flameV', flames: [[-12, 32, 13, 30], [12, 32, 13, 30]] },
  fenix: { col: '#ffd23f', glow: 'amber', flame: 'flameB', flames: [[-18, 48, 16, 36], [18, 48, 16, 36]] },
  sentinel: { col: '#ffc83a', glow: 'amber', flame: 'flameT', flames: [[-20, 50, 15, 32], [20, 50, 15, 32]] },
  vortex: { col: '#ff2bd6', glow: 'mag', flame: 'flameM', flames: [[-14, 42, 13, 32], [14, 42, 13, 32]] }
};
for (const S of SHIPS) Object.assign(S, SKIN[S.id]);
