import type { Metadata } from 'next';
import ComHero from '@/components/ComHero';
import NoticiasLista from '@/components/NoticiasLista';
import { pagina } from '@/lib/noticias';

export const metadata: Metadata = {
  title: 'Noticias — La comunidad · Ferrari Club España',
  description: 'Las crónicas de la redacción del club: Fórmula 1, resistencia, modelos y novedades de Maranello.',
  alternates: { canonical: '/comunidad/noticias/' },
};

export const revalidate = 3600;

export default async function ComunidadNoticiasPage() {
  const { noticias, total } = await pagina(1);
  return (
    <>
      <ComHero
        seccion="Noticias"
        titulo="Lo que se"
        tituloRojo="va contando"
        entrada="Cada Gran Premio en tres tiempos, la resistencia y las novedades de Maranello, contados por la redacción del club."
        foto="/galeria/g13.webp"
        fotoAlt="Socios del club en un paddock con la bandera de España"
      />

      <section style={{ background: 'var(--fce-grafito)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <NoticiasLista noticias={noticias} pagina={1} total={total} />
        </div>
      </section>
    </>
  );
}
