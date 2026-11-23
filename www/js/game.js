'use strict';
/* ---------------- Naves y dificultad ---------------- */
const SHIPS = [
  { id: 'falcon', name: 'HALCÓN', role: 'Equilibrado', col: '#00e5ff', glow: 'cyan', bars: [6, 6, 6, 5], speed: 1, armor: 3, maxArmor: 5, rate: 0.1, dmg: 1, hit: 9, bombs: 2, weapon: 'plasma', flame: 'flame',
    flames: [[-22, 38, 18, 40], [0, 42, 14, 30]], skill: 'Empieza en nivel 3',
    desc: 'Plasma en abanico. Rinde bien en todo, sin puntos débiles.' },
  { id: 'rayo', name: 'RAYO', role: 'Interceptor', col: '#ffe14d', glow: 'yellow', bars: [10, 4, 10, 4], speed: 1.45, armor: 2, maxArmor: 4, rate: 0.065, dmg: 0.75, hit: 7, bombs: 1, weapon: 'needle', flame: 'flameY',
    flames: [[0, 40, 24, 56]], skill: 'Blanco pequeño · máxima cadencia',
    desc: 'La nave más veloz. Dispara agujas sin parar, pero aguanta pocos golpes.' },
  { id: 'titan', name: 'TITÁN', role: 'Acorazado', col: '#39ff88', glow: 'green', bars: [5, 10, 3, 10], speed: 0.72, armor: 5, maxArmor: 7, rate: 0.17, dmg: 2, hit: 12, bombs: 3, weapon: 'cannon', flame: 'flameG',
    flames: [[-34, 40, 13, 28], [-12, 40, 13, 28], [12, 40, 13, 28], [34, 40, 13, 28]], skill: 'Autorreparación: +1 escudo cada 25 s',
    desc: 'Blindaje enorme y obuses pesados. Lento y fácil de alcanzar.' },
  { id: 'spectre', name: 'ESPECTRO', role: 'Táctico', col: '#c86bff', glow: 'purple', bars: [7, 6, 5, 4], speed: 1.1, armor: 3, maxArmor: 4, rate: 0.13, dmg: 0.8, hit: 8, bombs: 2, weapon: 'wave', flame: 'flameP',
    flames: [[-26, 26, 12, 26], [26, 26, 12, 26]], skill: 'Misiles desde el inicio · ondas perforantes',
    desc: 'Ondas que atraviesan enemigos y misiles teledirigidos. Cañón de poco daño.' }
];
const DIFFS = [
  { id: 'easy', name: 'FÁCIL', col: '#39ff88', hp: 0.8, bullet: 0.88, fire: 0.8, armor: 1, score: 0.7, spawn: 1.1, drop: 1.3, dbl: 0.06, lead: 0.15, inv: 2.4, elite: 0.05 },
  { id: 'normal', name: 'INTERMEDIO', col: '#00e5ff', hp: 1.15, bullet: 1.12, fire: 1.3, armor: 0, score: 1, spawn: 0.78, drop: 0.85, dbl: 0.25, lead: 0.5, inv: 1.7, elite: 0.12 },
  { id: 'hard', name: 'DIFÍCIL', col: '#ff3355', hp: 1.6, bullet: 1.3, fire: 1.7, armor: 0, score: 1.6, spawn: 0.62, drop: 0.6, dbl: 0.4, lead: 0.8, inv: 1.3, elite: 0.22 }
];
let selShip = 0, selDiff = 1;
try {
  selShip = clamp(parseInt(localStorage.getItem('ns_ship') || '0', 10) || 0, 0, SHIPS.length - 1);
  selDiff = clamp(parseInt(localStorage.getItem('ns_diff') || '1', 10), 0, 2);
  if (isNaN(selDiff)) selDiff = 1;
} catch (e) { }
let SHIP = SHIPS[selShip], D = DIFFS[selDiff];
function getHi(d) { try { return +localStorage.getItem('ns_hi_' + DIFFS[d].id) || 0; } catch (e) { return 0; } }
function saveSel() { try { localStorage.setItem('ns_ship', selShip); localStorage.setItem('ns_diff', selDiff); } catch (e) { } }

/* ---------------- Estado del juego ---------------- */
const G = { state: 'menu', phase: 'waves', t: 0 };
let P = null, pB = [], eB = [], EN = [], PA = [], PU = [], RINGS = [], FT = [], LASERS = [];
let score = 0, hi = getHi(selDiff), level = 1, stageT = 0, waveT = 0, boss = null, warnT = 0, shake = 0, flash = 0, banner = null, overT = 0, newRecord = false;

function startGame() {
  SHIP = SHIPS[selShip]; D = DIFFS[selDiff]; saveSel(); hi = getHi(selDiff);
  const sh = SHIP.armor + D.armor;
  P = { x: W / 2, y: H - 180, tx: W / 2, ty: H - 180, px: W / 2, r: SHIP.hit * (D.id === 'easy' ? 0.85 : 1), shield: sh, maxShield: SHIP.maxArmor + D.armor,
    wl: SHIP.id === 'falcon' ? 2 : 1, bombs: SHIP.bombs, inv: 2.5, fireT: 0, missT: 0.5, alive: true, bank: 0, deadT: 0, regen: 0 };
  initProgress();
  P.ult = 0; P.ultT = 0; P.revive = SHIP.id === 'fenix'; STRIKES = []; NOVA = null; HOLE = null; BEAM = null;
  pB = []; eB = []; EN = []; PA = []; PU = []; RINGS = []; FT = []; LASERS = []; marks = [];
  score = 0; level = 1; stageT = 0; waveT = 1.5; boss = null; warnT = 0; newRecord = false;
  setTheme(0, true);
  COMBO.n = 0; COMBO.t = 0; COMBO.best = 0; eventT = rand(10, 14); lastEvent = -1; bgSpeed = 70;
  G.state = 'play'; G.phase = 'waves'; showBanner(); SFX.start(); setMusic('stage', 1);
}
function showBanner() { banner = { t: 0, a: 'SECTOR ' + level, b: SECTORS[(level - 1) % SECTORS.length] }; setTheme((level - 1) % THEMES.length); }
const aim = (x, y) => Math.atan2(P.y - y, P.x - x);
const bspd = () => Math.min(410, (175 + level * 18) * D.bullet);
const cd = s => s / D.fire;
function eShot(x, y, a, spd, big = false, k = null) {
  SFX.eshot(x, big); eB.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, r: big || k === 'ice' || k === 'web' ? 8 : 6, big, k }); }
