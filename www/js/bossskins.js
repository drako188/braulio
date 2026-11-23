'use strict';
/* =====================================================================
   DISEÑO VISUAL DE LOS 10 JEFES (vista cenital, morro hacia abajo)
   Mantiene las medidas y posiciones de cada jefe para no alterar sus
   puntos débiles ni sus cajas de impacto.
   ===================================================================== */
function claw(g, x0, y0, x1, y1, bend, w, fill, edge) {
  const mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2;
  g.fillStyle = fill; g.beginPath(); g.moveTo(x0 - w, y0); g.quadraticCurveTo(mx - w * 0.6, my, x1, y1); g.quadraticCurveTo(mx + w * 0.6, my, x0 + w, y0); g.closePath(); g.fill();
  if (edge) { g.save(); g.shadowColor = edge; g.shadowBlur = 6; g.strokeStyle = edge; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0 + w, y0); g.quadraticCurveTo(mx + w * 0.6, my, x1, y1); g.stroke(); g.restore(); }
}
function crack(g, col, x, y, n, len) { g.save(); g.shadowColor = col; g.shadowBlur = 6; g.strokeStyle = col; g.lineWidth = 1.4; for (let i = 0; i < n; i++) { g.beginPath(); let px = x, py = y; g.moveTo(px, py); for (let s = 0; s < 4; s++) { px += rand(-len, len); py += rand(-len, len); g.lineTo(px, py); } g.stroke(); } g.restore(); }
function eye(g, x, y, rx, ry, col) {
  g.fillStyle = radial(g, x, y, rx * 1.6, [[0, col], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.ellipse(x, y, rx * 1.6, ry * 1.6, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, x, y, rx, [[0, '#fff6c0'], [0.45, '#ffb02a'], [1, col]]); g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill();
  g.fillStyle = '#1a0000'; g.beginPath(); g.ellipse(x, y, rx * 0.18, ry * 0.85, 0, 0, TAU); g.fill();
}

/* 1 · NAVE NODRIZA — acorazado oscuro con ojo rojo y cañones gemelos */
SPR.boss = sprite(460, 260, g => {
  const cx = 230, R = '#ff2a2a';
  const hull = mirror(cx, [cx, 256, cx + 30, 200, cx + 70, 170, cx + 120, 150, cx + 226, 118, cx + 200, 104, cx + 228, 84, cx + 160, 76, cx + 120, 40, cx + 70, 34, cx + 40, 8, cx, 18]);
  g.shadowColor = R; g.shadowBlur = 16; g.fillStyle = '#26222a'; poly(g, hull); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 0, 0, 260, ['#5a545e', '#2e2a32', '#18161c']); poly(g, hull); g.fill();
  g.strokeStyle = '#ff3a3a'; g.lineWidth = 2; g.stroke();
  for (const s of [-1, 1]) {
    for (let k = 0; k < 4; k++) claw(g, cx + s * (90 + k * 34), 80 + k * 4, cx + s * (120 + k * 34), 34 - k * 4, s * 10, 7, '#3a343e', R);
    for (const ox of [110, 182]) { g.fillStyle = '#1e1a22'; rr(g, cx + s * ox - 14, 60, 28, 76, 10); g.fill(); g.strokeStyle = 'rgba(255,58,58,0.6)'; g.lineWidth = 1.5; g.stroke(); vents(g, cx + s * ox - 8, 70, 6, '#ff3a3a', 16, 3, 9); }
    crack(g, R, cx + s * 150, 130, 2, 18); crack(g, R, cx + s * 80, 160, 2, 14);
    const bx = cx + s * 44;
    g.fillStyle = '#2a262e'; rr(g, bx - 12, 120, 24, 120, 8); g.fill(); g.strokeStyle = '#14121a'; g.lineWidth = 2; g.stroke();
    for (let k = 0; k < 5; k++) { g.save(); g.shadowColor = R; g.shadowBlur = 6; g.fillStyle = '#ff4a4a'; g.fillRect(bx - 10, 140 + k * 18, 20, 3); g.restore(); }
    g.fillStyle = radial(g, bx, 240, 14, [[0, '#ffffff'], [0.35, '#ff3a3a'], [1, 'rgba(255,0,0,0)']]); g.beginPath(); g.arc(bx, 240, 14, 0, TAU); g.fill();
  }
  g.fillStyle = lg(g, cx - 34, 0, cx + 34, 0, ['#3a343e', '#6a6470', '#3a343e']); poly(g, mirror(cx, [cx, 250, cx + 22, 200, cx + 34, 60, cx + 20, 20, cx, 14])); g.fill();
  glowLine(g, R, 2, [cx, 170, cx, 246]);
  for (let k = 0; k < 5; k++) claw(g, cx - 60 + k * 30, 30, cx - 70 + k * 35, -2 - (k === 2 ? 10 : 0), (k - 2) * 4, 6, '#4a444e', R);
  g.strokeStyle = 'rgba(255,58,58,0.7)'; g.lineWidth = 3; g.beginPath(); g.arc(cx, 130, 58, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
  g.fillStyle = '#120a0e'; g.beginPath(); g.ellipse(cx, 130, 48, 34, 0, 0, TAU); g.fill();
  eye(g, cx, 130, 34, 22, 'rgba(255,30,30,0.9)');
});
SPR.turret = sprite(40, 40, g => {
  g.fillStyle = '#5a545e'; g.fillRect(20, 15, 19, 4); g.fillRect(20, 21, 19, 4); g.fillStyle = '#ff3a3a'; g.fillRect(34, 15, 5, 10);
  g.fillStyle = '#2a262e'; g.beginPath(); g.arc(20, 20, 11, 0, TAU); g.fill(); g.strokeStyle = '#ff3a3a'; g.lineWidth = 2; g.stroke();
  g.fillStyle = radial(g, 20, 20, 5, [[0, '#fff'], [0.4, '#ff3a3a'], [1, 'rgba(255,0,0,0)']]); g.beginPath(); g.arc(20, 20, 5, 0, TAU); g.fill();
});

/* 2 · COLOSO — fortaleza blanca y dorada con trono de energía rosa */
SPR.colossus = sprite(440, 300, g => {
  const cx = 220, P = '#ff3ad0';
  const hull = mirror(cx, [cx, 296, cx + 30, 240, cx + 90, 236, cx + 150, 210, cx + 212, 220, cx + 190, 170, cx + 216, 120, cx + 170, 90, cx + 190, 40, cx + 120, 50, cx + 70, 10, cx, 30]);
  g.shadowColor = P; g.shadowBlur = 18; g.fillStyle = '#d8d0dc'; poly(g, hull); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 0, 0, 300, ['#ffffff', '#e4dcea', '#a898b0']); poly(g, hull); g.fill();
  g.strokeStyle = '#d4a830'; g.lineWidth = 3; g.stroke();
  for (const s of [-1, 1]) {
    g.save(); g.shadowColor = P; g.shadowBlur = 10; g.fillStyle = 'rgba(255,58,208,0.75)';
    for (let k = 0; k < 4; k++) g.fillRect(cx + s * (110 + k * 22) - 8, 150 + k * 6, 16, 4);
    g.restore();
    g.fillStyle = '#6a2a7a'; poly(g, [cx + s * 60, 120, cx + s * 150, 150, cx + s * 140, 180, cx + s * 70, 170]); g.fill();
    glowLine(g, P, 2, [cx + s * 70, 130, cx + s * 145, 158]);
    g.fillStyle = radial(g, cx + s * 175, 190, 12, [[0, '#ffffff'], [0.4, '#5aa8ff'], [1, 'rgba(0,80,255,0)']]); g.beginPath(); g.arc(cx + s * 175, 190, 12, 0, TAU); g.fill();
    claw(g, cx + s * 180, 210, cx + s * 205, 285, s * -12, 9, '#f0e8f4', '#d4a830');
    claw(g, cx + s * 120, 230, cx + s * 130, 290, s * -6, 8, '#f0e8f4', '#d4a830');
    g.strokeStyle = '#d4a830'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx + s * 30, 60); g.lineTo(cx + s * 180, 110); g.moveTo(cx + s * 40, 230); g.lineTo(cx + s * 140, 210); g.stroke();
  }
  for (const tx of [120, 320]) { g.fillStyle = '#3a1a4a'; g.beginPath(); g.arc(tx, 110, 42, 0, TAU); g.fill(); g.strokeStyle = '#d4a830'; g.lineWidth = 3; g.stroke(); }
  g.fillStyle = '#2a0a3a'; g.beginPath(); g.moveTo(cx - 46, 210); g.lineTo(cx - 46, 130); g.quadraticCurveTo(cx, 90, cx + 46, 130); g.lineTo(cx + 46, 210); g.closePath(); g.fill();
  g.strokeStyle = '#d4a830'; g.lineWidth = 3; g.stroke();
  g.fillStyle = lg(g, 0, 110, 0, 210, ['rgba(255,140,240,0.9)', 'rgba(150,60,255,0.7)', 'rgba(255,58,208,0.5)']); g.beginPath(); g.moveTo(cx - 36, 205); g.lineTo(cx - 36, 134); g.quadraticCurveTo(cx, 102, cx + 36, 134); g.lineTo(cx + 36, 205); g.closePath(); g.fill();
  g.fillStyle = 'rgba(40,0,50,0.85)'; poly(g, [cx, 132, cx + 12, 150, cx + 10, 190, cx - 10, 190, cx - 12, 150]); g.fill();
  for (const dx of [-14, 0, 14]) { g.fillStyle = '#3a0a4a'; poly(g, [cx + dx, 128, cx + dx + 3, 140, cx + dx - 3, 140]); g.fill(); }
  for (let k = 0; k < 5; k++) claw(g, cx - 40 + k * 20, 40, cx - 44 + k * 22, 6 - (k === 2 ? 14 : 0), 0, 5, '#f0e8f4', '#d4a830');
  g.fillStyle = radial(g, cx, 270, 16, [[0, '#ffffff'], [0.4, P], [1, 'rgba(255,0,200,0)']]); g.beginPath(); g.arc(cx, 270, 16, 0, TAU); g.fill();
});
SPR.bigTurret = sprite(100, 100, g => {
  g.save(); g.shadowColor = '#ff3ad0'; g.shadowBlur = 8;
  g.fillStyle = lg(g, 50, 30, 98, 70, ['#ffe0f8', '#b060ff']); poly(g, [50, 36, 98, 46, 98, 54, 50, 64]); g.fill(); g.restore();
  g.strokeStyle = '#d4a830'; g.lineWidth = 2; poly(g, [50, 36, 98, 46, 98, 54, 50, 64]); g.stroke();
  g.fillStyle = lg(g, 20, 20, 80, 80, ['#ffffff', '#c8b8d0']); g.beginPath(); g.arc(50, 50, 28, 0, TAU); g.fill();
  g.strokeStyle = '#d4a830'; g.lineWidth = 3; g.stroke();
  g.fillStyle = radial(g, 50, 50, 13, [[0, '#ffffff'], [0.4, '#ff3ad0'], [1, 'rgba(255,0,200,0)']]); g.beginPath(); g.arc(50, 50, 13, 0, TAU); g.fill();
});

