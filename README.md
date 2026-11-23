# Nova Strike

Shooter vertical futurista para Android: pilota un caza estelar sobre una ciudad neón del año 2187
y derriba oleadas de drones, interceptores, giro-drones y la gran **nave nodriza** al final de cada sector.

## Cómo se juega
- **Arrastra** el dedo en cualquier parte de la pantalla para mover la nave (disparo automático).
- **Botón naranja (bomba):** borra todas las balas enemigas y daña a todos los enemigos.
- Power-ups: **P** mejora el arma (5 niveles, misiles teledirigidos desde el nivel 4),
  **S** recupera escudo, **B** bomba extra.
- Cada sector termina con un jefe; tras derrotarlo la dificultad sube.

## Estructura
- `www/index.html` — el juego completo (HTML5 Canvas, sin dependencias, sonido sintetizado).
  Se puede abrir directamente en un navegador para probarlo.
- `android/` — app Android nativa (WebView a pantalla completa) que empaqueta `www/` como assets.
- `.github/workflows/android.yml` — compila el APK automáticamente en GitHub Actions.

## Obtener el APK
1. Ve a la pestaña **Actions** del repositorio → ejecución **Build APK** más reciente.
2. Descarga el artefacto **NovaStrike-apk** (zip) y descomprímelo.
3. Copia `app-debug.apk` al teléfono e instálalo (permite "instalar apps de origen desconocido").

### Compilar localmente
Con Android SDK y Gradle 8.7+ instalados:
```bash
cd android
gradle assembleDebug
# APK en android/app/build/outputs/apk/debug/app-debug.apk
```
