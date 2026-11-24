# Notas del proyecto · Nova Strike

Resumen de la sesión de desarrollo (23 y 24 de noviembre de 2026).

- Versión jugable en el navegador: https://claude.ai/artifact/PmW6C37AzUcix2tt7vZ3Te (privada hasta que la compartas).
- Código: rama `claude/github-app-install-2mr3cs` del repositorio `drako188/braulio`.

## Qué es
Shooter vertical futurista para Android, original. El juego está hecho en HTML5 Canvas (`www/`) y se empaqueta en una app Android nativa (`android/`) que lo muestra a pantalla completa. El APK se compila en GitHub Actions.

## Lo que se hizo, en orden
1. **Juego base**: ciudad neón generada por código, caza con disparo automático, power-ups, bomba y la Nave Nodriza como jefe. Proyecto Android y compilación en GitHub.
2. **Variedad**:
   - 3 dificultades.
   - 4 naves con estadísticas distintas.
   - Enemigos nuevos: tanques, cazas, kamikazes, minas y bombarderos.
   - Jefes Coloso y VROAR.
   - Mejoras visuales.
3. **Fase 1 · Sonido**: música synthwave generada por código (menú, combate, alerta, un tema por jefe, victoria y fin de partida), efectos por arma y ajustes de audio y vibración.
4. **Fase 2 · Progresión**: cristales de XP, niveles de nave del 1 al 10 (cada golpe baja uno), vidas y 10 power-ups.
5. **Fase 3 · Naves**: Fénix, Centinela y Vórtice (7 en total) y un ataque ULTRA para cada nave.
6. **Fase 4 · Jefes**: 10 jefes, cada uno con virtud, debilidad y ataque especial, y Ciclo 2 al vencer al Núcleo Omega.
7. **Ajustes de juego**: sonido del láser del Vórtice más suave, Intermedio más difícil, eventos aleatorios, enemigos élite, combos y disparos que anticipan tu movimiento.
8. **Mejoras**:
   - 10 escenarios con clima propio.
   - Tienda y monedas: hangar con mejoras y naves desbloqueables.
   - 34 logros y misiones diarias.
   - Modo historia: Iris Vale, Rook, ECO y el Arconte.
9. **Arte**: las 7 naves y los 10 jefes se redibujaron en vista cenital a partir de las imágenes que enviaste.
10. **Fase A · Listo para móvil**:
    - Ajuste de gráficos (automático, alta, media, baja).
    - Continuar partida desde el último sector.
    - Tutorial en la primera partida.
    - Ícono nuevo e imágenes para Google Play en `store/`.
    - Compilación firmada en formato AAB.
11. **Fase B · Ingresos**: anuncios AdMob (con recompensa y entre partidas), compras de Google Play, tienda con Pack Piloto, Sin anuncios y bolsas de monedas, y guía `PUBLICAR.md`.
12. **Fase C**: Modo Infinito y pantalla de resultados con calificación S/A/B/C.
13. **Corrección**: la Hidra se quedaba trabada al cortarle las cabezas a disparos. Arreglado, con una comprobación general para que ningún jefe vuelva a quedarse atascado.

## Decisiones tomadas
- **Tecnología**: HTML5 Canvas sin dependencias dentro de una app Android nativa. Se puede probar en cualquier navegador.
- **Compilación**: el APK solo se compila a mano (Actions → Build APK → Run workflow). Tú decidiste no compilar hasta terminar y probar todo.
- **Jefes**: 10 en total (3 originales y 7 nuevos), cada uno con virtudes, debilidades y ataques especiales propios.
- **Progresión**: niveles con cristales de XP. Un golpe quita escudo y baja un nivel. Sin escudo se pierde una vida, y sin vidas termina la partida.
- **Música**: generada por código (synthwave), sin archivos ni derechos de autor.
- **Trabajo por fases**, publicando cada una para probarla.
- **Dificultad**: Intermedio más exigente y juego más frenético e impredecible, según tu prueba.
- **Asignación de arte**:
  - Naves: plateada → Halcón, alienígena verde → Rayo, acorazada roja → Titán, negra morada → Espectro, dorada → Fénix, carguero amarillo → Centinela, blanca fucsia → Vórtice.
  - Jefes: cada imagen se asignó al jefe con mecánica parecida. Por ejemplo, la del ojo rojo es la Nave Nodriza, el agujero negro es el Núcleo Omega y la de varias cabezas es la Hidra.
- **Ingresos**:
  - Anuncios con recompensa opcionales: revivir, monedas ×2 y monedas gratis (3 al día).
  - Un anuncio entre partidas cada 3 partidas, nunca durante el combate.
  - Compras: Pack Piloto 2,99 US$, Sin anuncios 1,99 US$, y monedas a 0,99, 2,49 y 4,99 US$.
- **Naves de inicio**: Halcón, Rayo y Titán. Las otras 4 se compran con monedas (600, 900, 1400 y 2000).

## Pendiente
### Por verificar
- [ ] **El código nativo de anuncios y compras (`Monetization.java`) no se ha compilado nunca.** Al compilar el primer APK hay que revisar que no falle. La última compilación que funcionó es anterior a ese código.
- [ ] Probar en tu teléfono el APK de prueba: rendimiento, controles, sonido y anuncios de prueba.
- [ ] Revisar el equilibrio en partidas largas: Núcleo Omega fase 3, Goliat, Modo Infinito y Ciclo 2.

### Para publicar y cobrar (ver `PUBLICAR.md`)
- [ ] Crear la cuenta de Google Play Console (25 US$) y hacer la prueba cerrada con 12 testers durante 14 días.
- [ ] Crear la llave de firma y guardar los 4 secretos en GitHub (`NS_KEYSTORE_BASE64`, `NS_KEYSTORE_PASSWORD`, `NS_KEY_ALIAS`, `NS_KEY_PASSWORD`).
- [ ] Crear la cuenta de AdMob y poner tus 3 IDs en `android/app/src/main/res/values/ads.xml`. Ahora tiene los IDs de prueba de Google, que no generan dinero.
- [ ] Crear en Play Console los 5 productos con sus IDs: `starter_pack`, `remove_ads`, `coins_small`, `coins_medium`, `coins_large`.
- [ ] Configurar el perfil de pagos en Play Console.
- [ ] Completar `store/politica-privacidad.html` (fecha, nombre y correo) y publicarla en una web.
- [ ] Subir la ficha de tienda con `store/ficha-tienda.md`, el ícono, el gráfico destacado y las capturas.
- [ ] Compilar la versión firmada: Actions → Build APK → Run workflow, marcando "Versión firmada".

### Ideas propuestas sin hacer
- Modo Jefes (Boss Rush) y minijefes a mitad de sector.
- Armas secundarias equipables.
- Pausa breve al destruir enemigos grandes, para que los golpes se sientan más.
- Pantalla de inicio animada y galería de naves y jefes.
- Tabla de récords local, récords en línea con Google Play Games y colores alternativos para las naves.

## Estructura de archivos
- `www/index.html` y `www/js/*.js`: el juego. `core`, `sprites`, `background`, `audio`, `game`, `progress`, `ships`, `shipskins`, `bosses`, `bossskins`, `chaos`, `themes`, `shop`, `achievements`, `story`, `quality`, `monetize`, `modes`, `render` e `input`.
- `android/`: la app Android (`MainActivity.java`, `Monetization.java` y `res/values/ads.xml`).
- `.github/workflows/android.yml`: compilación del APK de prueba y de la versión firmada.
- `store/`: material para Google Play.
- `README.md`: cómo se juega. `PUBLICAR.md`: guía de publicación e ingresos.
