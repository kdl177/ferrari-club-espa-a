import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import historial from '@/content/historial-eventos.json';

const total = historial.reduce((n, a) => n + a.eventos.length, 0);
const desde = historial.at(-1)?.anio;
const hasta = historial[0]?.anio;

export const metadata: Metadata = {
  title: 'Historial de eventos — Ferrari Club España',
  description: `${total} eventos realizados por el Ferrari Club España entre ${desde} y ${hasta}: viajes a Maranello, test de Fórmula 1, tandas en circuito, concentraciones y rutas.`,
  alternates: { canonical: '/eventos/historial/' },
};

export default function HistorialPage() {
  return (
    <>
      <section className="page-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Eventos', href: '/eventos/' }, { label: 'Historial' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>HISTORIAL DE EVENTOS</p>
          <h1 className="sec-title" style={{ marginTop: '.75rem' }}>Eventos<br /><span style={{ color: 'var(--red)' }}>del club</span></h1>
          <p className="sec-sub" style={{ marginTop: '1rem', maxWidth: '520px' }}>
            Eventos realizados por el Ferrari Club España entre {desde} y {hasta}, según el historial publicado por el club.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '4rem 0 6rem' }}>
        <div className="cnt">
          {historial.map((a) => (
            <div className="hist-anio" key={a.anio}>
              <h2 className="revista-anio-t">{a.anio}</h2>
              <ol className="hist-lista">
                {a.eventos.map((e) => (
                  <li key={e.fecha + e.titulo} className="hist-ev">
                    <span className="hist-fecha">{e.fecha}</span>
                    <span className="hist-titulo">{e.titulo}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
