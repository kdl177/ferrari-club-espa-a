import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import PresupuestoForm from '@/components/PresupuestoForm';

export const metadata: Metadata = {
  title: 'Seguros para vehículos Ferrari — Ferrari Club España',
  description: 'Solicita presupuesto del seguro para tu Ferrari. Oferta especial para los socios del Ferrari Club España.',
  alternates: { canonical: '/solicita-presupuesto/' },
};

export default function SolicitaPresupuestoPage() {
  return (
    <>
      <section className="page-hero">
        <div className="cnt nota-ancho">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Socios', href: '/socios/' }, { label: 'Solicita presupuesto' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>SEGUROS PARA VEHÍCULOS FERRARI</p>
          <h1 className="nota-titulo">Solicita presupuesto</h1>
          <p className="sec-sub" style={{ marginTop: '1.25rem' }}>
            Ferrari Club de España trabaja día a día pensando en ti y colaborando con las principales compañías aseguradoras del mercado. Cumplimenta el siguiente formulario y encuentra la oferta de seguro que se adapta mejor a ti y a tu vehículo.
          </p>
        </div>
      </section>
      <section style={{ background: 'var(--b90)', padding: '4rem 0 6rem' }}>
        <div className="cnt nota-ancho">
          <div className="socio-form-caja">
            <PresupuestoForm />
          </div>
        </div>
      </section>
    </>
  );
}
