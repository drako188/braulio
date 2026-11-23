'use strict';
/* =====================================================================
   INGRESOS — anuncios con recompensa, intersticiales y tienda (compras)
   En Android usa el puente nativo window.NSNative (AdMob + Google Play Billing).
   En el navegador simula los anuncios para poder probar el flujo.
   ===================================================================== */
const NATIVE = window.NSNative || null;
SAVE.owned = SAVE.owned || {};
const PRODUCTS = [
  { id: 'starter_pack', name: 'PACK PILOTO', desc: 'Desbloquea las 7 naves + 3.000 monedas', price: '2,99 US$', col: '#ffd23f', perm: true },
  { id: 'remove_ads', name: 'SIN ANUNCIOS', desc: 'Quita los anuncios entre partidas para siempre', price: '1,99 US$', col: '#39ff88', perm: true },
  { id: 'coins_small', name: '2.500 MONEDAS', desc: 'Bolsa de monedas', price: '0,99 US$', col: '#00e5ff', coins: 2500 },
  { id: 'coins_medium', name: '8.000 MONEDAS', desc: 'Cofre de monedas · +60 % extra', price: '2,49 US$', col: '#c86bff', coins: 8000 },
  { id: 'coins_large', name: '20.000 MONEDAS', desc: 'Bóveda de monedas · el mejor valor', price: '4,99 US$', col: '#ff2bd6', coins: 20000 }
];
const FREE_COINS = 200, FREE_PER_DAY = 3;
const noAds = () => !!SAVE.owned.remove_ads;

/* ---------------- Puente nativo ---------------- */
const pendingReward = {};
window.onNative = (ev, data) => {
  switch (ev) {
    case 'reward': { const cb = pendingReward[data]; delete pendingReward[data]; if (cb) cb(); break; }
    case 'rewardFail': delete pendingReward[data]; toast('ANUNCIO', 'No se completó el anuncio. Inténtalo de nuevo.', 0, '#ff7a8a'); break;
    case 'prices': try { const p = JSON.parse(data); for (const pr of PRODUCTS) if (p[pr.id]) pr.price = p[pr.id]; } catch (e) { } break;
    case 'purchase': { const pr = PRODUCTS.find(x => x.id === data); if (pr && pr.coins) { SAVE.coins += pr.coins; toast('¡COMPRA REALIZADA!', pr.name, pr.coins, '#ffd23f'); saveData(true); } break; }
    case 'owned': grantPermanent(data); break;
    case 'purchaseFail': toast('COMPRA', 'No se pudo completar la compra.', 0, '#ff7a8a'); break;
  }
};
function grantPermanent(id) {
  if (SAVE.owned[id]) return;
  SAVE.owned[id] = 1;
  if (id === 'starter_pack') { for (const s of SHIPS) if (!isUnlocked(s.id)) SAVE.unlocked.push(s.id); SAVE.coins += 3000; toast('¡PACK PILOTO!', 'Todas las naves desbloqueadas', 3000, '#ffd23f'); }
  if (id === 'remove_ads') toast('¡GRACIAS!', 'Anuncios eliminados', 0, '#39ff88');
  saveData(true);
}

/* ---------------- Anuncios ---------------- */
let FAKEAD = null;
function showRewarded(tag, cb) {
  if (NATIVE) { pendingReward[tag] = cb; NATIVE.showRewarded(tag); return; }
  FAKEAD = { t: 0, cb, prev: G.state }; G.state = 'ad';
}
function updateFakeAd(dt) { if (!FAKEAD) return; FAKEAD.t += dt; if (FAKEAD.t >= 3) { const f = FAKEAD; FAKEAD = null; G.state = f.prev; f.cb(); } }
function drawFakeAd() {
  if (!FAKEAD) return;
  ctx.fillStyle = '#0a0a12'; ctx.fillRect(0, 0, W, H);
  txt('ANUNCIO DE PRUEBA', W / 2, H * 0.42, 30, '#ffffff', 'center', null, 900);
  txt('En Android aquí se muestra un anuncio real de AdMob', W / 2, H * 0.47, 14, '#9fb4cc', 'center', null, 600);
  txt('Recompensa en ' + Math.ceil(3 - FAKEAD.t) + '…', W / 2, H * 0.53, 18, '#ffd23f', 'center', null, 800);
}
let gamesSinceAd = 0;
function maybeInterstitial(runSeconds) {
  if (noAds() || !NATIVE || runSeconds < 45) return;
  gamesSinceAd++;
  if (gamesSinceAd >= 3) { gamesSinceAd = 0; NATIVE.showInterstitial(); }
}

/* ---------------- Fin de partida: revivir y doblar monedas ---------------- */
const OVERRUN = { revived: false, doubled: false };
function overButtons() {
  const y = H * 0.66;
  return { revive: { x: W / 2 - 160, y, w: 320, h: 56 }, double: { x: W / 2 - 160, y: y + 68, w: 320, h: 50 }, menu: { x: W / 2 - 110, y: y + 132, w: 220, h: 50 } };
}
function drawOverButtons() {
  if (overT < 1) return;
  const B = overButtons();
  if (!OVERRUN.revived) btn(B.revive, '▶ REVIVIR  (ver anuncio)', '#39ff88', true, 18);
  if (!OVERRUN.doubled && runCoins >= 5) btn(B.double, '◎ ×2 MONEDAS  (ver anuncio)', '#ffd23f', true, 16);
  btn(B.menu, 'MENÚ', '#9fb4cc', false, 18);
}
function overTap(x, y) {
  if (overT < 1) return;
  const B = overButtons();
  if (!OVERRUN.revived && inR(x, y, B.revive)) { showRewarded('revive', revivePlayer); return; }
  if (!OVERRUN.doubled && runCoins >= 5 && inR(x, y, B.double)) {
    showRewarded('double', () => { OVERRUN.doubled = true; SAVE.coins += runCoins; toast('¡MONEDAS DOBLADAS!', '+' + Math.floor(runCoins) + ' monedas', 0, '#ffd23f'); runCoins *= 2; saveData(true); });
    return;
  }
  if (inR(x, y, B.menu)) { G.state = 'menu'; maybeInterstitial(RUNTIME.t); }
}
function revivePlayer() {
  OVERRUN.revived = true;
  P.alive = true; P.deadT = 0; P.lives = 1; P.shield = startShield(); P.inv = 3.5; P.x = P.tx = W / 2; P.y = P.ty = H - 180;
  eB.length = 0; LASERS = []; G.state = 'play'; flash = 0.6;
  FT.push({ x: W / 2, y: H * 0.5, t: 0, s: '¡DE VUELTA AL COMBATE!', big: true, col: '#39ff88' });
  setMusic(boss ? 'boss' : 'stage', boss ? boss.idx : level);
}
const RUNTIME = { t: 0 };