function addScore(pts, x, y, big) {
  const v = Math.round(pts * D.score * scoreMult() * comboMult()); score += v;
  FT.push({ x, y, t: 0, s: '+' + v, big: !!big });
}

/* ---------------- Jugador ---------------- */
function firePlayer() {
  const x = P.x, y = P.y - 44, L = P.wl, dm = SHIP.dmg * lvlDmg();
  const add = (dx, a, spr, r, spd, extra) => pB.push(Object.assign({ x: x + dx, y: y + Math.abs(dx) * 0.4, vx: Math.sin(a) * spd, vy: -Math.cos(a) * spd, r, dmg: dm, rot: a, spr }, extra));
  switch (SHIP.weapon) {
    case 'plasma':
      if (L === 1) { add(-8, 0, SPR.pbolt, 8, 1150); add(8, 0, SPR.pbolt, 8, 1150); }
      else if (L === 2) { add(-13, 0, SPR.pbolt, 8, 1150); add(0, 0, SPR.pbolt, 8, 1150); add(13, 0, SPR.pbolt, 8, 1150); }
      else {
        for (const dx of [-18, -6, 6, 18]) add(dx, 0, SPR.pbolt, 8, 1150);
        if (L >= 4) { add(-26, -0.16, SPR.pbolt, 8, 1150); add(26, 0.16, SPR.pbolt, 8, 1150); }
        if (L >= 5) { add(-32, -0.32, SPR.pbolt, 8, 1150); add(32, 0.32, SPR.pbolt, 8, 1150); }
      }
      break;
    case 'needle': {
      const n = L + 1;
      for (let i = 0; i < n; i++) { const k = i - (n - 1) / 2; add(k * 9, L >= 4 ? k * 0.035 : 0, SPR.needle, 6, 1500); }
      break;
    }
    case 'cannon': {
      const sets = [[-0.04, 0.04], [-0.1, 0, 0.1], [-0.16, -0.05, 0.05, 0.16], [-0.24, -0.12, 0, 0.12, 0.24], [-0.32, -0.19, -0.06, 0.06, 0.19, 0.32]][L - 1];
      for (const a of sets) add(a * 90, a, SPR.shell, 11, 900);
      break;
    }
    case 'flame': fireFlame(x, y + 10, L, dm); break;
    case 'twin': {
      const n = [2, 2, 3, 4, 5][L - 1];
      for (let i = 0; i < n; i++) { const k = i - (n - 1) / 2; add(k * 11, L >= 4 ? k * 0.04 : 0, SPR.pbolt, 8, 1150); }
      break;
    }
    case 'wave': {
      const sets = [[0], [-0.07, 0.07], [-0.13, 0, 0.13], [-0.2, -0.07, 0.07, 0.2], [-0.26, -0.13, 0, 0.13, 0.26]][L - 1];
      for (const a of sets) add(a * 50, a, SPR.wave, 13, 1000, { pierce: true, hits: [] });
      break;
    }
  }
  SFX.fire(SHIP.weapon, P.x);
}
function fireMissiles() {
  SFX.missile(P.x);
  for (const s of [-1, 1]) pB.push({ x: P.x + s * 24, y: P.y + 6, vx: s * 160, vy: -380, r: 9, dmg: 2.5, missile: true, rot: 0, sp: 380, spr: SPR.missile });
}
function missileRate() {
  if (SHIP.id === 'spectre') return [0.9, 0.75, 0.6, 0.48, 0.38][P.wl - 1];
  return P.wl >= 5 ? 0.38 : P.wl >= 4 ? 0.6 : 0;
}
function nearestEnemy(x, y) {
  let best = null, bd = 1e12;
  for (const e of EN) { if (e.dead || e.delay > 0 || e.y < 10) continue; const d = (e.x - x) ** 2 + (e.y - y) ** 2; if (d < bd) { bd = d; best = e; } }
  if (boss && !boss.dying && boss.y > 0) {
    const [tx, ty] = bossCenter(); const t = { x: tx, y: ty };
    const d = (t.x - x) ** 2 + (t.y - y) ** 2; if (d < bd && !boss.cloak) best = t;
  }
  return best;
}
function useBomb() {
  if (!P || !P.alive || P.bombs <= 0 || G.state !== 'play') return;
  P.bombs--; flash = 1; shake = 20; SFX.bomb(); vib(160);
  RINGS.push({ x: P.x, y: P.y, t: 0, dur: 0.8, r: 900, c: 'rgba(255,170,80,' });
  for (const b of eB) { b.dead = true; PA.push({ x: b.x, y: b.y, vx: 0, vy: 0, life: 0.4, max: 0.4, s: 0.7, c: 'yellow' }); score += 10; }
  LASERS = [];
  for (const e of EN) if (!e.dead && e.delay <= 0 && e.y > -20) hitEnemy(e, 30, e.x, e.y);
  if (boss && !boss.dying && !boss.enter) damageBoss(80, boss.x, boss.y);
}

