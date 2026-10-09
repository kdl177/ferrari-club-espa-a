import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { SECCIONES, seccion, articulo, rutaArticulo } from '@/lib/mundo';

export const dynamicParams = false;

export function generateStaticParams() {
  return SECCIONES.map((s) => ({ seccion: s.clave }));
}

export async function generateMetadata({ params }: PageProps<'/mundo-ferrari/[seccion]'>): Promise<Metadata> {
  const s = seccion((await params).seccion);
  if (!s) return {};
  return {
    title: `${s.titulo} — Mundo Ferrari · Ferrari Club España`,
    description: (s.intro[0] ?? s.grupos.map((g) => g.titulo).join(', ')).slice(0, 160),
    alternates: { canonical: `/mundo-ferrari/${s.clave}/` },
  };
}

export default async function SeccionPage({ params }: PageProps<'/mundo-ferrari/[seccion]'>) {
  const s = seccion((await params).seccion);
  if (!s) notFound();

  return (
    <>
      <section className="page-hero">
        <div className="cnt nota-ancho">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Mundo Ferrari', href: '/mundo-ferrari/' }, { label: s.titulo }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>MUNDO FERRARI</p>
          <h1 className="nota-titulo">{s.titulo}</h1>
          {s.intro.map((p) => (
            <p key={p.slice(0, 40)} className="sec-sub" style={{ marginTop: '1.25rem' }}>{p}</p>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '4rem 0 6rem' }}>
        <div className="cnt">
          {s.grupos.map((g) => (
            <div key={g.titulo || 'todos'} className="hist-anio">
              {g.titulo && <h2 className="revista-anio-t">{g.titulo}</h2>}
              <div className="live-grid">
                {g.articulos.map((slug) => {
                  const a = articulo(s.clave, slug);
                  if (!a) return null;
                  return (
                    <Link key={slug} href={rutaArticulo(a)} className="live-nc">
                      <div className="live-nc-img">
                        {a.portada && <Image src={a.portada.src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" quality={60} />}
                      </div>
                      <div className="live-nc-body">
                        <h3 className="live-nc-title">{a.titulo}</h3>
                        <div className="live-nc-date"><span>{a.palabras} PALABRAS</span><span className="live-ext">LEER →</span></div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
