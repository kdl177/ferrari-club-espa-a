import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pago recibido — Ferrari Club España',
  robots: { index: false },
};

export default function BienvenidoPage() {
  return (
    <section className="socio-hero" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="cnt" style={{ textAlign: 'center' }}>
        <p className="sec-eye" style={{ justifyContent: 'center' }} data-r="up">PAGO CONFIRMADO</p>
        <h1 className="sec-title" style={{ fontSize: 'clamp(2rem,5vw,4rem)', marginTop: '.75rem' }} data-r="up">
          BIENVENIDO A LA<br /><span style={{ color: 'var(--red)' }}>FAMILIA FERRARI</span>
        </h1>
        <p className="sec-sub" style={{ maxWidth: '560px', margin: '1.5rem auto 0' }} data-r="up">
          Hemos recibido tu pago. En unos minutos recibirás un email de bienvenida con tu acceso al área de socios y los siguientes pasos.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }} data-r="up">
          <a href="/socios/" className="btn btn-p" data-mag>ACCEDER AL ÁREA DE SOCIOS <span className="btn-ico">→</span></a>
          <Link href="/" className="btn btn-o">VOLVER AL INICIO</Link>
        </div>
      </div>
    </section>
  );
}
