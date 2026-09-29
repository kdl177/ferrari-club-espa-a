const BASE = process.argv[2] || 'http://localhost:3210';
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
  return { status: r.status, datos };
}

async function entrar(numero, password) {
  cookie = '';
  return pide('/api/login', { method: 'POST', body: JSON.stringify({ numero, password }) });
}

console.log('\nProbando junta contra: ' + BASE);

console.log('\n=== CONTROL DE ACCESO ===');
cookie = '';
let r = await pide('/api/junta');
comprueba('junta sin sesión', [r.status, r.datos.error], [401, 'Sesión no válida.']);

await entrar('0208', 'cavallino2026');
r = await pide('/api/junta');
comprueba('socio normal → 403', [r.status, r.datos.error], [403, 'Acceso reservado a la junta.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'alta', numero: '9001', nombre: 'Intruso', email: 'x@y.es', password: '12345678', modalidad: 'Titular' }) });
comprueba('socio normal no puede dar de alta', [r.status, r.datos.error], [403, 'Acceso reservado a la junta.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'evento', titulo: 'X', fecha: '2027-01-01', plazas: 5 }) });
comprueba('socio normal no puede crear eventos', [r.status, r.datos.error], [403, 'Acceso reservado a la junta.']);

console.log('\n=== JUNTA: RESUMEN ===');
await entrar('0147', 'cavallino2026');
r = await pide('/api/junta');
comprueba('junta accede', r.status, 200);
comprueba('trae solicitudes, socios y eventos',
  [Array.isArray(r.datos.solicitudes), Array.isArray(r.datos.socios), Array.isArray(r.datos.eventos)],
  [true, true, true]);
comprueba('el rol viaja en la ficha', r.datos.yo.junta, true);

console.log('\n=== RESOLVER SOLICITUDES ===');
// La batería se crea su propia solicitud: así no depende del estado previo de la base
const marca = 'prueba' + Date.now().toString().slice(-6);
const guardaJunta = cookie;
cookie = '';
await pide('/api/solicitud', { method: 'POST', body: JSON.stringify({ nombre: 'Candidato ' + marca, email: marca + '@ejemplo.es', modalidad: 'Titular', vehiculo: 'Coupé de prueba', anio: 2020 }) });
cookie = guardaJunta;
r = await pide('/api/junta');
const pendiente = r.datos.solicitudes.find(s => s.estado === 'pendiente');
comprueba('la solicitud nueva aparece como pendiente', !!pendiente, true);
r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'resolver', id: pendiente.id, accion: 'aprobada', nota: 'Avalada.' }) });
comprueba('aprobar solicitud', [r.status, r.datos.ok, r.datos.estado], [200, true, 'aprobada']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'resolver', id: pendiente.id, accion: 'rechazada' }) });
comprueba('no se puede resolver dos veces', [r.status, r.datos.error], [409, 'Esa solicitud ya estaba resuelta.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'resolver', id: 99999, accion: 'aprobada' }) });
comprueba('solicitud inexistente', [r.status, r.datos.error], [404, 'Solicitud no encontrada.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'resolver', id: pendiente.id, accion: 'DROP TABLE' }) });
comprueba('acción inventada', [r.status, r.datos.error], [400, 'Acción no válida.']);

r = await pide('/api/junta');
const yaResuelta = r.datos.solicitudes.find(s => s.id === pendiente.id);
comprueba('queda registrada como aprobada', [yaResuelta.estado, !!yaResuelta.resuelta], ['aprobada', true]);

console.log('\n=== ALTA DE SOCIO ===');
r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'alta', numero: '0147', nombre: 'Dup', email: 'otro' + marca + '@ejemplo.es', password: 'clavesegura', modalidad: 'Titular' }) });
comprueba('número duplicado', [r.status, r.datos.error], [409, 'Ya existe un socio con ese número o correo.']);