/* ---------------- Enemigos ---------------- */
const DEF = {
  drone: { hp: 3, r: 20, score: 100 }, fighter: { hp: 4, r: 20, score: 150 }, hunter: { hp: 8, r: 24, score: 250 },
  kamikaze: { hp: 2, r: 16, score: 120 }, mine: { hp: 6, r: 20, score: 200 }, spinner: { hp: 30, r: 38, score: 600 },
  cruiser: { hp: 50, r: 46, score: 900 }, bomber: { hp: 75, r: 58, score: 1500 }, tank: { hp: 14, r: 26, score: 400, ground: true }
};
function addEnemy(type, x, y, o = {}) {
  const d = DEF[type], hp = Math.round(d.hp * (1 + 0.35 * (level - 1)) * D.hp);
  const e = Object.assign({ type, x, y, hp, maxhp: hp, r: d.r, score: d.score, ground: !!d.ground, t: 0, hit: 0, rot: 0, delay: 0, fireT: rand(0.8, 2.2), vx: 0, vy: 0, ta: Math.PI / 2 }, o);
  maybeElite(e, o); EN.push(e); return e;
}
function wDroneLine() { for (let i = 0; i < 5; i++) { const bx = 70 + i * 100; addEnemy('drone', bx, -40, { mode: 'sine', bx, amp: 30, ph: i * 0.8 }); } }
function wDroneV() { const cx = rand(170, W - 170); for (let k = -3; k <= 3; k++) addEnemy('drone', cx + k * 48, -40 - Math.abs(k) * 40, { mode: 'sine', bx: cx + k * 48, amp: 10, ph: 0 }); }
function wSnake() { const s = Math.random() < 0.5 ? 1 : -1, y = rand(60, 160); for (let i = 0; i < 7; i++) addEnemy('drone', s > 0 ? -30 : W + 30, y, { mode: 'snake', dir: s, delay: i * 0.22 }); }
function wFighters() { const n = 2 + Math.min(3, level); for (let i = 0; i < n; i++) addEnemy('fighter', rand(60, W - 60), -50, { delay: i * 0.35 }); }
function wHunters() { const s = Math.random() < 0.5 ? 1 : -1, by = rand(130, 300); for (let i = 0; i < 3; i++) addEnemy('hunter', s > 0 ? -40 : W + 40, by + i * 36, { dir: s, by: by + i * 36, delay: i * 0.5 }); }
function wKamikaze() { const n = 3 + Math.min(4, level); for (let i = 0; i < n; i++) addEnemy('kamikaze', rand(40, W - 40), -40, { delay: i * 0.3 }); }
function wMines() { const n = 4 + Math.min(3, level); for (let i = 0; i < n; i++) addEnemy('mine', rand(40, W - 40), -40 - rand(0, 200)); }
function wSpinner() { const n = level >= 3 ? 2 : 1; for (let i = 0; i < n; i++) addEnemy('spinner', n === 1 ? rand(140, W - 140) : (i ? W * 0.72 : W * 0.28), -60, { holdY: rand(150, 300) }); }
function wCruiser() {
  const x = rand(140, W - 140); addEnemy('cruiser', x, -70);
  for (const s of [-1, 1]) addEnemy('drone', x + s * 90, -110, { mode: 'sine', bx: x + s * 90, amp: 14, ph: 0 });
}
function wBomber() { addEnemy('bomber', rand(150, W - 150), -80); for (const s of [-1, 1]) addEnemy('fighter', W / 2 + s * 160, -60, { delay: 1.2 }); }
function wTanks() {
  const n = 2 + (level >= 3 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const [rx, rw] = ROADV[i % 2];
    addEnemy('tank', rx + rw / 2, -50 - i * 90, { roll: rand(-25, 25) });
  }
}
const WAVES = [
  { f: wDroneLine, w: 3, min: 0 }, { f: wDroneV, w: 3, min: 0 }, { f: wSnake, w: 2.5, min: 4 },
  { f: wTanks, w: 2, min: 8 }, { f: wFighters, w: 2, min: 12 }, { f: wKamikaze, w: 1.8, min: 16 },
  { f: wHunters, w: 1.8, min: 18 }, { f: wSpinner, w: 1.4, min: 22 }, { f: wMines, w: 1.3, min: 26 },
  { f: wCruiser, w: 1.2, min: 30 }, { f: wBomber, w: 1, min: 38 }
];
function spawner(dt) {
  const bossAt = 60 + level * 5;
  if (G.phase === 'waves') {
    if (stageT > bossAt) { G.phase = 'warn'; warnT = 4.6; SFX.warn(); setMusic('warn'); return; }
    if (stageT > bossAt - 4) return;
    waveT -= dt;
    if (waveT <= 0 && EN.length < 24) {
      const heat = 1 + Math.min(1.1, stageT / 55) * Math.min(1, 0.6 + level * 0.2);
      const avail = WAVES.filter(w => stageT >= w.min / level);
      const pickWave = () => { let r = Math.random() * avail.reduce((s, w) => s + w.w, 0); for (const w of avail) { r -= w.w; if (r <= 0) { w.f(); break; } } };
      pickWave(); if (Math.random() < D.dbl * heat) pickWave();
      waveT = (Math.max(0.7, (2.7 - level * 0.2) / heat) + rand(0, 0.7)) * D.spawn;
    }
  } else if (G.phase === 'warn') {
    warnT -= dt; if (warnT <= 0) spawnBoss();
  }
}
function updateEnemy(e, dt) {
  if (e.delay > 0) { e.delay -= dt; return; }
  e.t += dt; e.hit = Math.max(0, e.hit - dt); e.fireT -= dt * (e.elite ? 1.6 : 1);
  const L = level, alive = P.alive;
  switch (e.type) {
    case 'drone':
      if (e.mode === 'sine') { e.y += 130 * dt; e.x = e.bx + Math.sin(e.t * 2.2 + e.ph) * e.amp; }
      else { e.x += e.dir * 210 * dt; e.y += (40 + e.t * 70) * dt; if (e.x < -60 || e.x > W + 60) e.dead = true; }
      if (e.fireT <= 0) {
        e.fireT = cd(rand(2, 3.5) / (1 + 0.15 * (L - 1)));
        if (alive && e.y > 30 && e.y < H * 0.65 && Math.random() < 0.75) eShot(e.x, e.y + 14, aimAt(e.x, e.y, bspd()), bspd());
      }
      break;
    case 'fighter':
      if (!e.dive) {
        e.y += 240 * dt;
        if (e.t > 0.8) {
          e.dive = true; const a = alive ? aimAt(e.x, e.y, 430) : Math.PI / 2;
          e.vx = Math.cos(a) * 430; e.vy = Math.max(160, Math.sin(a) * 430);
          e.rot = Math.atan2(e.vy, e.vx) - Math.PI / 2;
          if (alive) for (const k of (L >= 2 || D.id === 'hard' ? [-0.2, 0, 0.2] : [0])) eShot(e.x, e.y + 20, a + k, bspd() + 40);
        }
      } else { e.x += e.vx * dt; e.y += e.vy * dt; if (e.x < -80 || e.x > W + 80) e.dead = true; }
      break;
    case 'debris':
      e.x += e.vx * dt; e.y += e.vy * dt; e.rot += e.vr * dt;
      if (e.x < -60 || e.x > W + 60) e.dead = true;
      break;
    case 'hunter':
      if (e.up) {
        e.x += e.dir * 170 * dt; e.y -= 250 * dt; e.rot = Math.atan2(-250, e.dir * 170) - Math.PI / 2;
        if (e.fireT <= 0 && e.y > 60 && e.y < H - 60) { e.fireT = cd(0.8); if (alive) eShot(e.x, e.y, aimAt(e.x, e.y, bspd()), bspd() + 30); }
        if (e.y < -80 || e.x < -80 || e.x > W + 80) e.dead = true;
        break;
      }
      e.x += e.dir * 230 * dt; e.y = e.by + Math.sin(e.t * 2.5) * 28;
      e.rot = e.dir > 0 ? -Math.PI / 2 + 0.25 : Math.PI / 2 - 0.25;
      if (e.fireT <= 0 && e.x > 20 && e.x < W - 20) {
        e.fireT = cd(0.9);
        if (alive) { const a = aimAt(e.x, e.y, bspd()); eShot(e.x, e.y, a - 0.08, bspd() + 30); eShot(e.x, e.y, a + 0.08, bspd() + 30); }
      }
      if (e.x < -80 || e.x > W + 80) e.dead = true;
      break;
    case 'kamikaze': {
      if (e.t < 0.6) { e.y += 200 * dt; e.vx = 0; e.vy = 200; }
      else {
        let a = Math.atan2(e.vy, e.vx);
        if (e.t < 3 && alive) { let d = aim(e.x, e.y) - a; d = Math.atan2(Math.sin(d), Math.cos(d)); a += clamp(d, -3 * dt, 3 * dt); }
        const sp = Math.min(420, 200 + e.t * 140) * (D.id === 'hard' ? 1.15 : 1);
        e.vx = Math.cos(a) * sp; e.vy = Math.sin(a) * sp; e.x += e.vx * dt; e.y += e.vy * dt;
        if (Math.random() < 0.6) PA.push({ x: e.x - e.vx * 0.05, y: e.y - e.vy * 0.05, vx: 0, vy: 0, life: 0.3, max: 0.3, s: 0.5, c: 'orange' });
      }
      e.rot = Math.atan2(e.vy, e.vx) - Math.PI / 2;
      if (e.x < -60 || e.x > W + 60 || e.y < -120) e.dead = true;
      break;
    }
    case 'mine':
      e.y += 65 * dt; e.x += Math.sin(e.t * 1.2) * 25 * dt; e.rot += dt * 0.8;
      break;
    case 'spinner':
      e.rot += dt * 8;
      if (e.t < 7) {
        e.y += (e.holdY - e.y) * Math.min(1, dt * 1.5); e.x += Math.sin(e.t * 0.9) * 40 * dt;
        if (e.fireT <= 0 && e.y > 60) {
          e.fireT = cd(Math.max(0.9, 1.8 - L * 0.12));
          const n = Math.round((10 + L * 2) * (D.id === 'easy' ? 0.75 : 1)); for (let i = 0; i < n; i++) eShot(e.x, e.y, e.t + i / n * TAU, (125 + L * 10) * D.bullet);
        }
      } else e.y += (40 + (e.t - 7) * 220) * dt;
      break;
    case 'cruiser':
      e.y += (e.y < 200 ? 70 : 26) * dt;
      if (e.fireT <= 0 && e.y > 40 && alive) {
        e.fireT = cd(Math.max(0.9, 1.6 - L * 0.1));
        for (const s of [-1, 1]) { const tx = e.x + s * 38, ty = e.y + 4, a = aim(tx, ty); for (const k of [-0.18, 0, 0.18]) eShot(tx, ty, a + k, bspd() + 20); }
      }
      break;
    case 'bomber':
      e.y += (e.y < 210 ? 50 : 18) * dt; e.x += Math.sin(e.t * 0.6) * 20 * dt;
      if (e.fireT <= 0 && e.y > 30) {
        e.fireT = cd(1.2);
        for (const k of [-0.5, -0.25, 0, 0.25, 0.5]) eShot(e.x, e.y + 40, Math.PI / 2 + k, 120 * D.bullet + L * 6, true);
        if (alive) for (const s of [-1, 1]) eShot(e.x + s * 60, e.y + 10, aim(e.x + s * 60, e.y + 10), bspd());
      }
      break;
    case 'tank':
      e.y += (bgSpeed + e.roll) * dt;
      if (alive) { let d = aim(e.x, e.y) - e.ta; d = Math.atan2(Math.sin(d), Math.cos(d)); e.ta += clamp(d, -2.5 * dt, 2.5 * dt); }
      if (e.fireT <= 0 && e.y > 20 && e.y < H - 120 && alive) {
        e.fireT = cd(rand(1.8, 2.6));
        const ta = aimAt(e.x, e.y, bspd() * 0.95); eShot(e.x + Math.cos(e.ta) * 22, e.y + Math.sin(e.ta) * 22, ta, bspd() * 0.95, true);
        burst(e.x + Math.cos(e.ta) * 24, e.y + Math.sin(e.ta) * 24, 4, 'amber', 80, 0.2, 0.5); SFX.cannon(e.x);
      }
      break;
  }
  if ((e.type === 'cruiser' || e.type === 'bomber' || e.type === 'spinner') && e.hp < e.maxhp * 0.5 && Math.random() < dt * 12)
    PA.push({ x: e.x + rand(-20, 20), y: e.y + rand(-10, 10), vx: rand(-15, 15), vy: rand(-30, -10), life: 0.9, max: 0.9, s: 1, smoke: true });
  if (e.y > H + 100) e.dead = true;
}
function hitEnemy(e, d, x, y) {
  e.hp -= d; e.hit = 0.06;
  burst(x, y, 3, 'cyan', 140, 0.25, 0.5);
  if (e.hp <= 0 && !e.dead) {
    e.dead = true; comboKill(); addScore(e.score, e.x, e.y); gainUlt(e.score / 60);
    const big = e.type === 'spinner' || e.type === 'cruiser' || e.type === 'bomber';
    explode(e.x, e.y, e.type === 'bomber' ? 3 : big ? 2.2 : e.type === 'tank' ? 1.4 : 1);
    if (e.ground) marks.push({ x: e.x, y: e.y, s: 0.9 });
    if (e.type === 'mine') { const n = D.id === 'hard' ? 12 : D.id === 'easy' ? 6 : 8; for (let i = 0; i < n; i++) eShot(e.x, e.y, i / n * TAU + e.rot, 140 * D.bullet); }
    dropXP(e.x, e.y, e.score / 50 * (big ? 1.5 : 1) * (e.elite ? 1.5 : 1));
    const t = rollDrop(big || e.elite);
    if (t) PU.push({ x: e.x, y: e.y, t, tt: 0 });
  } else SFX.hit(x);
}