/* 3 · VROAR — serpiente de calavera con fauces cian */
SPR.vhead = sprite(120, 130, g => {
  const cx = 60, C = '#2bf0e0';
  for (const s of [-1, 1]) { claw(g, cx + s * 30, 36, cx + s * 58, 0, s * 8, 6, '#8a7a96', C); claw(g, cx + s * 40, 56, cx + s * 60, 40, s * 4, 4, '#8a7a96', null); }
  const sk = mirror(cx, [cx, 18, cx + 30, 24, cx + 46, 46, cx + 42, 76, cx + 28, 104, cx + 12, 112]);
  g.shadowColor = C; g.shadowBlur = 14; g.fillStyle = '#4a3e56'; poly(g, sk); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 18, 0, 112, ['#a898b4', '#5a4a68', '#2a2234']); poly(g, sk); g.fill();
  g.strokeStyle = '#1a1420'; g.lineWidth = 2; g.stroke();
  for (const s of [-1, 1]) { vents(g, cx + s * 26 - 4, 40, 4, C, 8, 2.5, 6); g.fillStyle = radial(g, cx + s * 22, 74, 8, [[0, '#ffffff'], [0.4, C], [1, 'rgba(0,200,200,0)']]); g.beginPath(); g.ellipse(cx + s * 22, 74, 8, 5, s * 0.5, 0, TAU); g.fill(); }
  g.fillStyle = '#0a1a1e'; g.beginPath(); g.ellipse(cx, 104, 20, 22, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, cx, 106, 18, [[0, '#ffffff'], [0.3, C], [1, 'rgba(0,120,140,0)']]); g.beginPath(); g.arc(cx, 106, 18, 0, TAU); g.fill();
  g.fillStyle = '#efe6dc'; for (let k = -3; k <= 3; k++) { poly(g, [cx + k * 6 - 3, 86, cx + k * 6 + 3, 86, cx + k * 6, 100]); g.fill(); poly(g, [cx + k * 6 - 3, 126, cx + k * 6 + 3, 126, cx + k * 6, 114]); g.fill(); }
  for (const s of [-1, 1]) claw(g, cx + s * 18, 100, cx + s * 14, 130, s * 6, 5, '#efe6dc', null);
});
SPR.vseg = sprite(84, 64, g => {
  const cx = 42, cy = 32, C = '#2bf0e0';
  for (const s of [-1, 1]) claw(g, cx + s * 20, cy, cx + s * 42, cy - 18, s * 4, 5, '#8a7a96', C);
  g.fillStyle = lg(g, 0, 6, 0, 58, ['#8a7a96', '#4a3e56', '#241c2c']); g.beginPath(); g.ellipse(cx, cy, 26, 22, 0, 0, TAU); g.fill();
  g.strokeStyle = '#1a1420'; g.lineWidth = 2; g.stroke();
  vents(g, cx - 14, cy - 10, 4, C, 28, 2.5, 6);
  claw(g, cx, cy - 6, cx, cy - 32, 0, 4, '#b8a8c4', null);
});

