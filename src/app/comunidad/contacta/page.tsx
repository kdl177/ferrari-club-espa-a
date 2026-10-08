import type { Metadata } from 'next';
import { Suspense } from 'react';
import ComHero from '@/components/ComHero';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Hablamos — La comunidad · Ferrari Club España',
  description: 'Escríbenos: dudas sobre hacerse socio, salidas del club, prensa o patrocinio.',
  alternates: { canonical: '/comunidad/contacta/' },
};

const MOTIVOS = [
  { t: 'QUIERO SER SOCIO', d: 'Cómo entrar en el club, qué hace falta y qué cuesta.' },
  { t: 'UNA SALIDA', d: 'Dudas sobre una salida del calendario o sobre tu plaza.' },
  { t: 'PRENSA', d: 'Medios, entrevistas y colaboraciones.' },
  { t: 'PATROCINIO', d: 'Acuerdos y colaboración con el club.' },
];

export default function ComunidadContactaPage() {
  return (
    <>
      <ComHero
        seccion="Hablamos"
        titulo="Escríbenos"
        tituloRojo="y te contamos"
        entrada="Dudas sobre hacerse socio, sobre una salida o cualquier otra cosa. Contesta una persona."
        foto="/galeria/g06.webp"
        fotoAlt="Socios del club reunidos en la plaza de San Gimignano, en la Toscana"
      />

      <section style={{ background: 'var(--fce-grafito)', padding: '5rem 0' }}>
        <div className="cnt">
          <div className="com-contacta">
            <div>
              <div className="sec-eye" style={{ marginBottom: '1.5rem' }}>POR QUÉ ESCRIBES</div>
              <div className="com-motivos">
                {MOTIVOS.map((m) => (
                  <div className="com-motivo" key={m.t}>
                    <div className="com-motivo-t">{m.t}</div>
                    <p className="com-motivo-d">{m.d}</p>
                  </div>
                ))}
              </div>

              <figure className="com-contacta-foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/galeria/g11.webp" alt="Socios del club reunidos en una comida de hermandad" loading="lazy" decoding="async" />
                <figcaption>Sobremesa · Comida del club</figcaption>
              </figure>
            </div>

            <div>
              <div className="sec-eye" style={{ marginBottom: '1.5rem' }}>EL FORMULARIO</div>
              <div className="com-form">
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
