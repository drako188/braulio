'use strict';
/* =====================================================================
   LOGROS Y MISIONES DIARIAS
   ===================================================================== */
SAVE.stats = Object.assign({ kills: 0, elites: 0, tanks: 0, ultras: 0, coins: 0, upgrades: 0, bossShips: [] }, SAVE.stats || {});
SAVE.ach = SAVE.ach || {};
const ST = SAVE.stats;
const RUN = { kills: 0, elites: 0, tanks: 0, ultras: 0, coins: 0, pus: 0, events: 0, bosses: 0, maxCombo: 0, maxLvl: 1, sector: 1 };
const BOSSFIGHT = { hurt: false, bomb: false };
const fullUpgraded = () => Object.values(SAVE.upg).some(u => UPGS.every(([k]) => (u[k] || 0) >= 5));
const upgradesTotal = () => Object.values(SAVE.upg).reduce((s, u) => s + Object.values(u).reduce((a, b) => a + b, 0), 0);

// id, nombre, descripción, recompensa, condición, progreso [actual, meta] opcional
const ACHS = [
  ['first', 'PRIMER DERRIBO', 'Destruye tu primer enemigo', 50, () => ST.kills >= 1],
  ['k500', 'EXTERMINADOR', 'Destruye 500 enemigos', 200, () => ST.kills >= 500, () => [ST.kills, 500]],
  ['k5000', 'LEYENDA DEL AIRE', 'Destruye 5.000 enemigos', 800, () => ST.kills >= 5000, () => [ST.kills, 5000]],
  ...BOSS_DEFS.map((B, i) => ['boss' + i, 'CAZADOR: ' + B.name, 'Derrota a ' + B.name, 150 + i * 50, () => !!SAVE.ach['_b' + i]]),
  ['cycle2', 'CICLO 2', 'Llega al sector 11', 1000, () => RUN.sector >= 11],
  ['c25', 'EN RACHA', 'Consigue un combo de 25', 100, () => RUN.maxCombo >= 25],
  ['c50', 'IMPARABLE', 'Consigue un combo de 50', 300, () => RUN.maxCombo >= 50],
  ['c100', 'FURIA ESTELAR', 'Consigue un combo de 100', 800, () => RUN.maxCombo >= 100],
  ['lvl10', 'NIVEL MÁXIMO', 'Lleva tu nave al nivel 10', 150, () => RUN.maxLvl >= 10],
  ['nohit', 'INTOCABLE', 'Derrota a un jefe sin recibir daño', 500, () => !!SAVE.ach._nohit],
  ['nobomb', 'SIN TRUCOS', 'Derrota a un jefe sin usar bombas', 300, () => !!SAVE.ach._nobomb],
  ['ult1', 'PODER DEFINITIVO', 'Usa tu primer ULTRA', 50, () => ST.ultras >= 1],
  ['ult50', 'MAESTRO ULTRA', 'Usa 50 ULTRA', 400, () => ST.ultras >= 50, () => [ST.ultras, 50]],
  ['elite50', 'CAZA ÉLITES', 'Destruye 50 enemigos élite', 300, () => ST.elites >= 50, () => [ST.elites, 50]],
  ['tank100', 'ROMPETANQUES', 'Destruye 100 tanques', 200, () => ST.tanks >= 100, () => [ST.tanks, 100]],
  ['score250', 'AS DEL ESPACIO', 'Consigue 250.000 puntos en una partida', 500, () => score >= 250000],
  ['score1m', 'MILLONARIO', 'Consigue 1.000.000 de puntos en una partida', 1000, () => score >= 1000000],
  ['coins5k', 'AHORRADOR', 'Recoge 5.000 monedas en total', 300, () => ST.coins >= 5000, () => [Math.floor(ST.coins), 5000]],
  ['allships', 'COLECCIONISTA', 'Desbloquea las 7 naves', 1000, () => SHIPS.every(s => isUnlocked(s.id)), () => [SAVE.unlocked.length, SHIPS.length]],
  ['upg10', 'INGENIERO', 'Compra 10 mejoras', 200, () => upgradesTotal() >= 10, () => [upgradesTotal(), 10]],
  ['upgmax', 'MAESTRO INGENIERO', 'Mejora al máximo una nave', 800, fullUpgraded],
  ['hard5', 'VETERANO', 'Llega al sector 5 en Difícil', 600, () => D.id === 'hard' && RUN.sector >= 5],
  ['versatile', 'PILOTO VERSÁTIL', 'Derrota jefes con 5 naves distintas', 400, () => ST.bossShips.length >= 5, () => [ST.bossShips.length, 5]],
  ['events3', 'SOBREVIVIENTE', 'Supera 3 eventos en una partida', 200, () => RUN.events >= 3],
  ['pu20', 'RECOLECTOR', 'Recoge 20 power-ups en una partida', 150, () => RUN.pus >= 20, () => [RUN.pus, 20]]
];

