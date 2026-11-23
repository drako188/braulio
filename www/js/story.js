'use strict';
/* =====================================================================
   MODO HISTORIA — escenas entre sectores, mensajes de radio y final
   ===================================================================== */
if (SET.story === undefined) SET.story = true;

/* ---------------- Retratos ---------------- */
function portraitFrame(g, col) {
  g.fillStyle = radial(g, 55, 55, 55, [[0, '#1a2238'], [1, '#05070f']]); g.beginPath(); g.arc(55, 55, 52, 0, TAU); g.fill();
  g.strokeStyle = col; g.lineWidth = 3; g.stroke();
}
const PORTRAIT = {
  iris: sprite(110, 110, g => {
    portraitFrame(g, '#00e5ff');
    g.save(); g.beginPath(); g.arc(55, 55, 50, 0, TAU); g.clip();
    g.fillStyle = '#1a2a50'; poly(g, [10, 110, 24, 84, 55, 78, 86, 84, 100, 110]); g.fill();
    g.fillStyle = '#ffd23f'; g.fillRect(70, 90, 10, 4); g.fillRect(70, 96, 10, 4);
    g.fillStyle = '#c89878'; g.fillRect(48, 66, 14, 16);
    g.fillStyle = '#e0b090'; g.beginPath(); g.ellipse(55, 52, 19, 23, 0, 0, TAU); g.fill();
    g.fillStyle = '#1a1220'; g.beginPath(); g.moveTo(34, 50); g.quadraticCurveTo(36, 24, 58, 26); g.quadraticCurveTo(80, 28, 76, 54); g.quadraticCurveTo(70, 36, 50, 38); g.quadraticCurveTo(40, 44, 36, 66); g.closePath(); g.fill();
    g.fillStyle = '#20242e'; g.fillRect(31, 46, 6, 16); g.strokeStyle = '#20242e'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(34, 60); g.quadraticCurveTo(38, 74, 48, 72); g.stroke();
    g.fillStyle = '#00e5ff'; g.fillRect(46, 71, 4, 2);
    g.fillStyle = '#20242e'; g.fillRect(45, 50, 7, 3); g.fillRect(59, 50, 7, 3);
    g.fillStyle = '#9a5a4a'; g.fillRect(50, 64, 10, 2);
    g.restore();
  }),
  rook: sprite(110, 110, g => {
    portraitFrame(g, '#ffc83a');
    g.save(); g.beginPath(); g.arc(55, 55, 50, 0, TAU); g.clip();
    g.fillStyle = '#c89a20'; poly(g, [6, 110, 22, 82, 55, 76, 88, 82, 104, 110]); g.fill();
    g.fillStyle = '#1a1a1a'; for (let x = 20; x < 96; x += 12) { poly(g, [x, 96, x + 6, 96, x, 104, x - 6, 104]); g.fill(); }
    g.fillStyle = '#b08060'; g.beginPath(); g.ellipse(55, 52, 21, 24, 0, 0, TAU); g.fill();
    g.fillStyle = '#9aa0a8'; g.beginPath(); g.moveTo(34, 56); g.quadraticCurveTo(36, 88, 55, 86); g.quadraticCurveTo(74, 88, 76, 56); g.quadraticCurveTo(66, 70, 55, 70); g.quadraticCurveTo(44, 70, 34, 56); g.fill();
    g.fillStyle = '#3a3e46'; rr(g, 32, 30, 46, 14, 6); g.fill();
    for (const x of [44, 66]) { g.fillStyle = radial(g, x, 37, 7, [[0, '#fff'], [0.4, '#ff9a2a'], [1, '#6a3a0a']]); g.beginPath(); g.arc(x, 37, 6, 0, TAU); g.fill(); }
    g.fillStyle = '#20242e'; g.fillRect(44, 51, 8, 3); g.fillRect(58, 51, 8, 3);
    g.strokeStyle = '#8a4a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(66, 46); g.lineTo(72, 60); g.stroke();
    g.restore();
  }),
  eco: sprite(110, 110, g => {
    portraitFrame(g, '#39ff88');
    g.save(); g.shadowColor = '#39ff88'; g.shadowBlur = 8; g.strokeStyle = 'rgba(57,255,136,0.9)'; g.lineWidth = 1.5;
    const pts = [[55, 18], [80, 34], [84, 62], [70, 86], [55, 92], [40, 86], [26, 62], [30, 34]];
    g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke();
    for (const [x, y] of pts) { g.beginPath(); g.moveTo(55, 56); g.lineTo(x, y); g.stroke(); }
    g.fillStyle = '#eaffd0'; for (const x of [44, 66]) { g.beginPath(); g.ellipse(x, 52, 7, 3, 0, 0, TAU); g.fill(); }
    g.beginPath(); g.moveTo(44, 74); g.lineTo(55, 70); g.lineTo(66, 74); g.stroke();
    g.restore();
    g.fillStyle = 'rgba(57,255,136,0.08)'; for (let y = 10; y < 100; y += 4) g.fillRect(10, y, 90, 1);
  }),
  arconte: sprite(110, 110, g => {
    portraitFrame(g, '#ff2a2a');
    g.save(); g.beginPath(); g.arc(55, 55, 50, 0, TAU); g.clip();
    g.fillStyle = '#1a1418'; poly(g, [55, 100, 84, 70, 90, 30, 74, 8, 55, 20, 36, 8, 20, 30, 26, 70]); g.fill();
    g.strokeStyle = '#ff2a2a'; g.lineWidth = 2; g.stroke();
    for (const s of [-1, 1]) { g.fillStyle = '#3a3036'; poly(g, [55 + s * 18, 22, 55 + s * 40, -4, 55 + s * 28, 28]); g.fill(); }
    g.fillStyle = radial(g, 55, 52, 26, [[0, 'rgba(255,60,30,0.9)'], [1, 'rgba(255,0,0,0)']]); g.beginPath(); g.arc(55, 52, 26, 0, TAU); g.fill();
    g.fillStyle = radial(g, 55, 52, 14, [[0, '#fff6c0'], [0.45, '#ffb02a'], [1, '#ff2a2a']]); g.beginPath(); g.ellipse(55, 52, 15, 10, 0, 0, TAU); g.fill();
    g.fillStyle = '#1a0000'; g.beginPath(); g.ellipse(55, 52, 2.5, 9, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,42,42,0.8)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(40, 70); g.lineTo(48, 84); g.moveTo(70, 70); g.lineTo(62, 86); g.moveTo(55, 66); g.lineTo(55, 92); g.stroke();
    g.restore();
  })
};
const CHARS = {
  iris: { name: 'COMANDANTE IRIS VALE', col: '#00e5ff' },
  rook: { name: 'ROOK · INGENIERO JEFE', col: '#ffc83a' },
  eco: { name: 'ECO · IA DE COMBATE', col: '#39ff88' },
  arconte: { name: 'EL ARCONTE', col: '#ff3a3a' }
};