/* 4 · COLMENA — nido biológico morado con huevos verdes */
SPR.hive = sprite(300, 260, g => {
  const cx = 150, cy = 120, G2 = '#8aff2a';
  for (let k = 0; k < 7; k++) { const a = Math.PI * (0.05 + k * 0.15), s = k < 3.5 ? 1 : -1; claw(g, cx + Math.cos(Math.PI - a) * 110, cy - Math.sin(a) * 70, cx + Math.cos(Math.PI - a) * 146, cy - Math.sin(a) * 118, 14 * (k % 2 ? 1 : -1), 9, '#5a3a5e', G2); }
  for (const s of [-1, 1]) { claw(g, cx + s * 110, cy + 40, cx + s * 140, cy + 120, s * -20, 10, '#5a3a5e', G2); }
  g.shadowColor = G2; g.shadowBlur = 16; g.fillStyle = '#3a2440'; g.beginPath(); g.ellipse(cx, cy, 138, 98, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 20, 0, 220, ['#7a5a80', '#3a2440', '#1e1224']); g.beginPath(); g.ellipse(cx, cy, 136, 96, 0, 0, TAU); g.fill();
  g.strokeStyle = '#a07aa8'; g.lineWidth = 2; g.stroke();
  for (const [x, y, r] of [[-80, -40, 26], [80, -40, 26], [-96, 20, 20], [96, 20, 20], [-50, 60, 18], [50, 60, 18]]) {
    g.fillStyle = radial(g, cx + x, cy + y, r, [[0, '#eaffb0'], [0.5, '#6ad020'], [1, '#1a3a08']]); g.beginPath(); g.arc(cx + x, cy + y, r, 0, TAU); g.fill();
    g.strokeStyle = '#3a2440'; g.lineWidth = 3; g.stroke();
    g.fillStyle = 'rgba(30,60,10,0.6)'; for (let e = 0; e < 5; e++) { g.beginPath(); g.ellipse(cx + x + rand(-r / 2, r / 2), cy + y + rand(-r / 2, r / 2), 3, 4, 0, 0, TAU); g.fill(); }
  }
  g.fillStyle = '#120a14'; g.beginPath(); g.arc(cx, cy, 50, 0, TAU); g.fill();
  g.fillStyle = radial(g, cx, cy, 46, [[0, '#f0ffb0'], [0.4, '#8aff2a'], [1, '#1a4a08']]); g.beginPath(); g.arc(cx, cy, 44, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(20,40,5,0.85)'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy - 24); g.lineTo(cx, cy + 20);
  for (const s of [-1, 1]) { g.moveTo(cx, cy - 6); g.quadraticCurveTo(cx + s * 20, cy - 20, cx + s * 26, cy - 34); g.moveTo(cx, cy + 4); g.quadraticCurveTo(cx + s * 22, cy + 6, cx + s * 28, cy + 24); } g.stroke();
  g.fillStyle = '#1e1224'; g.beginPath(); g.arc(cx, cy - 26, 7, 0, TAU); g.fill();
  claw(g, cx, cy + 90, cx, cy + 134, 0, 12, '#5a3a5e', G2);
});
SPR.pod = sprite(76, 76, g => {
  g.fillStyle = '#3a2440'; g.beginPath(); g.ellipse(38, 38, 34, 36, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, 34, 32, 32, [[0, '#f0ffb0'], [0.4, '#8aff2a'], [0.85, '#2a6a10'], [1, '#1a3a08']]); g.beginPath(); g.ellipse(38, 38, 28, 31, 0, 0, TAU); g.fill();
  g.fillStyle = 'rgba(30,70,10,0.7)'; for (const [x, y] of [[30, 28], [44, 30], [36, 44], [26, 46], [48, 46]]) { g.beginPath(); g.ellipse(x, y, 5, 6, 0, 0, TAU); g.fill(); }
  g.strokeStyle = '#a07aa8'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(38, 38, 33, 35, 0, 0, TAU); g.stroke();
});

/* 5 · GOLIAT — bestia mantarraya morada con garras y fauces */
SPR.goliath = sprite(300, 210, g => {
  const cx = 150, cy = 100, V = '#c86bff';
  const wing = mirror(cx, [cx, 30, cx + 50, 8, cx + 110, 0, cx + 148, 30, cx + 120, 40, cx + 100, 90, cx + 60, 110, cx + 30, 150, cx, 160]);
  g.shadowColor = V; g.shadowBlur = 16; g.fillStyle = '#3a2e48'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 0, 0, 160, ['#8a7a9a', '#4a3e5a', '#241c30']); poly(g, wing); g.fill();
  g.strokeStyle = '#1a1424'; g.lineWidth = 2; g.stroke();
  for (const s of [-1, 1]) {
    g.save(); g.globalAlpha = 0.7; g.fillStyle = lg(g, cx + s * 60, 0, cx + s * 140, 0, ['rgba(200,107,255,0.2)', 'rgba(230,160,255,0.7)']); poly(g, [cx + s * 70, 30, cx + s * 140, 32, cx + s * 110, 80, cx + s * 80, 70]); g.fill(); g.restore();
    crack(g, V, cx + s * 105, 50, 3, 12);
    for (const [x, y] of [[50, 30], [80, 50], [40, 70]]) { g.fillStyle = radial(g, cx + s * x, y, 7, [[0, '#ffffff'], [0.4, V], [1, 'rgba(120,0,255,0)']]); g.beginPath(); g.ellipse(cx + s * x, y, 8, 5, 0, 0, TAU); g.fill(); }
    for (let k = 0; k < 4; k++) claw(g, cx + s * (20 + k * 18), 10 + k * 4, cx + s * (16 + k * 20), -8 + k * 4, s * 4, 4, '#a898b8', null);
  }
  g.fillStyle = '#0e0814'; g.beginPath(); g.ellipse(cx, cy + 20, 34, 30, 0, 0, TAU); g.fill();
  g.fillStyle = '#efe6f4'; for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; const x = cx + Math.cos(a) * 30, y = cy + 20 + Math.sin(a) * 26; poly(g, [x, y, x - Math.cos(a) * 12 + Math.sin(a) * 4, y - Math.sin(a) * 12 - Math.cos(a) * 4, x - Math.cos(a) * 12 - Math.sin(a) * 4, y - Math.sin(a) * 12 + Math.cos(a) * 4]); g.fill(); }
  g.fillStyle = radial(g, cx, cy + 20, 14, [[0, '#ffffff'], [0.5, 'rgba(200,107,255,0.6)'], [1, 'rgba(80,0,160,0)']]); g.beginPath(); g.arc(cx, cy + 20, 14, 0, TAU); g.fill();
  claw(g, cx, 150, cx, 206, 0, 8, '#4a3e5a', V);
});
SPR.gfist = sprite(96, 116, g => {
  const V = '#c86bff';
  g.fillStyle = lg(g, 30, 0, 66, 0, ['#4a3e5a', '#8a7a9a', '#4a3e5a']); rr(g, 34, 0, 28, 50, 8); g.fill();
  claw(g, 30, 44, 6, 112, -14, 10, '#9a8aaa', V); claw(g, 48, 44, 48, 116, 0, 11, '#b0a0c0', V); claw(g, 66, 44, 90, 112, 14, 10, '#9a8aaa', V);
  g.fillStyle = radial(g, 48, 48, 14, [[0, '#ffffff'], [0.4, V], [1, 'rgba(120,0,255,0)']]); g.beginPath(); g.arc(48, 48, 14, 0, TAU); g.fill();
});

