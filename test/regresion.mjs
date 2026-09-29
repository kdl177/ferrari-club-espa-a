// Regresión: compara el comportamiento de las funciones refactorizadas
// contra lo verificado en la fase 2.
// Por defecto, servidor local. Para probar producción:
//   node test/regresion.mjs https://cavallino-iberico.vercel.app
const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:3210';
console.log(`Probando contra: ${BASE}`);
let cookie = '';
let fallos = 0, aciertos = 0;

function comprobar(nombre, real, esperado) {
  const ok = JSON.stringify(real) === JSON.stringify(esperado);
  if (ok) { aciertos++; console.log(`  OK   ${nombre}`); }
  else { fallos++; console.log(`  FALLA ${nombre}\n        esperado: ${JSON.stringify(esperado)}\n        real:     ${JSON.stringify(real)}`); }
}

async function pedir(ruta, opciones = {}) {
  const cab = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
  if (cookie) cab.Cookie = cookie;
  const r = await fetch(BASE + ruta, { ...opciones, headers: cab });
  const set = r.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  let datos = null;
  try { datos = await r.json(); } catch {}
  return { status: r.status, datos, setCookie: set };
}

console.log('\n=== AUTENTICACIÓN ===');
let r = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: '0147', password: 'cavallino2026' }) });
comprobar('login correcto', [r.status, r.datos.ok, r.datos.nombre], [200, true, 'Elena Vidal Sanz']);
comprobar('cookie HttpOnly+SameSite', [/HttpOnly/.test(r.setCookie), /SameSite=Strict/.test(r.setCookie)], [true, true]);

const guardada = cookie;
cookie = '';
r = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: '0208', password: 'malamalamala' }) });
comprobar('contraseña incorrecta', [r.status, r.datos.error], [401, 'Número de socio o contraseña incorrectos.']);

cookie = '';
r = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: '9999', password: 'cualquiera123' }) });
comprobar('socio inexistente (mismo mensaje)', [r.status, r.datos.error], [401, 'Número de socio o contraseña incorrectos.']);

cookie = '';
r = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: "0147' OR '1'='1", password: 'x' }) });
comprobar('inyección SQL en número', [r.status, r.datos.error], [400, 'Revisa el número de socio y la contraseña.']);

cookie = '';
r = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: '0147', password: "' OR 1=1--" }) });
comprobar('inyección SQL en contraseña', [r.status, r.datos.error], [401, 'Número de socio o contraseña incorrectos.']);

console.log('\n=== SESIÓN ===');
cookie = '';
r = await pedir('/api/panel');
comprobar('panel sin sesión', [r.status, r.datos.error], [401, 'Sesión no válida.']);

cookie = 'cav_sesion=tokenfalsoinventado';
r = await pedir('/api/panel');
comprobar('panel con cookie falsa', [r.status, r.datos.error], [401, 'Sesión no válida.']);

cookie = guardada;
r = await pedir('/api/panel');
const d = r.datos;
comprobar('panel con sesión válida', [r.status, d.socio.nombre, d.socio.modalidad], [200, 'Elena Vidal Sanz', 'Titular']);
comprobar('datos del panel', [d.inscripciones.length, d.proximos.length, d.directorio.length, d.totalSocios], [2, 4, 5, 5]);
comprobar('fechas sin desfase de zona horaria', d.proximos.map(e => e.fecha), ['2026-09-12', '2026-10-04', '2026-11-21', '2026-12-13']);

console.log('\n=== INSCRIPCIONES ===');
r = await pedir('/api/inscribir', { method: 'POST', body: JSON.stringify({ evento: 2 }) });
comprobar('inscribir en evento libre', [r.status, r.datos.ok], [200, true]);

r = await pedir('/api/inscribir', { method: 'POST', body: JSON.stringify({ evento: 2 }) });
comprobar('inscripción duplicada', [r.status, r.datos.error], [409, 'Ya estabas inscrito.']);

r = await pedir('/api/inscribir', { method: 'POST', body: JSON.stringify({ evento: 9999 }) });
comprobar('evento inexistente', [r.status, r.datos.error], [404, 'Convocatoria no disponible.']);

for (const [etiqueta, valor] of [['string con SQL', '2 OR 1=1'], ['alfanumérico', '2abc'], ['decimal', 2.5], ['nulo', null], ['negativo', '-3'], ['desbordamiento', '99999999999']]) {
  r = await pedir('/api/inscribir', { method: 'POST', body: JSON.stringify({ evento: valor }) });
  comprobar(`evento malformado (${etiqueta})`, [r.status, r.datos.error], [400, 'Evento no válido.']);
}

r = await pedir('/api/anular', { method: 'POST', body: JSON.stringify({ evento: 2 }) });
comprobar('anular inscripción', [r.status, r.datos.ok], [200, true]);

console.log('\n=== SOLICITUD DE ADMISIÓN ===');
r = await pedir('/api/solicitud', { method: 'POST', body: JSON.stringify({ nombre: 'X', email: 'no-es-correo' }) });
comprobar('correo inválido', [r.status, r.datos.error], [400, 'Nombre y correo son obligatorios.']);

r = await pedir('/api/solicitud', { method: 'POST', body: JSON.stringify({ nombre: 'Álvaro Ruiz', email: 'a@b.es', modalidad: 'Clásicos', vehiculo: 'Berlinetta', anio: 1968 }) });
comprobar('solicitud con modalidad acentuada', [r.status, r.datos.ok], [200, true]);

console.log('\n=== LOGOUT ===');
r = await pedir('/api/logout', { method: 'POST' });
comprobar('logout', [r.status, r.datos.ok], [200, true]);
cookie = guardada;
r = await pedir('/api/panel');
comprobar('panel tras logout', [r.status, r.datos.error], [401, 'Sesión no válida.']);

console.log('\n=== FUERZA BRUTA ===');
cookie = '';
let ultimo;
for (let i = 1; i <= 5; i++) {
  ultimo = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: '0311', password: 'malamalamala' }) });
  cookie = '';
}
comprobar('bloqueo al 5º intento', [ultimo.status, /bloqueada/.test(ultimo.datos.error)], [429, true]);
ultimo = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: '0311', password: 'cavallino2026' }) });
comprobar('bloqueo resiste contraseña correcta', [ultimo.status, /Demasiados intentos/.test(ultimo.datos.error)], [429, true]);
cookie = '';
ultimo = await pedir('/api/login', { method: 'POST', body: JSON.stringify({ numero: '0095', password: 'cavallino2026' }) });
comprobar('otro socio no afectado', [ultimo.status, ultimo.datos.ok], [200, true]);

console.log(`\n${'='.repeat(46)}`);
console.log(`RESULTADO: ${aciertos} correctas, ${fallos} fallos`);
process.exit(fallos ? 1 : 0);
