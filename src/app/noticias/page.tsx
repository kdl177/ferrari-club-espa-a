import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import FondoHero from '@/components/FondoHero';
import LiveNewsFeed from '@/components/LiveNewsFeed';

export const metadata: Metadata = {
  title: 'Noticias — Ferrari Club España',
  description: 'Últimas noticias de Ferrari en vivo: Fórmula 1, WEC, modelos, eventos. Actualización automática desde las principales fuentes del mundo Ferrari.',
  alternates: { canonical: '/noticias' },
};

export default function NoticiasPage() {
  return (
    <>
      <section className="page-hero">
        <FondoHero nombre="portada-laferrari" alt="Frontal de un LaFerrari en blanco y negro" />
        <div className="cnt" style={{ position: 'relative', zIndex: 2 }}>
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Noticias' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">TABLÓN DE NOTICIAS</p>
          <h1 className="sec-title" style={{ marginTop: '.75rem' }} data-r="up">Mundo<br /><span style={{ color: 'var(--red)' }}>Ferrari</span></h1>
          <p className="sec-sub" style={{ marginTop: '1rem', maxWidth: '420px' }} data-r="up"><em>Las últimas noticias de Ferrari, Fórmula 1 y motorsport. Actualización automática.</em></p>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <LiveNewsFeed />
        </div>
      </section>

    </>
  );
}
