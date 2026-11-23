'use strict';
/* =====================================================================
   AUDIO — efectos y música synthwave generados en tiempo real
   ===================================================================== */
const SET = { music: true, musicVol: 0.7, sfx: true, sfxVol: 0.8, vib: true };
try { Object.assign(SET, JSON.parse(localStorage.getItem('ns_set') || '{}')); } catch (e) { }
function saveSet() { try { localStorage.setItem('ns_set', JSON.stringify(SET)); } catch (e) { } applyVolumes(); }

let AC = null, master = null, sfxBus = null, musicBus = null, musicIn = null, delayIn = null, noiseBuf = null, ducked = false;
function initAudio() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      const comp = AC.createDynamicsCompressor();
      comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
      master = AC.createGain(); master.gain.value = 0.9; master.connect(comp); comp.connect(AC.destination);
      sfxBus = AC.createGain(); sfxBus.connect(master);
      musicBus = AC.createGain(); musicBus.connect(master);
      musicIn = AC.createGain(); musicIn.connect(musicBus);
      // eco para arpegios y melodías
      delayIn = AC.createGain(); delayIn.gain.value = 0.28;
      const dl = AC.createDelay(1), fb = AC.createGain(), lp = AC.createBiquadFilter();
      dl.delayTime.value = 0.33; fb.gain.value = 0.35; lp.type = 'lowpass'; lp.frequency.value = 2200;
      delayIn.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(musicIn);
      noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      applyVolumes();
      if (MUS.want) { const [k, s] = MUS.want; MUS.want = null; setMusic(k, s); }
    } catch (e) { AC = null; }
  }
  if (AC && AC.state === 'suspended') AC.resume();
}
function applyVolumes() {
  if (!AC) return;
  const t = AC.currentTime;
  sfxBus.gain.setTargetAtTime(SET.sfx ? SET.sfxVol : 0, t, 0.03);
  musicBus.gain.setTargetAtTime(SET.music ? SET.musicVol * 0.55 * (ducked ? 0.35 : 1) : 0, t, 0.08);
}
function duckMusic(on) { if (ducked !== on) { ducked = on; applyVolumes(); } }
function vib(ms) { if (SET.vib && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { } }

/* ---------------- Bloques de síntesis para efectos ---------------- */
function outNode(pan) {
  if (!pan || !AC.createStereoPanner) return sfxBus;
  const p = AC.createStereoPanner(); p.pan.value = clamp(pan, -1, 1); p.connect(sfxBus); return p;
}
const panX = x => (x / W * 2 - 1) * 0.75;
function tone(f, dur, type = 'square', vol = 0.1, f2 = 0, delay = 0, pan = 0, attack = 0) {
  if (!AC || !SET.sfx) return;
  const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  if (attack) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + attack); }
  else g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(outNode(pan)); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, vol = 0.3, freq = 1500, delay = 0, pan = 0, type = 'lowpass', f2 = 60, q = 0.7) {
  if (!AC || !SET.sfx) return;
  const t = AC.currentTime + delay, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = noiseBuf; s.loop = true; f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(freq, t); if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(outNode(pan)); s.start(t, Math.random()); s.stop(t + dur + 0.02);
}
const sfxLast = {}, XPC = { n: 0, t: 0 };
function throttle(k, ms) { const n = performance.now(); if (n - (sfxLast[k] || 0) < ms) return false; sfxLast[k] = n; return true; }

