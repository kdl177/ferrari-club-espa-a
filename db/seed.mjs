import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool, q } from './conexion.mjs';
import { hashPassword } from '../api/_lib/auth.mjs';

const SOCIOS = [
  ['0147', 'Elena Vidal Sanz',      'elena.vidal@ejemplo.es',   'Titular',   'Madrid',    'Berlinetta V12', 1994],
  ['0032', 'Marc Puig Ferrer',      'marc.puig@ejemplo.es',     'Clasicos',  'Cataluña',  'Clásico coupé',  1972],
  ['0208', 'Rocío Alcaraz Linares', 'rocio.alcaraz@ejemplo.es', 'Titular',   'Andalucía', 'Spider',         2008],
  ['0311', 'Iker Zubiaurre Goñi',   'iker.zubiaurre@ejemplo.es','Asociado',  'País Vasco','Gran turismo',   2016],
  ['0095', 'Nuria Bellver Roig',    'nuria.bellver@ejemplo.es', 'Titular',   'Levante',   'Competición',    2019]
];

const EVENTOS = [
  ['Tanda de otoño — Circuito del Jarama', 'Jornada completa en tres grupos de nivel, con briefing técnico y análisis de telemetría al cierre.', '2026-09-12', 'Madrid', 24, 'circuito'],
  ['Ruta de los Puertos — Picos de Europa', 'Tres días de carretera de montaña entre Cantabria y Asturias, con vehículo de asistencia.', '2026-10-04', 'Cantabria · Asturias', 12, 'ruta'],
  ['Visita técnica a taller de restauración', 'Recorrido guiado por un taller especializado en mecánica clásica.', '2026-11-21', 'Barcelona', 8, 'visita'],
  ['Cena anual de socios', 'Cierre de temporada y presentación del calendario del año siguiente.', '2026-12-13', 'Madrid', 60, 'social']
];

async function main() {
  const sql = await readFile(fileURLToPath(new URL('./schema.sql', import.meta.url)), 'utf8');
  await pool.query(sql);
  console.log('Esquema creado.');

  for (const [numero, nombre, email, modalidad, zona, vehiculo, anio] of SOCIOS) {
    // Un hash por socio: cada uno con su propio salt
    const hash = await hashPassword('cavallino2026');
    await q(
      `INSERT INTO cavallino.socios (numero, nombre, email, password_hash, modalidad, zona, vehiculo, anio_vehiculo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [numero, nombre, email, hash, modalidad, zona, vehiculo, anio]
    );
  }
  console.log(`${SOCIOS.length} socios insertados.`);

  for (const [titulo, descripcion, fecha, lugar, plazas, tipo] of EVENTOS) {
    await q(
      `INSERT INTO cavallino.eventos (titulo, descripcion, fecha, lugar, plazas, tipo)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [titulo, descripcion, fecha, lugar, plazas, tipo]
    );
  }
  console.log(`${EVENTOS.length} eventos insertados.`);

  // La socia 0147 ya viene inscrita en dos convocatorias
  await q(
    `INSERT INTO cavallino.inscripciones (socio_id, evento_id)
     SELECT s.id, e.id FROM cavallino.socios s, cavallino.eventos e
      WHERE s.numero = '0147' AND e.titulo LIKE 'Tanda de otoño%'`, []);
  await q(
    `INSERT INTO cavallino.inscripciones (socio_id, evento_id)
     SELECT s.id, e.id FROM cavallino.socios s, cavallino.eventos e
      WHERE s.numero = '0147' AND e.titulo LIKE 'Cena anual%'`, []);

  // Visita a taller: sin plazas libres (8 de 8) para probar el estado "completo"
  await q(
    `INSERT INTO cavallino.inscripciones (socio_id, evento_id)
     SELECT s.id, e.id FROM cavallino.socios s, cavallino.eventos e
      WHERE s.numero <> '0147' AND e.titulo LIKE 'Visita técnica%'`, []);

  console.log('Inscripciones de ejemplo creadas.');

  // La socia 0147 pertenece a la junta (acceso al panel de gestión)
  await q("UPDATE cavallino.socios SET junta = TRUE WHERE numero = '0147'", []);

  // Dos solicitudes pendientes para poder probar el flujo de admisión
  await q(
    `INSERT INTO cavallino.solicitudes (nombre, email, telefono, modalidad, vehiculo, anio, mensaje)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    ['Teresa Oller Camps', 'teresa.oller@ejemplo.es', '600111222', 'Titular',
     'Coupé V8 de 2011', 2011, 'Llevo cuatro años saliendo con el grupo de Levante como invitada.']
  );
  await q(
    `INSERT INTO cavallino.solicitudes (nombre, email, telefono, modalidad, vehiculo, anio, mensaje)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    ['Gonzalo Sierra Peña', 'gonzalo.sierra@ejemplo.es', null, 'Clasicos',
     'Berlinetta de 1968', 1968, 'Restauración documentada; me avala el socio 0032.']
  );
  console.log('2 solicitudes pendientes de ejemplo.');

  console.log('\nAcceso de prueba:  socio 0147  ·  contraseña cavallino2026  (junta)');
  await pool.end();
}

main().catch(async err => {
  console.error('Error en seed:', err.message);
  await pool.end();
  process.exit(1);
});
