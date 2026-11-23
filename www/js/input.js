'use strict';
/* ---------------- Input ---------------- */
const keys = {};
let dragId = null, lastX = 0, lastY = 0;
function toGame(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / VS, (e.clientY - r.top) / VS]; }
const near = (x, y, [bx, by], r) => (x - bx) ** 2 + (y - by) ** 2 < r * r;
const inR = (x, y, r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
function changeShip(d) { selShip = (selShip + d + SHIPS.length) % SHIPS.length; saveSel(); SFX.ui(); }
function settingsTap(x, y) {
  const L = settingsLayout(), keys2 = [['music', 'musicVol'], ['sfx', 'sfxVol'], ['vib', null]];
  for (let i = 0; i < 3; i++) {
    const r = L.rows[i], [k, vk] = keys2[i];
    if (inR(x, y, r.tog)) { SET[k] = !SET[k]; saveSet(); if (k === 'vib' && SET.vib) vib(60); SFX.ui(); return; }
    if (vk && inR(x, y, r.minus)) { SET[vk] = Math.max(0, Math.round(SET[vk] * 10 - 1) / 10); saveSet(); SFX.ui(); return; }
    if (vk && inR(x, y, r.plus)) { SET[vk] = Math.min(1, Math.round(SET[vk] * 10 + 1) / 10); SET[k] = true; saveSet(); SFX.ui(); return; }
  }
  if (inR(x, y, L.back)) { G.state = G.prev || 'menu'; SFX.ui(); }
}
function menuTap(x, y) {
  const L = menuLayout();
  for (let i = 0; i < 3; i++) if (inR(x, y, L.diff[i])) { selDiff = i; saveSel(); SFX.ui(); return; }
  if (near(x, y, L.left, 40)) return changeShip(-1);
  if (near(x, y, L.right, 40)) return changeShip(1);
  if (menuButtonsTap(x, y)) return;
  if (inR(x, y, L.ship)) return changeShip(1);
}
cv.addEventListener('pointerdown', e => {
  e.preventDefault(); initAudio();
  const [x, y] = toGame(e);
  if (G.state === 'settings') { settingsTap(x, y); return; }
  if (near(x, y, UI.mute, 30) && G.state !== 'over') { G.prev = G.state === 'play' ? 'paused' : G.state; G.state = 'settings'; dragId = null; SFX.ui(); return; }
  if (G.state === 'hangar') { hangarTap(x, y); return; }
  if (G.state === 'achievements') { achTapDown(x, y); return; }
  if (G.state === 'menu' && near(x, y, ACH_BTN(), 32)) { G.state = 'achievements'; achScroll = 0; SFX.ui(); return; }
  if (G.state === 'menu') { menuTap(x, y); return; }
  if (G.state === 'over') { if (overT > 1) G.state = 'menu'; return; }
  if (G.state === 'paused') { if (inR(x, y, pauseLayout().menu)) G.state = 'menu'; else G.state = 'play'; return; }
  if (near(x, y, UI.pause, 30)) { G.state = 'paused'; dragId = null; return; }
  if (near(x, y, [UI.bomb[0], H - 74], 46)) { useBomb(); return; }
  if (near(x, y, ULT_BTN(), 40)) { useUltra(); return; }
  if (dragId === null) { dragId = e.pointerId; lastX = x; lastY = y; if (P) { P.tx = P.x; P.ty = P.y; } try { cv.setPointerCapture(e.pointerId); } catch (_) { } }
});
cv.addEventListener('pointermove', e => {
  if (G.state === 'achievements') { achMove(toGame(e)[1]); return; }
  if (e.pointerId !== dragId || G.state !== 'play' || !P.alive) return;
  const [x, y] = toGame(e);
  P.tx = clamp(P.tx + (x - lastX) * 1.15, 26, W - 26); P.ty = clamp(P.ty + (y - lastY) * 1.15, 70, H - 50);
  lastX = x; lastY = y;
});
const endDrag = e => { achDragY = null; if (e.pointerId === dragId) dragId = null; };
cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
addEventListener('keydown', e => {
  keys[e.code] = true; initAudio();
  if (G.state === 'menu') {
    if (e.code === 'ArrowLeft') changeShip(-1);
    if (e.code === 'ArrowRight') changeShip(1);
    if (e.code === 'ArrowUp') { selDiff = Math.max(0, selDiff - 1); saveSel(); }
    if (e.code === 'ArrowDown') { selDiff = Math.min(2, selDiff + 1); saveSel(); }
    if (e.code === 'Enter' || e.code === 'Space') { if (isUnlocked(SHIPS[selShip].id)) startGame(); else buyShip(SHIPS[selShip].id); }
    return;
  }
  if (e.code === 'Space' || e.code === 'KeyX') useBomb();
  if (e.code === 'KeyC' || e.code === 'KeyU') useUltra();
  if (e.code === 'KeyP' || e.code === 'Escape') { if (G.state === 'play') G.state = 'paused'; else if (G.state === 'paused') G.state = 'play'; }
  if (e.code === 'Enter' && G.state === 'over' && overT > 1) G.state = 'menu';
});
addEventListener('keyup', e => { keys[e.code] = false; });
document.addEventListener('visibilitychange', () => { if (document.hidden && G.state === 'play') G.state = 'paused'; });
window.onAppPause = () => { if (G.state === 'play') G.state = 'paused'; };
window.onBack = () => {
  if (G.state === 'play') { G.state = 'paused'; return true; }
  if (G.state === 'settings') { G.state = G.prev || 'menu'; return true; }
  if (G.state === 'hangar' || G.state === 'achievements') { G.state = 'menu'; return true; }
  if (G.state === 'paused' || G.state === 'over') { G.state = 'menu'; return true; }
  return false;
};
window.__ns = { G, get P() { return P; }, get EN() { return EN; }, get boss() { return boss; }, setStage(t) { stageT = t; }, setLevel(l) { level = l; }, startGame, ult() { P.ult = 100; }, give(t) { collectPU({ x: P.x, y: P.y, t }); }, get XC() { return XC; },
  pick(s, d) { selShip = s; selDiff = d; }, spawn(t, x, y, o) { return addEnemy(t, x, y, o); } };

/* ---------------- Loop ---------------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.033, Math.max(0, (now - last) / 1000)); last = now;
  update(dt); render(); requestAnimationFrame(frame);
}
updateBG(0);
requestAnimationFrame(frame);