/* ---------------- Guion ---------------- */
const STORY = {
  intro: [
    ['iris', 'NOVA-1, aquí la comandante Vale. Hace una hora se abrió una brecha en el cielo de Neo-Metrópolis.'],
    ['iris', 'De ella salieron naves que no figuran en ningún registro. El resto del Escuadrón Aurora no respondió. Eres el último piloto en el aire.'],
    ['eco', 'Sistemas de combate en línea. Detecto una nave nodriza coordinando el ataque desde el sector central.'],
    ['rook', 'Te dejé la nave lista, chico. Recoge los cristales que suelten esos bichos: con ellos puedo mejorar el armamento en pleno vuelo.'],
    ['arconte', 'Pequeña chispa. Todas las estrellas se apagan. La vuestra será la próxima.'],
    ['iris', 'Ignora esa transmisión. Despeja la ciudad y derriba la nave nodriza. Buena caza, NOVA-1.']
  ],
  after: [
    [['iris', '¡La Nave Nodriza cayó! Pero la señal del enemigo no se apagó: viene de la órbita.'],
     ['eco', 'Hay un coloso blindado custodiando la estación orbital. Allí arriba no hay atmósfera que frene sus disparos.'],
     ['rook', 'Ajusté tus propulsores para el vacío. No me rompas la nave en el primer viaje.']],
    [['iris', 'La estación es nuestra otra vez. El Coloso transmitía coordenadas hacia la Zona Cuarentena.'],
     ['arconte', 'Sus guardianes caen, pero el Heraldo que despierta en las ruinas no conoce la piedad.'],
     ['eco', 'Firma biológica enorme detectada bajo los escombros. Se mueve como una serpiente.']],
    [['rook', '¿Viste el tamaño de esa cosa? VROAR era una nave viva, mitad máquina, mitad bestia.'],
     ['iris', 'Y no es la única. En el Desierto de Cristal algo está criando más naves como esa.'],
     ['eco', 'La Colmena produce un dron por segundo. Si destruyes sus incubadoras, el núcleo quedará expuesto.']],
    [['iris', 'La Colmena ardió. Sin ella, su flota pierde refuerzos.'],
     ['arconte', 'Insistes en luchar contra el océano a cucharadas. Goliat te espera entre el hierro fundido.'],
     ['rook', 'Esa bestia tiene garras que bloquean los disparos. Apunta a la boca cuando la abra.']],
    [['eco', 'Goliat neutralizado. Las lecturas indican túneles bajo el distrito industrial.'],
     ['iris', 'Algo se esconde en las cavernas. NOVA-1, baja y averigua qué protegen.'],
     ['rook', 'Si es una araña, ve por los costados. Siempre se cubren el frente.']],
    [['iris', 'Las cavernas estaban llenas de huevos. Destruiste el nido justo a tiempo.'],
     ['eco', 'Interferencia eléctrica masiva sobre el océano. Una estación anular está generando la tormenta.'],
     ['arconte', 'La tormenta es mi voz. Escúchala romper tus alas.']],
    [['rook', '¡Eso fue un espectáculo! Cuando sus rayos paran, se sobrecarga. Aprovéchalo siempre.'],
     ['iris', 'El Pantano Tóxico es lo siguiente. Los informes hablan de una criatura con varias cabezas.'],
     ['eco', 'Recomendación: corta las tres cabezas antes de que se regeneren.']],
    [['iris', 'La Hidra cayó. Ya casi llegamos al origen de la brecha.'],
     ['eco', 'Advertencia: en la tundra detecto una nave que aparece y desaparece. Y crea copias de sí misma.'],
     ['arconte', 'No puedes herir lo que no puedes ver, pequeña chispa.']],
    [['iris', 'El Fantasma se rompió en mil cristales. NOVA-1... encontramos el corazón de la brecha.'],
     ['eco', 'El Sector Omega alberga un agujero negro artificial. Está devorando la órbita terrestre.'],
     ['arconte', 'Soy el final de todas las luces. Ven, entra en mi horizonte.'],
     ['rook', 'Te di todo lo que tenía, piloto. Vuelve entero. Esa es una orden de tu mecánico.'],
     ['iris', 'Destruye el Núcleo Omega. Toda la Tierra está mirando el cielo esta noche.']]
  ],
  ending: [
    ['eco', 'Núcleo Omega destruido. La brecha se está cerrando. Repito: la brecha se está cerrando.'],
    ['iris', 'Lo lograste, NOVA-1. Hoy amanece en Neo-Metrópolis gracias a ti.'],
    ['rook', 'Mi nave volvió casi entera. Casi. Voy a necesitar una semana para pulir esas abolladuras.'],
    ['arconte', 'Una estrella se apaga... y otra se enciende. Volveremos, pequeña chispa.'],
    ['eco', 'Alerta: nuevas firmas detectadas más allá de la órbita. Iniciando el Ciclo 2.'],
    ['iris', 'Nunca hay descanso para el último piloto. Al aire, NOVA-1.']
  ]
};
const TAUNTS = [
  'Mi Nave Nodriza os observa con un solo ojo. Es más que suficiente.',
  'El Coloso no siente dolor. Solo cumple.',
  'VROAR tiene hambre. Y tú hueles a metal fresco.',
  'Cada huevo de la Colmena es un soldado más. Yo nunca me quedo sin ejército.',
  'Goliat aplastará tu chispa entre sus garras.',
  'El Arácnido ya tejió tu tumba bajo tierra.',
  'Que la Tormenta te enseñe lo pequeña que eres.',
  'Corta una cabeza y crecerán otras. La Hidra es eterna.',
  '¿Cuál de ellos es el verdadero? Nunca lo sabrás.',
  'Bienvenida a mi corazón. Aquí termina tu luz.'
];
const TIPS = [
  ['rook', 'Recoge cristales verdes para subir de nivel. Cada golpe que recibas te baja uno.'],
  ['eco', 'En órbita, los enemigos llegan en formación. Mantente en movimiento.'],
  ['rook', 'Los enemigos con brillo dorado son élites: más duros, pero sueltan más monedas.'],
  ['eco', 'Las ráfagas de arena ocultan a los enemigos. Confía en tus sensores.'],
  ['rook', 'Tu barra ULTRA se carga con cada derribo. Guárdala para el jefe si puedes.'],
  ['eco', 'Las esporas son inofensivas. Las minas no.'],
  ['iris', 'Cuidado con las emboscadas: las flechas rojas abajo indican por dónde vienen.'],
  ['rook', 'El power-up E te da una barrera que aguanta tres impactos. Vale oro.'],
  ['eco', 'Temperatura bajo cero. Mi rendimiento no se ve afectado. El tuyo, quizá sí.'],
  ['iris', 'Este es el último sector. Todo lo que aprendiste te ha traído hasta aquí.']
];

