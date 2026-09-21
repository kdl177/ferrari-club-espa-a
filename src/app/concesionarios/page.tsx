import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import DealerFilter from '@/components/DealerFilter';

export const metadata: Metadata = {
  title: 'Concesionarios Ferrari en España — Ferrari Club España',
  description: 'Concesionarios oficiales Ferrari en España. Encuentra tu distribuidor Ferrari más cercano.',
  alternates: { canonical: '/concesionarios/' },
};

// Red oficial segun ferrari.com/es-ES/auto/concesionarios. Direccion, telefono,
// horario y coordenadas proceden del micrositio oficial de cada concesionario.
const DEALERS = [
  { region: 'madrid', city: 'MADRID', name: 'Santogal Automóviles', addr: 'Puerto de Somport 8, 28050 Madrid', tel: '+34910488170', telFmt: '+34 910 48 81 70', hours: 'Lun–Vie: 9:00–14:00 / 15:30–18:30 · Sáb–Dom: cerrado', lat: 40.49527, lng: -3.67282, web: 'https://madrid.ferraridealers.com/es-ES/' },
  { region: 'cataluna', city: 'BARCELONA', name: 'Quadis Gallery Barcelona', addr: 'Pso. de la Zona Franca 10-12, 08038 Barcelona', tel: '+34932896363', telFmt: '+34 93 289 63 63', hours: 'Lun–Vie: 9:00–13:00 / 15:00–19:00 · Sáb–Dom: cerrado', lat: 41.35201, lng: 2.14547, web: 'https://barcelona.ferraridealers.com/es-ES/' },
  { region: 'levante', city: 'VALENCIA', name: 'Quadis Gallery Valencia', addr: 'Avenida del Maestro Rodrigo 50, 46015 Valencia', tel: '+34963479199', telFmt: '+34 963 47 91 99', hours: 'Lun–Vie: 8:30–14:00 / 16:00–18:30 · Sáb–Dom: cerrado', lat: 39.48569, lng: -0.40313, web: 'https://valencia.ferraridealers.com/es-ES/' },
  { region: 'andalucia', city: 'MARBELLA', name: 'C. de Salamanca', addr: 'Avenida Norberto Goizueta s/n, 29670 San Pedro Alcántara, Marbella', tel: '+34952782211', telFmt: '+34 952 78 22 11', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:30–13:30 · Dom: cerrado', lat: 36.47971, lng: -4.99385, web: 'https://marbella.ferraridealers.com/es-ES/' },
];

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
