// Migración incremental: añade el rol de junta y la trazabilidad de solicitudes
// sin destruir los datos existentes. Es idempotente: se puede ejecutar varias veces.
import { pool, q } from './conexion.mjs';

await q('ALTER TABLE cavallino.socios ADD COLUMN IF NOT EXISTS junta BOOLEAN NOT NULL DEFAULT FALSE', []);
await q('ALTER TABLE cavallino.solicitudes ADD COLUMN IF NOT EXISTS resuelta TIMESTAMPTZ', []);
await q('ALTER TABLE cavallino.solicitudes ADD COLUMN IF NOT EXISTS resuelta_por INTEGER REFERENCES cavallino.socios(id) ON DELETE SET NULL', []);
await q('ALTER TABLE cavallino.solicitudes ADD COLUMN IF NOT EXISTS nota TEXT', []);
await q('CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON cavallino.solicitudes(estado, creada DESC)', []);

// El CHECK de estado solo se añade si no existía ya
const tieneCheck = await q(
  `SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_schema='cavallino' AND table_name='solicitudes'
      AND constraint_name='solicitudes_estado_check'`, []);
if (!tieneCheck.length) {
  await q("UPDATE cavallino.solicitudes SET estado='pendiente' WHERE estado NOT IN ('pendiente','aprobada','rechazada')", []);
  await q(`ALTER TABLE cavallino.solicitudes
             ADD CONSTRAINT solicitudes_estado_check
             CHECK (estado IN ('pendiente','aprobada','rechazada'))`, []);
  console.log('CHECK de estado añadido.');
}

const r = await q("UPDATE cavallino.socios SET junta = TRUE WHERE numero = '0147' RETURNING numero, nombre", []);
console.log('Junta asignada a:', r.map(x => x.numero + ' ' + x.nombre).join(', ') || '(ninguno)');

const cols = await q(
  `SELECT column_name FROM information_schema.columns
    WHERE table_schema='cavallino' AND table_name='solicitudes' ORDER BY ordinal_position`, []);
console.log('Columnas de solicitudes:', cols.map(c => c.column_name).join(', '));

await pool.end();