/* ---------------- Tienda ---------------- */
function freeLeft() { const k = todayKey(); if (!SAVE.freeAd || SAVE.freeAd.date !== k) SAVE.freeAd = { date: k, n: 0 }; return FREE_PER_DAY - SAVE.freeAd.n; }
const STORE_BTN = () => [W - 40, 40];
function drawStoreButton() {
  const [x, y] = STORE_BTN(); drawIconBtn(x, y, 22, 'rgba(255,210,63,0.8)');
  ctx.fillStyle = '#ffd23f'; poly(ctx, [x - 11, y - 7, x + 11, y - 7, x + 8, y + 5, x - 8, y + 5]); ctx.fill();
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 14, y - 11); ctx.lineTo(x - 11, y - 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(x - 6, y + 10, 2.5, 0, TAU); ctx.arc(x + 6, y + 10, 2.5, 0, TAU); ctx.fill();
  if (freeLeft() > 0) { ctx.fillStyle = '#ff3355'; ctx.beginPath(); ctx.arc(x + 16, y - 16, 6, 0, TAU); ctx.fill(); }
}
function storeLayout() {
  const top = H * 0.27, rh = 86;
  return { free: { x: 20, y: H * 0.13, w: W - 40, h: 70 }, rows: PRODUCTS.map((p, i) => ({ y: top + i * rh, h: rh - 10, buy: { x: W - 150, y: top + i * rh + 16, w: 126, h: 44 } })), back: { x: W / 2 - 120, y: H - 82, w: 240, h: 56 } };
}
function drawStore() {
  ctx.fillStyle = 'rgba(2,4,12,0.94)'; ctx.fillRect(0, 0, W, H);
  const L = storeLayout();
  txt('TIENDA', W / 2, H * 0.05, 34, '#ffffff', 'center', '#ffd23f', 900);
  txt(coinLabel(SAVE.coins), W / 2, H * 0.05 + 32, 18, '#ffd23f', 'center', null, 900);
  const fl = freeLeft();
  ctx.fillStyle = 'rgba(57,255,136,0.1)'; rr(ctx, L.free.x, L.free.y, L.free.w, L.free.h, 12); ctx.fill();
  ctx.strokeStyle = fl > 0 ? '#39ff88' : 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2; ctx.stroke();
  txt('MONEDAS GRATIS', 40, L.free.y + 24, 17, '#39ff88', 'left', null, 900);
  txt('Mira un anuncio y gana ' + FREE_COINS + ' monedas · quedan ' + fl + ' hoy', 40, L.free.y + 48, 12, '#c8d4e6', 'left', null, 600);
  txt(fl > 0 ? '▶ +' + FREE_COINS : 'MAÑANA', W - 44, L.free.y + 35, 18, fl > 0 ? '#ffd23f' : '#6f8098', 'right', null, 900);
  PRODUCTS.forEach((p, i) => {
    const r = L.rows[i], owned = p.perm && SAVE.owned[p.id];
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; rr(ctx, 20, r.y, W - 40, r.h, 12); ctx.fill();
    ctx.strokeStyle = p.col + '88'; ctx.lineWidth = 1.5; ctx.stroke();
    txt(p.name, 40, r.y + 26, 18, p.col, 'left', null, 900);
    txt(p.desc, 40, r.y + 50, 12, '#c8d4e6', 'left', null, 600);
    if (owned) btn(r.buy, 'COMPRADO', p.col, false, 14);
    else btn(r.buy, NATIVE ? p.price : p.price + '*', p.col, true, 15);
  });
  if (!NATIVE) txt('* Las compras solo funcionan en la app de Android', W / 2, L.rows[PRODUCTS.length - 1].y + 96, 12, '#8fa0b8', 'center', null, 600);
  btn(L.back, 'VOLVER', '#39ff88', true, 20);
}
function storeTap(x, y) {
  const L = storeLayout();
  if (inR(x, y, L.back)) { G.state = 'menu'; SFX.ui(); return; }
  if (inR(x, y, L.free) && freeLeft() > 0) {
    showRewarded('free', () => { SAVE.freeAd.n++; SAVE.coins += FREE_COINS; toast('MONEDAS GRATIS', 'Gracias por apoyar el juego', FREE_COINS, '#39ff88'); saveData(true); });
    return;
  }
  PRODUCTS.forEach((p, i) => {
    if (!inR(x, y, L.rows[i].buy) || (p.perm && SAVE.owned[p.id])) return;
    if (NATIVE) NATIVE.buy(p.id);
    else toast('TIENDA', 'Las compras solo funcionan en la app de Android', 0, '#9fb4cc');
  });
}
