'use strict';
/* =====================================================================
   ESCENARIOS — un fondo, clima y partículas propios para cada sector
   ===================================================================== */
function blob(g, x, y, rx, ry, stops) {
  g.save(); g.translate(x, y); g.scale(1, ry / rx);
  g.fillStyle = radial(g, 0, 0, rx, stops); g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
}
const inY = (m = 40, h = 0) => rand(m, CH - m - h);

/* ---------- 2 · Órbita baja: estación espacial ---------- */
function genOrbit(g) {
  g.fillStyle = '#02030a'; g.fillRect(0, 0, W, CH);
  for (let i = 0; i < 2; i++) blob(g, rand(120, W - 120), inY(150), 140, 110, [[0, pick(['rgba(124,77,255,0.18)', 'rgba(255,43,214,0.13)', 'rgba(0,229,255,0.12)'])], [1, 'rgba(0,0,0,0)']]);
  for (let i = 0; i < 280; i++) { g.fillStyle = `rgba(255,255,255,${rand(0.15, 0.9)})`; const s = Math.random() < 0.08 ? 2 : 1; g.fillRect(rand(0, W), rand(0, CH), s, s); }
  const sx = W / 2 - 18;
  g.fillStyle = '#1a1e2a'; g.fillRect(sx, 0, 36, CH);
  g.strokeStyle = '#5a6480'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx, 0); g.lineTo(sx, CH); g.moveTo(sx + 36, 0); g.lineTo(sx + 36, CH); g.stroke();
  g.lineWidth = 1.5; for (let y = 0; y < CH; y += 32) { g.beginPath(); g.moveTo(sx, y); g.lineTo(sx + 36, y + 32); g.moveTo(sx + 36, y); g.lineTo(sx, y + 32); g.stroke(); }
  for (let k = 0; k < 2; k++) {
    const y = inY(70, 60), s = k ? 1 : -1, x0 = s > 0 ? sx + 36 : sx;
    g.fillStyle = '#3a4258'; g.fillRect(Math.min(x0, x0 + s * 40), y + 26, 40, 8);
    for (let i = 0; i < 3; i++) {
      const px = s > 0 ? x0 + 40 + i * 62 : x0 - 40 - (i + 1) * 62;
      g.fillStyle = '#10284a'; g.fillRect(px, y, 58, 60);
      g.strokeStyle = 'rgba(90,170,255,0.55)'; g.lineWidth = 1; for (let q = 1; q < 4; q++) { g.beginPath(); g.moveTo(px + q * 14.5, y); g.lineTo(px + q * 14.5, y + 60); g.stroke(); }
      g.beginPath(); g.moveTo(px, y + 30); g.lineTo(px + 58, y + 30); g.stroke();
    }
  }
  for (let k = 0; k < 3; k++) {
    const w = rand(70, 120), h = rand(50, 90), s = Math.random() < 0.5 ? -1 : 1, x = s > 0 ? sx + 60 + rand(0, 120) : sx - 24 - w - rand(0, 120), y = inY(30, h);
    g.fillStyle = '#3a4258'; g.fillRect(s > 0 ? sx + 36 : x + w, y + h / 2 - 5, s > 0 ? x - sx - 36 : sx - x - w, 10);
    g.fillStyle = lg(g, x, y, x, y + h, ['#5a6480', '#1c2030']); rr(g, x, y, w, h, 14); g.fill();
    g.strokeStyle = 'rgba(0,229,255,0.5)'; g.lineWidth = 1.5; g.stroke();
    for (let wy = y + 12; wy < y + h - 8; wy += 12) for (let wx = x + 12; wx < x + w - 8; wx += 14) { g.fillStyle = Math.random() < 0.6 ? 'rgba(255,230,160,0.7)' : 'rgba(0,229,255,0.25)'; g.fillRect(wx, wy, 6, 4); }
    lightDot(g, x + 6, y + 6, pick(['#ff3355', '#00e5ff'])); lightDot(g, x + w - 6, y + h - 6, '#ffffff');
  }
  if (Math.random() < 0.5) { const cx = rand(90, W - 90), cy = inY(80); g.strokeStyle = '#5a6480'; g.lineWidth = 10; g.beginPath(); g.arc(cx, cy, 50, 0, TAU); g.stroke(); g.strokeStyle = 'rgba(255,184,0,0.6)'; g.lineWidth = 2; g.stroke(); lightDot(g, cx, cy - 50, '#ffb800'); }
}
/* ---------- 3 · Zona cuarentena: ciudad en ruinas ---------- */
function genRuins(g) {
  g.fillStyle = '#0b0f0b'; g.fillRect(0, 0, W, CH);
  for (const [x, w] of ROADV) {
    g.fillStyle = '#131813'; g.fillRect(x, 0, w, CH);
    g.fillStyle = 'rgba(180,200,120,0.12)'; for (let y = 0; y < CH; y += 32) if (Math.random() < 0.6) g.fillRect(x + w / 2 - 1, y, 2, 14);
  }
  for (let i = 0; i < 26; i++) {
    const w = rand(30, 90), h = rand(30, 90), x = rand(0, W - w), y = inY(10, h);
    if (ROADV.some(([rx, rw]) => x + w > rx && x < rx + rw)) continue;
    g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(x + 5, y + 5, w, h);
    g.fillStyle = pick(['#232a22', '#2a2f26', '#1e241e']); g.fillRect(x, y, w, h);
    g.fillStyle = '#0b0f0b'; poly(g, [x + w, y, x + w, y + h * rand(0.2, 0.6), x + w * rand(0.4, 0.8), y]); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.05)'; g.fillRect(x, y, w, 2);
    for (let r = 0; r < 6; r++) { g.fillStyle = '#3a4036'; g.fillRect(x + rand(0, w), y + rand(0, h), rand(2, 6), rand(2, 6)); }
  }
  for (let i = 0; i < 4; i++) { const x = rand(30, W - 30), y = inY(50); blob(g, x, y, 34, 24, [[0, 'rgba(0,0,0,0.85)'], [0.7, 'rgba(30,25,15,0.6)'], [1, 'rgba(0,0,0,0)']]); }
  for (let i = 0; i < 5; i++) { const x = rand(30, W - 30), y = inY(40); blob(g, x, y, rand(18, 32), rand(12, 22), [[0, 'rgba(160,255,60,0.55)'], [0.6, 'rgba(60,160,20,0.3)'], [1, 'rgba(0,0,0,0)']]); if (Math.random() < 0.5) lightDot(g, x, y, '#39ff88'); }
  for (let i = 0; i < 3; i++) { const x = rand(20, W - 70), y = inY(20, 10); for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#1a1a1a' : '#e0b000'; g.fillRect(x + k * 10, y, 10, 8); } }
}
/* ---------- 4 · Desierto de cristal ---------- */
function genDesert(g) {
  g.fillStyle = '#3a2814'; g.fillRect(0, 0, W, CH);
  for (let k = 0; k < 7; k++) {
    const y0 = inY(60), a = rand(1, 2.5), ph = rand(0, TAU), light = k % 2;
    g.fillStyle = light ? 'rgba(255,200,130,0.09)' : 'rgba(0,0,0,0.14)'; g.beginPath();
    for (let x = 0; x <= W; x += 10) g.lineTo(x, y0 + Math.sin(x / W * TAU * a + ph) * 22);
    for (let x = W; x >= 0; x -= 10) g.lineTo(x, y0 + 34 + Math.sin(x / W * TAU * a + ph) * 18);
    g.closePath(); g.fill();
  }
  g.strokeStyle = 'rgba(255,220,160,0.08)'; g.lineWidth = 1;
  for (let i = 0; i < 120; i++) { const x = rand(0, W), y = inY(6); g.beginPath(); g.arc(x, y, rand(6, 14), Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  g.strokeStyle = 'rgba(30,18,8,0.5)'; g.lineWidth = 3; g.setLineDash([6, 4]);
  for (const x of [128, 146]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, CH); g.stroke(); } g.setLineDash([]);
  for (let i = 0; i < 6; i++) blob(g, rand(20, W - 20), inY(30), rand(10, 24), rand(8, 16), [[0, '#5a4028'], [0.7, '#2a1c0e'], [1, 'rgba(0,0,0,0)']]);
  for (let i = 0; i < 4; i++) {
    const cx = rand(40, W - 40), cy = inY(50), col = pick(['#00e5ff', '#ff2bd6', '#c86bff']);
    blob(g, cx, cy, 40, 40, [[0, col + '55'], [1, 'rgba(0,0,0,0)']]);
    for (let k = 0; k < ri(3, 6); k++) {
      const a = rand(0, TAU), l = rand(14, 30), w2 = rand(4, 8), x = cx + Math.cos(a) * 6, y = cy + Math.sin(a) * 6;
      g.fillStyle = lg(g, x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, ['#ffffff', col]);
      poly(g, [x - Math.sin(a) * w2, y + Math.cos(a) * w2, x + Math.cos(a) * l, y + Math.sin(a) * l, x + Math.sin(a) * w2, y - Math.cos(a) * w2]); g.fill();
    }
    lightDot(g, cx, cy, col);
  }
  if (Math.random() < 0.6) { const x = rand(200, W - 80), y = inY(60, 40); g.fillStyle = '#4a3420'; g.fillRect(x, y, 40, 40); g.strokeStyle = '#ffb800'; g.globalAlpha = 0.6; g.lineWidth = 1.5; g.strokeRect(x + 6, y + 6, 28, 28); g.beginPath(); g.moveTo(x + 20, y + 6); g.lineTo(x + 20, y + 34); g.moveTo(x + 6, y + 20); g.lineTo(x + 34, y + 20); g.stroke(); g.globalAlpha = 1; }
}
/* ---------- 5 · Distrito industrial ---------- */
function genIndustry(g) {
  g.fillStyle = '#14161c'; g.fillRect(0, 0, W, CH);
  g.strokeStyle = 'rgba(255,255,255,0.04)'; g.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, CH); g.stroke(); }
  for (let y = 0; y < CH; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.fillStyle = '#0a0b0e'; g.fillRect(112, 0, 48, CH);
  g.strokeStyle = 'rgba(255,184,0,0.35)'; g.lineWidth = 2;
  for (let y = 0; y < CH; y += 32) { g.beginPath(); g.moveTo(120, y + 12); g.lineTo(136, y); g.lineTo(152, y + 12); g.stroke(); }
  g.fillStyle = '#20140a'; g.fillRect(372, 0, 64, CH);
  g.fillStyle = lg(g, 380, 0, 428, 0, ['#ff5a1f', '#ffd23f', '#ff5a1f']); g.fillRect(380, 0, 48, CH);
  g.fillStyle = 'rgba(255,255,255,0.25)'; for (let y = 0; y < CH; y += 40) g.fillRect(398, y + rand(0, 20), 12, 4);
  for (let k = 0; k < 3; k++) {
    const y = inY(30, 20), c = pick(['#5a6480', '#6a4a30', '#3a5a50']);
    g.fillStyle = '#0a0b0e'; g.fillRect(0, y + 4, W, 16);
    g.fillStyle = lg(g, 0, y, 0, y + 16, [c, '#1a1c22']); g.fillRect(0, y, W, 14);
    for (let x = rand(10, 60); x < W; x += rand(60, 120)) { g.fillStyle = '#8a90a8'; g.fillRect(x, y - 3, 8, 20); }
  }
  for (let i = 0; i < 4; i++) {
    const x = pick([rand(30, 90), rand(190, 340), rand(460, 510)]), y = inY(50), r = rand(26, 40);
    g.fillStyle = 'rgba(0,0,0,0.6)'; g.beginPath(); g.arc(x + 5, y + 5, r, 0, TAU); g.fill();
    g.fillStyle = radial(g, x - r * 0.3, y - r * 0.3, r * 1.3, [[0, '#7a8498'], [1, '#22262e']]); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,184,0,0.5)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r * 0.65, 0, TAU); g.stroke();
    if (Math.random() < 0.5) { g.fillStyle = '#05060a'; g.beginPath(); g.arc(x, y, r * 0.35, 0, TAU); g.fill(); lightDot(g, x, y, '#ff5a1f', 8); }
    else lightDot(g, x + r * 0.7, y - r * 0.7, '#ffb800');
  }
}
/* ---------- 6 · Cavernas profundas ---------- */
function genCaves(g) {
  g.fillStyle = '#0a0810'; g.fillRect(0, 0, W, CH);
  for (let i = 0; i < 70; i++) blob(g, rand(0, W), inY(30), rand(20, 60), rand(15, 45), [[0, pick(['rgba(70,50,80,0.5)', 'rgba(40,30,50,0.6)', 'rgba(90,70,60,0.35)'])], [1, 'rgba(0,0,0,0)']]);
  g.fillStyle = '#04070e'; g.fillRect(106, 0, 60, CH);
  g.fillStyle = lg(g, 112, 0, 160, 0, ['rgba(0,120,255,0.25)', 'rgba(0,229,255,0.55)', 'rgba(0,120,255,0.25)']); g.fillRect(112, 0, 48, CH);
  for (let i = 0; i < 10; i++) { const x = rand(20, W - 20), y = inY(20); blob(g, x, y, rand(10, 20), rand(10, 20), [[0, '#5a4a5a'], [0.6, '#241c2a'], [1, 'rgba(0,0,0,0)']]); }
  for (let i = 0; i < 7; i++) {
    const cx = rand(30, W - 30), cy = inY(40), col = pick(['#00e5ff', '#c86bff', '#39ff88']);
    for (let k = 0; k < ri(3, 7); k++) { const x = cx + rand(-18, 18), y = cy + rand(-14, 14), r = rand(3, 7); blob(g, x, y, r * 2.4, r * 2.4, [[0, '#ffffff'], [0.25, col], [1, 'rgba(0,0,0,0)']]); }
    if (Math.random() < 0.6) lightDot(g, cx, cy, col);
  }
  for (let i = 0; i < 3; i++) { const x = rand(200, W - 40), y = inY(40), col = '#c86bff'; for (let k = 0; k < 4; k++) { const a = rand(0, TAU), l = rand(12, 24); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } }
}
/* ---------- 7 · Océano tormenta ---------- */
function genOcean(g) {
  g.fillStyle = lg(g, 0, 0, W, CH, ['#04182a', '#06223a']); g.fillRect(0, 0, W, CH);
  for (let i = 0; i < 6; i++) blob(g, rand(40, W - 40), inY(80), rand(60, 110), rand(40, 70), [[0, 'rgba(0,10,20,0.5)'], [1, 'rgba(0,0,0,0)']]);
  g.strokeStyle = 'rgba(140,210,255,0.16)'; g.lineWidth = 1.5;
  for (let i = 0; i < 140; i++) { const x = rand(0, W), y = inY(8), l = rand(12, 30); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 5, x + l, y); g.stroke(); }
  g.fillStyle = 'rgba(220,240,255,0.15)'; for (let i = 0; i < 40; i++) g.fillRect(rand(0, W), inY(4), rand(4, 12), 2);
  if (Math.random() < 0.7) {
    const x = rand(180, W - 160), y = inY(40, 120);
    for (const [px, py] of [[0, 0], [110, 0], [0, 110], [110, 110]]) { g.fillStyle = '#1a1c22'; g.beginPath(); g.arc(x + px + 8, y + py + 8, 9, 0, TAU); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(x + 8, y + 8, 126, 126);
    g.fillStyle = lg(g, x, y, x + 126, y + 126, ['#5a6070', '#2a2e38']); g.fillRect(x, y, 126, 126);
    g.strokeStyle = '#ffb800'; g.lineWidth = 2; g.strokeRect(x + 4, y + 4, 118, 118);
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.arc(x + 40, y + 40, 24, 0, TAU); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.font = `800 20px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', x + 40, y + 41);
    g.fillStyle = '#c03020'; g.fillRect(x + 76, y + 70, 36, 44); g.fillStyle = '#ffb800'; g.fillRect(x + 70, y + 20, 46, 8);
    lightDot(g, x + 4, y + 4, '#ff3355'); lightDot(g, x + 122, y + 122, '#ff3355'); lightDot(g, x + 122, y + 4, '#ffffff');
  }
  for (let i = 0; i < 3; i++) lightDot(g, rand(20, W - 20), inY(20), pick(['#ff3355', '#39ff88']));
}
/* ---------- 8 · Pantano tóxico ---------- */
function genSwamp(g) {
  g.fillStyle = '#0b1a10'; g.fillRect(0, 0, W, CH);
  for (let i = 0; i < 14; i++) blob(g, rand(0, W), inY(60), rand(40, 90), rand(30, 60), [[0, 'rgba(30,70,40,0.6)'], [1, 'rgba(0,0,0,0)']]);
  g.fillStyle = '#3a2a16'; g.fillRect(126, 0, 22, CH);
  g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 1; for (let y = 0; y < CH; y += 16) { g.beginPath(); g.moveTo(126, y); g.lineTo(148, y); g.stroke(); }
  for (let i = 0; i < 26; i++) { const x = rand(10, W - 10), y = inY(14), r = rand(5, 11); g.fillStyle = pick(['#2a6a2a', '#3a7a30', '#1f5a24']); g.beginPath(); g.arc(x, y, r, 0.3, TAU - 0.2); g.lineTo(x, y); g.closePath(); g.fill(); }
  for (let i = 0; i < 9; i++) {
    const x = pick([rand(20, 110), rand(170, W - 20)]), y = inY(40);
    g.strokeStyle = '#2a1e10'; g.lineWidth = 2.5; for (let k = 0; k < 6; k++) { const a = rand(0, TAU); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30); g.stroke(); }
    blob(g, x, y, rand(24, 36), rand(24, 36), [[0, '#2f6a2a'], [0.6, '#173a18'], [1, 'rgba(10,30,10,0)']]);
  }
  for (let i = 0; i < 8; i++) { const x = rand(20, W - 20), y = inY(20); blob(g, x, y, 8, 8, [[0, '#eaffb0'], [0.3, '#7aff3a'], [1, 'rgba(0,0,0,0)']]); if (Math.random() < 0.4) lightDot(g, x, y, '#39ff88'); }
}
/* ---------- 9 · Tundra fantasma ---------- */
function genTundra(g) {
  g.fillStyle = '#1a2430'; g.fillRect(0, 0, W, CH);
  for (let i = 0; i < 16; i++) blob(g, rand(0, W), inY(50), rand(40, 100), rand(30, 70), [[0, 'rgba(120,150,180,0.28)'], [1, 'rgba(0,0,0,0)']]);
  g.fillStyle = '#2c3a4a'; g.fillRect(380, 0, 48, CH);
  g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 2; g.setLineDash([8, 6]); for (const x of [392, 416]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, CH); g.stroke(); } g.setLineDash([]);
  for (let k = 0; k < 2; k++) {
    const x = rand(80, 300), y = inY(80), rx = rand(50, 80), ry = rand(35, 60);
    blob(g, x, y, rx, ry, [[0, '#7ab8e0'], [0.8, '#3a6a8a'], [1, 'rgba(30,60,90,0)']]);
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 1;
    for (let c = 0; c < 6; c++) { g.beginPath(); let px = x, py = y; g.moveTo(px, py); for (let s = 0; s < 4; s++) { px += rand(-18, 18); py += rand(-14, 14); g.lineTo(px, py); } g.stroke(); }
  }
  for (let i = 0; i < 22; i++) {
    const x = rand(10, W - 10), y = inY(20), r = rand(9, 16);
    if (x > 370 && x < 438) continue;
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.beginPath(); g.arc(x + 4, y + 4, r, 0, TAU); g.fill();
    g.fillStyle = '#0c1e1a'; g.beginPath(); for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, rr2 = k % 2 ? r * 0.55 : r; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.closePath(); g.fill();
    g.fillStyle = 'rgba(230,245,255,0.75)'; g.beginPath(); g.arc(x - r * 0.2, y - r * 0.2, r * 0.35, 0, TAU); g.fill();
  }
  for (let i = 0; i < 3; i++) lightDot(g, rand(20, W - 20), inY(20), '#9ae8ff');
}
/* ---------- 10 · Sector Omega ---------- */
function genOmega(g) {
  g.fillStyle = '#07020a'; g.fillRect(0, 0, W, CH);
  g.strokeStyle = 'rgba(255,43,106,0.06)'; g.lineWidth = 1;
  for (let x = 0; x < W; x += 30) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, CH); g.stroke(); }
  for (let y = 0; y < CH; y += 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  for (const x of [136, 404]) { g.fillStyle = 'rgba(255,43,106,0.2)'; g.fillRect(x - 10, 0, 20, CH); g.fillStyle = '#ff2b6a'; g.fillRect(x - 2, 0, 4, CH); }
  for (let i = 0; i < 18; i++) {
    let x = Math.round(rand(20, W - 20) / 10) * 10, y = Math.round(inY(30) / 10) * 10;
    g.strokeStyle = pick(['rgba(255,43,106,0.55)', 'rgba(255,43,214,0.45)', 'rgba(255,210,63,0.4)']); g.lineWidth = 2;
    g.beginPath(); g.moveTo(x, y);
    for (let s = 0; s < 5; s++) { if (s % 2) x = clamp(x + rand(-80, 80), 10, W - 10); else y = clamp(y + rand(-60, 60), 20, CH - 20); g.lineTo(x, y); }
    g.stroke(); g.fillStyle = '#ffd0e0'; g.fillRect(x - 3, y - 3, 6, 6);
    if (Math.random() < 0.4) lightDot(g, x, y, '#ff3355');
  }
  for (let i = 0; i < 3; i++) {
    const x = rand(180, 340), y = inY(60), r = rand(30, 46);
    hexPath(g, x, y, r); g.fillStyle = 'rgba(40,10,24,0.9)'; g.fill(); g.strokeStyle = '#ff2b6a'; g.lineWidth = 2; g.stroke();
    hexPath(g, x, y, r * 0.55); g.strokeStyle = 'rgba(255,210,63,0.6)'; g.stroke(); lightDot(g, x, y, '#ff2bd6', 8);
  }
}

/* ---------------- Tabla de escenarios ---------------- */
function makeCloud(col) {
  return sprite(300, 200, g => {
    g.save(); g.translate(150, 100); g.scale(1, 0.66); g.translate(-150, -100);
    g.fillStyle = radial(g, 150, 100, 150, [[0, col], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(150, 100, 150, 0, TAU); g.fill(); g.restore();
  });
}
const THEMES = [
  { gen: null, cloud: null, amb: null, cars: true, lights: true, fog: 'rgba(20,10,40,' },
  { gen: genOrbit, cloud: 'rgba(124,77,255,0.18)', amb: 'stars', cars: false, lights: false, fog: 'rgba(10,6,30,' },
  { gen: genRuins, cloud: 'rgba(80,160,40,0.2)', amb: 'ash', cars: false, lights: true, fog: 'rgba(20,40,10,' },
  { gen: genDesert, cloud: 'rgba(200,150,90,0.2)', amb: 'sand', cars: false, lights: false, fog: 'rgba(90,60,30,' },
  { gen: genIndustry, cloud: 'rgba(40,40,46,0.45)', amb: 'embers', cars: false, lights: true, fog: 'rgba(30,20,10,' },
  { gen: genCaves, cloud: 'rgba(60,20,90,0.25)', amb: 'spores', cars: false, lights: false, fog: 'rgba(10,5,20,' },
  { gen: genOcean, cloud: 'rgba(120,130,150,0.25)', amb: 'rain', cars: false, lights: true, fog: 'rgba(20,30,45,' },
  { gen: genSwamp, cloud: 'rgba(90,200,90,0.16)', amb: 'flies', cars: false, lights: false, fog: 'rgba(10,30,15,' },
  { gen: genTundra, cloud: 'rgba(220,235,255,0.22)', amb: 'snow', cars: false, lights: false, fog: 'rgba(60,80,100,' },
  { gen: genOmega, cloud: 'rgba(255,43,106,0.14)', amb: 'data', cars: false, lights: true, fog: 'rgba(40,0,20,' }
];
let THEME = 0, seamPending = false;
const THEME_CACHE = { 0: CHUNKS };
function makeThemeChunk(i) {
  if (i === 0) return makeChunk();
  const c = document.createElement('canvas'); c.width = W * BG_SS; c.height = CH * BG_SS;
  const g = c.getContext('2d'); g.scale(BG_SS, BG_SS); CUR_BEACONS = [];
  THEMES[i].gen(g);
  c.beacons = CUR_BEACONS; CUR_BEACONS = null;
  return c;
}
function chunksFor(i) {
  const c = THEME_CACHE[i] || (THEME_CACHE[i] = []);
  while (c.length < 4) c.push(makeThemeChunk(i));
  if (!THEMES[i].cloudSpr) THEMES[i].cloudSpr = THEMES[i].cloud ? makeCloud(THEMES[i].cloud) : SPR.cloud;
  return c;
}
function prepareTheme(i) {
  i %= THEMES.length;
  const c = THEME_CACHE[i] || (THEME_CACHE[i] = []);
  const step = () => { if (c.length < 4) { c.push(makeThemeChunk(i)); setTimeout(step, 120); } };
  setTimeout(step, 200);
}
function setTheme(i, instant) {
  i %= THEMES.length;
  const changed = i !== THEME;
  THEME = i; CHUNKS = chunksFor(i);
  for (const k in THEME_CACHE) if (+k !== i && +k !== 0 && +k !== (i + 1) % THEMES.length) delete THEME_CACHE[k];
  if (instant) { tiles = []; clouds = []; AMB.length = 0; updateBG(0); }
  else if (changed) seamPending = true;
}
const themeCloud = () => THEMES[THEME].cloudSpr || SPR.cloud;

/* ---------------- Clima y partículas de ambiente ---------------- */
const AMB = [];
function updateAmbient(dt) {
  const T = THEMES[THEME], kind = T.amb;
  if (kind) {
    const rate = { stars: 30, ash: 14, sand: 18, embers: 16, spores: 8, rain: 60, flies: 6, snow: 26, data: 14 }[kind];
    let n = rate * dt * Q().amb; while (n > 0) { if (Math.random() < n) spawnAmb(kind); n--; }
  }
  for (const a of AMB) { a.t += dt; a.x += a.vx * dt; a.y += a.vy * dt; if (a.k === 'flies' || a.k === 'spores') { a.x += Math.sin(a.t * 2 + a.ph) * 20 * dt; } }
  for (let i = AMB.length - 1; i >= 0; i--) { const a = AMB[i]; if (a.y > H + 20 || a.y < -40 || a.x < -40 || a.x > W + 40 || a.t > a.life) AMB.splice(i, 1); }
  if (AMB.length > 260) AMB.splice(0, AMB.length - 260);
  if (kind === 'rain' && Math.random() < dt * 0.07) { flash = Math.max(flash, 0.35); SFX.thunder(); }
}
function spawnAmb(k) {
  const b = { k, t: 0, life: 12, ph: rand(0, TAU), s: 1 };
  switch (k) {
    case 'stars': Object.assign(b, { x: rand(0, W), y: -10, vx: 0, vy: rand(250, 600), s: rand(1, 2.2) }); break;
    case 'ash': Object.assign(b, { x: rand(0, W), y: -10, vx: rand(-20, 20), vy: rand(40, 90), s: rand(1, 2.5) }); break;
    case 'sand': Object.assign(b, { x: -20, y: rand(0, H), vx: rand(300, 520), vy: rand(20, 60), s: rand(10, 26) }); break;
    case 'embers': Object.assign(b, { x: rand(0, W), y: H + 10, vx: rand(-20, 20), vy: -rand(60, 140), s: rand(1.5, 3), life: rand(3, 8) }); break;
    case 'spores': Object.assign(b, { x: rand(0, W), y: rand(0, H), vx: 0, vy: rand(-15, 15), s: rand(2, 4), life: rand(3, 6) }); break;
    case 'rain': Object.assign(b, { x: rand(-60, W), y: -20, vx: 120, vy: rand(700, 950), s: rand(12, 22) }); break;
    case 'flies': Object.assign(b, { x: rand(0, W), y: rand(0, H), vx: rand(-10, 10), vy: rand(-10, 10), s: 2, life: rand(2, 5) }); break;
    case 'snow': Object.assign(b, { x: rand(-20, W), y: -10, vx: rand(-25, 10), vy: rand(60, 140), s: rand(1.2, 3) }); break;
    case 'data': Object.assign(b, { x: Math.round(rand(0, W) / 15) * 15, y: H + 10, vx: 0, vy: -rand(80, 200), s: rand(2, 4), life: rand(3, 7) }); break;
  }
  AMB.push(b);
}
function drawAmbient() {
  for (const a of AMB) {
    const fade = Math.min(1, (a.life - a.t) * 2, a.t * 4 + 0.2);
    switch (a.k) {
      case 'stars': ctx.fillStyle = `rgba(200,220,255,${0.5 * fade})`; ctx.fillRect(a.x, a.y, a.s, a.s * 8); break;
      case 'ash': ctx.fillStyle = `rgba(170,180,160,${0.5 * fade})`; ctx.fillRect(a.x, a.y, a.s, a.s); break;
      case 'sand': ctx.fillStyle = 'rgba(230,190,130,0.25)'; ctx.fillRect(a.x, a.y, a.s, 1.5); break;
      case 'embers': ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,${120 + Math.floor(Math.sin(a.t * 9) * 60)},30,${0.8 * fade})`; ctx.fillRect(a.x, a.y, a.s, a.s); ctx.globalCompositeOperation = 'source-over'; break;
      case 'spores': ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.6 * fade; drawSpr(a.ph > 3 ? GLOW.cyan : GLOW.purple, a.x, a.y, 0, a.s * 0.12); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; break;
      case 'rain': ctx.strokeStyle = 'rgba(170,210,255,0.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + a.s * 0.13, a.y + a.s); ctx.stroke(); break;
      case 'flies': if (Math.sin(a.t * 6 + a.ph) > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fade; drawSpr(GLOW.lime, a.x, a.y, 0, 0.35); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; } break;
      case 'snow': ctx.fillStyle = `rgba(240,248,255,${0.8 * fade})`; ctx.beginPath(); ctx.arc(a.x, a.y, a.s, 0, TAU); ctx.fill(); break;
      case 'data': ctx.fillStyle = `rgba(255,43,106,${0.6 * fade})`; ctx.fillRect(a.x, a.y, a.s, a.s * 3); break;
    }
  }
}
function drawSeams() {
  for (const t of tiles) {
    if (!t.seam) continue;
    const y = t.y + CH, col = THEMES[THEME].fog;
    const gr = ctx.createLinearGradient(0, y - 160, 0, y + 160);
    gr.addColorStop(0, col + '0)'); gr.addColorStop(0.5, col + '0.95)'); gr.addColorStop(1, col + '0)');
    ctx.fillStyle = gr; ctx.fillRect(0, y - 160, W, 320);
  }
}