const SFX = {
  // --- armas del jugador (cada nave suena distinto) ---
  fire(weapon, x) {
    const p = panX(x) * 0.4;
    switch (weapon) {
      case 'plasma': if (throttle('fp', 95)) { tone(1500, 0.07, 'square', 0.022, 520, 0, p); tone(3000, 0.04, 'triangle', 0.015, 1400, 0, p); } break;
      case 'needle': if (throttle('fn', 80)) { tone(2600, 0.035, 'triangle', 0.02, 1900, 0, p); noise(0.03, 0.03, 9000, 0, p, 'highpass', 0); } break;
      case 'cannon': if (throttle('fc', 150)) { tone(170, 0.16, 'sine', 0.13, 55, 0, p); noise(0.12, 0.07, 900, 0, p, 'lowpass', 120); tone(420, 0.05, 'square', 0.02, 200, 0, p); } break;
      case 'wave': if (throttle('fw', 120)) { tone(320, 0.16, 'sine', 0.06, 760, 0, p); tone(640, 0.12, 'triangle', 0.025, 1500, 0, p); } break;
    }
  },
  missile(x) { if (throttle('mi', 120)) { noise(0.28, 0.06, 900, 0, panX(x), 'bandpass', 3500, 2); tone(220, 0.2, 'sawtooth', 0.015, 600, 0, panX(x)); } },
  // --- disparos enemigos ---
  eshot(x, big) {
    if (big) { if (throttle('eb', 90)) { tone(330, 0.16, 'sine', 0.045, 140, 0, panX(x)); tone(165, 0.12, 'square', 0.015, 90, 0, panX(x)); } }
    else if (throttle('es', 70)) { tone(820, 0.08, 'triangle', 0.03, 330, 0, panX(x)); }
  },
  cannon(x) { if (throttle('ec', 120)) { tone(120, 0.25, 'sine', 0.14, 40, 0, panX(x)); noise(0.22, 0.12, 1200, 0, panX(x), 'lowpass', 90); } },
  charge() { tone(160, 1.1, 'sine', 0.09, 1300, 0, 0, 0.05); tone(80, 1.1, 'sawtooth', 0.03, 640, 0, 0, 0.3); },
  // --- impactos y explosiones ---
  hit(x = W / 2) { if (throttle('h', 55)) { tone(1900, 0.03, 'square', 0.018, 900, 0, panX(x)); noise(0.04, 0.03, 5000, 0, panX(x), 'highpass', 0); } },
  boom(s = 1, x = W / 2) {
    if (!throttle('b', 55)) return;
    const k = Math.min(s, 2.5), p = panX(x);
    tone(95, 0.45 * k, 'sine', 0.22 * Math.min(k, 1.6), 30, 0, p);
    noise(0.5 * k, 0.28 * Math.min(k, 1.6), 2400, 0, p, 'lowpass', 70);
    noise(0.12, 0.08, 6000, 0.02, p, 'highpass', 0);
    if (k > 1.5) noise(0.9 * k, 0.15, 500, 0.08, p, 'lowpass', 40);
  },
  power() { [523, 659, 784, 1046, 1318].forEach((f, i) => { tone(f, 0.14, 'triangle', 0.11, 0, i * 0.05); tone(f * 2, 0.08, 'sine', 0.03, 0, i * 0.05); }); },
  hurt() { tone(420, 0.35, 'sawtooth', 0.12, 60); tone(210, 0.4, 'square', 0.06, 40); noise(0.35, 0.3, 1400, 0, 0, 'lowpass', 80); },
  bomb() { noise(1.5, 0.5, 4000, 0, 0, 'lowpass', 40); tone(70, 1.3, 'sine', 0.45, 25); tone(200, 0.8, 'sawtooth', 0.06, 1600, 0, 0, 0.4); },
  warn() { for (let i = 0; i < 4; i++) { tone(660, 0.32, 'square', 0.06, 440, i * 0.55); tone(330, 0.32, 'sawtooth', 0.04, 220, i * 0.55); } },
  roar() { tone(110, 1.1, 'sawtooth', 0.22, 38); tone(165, 0.9, 'square', 0.08, 55); noise(1.1, 0.35, 900, 0, 0, 'bandpass', 300, 3); },
  bossDie() { noise(3, 0.45, 2000, 0, 0, 'lowpass', 30); tone(60, 3, 'sine', 0.4, 20); },
  start() { [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, 'square', 0.05, 0, i * 0.07)); },
  levelUp() { [523, 784, 1046, 1568].forEach((f, i) => { tone(f, 0.18, 'square', 0.05, 0, i * 0.06); tone(f / 2, 0.2, 'triangle', 0.06, 0, i * 0.06); }); tone(200, 0.5, 'sawtooth', 0.04, 1600, 0, 0, 0.2); },
  xp() { if (throttle('xp', 45)) { XPC.n = performance.now() - XPC.t < 400 ? Math.min(XPC.n + 1, 14) : 0; XPC.t = performance.now(); tone(1046 * Math.pow(2, XPC.n / 12), 0.07, 'sine', 0.05, 0, 0); } },
  barrier() { tone(900, 0.25, 'sine', 0.1, 300); noise(0.2, 0.08, 6000, 0, 0, 'bandpass', 2000, 3); },
  ui() { tone(1200, 0.05, 'triangle', 0.06, 1800); }
};

