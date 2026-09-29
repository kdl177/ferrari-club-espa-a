// Servidor de desarrollo local.
// Enruta a las MISMAS funciones que Vercel ejecuta en producción, así que lo que
// se prueba aquí es exactamente el código que se despliega.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { POST as login } from './api/login.mjs';
import { POST as logout } from './api/logout.mjs';
import { GET as panel } from './api/panel.mjs';
import { POST as inscribir } from './api/inscribir.mjs';
import { POST as anular } from './api/anular.mjs';
import { POST as solicitud } from './api/solicitud.mjs';
import { GET as juntaGet, POST as juntaPost } from './api/junta.mjs';
import { POST as cuenta } from './api/cuenta.mjs';

const RAIZ = fileURLToPath(new URL('./public/', import.meta.url));
const PUERTO = process.env.PORT || 3210;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8'
};

const RUTAS = {
  'POST /api/login': login,
  'POST /api/logout': logout,
  'GET /api/panel': panel,
  'POST /api/inscribir': inscribir,
  'POST /api/anular': anular,
  'POST /api/solicitud': solicitud,
  'GET /api/junta': juntaGet,
  'POST /api/junta': juntaPost,
  'POST /api/cuenta': cuenta
};

// Convierte la petición de Node en Request web, y la Response web en respuesta de Node
async function comoRequest(req, url) {
  const cabeceras = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === 'string') cabeceras.set(k, v);
  }
  let cuerpo;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const trozos = [];
    for await (const t of req) trozos.push(t);
    cuerpo = Buffer.concat(trozos);
  }
  return new Request(url.href, { method: req.method, headers: cabeceras, body: cuerpo });
}

async function volcar(respuesta, res) {
  const cabeceras = {};
  respuesta.headers.forEach((v, k) => { cabeceras[k] = v; });
  res.writeHead(respuesta.status, cabeceras);
  res.end(Buffer.from(await respuesta.arrayBuffer()));
}

async function estatico(req, res, ruta) {
  const limpia = normalize(ruta).replace(/^(\.\.[/\\])+/, '');
  const destino = join(RAIZ, limpia === '/' || limpia === '\\' ? 'index.html' : limpia);
  if (!destino.startsWith(RAIZ)) {
    res.writeHead(403).end('Prohibido');
    return;
  }
  try {
    const datos = await readFile(destino);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(destino)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(datos);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1>');
  }
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname.startsWith('/api/')) {
    const fn = RUTAS[`${req.method} ${url.pathname}`];
    if (!fn) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Endpoint no encontrado.' }));
      return;
    }
    try {
      await volcar(await fn(await comoRequest(req, url)), res);
    } catch (err) {
      console.error('[server]', err.message);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Error del servidor.' }));
      }
    }
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Método no permitido.' }));
    return;
  }
  await estatico(req, res, decodeURIComponent(url.pathname));
});

servidor.listen(PUERTO, () => {
  console.log(`Cavallino en http://localhost:${PUERTO}`);
});
