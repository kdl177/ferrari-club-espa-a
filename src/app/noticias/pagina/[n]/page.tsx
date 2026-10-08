import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import NoticiasLista from '@/components/NoticiasLista';
import { pagina, todasLasNoticias, POR_PAGINA } from '@/lib/noticias';

export const revalidate = 3600;

export async function generateStaticParams() {
  const total = Math.ceil((await todasLasNoticias()).length / POR_PAGINA);
  return Array.from({ length: total - 1 }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: PageProps<'/noticias/pagina/[n]'>): Promise<Metadata> {
  const { n } = await params;
  return {
    title: `Noticias, página ${n} — Ferrari Club España`,
    description: `Archivo de crónicas y noticias del Ferrari Club España, página ${n}.`,
    alternates: { canonical: `/noticias/pagina/${n}/` },
  };
}

export default async function NoticiasPaginaPage({ params }: PageProps<'/noticias/pagina/[n]'>) {
  const n = Number((await params).n);
  if (!Number.isInteger(n) || n < 1) notFound();
  if (n === 1) permanentRedirect('/noticias/');
  const { noticias, total } = await pagina(n);
  if (n > total) notFound();

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: '3rem' }}>
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Noticias', href: '/noticias/' }, { label: `Página ${n}` }]} />
          <h1 className="sec-title" style={{ marginTop: '1.5rem' }}>Noticias<br /><span style={{ color: 'var(--red)' }}>página {n}</span></h1>
        </div>
      </section>
      <section style={{ background: 'var(--b90)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <NoticiasLista noticias={noticias} pagina={n} total={total} />
        </div>
      </section>
    </>
  );
}
