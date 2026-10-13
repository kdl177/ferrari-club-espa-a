import Breadcrumb from '@/components/Breadcrumb';

export default function PaginaLegal({ titulo, rojo, actualizada, children }: { titulo: string; rojo: string; actualizada: string; children: React.ReactNode }) {
  return (
    <>
      <section className="priv-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: `${titulo} ${rojo}` }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>INFORMACIÓN LEGAL</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }}>{titulo}<br /><span style={{ color: 'var(--red)' }}>{rojo}</span></h1>
        </div>
      </section>
      <section style={{ background: 'var(--b90)' }}>
        <div className="cnt">
          <div className="priv-body">
            <span className="priv-badge">{actualizada}</span>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
