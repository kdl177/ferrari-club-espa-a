// Lógica de negocio pura: recibe (q, entrada) y devuelve { code, datos, cookie }.
// No conoce Node HTTP ni Vercel: por eso sirve igual al servidor local y a las funciones.

import { verifyPassword, nuevoToken, cookieSesion, cookieBorrado, SESION_HORAS } from './auth.mjs';

const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 15;

export function sinTildes(valor) {
  return String(valor || '').trim().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function idEvento(valor) {
  if (typeof valor === 'number') return Number.isSafeInteger(valor) && valor > 0 ? valor : null;
  if (typeof valor === 'string' && /^\d{1,9}$/.test(valor.trim())) {
    const n = Number(valor.trim());
    return n > 0 ? n : null;
  }
  return null;
}

export async function socioDeToken(q, token) {
  if (!token) return null;
  const filas = await q(
    `SELECT s.id, s.numero, s.nombre, s.email, s.modalidad, s.zona, s.vehiculo, s.anio_vehiculo,
            s.junta, TO_CHAR(s.alta,'YYYY-MM-DD') AS alta
       FROM cavallino.sesiones ses
       JOIN cavallino.socios s ON s.id = ses.socio_id
      WHERE ses.token = $1 AND ses.expira > NOW() AND s.activo = TRUE`,
    [token]
  );
  return filas[0] || null;
}

export async function login(q, cuerpo, seguro) {
  const numero = String(cuerpo?.numero || '').trim();
  const password = String(cuerpo?.password || '');

  if (!/^\d{1,6}$/.test(numero) || password.length < 6) {
    return { code: 400, datos: { error: 'Revisa el número de socio y la contraseña.' } };
  }

  const filas = await q(
    `SELECT id, numero, nombre, password_hash, activo, intentos, bloqueado_hasta
       FROM cavallino.socios WHERE numero = $1`,
    [numero.padStart(4, '0')]
  );
  const socio = filas[0];
  const generico = { error: 'Número de socio o contraseña incorrectos.' };

  if (!socio || !socio.activo) {
    await verifyPassword(password, 'scrypt$00$' + '0'.repeat(128));
    return { code: 401, datos: generico };
  }

  if (socio.bloqueado_hasta && new Date(socio.bloqueado_hasta) > new Date()) {
    const restan = Math.ceil((new Date(socio.bloqueado_hasta) - Date.now()) / 60000);
    return { code: 429, datos: { error: `Demasiados intentos. Prueba de nuevo en ${restan} min.` } };
  }

  if (!(await verifyPassword(password, socio.password_hash))) {
    const intentos = socio.intentos + 1;
    if (intentos >= MAX_INTENTOS) {
      await q(
        `UPDATE cavallino.socios
            SET intentos = 0, bloqueado_hasta = NOW() + ($2 || ' minutes')::interval
          WHERE id = $1`,
        [socio.id, String(BLOQUEO_MINUTOS)]
      );
      return { code: 429, datos: { error: `Demasiados intentos. Cuenta bloqueada ${BLOQUEO_MINUTOS} min.` } };
    }
    await q('UPDATE cavallino.socios SET intentos = $2 WHERE id = $1', [socio.id, intentos]);
    return { code: 401, datos: generico };
  }

  await q('UPDATE cavallino.socios SET intentos = 0, bloqueado_hasta = NULL WHERE id = $1', [socio.id]);

  const token = nuevoToken();
  await q(
    `INSERT INTO cavallino.sesiones (token, socio_id, expira)
     VALUES ($1, $2, NOW() + ($3 || ' hours')::interval)`,
    [token, socio.id, String(SESION_HORAS)]
  );
  await q('DELETE FROM cavallino.sesiones WHERE expira < NOW()', []);

  return {
    code: 200,
    datos: { ok: true, nombre: socio.nombre, numero: socio.numero },
    cookie: cookieSesion(token, seguro)
  };
}

export async function logout(q, token) {
  if (token) await q('DELETE FROM cavallino.sesiones WHERE token = $1', [token]);
  return { code: 200, datos: { ok: true }, cookie: cookieBorrado() };
}

export async function panel(q, token) {
  const socio = await socioDeToken(q, token);
  if (!socio) return { code: 401, datos: { error: 'Sesión no válida.' } };

  const [inscripciones, proximos, directorio, totales] = await Promise.all([
    q(`SELECT e.id, e.titulo, TO_CHAR(e.fecha,'YYYY-MM-DD') AS fecha, e.lugar, e.tipo
         FROM cavallino.inscripciones i
         JOIN cavallino.eventos e ON e.id = i.evento_id
        WHERE i.socio_id = $1
        ORDER BY e.fecha`, [socio.id]),
    q(`SELECT e.id, e.titulo, e.descripcion, TO_CHAR(e.fecha,'YYYY-MM-DD') AS fecha, e.lugar, e.plazas, e.tipo,
              (SELECT COUNT(*) FROM cavallino.inscripciones x WHERE x.evento_id = e.id) AS ocupadas,
              EXISTS (SELECT 1 FROM cavallino.inscripciones y
                       WHERE y.evento_id = e.id AND y.socio_id = $1) AS inscrito
         FROM cavallino.eventos e
        WHERE e.fecha >= CURRENT_DATE
        ORDER BY e.fecha`, [socio.id]),
    q(`SELECT numero, nombre, zona, modalidad, vehiculo
         FROM cavallino.socios
        WHERE activo = TRUE
        ORDER BY zona NULLS LAST, numero`, []),
    q(`SELECT COUNT(*)::int AS socios FROM cavallino.socios WHERE activo = TRUE`, [])
  ]);

  return {
    code: 200,
    datos: { socio, inscripciones, proximos, directorio, totalSocios: totales[0]?.socios ?? 0 }
  };
}

export async function inscribir(q, token, cuerpo) {
  const socio = await socioDeToken(q, token);
  if (!socio) return { code: 401, datos: { error: 'Sesión no válida.' } };

  const eventoId = idEvento(cuerpo?.evento);
  if (eventoId === null) return { code: 400, datos: { error: 'Evento no válido.' } };

  const ev = (await q(
    `SELECT e.id, e.plazas,
            (SELECT COUNT(*) FROM cavallino.inscripciones x WHERE x.evento_id = e.id)::int AS ocupadas
       FROM cavallino.eventos e
      WHERE e.id = $1 AND e.fecha >= CURRENT_DATE`,
    [eventoId]
  ))[0];

  if (!ev) return { code: 404, datos: { error: 'Convocatoria no disponible.' } };
  if (ev.ocupadas >= ev.plazas) return { code: 409, datos: { error: 'No quedan plazas.' } };

  const insertado = await q(
    `INSERT INTO cavallino.inscripciones (socio_id, evento_id)
     VALUES ($1, $2)
     ON CONFLICT (socio_id, evento_id) DO NOTHING
     RETURNING id`,
    [socio.id, eventoId]
  );

  if (!insertado.length) return { code: 409, datos: { error: 'Ya estabas inscrito.' } };
  return { code: 200, datos: { ok: true } };
}

export async function anular(q, token, cuerpo) {
  const socio = await socioDeToken(q, token);
  if (!socio) return { code: 401, datos: { error: 'Sesión no válida.' } };

  const eventoId = idEvento(cuerpo?.evento);
  if (eventoId === null) return { code: 400, datos: { error: 'Evento no válido.' } };

  await q('DELETE FROM cavallino.inscripciones WHERE socio_id = $1 AND evento_id = $2',
    [socio.id, eventoId]);
  return { code: 200, datos: { ok: true } };
}

/* ═══════════ MI CUENTA ═══════════ */

export async function cambiarPassword(q, token, cuerpo, hashFn) {
  const socio = await socioDeToken(q, token);
  if (!socio) return { code: 401, datos: { error: 'Sesión no válida.' } };

  const actual = String(cuerpo?.actual || '');
  const nueva = String(cuerpo?.nueva || '');

  if (nueva.length < 8) {
    return { code: 400, datos: { error: 'La nueva contraseña debe tener 8 caracteres o más.' } };
  }
  if (nueva === actual) {
    return { code: 400, datos: { error: 'La nueva contraseña debe ser distinta de la actual.' } };
  }

  const fila = (await q('SELECT password_hash FROM cavallino.socios WHERE id = $1', [socio.id]))[0];
  if (!fila || !(await verifyPassword(actual, fila.password_hash))) {
    return { code: 403, datos: { error: 'La contraseña actual no es correcta.' } };
  }

  await q('UPDATE cavallino.socios SET password_hash = $2 WHERE id = $1', [socio.id, await hashFn(nueva)]);

  // Cierra el resto de sesiones: si alguien había entrado con la antigua, queda fuera
  const cerradas = await q(
    'DELETE FROM cavallino.sesiones WHERE socio_id = $1 AND token <> $2 RETURNING token',
    [socio.id, token]
  );

  return { code: 200, datos: { ok: true, sesionesCerradas: cerradas.length } };
}

export async function editarPerfil(q, token, cuerpo) {
  const socio = await socioDeToken(q, token);
  if (!socio) return { code: 401, datos: { error: 'Sesión no válida.' } };

  const email = String(cuerpo?.email || '').trim().toLowerCase().slice(0, 160);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { code: 400, datos: { error: 'Correo no válido.' } };
  }

  const ocupado = await q(
    'SELECT id FROM cavallino.socios WHERE LOWER(email) = $1 AND id <> $2',
    [email, socio.id]
  );
  if (ocupado.length) return { code: 409, datos: { error: 'Ese correo ya lo usa otro socio.' } };

  const anio = Number.parseInt(cuerpo?.anio, 10);
  await q(
    `UPDATE cavallino.socios
        SET email = $2, zona = $3, vehiculo = $4, anio_vehiculo = $5
      WHERE id = $1`,
    [
      socio.id, email,
      String(cuerpo?.zona || '').trim().slice(0, 80) || null,
      String(cuerpo?.vehiculo || '').trim().slice(0, 160) || null,
      Number.isInteger(anio) && anio > 1900 && anio < 2100 ? anio : null
    ]
  );
  // La modalidad y el número no se tocan: eso lo decide la junta
  return { code: 200, datos: { ok: true } };
}

