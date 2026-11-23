'use strict';
/* ---------------- Sprites ---------------- */
const SPR = {};
SPR.player = sprite(96, 100, g => {
  const cx = 48;
  const wing = [cx, 22, cx + 44, 70, cx + 40, 80, cx + 14, 74, cx, 84, cx - 14, 74, cx - 40, 80, cx - 44, 70];
  g.shadowColor = '#00e5ff'; g.shadowBlur = 10; g.fillStyle = '#1d2b4a'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 30, 0, 82, ['#4a72aa', '#16213a']); poly(g, wing); g.fill();
  g.strokeStyle = '#00e5ff'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx + 8, 34); g.lineTo(cx + 43, 70); g.moveTo(cx - 8, 34); g.lineTo(cx - 43, 70); g.stroke();
  g.strokeStyle = '#ff2bd6';
  g.beginPath(); g.moveTo(cx + 22, 62); g.lineTo(cx + 36, 74); g.moveTo(cx - 22, 62); g.lineTo(cx - 36, 74); g.stroke();
  for (const s of [-1, 1]) {
    const px = cx + s * 22;
    g.fillStyle = lg(g, px - 6, 0, px + 6, 0, ['#8a96b0', '#e6ecf7', '#6b7690']); rr(g, px - 6, 44, 12, 42, 5); g.fill();
    g.fillStyle = '#00e5ff'; g.fillRect(px - 4, 82, 8, 4);
    g.fillStyle = '#c8d2e6'; g.fillRect(cx + s * 40 - 2, 54, 4, 20);
    g.fillStyle = '#ff2bd6'; g.fillRect(cx + s * 40 - 2, 52, 4, 4);
  }
  g.fillStyle = lg(g, cx - 10, 0, cx + 10, 0, ['#7d88a3', '#f2f6ff', '#6a7590']);
  g.beginPath(); g.moveTo(cx, 4); g.quadraticCurveTo(cx + 12, 30, cx + 10, 78); g.lineTo(cx + 6, 90); g.lineTo(cx - 6, 90);
  g.lineTo(cx - 10, 78); g.quadraticCurveTo(cx - 12, 30, cx, 4); g.fill();
  g.fillStyle = lg(g, 0, 22, 0, 50, ['#d8fbff', '#0088cc']); g.beginPath(); g.ellipse(cx, 36, 5, 13, 0, 0, TAU); g.fill();
  g.fillStyle = '#00e5ff'; g.fillRect(cx - 1, 54, 2, 28);
});
SPR.flame = sprite(22, 54, g => {
  g.fillStyle = lg(g, 0, 0, 0, 54, ['#ffffff', '#7ff6ff', 'rgba(0,140,255,0.6)', 'rgba(0,60,255,0)']);
  g.beginPath(); g.moveTo(3, 0); g.quadraticCurveTo(11, 70, 19, 0); g.closePath(); g.fill();
});
SPR.drone = sprite(64, 60, g => {
  const cx = 32;
  g.shadowColor = '#ff2bd6'; g.shadowBlur = 6;
  g.fillStyle = lg(g, 0, 0, 0, 60, ['#3b1d52', '#1a0d28']);
  poly(g, [cx, 8, 60, 18, 54, 30, 40, 34, cx, 54, 24, 34, 10, 30, 4, 18]); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ff3df0'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = lg(g, cx - 14, 0, cx + 14, 0, ['#5c2f80', '#b384e0', '#4a2468']);
  g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + Math.PI / 6; g.lineTo(cx + Math.cos(a) * 14, 26 + Math.sin(a) * 14); }
  g.closePath(); g.fill(); g.strokeStyle = '#2a1238'; g.lineWidth = 2; g.stroke();
  g.fillStyle = radial(g, cx, 30, 9, [[0, '#fff'], [0.3, '#ff3355'], [1, 'rgba(255,0,60,0)']]);
  g.beginPath(); g.arc(cx, 30, 9, 0, TAU); g.fill();
  g.fillStyle = '#ff3df0'; g.fillRect(4, 16, 4, 4); g.fillRect(56, 16, 4, 4);
});
SPR.fighter = sprite(60, 72, g => {
  const cx = 30;
  g.fillStyle = lg(g, 0, 0, 0, 72, ['#5a3414', '#2a1608']);
  poly(g, [cx, 70, 56, 14, 46, 6, cx, 22, 14, 6, 4, 14]); g.fill();
  g.strokeStyle = '#ffa22b'; g.lineWidth = 2; g.stroke();
  g.fillStyle = lg(g, cx - 8, 0, cx + 8, 0, ['#8a6a50', '#ffe0b0', '#7a5a40']);
  poly(g, [cx, 66, cx + 8, 30, cx + 6, 4, cx - 6, 4, cx - 8, 30]); g.fill();
  g.fillStyle = '#ff4b1f'; g.beginPath(); g.ellipse(cx, 44, 3.5, 9, 0, 0, TAU); g.fill();
  g.fillStyle = '#ffd23f'; g.fillRect(cx - 9, 2, 4, 6); g.fillRect(cx + 5, 2, 4, 6);
});
SPR.spinner = sprite(72, 72, g => {
  const c = 36;
  for (let i = 0; i < 4; i++) {
    const a = i * TAU / 4 + Math.PI / 4, px = c + Math.cos(a) * 26, py = c + Math.sin(a) * 26;
    g.fillStyle = '#34344a'; g.beginPath(); g.arc(px, py, 8, 0, TAU); g.fill();
    g.strokeStyle = '#ff8a2b'; g.lineWidth = 2; g.stroke();
  }
  g.fillStyle = lg(g, 0, 0, 72, 72, ['#6a5626', '#2a2010']); g.beginPath(); g.arc(c, c, 24, 0, TAU); g.fill();
  g.strokeStyle = '#ffc83d'; g.lineWidth = 2.5; g.stroke();
  g.setLineDash([4, 4]); g.strokeStyle = 'rgba(255,200,61,0.6)'; g.lineWidth = 1.5;
  g.beginPath(); g.arc(c, c, 17, 0, TAU); g.stroke(); g.setLineDash([]);
  g.fillStyle = radial(g, c, c, 13, [[0, '#fff'], [0.35, '#ff9a2a'], [1, 'rgba(255,80,0,0)']]);
  g.beginPath(); g.arc(c, c, 13, 0, TAU); g.fill();
});
SPR.blade = sprite(124, 124, g => {
  const c = 62;
  for (let i = 0; i < 3; i++) {
    g.save(); g.translate(c, c); g.rotate(i * TAU / 3);
    g.fillStyle = lg(g, 0, 0, 0, -60, ['rgba(255,210,90,0.9)', 'rgba(255,90,20,0)']);
    g.beginPath(); g.moveTo(-5, 0); g.quadraticCurveTo(-16, -34, -4, -60); g.lineTo(6, -58);
    g.quadraticCurveTo(10, -30, 5, 0); g.closePath(); g.fill(); g.restore();
  }
});
SPR.cruiser = sprite(130, 116, g => {
  const cx = 65;
  g.fillStyle = lg(g, 0, 0, 0, 116, ['#18483f', '#0b221f']);
  poly(g, [cx, 112, 120, 60, 126, 30, 100, 20, cx, 30, 30, 20, 4, 30, 10, 60]); g.fill();
  g.strokeStyle = '#39ff88'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = lg(g, cx - 22, 0, cx + 22, 0, ['#2b5f58', '#8fe6d0', '#244e48']);
  rr(g, cx - 22, 6, 44, 96, 14); g.fill(); g.strokeStyle = '#0a1a18'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(57,255,136,0.7)'; g.lineWidth = 1;
  for (let y = 24; y < 70; y += 12) { g.beginPath(); g.moveTo(cx - 16, y); g.lineTo(cx + 16, y); g.stroke(); }
  for (const tx of [cx - 38, cx + 38]) {
    g.fillStyle = '#1f2f2d'; g.beginPath(); g.arc(tx, 52, 11, 0, TAU); g.fill();
    g.strokeStyle = '#39ff88'; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#c8fff0'; g.fillRect(tx - 2, 52, 4, 16);
  }
  g.fillStyle = '#39ff88'; g.fillRect(cx - 14, 2, 8, 5); g.fillRect(cx + 6, 2, 8, 5);
  g.fillStyle = radial(g, cx, 84, 11, [[0, '#fff'], [0.35, '#ff2a4a'], [1, 'rgba(255,0,40,0)']]);
  g.beginPath(); g.arc(cx, 84, 11, 0, TAU); g.fill();
});
SPR.boss = sprite(460, 260, g => {
  const cx = 230;
  const outer = [cx, 250, cx + 70, 170, cx + 225, 130, cx + 228, 95, cx + 150, 70, cx + 70, 30, cx, 10,
    cx - 70, 30, cx - 150, 70, cx - 228, 95, cx - 225, 130, cx - 70, 170];
  g.shadowColor = '#ff2bd6'; g.shadowBlur = 14;
  g.fillStyle = lg(g, 0, 0, 0, 260, ['#2d3350', '#141828']); poly(g, outer); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ff2bd6'; g.lineWidth = 2.5; g.stroke();
  g.strokeStyle = 'rgba(255,43,214,0.35)'; g.lineWidth = 1;
  for (const s of [-1, 1]) for (const t of [0.3, 0.55, 0.8]) {
    g.beginPath(); g.moveTo(cx, 120); g.lineTo(cx + s * 228 * t, 95 + 40 * t); g.stroke();
  }
  g.fillStyle = lg(g, 0, 40, 0, 220, ['#434b70', '#1c2136']);
  poly(g, [cx, 220, cx + 50, 160, cx + 150, 120, cx + 60, 60, cx, 40, cx - 60, 60, cx - 150, 120, cx - 50, 160]); g.fill();
  for (const s of [-1, 1]) for (const ox of [110, 182]) {
    const x = cx + s * ox;
    g.fillStyle = lg(g, x - 14, 0, x + 14, 0, ['#555c78', '#c9d0e8', '#4a5070']); rr(g, x - 13, 58, 26, 82, 10); g.fill();
    g.fillStyle = '#7c4dff'; g.fillRect(x - 9, 54, 18, 6);
    g.fillStyle = radial(g, x, 122, 9, [[0, '#fff'], [0.4, '#ff2bd6'], [1, 'rgba(255,0,200,0)']]);
    g.beginPath(); g.arc(x, 122, 9, 0, TAU); g.fill();
  }
  g.fillStyle = lg(g, cx - 40, 0, cx + 40, 0, ['#4a5070', '#dde3f4', '#454b68']);
  poly(g, [cx, 240, cx + 30, 200, cx + 40, 60, cx + 24, 14, cx - 24, 14, cx - 40, 60, cx - 30, 200]); g.fill();
  g.strokeStyle = '#1a1d2e'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#120814'; rr(g, cx - 18, 92, 36, 76, 12); g.fill();
  g.fillStyle = '#00e5ff'; for (let i = 0; i < 4; i++) g.fillRect(cx - 12, 28 + i * 11, 24, 5);
  g.fillStyle = '#ff2bd6'; g.fillRect(cx - 3, 190, 6, 34);
});
SPR.turret = sprite(40, 40, g => {
  g.fillStyle = '#c8d0e6'; g.fillRect(20, 16.5, 19, 7); g.fillStyle = '#ff2bd6'; g.fillRect(34, 16.5, 5, 7);
  g.fillStyle = '#262b44'; g.beginPath(); g.arc(20, 20, 11, 0, TAU); g.fill();
  g.strokeStyle = '#ff2bd6'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#ff5ae0'; g.beginPath(); g.arc(20, 20, 4, 0, TAU); g.fill();
});
SPR.pbolt = sprite(18, 40, g => {
  g.shadowColor = '#00e5ff'; g.shadowBlur = 8;
  g.fillStyle = lg(g, 0, 0, 0, 40, ['#e8ffff', '#00e5ff', 'rgba(0,120,255,0)']);
  g.beginPath(); g.arc(9, 10, 6, Math.PI, 0); g.quadraticCurveTo(14, 24, 9, 39); g.quadraticCurveTo(4, 24, 3, 10); g.fill();
  g.shadowBlur = 0; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(9, 12, 2.6, 6, 0, 0, TAU); g.fill();
});
SPR.missile = sprite(14, 30, g => {
  g.fillStyle = lg(g, 3, 0, 11, 0, ['#9a3a8a', '#ffd6f6', '#9a3a8a']); rr(g, 4, 4, 6, 20, 3); g.fill();
  g.fillStyle = '#ff2bd6'; poly(g, [7, 0, 10, 6, 4, 6]); g.fill(); poly(g, [4, 20, 1, 27, 4, 24]); g.fill(); poly(g, [10, 20, 13, 27, 10, 24]); g.fill();
});
SPR.eorb = sprite(22, 22, g => {
  g.fillStyle = radial(g, 11, 11, 11, [[0, '#ff6680'], [0.28, '#ff1a40'], [0.4, '#ffffff'], [0.55, '#ff2050'], [1, 'rgba(255,0,40,0)']]);
  g.fillRect(0, 0, 22, 22);
});
SPR.eorb2 = sprite(30, 30, g => {
  g.fillStyle = radial(g, 15, 15, 15, [[0, '#ffd0fa'], [0.25, '#ff2bd6'], [0.38, '#ffffff'], [0.52, '#c020ff'], [1, 'rgba(160,0,255,0)']]);
  g.fillRect(0, 0, 30, 30);
});
SPR.cloud = sprite(300, 200, g => {
  g.fillStyle = radial(g, 150, 100, 150, [[0, 'rgba(110,80,200,0.22)'], [0.6, 'rgba(60,90,180,0.08)'], [1, 'rgba(0,0,0,0)']]);
  g.save(); g.translate(150, 100); g.scale(1, 0.66); g.translate(-150, -100);
  g.beginPath(); g.arc(150, 100, 150, 0, TAU); g.fill(); g.restore();
});
function makePU(letter, col) {
  return sprite(46, 46, g => {
    g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.lineTo(23 + Math.cos(a) * 18, 23 + Math.sin(a) * 18); } g.closePath();
    g.shadowColor = col; g.shadowBlur = 12; g.fillStyle = 'rgba(8,12,28,0.88)'; g.fill();
    g.strokeStyle = col; g.lineWidth = 3; g.stroke();
    g.shadowBlur = 8; g.fillStyle = '#fff'; g.font = `900 19px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(letter, 23, 24);
  });
}
SPR.puP = makePU('P', '#00e5ff'); SPR.puS = makePU('S', '#39ff88'); SPR.puB = makePU('B', '#ff8a2b');
const GLOW = {
  fire: glowDot(16, 'rgba(255,130,30,0.9)'), yellow: glowDot(16, 'rgba(255,220,60,0.9)'),
  cyan: glowDot(16, 'rgba(0,229,255,0.9)'), mag: glowDot(16, 'rgba(255,43,214,0.9)'),
  white: glowDot(16, 'rgba(255,255,255,0.9)'), red: glowDot(16, 'rgba(255,40,70,0.9)'),
  green: glowDot(16, 'rgba(57,255,136,0.9)')
};
GLOW.orange = glowDot(16, 'rgba(255,90,31,0.9)');
GLOW.purple = glowDot(16, 'rgba(200,107,255,0.9)');
GLOW.lime = glowDot(16, 'rgba(212,255,58,0.9)');
GLOW.amber = glowDot(16, 'rgba(255,184,0,0.9)');

/* ---- Naves del jugador ---- */
SPR.rayo = sprite(96, 100, g => {
  const cx = 48;
  const wing = [cx, 30, cx + 40, 58, cx + 45, 50, cx + 43, 66, cx + 12, 74, cx, 88, cx - 12, 74, cx - 43, 66, cx - 45, 50, cx - 40, 58];
  g.shadowColor = '#ffe14d'; g.shadowBlur = 10; g.fillStyle = '#2e2a14'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 30, 0, 86, ['#7a6a26', '#221d0c']); poly(g, wing); g.fill();
  g.strokeStyle = '#ffe14d'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx + 6, 38); g.lineTo(cx + 42, 60); g.moveTo(cx - 6, 38); g.lineTo(cx - 42, 60); g.stroke();
  g.strokeStyle = '#ff3355'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx + 18, 66); g.lineTo(cx + 36, 64); g.moveTo(cx - 18, 66); g.lineTo(cx - 36, 64); g.stroke();
  g.fillStyle = '#ffe14d'; poly(g, [cx + 6, 24, cx + 20, 34, cx + 6, 34]); g.fill(); poly(g, [cx - 6, 24, cx - 20, 34, cx - 6, 34]); g.fill();
  g.fillStyle = lg(g, cx - 8, 0, cx + 8, 0, ['#8a8470', '#fffbe8', '#6e6852']);
  g.beginPath(); g.moveTo(cx, 0); g.quadraticCurveTo(cx + 9, 30, cx + 8, 80); g.lineTo(cx + 5, 92); g.lineTo(cx - 5, 92);
  g.lineTo(cx - 8, 80); g.quadraticCurveTo(cx - 9, 30, cx, 0); g.fill();
  g.fillStyle = lg(g, 0, 20, 0, 50, ['#fff6c0', '#ff9a00']); g.beginPath(); g.ellipse(cx, 36, 4, 12, 0, 0, TAU); g.fill();
  g.fillStyle = '#ff3355'; g.fillRect(cx - 1, 52, 2, 30);
  g.fillStyle = '#c8c0a0'; g.fillRect(cx - 44, 44, 3, 16); g.fillRect(cx + 41, 44, 3, 16);
});
SPR.titan = sprite(100, 100, g => {
  const cx = 50;
  const wing = [cx, 24, cx + 47, 50, cx + 48, 80, cx + 24, 90, cx - 24, 90, cx - 48, 80, cx - 47, 50];
  g.shadowColor = '#39ff88'; g.shadowBlur = 10; g.fillStyle = '#16302a'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 24, 0, 90, ['#3f7a62', '#12261f']); poly(g, wing); g.fill();
  g.strokeStyle = '#39ff88'; g.lineWidth = 2; poly(g, wing); g.stroke();
  g.strokeStyle = 'rgba(57,255,136,0.5)'; g.lineWidth = 1;
  for (const y of [58, 70]) { g.beginPath(); g.moveTo(cx - 44, y); g.lineTo(cx + 44, y); g.stroke(); }
  for (const ox of [-34, -12, 12, 34]) {
    g.fillStyle = lg(g, cx + ox - 7, 0, cx + ox + 7, 0, ['#6a7a74', '#dff5ea', '#5a6a64']); rr(g, cx + ox - 7, 66, 14, 26, 4); g.fill();
    g.fillStyle = '#39ff88'; g.fillRect(cx + ox - 5, 90, 10, 3);
  }
  for (const s of [-1, 1]) {
    g.fillStyle = '#c8d8d0'; g.fillRect(cx + s * 30 - 3, 22, 6, 30);
    g.fillStyle = '#39ff88'; g.fillRect(cx + s * 30 - 3, 20, 6, 4);
  }
  g.fillStyle = lg(g, cx - 14, 0, cx + 14, 0, ['#6a7a74', '#eefff6', '#5a6a64']);
  rr(g, cx - 14, 14, 28, 70, 10); g.fill();
  g.fillStyle = lg(g, 0, 26, 0, 48, ['#d8fff0', '#0a8a5a']); rr(g, cx - 6, 26, 12, 20, 5); g.fill();
  g.fillStyle = '#ffb800'; for (let i = 0; i < 3; i++) g.fillRect(cx - 8, 54 + i * 8, 16, 3);
});
SPR.spectre = sprite(100, 96, g => {
  const cx = 50;
  const wing = [cx, 10, cx + 48, 70, cx + 40, 80, cx + 20, 66, cx, 84, cx - 20, 66, cx - 40, 80, cx - 48, 70];
  g.shadowColor = '#c86bff'; g.shadowBlur = 12; g.fillStyle = '#26143a'; poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.fillStyle = lg(g, 0, 10, 0, 84, ['#6a3aa0', '#1a0c2a']); poly(g, wing); g.fill();
  g.strokeStyle = '#c86bff'; g.lineWidth = 2; poly(g, wing); g.stroke();
  g.strokeStyle = '#00e5ff'; g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(cx, 20); g.lineTo(cx + 40, 72); g.moveTo(cx, 20); g.lineTo(cx - 40, 72); g.stroke();
  for (const s of [-1, 1]) {
    g.fillStyle = lg(g, cx + s * 26 - 5, 0, cx + s * 26 + 5, 0, ['#7a6a90', '#f0e6ff', '#5a4a70']);
    rr(g, cx + s * 26 - 5, 42, 10, 26, 4); g.fill();
    g.fillStyle = '#ff2bd6'; g.fillRect(cx + s * 26 - 3, 40, 6, 4);
  }
  g.fillStyle = radial(g, cx, 48, 14, [[0, '#fff'], [0.3, '#c86bff'], [1, 'rgba(120,0,255,0)']]);
  g.beginPath(); g.arc(cx, 48, 14, 0, TAU); g.fill();
  g.fillStyle = '#1a0c2a'; g.beginPath(); g.ellipse(cx, 48, 3, 7, 0, 0, TAU); g.fill();
});
SPR.falcon = SPR.player;
function makeFlame(a, b, c) {
  return sprite(22, 54, g => {
    g.fillStyle = lg(g, 0, 0, 0, 54, ['#ffffff', a, b, c]);
    g.beginPath(); g.moveTo(3, 0); g.quadraticCurveTo(11, 70, 19, 0); g.closePath(); g.fill();
  });
}
SPR.flameY = makeFlame('#ffe14d', 'rgba(255,120,0,0.6)', 'rgba(255,40,0,0)');
SPR.flameG = makeFlame('#9affc8', 'rgba(0,200,120,0.6)', 'rgba(0,120,60,0)');
SPR.flameP = makeFlame('#e0b0ff', 'rgba(160,60,255,0.6)', 'rgba(90,0,255,0)');

/* ---- Proyectiles del jugador ---- */
SPR.needle = sprite(10, 36, g => {
  g.shadowColor = '#ffe14d'; g.shadowBlur = 6;
  g.fillStyle = lg(g, 0, 0, 0, 36, ['#ffffff', '#ffe14d', 'rgba(255,140,0,0)']); rr(g, 3, 1, 4, 34, 2); g.fill();
});
SPR.shell = sprite(26, 30, g => {
  g.fillStyle = radial(g, 13, 12, 13, [[0, '#ffffff'], [0.3, '#9affc8'], [0.6, 'rgba(57,255,136,0.6)'], [1, 'rgba(0,120,60,0)']]);
  g.fillRect(0, 0, 26, 30);
  g.fillStyle = '#eafff2'; g.beginPath(); g.ellipse(13, 12, 4.5, 6.5, 0, 0, TAU); g.fill();
});
SPR.wave = sprite(36, 22, g => {
  g.shadowColor = '#c86bff'; g.shadowBlur = 8;
  g.strokeStyle = '#e8c8ff'; g.lineWidth = 4; g.beginPath(); g.arc(18, 22, 15, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
  g.strokeStyle = 'rgba(200,107,255,0.8)'; g.lineWidth = 8; g.beginPath(); g.arc(18, 24, 14, Math.PI * 1.2, Math.PI * 1.8); g.stroke();
});

/* ---- Enemigos nuevos ---- */
SPR.hunter = sprite(64, 64, g => {
  const cx = 32;
  g.shadowColor = '#ff3355'; g.shadowBlur = 6;
  g.fillStyle = lg(g, 0, 0, 0, 64, ['#3a3f55', '#181b26']);
  poly(g, [cx, 62, cx + 8, 40, 62, 28, 60, 10, cx + 10, 22, cx, 4, cx - 10, 22, 4, 10, 2, 28, cx - 8, 40]); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ff3355'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = lg(g, cx - 6, 0, cx + 6, 0, ['#6a7090', '#e0e6f8', '#5a6080']); poly(g, [cx, 52, cx + 6, 26, cx, 8, cx - 6, 26]); g.fill();
  g.fillStyle = '#ff3355'; poly(g, [cx, 50, cx + 3, 36, cx - 3, 36]); g.fill();
  g.fillStyle = '#ff9aa8'; g.fillRect(57, 12, 3, 10); g.fillRect(4, 12, 3, 10);
});
SPR.kamikaze = sprite(40, 48, g => {
  const cx = 20;
  g.fillStyle = lg(g, 0, 0, 0, 48, ['#5a1010', '#2a0606']); poly(g, [cx, 46, 38, 8, cx, 16, 2, 8]); g.fill();
  g.strokeStyle = '#ff5a1f'; g.lineWidth = 2; g.stroke();
  g.fillStyle = radial(g, cx, 26, 10, [[0, '#fff'], [0.3, '#ffb02a'], [1, 'rgba(255,80,0,0)']]);
  g.beginPath(); g.arc(cx, 26, 10, 0, TAU); g.fill();
});
SPR.mine = sprite(52, 52, g => {
  const c = 26;
  g.strokeStyle = '#8a90a8'; g.lineWidth = 3;
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.moveTo(c + Math.cos(a) * 12, c + Math.sin(a) * 12); g.lineTo(c + Math.cos(a) * 24, c + Math.sin(a) * 24); g.stroke(); }
  g.fillStyle = lg(g, 10, 10, 42, 42, ['#6a7088', '#1a1d2a']); g.beginPath(); g.arc(c, c, 15, 0, TAU); g.fill();
  g.strokeStyle = '#ffb800'; g.lineWidth = 1.5; g.stroke();
  g.setLineDash([3, 3]); g.beginPath(); g.arc(c, c, 10, 0, TAU); g.stroke(); g.setLineDash([]);
});
SPR.bomber = sprite(180, 130, g => {
  const cx = 90;
  const wing = [cx, 126, cx + 30, 96, 176, 70, 172, 50, cx + 40, 40, cx + 22, 4, cx - 22, 4, cx - 40, 40, 8, 50, 4, 70, cx - 30, 96];
  g.shadowColor = '#ff5a1f'; g.shadowBlur = 10; g.fillStyle = lg(g, 0, 0, 0, 130, ['#4a1d1d', '#1e0b0b']); poly(g, wing); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ff5a1f'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(255,90,31,0.35)'; g.lineWidth = 1;
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx, 60); g.lineTo(cx + s * 84, 62); g.stroke(); }
  for (const s of [-1, 1]) for (const ox of [32, 60]) {
    const x = cx + s * ox;
    g.fillStyle = lg(g, x - 8, 0, x + 8, 0, ['#5a3a3a', '#d8b0a0', '#4a2a2a']); rr(g, x - 8, 26, 16, 40, 6); g.fill();
    g.fillStyle = '#ff8a2b'; g.fillRect(x - 5, 22, 10, 4);
  }
  g.fillStyle = lg(g, cx - 18, 0, cx + 18, 0, ['#5a3030', '#d9aa9a', '#4a2525']); rr(g, cx - 18, 8, 36, 104, 14); g.fill();
  g.fillStyle = '#120606'; rr(g, cx - 10, 54, 20, 36, 6); g.fill();
  g.fillStyle = 'rgba(255,120,40,0.85)'; for (let i = 0; i < 3; i++) g.fillRect(cx - 7, 58 + i * 11, 14, 4);
  g.fillStyle = '#ffb02a'; poly(g, [cx, 112, cx + 9, 98, cx - 9, 98]); g.fill();
});
SPR.tank = sprite(52, 68, g => {
  for (const x of [2, 38]) {
    g.fillStyle = '#14161e'; rr(g, x, 2, 12, 64, 4); g.fill();
    g.fillStyle = '#2c3040'; for (let y = 5; y < 64; y += 6) g.fillRect(x + 1, y, 10, 2);
  }
  g.fillStyle = lg(g, 12, 0, 40, 0, ['#2d3a3a', '#6a8a82', '#2a3636']); rr(g, 12, 6, 28, 56, 6); g.fill();
  g.strokeStyle = 'rgba(0,229,255,0.6)'; g.lineWidth = 1.2; g.strokeRect(15.5, 10.5, 21, 48);
  g.fillStyle = '#ffb800'; g.fillRect(14, 58, 4, 3); g.fillRect(34, 58, 4, 3);
});
SPR.tankTurret = sprite(48, 48, g => {
  g.fillStyle = '#c0cad0'; g.fillRect(24, 21, 22, 6); g.fillStyle = '#ff3355'; g.fillRect(42, 21, 4, 6);
  g.fillStyle = lg(g, 12, 12, 36, 36, ['#6a8078', '#22302c']); g.beginPath(); g.arc(24, 24, 12, 0, TAU); g.fill();
  g.strokeStyle = '#00e5ff'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = '#00e5ff'; g.beginPath(); g.arc(24, 24, 3, 0, TAU); g.fill();
});

/* ---- Jefe 2: Coloso blindado (terrestre) ---- */
SPR.colossus = sprite(440, 300, g => {
  const cx = 220;
  for (const x of [8, 372]) {
    g.fillStyle = '#0e1016'; rr(g, x, 10, 60, 280, 14); g.fill();
    g.fillStyle = '#262a38'; for (let y = 18; y < 284; y += 12) g.fillRect(x + 4, y, 52, 5);
    g.strokeStyle = 'rgba(255,184,0,0.45)'; g.lineWidth = 2; rr(g, x, 10, 60, 280, 14); g.stroke();
  }
  const hull = [110, 14, 330, 14, 384, 70, 384, 236, 330, 290, 110, 290, 56, 236, 56, 70];
  g.shadowColor = '#ffb800'; g.shadowBlur = 14; g.fillStyle = lg(g, 0, 0, 0, 300, ['#3a4258', '#181c28']); poly(g, hull); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ffb800'; g.lineWidth = 2.5; g.stroke();
  const inner = [130, 44, 310, 44, 350, 84, 350, 222, 310, 262, 130, 262, 90, 222, 90, 84];
  g.fillStyle = lg(g, 0, 40, 0, 260, ['#4c5672', '#222838']); poly(g, inner); g.fill();
  g.strokeStyle = 'rgba(255,184,0,0.3)'; g.lineWidth = 1; g.stroke();
  g.save(); poly(g, [130, 262, 310, 262, 330, 290, 110, 290]); g.clip();
  for (let x = 70; x < 380; x += 22) { g.fillStyle = '#ffb800'; poly(g, [x, 262, x + 11, 262, x - 3, 290, x - 14, 290]); g.fill(); }
  g.restore();
  g.fillStyle = 'rgba(255,255,255,0.25)';
  for (let x = 140; x <= 300; x += 20) { g.fillRect(x, 50, 2, 2); g.fillRect(x, 254, 2, 2); }
  for (const tx of [120, 320]) {
    g.fillStyle = '#10131c'; g.beginPath(); g.arc(tx, 110, 42, 0, TAU); g.fill();
    g.strokeStyle = '#ffb800'; g.lineWidth = 2; g.stroke();
  }
  g.fillStyle = '#0c0710'; g.beginPath(); g.arc(cx, 160, 48, 0, TAU); g.fill();
  g.strokeStyle = '#ff5a1f'; g.lineWidth = 4; g.stroke();
  g.setLineDash([6, 6]); g.lineWidth = 2; g.beginPath(); g.arc(cx, 160, 36, 0, TAU); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#10131c'; rr(g, cx - 26, 222, 52, 40, 8); g.fill();
  g.fillStyle = '#c8d0e6'; g.fillRect(cx - 7, 252, 14, 34); g.fillStyle = '#ff5a1f'; g.fillRect(cx - 7, 282, 14, 6);
  for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(255,90,31,0.7)'; g.fillRect(160 + i * 26, 24, 14, 6); }
});
SPR.bigTurret = sprite(100, 100, g => {
  g.fillStyle = '#c8d0e6'; g.fillRect(50, 37, 46, 9); g.fillRect(50, 54, 46, 9);
  g.fillStyle = '#ffb800'; g.fillRect(90, 37, 6, 9); g.fillRect(90, 54, 6, 9);
  g.fillStyle = lg(g, 20, 20, 80, 80, ['#5a6480', '#1c2030']); g.beginPath(); g.arc(50, 50, 30, 0, TAU); g.fill();
  g.strokeStyle = '#ffb800'; g.lineWidth = 2.5; g.stroke();
  g.fillStyle = radial(g, 50, 50, 12, [[0, '#fff'], [0.35, '#ff5a1f'], [1, 'rgba(255,60,0,0)']]);
  g.beginPath(); g.arc(50, 50, 12, 0, TAU); g.fill();
});

/* ---- Jefe 3: VROAR, serpiente mecánica ---- */
SPR.vhead = sprite(120, 130, g => {
  const cx = 60;
  g.fillStyle = '#2a2f3a'; g.strokeStyle = '#ff5a1f'; g.lineWidth = 2;
  for (const s of [-1, 1]) {
    g.beginPath(); g.moveTo(cx + s * 22, 40); g.quadraticCurveTo(cx + s * 60, 22, cx + s * 52, 0);
    g.quadraticCurveTo(cx + s * 40, 24, cx + s * 12, 34); g.closePath(); g.fill(); g.stroke();
  }
  const sk = [cx, 124, cx + 22, 100, cx + 40, 70, cx + 44, 44, cx + 28, 24, cx, 18, cx - 28, 24, cx - 44, 44, cx - 40, 70, cx - 22, 100];
  g.shadowColor = '#ff5a1f'; g.shadowBlur = 14; g.fillStyle = lg(g, 0, 18, 0, 124, ['#4e566c', '#1a1e2a']); poly(g, sk); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#ff5a1f'; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(255,90,31,0.55)'; g.lineWidth = 1.2;
  g.beginPath(); g.moveTo(cx, 24); g.lineTo(cx, 92); g.moveTo(cx - 30, 36); g.lineTo(cx - 12, 84); g.moveTo(cx + 30, 36); g.lineTo(cx + 12, 84); g.stroke();
  for (const s of [-1, 1]) {
    g.fillStyle = radial(g, cx + s * 21, 62, 13, [[0, '#fff'], [0.3, '#d4ff3a'], [1, 'rgba(150,255,0,0)']]);
    g.beginPath(); g.arc(cx + s * 21, 62, 13, 0, TAU); g.fill();
    g.fillStyle = '#c0c8d8'; poly(g, [cx + s * 10, 96, cx + s * 30, 98, cx + s * 18, 128, cx + s * 8, 110]); g.fill();
  }
  g.fillStyle = radial(g, cx, 108, 15, [[0, '#fff'], [0.3, '#ff9a2a'], [1, 'rgba(255,60,0,0)']]);
  g.beginPath(); g.arc(cx, 108, 15, 0, TAU); g.fill();
});
SPR.vseg = sprite(84, 64, g => {
  const cx = 42, cy = 32;
  g.fillStyle = '#8a92a8';
  for (const s of [-1, 1]) { poly(g, [cx + s * 22, cy - 8, cx + s * 41, cy + 4, cx + s * 22, cy + 8]); g.fill(); }
  g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; g.lineTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 24); } g.closePath();
  g.fillStyle = lg(g, 0, 6, 0, 58, ['#4e566c', '#1c202c']); g.fill();
  g.strokeStyle = '#ff5a1f'; g.lineWidth = 2; g.stroke();
  g.fillStyle = radial(g, cx, cy, 10, [[0, '#fff'], [0.35, '#d4ff3a'], [1, 'rgba(150,255,0,0)']]);
  g.beginPath(); g.arc(cx, cy, 10, 0, TAU); g.fill();
  g.fillStyle = '#c0c8d8'; poly(g, [cx, cy - 26, cx + 6, cy - 12, cx - 6, cy - 12]); g.fill();
});

/* ---- Efectos ---- */
SPR.smoke = sprite(40, 40, g => {
  g.fillStyle = radial(g, 20, 20, 20, [[0, 'rgba(40,40,52,0.7)'], [0.6, 'rgba(30,30,40,0.35)'], [1, 'rgba(0,0,0,0)']]);
  g.fillRect(0, 0, 40, 40);
});
SPR.scorch = sprite(80, 80, g => {
  g.fillStyle = radial(g, 40, 40, 40, [[0, 'rgba(0,0,0,0.75)'], [0.5, 'rgba(20,10,5,0.45)'], [1, 'rgba(0,0,0,0)']]);
  g.fillRect(0, 0, 80, 80);
});
SPR.beam = sprite(90, 320, g => {
  g.fillStyle = lg(g, 0, 320, 0, 0, ['rgba(190,225,255,0.32)', 'rgba(120,170,255,0.12)', 'rgba(120,170,255,0)']);
  g.beginPath(); g.moveTo(45, 320); g.lineTo(0, 0); g.lineTo(90, 0); g.closePath(); g.fill();
});

const SHD = {}, FL = {};
for (const k of ['falcon', 'rayo', 'titan', 'spectre', 'drone', 'fighter', 'spinner', 'cruiser', 'boss', 'hunter', 'kamikaze', 'mine', 'bomber', 'vhead', 'vseg']) {
  SHD[k] = tint(SPR[k], 'rgba(0,0,0,0.45)'); FL[k] = tint(SPR[k], 'rgba(255,255,255,0.85)');
}
for (const k of ['tank', 'colossus']) FL[k] = tint(SPR[k], 'rgba(255,255,255,0.85)');

