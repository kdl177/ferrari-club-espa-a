import type { Metadata } from 'next';
import ComHero from '@/components/ComHero';
import FaqItem from '@/components/FaqItem';
import HazteSocioForm from '@/components/HazteSocioForm';
import { BENEFITS, REQUIREMENTS, FAQS } from '@/lib/socio';

export const metadata: Metadata = {
  title: 'Hazte socio — La comunidad · Ferrari Club España',
  description: 'Cómo entrar en el Ferrari Club España: qué hace falta, qué incluye y el formulario de solicitud.',
  alternates: { canonical: '/comunidad/hazte-socio/' },
};

export default function ComunidadHazteSocioPage() {
  return (
    <>
      <ComHero
        seccion="Hazte socio"
        titulo="Te falta"
        tituloRojo="una firma"
        entrada="Si tienes un Ferrari, ya tienes lo único que de verdad hace falta. Lo demás es papeleo."
        foto="/galeria/g22.webp"
        fotoAlt="Ferrari reunidos en la plaza de un pueblo durante una concentración del club"
      />

      <section style={{ background: 'var(--fce-grafito)', padding: '5rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">QUÉ TE LLEVAS</div>
            <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3rem' }}>Lo que incluye<br /><span style={{ color: 'var(--red)' }}>ser socio</span></h2>
          </div>
          <div className="com-ventajas">
            {BENEFITS.map((b) => (
              <div className="com-ventaja" key={b.title}>
                <h3 className="com-ventaja-t">{b.title}</h3>
                <p className="com-ventaja-d">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', padding: '5rem 0' }}>
        <div className="cnt">
          <div className="com-alta">
            <div>
              <div className="sec-eye" style={{ marginBottom: '1.5rem' }}>CÓMO SE ENTRA</div>
              <div className="com-pasos">
                {REQUIREMENTS.map((r) => (
                  <div className="com-paso" key={r.n}>
                    <span className="com-paso-n">{r.n}</span>
                    <div>
                      <h3 className="com-paso-t">{r.title}</h3>
                      <p className="com-paso-d">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <figure className="com-contacta-foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/galeria/g04.webp" alt="Socios del club durante la visita al taller Ferrari Classiche de Maranello" loading="lazy" decoding="async" />
                <figcaption>Maranello · Visita a Classiche</figcaption>
              </figure>
            </div>

            <div>
              <div className="sec-eye" style={{ marginBottom: '1.5rem' }}>LA SOLICITUD</div>
              <div className="com-form">
                <HazteSocioForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--fce-grafito)', padding: '5rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">DUDAS FRECUENTES</div>
            <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>Lo que más<br /><span style={{ color: 'var(--red)' }}>nos preguntan</span></h2>
          </div>
          <div style={{ maxWidth: '820px' }}>
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} question={f.q} answer={f.a} last={i === FAQS.length - 1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
