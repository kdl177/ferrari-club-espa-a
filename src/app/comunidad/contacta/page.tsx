import type { Metadata } from 'next';
import { Suspense } from 'react';
import ComHero from '@/components/ComHero';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Hablamos — La comunidad · Ferrari Club España',
  description: 'Contacta con la secretaría del Ferrari Club España en Madrid.',
  alternates: { canonical: '/comunidad/contacta/' },
};

const MOTIVOS = [
  { t: 'HORARIO', d: 'De lunes a jueves de 9:00 a 17:30 y viernes de 9:00 a 15:00.' },
  { t: 'TELÉFONO', d: '91 575 41 60' },
  { t: 'EMAIL', d: 'ferrari@ferrariclubespana.com' },
];

export default function ComunidadContactaPage() {
  return (
    <>
      <ComHero
        seccion="Hablamos"
        titulo="Escríbenos"
        tituloRojo="y te contamos"
        entrada="Secretaría del club: Calle Constancia 41, entreplanta, Madrid. Teléfono 91 575 41 60."
        foto="/galeria/g11.webp"
        fotoAlt="Socios del club reunidos en una comida"
      />

      <section style={{ background: 'var(--fce-grafito)', padding: '5rem 0' }}>
        <div className="cnt">
          <div className="com-contacta">
            <div>
              <div className="sec-eye" style={{ marginBottom: '1.5rem' }}>SECRETARÍA</div>
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
                <img src="/galeria/g06.webp" alt="Socios del club reunidos en una plaza" loading="lazy" decoding="async" />
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
