# Club Cavallino Ibérico — web + área privada

**En producción: https://cavallino-iberico.vercel.app** · socio `0147` / `cavallino2026`

Club ficticio de propietarios de superdeportivos. Proyecto de demostración de SIMBAI.
Sin vinculación con ningún fabricante ni club oficial: el nombre, el logo y todos los
datos son inventados.

## Arrancar en local

```bash
npm install
npm run seed          # crea el esquema y los datos de ejemplo
npm run dev           # http://localhost:3210
npm run test:all      # 75 comprobaciones (con el servidor arrancado)
```

Acceso de prueba: **socio `0147`** · contraseña **`cavallino2026`** — pertenece a la junta,
así que ve también el panel de gestión. Los otros cuatro socios comparten esa contraseña
(cada uno con su propio salt) y solo acceden a su área privada.

Para probar contra producción: `node test/junta.mjs https://cavallino-iberico.vercel.app`.
Las baterías crean sus propios datos, así que no dependen del estado previo de la base.
Después, `node --env-file=.env.run db/limpiar.mjs` borra los restos.

Para ponerlo online: ver [DESPLIEGUE.md](DESPLIEGUE.md).

## Estructura

| Archivo | Qué hace |
|---|---|
| `index.html` | Web pública: 8 secciones, login y formulario de admisión |
| `panel.html` | Área privada: ficha, inscripciones, convocatorias, directorio |
| `junta.html` | Panel de junta: solicitudes, socios, altas y convocatorias |
| `fx.js` | Motor de efectos (reveal, contadores, spotlight, glow) |
| `api/*.mjs` | Una función serverless por endpoint |
| `api/_lib/logica.mjs` | Lógica de negocio, sin dependencias de HTTP |
| `api/_lib/datos.mjs` | `pg` en local, driver de Neon en la nube |
| `api/_lib/auth.mjs` | Hash scrypt, tokens de sesión, cookies |
| `server.mjs` | Servidor local; importa las mismas funciones que Vercel ejecuta |
| `db/schema.sql` | Tablas del esquema `cavallino` |
| `db/seed.mjs` | Crea esquema e inserta datos de ejemplo |
| `test/regresion.mjs` | Batería de 28 pruebas de API y seguridad |

## API

| Método y ruta | Sesión | Qué hace |
|---|---|---|
| `POST /api/login` | no | Autentica y abre sesión |
| `POST /api/logout` | no | Cierra sesión y borra la cookie |
| `GET /api/panel` | sí | Ficha, inscripciones, convocatorias y directorio |
| `POST /api/inscribir` | sí | Reserva plaza en una convocatoria |
| `POST /api/anular` | sí | Anula la inscripción |
| `POST /api/solicitud` | no | Guarda una solicitud de admisión |
| `POST /api/cuenta` | sí | `password` para cambiarla, `perfil` para editar los datos |
| `GET /api/junta` | junta | Resumen: solicitudes, socios, convocatorias, contadores |
| `POST /api/junta` | junta | `resolver` una solicitud, `alta` de socio o crear `evento` |

**Cambio de contraseña**: exige la actual (403 si no coincide) y al completarse **cierra las
demás sesiones** de ese socio — si alguien había entrado con la contraseña antigua, queda
fuera. El socio puede editar su correo, zona y vehículo, pero no su número, modalidad ni el
rol de junta: eso solo lo cambia la junta.

Los endpoints de junta exigen sesión **y** rol: un socio con sesión válida pero sin
`junta = TRUE` recibe 403, no 401. El enlace al panel solo se muestra a quien tiene el rol,
pero el bloqueo real está en el servidor — escribir la URL a mano no sirve de nada.

## Decisiones de seguridad

- **Contraseñas con `scrypt`** (N=16384, r=8, p=1), salt único por socio y comparación
  con `timingSafeEqual`. Nunca se guarda ni se registra la contraseña en claro.
- **Consultas parametrizadas** en todas las llamadas: no se concatena entrada de usuario en SQL.
- **Cookie `HttpOnly` + `SameSite=Strict`**: no accesible desde JavaScript (mitiga XSS)
  ni enviada en peticiones de terceros (mitiga CSRF). Añade `Secure` cuando
  `NODE_ENV=production`.
- **Bloqueo por fuerza bruta**: 5 intentos fallidos bloquean la cuenta 15 minutos.
  El bloqueo es por socio y resiste incluso con la contraseña correcta.
- **Mismo mensaje de error** para socio inexistente y contraseña incorrecta, con coste
  de cómputo similar, para no permitir enumerar qué números de socio existen.
- **Sesiones en base de datos** con caducidad de 12 h y purga horaria de las caducadas.

Pendiente si esto pasara a producción real: HTTPS obligatorio, límite de peticiones por IP
(no solo por cuenta), token CSRF explícito si se añaden orígenes cruzados, y flujo de
recuperación de contraseña.

## Desplegar

Pasos detallados en [DESPLIEGUE.md](DESPLIEGUE.md): base en Neon, variables de entorno y
`vercel --prod`. El código no necesita cambios — lee `DATABASE_URL` del entorno y elige
solo el driver adecuado.

Funciona igual en Railway, Render, Fly.io o un VPS ejecutando `server.mjs`, que es un
servidor Node estándar.

Antes de abrirlo a socios reales: cambiar las contraseñas de ejemplo, sustituir los
placeholders `[CUOTA]`, `[TELÉFONO DEL CLUB]` y `[DIRECCIÓN]`, y revisar el aviso de
protección de datos del formulario.
