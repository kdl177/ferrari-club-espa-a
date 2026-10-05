import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import DealerFilter from '@/components/DealerFilter';
import { DEALERS } from '@/lib/concesionarios';

export const metadata: Metadata = {
  title: 'Concesionarios Ferrari en España — Ferrari Club España',
  description: 'Concesionarios oficiales Ferrari en España. Encuentra tu distribuidor Ferrari más cercano.',
  alternates: { canonical: '/concesionarios/' },
};


export default function ConcesionariosPage() {
  return (
    <>
      <section className="dealer-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Concesionarios' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">DISTRIBUIDORES OFICIALES</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">Concesionarios<br /><span style={{ color: 'var(--red)' }}>Ferrari España</span></h1>
          <p className="sec-sub" style={{ maxWidth: '580px', marginTop: '1.5rem' }} data-r="up">Distribuidores Oficiales Ferrari en España. Compra, post-venta y servicio de garantía con los más altos estándares de la marca.</p>
        </div>
        <div style={{ position: 'absolute', bottom: '-3rem', right: 0, fontFamily: 'var(--fd)', fontSize: '18vw', color: 'rgba(255,255,255,.015)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }} aria-hidden="true">ES</div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '5rem 0' }}>
        <div className="cnt">
          <DealerFilter dealers={DEALERS} />

          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', border: '1px solid var(--w08)' }} data-r="up">
            <div className="sec-eye" style={{ marginBottom: '1rem' }}>TODOS LOS DISTRIBUIDORES</div>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '.9rem', color: 'var(--w70)', lineHeight: 1.75, marginBottom: '1.5rem' }}>Estos son los cuatro concesionarios oficiales de Ferrari en España. Dirección, teléfono y horario proceden de la web oficial de cada uno; confírmalos antes de desplazarte.</p>
            <a href="https://www.ferrari.com/es-ES/auto/concesionarios" target="_blank" rel="noopener" className="btn btn-p" data-mag>BUSCAR EN FERRARI.COM ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