/* ---------------- Zumbido continuo de los láseres ---------------- */
let hum = null;
function laserHum(on) {
  if (!AC) return;
  const t = AC.currentTime;
  if (on && !hum && SET.sfx) {
    const o1 = AC.createOscillator(), o2 = AC.createOscillator(), lfo = AC.createOscillator(), lg2 = AC.createGain(), f = AC.createBiquadFilter(), g = AC.createGain();
    o1.type = 'sawtooth'; o1.frequency.value = 98; o2.type = 'square'; o2.frequency.value = 197;
    lfo.frequency.value = 22; lg2.gain.value = 500; lfo.connect(lg2); lg2.connect(f.frequency);
    f.type = 'lowpass'; f.frequency.value = 1300; f.Q.value = 4;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.1, t + 0.08);
    o1.connect(f); o2.connect(f); f.connect(g); g.connect(sfxBus); o1.start(); o2.start(); lfo.start();
    hum = { o: [o1, o2, lfo], g };
  } else if (!on && hum) {
    hum.g.gain.cancelScheduledValues(t); hum.g.gain.setValueAtTime(hum.g.gain.value, t); hum.g.gain.linearRampToValueAtTime(0.0001, t + 0.15);
    for (const o of hum.o) o.stop(t + 0.2);
    hum = null;
  }
}

/* =====================================================================
   MÚSICA — secuenciador synthwave
   ===================================================================== */
const MUS = { song: null, key: '', step: 0, nextT: 0, pending: null, pendingT: 0, intensity: 0, want: null };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const SCALES = { minor: [0, 2, 3, 5, 7, 8, 10], phryg: [0, 1, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], major: [0, 2, 4, 5, 7, 9, 11], harm: [0, 2, 3, 5, 7, 8, 11] };