/* ═══════════ PANEL DE JUNTA ═══════════
   Todas estas funciones exigen sesión válida Y rol de junta.
   Un socio normal recibe 403 aunque su sesión sea correcta. */

async function juntaDeToken(q, token) {
  const socio = await socioDeToken(q, token);
  if (!socio) return { error: { code: 401, datos: { error: 'Sesión no válida.' } } };
  if (!socio.junta) return { error: { code: 403, datos: { error: 'Acceso reservado a la junta.' } } };
  return { socio };
}

export async function juntaResumen(q, token) {
  const { socio, error } = await juntaDeToken(q, token);
  if (error) return error;

  const [solicitudes, eventos, socios, totales] = await Promise.all([
    q(`SELECT id, nombre, email, telefono, modalidad, vehiculo, anio, mensaje, estado,
              TO_CHAR(creada,'YYYY-MM-DD') AS creada,
              TO_CHAR(resuelta,'YYYY-MM-DD') AS resuelta
         FROM cavallino.solicitudes
        ORDER BY (estado = 'pendiente') DESC, creada DESC
        LIMIT 60`, []),
    q(`SELECT e.id, e.titulo, TO_CHAR(e.fecha,'YYYY-MM-DD') AS fecha, e.lugar, e.plazas, e.tipo,
              (SELECT COUNT(*) FROM cavallino.inscripciones x WHERE x.evento_id = e.id)::int AS ocupadas
         FROM cavallino.eventos e
        ORDER BY e.fecha DESC`, []),
    q(`SELECT numero, nombre, modalidad, zona, activo, junta
         FROM cavallino.socios ORDER BY numero`, []),
    q(`SELECT
         (SELECT COUNT(*) FROM cavallino.solicitudes WHERE estado = 'pendiente')::int AS pendientes,
         (SELECT COUNT(*) FROM cavallino.socios WHERE activo)::int AS socios,
         (SELECT COUNT(*) FROM cavallino.eventos WHERE fecha >= CURRENT_DATE)::int AS proximos,
         (SELECT COUNT(*) FROM cavallino.inscripciones)::int AS inscripciones`, [])
  ]);

  return { code: 200, datos: { yo: socio, solicitudes, eventos, socios, totales: totales[0] } };
}

