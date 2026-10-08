import archivo from '@/content/noticias-archivo.json';
import { prisma } from '@/lib/prisma';
import { deArchivo } from '@/lib/sitio';

export type Noticia = {
  slug: string;
  fecha: string;
  ruta: string;
  titulo: string;
  subtitulo: string;
  firma: string;
  categoria: string;
  portada: string | null;
  portadaAncho?: number;
  portadaAlto?: number;
  extracto: string;
  cuerpo: string;
};

export const POR_PAGINA = 12;

const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function rutaDe(fecha: string, slug: string) {
  const [y, m, d] = fecha.split('-');
  return `/noticias/${y}/${m}/${d}/${slug}/`;
}

const delArchivo: Noticia[] = archivo.map((n) => ({
  ...n,
  ruta: rutaDe(n.fecha, n.slug),
  cuerpo: n.cuerpo
    .replace(/<img src="([^"]+)"/g, (_, src) => `<img loading="lazy" decoding="async" src="${deArchivo(src)}"`)
    .replace(/href="https?:\/\/(www\.)?ferrariclubespana\.com\//g, 'href="/'),
}));

// Las que el club publica desde el panel de gestion. El cuerpo llega como
// texto plano: cada linea en blanco separa un parrafo.
async function delPanel(): Promise<Noticia[]> {
  try {
    const filas = await prisma.noticia.findMany({ where: { publicadoEn: { not: null } }, orderBy: { publicadoEn: 'desc' } });
    return filas.map((n) => {
      const fecha = n.publicadoEn!.toISOString().slice(0, 10);
      const parrafos = n.cuerpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      return {
        slug: n.slug,
        fecha,
        ruta: rutaDe(fecha, n.slug),
        titulo: n.titulo,
        subtitulo: '',
        firma: 'Redacción de Noticias (FCE)',
        categoria: n.categoria.charAt(0) + n.categoria.slice(1).toLowerCase(),
        portada: n.portada,
        extracto: n.cuerpo.replace(/\s+/g, ' ').slice(0, 220),
        cuerpo: parrafos.map((p) => `<p>${escapar(p).replace(/\n/g, '<br>')}</p>`).join('\n'),
      };
    });
  } catch (e) {
    console.error('No se pudieron leer las noticias del panel:', e);
    return [];
  }
}

export async function todasLasNoticias(): Promise<Noticia[]> {
  const panel = await delPanel();
  const rutas = new Set(panel.map((n) => n.ruta));
  return [...panel, ...delArchivo.filter((n) => !rutas.has(n.ruta))].sort((a, b) =>
    a.fecha === b.fecha ? 0 : a.fecha < b.fecha ? 1 : -1
  );
}

export async function pagina(n: number) {
  const todas = await todasLasNoticias();
  const total = Math.max(1, Math.ceil(todas.length / POR_PAGINA));
  return { noticias: todas.slice((n - 1) * POR_PAGINA, n * POR_PAGINA), total, cuantas: todas.length };
}

export async function buscar(y: string, m: string, d: string, slug: string) {
  const todas = await todasLasNoticias();
  const ruta = `/noticias/${y}/${m}/${d}/${slug}/`;
  const i = todas.findIndex((n) => n.ruta === ruta);
  if (i < 0) return null;
  return { noticia: todas[i], anterior: todas[i + 1] ?? null, siguiente: todas[i - 1] ?? null };
}

export function rutasDelArchivo() {
  return delArchivo.map((n) => {
    const [y, m, d] = n.fecha.split('-');
    return { y, m, d, slug: n.slug };
  });
}

export function fechaLarga(fecha: string) {
  return new Date(`${fecha}T12:00:00Z`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' });
}
