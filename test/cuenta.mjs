const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:3210';
let cookie = '';
let ok = 0, mal = 0;

function comprueba(nombre, real, esperado) {
  const bien = JSON.stringify(real) === JSON.stringify(esperado);
  if (bien) { ok++; console.log('  OK   ' + nombre); }
  else { mal++; console.log('  FALLA ' + nombre + '\n        esperado: ' + JSON.stringify(esperado) + '\n        real:     ' + JSON.stringify(real)); }
}

async function pide(ruta, opciones = {}) {
  const cab = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
  if (cookie) cab.Cookie = cookie;
  const r = await fetch(BASE + ruta, { ...opciones, headers: cab });
  const set = r.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  let datos = null;
  try { datos = await r.json(); } catch {}
  return { status: r.status, ok: r.ok, datos };
}

async function entrar(numero, password) {
  cookie = '';
  return pide('/api/login', { method: 'POST', body: JSON.stringify({ numero, password }) });
}

console.log('\nProbando Mi cuenta contra: ' + BASE);

// Se usa un socio de usar y tirar para no dejar el 0147 con otra contraseña
const marca = Date.now().toString().slice(-5);
const NUM = marca.slice(-4);
const PASS = 'inicial' + marca;

console.log('\n=== PREPARACIÓN ===');
await entrar('0147', 'cavallino2026');
let r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({
  hacer: 'alta', numero: NUM, nombre: 'Socio de prueba ' + marca,
  email: 'cuenta' + marca + '@ejemplo.es', password: PASS, modalidad: 'Titular', zona: 'Madrid'
}) });
comprueba('socio de prueba creado', [r.status, r.datos.ok], [200, true]);

console.log('\n=== ACCESO ===');
cookie = '';
r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'password', actual: 'x', nueva: 'loquesea123' }) });
comprueba('sin sesión no se puede cambiar', [r.status, r.datos.error], [401, 'Sesión no válida.']);

r = await entrar(NUM, PASS);
comprueba('el socio de prueba entra', [r.status, r.datos.ok], [200, true]);
const sesionA = cookie;

console.log('\n=== CAMBIO DE CONTRASEÑA ===');
r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'password', actual: 'nomeselacontrasena', nueva: 'otracosa2026' }) });
comprueba('contraseña actual incorrecta → 403', [r.status, r.datos.error], [403, 'La contraseña actual no es correcta.']);

r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'password', actual: PASS, nueva: 'corta' }) });
comprueba('nueva demasiado corta', [r.status, r.datos.error], [400, 'La nueva contraseña debe tener 8 caracteres o más.']);

r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'password', actual: PASS, nueva: PASS }) });
comprueba('nueva igual que la actual', [r.status, r.datos.error], [400, 'La nueva contraseña debe ser distinta de la actual.']);

// Abrir una segunda sesión: debe quedar invalidada al cambiar la contraseña
const guardaA = cookie;
await entrar(NUM, PASS);
const sesionB = cookie;
cookie = sesionB;
r = await pide('/api/panel');
comprueba('segunda sesión activa antes del cambio', r.status, 200);

cookie = guardaA;
const NUEVA = 'cambiada' + marca;
r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'password', actual: PASS, nueva: NUEVA }) });
comprueba('cambio correcto', [r.status, r.datos.ok], [200, true]);
comprueba('informa de las sesiones cerradas', r.datos.sesionesCerradas >= 1, true);

cookie = sesionB;
r = await pide('/api/panel');
comprueba('la otra sesión quedó invalidada', r.status, 401);

cookie = guardaA;
r = await pide('/api/panel');
comprueba('la sesión que cambió sigue viva', r.status, 200);

r = await entrar(NUM, PASS);
comprueba('la contraseña antigua ya no vale', r.status, 401);

r = await entrar(NUM, NUEVA);
comprueba('la contraseña nueva funciona', [r.status, r.datos.ok], [200, true]);

console.log('\n=== EDITAR PERFIL ===');
r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'perfil', email: 'no-es-correo' }) });
comprueba('correo inválido', [r.status, r.datos.error], [400, 'Correo no válido.']);

r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'perfil', email: 'elena.vidal@ejemplo.es' }) });
comprueba('correo de otro socio', [r.status, r.datos.error], [409, 'Ese correo ya lo usa otro socio.']);

r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({
  hacer: 'perfil', email: 'nuevo' + marca + '@ejemplo.es', zona: 'Levante', vehiculo: 'Coupé actualizado', anio: 2015
}) });
comprueba('edición válida', [r.status, r.datos.ok], [200, true]);

r = await pide('/api/panel');
comprueba('los datos nuevos se reflejan',
  [r.datos.socio.zona, r.datos.socio.vehiculo, r.datos.socio.anio_vehiculo],
  ['Levante', 'Coupé actualizado', 2015]);

console.log('\n=== NO SE PUEDEN TOCAR CAMPOS DE LA JUNTA ===');
const antes = (await pide('/api/panel')).datos.socio;
r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({
  hacer: 'perfil', email: antes.email, numero: '0001', modalidad: 'Clasicos', junta: true
}) });
const despues = (await pide('/api/panel')).datos.socio;
comprueba('número, modalidad y rol quedan intactos',
  [despues.numero, despues.modalidad, despues.junta],
  [antes.numero, antes.modalidad, antes.junta]);

r = await pide('/api/cuenta', { method: 'POST', body: JSON.stringify({ hacer: 'volarlo_todo' }) });
comprueba('acción no reconocida', [r.status, r.datos.error], [400, 'Acción no reconocida.']);

console.log('\n' + '='.repeat(46));
console.log('CUENTA: ' + ok + ' correctas, ' + mal + ' fallos');
process.exit(mal ? 1 : 0);