export async function juntaResolver(q, token, cuerpo) {
  const { socio, error } = await juntaDeToken(q, token);
  if (error) return error;

  const id = idEvento(cuerpo?.id);
  const accion = String(cuerpo?.accion || '');
  if (id === null) return { code: 400, datos: { error: 'Solicitud no válida.' } };
  if (accion !== 'aprobada' && accion !== 'rechazada') {
    return { code: 400, datos: { error: 'Acción no válida.' } };
  }

  const sol = (await q(
    "SELECT id, nombre, email, modalidad, vehiculo, anio, estado FROM cavallino.solicitudes WHERE id = $1",
    [id]
  ))[0];
  if (!sol) return { code: 404, datos: { error: 'Solicitud no encontrada.' } };
  if (sol.estado !== 'pendiente') {
    return { code: 409, datos: { error: 'Esa solicitud ya estaba resuelta.' } };
  }

  await q(
    `UPDATE cavallino.solicitudes
        SET estado = $2, resuelta = NOW(), resuelta_por = $3, nota = $4
      WHERE id = $1`,
    [id, accion, socio.id, String(cuerpo?.nota || '').trim().slice(0, 500) || null]
  );

  // Aprobar no da de alta automáticamente: la junta asigna número y contraseña aparte
  return { code: 200, datos: { ok: true, estado: accion, candidato: sol.nombre } };
}