/* ---------------- Escenas bloqueantes ---------------- */
let SCENE = null;
function playScene(lines, done) {
  if (!SET.story || !lines || !lines.length) { if (done) done(); return; }
  SCENE = { lines, i: 0, t: 0, done }; G.storyPrev = G.state; G.state = 'story'; dragId = null;
}
function sceneLine() { return SCENE.lines[SCENE.i]; }
function advanceScene() {
  const [, text] = sceneLine(), shown = Math.floor(SCENE.t * 45);
  if (shown < text.length) { SCENE.t = 999; return; }
  SCENE.i++; SCENE.t = 0; SFX.ui();
  if (SCENE.i >= SCENE.lines.length) endScene();
}
function endScene() { const d = SCENE && SCENE.done; SCENE = null; G.state = 'play'; if (d) d(); }
const SKIP_BTN = () => ({ x: W - 132, y: 176, w: 112, h: 40 });
function storyTap(x, y) { if (inR(x, y, SKIP_BTN())) { SFX.ui(); endScene(); return; } advanceScene(); }
function drawStory() {
  if (!SCENE) return;
  ctx.fillStyle = 'rgba(2,4,12,0.55)'; ctx.fillRect(0, 0, W, H);
  const [who, text] = sceneLine(), C = CHARS[who], y = H - 250;
  btn(SKIP_BTN(), 'OMITIR ▸▸', '#9fb4cc', false, 14);
  ctx.fillStyle = 'rgba(6,8,20,0.94)'; rr(ctx, 14, y, W - 28, 220, 16); ctx.fill();
  ctx.strokeStyle = C.col; ctx.lineWidth = 2; ctx.stroke();
  const p = PORTRAIT[who], bob = Math.sin(G.t * 3) * 2;
  ctx.drawImage(p, 26, y - 56 + bob, 110, 110);
  txt(C.name, 146, y + 26, 15, C.col, 'left', null, 900);
  const shown = text.slice(0, Math.floor(SCENE.t * 45));
  ctx.font = `600 17px ${FONT}`; let line = '', yy = y + 76;
  for (const w of shown.split(' ')) {
    const t2 = line ? line + ' ' + w : w;
    if (ctx.measureText(t2).width > W - 70 && line) { txt(line, 34, yy, 17, '#eef2fa', 'left', null, 600); line = w; yy += 26; } else line = t2;
  }
  if (line) txt(line, 34, yy, 17, '#eef2fa', 'left', null, 600);
  if (shown.length >= text.length && Math.floor(G.t * 2) % 2 === 0) txt('▼ toca para continuar', W - 34, y + 200, 12, '#8fa0b8', 'right', null, 700);
  for (let i = 0; i < SCENE.lines.length; i++) { ctx.fillStyle = i <= SCENE.i ? C.col : 'rgba(255,255,255,0.15)'; ctx.fillRect(34 + i * 14, y + 196, 10, 4); }
}
function afterBoss(idx) {
  const cycle1 = level <= BOSS_DEFS.length + 1;
  if (idx === BOSS_DEFS.length - 1 && cycle1) playScene(STORY.ending, () => { FT.push({ x: W / 2, y: H * 0.4, t: 0, s: 'FIN · GRACIAS POR JUGAR', big: true, col: '#ffd23f' }); showBanner(); });
  else if (cycle1) playScene(STORY.after[idx], showBanner);
  else showBanner();
}

