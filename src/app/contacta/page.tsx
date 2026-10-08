import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/ContactForm';
import MapaOSM from '@/components/MapaOSM';

export const metadata: Metadata = {
  title: 'Contacta — Ferrari Club España',
  description: 'Contacta con el Ferrari Club España. Dirección: Calle Constancia 41, 28002 Madrid. Teléfono: +34 91 575 41 60.',
  alternates: { canonical: '/contacta/' },
};

export default function ContactaPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Contacta' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">FERRARI CLUB ESPAÑA</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">Contacta<br /><span style={{ color: 'var(--red)' }}>con nosotros</span></h1>
          <p className="sec-sub" style={{ maxWidth: '560px', marginTop: '1.5rem' }} data-r="up">Oficina del club en Madrid: Calle Constancia 41, entreplanta. Teléfono 91 575 41 60.</p>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '5rem 0' }}>
        <div className="cnt">
          <div className="contact-layout">
            <div>
              <div className="sec-eye" style={{ marginBottom: '2rem' }} data-r="right">INFORMACIÓN DE CONTACTO</div>

              <div className="contact-info-block" data-r="right">
                <div className="ci-ico">◎</div>
                <div>
                  <div className="ci-label">DIRECCIÓN</div>
                  <div className="ci-value">Calle Constancia 41, Entreplanta<br />28002 Madrid, España</div>
                </div>
              </div>
              <div className="contact-info-block" data-r="right">
                <div className="ci-ico">☎</div>
                <div>
                  <div className="ci-label">TELÉFONO</div>
                  <div className="ci-value"><a href="tel:+34915754160">+34 91 575 41 60</a></div>
                </div>
              </div>
              <div className="contact-info-block" data-r="right">
                <div className="ci-ico">✉</div>
                <div>
                  <div className="ci-label">EMAIL</div>
                  <div className="ci-value"><a href="mailto:ferrari@ferrariclubespana.com">ferrari@ferrariclubespana.com</a></div>
                </div>
              </div>
              <div className="contact-info-block" data-r="right">
                <div className="ci-ico">◷</div>
                <div>
                  <div className="ci-label">HORARIO DE ATENCIÓN</div>
                  <div className="ci-value">Lun–Jue: 9:00 – 17:30<br />Vie: 9:00 – 15:00</div>
                </div>
              </div>

              <div data-r="right">
                <MapaOSM className="contacto-mapa" lat={40.44295} lng={-3.67197} titulo="Mapa de la sede del Ferrari Club España, Calle Constancia 41, Madrid" />
                <a href="https://www.google.com/maps/dir/?api=1&destination=Calle+Constancia+41,+28002+Madrid" target="_blank" rel="noopener" className="como-llegar contacto-como">CÓMO LLEGAR ↗</a>
              </div>

              <div className="social-row" data-r="right">
                <a href="https://www.facebook.com/ferrariclubespana" target="_blank" rel="noopener" className="social-btn">FACEBOOK ↗</a>
                <a href="https://www.instagram.com/ferrariclubespana" target="_blank" rel="noopener" className="social-btn">INSTAGRAM ↗</a>
              </div>
            </div>

            <div data-r="left">
              <div className="sec-eye" style={{ marginBottom: '2rem' }}>FORMULARIO DE CONTACTO</div>
              <div style={{ padding: '2.5rem', border: '1px solid var(--w08)', background: 'var(--black)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--red)', boxShadow: '0 0 12px var(--red)' }} />
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