function env(g, t, a, peak, dur, rel = 0.05) {
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.setValueAtTime(peak, t + Math.max(a, dur - rel)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
}
function mKick(t, v = 1) {
  const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine';
  o.frequency.setValueAtTime(155, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  g.gain.setValueAtTime(0.95 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
  o.connect(g); g.connect(musicIn); o.start(t); o.stop(t + 0.42);
}
function mNoise(t, dur, v, type, freq, q = 0.7) {
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = noiseBuf; s.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(musicIn); s.start(t, Math.random()); s.stop(t + dur + 0.02);
  return g;
}
function mSnare(t, v = 1) {
  mNoise(t, 0.2, 0.32 * v, 'bandpass', 1900, 0.8);
  const o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle';
  o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.1);
  g.gain.setValueAtTime(0.22 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g); g.connect(musicIn); o.start(t); o.stop(t + 0.14);
}
function mHat(t, v = 1, open = false) { mNoise(t, open ? 0.18 : 0.045, 0.1 * v, 'highpass', 7500); }
function mBass(t, m, dur, v = 1) {
  const o = AC.createOscillator(), o2 = AC.createOscillator(), f = AC.createBiquadFilter(), g = AC.createGain();
  o.type = 'sawtooth'; o2.type = 'square'; o.frequency.value = mtof(m); o2.frequency.value = mtof(m - 12);
  f.type = 'lowpass'; f.Q.value = 6; f.frequency.setValueAtTime(1100, t); f.frequency.exponentialRampToValueAtTime(220, t + dur);
  env(g, t, 0.005, 0.2 * v, dur, 0.04);
  o.connect(f); o2.connect(f); f.connect(g); g.connect(musicIn);
  o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
}
function mPad(t, notes, dur, v = 1) {
  const f = AC.createBiquadFilter(), g = AC.createGain();
  f.type = 'lowpass'; f.frequency.value = 1300; env(g, t, 0.35, 0.045 * v, dur, 0.4);
  f.connect(g); g.connect(musicIn);
  for (const m of notes) for (const det of [-8, 8]) {
    const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det;
    o.connect(f); o.start(t); o.stop(t + dur + 0.5);
  }
}
function mPluck(t, m, dur, v = 1) {
  const o = AC.createOscillator(), f = AC.createBiquadFilter(), g = AC.createGain();
  o.type = 'square'; o.frequency.value = mtof(m);
  f.type = 'lowpass'; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(600, t + dur);
  g.gain.setValueAtTime(0.06 * v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(f); f.connect(g); g.connect(musicIn); g.connect(delayIn); o.start(t); o.stop(t + dur + 0.02);
}
function mLead(t, m, dur, v = 1) {
  const o = AC.createOscillator(), o2 = AC.createOscillator(), lfo = AC.createOscillator(), lg2 = AC.createGain(), f = AC.createBiquadFilter(), g = AC.createGain();
  o.type = 'sawtooth'; o2.type = 'square'; o.frequency.value = mtof(m); o2.frequency.value = mtof(m); o2.detune.value = 7;
  lfo.frequency.value = 5.5; lg2.gain.value = 6; lfo.connect(lg2); lg2.connect(o.detune);
  f.type = 'lowpass'; f.frequency.value = 2600; env(g, t, 0.02, 0.055 * v, dur, 0.08);
  o.connect(f); o2.connect(f); f.connect(g); g.connect(musicIn); g.connect(delayIn);
  o.start(t); o2.start(t); lfo.start(t); o.stop(t + dur + 0.12); o2.stop(t + dur + 0.12); lfo.stop(t + dur + 0.12);
}

const PROGS = {
  minor: [[[0, 'm'], [8, 'M'], [3, 'M'], [10, 'M']], [[0, 'm'], [5, 'm'], [8, 'M'], [7, 'M']], [[0, 'm'], [10, 'M'], [8, 'M'], [10, 'M']], [[0, 'm'], [3, 'M'], [10, 'M'], [5, 'm']]],
  dark: [[[0, 'm'], [1, 'M'], [0, 'm'], [10, 'M']], [[0, 'm'], [8, 'M'], [1, 'M'], [7, 'M']], [[0, 'm'], [6, 'M'], [5, 'm'], [1, 'M']], [[0, 'm'], [0, 'm'], [1, 'M'], [3, 'M']]]
};
function melody(R, len, rest) {
  const out = []; let d = Math.floor(R() * 5);
  for (let i = 0; i < len; i++) {
    if (i > 0 && R() < rest) { out.push(null); continue; }
    d += [-2, -1, -1, 0, 1, 1, 2, 3][Math.floor(R() * 8)]; d = clamp(d, -2, 9); out.push(d);
  }
  return out;
}
function makeSong(kind, seed) {
  const R = mulberry(seed * 7919 + kind.length * 131 + 7);
  switch (kind) {
    case 'menu': return { kind, bpm: 96, root: 45, scale: SCALES.minor, prog: PROGS.minor[0], drums: 'soft', bass: 'pulse8', arp: 8, pad: 1.1, mel: null };
    case 'stage': return { kind, bpm: 116 + Math.floor(R() * 8), root: 40 + Math.floor(R() * 8), scale: SCALES.minor, prog: PROGS.minor[Math.floor(R() * 4)], drums: 'four', bass: 'synth8', arp: 16, pad: 0.8, mel: melody(R, 16, 0.3) };
    case 'warn': return { kind, bpm: 124, root: 41, scale: SCALES.phryg, prog: [[0, 'm'], [1, 'M']], drums: 'heart', bass: 'drone', arp: 0, pad: 1.2, mel: null };
    case 'boss': {
      const sc = [SCALES.phryg, SCALES.harm, SCALES.minor][seed % 3];
      return { kind, bpm: 138 + Math.floor(R() * 16), root: 38 + Math.floor(R() * 8), scale: sc, prog: PROGS.dark[seed % 4], drums: 'drive', bass: 'gallop16', arp: 16, pad: 0.9, mel: melody(R, 16, 0.18) };
    }
    case 'victory': return { kind, bpm: 132, root: 48, scale: SCALES.major, prog: [[0, 'M'], [5, 'M'], [7, 'M'], [0, 'M']], drums: 'four', bass: 'synth8', arp: 16, pad: 1, mel: [0, 2, 4, 7, null, 4, 7, 9, 7, null, 9, 11, 12, null, 12, null], once: 64, then: 'stage' };
    case 'over': return { kind, bpm: 72, root: 45, scale: SCALES.minor, prog: [[0, 'm'], [8, 'M'], [5, 'm'], [7, 'm']], drums: 'none', bass: 'drone', arp: 4, pad: 1.3, mel: null };
  }
}
function playStep(S, s, t) {
  const d16 = 60 / S.bpm / 4, i = s % 16, bar = Math.floor(s / 16), ch = S.prog[bar % S.prog.length];
  const cr = S.root + ch[0], tn = ch[1] === 'm' ? [0, 3, 7] : [0, 4, 7];
  const I = S.kind === 'stage' ? MUS.intensity : 2;
  switch (S.drums) {
    case 'four': if (i % 4 === 0) mKick(t); if (i === 4 || i === 12) mSnare(t); if (I >= 1 && i % 2 === 0) mHat(t, 0.8, i % 4 === 2); if (I >= 2 && i % 2 === 1) mHat(t, 0.4); break;
    case 'soft': if (i === 0 || i === 10) mKick(t, 0.55); if (i === 8) mSnare(t, 0.35); if (i % 4 === 2) mHat(t, 0.45); break;
    case 'drive': if (i % 4 === 0 || i === 14) mKick(t); if (i === 4 || i === 12) mSnare(t); if (i === 15 && bar % 2) mSnare(t, 0.6); mHat(t, i % 2 ? 0.45 : 0.85, i % 8 === 6); break;
    case 'heart': if (i === 0 || i === 3) mKick(t, 0.9); if (i % 4 === 2) mHat(t, 0.3); break;
  }
  switch (S.bass) {
    case 'pulse8': if (i % 2 === 0) mBass(t, cr - 12 + (i % 8 === 6 ? 12 : 0), d16 * 1.7, 0.7); break;
    case 'synth8': if (i % 2 === 0) mBass(t, cr - 12 + (i % 8 === 6 ? 12 : 0), d16 * 1.7); break;
    case 'gallop16': if (i % 4 !== 1) mBass(t, cr - 12 + (i % 8 === 6 ? 12 : 0), d16 * 0.9); break;
    case 'drone': if (i === 0) mBass(t, cr - 12, d16 * 15, 0.75); break;
  }
  if (S.pad && i === 0) mPad(t, tn.map(x => cr + 12 + x), d16 * 16, S.pad);
  if (S.arp && (S.kind !== 'stage' || I >= 1)) {
    const every = 16 / S.arp;
    if (i % every === 0) {
      const notes = [cr + 12 + tn[0], cr + 12 + tn[1], cr + 12 + tn[2], cr + 24 + tn[0], cr + 12 + tn[2], cr + 12 + tn[1]];
      mPluck(t, notes[(i / every) % notes.length], d16 * every * 0.9, S.kind === 'over' ? 0.6 : 0.8);
    }
  }
  if (S.mel && (S.kind !== 'stage' || I >= 2) && i % 2 === 0) {
    const deg = S.mel[((bar % 2) * 8 + i / 2) % S.mel.length];
    if (deg != null) {
      const sc = S.scale, o = Math.floor(deg / 7), m = S.root + 24 + sc[((deg % 7) + 7) % 7] + 12 * o;
      mLead(t, m, d16 * 1.8, S.kind === 'victory' ? 1.2 : 1);
    }
  }
}
function musTick() {
  if (!AC || AC.state !== 'running') return;
  const now = AC.currentTime;
  if (MUS.pending && now >= MUS.pendingT) {
    MUS.song = MUS.pending; MUS.pending = null; MUS.step = 0; MUS.nextT = now + 0.05;
    musicIn.gain.cancelScheduledValues(now); musicIn.gain.setValueAtTime(0.0001, now); musicIn.gain.linearRampToValueAtTime(1, now + 0.5);
  }
  if (!MUS.song) return;
  if (MUS.nextT < now - 0.25) MUS.nextT = now + 0.02;
  while (MUS.nextT < now + 0.15) {
    if (SET.music) playStep(MUS.song, MUS.step, MUS.nextT);
    MUS.nextT += 60 / MUS.song.bpm / 4; MUS.step++;
    if (MUS.song.once && MUS.step >= MUS.song.once) { const n = MUS.song.then, s = MUS.seed; MUS.song = null; MUS.key = ''; if (n) setMusic(n, s); break; }
  }
}
setInterval(musTick, 40);
function setMusic(kind, seed = 0) {
  const key = kind + ':' + seed;
  if (!AC) { MUS.want = [kind, seed]; return; }
  if (MUS.key === key) return;
  MUS.key = key; MUS.seed = seed;
  const S = makeSong(kind, seed), now = AC.currentTime;
  if (!MUS.song) {
    MUS.song = S; MUS.pending = null; MUS.step = 0; MUS.nextT = now + 0.05;
    musicIn.gain.cancelScheduledValues(now); musicIn.gain.setValueAtTime(1, now); return;
  }
  musicIn.gain.cancelScheduledValues(now); musicIn.gain.setValueAtTime(Math.max(0.0001, musicIn.gain.value), now); musicIn.gain.linearRampToValueAtTime(0.0001, now + 0.5);
  MUS.pending = S; MUS.pendingT = now + 0.5;
}
document.addEventListener('visibilitychange', () => {
  if (!AC) return;
  if (document.hidden) { AC.suspend(); laserHum(false); } else AC.resume();
});
