import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/sitio';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/socios/panel/', '/socios/admin/', '/api/', '/club/hazte-socio/bienvenido/', '/socios/revisa-tu-email/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
