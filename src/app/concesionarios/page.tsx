import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import DealerFilter from '@/components/DealerFilter';

export const metadata: Metadata = {
  title: 'Concesionarios Ferrari en España — Ferrari Club España',
  description: 'Concesionarios oficiales Ferrari en España. Encuentra tu distribuidor Ferrari más cercano.',
  alternates: { canonical: '/concesionarios/' },
};

const DEALERS = [
  { region: 'madrid', city: 'MADRID', name: 'Motor Deluxe — Ferrari Madrid', addr: 'Paseo de la Castellana 180, 28046 Madrid', tel: '+34917004200', telFmt: '+34 91 700 42 00', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:00–14:00', coord: '40.4168°N · 3.7038°O', bg: '#0a0000' },
  { region: 'cataluna', city: 'BARCELONA', name: 'Nani Móvil — Ferrari Barcelona', addr: 'Av. Diagonal 520, 08006 Barcelona', tel: '+34932720040', telFmt: '+34 93 272 00 40', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:00–14:00', coord: '41.3851°N · 2.1734°E', bg: '#050500' },
  { region: 'andalucia', city: 'SEVILLA', name: 'Auto Sánchez — Ferrari Sevilla', addr: 'Calle Resolana 17, 41009 Sevilla', tel: '+34954541000', telFmt: '+34 95 454 10 00', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:00–14:00', coord: '37.3891°N · 5.9845°O', bg: '#050000' },
  { region: 'pais-vasco', city: 'BILBAO', name: 'Inchcape — Ferrari Bilbao', addr: 'Gran Vía Diego López de Haro 80, 48011 Bilbao', tel: '+34944200100', telFmt: '+34 94 420 01 00', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:00–14:00', coord: '43.2630°N · 2.9350°O', bg: '#040404' },
  { region: 'levante', city: 'VALENCIA', name: 'Motor Rabasa — Ferrari Valencia', addr: 'Av. de las Cortes Valencianas 50, 46015 Valencia', tel: '+34963600100', telFmt: '+34 96 360 01 00', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:00–14:00', coord: '39.4699°N · 0.3763°O', bg: '#050500' },
  { region: 'andalucia', city: 'MARBELLA', name: 'Auto Premium — Ferrari Marbella', addr: 'Ctra. Nacional 340, km 176, 29660 Marbella', tel: '+34952815100', telFmt: '+34 95 281 51 00', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:00–14:00', coord: '36.5101°N · 4.8824°O', bg: '#050000' },
];

export default function ConcesionariosPage() {
  return (
    <>
      <section className="dealer-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Concesionarios' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">DISTRIBUIDORES OFICIALES</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">CONCESIONARIOS<br /><span style={{ color: 'var(--red)' }}>FERRARI ESPAÑA</span></h1>
          <p className="sec-sub" style={{ maxWidth: '580px', marginTop: '1.5rem' }} data-r="up">Distribuidores Oficiales Ferrari en España. Compra, post-venta y servicio de garantía con los más altos estándares de la marca.</p>
        </div>
        <div style={{ position: 'absolute', bottom: '-3rem', right: 0, fontFamily: 'var(--fd)', fontSize: '18vw', color: 'rgba(255,255,255,.015)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }} aria-hidden="true">ES</div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '5rem 0' }}>
        <div className="cnt">
          <DealerFilter dealers={DEALERS} />

          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', border: '1px solid var(--w08)' }} data-r="up">
            <div className="sec-eye" style={{ marginBottom: '1rem' }}>TODOS LOS DISTRIBUIDORES</div>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '.9rem', color: 'var(--w70)', lineHeight: 1.75, marginBottom: '1.5rem' }}>Para consultar el listado completo y actualizado de concesionarios oficiales Ferrari en España, visita la web oficial de Ferrari.</p>
            <a href="https://www.ferrari.com/es-ES/dealers" target="_blank" rel="noopener" className="btn btn-p" data-mag>BUSCAR EN FERRARI.COM ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
