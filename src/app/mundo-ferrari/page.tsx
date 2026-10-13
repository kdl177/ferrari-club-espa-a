import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { SECCIONES, EN_WWW2, articulosDe } from '@/lib/mundo';

export const metadata: Metadata = {
  title: 'Mundo Ferrari — Ferrari Club España',
  description: 'El archivo del Ferrari Club España: historia de Ferrari, todos los modelos desde 1940, la guía de Maranello y la fábrica, arte y modelismo.',
  alternates: { canonical: '/mundo-ferrari/' },
};

export default function MundoFerrariPage() {
  return (
    <>
      <section className="page-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Mundo Ferrari' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>ARCHIVO DEL CLUB</p>
          <h1 className="sec-title" style={{ marginTop: '.75rem' }}>Mundo<br /><span style={{ color: 'var(--red)' }}>Ferrari</span></h1>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '4rem 0 6rem' }}>
        <div className="cnt">
          <div className="mf-secciones">
            {SECCIONES.map((s) => {
              const arts = articulosDe(s.clave);
              const portada = arts.find((a) => a.portada)?.portada;
              return (
                <Link key={s.clave} href={`/mundo-ferrari/${s.clave}/`} className="live-nc">
                  <div className="live-nc-img">
                    {portada && <Image src={portada.src} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" quality={60} />}
                  </div>
                  <div className="live-nc-body">
                    <h2 className="live-nc-title">{s.titulo}</h2>
                    <p className="live-nc-desc">{s.grupos.map((g) => g.titulo).filter(Boolean).join(' · ') || `${arts.length} artículos`}</p>
                    <div className="live-nc-date"><span>{arts.length} ARTÍCULOS</span><span className="live-ext">ENTRAR →</span></div>
                  </div>
                </Link>
              );
            })}
          </div>

          <h2 className="revista-anio-t" style={{ marginTop: '4rem' }}>En el archivo histórico</h2>
          <div className="benefit-grid">
            {EN_WWW2.map((s) => (
              <a key={s.url} href={s.url} className="ben-item" target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                <div className="ben-title">{s.titulo} ↗</div>
                <div className="ben-desc">{s.d}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
