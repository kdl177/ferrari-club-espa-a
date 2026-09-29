// Devuelve la base al estado inicial sin recrear el esquema:
// borra sesiones, solicitudes y desbloquea cuentas. Útil tras ejecutar las pruebas.
import { pool, q } from './conexion.mjs';

const sesiones = await q('DELETE FROM cavallino.sesiones RETURNING token', []);
const solicitudes = await q("DELETE FROM cavallino.solicitudes WHERE email LIKE 'prueba%@ejemplo.es' OR email = 'a@b.es' OR nombre LIKE 'Candidato prueba%' RETURNING id", []);
await q('UPDATE cavallino.socios SET intentos = 0, bloqueado_hasta = NULL', []);

// Restos de las baterías: socios y convocatorias creados durante las pruebas
const sociosPrueba = await q(
  `DELETE FROM cavallino.socios
    WHERE numero NOT IN ('0032','0095','0147','0208','0311')
      AND (nombre LIKE 'Socio de prueba%' OR nombre LIKE 'Teresa Oller%'
           OR email LIKE 'cuenta%@ejemplo.es' OR email LIKE 'nuevo%@ejemplo.es'
           OR email LIKE 'teresa%@ejemplo.es')
    RETURNING numero`, []);
const eventosPrueba = await q("DELETE FROM cavallino.eventos WHERE titulo LIKE '%prueba autom%' RETURNING id", []);

// Deja solo las dos inscripciones de ejemplo de la socia 0147
await q(`DELETE FROM cavallino.inscripciones i
          USING cavallino.socios s, cavallino.eventos e
          WHERE i.socio_id = s.id AND i.evento_id = e.id
            AND s.numero = '0147'
            AND e.titulo NOT LIKE 'Tanda de otoño%'
            AND e.titulo NOT LIKE 'Cena anual%'`, []);

const insc = await q('SELECT COUNT(*)::int AS n FROM cavallino.inscripciones', []);

console.log(`Sesiones borradas: ${sesiones.length}`);
console.log(`Solicitudes de prueba borradas: ${solicitudes.length}`);
console.log(`Socios de prueba borrados: ${sociosPrueba.length}`);
console.log(`Convocatorias de prueba borradas: ${eventosPrueba.length}`);
console.log('Cuentas desbloqueadas.');
console.log(`Inscripciones restantes: ${insc[0].n}`);

await pool.end();