/* ---------------- Jefes ---------------- */
const BT = [[-145, -5], [145, -5], [-60, 45], [60, 45]];
const BH = [[0, 0, 60], [-60, 20, 45], [60, 20, 45], [-145, -5, 45], [145, -5, 45], [-200, -30, 32], [200, -30, 32], [0, 95, 32]];
const CT = [[-100, -40], [100, -40]];
const CH_BOX = [[0, 10, 70], [-100, -40, 50], [100, -40, 50], [-180, 0, 42], [180, 0, 42], [0, 100, 45], [-110, 80, 45], [110, 80, 45]];
const VSEG = 14, VGAP = 9;
function updateMothership(b, dt) {
  if (b.enter) { b.y += 85 * dt; if (b.y >= 190) { b.y = 190; b.enter = false; b.t = 0; } return; }
  b.x = W / 2 + Math.sin(b.t * 0.45) * 45; b.y = 190 + Math.sin(b.t * 0.8) * 18;
  if (!P.alive) return;
  for (let i = 0; i < 4; i++) b.ta[i] = aim(b.x + BT[i][0], b.y + BT[i][1]);
  const rage = b.rage, L = level, pat = Math.floor(b.t / 7) % 3;
  b.a1 -= dt; b.a2 -= dt; b.a3 -= dt;
  if ((pat === 0 || rage) && b.a1 <= 0) {
    b.a1 = cd(rage ? 0.75 : 0.95);
    BT.forEach(([ox, oy], i) => eShot(b.x + ox + Math.cos(b.ta[i]) * 18, b.y + oy + Math.sin(b.ta[i]) * 18, b.ta[i], bspd() + 30));
  }
  if (pat === 1 && b.a2 <= 0) {
    b.a2 = cd(rage ? 0.06 : 0.08); b.spin += 0.33;
    eShot(b.x, b.y + 20, b.spin, (140 + L * 8) * D.bullet, true); eShot(b.x, b.y + 20, b.spin + Math.PI, (140 + L * 8) * D.bullet, true);
  }
  if (pat === 2 && b.a3 <= 0) {
    b.a3 = cd(rage ? 0.95 : 1.25); const n = Math.round((18 + L * 2) * (D.id === 'easy' ? 0.75 : 1)), off = Math.random() * TAU;
    for (let i = 0; i < n; i++) eShot(b.x, b.y + 10, off + i / n * TAU, (150 + L * 8) * D.bullet, true);
  }
  if (rage && EN.length < 6 && Math.random() < dt * 0.3)
    for (const s of [-1, 1]) addEnemy('drone', b.x + s * 200, b.y, { mode: 'sine', bx: b.x + s * 200, amp: 20, ph: 0 });
}
function updateColossus(b, dt) {
  if (b.enter) { b.y += 70 * dt; if (b.y >= 200) { b.y = 200; b.enter = false; b.t = 0; } return; }
  b.x = W / 2 + Math.sin(b.t * 0.3) * 28; b.y = 200 + Math.sin(b.t * 0.5) * 10;
  for (let i = 0; i < 2; i++) {
    const want = P.alive ? aim(b.x + CT[i][0], b.y + CT[i][1]) : Math.PI / 2;
    let d = want - b.ta[i]; d = Math.atan2(Math.sin(d), Math.cos(d)); b.ta[i] += clamp(d, -1.6 * dt, 1.6 * dt);
  }
  if (!P.alive) return;
  const rage = b.rage, L = level, pat = Math.floor(b.t / 8) % 3;
  b.a1 -= dt; b.a2 -= dt; b.a3 -= dt;
  if ((pat === 0 || rage) && b.a1 <= 0) {
    b.a1 = cd(rage ? 0.7 : 0.9);
    CT.forEach(([ox, oy], i) => {
      const a = b.ta[i], cx = b.x + ox + Math.cos(a) * 46, cy = b.y + oy + Math.sin(a) * 46;
      for (const s of [-1, 1]) eShot(cx - Math.sin(a) * 8 * s, cy + Math.cos(a) * 8 * s, a, bspd() + 20, true);
      burst(cx, cy, 5, 'amber', 120, 0.25, 0.6); SFX.cannon(cx);
    });
  }
  if (pat === 1 && !LASERS.length && b.a2 <= 0) {
    b.a2 = cd(rage ? 3.2 : 4.5);
    const base = P.alive ? aim(b.x, b.y + 10) : Math.PI / 2, n = rage ? 3 : 2;
    for (let i = 0; i < n; i++) LASERS.push({ ox: 0, oy: 10, a: base + (i - (n - 1) / 2) * 0.55, va: (i % 2 ? 1 : -1) * 0.22, t: 0, warn: 1.1, on: 1.4, w: 16 });
    SFX.charge();
  }
  if (pat === 2 && b.a3 <= 0) {
    b.a3 = cd(rage ? 0.9 : 1.2);
    const n = Math.round(16 * (D.id === 'easy' ? 0.75 : 1)), off = Math.random() * TAU;
    for (let i = 0; i < n; i++) eShot(b.x, b.y + 134, off + i / n * TAU, (150 + L * 8) * D.bullet);
    const a = aim(b.x, b.y + 134); for (const k of [-0.12, 0, 0.12]) eShot(b.x, b.y + 134, a + k, bspd() + 40, true);
  }
  if (rage && EN.length < 6 && Math.random() < dt * 0.25) addEnemy('tank', Math.random() < 0.5 ? 136 : 404, -40, { roll: 20 });
}
function updateVroar(b, dt) {
  const h = b.head;
  const ox = h.x, oy = h.y;
  if (b.enter) { h.y += 150 * dt; if (h.y >= 270) { h.y = 270; b.enter = false; b.t = 0; } }
  else { b.pt += dt * (b.rage ? 1.35 : 1); h.x = W / 2 + Math.sin(b.pt * 0.75) * 175; h.y = 270 + Math.sin(b.pt * 1.5) * 130; }
  const mx = h.x - ox, my = h.y - oy;
  if (mx * mx + my * my > 0.01) { let d = Math.atan2(my, mx) - Math.PI / 2 - h.rot; d = Math.atan2(Math.sin(d), Math.cos(d)); h.rot += d * Math.min(1, dt * 8); }
  const hist = b.hist;
  let dx = h.x - hist[0].x, dy = h.y - hist[0].y, dl = Math.hypot(dx, dy);
  while (dl >= 4) { hist.unshift({ x: hist[0].x + dx / dl * 4, y: hist[0].y + dy / dl * 4 }); dx = h.x - hist[0].x; dy = h.y - hist[0].y; dl = Math.hypot(dx, dy); }
  hist.length = VSEG * VGAP + 3;
  let prev = h;
  for (let i = 0; i < VSEG; i++) {
    const p = hist[(i + 1) * VGAP], s = b.segs[i];
    s.x = p.x; s.y = p.y; s.rot = Math.atan2(prev.y - s.y, prev.x - s.x) + Math.PI / 2; prev = s;
  }
  b.x = h.x; b.y = h.y;
  if (b.enter || !P.alive) return;
  const L = level;
  const mouth = () => [h.x - Math.sin(h.rot) * 50, h.y + Math.cos(h.rot) * 50];
  b.a1 -= dt; b.a2 -= dt; b.bt += dt;
  if (b.breath > 0) {
    b.breath -= dt; b.a3 -= dt;
    if (b.a3 <= 0) { b.a3 = cd(0.05); const [mx2, my2] = mouth(); eShot(mx2, my2, aim(mx2, my2) + Math.sin(b.t * 9) * 0.3, bspd() * 1.05, true); }
  } else if (b.bt > (b.rage ? 6.5 : 9)) {
    b.bt = 0; b.breath = 1.6; b.a3 = 0.3; shake = 16; SFX.roar(); banner = banner || null;
    FT.push({ x: h.x, y: h.y - 70, t: 0, s: '¡VROAAAR!', big: true, col: '#d4ff3a' });
  } else if (b.a1 <= 0) {
    b.a1 = cd(b.rage ? 1 : 1.3); const [mx2, my2] = mouth(), a = aim(mx2, my2);
    for (let k = -2; k <= 2; k++) eShot(mx2, my2, a + k * 0.17, bspd() + 20);
  }
  if (b.a2 <= 0) {
    b.a2 = cd(b.rage ? 1.6 : 2.4);
    for (let k = 0; k < (b.rage ? 4 : 3); k++) { const s = pick(b.segs); if (s.y > 0) eShot(s.x, s.y, aim(s.x, s.y), bspd() * 0.9); }
  }
  if (b.rage && EN.length < 6 && Math.random() < dt * 0.3) wKamikaze();
}
function updateLasers(dt) {
  for (const l of LASERS) {
    l.t += dt;
    if (!boss || boss.dying) { l.dead = true; continue; }
    if (l.t > l.warn) l.a += l.va * dt;
    if (l.t > l.warn + l.on) l.dead = true;
    if (l.t > l.warn && P.alive && P.inv <= 0) {
      const ox = boss.x + l.ox, oy = boss.y + l.oy, cx = Math.cos(l.a), sy = Math.sin(l.a);
      const rx = P.x - ox, ry = P.y - oy, proj = rx * cx + ry * sy;
      if (proj > 0 && Math.abs(rx * sy - ry * cx) < l.w + P.r) hurtPlayer();
    }
  }
  LASERS = LASERS.filter(l => !l.dead);
  laserHum(G.state === 'play' && LASERS.some(l => l.t > l.warn));
}

