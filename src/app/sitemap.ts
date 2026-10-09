import type { MetadataRoute } from 'next';

const BASE = 'https://club-ferrari-espana.vercel.app';

// Sin barra final: con trailingSlash desactivado, /club/ redirige a /club y
// el sitemap debe dar la URL que responde 200.
const RUTAS: Array<[string, MetadataRoute.Sitemap[number]['changeFrequency'], number]> = [
  ['', 'weekly', 1],
  ['/club', 'monthly', 0.8],
  ['/club/hazte-socio', 'monthly', 0.9],
  ['/eventos', 'weekly', 0.9],
  ['/noticias', 'daily', 0.7],
  ['/concesionarios', 'yearly', 0.5],
  ['/contacta', 'yearly', 0.6],
  ['/privacidad', 'yearly', 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS.map(([ruta, changeFrequency, priority]) => ({
    url: BASE + ruta,
    changeFrequency,
    priority,
  }));
}