export async function juntaAltaSocio(q, token, cuerpo, hashFn) {
  const { error } = await juntaDeToken(q, token);
  if (error) return error;

  const numero = String(cuerpo?.numero || '').trim();
  const nombre = String(cuerpo?.nombre || '').trim().slice(0, 160);
  const email = String(cuerpo?.email || '').trim().toLowerCase().slice(0, 160);
  const password = String(cuerpo?.password || '');
  const modalidad = sinTildes(cuerpo?.modalidad);

  if (!/^\d{1,6}$/.test(numero)) return { code: 400, datos: { error: 'El número de socio son solo dígitos.' } };
  if (!nombre) return { code: 400, datos: { error: 'El nombre es obligatorio.' } };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { code: 400, datos: { error: 'Correo no válido.' } };
  if (password.length < 8) return { code: 400, datos: { error: 'La contraseña debe tener 8 caracteres o más.' } };
  if (!['Asociado', 'Titular', 'Clasicos'].includes(modalidad)) {
    return { code: 400, datos: { error: 'Modalidad no válida.' } };
  }

  const num = numero.padStart(4, '0');
  const choque = await q(
    'SELECT numero, email FROM cavallino.socios WHERE numero = $1 OR LOWER(email) = $2',
    [num, email]
  );
  if (choque.length) {
    return { code: 409, datos: { error: 'Ya existe un socio con ese número o correo.' } };
  }

  const hash = await hashFn(password);
  await q(
    `INSERT INTO cavallino.socios (numero, nombre, email, password_hash, modalidad, zona, vehiculo, anio_vehiculo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      num, nombre, email, hash, modalidad,
      String(cuerpo?.zona || '').trim().slice(0, 80) || null,
      String(cuerpo?.vehiculo || '').trim().slice(0, 160) || null,
      Number.isInteger(Number.parseInt(cuerpo?.anio, 10)) ? Number.parseInt(cuerpo.anio, 10) : null
    ]
  );
  return { code: 200, datos: { ok: true, numero: num, nombre } };
}

export async function juntaCrearEvento(q, token, cuerpo) {
  const { error } = await juntaDeToken(q, token);
  if (error) return error;

  const titulo = String(cuerpo?.titulo || '').trim().slice(0, 160);
  const fecha = String(cuerpo?.fecha || '').trim();
  const plazas = Number.parseInt(cuerpo?.plazas, 10);

  if (!titulo) return { code: 400, datos: { error: 'El título es obligatorio.' } };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return { code: 400, datos: { error: 'La fecha debe ser AAAA-MM-DD.' } };
  if (!Number.isInteger(plazas) || plazas < 1 || plazas > 999) {
    return { code: 400, datos: { error: 'Las plazas deben ser un número entre 1 y 999.' } };
  }
  const tipo = String(cuerpo?.tipo || 'ruta').trim().slice(0, 30);

  const creado = await q(
    `INSERT INTO cavallino.eventos (titulo, descripcion, fecha, lugar, plazas, tipo)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [
      titulo,
      String(cuerpo?.descripcion || '').trim().slice(0, 1000) || null,
      fecha,
      String(cuerpo?.lugar || '').trim().slice(0, 120) || null,
      plazas, tipo
    ]
  );
  return { code: 200, datos: { ok: true, id: creado[0].id } };
}

export async function juntaInscritos(q, token, eventoId) {
  const { error } = await juntaDeToken(q, token);
  if (error) return error;

  const id = idEvento(eventoId);
  if (id === null) return { code: 400, datos: { error: 'Evento no válido.' } };

  const filas = await q(
    `SELECT s.numero, s.nombre, s.zona, s.vehiculo, TO_CHAR(i.creada,'YYYY-MM-DD') AS desde
       FROM cavallino.inscripciones i
       JOIN cavallino.socios s ON s.id = i.socio_id
      WHERE i.evento_id = $1
      ORDER BY i.creada`,
    [id]
  );
  return { code: 200, datos: { inscritos: filas } };
}

export async function solicitud(q, cuerpo) {
  const nombre = String(cuerpo?.nombre || '').trim().slice(0, 160);
  const email = String(cuerpo?.email || '').trim().slice(0, 160);
  if (!nombre || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { code: 400, datos: { error: 'Nombre y correo son obligatorios.' } };
  }
  const anio = Number.parseInt(cuerpo?.anio, 10);

  await q(
    `INSERT INTO cavallino.solicitudes (nombre, email, telefono, modalidad, vehiculo, anio, mensaje)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      nombre, email,
      String(cuerpo?.telefono || '').trim().slice(0, 40) || null,
      sinTildes(cuerpo?.modalidad).slice(0, 40) || null,
      String(cuerpo?.vehiculo || '').trim().slice(0, 160) || null,
      Number.isInteger(anio) && anio > 1900 && anio < 2100 ? anio : null,
      String(cuerpo?.mensaje || '').trim().slice(0, 4000) || null
    ]
  );
  return { code: 200, datos: { ok: true } };
}
