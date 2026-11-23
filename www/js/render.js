'use strict';
/* ---------------- Render ---------------- */
function txt(s, x, y, size, col, align = 'center', glow = null, weight = 800) {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 14; }
  ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.shadowBlur = 0;
}
function drawShip(S, x, y, sc, bank, blink) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc * (1 - Math.abs(bank) * 0.2), sc);
  ctx.globalCompositeOperation = 'lighter';
  const f = 0.8 + Math.random() * 0.35, fl = SPR[S.flame];
  for (const [fx, fy, fw, fh] of S.flames) ctx.drawImage(fl, fx - fw / 2, fy, fw, fh * f);
  ctx.globalCompositeOperation = 'source-over';
  const s = SPR[S.id];
  if (!blink) ctx.drawImage(s, -s.w / 2, -s.h / 2, s.w, s.h);
  ctx.restore();
}
function drawPlayer() {
  if (!P.alive) return;
  drawShip(SHIP, P.x, P.y, 1, P.bank, P.inv > 0 && Math.floor(G.t * 18) % 2 === 0);
  if (P.inv > 0) {
    ctx.globalAlpha = Math.min(1, P.inv) * 0.5; ctx.strokeStyle = SHIP.col; ctx.lineWidth = 2;
    ctx.beginPath(); const R = 54 + Math.sin(G.t * 12) * 2;
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + G.t; ctx.lineTo(P.x + Math.cos(a) * R, P.y + Math.sin(a) * R); }
    ctx.closePath(); ctx.stroke(); ctx.globalAlpha = 1;
  }
}
function drawEnemy(e) {
  const air = e.type === 'fighter' || e.type === 'kamikaze' || e.type === 'hunter' || e.type === 'mine' || e.type === 'debris';
  drawEliteFx(e);
  const rot = air ? e.rot : 0;
  if (e.type === 'spinner') { ctx.globalCompositeOperation = 'lighter'; drawSpr(SPR.blade, e.x, e.y, e.rot); ctx.globalCompositeOperation = 'source-over'; }
  if ((e.type === 'fighter' && e.dive) || e.type === 'hunter') {
    ctx.globalCompositeOperation = 'lighter';
    const vx = e.type === 'hunter' ? e.dir * 230 : e.vx, vy = e.type === 'hunter' ? 0 : e.vy;
    drawSpr(GLOW.fire, e.x - vx * 0.08, e.y - vy * 0.08, 0, 1.2); ctx.globalCompositeOperation = 'source-over';
  }
  if (e.type === 'bomber') { ctx.globalCompositeOperation = 'lighter'; for (const s of [-1, 1]) for (const ox of [32, 60]) drawSpr(GLOW.orange, e.x + s * ox, e.y - 44, 0, 0.9 + Math.random() * 0.3); ctx.globalCompositeOperation = 'source-over'; }
  drawSpr(SPR[e.type], e.x, e.y, rot);
  drawEliteRing(e);
  if (e.type === 'tank') drawSpr(SPR.tankTurret, e.x, e.y + 2, e.ta);
  if (e.type === 'mine' && Math.floor(e.t * 3) % 2 === 0) { ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW.red, e.x, e.y, 0, 1); ctx.globalCompositeOperation = 'source-over'; }
  if (e.hit > 0) { ctx.globalAlpha = 0.7; drawSpr(FL[e.type], e.x, e.y, rot); ctx.globalAlpha = 1; }
  if ((e.type === 'cruiser' || e.type === 'spinner' || e.type === 'bomber' || e.type === 'tank') && e.hp < e.maxhp) {
    const w = e.type === 'tank' ? 40 : 60;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(e.x - w / 2, e.y - e.r - 14, w, 5);
    ctx.fillStyle = '#39ff88'; ctx.fillRect(e.x - w / 2, e.y - e.r - 14, w * Math.max(0, e.hp) / e.maxhp, 5);
  }
}
function drawBoss(b) {
  const add = () => { ctx.globalCompositeOperation = 'lighter'; }, norm = () => { ctx.globalCompositeOperation = 'source-over'; };
  if (b.kind === 'mothership') {
    drawSpr(SPR.boss, b.x, b.y);
    add();
    drawSpr(b.rage ? GLOW.orange : GLOW.red, b.x, b.y, 0, (1.4 + Math.sin(G.t * 6) * 0.35) * 1.6);
    for (const s of [-1, 1]) for (const ox of [110, 182]) drawSpr(GLOW.red, b.x + s * ox, b.y - 74 - Math.random() * 6, 0, 1.2);
    norm();
    BT.forEach(([ox, oy], i) => drawSpr(SPR.turret, b.x + ox, b.y + oy, b.ta[i]));
    if (b.hit > 0) { ctx.globalAlpha = 0.22; drawSpr(FL.boss, b.x, b.y); ctx.globalAlpha = 1; }
  } else if (b.kind === 'colossus') {
    drawSpr(SPR.colossus, b.x, b.y);
    add(); drawSpr(b.rage ? GLOW.red : GLOW.mag, b.x, b.y + 10, 0, 2.6 + Math.sin(G.t * 5) * 0.4); norm();
    CT.forEach(([ox, oy], i) => drawSpr(SPR.bigTurret, b.x + ox, b.y + oy, b.ta[i]));
    if (b.hit > 0) { ctx.globalAlpha = 0.2; drawSpr(FL.colossus, b.x, b.y); ctx.globalAlpha = 1; }
  } else {
    for (let i = VSEG - 1; i >= 0; i--) {
      const s = b.segs[i], sc = 1 - i * 0.03;
      drawSpr(SPR.vseg, s.x, s.y, s.rot, sc);
      if (b.hit > 0) { ctx.globalAlpha = 0.25; drawSpr(FL.vseg, s.x, s.y, s.rot, sc); ctx.globalAlpha = 1; }
    }
    const h = b.head;
    drawSpr(SPR.vhead, h.x, h.y, h.rot);
    if (b.breath > 0) { add(); drawSpr(GLOW.orange, h.x - Math.sin(h.rot) * 52, h.y + Math.cos(h.rot) * 52, 0, 2.4 + Math.random()); norm(); }
    if (b.hit > 0) { ctx.globalAlpha = 0.4; drawSpr(FL.vhead, h.x, h.y, h.rot); ctx.globalAlpha = 1; }
  }
}
function drawLasers() {
  if (!boss) return;
  for (const l of LASERS) {
    const ox = boss.x + l.ox, oy = boss.y + l.oy, ex = ox + Math.cos(l.a) * 1400, ey = oy + Math.sin(l.a) * 1400;
    if (l.t < l.warn) {
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(l.t * 30); ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 2; ctx.setLineDash([12, 10]);
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,40,90,0.35)'; ctx.lineWidth = l.w * 2.6 + Math.random() * 6;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,200,220,0.9)'; ctx.lineWidth = l.w * 0.8;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.lineCap = 'butt';
      drawSpr(GLOW.red, ox, oy, 0, 3);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
}
function drawWorld() {
  // capa terrestre
  for (const e of EN) if (e.ground && e.delay <= 0) drawEnemy(e);
  if (boss && bossDef().ground) drawBossAny(boss);
  drawClouds();
  // sombras de unidades aéreas
  for (const e of EN) if (!e.ground && e.delay <= 0) drawSpr(SHD[e.type], e.x + 20, e.y + 34, (e.type === 'fighter' || e.type === 'kamikaze' || e.type === 'hunter' || e.type === 'debris') ? e.rot : 0, 0.8);
  if (boss && bossDef().shadow) bossDef().shadow(boss);
  if (P.alive) { ctx.save(); ctx.translate(P.x + 22, P.y + 40); ctx.scale((1 - Math.abs(P.bank) * 0.2) * 0.8, 0.8); const s = SHD[SHIP.id]; ctx.drawImage(s, -s.w / 2, -s.h / 2, s.w, s.h); ctx.restore(); }
  // power-ups
  for (const u of PU) {
    const s = 1 + Math.sin(u.tt * 6) * 0.08;
    ctx.globalCompositeOperation = 'lighter'; drawSpr(u.t === 'P' ? GLOW.cyan : u.t === 'S' ? GLOW.green : GLOW.fire, u.x, u.y, 0, 2.2); ctx.globalCompositeOperation = 'source-over';
    drawSpr(SPR['pu' + u.t], u.x, u.y, 0, s);
  }
  drawXP();
  for (const e of EN) if (!e.ground && e.delay <= 0) drawEnemy(e);
  if (boss && !bossDef().ground) drawBossAny(boss);
  ctx.globalCompositeOperation = 'lighter';
  for (const b of pB) {
    if (b.grow) { const k = b.life / b.max; ctx.globalAlpha = Math.min(1, k + 0.25); drawSpr(b.spr, b.x, b.y, 0, 0.5 + (1 - k) * 1.7); ctx.globalAlpha = 1; }
    else drawSpr(b.spr, b.x, b.y, b.rot);
  }
  ctx.globalCompositeOperation = 'source-over';
  drawBeam(); drawUlt();
  drawPlayerFx(); drawEscorts(); drawPlayer();
  // partículas: humo y restos, luego brillos
  for (const p of PA) {
    if (p.smoke) { const k = 1 - p.life / p.max; ctx.globalAlpha = (1 - k) * 0.8; drawSpr(SPR.smoke, p.x, p.y, 0, p.s * (0.8 + k * 1.6)); }
    else if (p.debris) { ctx.globalAlpha = Math.min(1, p.life * 2); ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col; ctx.fillRect(-p.s, -p.s / 2, p.s * 2, p.s); ctx.restore(); }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'lighter';
  for (const p of PA) {
    if (p.smoke || p.debris) continue;
    const a = p.life / p.max, sz = 32 * p.s * (0.4 + 0.6 * a);
    ctx.globalAlpha = a; ctx.drawImage(GLOW[p.c], p.x - sz / 2, p.y - sz / 2, sz, sz);
  }
  ctx.globalAlpha = 1;
  for (const r of RINGS) {
    const k = r.t / r.dur; ctx.strokeStyle = r.c + (1 - k) + ')'; ctx.lineWidth = 8 * (1 - k) + 1;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r * Math.sqrt(k), 0, TAU); ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
  drawLasers();
  const pulse = 1 + Math.sin(G.t * 14) * 0.1;
  for (const b of eB) drawSpr(b.k ? SPR['eo_' + b.k] : b.big ? SPR.eorb2 : SPR.eorb, b.x, b.y, b.k === 'web' ? G.t * 3 : 0, pulse);
  for (const f of FT) {
    const dur = f.big ? 1.6 : 0.8, a = 1 - f.t / dur;
    ctx.globalAlpha = a; txt(f.s, f.x, f.y - f.t * 40, f.big ? 30 : 14, f.col || '#ffffff', 'center', f.big ? (f.col || '#ff2bd6') : null, 900);
  }
  ctx.globalAlpha = 1;
}
const UI = { mute: [W - 96, 40], pause: [W - 40, 40], bomb: [W - 64, 0] };
function drawIconBtn(x, y, r, col) {
  ctx.fillStyle = 'rgba(8,12,28,0.6)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
}
function drawGear() {
  const [x, y] = UI.mute; drawIconBtn(x, y, 22, 'rgba(0,229,255,0.7)');
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#cfefff';
  for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); ctx.fillRect(-2.5, -11, 5, 6); }
  ctx.beginPath(); ctx.arc(0, 0, 7.5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#0a1020'; ctx.beginPath(); ctx.arc(0, 0, 3.2, 0, TAU); ctx.fill(); ctx.restore();
  if (!SET.music && !SET.sfx) { ctx.strokeStyle = '#ff3355'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - 13, y + 13); ctx.lineTo(x + 13, y - 13); ctx.stroke(); }
}
function settingsLayout() {
  const y0 = H * 0.3, rows = [];
  for (let i = 0; i < 3; i++) {
    const y = y0 + i * 96;
    rows.push({ y, tog: { x: W - 140, y: y - 22, w: 104, h: 44 }, minus: { x: 36, y: y + 30, w: 44, h: 40 }, plus: { x: W - 80, y: y + 30, w: 44, h: 40 } });
  }
  return { rows, back: { x: W / 2 - 130, y: y0 + 3 * 96 + 30, w: 260, h: 56 } };
}
function drawSettings() {
  ctx.fillStyle = 'rgba(2,4,12,0.93)'; ctx.fillRect(0, 0, W, H);
  txt('AJUSTES', W / 2, H * 0.17, 44, '#ffffff', 'center', '#00e5ff', 900);
  const L = settingsLayout();
  const items = [['MÚSICA', 'music', 'musicVol', '#ff2bd6'], ['EFECTOS', 'sfx', 'sfxVol', '#00e5ff'], ['VIBRACIÓN', 'vib', null, '#ffb800']];
  items.forEach(([name, key, vk, col], i) => {
    const r = L.rows[i];
    txt(name, 40, r.y, 22, '#ffffff', 'left', null, 900);
    btn(r.tog, SET[key] ? 'SÍ' : 'NO', col, SET[key], 18);
    if (vk) {
      btn(r.minus, '−', col, false, 24); btn(r.plus, '+', col, false, 24);
      const bx = 92, bw = W - 184, v = SET[vk];
      for (let k = 0; k < 10; k++) { ctx.fillStyle = k < Math.round(v * 10) && SET[key] ? col : 'rgba(255,255,255,0.1)'; ctx.fillRect(bx + k * (bw / 10) + 2, r.y + 38, bw / 10 - 4, 24); }
    }
  });
  btn(L.back, 'VOLVER', '#39ff88', true, 20);
}
function btn(r, label, col, active, size = 18) {
  ctx.fillStyle = active ? col + '33' : 'rgba(8,12,28,0.7)';
  rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
  ctx.strokeStyle = active ? col : 'rgba(160,190,220,0.35)'; ctx.lineWidth = active ? 2.5 : 1.5; ctx.stroke();
  txt(label, r.x + r.w / 2, r.y + r.h / 2 + 1, size, active ? '#ffffff' : '#9fb4cc', 'center', active ? col : null, 900);
}
function drawHUD() {
  ctx.fillStyle = lg(ctx, 0, 0, 0, 90, ['rgba(0,0,0,0.65)', 'rgba(0,0,0,0)']); ctx.fillRect(0, 0, W, 90);
  txt(String(score).padStart(8, '0'), 20, 34, 28, '#ffffff', 'left', SHIP.col, 900);
  txt('RÉCORD ' + Math.max(hi, score), 20, 62, 13, '#8fb8d8', 'left', null, 700);
  txt('S-' + level, W - 150, 32, 15, '#ff7ae8', 'center', null, 800);
  txt(D.name, W - 150, 52, 10, D.col, 'center', null, 800);
  txt(coinLabel(runCoins), W - 150, 70, 12, '#ffd23f', 'center', null, 900);
  drawGear();
  const [px, py] = UI.pause; drawIconBtn(px, py, 22, 'rgba(0,229,255,0.7)');
  ctx.fillStyle = '#cfefff'; ctx.fillRect(px - 7, py - 9, 5, 18); ctx.fillRect(px + 2, py - 9, 5, 18);
  txt('ESCUDO', 20, H - 64, 11, '#7fffc0', 'left', null, 800);
  for (let i = 0; i < P.maxShield; i++) {
    const x = 20 + i * 20, y = H - 42;
    ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; ctx.lineTo(x + 8 + Math.cos(a) * 8, y + Math.sin(a) * 8); } ctx.closePath();
    ctx.fillStyle = i < P.shield ? '#39ff88' : 'rgba(57,255,136,0.12)'; ctx.fill();
    ctx.strokeStyle = 'rgba(57,255,136,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  drawProgressHUD(); drawUltBtn(); drawCombo(); drawAmbushWarn();
  const bx = UI.bomb[0], by = H - 74;
  ctx.fillStyle = P.bombs > 0 ? 'rgba(255,120,30,0.18)' : 'rgba(80,80,80,0.2)'; ctx.beginPath(); ctx.arc(bx, by, 40, 0, TAU); ctx.fill();
  ctx.strokeStyle = P.bombs > 0 ? '#ff8a2b' : '#555'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = P.bombs > 0 ? '#ffcf8a' : '#777';
  ctx.beginPath(); ctx.arc(bx, by + 3, 13, 0, TAU); ctx.fill(); ctx.fillRect(bx + 4, by - 15, 6, 7);
  txt('×' + P.bombs, bx, by + 28, 14, '#ffffff', 'center', null, 900);
  if (boss && !boss.dying) {
    const w = W - 80; ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(40, 84, w, 10);
    ctx.fillStyle = lg(ctx, 40, 0, 40 + w, 0, ['#ff2bd6', '#ff3355']); ctx.fillRect(40, 84, w * Math.max(0, boss.hp) / boss.maxhp, 10);
    ctx.strokeStyle = '#ff7ae8'; ctx.lineWidth = 1; ctx.strokeRect(40.5, 84.5, w, 10);
    txt(boss.name, W / 2, 106, 12, '#ffb8f4', 'center', null, 800);
  }
  if (banner) {
    const a = banner.t < 0.3 ? banner.t / 0.3 : banner.t > 2.5 ? (3 - banner.t) / 0.5 : 1;
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = 'rgba(0,10,30,0.55)'; ctx.fillRect(0, H * 0.38 - 50, W, 100);
    txt(banner.a, W / 2, H * 0.38 - 14, 40, '#ffffff', 'center', '#00e5ff', 900);
    txt(banner.b, W / 2, H * 0.38 + 26, 18, '#ff9af0', 'center', null, 700);
    ctx.globalAlpha = 1;
  }
  if (G.phase === 'warn') drawBossIntro();

}
function menuLayout() {
  return {
    diff: DIFFS.map((d, i) => ({ x: 24 + i * 168, y: H * 0.25 + 16, w: 156, h: 50 })),
    left: [44, H * 0.435], right: [W - 44, H * 0.435],
    ship: { x: 90, y: H * 0.435 - 70, w: W - 180, h: 140 },
    start: { x: W / 2 - 150, y: H * 0.86 - 32, w: 300, h: 64 }
  };
}
function wrapText(s, x, y, maxW, lh, size, col) {
  ctx.font = `600 ${size}px ${FONT}`; const words = s.split(' '); let line = '', yy = y;
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) { txt(line, x, yy, size, col, 'center', null, 600); line = w; yy += lh; } else line = t;
  }
  if (line) txt(line, x, yy, size, col, 'center', null, 600);
}
function drawMenu() {
  ctx.fillStyle = 'rgba(2,4,12,0.62)'; ctx.fillRect(0, 0, W, H);
  const L = menuLayout(), S = SHIPS[selShip], y0 = H * 0.09;
  txt('NOVA', W / 2, y0, 64, '#ffffff', 'center', '#00e5ff', 900);
  txt('STRIKE', W / 2, y0 + 56, 48, '#ff2bd6', 'center', '#ff2bd6', 900);
  txt('DEFENSA AÉREA · AÑO 2187', W / 2, y0 + 96, 13, '#8fd8ff', 'center', null, 700);
  txt('DIFICULTAD', W / 2, H * 0.25, 13, '#8fb8d8', 'center', null, 800);
  DIFFS.forEach((d, i) => btn(L.diff[i], d.name, d.col, i === selDiff, 16));
  txt('NAVE  ' + (selShip + 1) + ' / ' + SHIPS.length, W / 2, H * 0.36, 13, '#8fb8d8', 'center', null, 800);
  for (const [p, dir] of [[L.left, -1], [L.right, 1]]) {
    drawIconBtn(p[0], p[1], 26, S.col);
    ctx.fillStyle = '#ffffff'; poly(ctx, [p[0] + dir * 8, p[1], p[0] - dir * 6, p[1] - 10, p[0] - dir * 6, p[1] + 10]); ctx.fill();
  }
  ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW[S.glow], W / 2, H * 0.435, 0, 4); ctx.globalCompositeOperation = 'source-over';
  drawShip(S, W / 2, H * 0.435 + Math.sin(G.t * 2) * 5, 1.15, Math.sin(G.t * 1.3) * 0.15, false);
  txt(S.name, W / 2, H * 0.535, 28, '#ffffff', 'center', S.col, 900);
  txt(S.role.toUpperCase() + ' · ' + S.skill, W / 2, H * 0.535 + 26, 12, S.col, 'center', null, 700);
  txt('ULTRA: ' + ULTS[S.id].name, W / 2, H * 0.535 + 46, 13, '#ffffff', 'center', S.col, 900);
  const stats = ['VELOCIDAD', 'BLINDAJE', 'CADENCIA', 'DAÑO'];
  stats.forEach((n, i) => {
    const y = H * 0.625 + i * 25, v = S.bars[i];
    txt(n, 150, y, 12, '#9fb4cc', 'right', null, 800);
    for (let k = 0; k < 10; k++) { ctx.fillStyle = k < v ? S.col : 'rgba(255,255,255,0.07)'; ctx.fillRect(167 + k * 26, y - 5, 22, 10); }
  });
  wrapText(S.desc, W / 2, H * 0.625 + 4 * 25 + 6, W - 70, 19, 14, '#c8d4e6');
  drawMenuButtons();
  txt('RÉCORD ' + DIFFS[selDiff].name + '  ' + getHi(selDiff), W / 2, H * 0.94, 15, '#ffcf6a', 'center', null, 800);
  drawGear();
}
function pauseLayout() { return { cont: { x: W / 2 - 130, y: H * 0.5, w: 260, h: 56 }, menu: { x: W / 2 - 130, y: H * 0.5 + 76, w: 260, h: 56 } }; }
function drawOver() {
  const a = Math.min(1, overT * 1.5);
  ctx.fillStyle = `rgba(2,4,12,${0.65 * a})`; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = a;
  txt('MISIÓN', W / 2, H * 0.3, 64, '#ffffff', 'center', '#ff3355', 900);
  txt('FALLIDA', W / 2, H * 0.3 + 64, 64, '#ff3355', 'center', '#ff3355', 900);
  txt('PUNTOS', W / 2, H * 0.5, 16, '#8fb8d8', 'center', null, 800);
  txt(String(score), W / 2, H * 0.5 + 36, 46, '#ffffff', 'center', '#00e5ff', 900);
  txt(newRecord ? '¡NUEVO RÉCORD!' : 'RÉCORD  ' + hi, W / 2, H * 0.5 + 84, 20, '#ffcf6a', 'center', newRecord ? '#ffb800' : null, 800);
  txt(SHIP.name + ' · ' + D.name + ' · Sector ' + level, W / 2, H * 0.5 + 116, 16, '#b8c8e0', 'center', null, 600);
  txt('+' + coinLabel(runCoins) + ' monedas  ·  total ' + coinLabel(SAVE.coins), W / 2, H * 0.5 + 146, 16, '#ffd23f', 'center', null, 800);
  if (overT > 1 && Math.floor(G.t * 2) % 2 === 0) txt('TOCA PARA CONTINUAR', W / 2, H * 0.78, 24, '#ffffff', 'center', '#00e5ff', 900);
  ctx.globalAlpha = 1;
}
function render() {
  const k = VS * DPR;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, cv.width, cv.height);
  const sx = shake > 0 ? rand(-shake, shake) * 0.5 : 0, sy = shake > 0 ? rand(-shake, shake) * 0.5 : 0;
  ctx.setTransform(k, 0, 0, k, sx * k, sy * k);
  drawBG();
  const under = G.state === 'settings' ? G.prev : G.state, menuLike = under === 'menu' || under === 'hangar';
  if (menuLike) drawClouds(); else drawWorld();
  ctx.setTransform(k, 0, 0, k, 0, 0);
  if (VIG) ctx.drawImage(VIG, 0, 0, W, H);
  if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * 0.55})`; ctx.fillRect(0, 0, W, H); }
  if (under === 'menu') drawMenu();
  else if (under === 'hangar') drawHangar();
  else {
    drawHUD();
    if (under === 'over') drawOver();
    if (under === 'paused') {
      ctx.fillStyle = 'rgba(2,4,12,0.6)'; ctx.fillRect(0, 0, W, H);
      txt('PAUSA', W / 2, H * 0.38, 60, '#ffffff', 'center', '#00e5ff', 900);
      const pl = pauseLayout(); btn(pl.cont, 'CONTINUAR', '#00e5ff', true, 20); btn(pl.menu, 'MENÚ PRINCIPAL', '#ff2bd6', false, 18);
      drawGear();
    }
  }
  if (G.state === 'settings') drawSettings();
}
