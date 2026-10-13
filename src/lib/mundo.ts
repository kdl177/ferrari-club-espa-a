import mundo from '@/content/mundo-ferrari.json';

export type ArticuloMundo = (typeof mundo.articulos)[number];

export const SECCIONES = mundo.secciones;

// Partes del archivo historico del club que aun no se han traido a esta web.
export const EN_WWW2 = [
  { titulo: 'Eventos Internacionales', d: 'Ferrari en eventos y citas internacionales.', url: 'https://www2.ferrariclubespana.com/album.html' },
];

export function seccion(clave: string) {
  return SECCIONES.find((s) => s.clave === clave) ?? null;
}

export function articulo(clave: string, slug: string) {
  return mundo.articulos.find((a) => a.seccion === clave && a.slug === slug) ?? null;
}

export function articulosDe(clave: string) {
  return mundo.articulos.filter((a) => a.seccion === clave);
}

export const rutaArticulo = (a: { seccion: string; slug: string }) => `/mundo-ferrari/${a.seccion}/${a.slug}/`;

export function todasLasRutas() {
  return mundo.articulos.map((a) => ({ seccion: a.seccion, slug: a.slug }));
}
