// Conexión directa para scripts de línea de comandos (seed, mantenimiento).
// Las funciones de la API usan api/_lib/datos.mjs, que además soporta Neon.
import pg from 'pg';

const conexion = process.env.DATABASE_URL || 'postgresql://simbai:simbai2026@localhost:5432/simbai';
const esNube = /neon\.tech|vercel-storage|supabase|amazonaws|render\.com/.test(conexion);

export const pool = new pg.Pool({
  connectionString: conexion,
  ssl: esNube ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000
});

export async function q(sql, params = []) {
  const res = await pool.query(sql, params);
  return res.rows;
}
