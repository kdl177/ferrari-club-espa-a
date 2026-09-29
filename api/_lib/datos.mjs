// Capa de datos portable: node-postgres en local, driver de Neon en la nube.
// Ambos exponen pool.query(sql, params), así que las consultas no cambian.

const conexion = process.env.DATABASE_URL || 'postgresql://simbai:simbai2026@localhost:5432/simbai';
const esNube = /neon\.tech|vercel-storage|supabase|amazonaws|render\.com/.test(conexion);

let crearPool;

if (esNube) {
  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const ws = await import('ws').catch(() => null);
  // Node 21 y anteriores necesitan un WebSocket explícito
  if (ws && !globalThis.WebSocket) neonConfig.webSocketConstructor = ws.default;
  crearPool = () => new Pool({ connectionString: conexion });
} else {
  const pg = await import('pg');
  crearPool = () => new pg.default.Pool({
    connectionString: conexion,
    max: 10,
    idleTimeoutMillis: 30000
  });
}

// En serverless el pool se crea y se cierra por petición (lo exige Neon).
// En local se reutiliza uno solo durante toda la vida del proceso.
let poolLocal = null;

export async function conQuery(fn) {
  if (esNube) {
    const pool = crearPool();
    try {
      return await fn((sql, params = []) => pool.query(sql, params).then(r => r.rows));
    } finally {
      await pool.end().catch(() => {});
    }
  }
  if (!poolLocal) poolLocal = crearPool();
  return fn((sql, params = []) => poolLocal.query(sql, params).then(r => r.rows));
}

export { esNube };