/* ---------------- Misiones diarias ---------------- */
const MISSION_POOL = [
  ['kills', 'Destruye {n} enemigos', [150, 250, 400], 1],
  ['elites', 'Destruye {n} enemigos élite', [5, 10], 2],
  ['bosses', 'Derrota {n} jefe(s)', [1, 2], 3],
  ['combo', 'Consigue un combo de {n}', [20, 40], 2],
  ['coins', 'Recoge {n} monedas', [100, 250], 1],
  ['ultras', 'Usa el ULTRA {n} veces', [3, 5], 2],
  ['sector', 'Llega al sector {n}', [3, 5], 3],
  ['pus', 'Recoge {n} power-ups', [8, 15], 1],
  ['tanks', 'Destruye {n} tanques', [10, 20], 1],
  ['events', 'Supera {n} eventos aleatorios', [3, 6], 2]
];
function todayKey() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function ensureDaily() {
  const key = todayKey();
  if (SAVE.daily && SAVE.daily.date === key) return;
  let seed = 0; for (const ch of key) seed = seed * 31 + ch.charCodeAt(0);
  const R = mulberry(seed), pool = MISSION_POOL.slice(), ms = [];
  for (let i = 0; i < 3; i++) {
    const [id, txt2, ns, diff] = pool.splice(Math.floor(R() * pool.length), 1)[0];
    const k = Math.floor(R() * ns.length), n = ns[k];
    ms.push({ id, text: txt2.replace('{n}', n.toLocaleString('es')), n, prog: 0, done: false, reward: 60 + diff * 40 + k * 50 });
  }
  SAVE.daily = { date: key, missions: ms }; saveData(true);
}
ensureDaily();
function missionAdd(id, v, isMax) {
  ensureDaily();
  for (const m of SAVE.daily.missions) {
    if (m.id !== id || m.done) continue;
    m.prog = isMax ? Math.max(m.prog, v) : m.prog + v;
    if (m.prog >= m.n) { m.prog = m.n; m.done = true; SAVE.coins += m.reward; toast('MISIÓN CUMPLIDA', m.text, m.reward, '#39ff88'); }
  }
}

