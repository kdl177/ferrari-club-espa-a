import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Guiones from '@/components/Guiones';
import { buscar, fechaLarga, rutasDelArchivo } from '@/lib/noticias';
import { SITE_URL, CLUB } from '@/lib/sitio';

export const revalidate = 3600;

export function generateStaticParams() {
  return rutasDelArchivo();
}

export async function generateMetadata({ params }: PageProps<'/noticias/[y]/[m]/[d]/[slug]'>): Promise<Metadata> {
  const { y, m, d, slug } = await params;
  const r = await buscar(y, m, d, slug);
  if (!r) return {};
  const n = r.noticia;
  return {
    title: `${n.titulo} — Ferrari Club España`,
    description: n.extracto,
    alternates: { canonical: n.ruta },
    openGraph: {
      type: 'article',
      title: n.titulo,
      description: n.extracto,
      url: n.ruta,
      publishedTime: n.fecha,
      images: n.portada ? [{ url: n.portada }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: n.titulo, description: n.extracto, images: n.portada ? [n.portada] : undefined },
  };
}

function autor(firma: string) {
  const nombre = firma.split(/\s+-\s+|\s+·\s+/)[0].trim();
  return nombre && !/^redacci/i.test(nombre) ? { '@type': 'Person', name: nombre } : { '@type': 'Organization', name: CLUB.nombre };
}

export default async function NoticiaPage({ params }: PageProps<'/noticias/[y]/[m]/[d]/[slug]'>) {
  const { y, m, d, slug } = await params;
  const r = await buscar(y, m, d, slug);
  if (!r) notFound();
  const { noticia: n, anterior, siguiente } = r;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: n.titulo,
      description: n.extracto,
      datePublished: `${n.fecha}T12:00:00+02:00`,
      image: n.portada ? [new URL(n.portada, SITE_URL).href] : undefined,
      author: autor(n.firma),
      publisher: { '@id': `${SITE_URL}/#club` },
      mainEntityOfPage: `${SITE_URL}${n.ruta}`,
      inLanguage: 'es-ES',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Noticias', item: `${SITE_URL}/noticias/` },
        { '@type': 'ListItem', position: 3, name: n.titulo },
      ],
    },
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-hero nota-cab">
        <div className="cnt nota-ancho">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Noticias', href: '/noticias/' }, { label: n.categoria }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>{n.categoria.toUpperCase()} · <time dateTime={n.fecha}>{fechaLarga(n.fecha).toUpperCase()}</time></p>
          <h1 className="nota-titulo"><Guiones>{n.titulo}</Guiones></h1>
          {n.subtitulo && <p className="nota-sub">{n.subtitulo}</p>}
          {n.firma && <p className="nota-firma">{n.firma}</p>}
        </div>
      </header>

      {n.portada && (
        <div className="nota-portada">
          <Image src={n.portada} alt={n.titulo} width={n.portadaAncho ?? 960} height={n.portadaAlto ?? 540} sizes="(max-width: 1000px) 100vw, 960px" quality={75} priority unoptimized={!n.portada.startsWith('/')} />
        </div>
      )}

      <div className="cnt nota-ancho">
        <div className="nota-cuerpo" dangerouslySetInnerHTML={{ __html: n.cuerpo }} />

        <nav className="nota-nav" aria-label="Otras noticias">
          {anterior ? (
            <Link href={anterior.ruta} className="nota-nav-a"><span>← ANTERIOR</span>{anterior.titulo}</Link>
          ) : <span />}
          {siguiente ? (
            <Link href={siguiente.ruta} className="nota-nav-a sig"><span>SIGUIENTE →</span>{siguiente.titulo}</Link>
          ) : <span />}
        </nav>
        <p style={{ textAlign: 'center', margin: '0 0 6rem' }}>
          <Link href="/noticias/" className="btn btn-o">TODAS LAS NOTICIAS</Link>
        </p>
      </div>
    </article>
  );
}
