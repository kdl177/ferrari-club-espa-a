import type { Metadata } from 'next';
import ComHero from '@/components/ComHero';
import LiveNewsFeed from '@/components/LiveNewsFeed';

export const metadata: Metadata = {
  title: 'Noticias — La comunidad · Ferrari Club España',
  description: 'Lo que se cuenta del mundo Ferrari: Fórmula 1, resistencia, modelos y novedades, en español y en inglés.',
  alternates: { canonical: '/comunidad/noticias/' },
};

export default function ComunidadNoticiasPage() {
  return (
    <>
      <ComHero
        seccion="Noticias"
        titulo="Lo que se"
        tituloRojo="va contando"
        entrada="Fórmula 1, resistencia y novedades de Maranello. En español y en inglés, actualizado solo."
        foto="/galeria/g13.webp"
        fotoAlt="Socios del club en el paddock de Fórmula 1 con la bandera de España"
      />

      <section style={{ background: 'var(--fce-grafito)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <LiveNewsFeed />
        </div>
      </section>
    </>
  );
}
