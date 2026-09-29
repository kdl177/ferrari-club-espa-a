import { conQuery } from './datos.mjs';
import { leerCookie } from './auth.mjs';

const CABECERAS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};

export function respuesta({ code, datos, cookie }) {
  const cabeceras = { ...CABECERAS };
  if (cookie) cabeceras['Set-Cookie'] = cookie;
  return new Response(JSON.stringify(datos), { status: code, headers: cabeceras });
}

export function tokenDe(request) {
  return leerCookie(request.headers.get('cookie'), 'cav_sesion');
}

export async function cuerpoDe(request) {
  try {
    const texto = await request.text();
    if (!texto) return {};
    if (texto.length > 16384) return null;
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

// Envuelve un handler: abre conexión, captura errores y serializa la respuesta.
export function handler(fn) {
  return async function (request) {
    try {
      const salida = await conQuery(q => fn(q, request));
      return respuesta(salida);
    } catch (err) {
      console.error('[api]', err.message);
      return respuesta({ code: 500, datos: { error: 'Error del servidor.' } });
    }
  };
}
