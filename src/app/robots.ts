import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/socios/panel', '/socios/admin', '/club/hazte-socio/bienvenido'],
    },
    sitemap: 'https://club-ferrari-espana.vercel.app/sitemap.xml',
  };
}
