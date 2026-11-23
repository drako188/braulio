# Cómo publicar Nova Strike en Google Play y empezar a generar ingresos

El juego ya trae todo el código de anuncios (AdMob) y compras (Google Play Billing).
Solo falta crear tus cuentas y poner tus datos. Hazlo en este orden.

## 1. Cuenta de desarrollador de Google Play
1. Entra en https://play.google.com/console y crea una cuenta de desarrollador (pago único de 25 US$).
2. Completa la verificación de identidad que pide Google.
3. Para cuentas personales nuevas, Google exige una **prueba cerrada con 12 testers durante 14 días**
   antes de publicar en producción. Invita amigos o familiares con su correo de Gmail.

## 2. Llave de firma (una sola vez, guárdala muy bien)
En una computadora con Java instalado:
```bash
keytool -genkeypair -v -keystore novastrike.jks -alias novastrike -keyalg RSA -keysize 2048 -validity 10000
```
Si pierdes este archivo o su contraseña no podrás actualizar el juego. Haz una copia de seguridad.

Luego conviértela a texto:
```bash
base64 -w0 novastrike.jks > novastrike.txt      # en Mac: base64 -i novastrike.jks -o novastrike.txt
```

## 3. Secretos en GitHub
En el repositorio: **Settings → Secrets and variables → Actions → New repository secret**, crea:

| Nombre | Valor |
|---|---|
| `NS_KEYSTORE_BASE64` | el contenido de `novastrike.txt` |
| `NS_KEYSTORE_PASSWORD` | la contraseña de la llave |
| `NS_KEY_ALIAS` | `novastrike` |
| `NS_KEY_PASSWORD` | la contraseña de la llave |

## 4. Compilar la versión para Google Play
**Actions → Build APK → Run workflow**, marca **"Versión firmada para Google Play"** y ejecútalo.
Descarga el artefacto **NovaStrike-release**: el archivo `.aab` es el que se sube a Google Play.

Sin marcar la casilla se genera el APK de prueba para instalar directamente en tu teléfono.

## 5. AdMob (anuncios)
1. Crea una cuenta en https://admob.google.com y añade la app "Nova Strike" (Android).
2. Crea dos bloques de anuncios: **Bonificado** (rewarded) e **Intersticial**.
3. Reemplaza los 3 valores en `android/app/src/main/res/values/ads.xml`:
   - `admob_app_id` → el ID de la app (formato `ca-app-pub-XXXX~YYYY`)
   - `ad_rewarded` → el ID del bloque bonificado
   - `ad_interstitial` → el ID del bloque intersticial
4. **No toques tus propios anuncios reales**: AdMob puede suspender la cuenta. Mientras pruebas, usa los IDs de prueba
   que ya vienen puestos o registra tu teléfono como dispositivo de prueba en AdMob.
5. Vincula AdMob con tu app de Play Console una vez publicada, y crea el archivo `app-ads.txt` si AdMob lo pide.

## 6. Productos de compra (Play Console → Monetizar → Productos → Productos integrados)
Crea estos productos con **exactamente** estos IDs (los precios son sugerencias):

| ID | Nombre | Tipo | Precio sugerido |
|---|---|---|---|
| `starter_pack` | Pack Piloto (7 naves + 3.000 monedas) | Única vez | 2,99 US$ |
| `remove_ads` | Sin anuncios | Única vez | 1,99 US$ |
| `coins_small` | 2.500 monedas | Consumible | 0,99 US$ |
| `coins_medium` | 8.000 monedas | Consumible | 2,49 US$ |
| `coins_large` | 20.000 monedas | Consumible | 4,99 US$ |

Necesitas un **perfil de pagos** (Play Console → Configuración → Perfil de pagos) para cobrar.
Para probar compras sin pagar, añade tu correo en **Configuración → Pruebas de licencia**.

## 7. Ficha de la tienda
Todo está en la carpeta `store/`:
- `icono-512.png` → ícono de la app
- `grafico-destacado-1024x500.png` → gráfico destacado
- `capturas/` → 5 capturas de pantalla de teléfono
- `ficha-tienda.md` → título, descripción corta y larga
- `politica-privacidad.html` → **obligatoria** porque el juego muestra anuncios. Publícala en una web
  (por ejemplo, GitHub Pages o Google Sites) y pega el enlace en Play Console.

En el cuestionario de Play Console responde: **contiene anuncios: Sí**, **compras integradas: Sí**,
clasificación por edades sugerida: **PEGI 7 / Todos +10** (violencia de fantasía leve).

## Cómo genera ingresos el juego
- **Anuncios bonificados (opcionales)**: revivir al morir, doblar las monedas de la partida y 3 bolsas
  diarias de 200 monedas gratis en la tienda. Son los que más pagan y el jugador los elige.
- **Intersticial**: uno cada 3 partidas, solo al volver al menú y si la partida duró más de 45 segundos.
  Nunca durante el combate. Se elimina con la compra "Sin anuncios".
- **Compras**: Pack Piloto, Sin anuncios y bolsas de monedas.
