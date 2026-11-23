'use strict';
/* =====================================================================
   TIENDA — monedas persistentes, hangar de mejoras y naves desbloqueables
   ===================================================================== */
const SAVE = { coins: 0, upg: {}, unlocked: ['falcon', 'rayo', 'titan'] };
try { Object.assign(SAVE, JSON.parse(localStorage.getItem('ns_save') || '{}')); } catch (e) { }
let saveT = 0;
function saveData(force) {
  const now = performance.now();
  if (!force && now - saveT < 1000) return;
  saveT = now; try { localStorage.setItem('ns_save', JSON.stringify(SAVE)); } catch (e) { }
}
const SHIP_PRICE = { spectre: 600, sentinel: 900, fenix: 1400, vortex: 2000 };
const isUnlocked = id => SAVE.unlocked.includes(id);
const UPGS = [
  ['arm', 'BLINDAJE', '+1 escudo máximo · +1 inicial cada 2 niveles', '#39ff88'],
  ['dmg', 'DAÑO', '+6 % de daño por nivel', '#ff5a3a'],
  ['rate', 'CADENCIA', '+4 % de velocidad de disparo por nivel', '#ffe14d'],
  ['ult', 'ULTRA', '+15 % de carga del ULTRA por nivel', '#ff2bd6'],
  ['mag', 'IMÁN', 'Atrae cristales y monedas desde más lejos', '#00e5ff']
];
const UPG_COST = [80, 180, 350, 600, 1000];
const upg = (k, id = SHIP.id) => (SAVE.upg[id] || {})[k] || 0;
const COIN_MULT = { easy: 0.8, normal: 1, hard: 1.5 };
const startShield = () => SHIP.armor + D.armor + Math.floor(upg('arm') / 2);

/* ---------------- Monedas en partida ---------------- */
SPR.coin = sprite(20, 20, g => {
  g.fillStyle = radial(g, 8, 8, 12, [[0, '#fff6c0'], [0.5, '#ffc83a'], [1, '#a06a00']]); g.beginPath(); g.arc(10, 10, 9, 0, TAU); g.fill();
  g.strokeStyle = '#7a4a00'; g.lineWidth = 1.5; g.stroke();
  g.strokeStyle = '#fff3b0'; g.lineWidth = 1.5; g.beginPath(); g.arc(10, 10, 5, 0, TAU); g.stroke();
});
SPR.coinBig = sprite(30, 30, g => {
  g.fillStyle = radial(g, 12, 12, 18, [[0, '#ffffff'], [0.4, '#ffd23f'], [1, '#a06a00']]); g.beginPath(); g.arc(15, 15, 13, 0, TAU); g.fill();
  g.strokeStyle = '#7a4a00'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#7a4a00'; g.font = `900 14px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('5', 15, 16);
});
let runCoins = 0;
function dropCoins(x, y, n) {
  n = Math.round(n); if (n <= 0) return;
  const big = Math.floor(n / 5), small = Math.min(10, n - big * 5);
  for (let i = 0; i < Math.min(big, 12) + small; i++) {
    const a = rand(0, TAU), v = rand(60, 200);
    XC.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, v: i < big ? 5 : 1, t: 0, coin: true });
  }
}
function coinsForKill(e, big) {
  let n = 0;
  if (big) n = rand(3, 7);
  else if (Math.random() < 0.3) n = Math.max(1, e.score / 150);
  if (e.elite) n = Math.max(3, n * 3);
  return n;
}
function addCoins(v) {
  const c = v * COIN_MULT[D.id]; runCoins += c; SAVE.coins += c; ACH.coins(c); saveData();
}
const magRadius = () => 95 + upg('mag') * 30;