/* 6 · ARÁCNIDO — calavera biomecánica con costillas incandescentes */
SPR.spider = sprite(190, 240, g => {
  const cx = 95, O = '#ff8a2b';
  g.shadowColor = O; g.shadowBlur = 14; g.fillStyle = '#2a2024'; g.beginPath(); g.ellipse(cx, 70, 58, 62, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.fillStyle = '#1a1014'; g.beginPath(); g.ellipse(cx, 70, 56, 60, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, cx, 70, 40, [[0, '#fff6c0'], [0.35, '#ff8a2b'], [0.8, '#8a1a10'], [1, 'rgba(60,0,0,0)']]); g.beginPath(); g.arc(cx, 70, 40, 0, TAU); g.fill();
  g.strokeStyle = '#c8bca8'; g.lineWidth = 5;
  for (let k = 0; k < 6; k++) { const y = 22 + k * 18; g.beginPath(); g.moveTo(cx - 54 + Math.abs(k - 2.5) * 6, y); g.quadraticCurveTo(cx, y - 10, cx + 54 - Math.abs(k - 2.5) * 6, y); g.stroke(); }
  g.fillStyle = '#c8bca8'; g.fillRect(cx - 4, 10, 8, 120);
  for (const s of [-1, 1]) { g.fillStyle = '#3a3036'; rr(g, cx + s * 40 - 8, 40, 16, 50, 4); g.fill(); g.fillStyle = '#ffb02a'; g.fillRect(cx + s * 40 - 6, 82, 12, 4); }
  const sk = mirror(cx, [cx, 120, cx + 40, 128, cx + 52, 160, cx + 44, 196, cx + 22, 222, cx, 228]);
  g.fillStyle = lg(g, 0, 120, 0, 228, ['#e8dcc8', '#a89c88', '#5a5048']); poly(g, sk); g.fill();
  g.strokeStyle = '#2a2024'; g.lineWidth = 2; g.stroke();
  crack(g, 'rgba(60,40,30,0.8)', cx - 20, 150, 2, 10); crack(g, 'rgba(60,40,30,0.8)', cx + 22, 146, 2, 10);
  for (const s of [-1, 1]) { g.fillStyle = '#1a0a08'; g.beginPath(); g.ellipse(cx + s * 20, 168, 13, 10, s * 0.4, 0, TAU); g.fill(); eye(g, cx + s * 20, 168, 8, 6, 'rgba(255,120,0,0.8)'); claw(g, cx + s * 40, 140, cx + s * 70, 120, s * 6, 6, '#e8dcc8', null); }
  g.fillStyle = '#1a0a08'; g.beginPath(); g.ellipse(cx, 206, 26, 14, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, cx, 206, 22, [[0, '#ffffff'], [0.3, '#ffb02a'], [1, 'rgba(255,80,0,0)']]); g.beginPath(); g.ellipse(cx, 206, 22, 11, 0, 0, TAU); g.fill();
  g.fillStyle = '#e8dcc8'; for (let k = -3; k <= 3; k++) { poly(g, [cx + k * 7 - 3, 196, cx + k * 7 + 3, 196, cx + k * 7, 210]); g.fill(); }
  for (const s of [-1, 1]) claw(g, cx + s * 30, 210, cx + s * 22, 240, s * 6, 6, '#e8dcc8', O);
});

/* 7 · TORMENTA — estación anular dorada con núcleo solar y cuchillas */
SPR.storm = sprite(300, 300, g => {
  const c = 150, Y = '#ffc83a';
  for (const [x, y] of [[-92, -92], [92, -92], [-92, 92], [92, 92]]) {
    const a = Math.atan2(y, x);
    g.save(); g.translate(c + x, c + y); g.rotate(a);
    g.fillStyle = lg(g, 0, -10, 0, 10, ['#fff0c0', '#c8901a']); poly(g, [-10, -7, 46, -2, 56, 0, 46, 2, -10, 7]); g.fill();
    g.restore();
  }
  g.shadowColor = Y; g.shadowBlur = 18; g.strokeStyle = '#1e1a16'; g.lineWidth = 34; g.beginPath(); g.arc(c, c, 100, 0, TAU); g.stroke(); g.shadowBlur = 0;
  g.strokeStyle = '#3a342c'; g.lineWidth = 26; g.stroke();
  g.strokeStyle = Y; g.lineWidth = 2; g.beginPath(); g.arc(c, c, 116, 0, TAU); g.stroke(); g.beginPath(); g.arc(c, c, 84, 0, TAU); g.stroke();
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; g.fillStyle = 'rgba(255,200,58,0.85)'; g.fillRect(c + Math.cos(a) * 100 - 3, c + Math.sin(a) * 100 - 2, 6, 4); }
  for (const [x, y] of [[-92, -92], [92, -92], [-92, 92], [92, 92]]) {
    g.fillStyle = '#2a241c'; g.beginPath(); g.arc(c + x, c + y, 20, 0, TAU); g.fill();
    g.strokeStyle = Y; g.lineWidth = 3; for (const r of [18, 11]) { g.beginPath(); g.arc(c + x, c + y, r, 0, TAU); g.stroke(); }
  }
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; g.strokeStyle = '#d4a830'; g.lineWidth = 5; g.beginPath(); g.moveTo(c + Math.cos(a) * 40, c + Math.sin(a) * 40); g.lineTo(c + Math.cos(a) * 86, c + Math.sin(a) * 86); g.stroke(); }
  g.fillStyle = radial(g, c, c, 60, [[0, '#ffffff'], [0.25, '#ffe08a'], [0.55, '#ff8a1a'], [1, 'rgba(120,40,0,0)']]); g.beginPath(); g.arc(c, c, 60, 0, TAU); g.fill();
  g.fillStyle = lg(g, c - 12, 0, c + 12, 0, ['#c8901a', '#fff6c0', '#c8901a']);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; g.save(); g.translate(c, c); g.rotate(a); poly(g, [0, -8, 44, 0, 0, 8]); g.fill(); g.restore(); }
  g.fillStyle = '#fff6c0'; g.beginPath(); g.arc(c, c, 10, 0, TAU); g.fill();
});

