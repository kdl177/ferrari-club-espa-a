import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/sitio';
import { todasLasNoticias, POR_PAGINA } from '@/lib/noticias';
import { SECCIONES, todasLasRutas } from '@/lib/mundo';

export const revalidate = 3600;

const FIJAS = [
  '/', '/noticias/', '/club/', '/club/hazte-socio/', '/eventos/', '/eventos/historial/', '/revista/', '/solicita-presupuesto/', '/concesionarios/', '/contacta/', '/socios/',
  '/aviso-legal/', '/privacidad/', '/cookies/', '/condiciones-de-venta/',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const noticias = await todasLasNoticias();
  const paginas = Math.ceil(noticias.length / POR_PAGINA);
  return [
    ...FIJAS.map((r) => ({ url: `${SITE_URL}${r}` })),
    ...Array.from({ length: paginas - 1 }, (_, i) => ({ url: `${SITE_URL}/noticias/pagina/${i + 2}/` })),
    ...noticias.map((n) => ({ url: `${SITE_URL}${n.ruta}`, lastModified: n.fecha })),
    { url: `${SITE_URL}/mundo-ferrari/` },
    ...SECCIONES.map((s) => ({ url: `${SITE_URL}/mundo-ferrari/${s.clave}/` })),
    ...todasLasRutas().map((r) => ({ url: `${SITE_URL}/mundo-ferrari/${r.seccion}/${r.slug}/` })),
  ];
}
