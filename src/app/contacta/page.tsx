import type { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contacta — Ferrari Club España',
  description: 'Contacta con el Ferrari Club España. Dirección: Calle Constancia 41, 28002 Madrid. Teléfono: +34 91 575 41 60.',
  alternates: { canonical: '/contacta/' },
};

const INFO_CARDS = [
  { title: 'SOCIOS', desc: 'Para información sobre adhesión al club y cuotas de socio.' },
  { title: 'EVENTOS', desc: 'Inscripciones a track days, rutas y eventos del calendario.' },
  { title: 'PRENSA', desc: 'Solicitudes de medios, entrevistas y colaboraciones editoriales.' },
  { title: 'PATROCINIO', desc: 'Oportunidades de patrocinio y asociación con el club.' },
];

export default function ContactaPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Contacta' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">FERRARI CLUB ESPAÑA</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">CONTACTA<br /><span style={{ color: 'var(--red)' }}>CON NOSOTROS</span></h1>
          <p className="sec-sub" style={{ maxWidth: '560px', marginTop: '1.5rem' }} data-r="up">Estamos en Madrid para atenderte. No dudes en escribirnos o llamarnos para cualquier consulta sobre el club, eventos o membresía.</p>
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
                  <div className="ci-note">Metro: Lista (L4) · Diego de León (L4, L5, L9)</div>
                </div>
              </div>
              <div className="contact-info-block" data-r="right">
                <div className="ci-ico">☎</div>
                <div>
                  <div className="ci-label">TELÉFONO</div>
                  <div className="ci-value"><a href="tel:+34915754160">+34 91 575 41 60</a></div>
                  <div className="ci-note">Llamadas durante el horario de oficina</div>
                </div>
              </div>
              <div className="contact-info-block" data-r="right">
                <div className="ci-ico">✉</div>
                <div>
                  <div className="ci-label">EMAIL</div>
                  <div className="ci-value"><a href="mailto:ferrari@ferrariclubespana.com">ferrari@ferrariclubespana.com</a></div>
                  <div className="ci-note">Respondemos en un plazo de 24-48 horas laborables</div>
                </div>
              </div>
              <div className="contact-info-block" data-r="right">
                <div className="ci-ico">◷</div>
                <div>
                  <div className="ci-label">HORARIO DE ATENCIÓN</div>
                  <div className="ci-value">Lun–Jue: 9:00 – 17:30<br />Vie: 9:00 – 15:00</div>
                  <div className="ci-note">Sáb, Dom y festivos: cerrado</div>
                </div>
              </div>

              <div className="map-placeholder" data-r="right">
                <svg width="100%" height="100%" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" aria-label="Mapa de ubicación — Calle Constancia 41, Madrid">
                  <rect width="100%" height="100%" fill="#0A0A0A" />
                  <g stroke="rgba(218,41,28,.06)" fill="none" strokeWidth="1.5">
                    <line x1="0" y1="65" x2="600" y2="65" /><line x1="0" y1="130" x2="600" y2="130" />
                    <line x1="0" y1="195" x2="600" y2="195" />
                    <line x1="150" y1="0" x2="150" y2="260" /><line x1="300" y1="0" x2="300" y2="260" /><line x1="450" y1="0" x2="450" y2="260" />
                  </g>
                  <g fill="rgba(218,41,28,.06)" stroke="rgba(218,41,28,.1)" strokeWidth="1">
                    <rect x="80" y="90" width="60" height="40" rx="2" /><rect x="155" y="100" width="80" height="55" rx="2" />
                    <rect x="250" y="85" width="55" height="45" rx="2" /><rect x="320" y="95" width="90" height="40" rx="2" />
                    <rect x="420" y="90" width="70" height="50" rx="2" /><rect x="80" y="145" width="120" height="35" rx="2" />
                    <rect x="220" y="140" width="65" height="40" rx="2" /><rect x="300" y="145" width="100" height="35" rx="2" />
                    <rect x="420" y="148" width="75" height="32" rx="2" />
                  </g>
                  <rect x="0" y="130" width="600" height="20" fill="rgba(0,0,0,.5)" stroke="none" />
                  <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,.05)" strokeWidth="1" strokeDasharray="20 10" />
                  <circle cx="300" cy="130" r="10" fill="rgba(218,41,28,.8)" stroke="none" />
                  <circle cx="300" cy="130" r="4" fill="white" opacity=".9" />
                  <circle cx="300" cy="130" r="18" fill="rgba(218,41,28,.2)" stroke="rgba(218,41,28,.5)" strokeWidth="1" />
                </svg>
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontFamily: 'var(--fm)', fontSize: '.58rem', color: 'rgba(218,41,28,.5)', letterSpacing: '.1em' }}>40.4290°N · 3.6844°O · BARRIO SALAMANCA</div>
                <a href="https://maps.google.com/?q=Calle+Constancia+41,+28002+Madrid" target="_blank" rel="noopener" style={{ position: 'absolute', bottom: '1rem', left: '1rem', fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.1em', color: 'var(--red)', textDecoration: 'none', background: 'rgba(0,0,0,.85)', padding: '.55rem 1rem', border: '1px solid rgba(218,41,28,.3)', minHeight: '44px', display: 'flex', alignItems: 'center' }}>ABRIR EN MAPS ↗</a>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginTop: '1px' }}>
                {INFO_CARDS.map((c) => (
                  <div style={{ padding: '1.5rem', background: 'var(--b80)', border: '1px solid var(--w05)' }} key={c.title}>
                    <div className="sec-eye" style={{ fontSize: '.72rem', marginBottom: '.6rem' }}>{c.title}</div>
                    <p style={{ fontFamily: 'var(--fb)', fontSize: '.85rem', color: 'var(--w60)', lineHeight: 1.8 }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
