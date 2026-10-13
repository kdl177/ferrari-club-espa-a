import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import FondoHero from '@/components/FondoHero';
import NoticiasLista from '@/components/NoticiasLista';
import { pagina } from '@/lib/noticias';

export const metadata: Metadata = {
  title: 'Noticias — Ferrari Club España',
  description:
    'Crónicas de cada Gran Premio de Fórmula 1, resistencia, nuevos modelos y actualidad de Ferrari, escritas por la redacción del Ferrari Club España.',
  alternates: { canonical: '/noticias/' },
};

export const revalidate = 3600;

export default async function NoticiasPage() {
  const { noticias, total, cuantas } = await pagina(1);
  return (
    <>
      <section className="page-hero">
        <FondoHero nombre="portada-laferrari" alt="Frontal de un LaFerrari en blanco y negro" />
        <div className="cnt" style={{ position: 'relative', zIndex: 2 }}>
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Noticias' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>MAGAZINE DEL CLUB</p>
          <h1 className="sec-title" style={{ marginTop: '.75rem' }}>Mundo<br /><span style={{ color: 'var(--red)' }}>Ferrari</span></h1>
          <p className="sec-sub" style={{ marginTop: '1rem', maxWidth: '520px' }}>
            Cada Gran Premio contado en tres tiempos (previo, clasificación y carrera), la resistencia, los nuevos modelos y la historia de Maranello. {cuantas} crónicas de la redacción del club.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <NoticiasLista noticias={noticias} pagina={1} total={total} />
        </div>
      </section>
    </>
  );
}
