# Nova Strike

Shooter vertical futurista para Android: pilota un caza estelar sobre una ciudad neón del año 2187
y derriba oleadas de drones, interceptores, giro-drones y la gran **nave nodriza** al final de cada sector.

## Cómo se juega
- En el menú elige **dificultad** y **nave**, y pulsa **DESPEGAR**.
- **Arrastra** el dedo para mover la nave (disparo automático).
- **Botón naranja (bomba):** borra todas las balas enemigas y daña a todos los enemigos.

### Niveles, escudo y vidas
- Los enemigos sueltan **cristales de XP** (verdes = 1, morados = 5). Al llenar la barra, la nave **sube de nivel (1–10)**:
  más disparos, +7 % de daño y +2,5 % de cadencia por nivel. Desde nivel 4 la nave brilla y en nivel 10 su aura es dorada.
- Cada golpe **baja 1 nivel** y quita 1 de escudo. Sin escudo se pierde una **vida** (reapareces con el escudo lleno).
  Sin vidas ni escudo, fin de la partida. Vidas iniciales: Fácil 4, Intermedio 3, Difícil 2.

### Power-ups
| | Efecto |
|---|---|
| **P** | Sube 1 nivel |
| **S** | +1 escudo |
| **B** | +1 bomba |
| **D** | Drones escolta que disparan (20 s) |
| **E** | Barrera que absorbe 3 impactos |
| **H** | Hiper-cadencia: disparo ×2 (10 s) |
| **M** | Imán: atrae cristales y power-ups (15 s) |
| **T** | Tiempo lento para enemigos y balas (6 s) |
| **×2** | Puntos dobles (15 s) |
| **1UP** | Vida extra (solo enemigos grandes y jefes) |

### Dificultades
| | Fácil | Intermedio | Difícil |
|---|---|---|---|
| Vida enemiga | ×0.7 | ×1 | ×1.45 |
| Velocidad/cadencia de balas | menor | normal | mayor |
| Escudo inicial | +1 | — | — |
| Power-ups | más | normal | menos |
| Puntos | ×0.7 | ×1 | ×1.6 |

Cada dificultad guarda su propio récord.

### Naves
| Nave | Fortaleza | Debilidad | Habilidad |
|---|---|---|---|
| **Halcón** | Equilibrada, plasma en abanico | — | Empieza en nivel 3 |
| **Rayo** | La más rápida, cadencia extrema, blanco pequeño | Solo 2 de escudo, poco daño por disparo | — |
| **Titán** | 5 de escudo, obuses de mucho daño, 3 bombas | Lenta, blanco grande, dispara despacio | Recupera 1 escudo cada 25 s |
| **Espectro** | Ondas que atraviesan enemigos | Cañón débil, escudo máx. 4 | Misiles teledirigidos desde el inicio |

### Enemigos
Drones, cazas en picado, cazas interceptores laterales, kamikazes, minas (estallan en balas),
giro-drones, cruceros, bombarderos pesados y **tanques terrestres** con torreta giratoria.

### Jefes finales (rotan cada sector)
1. **Nave Nodriza**: torretas, espirales y anillos de balas.
2. **Coloso Blindado**: fortaleza terrestre con cañones dobles y **rayos láser** (aviso rojo antes de disparar).
3. **VROAR**: serpiente mecánica de 14 segmentos. Su cabeza recibe todo el daño y su rugido anuncia un aliento de fuego.

Al bajar del 50 % de vida, cada jefe entra en modo furia.

### Sonido y música
Música synthwave generada en tiempo real: tema de menú, tema de combate que se intensifica con el sector,
alerta, un tema propio para cada jefe, fanfarria de victoria y tema de fin de partida.
Cada arma, disparo enemigo, láser y explosión tiene su propio sonido (con efecto estéreo).
En **⚙ Ajustes** se puede activar/desactivar y regular la música y los efectos, y la vibración.

## Estructura
- `www/index.html` + `www/js/` — el juego (HTML5 Canvas, sin dependencias):
  `core` (pantalla y utilidades), `sprites`, `background`, `audio` (efectos y música),
  `game` (lógica), `progress` (niveles, vidas y power-ups), `render` (dibujo y menús), `input` (controles y bucle).
  Se puede abrir `www/index.html` directamente en un navegador para probarlo.
- `android/` — app Android nativa (WebView a pantalla completa) que empaqueta `www/` como assets.
- `.github/workflows/android.yml` — compila el APK automáticamente en GitHub Actions.

## Obtener el APK
1. Ve a la pestaña **Actions** → **Build APK** → **Run workflow** (la compilación es manual).
2. Cuando termine, abre esa ejecución y descarga el artefacto **NovaStrike-apk** (zip) y descomprímelo.
3. Copia `app-debug.apk` al teléfono e instálalo (permite "instalar apps de origen desconocido").

### Compilar localmente
Con Android SDK y Gradle 8.7+ instalados:
```bash
cd android
gradle assembleDebug
# APK en android/app/build/outputs/apk/debug/app-debug.apk
```