/* ---------------- Radio (no bloquea el juego) ---------------- */
let RADIO = null, tipDone = {};
function radio(who, text) { if (!SET.story) return; RADIO = { who, text, t: 0 }; }
function updateRadio(dt) {
  if (RADIO) { RADIO.t += dt; if (RADIO.t > 6) RADIO = null; }
  if (G.state !== 'play' || G.phase !== 'waves') return;
  if (stageT > 16 && !tipDone[level]) { tipDone[level] = 1; const [w, t] = TIPS[(level - 1) % TIPS.length]; radio(w, t); }
}
function drawRadio() {
  if (!RADIO || G.state === 'story') return;
  const C = CHARS[RADIO.who], k = Math.min(1, RADIO.t * 4, (6 - RADIO.t) * 3), y = H - 236;
  ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(6,8,20,0.85)'; rr(ctx, 14, y, W - 28, 74, 12); ctx.fill();
  ctx.strokeStyle = C.col; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.drawImage(PORTRAIT[RADIO.who], 20, y + 5, 64, 64);
  txt(C.name, 92, y + 16, 11, C.col, 'left', null, 900);
  ctx.font = `600 13px ${FONT}`; let line = '', yy = y + 36;
  for (const w of RADIO.text.split(' ')) { const t2 = line ? line + ' ' + w : w; if (ctx.measureText(t2).width > W - 130 && line) { txt(line, 92, yy, 13, '#e8ecf4', 'left', null, 600); line = w; yy += 17; } else line = t2; }
  if (line) txt(line, 92, yy, 13, '#e8ecf4', 'left', null, 600);
  ctx.globalAlpha = 1;
}