/* ---------------- Partículas ---------------- */
function burst(x, y, n, c, spd, life, s) {
  for (let i = 0; i < n; i++) { const a = rand(0, TAU), v = rand(0.3, 1) * spd, l = rand(0.5, 1) * life; PA.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: l, max: l, s: s * rand(0.6, 1.2), c }); }
}
function explode(x, y, s = 1) {
  const q = Math.sqrt(s);
  burst(x, y, Math.round(14 * s), 'fire', 230 * q, 0.75, 1.3 * q);
  burst(x, y, Math.round(6 * s), 'yellow', 160 * q, 0.6, 0.9 * q);
  burst(x, y, Math.round(6 * s), 'white', 420 * q, 0.35, 0.35);
  for (let i = 0; i < Math.round(5 * s); i++) {
    const a = rand(0, TAU), v = rand(80, 300) * q;
    PA.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.5, 1), max: 1, s: rand(2, 5), debris: true, rot: rand(0, TAU), vr: rand(-12, 12), col: pick(['#5a6078', '#8a90a8', '#ff8a2b', '#2a2f40']) });
  }
  for (let i = 0; i < Math.round(3 * s); i++) PA.push({ x: x + rand(-10, 10) * q, y: y + rand(-10, 10) * q, vx: rand(-30, 30), vy: rand(-30, 10), life: rand(0.8, 1.4), max: 1.4, s: 1.2 * q, smoke: true });
  PA.push({ x, y, vx: 0, vy: 0, life: 0.22, max: 0.22, s: 3.6 * q, c: 'white' });
  RINGS.push({ x, y, t: 0, dur: 0.45, r: 60 * q, c: 'rgba(255,170,80,' });
  shake = Math.min(20, shake + 3 * s); SFX.boom(s, x);
}