// Reutiliza el correo de un socio que ya existe, sea cual sea el estado de la base
const socioExistente = (await pide('/api/junta')).datos.socios[0];
r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'alta', numero: socioExistente.numero, nombre: 'X', email: 'nuevo' + marca + '@ejemplo.es', password: 'clavesegura', modalidad: 'Titular' }) });
comprueba('número ya en uso', [r.status, r.datos.error], [409, 'Ya existe un socio con ese número o correo.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'alta', numero: '0777', nombre: 'X', email: 'x@ejemplo.es', password: 'corta', modalidad: 'Titular' }) });
comprueba('contraseña corta', [r.status, r.datos.error], [400, 'La contraseña debe tener 8 caracteres o más.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'alta', numero: '0777', nombre: 'X', email: 'no-es-correo', password: 'clavesegura', modalidad: 'Titular' }) });
comprueba('correo inválido', [r.status, r.datos.error], [400, 'Correo no válido.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'alta', numero: '0777', nombre: 'X', email: 'x@ejemplo.es', password: 'clavesegura', modalidad: 'Presidente' }) });
comprueba('modalidad inventada', [r.status, r.datos.error], [400, 'Modalidad no válida.']);

// La tilde debe normalizarse sola: el CHECK de la base no admite acentos
const sufijo = Date.now().toString().slice(-4);
r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'alta', numero: sufijo, nombre: 'Teresa Oller Camps', email: 'teresa' + sufijo + '@ejemplo.es', password: 'clavesegura2026', modalidad: 'Clásicos', zona: 'Levante', vehiculo: 'Coupé V8', anio: 2011 }) });
comprueba('alta válida con modalidad acentuada', [r.status, r.datos.ok], [200, true]);

const guardada = cookie;
r = await entrar(sufijo, 'clavesegura2026');
comprueba('la socia nueva puede entrar', [r.status, r.datos.ok], [200, true]);
cookie = guardada;

console.log('\n=== CONVOCATORIAS ===');
r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'evento', titulo: 'Prueba automática', fecha: 'mañana', plazas: 10 }) });
comprueba('fecha mal formada', [r.status, r.datos.error], [400, 'La fecha debe ser AAAA-MM-DD.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'evento', titulo: 'Prueba', fecha: '2027-03-15', plazas: 0 }) });
comprueba('plazas fuera de rango', [r.status, r.datos.error], [400, 'Las plazas deben ser un número entre 1 y 999.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'evento', titulo: '', fecha: '2027-03-15', plazas: 10 }) });
comprueba('título vacío', [r.status, r.datos.error], [400, 'El título es obligatorio.']);

r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'evento', titulo: 'Tanda de prueba automática', descripcion: 'Creada por la batería.', fecha: '2027-03-15', lugar: 'Jarama', plazas: 20, tipo: 'circuito' }) });
comprueba('crear convocatoria', [r.status, r.datos.ok], [200, true]);
const eventoNuevo = r.datos.id;

const algunEvento = (await pide('/api/junta')).datos.eventos[0];
r = await pide('/api/junta?inscritos=' + algunEvento.id);
comprueba('ver inscritos de un evento', [r.status, Array.isArray(r.datos.inscritos)], [200, true]);

r = await pide('/api/junta?inscritos=' + eventoNuevo);
comprueba('evento recién creado sin inscritos', [r.status, r.datos.inscritos.length], [200, 0]);

r = await pide('/api/junta?inscritos=abc');
comprueba('id de evento malformado', [r.status, r.datos.error], [400, 'Evento no válido.']);

console.log('\n=== ACCIÓN DESCONOCIDA ===');
r = await pide('/api/junta', { method: 'POST', body: JSON.stringify({ hacer: 'apagar_servidor' }) });
comprueba('verbo no reconocido', [r.status, r.datos.error], [400, 'Acción no reconocida.']);

console.log('\n' + '='.repeat(46));
console.log('JUNTA: ' + ok + ' correctas, ' + mal + ' fallos');
process.exit(mal ? 1 : 0);
