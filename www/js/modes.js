'use strict';
/* =====================================================================
   MODO INFINITO y PANTALLA DE RESULTADOS POR SECTOR (calificación S/A/B/C)
   ===================================================================== */
G.mode = 'story';
const ENDLESS = { next: 0, wave: 1 };
const hiKey = (d = D.id) => (G.mode === 'endless' ? 'ns_hi_end_' : 'ns_hi_') + d;
function getHiMode(mode, di) { try { return +localStorage.getItem((mode === 'endless' ? 'ns_hi_end_' : 'ns_hi_') + DIFFS[di].id) || 0; } catch (e) { return 0; } }
function startEndless() {
  G.mode = 'endless'; ENDLESS.wave = 1; ENDLESS.next = Math.floor(Math.random() * BOSS_DEFS.length);
  startGame(true); hi = getHiMode('endless', selDiff);
  setTheme(Math.floor(Math.random() * THEMES.length), true);
  banner = { t: 0, a: 'MODO INFINITO', b: 'Sobrevive todo lo que puedas' };
}
function startStory() { G.mode = 'story'; startGame(); }

/* ---------------- Estadísticas del sector ---------------- */
const SECT = { t: 0, kills: 0, hits: 0, combo: 0, score0: 0 };
function sectReset() { Object.assign(SECT, { t: 0, kills: 0, hits: 0, combo: 0, score0: score }); }
let RES = null;
function showResults(bidx) {
  const pts = 100 - SECT.hits * 14 + Math.min(20, SECT.combo / 3) - Math.max(0, (SECT.t - 110) / 4);
  const grade = pts >= 92 ? 'S' : pts >= 75 ? 'A' : pts >= 55 ? 'B' : 'C';
  const bonus = Math.round({ S: 150, A: 100, B: 50, C: 20 }[grade] * COIN_MULT[D.id]);
  SAVE.coins += bonus; saveData(true);
  RES = { bidx, grade, bonus, t: 0, time: SECT.t, kills: SECT.kills, hits: SECT.hits, combo: SECT.combo, pts: score - SECT.score0 };
  G.state = 'results'; SFX.levelUp();
}
function resultsTap() {
  if (!RES || RES.t < 1.2) return;
  const b = RES.bidx; RES = null; G.state = 'play';
  if (G.mode === 'endless') endlessNext(); else afterBoss(b);
}
function endlessNext() {
  ENDLESS.wave++; ENDLESS.next = Math.floor(Math.random() * BOSS_DEFS.length);
  setTheme(Math.floor(Math.random() * THEMES.length));
  banner = { t: 0, a: 'OLEADA ' + ENDLESS.wave, b: 'La amenaza crece' }; sectReset(); setMusic('stage', level);
}
function drawResults() {
  if (!RES) return;
  RES.t += 1 / 60;
  ctx.fillStyle = 'rgba(2,4,12,0.78)'; ctx.fillRect(0, 0, W, H);
  const y0 = H * 0.2, gc = { S: '#ffd23f', A: '#39ff88', B: '#00e5ff', C: '#c8d4e6' }[RES.grade];
  txt(G.mode === 'endless' ? 'OLEADA ' + ENDLESS.wave + ' SUPERADA' : 'SECTOR ' + (level - 1) + ' COMPLETADO', W / 2, y0, 28, '#ffffff', 'center', '#00e5ff', 900);
  const rows = [
    ['TIEMPO', Math.floor(RES.time / 60) + ':' + String(Math.floor(RES.time % 60)).padStart(2, '0')],
    ['DERRIBOS', RES.kills], ['GOLPES RECIBIDOS', RES.hits], ['COMBO MÁXIMO', RES.combo], ['PUNTOS', RES.pts.toLocaleString('es')]
  ];
  rows.forEach(([k, v], i) => {
    const a = clamp((RES.t - 0.15 * i) * 4, 0, 1); ctx.globalAlpha = a;
    const y = y0 + 70 + i * 44;
    txt(k, 70, y, 16, '#9fb4cc', 'left', null, 800); txt(String(v), W - 70, y, 20, '#ffffff', 'right', null, 900);
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(60, y + 20, W - 120, 1);
  });
  const ga = clamp((RES.t - 0.9) * 3, 0, 1), sc = 1 + (1 - ga) * 1.5;
  ctx.globalAlpha = ga;
  ctx.save(); ctx.translate(W / 2, y0 + 360); ctx.scale(sc, sc);
  ctx.strokeStyle = gc; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.stroke();
  txt(RES.grade, 0, 4, 84, gc, 'center', gc, 900); ctx.restore();
  txt('CALIFICACIÓN', W / 2, y0 + 280, 13, gc, 'center', null, 900);
  txt('+' + RES.bonus + ' ◎ de bonificación', W / 2, y0 + 452, 18, '#ffd23f', 'center', null, 900);
  ctx.globalAlpha = 1;
  if (RES.t > 1.2 && Math.floor(G.t * 2) % 2 === 0) txt('TOCA PARA CONTINUAR', W / 2, H * 0.86, 20, '#ffffff', 'center', '#00e5ff', 900);
}
