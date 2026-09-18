import type { Metadata, Viewport } from "next";
import Script from "next/script";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";
import "./editorial.css";

export const metadata: Metadata = {
  title: "Ferrari Club España — Club Oficial desde 1988",
  description:
    "Club Oficial de Propietarios y Apasionados de Ferrari en España. Más de 200 socios, track days, rutas, F1 y eventos exclusivos desde 1988.",
  metadataBase: new URL("https://club-ferrari-espana.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ferrari Club España — Club Oficial",
    description:
      "Club Oficial de Propietarios y Apasionados de Ferrari en España. Más de 200 socios, track days, rutas, F1 y eventos exclusivos desde 1988.",
    url: "/",
    siteName: "Ferrari Club España",
    images: [{ url: "/og.svg", width: 1200, height: 630 }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferrari Club España — Club Oficial",
    description: "Club Oficial de Propietarios y Apasionados de Ferrari en España desde 1988.",
    images: ["/og.svg"],
  },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23DA291C'/%3E%3Ctext x='16' y='24' font-family='sans-serif' font-weight='700' font-size='20' fill='%23F2F0EB' text-anchor='middle'%3EF%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#DA291C",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ferrari Club España",
  url: "https://club-ferrari-espana.vercel.app",
  logo: "https://club-ferrari-espana.vercel.app/og.svg",
  description:
    "Club Oficial de Propietarios y Apasionados de Ferrari en España desde 1988. El único club oficial avalado por Ferrari S.p.A.",
  foundingDate: "1988",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Constancia 41, Entreplanta",
    addressLocality: "Madrid",
    postalCode: "28002",
    addressCountry: "ES",
  },
  telephone: "+34915754160",
  email: "ferrari@ferrariclubespana.com",
  sameAs: [
    "https://www.facebook.com/ferrariclubespana",
    "https://www.instagram.com/ferrariclubespana",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