/* ---------------- Avisos ---------------- */
const TOASTS = [];
function toast(title, text, reward, col) { TOASTS.push({ title, text, reward, col, t: 0 }); SFX.ultReady(); saveData(true); }
function drawToasts() {
  if (!TOASTS.length) return;
  const T = TOASTS[0]; T.t += 1 / 60;
  if (T.t > 3.2) { TOASTS.shift(); return; }
  const k = Math.min(1, T.t * 4, (3.2 - T.t) * 4), y = 128 - (1 - k) * 60;
  ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(8,10,24,0.92)'; rr(ctx, 30, y - 30, W - 60, 60, 12); ctx.fill();
  ctx.strokeStyle = T.col; ctx.lineWidth = 2; ctx.stroke();
  drawTrophy(64, y, 15, T.col);
  txt(T.title, 92, y - 12, 13, T.col, 'left', null, 900);
  txt(T.text, 92, y + 8, 14, '#ffffff', 'left', null, 700);
  if (T.reward) txt('+' + T.reward + ' ◎', W - 44, y, 15, '#ffd23f', 'right', null, 900);
  ctx.globalAlpha = 1;
}
function drawTrophy(x, y, s, col) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - s * 0.7, y - s * 0.8); ctx.lineTo(x + s * 0.7, y - s * 0.8); ctx.quadraticCurveTo(x + s * 0.7, y + s * 0.2, x, y + s * 0.25); ctx.quadraticCurveTo(x - s * 0.7, y + s * 0.2, x - s * 0.7, y - s * 0.8); ctx.fill();
  ctx.fillRect(x - s * 0.12, y + s * 0.2, s * 0.24, s * 0.4); ctx.fillRect(x - s * 0.45, y + s * 0.55, s * 0.9, s * 0.2);
  ctx.strokeStyle = col; ctx.lineWidth = s * 0.15; ctx.beginPath(); ctx.arc(x - s * 0.7, y - s * 0.4, s * 0.3, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke(); ctx.beginPath(); ctx.arc(x + s * 0.7, y - s * 0.4, s * 0.3, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
}

/* ---------------- Comprobación ---------------- */
function checkAch() {
  for (const [id, name, , reward, cond] of ACHS) {
    if (SAVE.ach[id]) continue;
    let ok = false; try { ok = cond(); } catch (e) { }
    if (ok) { SAVE.ach[id] = 1; SAVE.coins += reward; toast('¡LOGRO DESBLOQUEADO!', name, reward, '#ffd23f'); }
  }
}
const ACH = {
  start() { Object.assign(RUN, { kills: 0, elites: 0, tanks: 0, ultras: 0, coins: 0, pus: 0, events: 0, bosses: 0, maxCombo: 0, maxLvl: P.lvl, sector: 1 }); },
  kill(e) {
    ST.kills++; RUN.kills++; missionAdd('kills', 1);
    if (e.elite) { ST.elites++; RUN.elites++; missionAdd('elites', 1); }
    if (e.type === 'tank') { ST.tanks++; RUN.tanks++; missionAdd('tanks', 1); }
    checkAch();
  },
  combo(n) { if (n > RUN.maxCombo) { RUN.maxCombo = n; missionAdd('combo', n, true); if (n % 5 === 0) checkAch(); } },
  lvl(l) { RUN.maxLvl = Math.max(RUN.maxLvl, l); checkAch(); },
  ultra() { ST.ultras++; RUN.ultras++; missionAdd('ultras', 1); checkAch(); },
  coins(c) { ST.coins += c; RUN.coins += c; missionAdd('coins', c); },
  pu() { RUN.pus++; missionAdd('pus', 1); checkAch(); },
  event() { RUN.events++; missionAdd('events', 1); checkAch(); },
  sector(l) { RUN.sector = Math.max(RUN.sector, l); missionAdd('sector', l, true); checkAch(); },
  bossStart() { BOSSFIGHT.hurt = false; BOSSFIGHT.bomb = false; },
  bossKill(idx) {
    RUN.bosses++; missionAdd('bosses', 1);
    SAVE.ach['_b' + idx] = 1;
    if (!BOSSFIGHT.hurt) SAVE.ach._nohit = 1;
    if (!BOSSFIGHT.bomb) SAVE.ach._nobomb = 1;
    if (!ST.bossShips.includes(SHIP.id)) ST.bossShips.push(SHIP.id);
    checkAch();
  },
  shop() { checkAch(); },
  runEnd() { checkAch(); saveData(true); }
};

/* ---------------- Pantalla de logros y misiones ---------------- */
let achScroll = 0, achDragY = null;
const ACH_BTN = () => [40, 78];
function drawAchButton() {
  const [x, y] = ACH_BTN(), n = ACHS.filter(a => SAVE.ach[a[0]]).length;
  drawIconBtn(x, y, 24, 'rgba(255,210,63,0.8)'); drawTrophy(x, y - 1, 11, '#ffd23f');
  txt(n + '/' + ACHS.length, x, y + 34, 11, '#ffd23f', 'center', null, 800);
  const pending = SAVE.daily && SAVE.daily.missions.some(m => !m.done);
  if (pending) { ctx.fillStyle = '#ff3355'; ctx.beginPath(); ctx.arc(x + 17, y - 17, 6, 0, TAU); ctx.fill(); }
}
function achLayout() { return { back: { x: W / 2 - 120, y: H - 82, w: 240, h: 56 }, listTop: H * 0.47, listBottom: H - 96, rowH: 62 }; }
function drawAchievements() {
  ctx.fillStyle = 'rgba(2,4,12,0.94)'; ctx.fillRect(0, 0, W, H);
  ensureDaily();
  const L = achLayout();
  txt('MISIONES DE HOY', W / 2, H * 0.06, 24, '#ffffff', 'center', '#39ff88', 900);
  SAVE.daily.missions.forEach((m, i) => {
    const y = H * 0.09 + i * 62;
    ctx.fillStyle = m.done ? 'rgba(57,255,136,0.12)' : 'rgba(255,255,255,0.05)'; rr(ctx, 20, y, W - 40, 54, 10); ctx.fill();
    ctx.strokeStyle = m.done ? '#39ff88' : 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5; ctx.stroke();
    txt(m.text, 34, y + 18, 15, '#ffffff', 'left', null, 800);
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(34, y + 34, W - 200, 8);
    ctx.fillStyle = m.done ? '#39ff88' : '#00e5ff'; ctx.fillRect(34, y + 34, (W - 200) * m.prog / m.n, 8);
    txt(m.done ? '✔ HECHA' : Math.floor(m.prog).toLocaleString('es') + ' / ' + m.n.toLocaleString('es'), W - 150, y + 38, 11, m.done ? '#39ff88' : '#9fb4cc', 'left', null, 800);
    txt('+' + m.reward + ' ◎', W - 34, y + 18, 14, '#ffd23f', 'right', null, 900);
  });
  const got = ACHS.filter(a => SAVE.ach[a[0]]).length;
  txt('LOGROS  ' + got + ' / ' + ACHS.length, W / 2, L.listTop - 24, 22, '#ffffff', 'center', '#ffd23f', 900);
  const maxScroll = Math.max(0, ACHS.length * L.rowH - (L.listBottom - L.listTop));
  achScroll = clamp(achScroll, 0, maxScroll);
  ctx.save(); ctx.beginPath(); ctx.rect(0, L.listTop, W, L.listBottom - L.listTop); ctx.clip();
  ACHS.forEach(([id, name, desc, reward, , prog], i) => {
    const y = L.listTop + i * L.rowH - achScroll;
    if (y < L.listTop - L.rowH || y > L.listBottom) return;
    const ok = !!SAVE.ach[id];
    ctx.fillStyle = ok ? 'rgba(255,210,63,0.1)' : 'rgba(255,255,255,0.04)'; rr(ctx, 20, y + 3, W - 40, L.rowH - 8, 10); ctx.fill();
    drawTrophy(48, y + L.rowH / 2, 13, ok ? '#ffd23f' : 'rgba(160,170,190,0.35)');
    txt(name, 72, y + 20, 14, ok ? '#ffd23f' : '#c8d4e6', 'left', null, 900);
    txt(desc, 72, y + 40, 12, '#8fa0b8', 'left', null, 600);
    txt(ok ? '✔' : '+' + reward + ' ◎', W - 34, y + 22, 13, ok ? '#39ff88' : '#ffd23f', 'right', null, 900);
    if (!ok && prog) { const [a, b] = prog(); txt(Math.min(a, b).toLocaleString('es') + '/' + b.toLocaleString('es'), W - 34, y + 42, 11, '#8fa0b8', 'right', null, 700); }
  });
  ctx.restore();
  if (maxScroll > 0) { const h = (L.listBottom - L.listTop), bh = h * h / (h + maxScroll); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(W - 10, L.listTop + (h - bh) * achScroll / maxScroll, 4, bh); }
  btn(L.back, 'VOLVER', '#39ff88', true, 20);
}
function achTapDown(x, y) {
  const L = achLayout();
  if (inR(x, y, L.back)) { G.state = 'menu'; SFX.ui(); return; }
  achDragY = y;
}
function achMove(y) { if (achDragY === null) return; achScroll -= y - achDragY; achDragY = y; }
addEventListener('wheel', e => { if (G.state === 'achievements') achScroll += e.deltaY * 0.6; }, { passive: true });
