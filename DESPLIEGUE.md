# Despliegue

**La web está online: https://cavallino-iberico.vercel.app**

Acceso de prueba: socio `0147` · contraseña `cavallino2026`

| | |
|---|---|
| Proyecto Vercel | `simbai/cavallino-iberico` |
| Base de datos | Neon `cavallino-db` (us-east-1), conectada como integración |
| Panel | https://vercel.com/simbai/cavallino-iberico |

---

## Cómo se desplegó

Queda documentado por si hay que repetirlo o montar otro proyecto igual.

```bash
vercel link --yes --project cavallino-iberico --scope simbai
vercel integration add neon --name cavallino-db --environment production --no-claim
```

La integración de Neon inyecta `DATABASE_URL` y `POSTGRES_*` en el proyecto sola: no hay
que copiar credenciales a mano. Después se carga el esquema usando la conexión directa
(`DATABASE_URL_UNPOOLED`, la adecuada para migraciones):

```bash
vercel env pull .env.produccion --environment production --yes
# y con DATABASE_URL apuntando a la cadena UNPOOLED:
node db/seed.mjs
```

Y se publica:

```bash
printf 'production' | vercel env add NODE_ENV production
vercel --prod --yes
```

`NODE_ENV=production` es lo que activa el flag `Secure` de la cookie de sesión.

## Volver a desplegar

Tras cualquier cambio en el código:

```bash
vercel --prod --yes
```

## Detalle que costó un despliegue

Vercel detecta este proyecto como "Node" y **no sirve los estáticos de la raíz**: el primer
despliegue devolvió 404 en `/` aunque la API respondía bien. Por eso `index.html`,
`panel.html` y `fx.js` viven en `public/`, declarado en `vercel.json` como
`outputDirectory`. El servidor local apunta a esa misma carpeta, así que ambos entornos
sirven exactamente los mismos archivos.

---

## Lighthouse

Medido sobre la URL de producción (mediana de cuatro ejecuciones — Lighthouse tiene
bastante varianza entre pasadas, conviene medir varias veces antes de sacar conclusiones):

| Categoría | Antes | Ahora |
|---|---|---|
| Rendimiento | 80 | **96** |
| Accesibilidad | 98 | **100** |
| Buenas prácticas | 100 | **100** |
| SEO | 100 | **100** |

Lo que movió la aguja:

- **Fuentes sin bloquear el pintado** (`preload` + `media="print"` con `onload`, y
  `<noscript>` de reserva). El primer pintado bajó de 3,8 s a ~1,3–2,2 s.
- **Jerarquía de encabezados**: el pie usaba `<h4>` sin `<h3>` previo.
- **Nombre accesible del logo**: tenía un `aria-label` que no contenía su texto visible,
  así que el control por voz no podía activarlo. Ahora el nombre sale del propio texto y
  el destino se indica con `title`.

Recursos de SEO añadidos: `robots.txt` (que bloquea `/panel.html`, `/junta.html` y `/api/`),
`sitemap.xml` y una imagen `og.png` de 1200×630 generada a partir de `og.svg`.

## Por qué no hay más efectos animados

Con la CPU limitada a 1/4 (equivalente a un móvil de gama media) la home ya rueda a
**55 FPS de media, con el p95 en 18 ms** — por encima del presupuesto de 16,7 ms por frame.
No queda margen: cualquier animación continua adicional empujaría esos dispositivos por
debajo de 50 FPS. Los cinco efectos actuales se quedan como están.

También se descartó `content-visibility:auto` en las secciones inferiores. Ahorra
renderizado, pero **rompía la navegación por anclas** (`#cronicas` no saltaba), y perder el
enlace directo a una sección no compensa el ahorro.

Lo que sí se añadió, porque no cuesta un solo frame: enlace **«Saltar al contenido»** en las
tres páginas — antes, navegar con teclado obligaba a tabular por los ocho enlaces del menú
en cada carga.

## Verificación hecha en producción

- **28/28 pruebas** de `test/regresion.mjs` contra la URL real: inyección SQL,
  enumeración de socios, bloqueo por fuerza bruta, validación de entrada, sesiones y fechas.
- **Navegador real** (1440 y 390): login, panel con datos de Neon, inscripción con clic
  (plazas de 12 → 11) y anulación.
- **Cabeceras**: HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- **Cookie de sesión** con `Secure` activo, invisible desde JavaScript.

Para repetirlas:

```bash
node test/regresion.mjs https://cavallino-iberico.vercel.app
node --env-file=.env.run db/limpiar.mjs   # deja la base como estaba
```

La batería incluye la prueba de fuerza bruta, que **bloquea al socio 0311 durante 15
minutos**. `db/limpiar.mjs` lo desbloquea y borra las sesiones y solicitudes de prueba.

---

## Antes de enseñárselo a un cliente real

- **Cambiar las contraseñas**: los cinco socios de ejemplo comparten `cavallino2026`.
- **Sustituir los placeholders**: `[CUOTA]`, `[TELÉFONO DEL CLUB]`, `[DIRECCIÓN]`.
- **Aviso de protección de datos** en el formulario de admisión.

Lo que faltaría construir: recuperación de contraseña, panel de junta para tramitar las
solicitudes que llegan a la tabla `solicitudes`, y límite de peticiones por IP — ahora el
bloqueo es por cuenta, que frena el ataque a un socio concreto pero no un barrido general.

## Cómo está montado

```
public/           ← lo que Vercel sirve como estático
  index.html  panel.html  fx.js
api/
  login.mjs  logout.mjs  panel.mjs        ← una función por endpoint
  inscribir.mjs  anular.mjs  solicitud.mjs
  _lib/                                    ← el guion bajo evita que Vercel
    logica.mjs    ← lógica de negocio          lo trate como función
    datos.mjs     ← pg en local, Neon en la nube
    auth.mjs      ← scrypt, tokens, cookies
    http.mjs      ← Request/Response
server.mjs        ← servidor local; importa las MISMAS funciones
db/
  schema.sql  seed.mjs  limpiar.mjs  conexion.mjs
test/regresion.mjs
```

La lógica vive en `_lib/logica.mjs` y no sabe nada de HTTP. Las funciones de Vercel y el
servidor local son dos envoltorios finos sobre ella, así que **lo que se prueba en local es
literalmente el código desplegado**.

`_lib/datos.mjs` mira la `DATABASE_URL`: si apunta a Neon, Vercel Postgres o Supabase, usa
el driver serverless de Neon creando y cerrando el pool en cada petición, como exige ese
entorno. En local usa `pg` con un pool reutilizado.
