import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "@/components/SiteChrome";
import { SITE_URL, CLUB } from "@/lib/sitio";
import "./globals.css";
import "../../brand/tokens.css";
import "./editorial.css";

const gala = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-gala",
});

const circuito = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-circuito",
  // El titular del hero (el LCP) va en Bodoni: Archivo no debe competir con
  // ella por la red en la primera carga.
  preload: false,
});

const DESCRIPCION =
  "Club Oficial de Propietarios de Ferrari en España desde 1988, reconocido por Ferrari S.p.A. desde 2006. Más de 200 socios, rutas, tandas en circuito, Fórmula 1 y viajes a Maranello.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ferrari Club España — Club Oficial desde 1988",
  description: DESCRIPCION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ferrari Club España — Club Oficial",
    description: DESCRIPCION,
    url: "/",
    siteName: "Ferrari Club España",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Socios del Ferrari Club España en una salida del club" }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferrari Club España — Club Oficial",
    description: DESCRIPCION,
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/brand/logo-icono-app.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#B81D13",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "@id": `${SITE_URL}/#club`,
  name: CLUB.nombre,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-principal.svg`,
  image: `${SITE_URL}/og.jpg`,
  description: DESCRIPCION,
  foundingDate: String(CLUB.fundacion),
  taxID: CLUB.cif,
  address: {
    "@type": "PostalAddress",
    streetAddress: CLUB.direccion,
    addressLocality: CLUB.ciudad,
    postalCode: CLUB.cp,
    addressCountry: "ES",
  },
  telephone: CLUB.telefonoE164,
  email: CLUB.email,
  sameAs: [
    "https://www.ferrari.com/es-ES/auto/owners-club-espana",
    "https://www.facebook.com/ferrariclubespana",
    "https://www.instagram.com/ferrariclubespana",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${gala.variable} ${circuito.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