/* ---------------- Update ---------------- */
function update(dt) {
  G.t += dt;
  const inMenu = G.state === 'menu' || (G.state === 'settings' && G.prev === 'menu');
  if (inMenu) setMusic('menu'); else if (G.state === 'over') setMusic('over');
  duckMusic(G.state === 'paused' || (G.state === 'settings' && !inMenu));
  if (G.state !== 'play') laserHum(false);
  else if (G.phase === 'waves') MUS.intensity = stageT < 20 ? 0 : stageT < 45 ? 1 : 2;
  if (G.state === 'paused' || G.state === 'settings') { if (inMenu) updateBG(dt); return; }
  updateBG(dt);
  shake = Math.max(0, shake - dt * 30); flash = Math.max(0, flash - dt * 2.2);
  if (G.state === 'menu') return;
  stageT += dt;
  if (banner) { banner.t += dt; if (banner.t > 3) banner = null; }
  if (P.alive) {
    const kx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
    const ky = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
    const sp = 760 * SHIP.speed * (P.webT > 0 ? 0.42 : 1);
    if (kx || ky) { P.tx = P.x + kx * sp * 0.1; P.ty = P.y + ky * sp * 0.1; }
    P.tx = clamp(P.tx, 26, W - 26); P.ty = clamp(P.ty, 70, H - 50);
    const dx = P.tx - P.x, dy = P.ty - P.y, d = Math.hypot(dx, dy), m = sp * dt;
    if (d <= m) { P.x = P.tx; P.y = P.ty; } else { P.x += dx / d * m; P.y += dy / d * m; }
    const vx = (P.x - P.px) / Math.max(dt, 0.001); P.px = P.x;
    const vy = (P.y - (P.py == null ? P.y : P.py)) / Math.max(dt, 0.001); P.py = P.y;
    P.vx = (P.vx || 0) * 0.85 + vx * 0.15; P.vy = (P.vy || 0) * 0.85 + vy * 0.15;
    P.bank += (clamp(vx / 700, -1, 1) - P.bank) * Math.min(1, dt * 10);
    P.inv = Math.max(0, P.inv - dt);
    if (SHIP.weapon !== 'beam') { P.fireT -= dt; if (P.fireT <= 0) { P.fireT = SHIP.rate * lvlRate() * (P.buf.hyper > 0 ? 0.5 : 1) * (P.ultT > 0 && SHIP.id === 'rayo' ? 0.33 : 1); firePlayer(); } }
    const mr = missileRate();
    if (mr) { P.missT -= dt; if (P.missT <= 0) { P.missT = mr; fireMissiles(); } }
    if (SHIP.id === 'titan' && P.shield < P.maxShield) {
      P.regen += dt; if (P.regen >= 25) { P.regen = 0; P.shield++; burst(P.x, P.y, 12, 'green', 160, 0.5, 0.7); FT.push({ x: P.x, y: P.y - 60, t: 0, s: '+ESCUDO', col: '#39ff88' }); }
    }
  } else {
    P.deadT += dt;
    if (P.deadT > 1.6 && G.state === 'play') { G.state = 'over'; overT = 0; }
  }
  if (G.state === 'over') overT += dt;
  if (G.state === 'play') spawner(dt);

  for (const b of pB) {
    if (b.missile) {
      const t = nearestEnemy(b.x, b.y);
      let a = Math.atan2(b.vy, b.vx);
      if (t) { let d = Math.atan2(t.y - b.y, t.x - b.x) - a; d = Math.atan2(Math.sin(d), Math.cos(d)); a += clamp(d, -7 * dt, 7 * dt); }
      b.sp = Math.min(820, b.sp + 900 * dt); b.vx = Math.cos(a) * b.sp; b.vy = Math.sin(a) * b.sp; b.rot = a + Math.PI / 2;
      if (Math.random() < 0.7) PA.push({ x: b.x, y: b.y, vx: rand(-20, 20), vy: rand(-20, 20), life: 0.25, max: 0.25, s: 0.45, c: 'mag' });
    }
    if (b.life != null) { b.life -= dt; if (b.life <= 0) b.dead = true; }
    b.x += b.vx * dt; b.y += b.vy * dt;
  }
  const eDt = dt * slowK();
  for (const e of EN) updateEnemy(e, eDt);
  if (boss) updateBoss(eDt);
  updateLasers(eDt);
  for (const b of eB) { b.x += b.vx * eDt; b.y += b.vy * eDt; }
  updateBuffs(dt); updateXP(dt); updateBeam(dt); updateUlt(dt); updateChaos(dt);
  collisions();
  pB = pB.filter(b => !b.dead && b.y > -50 && b.y < H + 50 && b.x > -50 && b.x < W + 50);
  eB = eB.filter(b => !b.dead && b.x > -30 && b.x < W + 30 && b.y > -30 && b.y < H + 30);
  EN = EN.filter(e => !e.dead);
  for (const u of PU) {
    u.tt += dt; u.y += 75 * dt; u.x += Math.sin(u.tt * 3) * 30 * dt;
    if (P.alive) { const dx = P.x - u.x, dy = P.y - u.y, d = Math.hypot(dx, dy); if (d < (P.buf.magnet > 0 ? 2000 : 120) && d > 0) { u.x += dx / d * 420 * dt; u.y += dy / d * 420 * dt; } }
  }
  PU = PU.filter(u => !u.dead && u.y < H + 30);
  const damp = Math.pow(0.04, dt);
  for (const p of PA) {
    p.life -= dt; p.vx *= damp; p.vy *= damp; p.x += p.vx * dt; p.y += (p.vy + bgSpeed * 0.6) * dt;
    if (p.debris) p.rot += p.vr * dt;
  }
  PA = PA.filter(p => p.life > 0); if (PA.length > 1400) PA.splice(0, PA.length - 1400);
  for (const r of RINGS) r.t += dt;
  RINGS = RINGS.filter(r => r.t < r.dur);
  for (const f of FT) f.t += dt;
  FT = FT.filter(f => f.t < (f.big ? 1.6 : 0.8));
}
function collisions() {
  for (const b of pB) {
    if (b.dead) continue;
    for (const e of EN) {
      if (e.dead || e.delay > 0) continue;
      if (b.pierce && b.hits.includes(e)) continue;
      const rr = e.r + b.r, dx = e.x - b.x, dy = e.y - b.y;
      if (dx * dx + dy * dy < rr * rr) {
        hitEnemy(e, b.dmg, b.x, b.y);
        if (b.pierce) b.hits.push(e); else { b.dead = true; break; }
      }
    }
    if (!b.dead && boss && !boss.dying && !boss.enter) {
      for (const box of bossBoxes(boss)) {
        const [bx, by, r] = box, dx = bx - b.x, dy = by - b.y, rr = r + b.r;
        if (dx * dx + dy * dy < rr * rr) { b.dead = true; hitBossBox(box, b.dmg, b.x, b.y); break; }
      }
    }
  }
  if (!P.alive) return;
  if (P.inv <= 0) {
    for (const b of eB) {
      const dx = b.x - P.x, dy = b.y - P.y, rr = b.r + P.r;
      if (dx * dx + dy * dy < rr * rr) { b.dead = true; if (b.k === 'web') { P.webT = 2.6; FT.push({ x: P.x, y: P.y - 50, t: 0, s: '¡ATRAPADO!', col: '#ffffff' }); SFX.barrier(); } else hurtPlayer(); break; }
    }
    for (const e of EN) {
      if (e.dead || e.delay > 0 || e.ground) continue;
      const dx = e.x - P.x, dy = e.y - P.y, rr = e.r * 0.75 + P.r + 5;
      if (dx * dx + dy * dy < rr * rr) { hitEnemy(e, e.type === 'kamikaze' || e.type === 'mine' ? 99 : 10, e.x, e.y); hurtPlayer(); break; }
    }
    if (boss && !boss.dying && !boss.enter && !bossDef().ground && !boss.cloak) for (const [bx, by, r] of bossBoxes(boss)) {
      const dx = bx - P.x, dy = by - P.y, rr = r * 0.8 + P.r + 3;
      if (dx * dx + dy * dy < rr * rr) { hurtPlayer(); break; }
    }
  }
  for (const u of PU) {
    const dx = u.x - P.x, dy = u.y - P.y;
    if (dx * dx + dy * dy < 34 * 34) {
      u.dead = true; collectPU(u);
    }
  }
}