/* 8 · HIDRA — cuerpo plateado con cabezas de dragón */
SPR.hydra = sprite(280, 180, g => {
  const cx = 140, Gn = '#2bff8a', B = '#4a8aff';
  for (const s of [-1, 1]) { claw(g, cx + s * 70, 60, cx + s * 138, 10, s * 10, 10, '#c0c4d0', Gn); claw(g, cx + s * 100, 100, cx + s * 140, 150, s * -10, 8, '#c0c4d0', B); }
  g.shadowColor = Gn; g.shadowBlur = 16; g.fillStyle = '#3a4048'; g.beginPath(); g.ellipse(cx, 80, 128, 68, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 10, 0, 150, ['#d0d4e0', '#7a808c', '#3a4048']); g.beginPath(); g.ellipse(cx, 80, 126, 66, 0, 0, TAU); g.fill();
  g.strokeStyle = '#1e2228'; g.lineWidth = 2; g.stroke();
  for (const s of [-1, 1]) { vents(g, cx + s * 70 - 10, 64, 4, Gn, 20, 3, 8); g.fillStyle = radial(g, cx + s * 40, 96, 12, [[0, '#ffffff'], [0.4, B], [1, 'rgba(0,60,255,0)']]); g.beginPath(); g.arc(cx + s * 40, 96, 12, 0, TAU); g.fill(); }
  g.save(); g.shadowColor = Gn; g.shadowBlur = 12; g.fillStyle = Gn; poly(g, [cx, 50, cx + 12, 80, cx, 110, cx - 12, 80]); g.fill(); g.restore();
  g.strokeStyle = 'rgba(43,255,138,0.6)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, 80, 40, 0, TAU); g.stroke();
  for (let k = -2; k <= 2; k++) claw(g, cx + k * 22, 24, cx + k * 26, 0 - (k === 0 ? 12 : 0), k * 2, 5, '#d0d4e0', null);
});
function hydraHead2(glow) {
  return sprite(84, 96, g => {
    const cx = 42;
    for (const s of [-1, 1]) claw(g, cx + s * 20, 22, cx + s * 40, 0, s * 6, 5, '#c0c4d0', glow);
    const hd = mirror(cx, [cx, 4, cx + 20, 12, cx + 30, 40, cx + 22, 70, cx + 10, 92]);
    g.shadowColor = glow; g.shadowBlur = 12; g.fillStyle = '#5a6068'; poly(g, hd); g.fill(); g.shadowBlur = 0;
    g.fillStyle = lg(g, 0, 4, 0, 92, ['#e0e4ee', '#8a909c', '#3a4048']); poly(g, hd); g.fill();
    g.strokeStyle = '#1e2228'; g.lineWidth = 1.5; g.stroke();
    for (const s of [-1, 1]) { g.fillStyle = radial(g, cx + s * 13, 46, 7, [[0, '#ffffff'], [0.4, glow], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.ellipse(cx + s * 13, 46, 7, 4, s * 0.4, 0, TAU); g.fill(); }
    g.fillStyle = '#0a1210'; g.beginPath(); g.ellipse(cx, 80, 12, 12, 0, 0, TAU); g.fill();
    g.fillStyle = radial(g, cx, 82, 12, [[0, '#ffffff'], [0.4, glow], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(cx, 82, 12, 0, TAU); g.fill();
    g.fillStyle = '#eef2f8'; for (let k = -2; k <= 2; k++) { poly(g, [cx + k * 5 - 2, 70, cx + k * 5 + 2, 70, cx + k * 5, 78]); g.fill(); }
  });
}
SPR.hh_fire = hydraHead2('#ff8a2b'); SPR.hh_ice = hydraHead2('#4a8aff'); SPR.hh_poison = hydraHead2('#2bff8a');

/* 9 · FANTASMA — nave de cristal con fragmentos flotantes */
SPR.phantom = sprite(250, 150, g => {
  const cx = 125, V = '#b06bff', Cy = '#6ad8ff';
  for (const [x, y, a] of [[-112, 24, -0.4], [112, 24, 0.4], [-92, 100, -2.4], [92, 100, 2.4], [-40, 6, -0.2], [40, 6, 0.2]]) {
    g.save(); g.translate(cx + x, y); g.rotate(a); g.shadowColor = V; g.shadowBlur = 10;
    g.fillStyle = lg(g, -6, -18, 6, 18, ['#e8f8ff', Cy, V]); poly(g, [0, -18, 7, 0, 0, 18, -7, 0]); g.fill(); g.restore();
  }
  const hull = mirror(cx, [cx, 148, cx + 16, 110, cx + 40, 100, cx + 70, 70, cx + 110, 54, cx + 70, 46, cx + 46, 22, cx + 20, 30, cx, 10]);
  g.shadowColor = V; g.shadowBlur = 18; g.fillStyle = '#c8c0d8'; poly(g, hull); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 10, 0, 148, ['#f4f0fa', '#b0a8c4', '#6a6080']); poly(g, hull); g.fill();
  g.strokeStyle = '#d4a830'; g.lineWidth = 2; g.stroke();
  for (const s of [-1, 1]) {
    g.save(); g.shadowColor = Cy; g.shadowBlur = 10;
    g.fillStyle = lg(g, cx + s * 20, 40, cx + s * 90, 80, ['rgba(232,248,255,0.95)', 'rgba(176,107,255,0.85)']);
    poly(g, [cx + s * 18, 44, cx + s * 92, 58, cx + s * 54, 70, cx + s * 22, 90]); g.fill(); g.restore();
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx + s * 24, 52); g.lineTo(cx + s * 80, 60); g.moveTo(cx + s * 30, 70); g.lineTo(cx + s * 56, 66); g.stroke();
    claw(g, cx + s * 60, 90, cx + s * 74, 130, s * 6, 6, '#e8e0f0', '#d4a830');
  }
  g.save(); g.shadowColor = V; g.shadowBlur = 12; g.fillStyle = lg(g, 0, 60, 0, 140, ['#ffffff', Cy, V]); poly(g, [cx, 140, cx + 10, 96, cx, 60, cx - 10, 96]); g.fill(); g.restore();
  g.strokeStyle = 'rgba(176,107,255,0.8)'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, 74, 30, 14, 0, 0, TAU); g.stroke();
  g.fillStyle = radial(g, cx, 74, 22, [[0, '#ffffff'], [0.3, '#e0a8ff'], [1, 'rgba(120,0,255,0)']]); g.beginPath(); g.arc(cx, 74, 22, 0, TAU); g.fill();
});

/* 10 · NÚCLEO OMEGA — agujero negro con disco de acreción y placas dentadas */
SPR.omega = sprite(190, 190, g => {
  const c = 95;
  g.fillStyle = radial(g, c, c, 94, [[0, 'rgba(0,0,0,1)'], [0.32, 'rgba(0,0,0,1)'], [0.4, '#ffe08a'], [0.5, '#ff6a1a'], [0.7, 'rgba(200,20,20,0.6)'], [1, 'rgba(60,0,0,0)']]);
  g.beginPath(); g.arc(c, c, 94, 0, TAU); g.fill();
  g.save(); g.translate(c, c); g.scale(1, 0.42);
  for (let i = 0; i < 3; i++) { g.strokeStyle = ['rgba(255,220,140,0.9)', 'rgba(255,120,30,0.7)', 'rgba(255,40,40,0.5)'][i]; g.lineWidth = 6 - i; g.beginPath(); g.arc(0, 0, 50 + i * 14, 0, TAU); g.stroke(); }
  g.restore();
  g.fillStyle = '#000'; g.beginPath(); g.arc(c, c, 30, 0, TAU); g.fill();
  g.strokeStyle = '#ffb02a'; g.lineWidth = 2; g.stroke();
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; g.save(); g.translate(c + Math.cos(a) * 80, c + Math.sin(a) * 80); g.rotate(a + Math.PI / 2); g.fillStyle = '#3a2a2e'; poly(g, [0, -10, 4, 6, -4, 6]); g.fill(); g.restore(); }
});
SPR.oplate = sprite(96, 40, g => {
  g.shadowColor = '#ff2a2a'; g.shadowBlur = 10;
  g.fillStyle = lg(g, 0, 0, 0, 40, ['#5a4a50', '#241a1e']);
  g.beginPath(); g.moveTo(2, 34); g.lineTo(14, 18); g.lineTo(24, 22); g.lineTo(36, 4); g.lineTo(48, 14); g.lineTo(60, 4); g.lineTo(72, 22); g.lineTo(82, 18); g.lineTo(94, 34); g.lineTo(48, 26); g.closePath(); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ff3a3a'; g.lineWidth = 1.5; g.stroke();
  glowLine(g, '#ff3a3a', 1.2, [20, 28, 36, 20, 48, 24, 60, 18, 76, 28]);
});

for (const k of ['boss', 'colossus', 'vhead', 'vseg', 'hive', 'pod', 'goliath', 'gfist', 'spider', 'storm', 'hydra', 'hh_fire', 'hh_ice', 'hh_poison', 'phantom', 'omega']) {
  SHD[k] = tint(SPR[k], 'rgba(0,0,0,0.45)'); FL[k] = tint(SPR[k], 'rgba(255,255,255,0.85)');
}