/* ---------------- Hangar ---------------- */
let hangarMsg = null;
function buyUpgrade(k) {
  const id = SHIPS[selShip].id, lv = upg(k, id);
  if (!isUnlocked(id) || lv >= 5) return;
  const cost = UPG_COST[lv];
  if (SAVE.coins < cost) { hangarMsg = { t: 1.5, s: 'Monedas insuficientes', col: '#ff7a8a' }; SFX.tink(); return; }
  SAVE.coins -= cost; (SAVE.upg[id] || (SAVE.upg[id] = {}))[k] = lv + 1; saveData(true);
  hangarMsg = { t: 1.5, s: '¡Mejora comprada!', col: '#39ff88' }; SFX.power(); ACH.shop();
}
function buyShip(id) {
  const cost = SHIP_PRICE[id];
  if (isUnlocked(id) || !cost) return;
  if (SAVE.coins < cost) { hangarMsg = { t: 1.5, s: 'Monedas insuficientes', col: '#ff7a8a' }; SFX.tink(); return; }
  SAVE.coins -= cost; SAVE.unlocked.push(id); saveData(true);
  hangarMsg = { t: 2, s: '¡' + SHIPS.find(s => s.id === id).name + ' desbloqueada!', col: '#ffd23f' }; SFX.levelUp(); ACH.shop();
}
function hangarLayout() {
  const top = H * 0.34, rowH = Math.min(86, (H - 120 - top) / 5);
  return {
    left: [44, H * 0.2], right: [W - 44, H * 0.2],
    rows: UPGS.map((u, i) => ({ y: top + i * rowH, h: rowH, buy: { x: W - 132, y: top + i * rowH + rowH / 2 - 22, w: 110, h: 44 } })),
    unlock: { x: W / 2 - 140, y: H * 0.5, w: 280, h: 60 },
    back: { x: W / 2 - 120, y: H - 92, w: 240, h: 56 }
  };
}
function coinLabel(n) { return '◎ ' + Math.floor(n).toLocaleString('es'); }
function drawHangar() {
  ctx.fillStyle = 'rgba(2,4,12,0.9)'; ctx.fillRect(0, 0, W, H);
  const L = hangarLayout(), S = SHIPS[selShip], unl = isUnlocked(S.id);
  txt('HANGAR', W / 2, H * 0.06, 36, '#ffffff', 'center', '#00e5ff', 900);
  txt(coinLabel(SAVE.coins), W / 2, H * 0.06 + 34, 20, '#ffd23f', 'center', '#ff9a00', 900);
  for (const [p, dir] of [[L.left, -1], [L.right, 1]]) {
    drawIconBtn(p[0], p[1], 26, S.col);
    ctx.fillStyle = '#ffffff'; poly(ctx, [p[0] + dir * 8, p[1], p[0] - dir * 6, p[1] - 10, p[0] - dir * 6, p[1] + 10]); ctx.fill();
  }
  ctx.globalCompositeOperation = 'lighter'; drawSpr(GLOW[S.glow], W / 2, H * 0.2, 0, 3); ctx.globalCompositeOperation = 'source-over';
  if (!unl) ctx.globalAlpha = 0.35;
  drawShip(S, W / 2, H * 0.2, 0.9, 0, false); ctx.globalAlpha = 1;
  txt(S.name, W / 2, H * 0.29, 22, '#ffffff', 'center', S.col, 900);
  if (!unl) {
    drawLock(W / 2, H * 0.2);
    txt('Nave bloqueada', W / 2, H * 0.42, 18, '#c8d4e6', 'center', null, 700);
    btn(L.unlock, 'DESBLOQUEAR  ' + coinLabel(SHIP_PRICE[S.id]), '#ffd23f', SAVE.coins >= SHIP_PRICE[S.id], 18);
  } else {
    UPGS.forEach(([k, name, desc, col], i) => {
      const r = L.rows[i], lv = upg(k, S.id), cy = r.y + r.h / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; rr(ctx, 16, r.y + 4, W - 32, r.h - 8, 10); ctx.fill();
      txt(name, 30, cy - 14, 17, col, 'left', null, 900);
      ctx.font = `600 11px ${FONT}`; txt(desc, 30, cy + 4, 11, '#9fb4cc', 'left', null, 600);
      for (let q = 0; q < 5; q++) { ctx.fillStyle = q < lv ? col : 'rgba(255,255,255,0.1)'; ctx.fillRect(30 + q * 22, cy + 16, 18, 7); }
      if (lv >= 5) btn(r.buy, 'MÁX', col, false, 16);
      else btn(r.buy, coinLabel(UPG_COST[lv]), col, SAVE.coins >= UPG_COST[lv], 14);
    });
  }
  btn(L.back, 'VOLVER', '#39ff88', true, 20);
  if (hangarMsg && hangarMsg.t > 0) { hangarMsg.t -= 1 / 60; txt(hangarMsg.s, W / 2, H - 118, 16, hangarMsg.col, 'center', null, 800); }
}
function drawLock(x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y - 6, 9, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = '#ffd23f'; rr(ctx, x - 13, y - 6, 26, 20, 4); ctx.fill();
  ctx.fillStyle = '#3a2a00'; ctx.fillRect(x - 2, y, 4, 8);
}
function hangarTap(x, y) {
  const L = hangarLayout(), S = SHIPS[selShip];
  if (near(x, y, L.left, 40)) return changeShip(-1);
  if (near(x, y, L.right, 40)) return changeShip(1);
  if (inR(x, y, L.back)) { G.state = 'menu'; SFX.ui(); return; }
  if (!isUnlocked(S.id)) { if (inR(x, y, L.unlock)) buyShip(S.id); return; }
  UPGS.forEach(([k], i) => { if (inR(x, y, L.rows[i].buy)) buyUpgrade(k); });
}
/* botones del menú principal */
function menuButtons() { return { hangar: { x: 20, y: H * 0.86 - 32, w: 128, h: 64 }, endless: { x: 156, y: H * 0.86 - 32, w: 128, h: 64 }, start: { x: 292, y: H * 0.86 - 32, w: W - 312, h: 64 } }; }
function drawMenuButtons() {
  const B = menuButtons(), S = SHIPS[selShip], pulse = 0.85 + Math.sin(G.t * 4) * 0.15;
  btn(B.hangar, 'HANGAR', '#ffd23f', false, 17);
  btn(B.endless, '∞ INFINITO', '#c86bff', false, 16);
  if (isUnlocked(S.id)) { ctx.globalAlpha = pulse; btn(B.start, 'HISTORIA', S.col, true, 22); ctx.globalAlpha = 1; }
  else btn(B.start, 'COMPRAR ' + coinLabel(SHIP_PRICE[S.id]), '#ffd23f', SAVE.coins >= SHIP_PRICE[S.id], 17);
  txt(coinLabel(SAVE.coins), 22, 30, 18, '#ffd23f', 'left', '#ff9a00', 900);
  if (!isUnlocked(S.id)) drawLock(W / 2, H * 0.435);
  if (hangarMsg && hangarMsg.t > 0) { hangarMsg.t -= 1 / 60; txt(hangarMsg.s, W / 2, H * 0.86 - 48, 15, hangarMsg.col, 'center', null, 800); }
}
function menuButtonsTap(x, y) {
  const B = menuButtons(), S = SHIPS[selShip];
  if (inR(x, y, B.hangar)) { G.state = 'hangar'; SFX.ui(); return true; }
  if (inR(x, y, B.start)) { if (isUnlocked(S.id)) startStory(); else buyShip(S.id); return true; }
  if (inR(x, y, B.endless)) { if (isUnlocked(S.id)) startEndless(); else buyShip(S.id); return true; }
  return false;
}
