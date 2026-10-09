import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Guiones from '@/components/Guiones';
import { seccion, articulo, articulosDe, rutaArticulo, todasLasRutas } from '@/lib/mundo';
import { SITE_URL, CLUB } from '@/lib/sitio';

export const dynamicParams = false;

export function generateStaticParams() {
  return todasLasRutas();
}

const extracto = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);

export async function generateMetadata({ params }: PageProps<'/mundo-ferrari/[seccion]/[slug]'>): Promise<Metadata> {
  const { seccion: clave, slug } = await params;
  const a = articulo(clave, slug);
  if (!a) return {};
  return {
    title: `${a.titulo} — Mundo Ferrari · Ferrari Club España`,
    description: extracto(a.cuerpo),
    alternates: { canonical: rutaArticulo(a) },
    openGraph: { type: 'article', title: a.titulo, url: rutaArticulo(a), images: a.portada ? [{ url: a.portada.src }] : undefined },
  };
}

export default async function ArticuloMundoPage({ params }: PageProps<'/mundo-ferrari/[seccion]/[slug]'>) {
  const { seccion: clave, slug } = await params;
  const s = seccion(clave);
  const a = articulo(clave, slug);
  if (!s || !a) notFound();

  const lista = articulosDe(clave);
  const i = lista.findIndex((x) => x.slug === slug);
  const anterior = lista[i - 1];
  const siguiente = lista[i + 1];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.titulo,
    description: extracto(a.cuerpo),
    image: a.portada ? [new URL(a.portada.src, SITE_URL).href] : undefined,
    author: { '@type': 'Organization', name: CLUB.nombre },
    publisher: { '@id': `${SITE_URL}/#club` },
    mainEntityOfPage: `${SITE_URL}${rutaArticulo(a)}`,
    inLanguage: 'es-ES',
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-hero nota-cab">
        <div className="cnt nota-ancho">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Mundo Ferrari', href: '/mundo-ferrari/' }, { label: s.titulo, href: `/mundo-ferrari/${s.clave}/` }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>{(a.grupo || s.titulo).toUpperCase()}</p>
          <h1 className="nota-titulo"><Guiones>{a.titulo}</Guiones></h1>
          <p className="nota-firma">Archivo del Ferrari Club España</p>
        </div>
      </header>

      <div className="cnt nota-ancho">
        <div className="nota-cuerpo mf-cuerpo" dangerouslySetInnerHTML={{ __html: a.cuerpo }} />

        <nav className="nota-nav" aria-label="Otros artículos">
          {anterior ? (
            <Link href={rutaArticulo(anterior)} className="nota-nav-a"><span>← ANTERIOR</span>{anterior.titulo}</Link>
          ) : <span />}
          {siguiente ? (
            <Link href={rutaArticulo(siguiente)} className="nota-nav-a sig"><span>SIGUIENTE →</span>{siguiente.titulo}</Link>
          ) : <span />}
        </nav>
        <p style={{ textAlign: 'center', margin: '0 0 6rem' }}>
          <Link href={`/mundo-ferrari/${s.clave}/`} className="btn btn-o">{s.titulo.toUpperCase()}</Link>
        </p>
      </div>
    </article>
  );
}
