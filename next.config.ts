import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.openstreetmap.org https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const seguridad = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

// URLs de la web anterior (ferrariclubespana.com) que siguen indexadas. Las
// noticias y su paginacion conservan la misma ruta y no necesitan redireccion.
const antiguas: Array<[string, string]> = [
  ["/club/nuestro-club/", "/club/"],
  ["/socios/acceso-socios/", "/socios/"],
  ["/zona-de-usuarios/", "/socios/"],
  ["/recupera-tu-contrasena/", "/socios/"],
  ["/ser-miembro/", "/club/hazte-socio/"],
  ["/aviso-legal-y-proteccion-de-datos/", "/aviso-legal/"],
  ["/politica-de-cookies/", "/cookies/"],
  ["/numeros-atrasados/", "/revista/"],
  ["/cesta-de-la-compra/", "/eventos/"],
  ["/cesta-compra/", "/eventos/"],
  ["/tienda/:ruta*", "/eventos/"],
  ["/calendario/:ruta*", "/eventos/"],
  ["/concesionarios/:ficha/", "/concesionarios/"],
];

const nextConfig: NextConfig = {
  agentRules: false,
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  async headers() {
    return [{ source: "/:path*", headers: seguridad }];
  },
  async redirects() {
    return antiguas.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
