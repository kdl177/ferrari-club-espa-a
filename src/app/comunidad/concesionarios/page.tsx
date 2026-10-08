import type { Metadata } from 'next';
import ComHero from '@/components/ComHero';
import DealerFilter from '@/components/DealerFilter';
import { DEALERS } from '@/lib/concesionarios';

export const metadata: Metadata = {
  title: 'Concesionarios — La comunidad · Ferrari Club España',
  description: 'Los cuatro concesionarios oficiales Ferrari en España: Madrid, Barcelona, Valencia y Marbella.',
  alternates: { canonical: '/comunidad/concesionarios/' },
};

export default function ComunidadConcesionariosPage() {
  return (
    <>
      <ComHero
        seccion="Concesionarios"
        titulo="Cuatro casas"
        tituloRojo="en España"
        entrada="Madrid, Barcelona, Valencia y Marbella. Compra, taller y garantía oficial."
        foto="/galeria/g25.webp"
        fotoAlt="Ferrari del club alineados ante la Ciudad de las Artes y las Ciencias de Valencia"
      />

      <section style={{ background: 'var(--fce-grafito)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <DealerFilter dealers={DEALERS} />

          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', border: '1px solid var(--p10)' }} data-r="up">
            <div className="sec-eye" style={{ marginBottom: '1rem' }}>ANTES DE IR</div>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '.9rem', color: 'var(--w70)', lineHeight: 1.75, marginBottom: '1.5rem' }}>Dirección, teléfono y horario salen de la web oficial de cada concesionario. Conviene confirmarlos antes de desplazarte.</p>
            <a href="https://www.ferrari.com/es-ES/auto/concesionarios" target="_blank" rel="noopener" className="btn btn-p" data-mag>BUSCAR EN FERRARI.COM ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
