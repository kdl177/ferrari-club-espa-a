import type { Metadata } from 'next';
import ComHero from '@/components/ComHero';

export const metadata: Metadata = {
  title: 'El club — La comunidad · Ferrari Club España',
  description: 'De dónde venimos: casi cuarenta años del Ferrari Club España, contados desde 1988 hasta hoy.',
  alternates: { canonical: '/comunidad/club/' },
};

const HITOS = [
  { año: '1988', t: 'Empieza todo', d: 'Unos cuantos propietarios de Ferrari se juntan en Madrid. No hay sede ni estatutos: hay ganas de quedar.' },
  { año: '1992', t: 'Salimos de España', d: 'Primeros encuentros fuera. Se empiezan a conocer los clubs de los países vecinos.' },
  { año: '1997', t: 'Primer día de circuito', d: 'El Jarama, más de treinta coches en pista. El formato que todavía repetimos cada año.' },
  { año: '2001', t: 'Maranello', d: 'El primer viaje oficial a la fábrica. Talleres, museo y Fiorano. Hay quien no se lo ha perdido desde entonces.' },
  { año: '2006', t: 'Ferrari nos reconoce', d: 'Ferrari S.p.A. nombra al club Owners Club oficial de España. Un sello que pocos tienen.' },
  { año: '2010', t: 'Doscientos', d: 'El club pasa de los doscientos socios y se convierte en el mayor club oficial de Ferrari en España.' },
  { año: '2018', t: 'Treinta años', d: 'Aniversario con concentración y exposición de clásicos en el museo de Maranello.' },
  { año: '2026', t: 'Hoy', d: 'Más de doscientos socios, decenas de salidas al año y la misma excusa de siempre para quedar.' },
];

export default function ComunidadClubPage() {
  return (
    <>
      <ComHero
        seccion="El club"
        titulo="Treinta y ocho años"
        tituloRojo="de carretera"
        entrada="Empezó en 1988 con unos cuantos propietarios y la idea de verse los fines de semana. Sigue igual, con más gente."
        foto="/galeria/g24.webp"
        fotoAlt="Un Ferrari rodando por carretera abierta"
        video="carretera"
      />

      <section style={{ background: 'var(--fce-grafito)', padding: '5rem 0' }}>
        <div className="cnt">
          <div className="com-presenta">
            <div>
              <div className="sec-eye">QUIÉNES SOMOS</div>
              <h2 className="sec-title" style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>Un club de<br /><span style={{ color: 'var(--red)' }}>propietarios</span></h2>
              <p className="com-texto">El Ferrari Club España nació en 1988 y en 2006 recibió el reconocimiento oficial de Ferrari S.p.A. como Owners Club para España. Eso quiere decir que el carnet vale en cualquier club Ferrari del mundo.</p>
              <p className="com-texto">Lo que hacemos es sencillo: organizar salidas para que la gente use sus coches y se conozca entre sí. Circuito, carretera, Maranello y mesa larga.</p>
              <p className="com-texto">No hay cuota de exclusividad ni lista de espera: hace falta tener un Ferrari y ganas de venir.</p>

              <div className="com-datos">
                <div><span className="tech-l">SEDE</span><br /><span className="com-dato-v">Madrid</span></div>
                <div><span className="tech-l">DESDE</span><br /><span className="com-dato-v">1988</span></div>
                <div><span className="tech-l">RECONOCIDO POR</span><br /><span className="com-dato-v" style={{ color: 'var(--red)' }}>Ferrari S.p.A.</span></div>
              </div>
            </div>

            <figure className="com-presenta-foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/galeria/g05.webp" alt="Socios del club entre Ferrari históricos en el taller de Maranello" loading="lazy" decoding="async" />
              <figcaption>Maranello · Entre los clásicos del taller</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', padding: '5rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">DE DÓNDE VENIMOS</div>
            <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3rem' }}>Ocho momentos<br /><span style={{ color: 'var(--red)' }}>que contar</span></h2>
          </div>
          <div className="com-hitos">
            {HITOS.map((h) => (
              <div className="com-hito" key={h.año}>
                <span className="com-hito-a">{h.año}</span>
                <h3 className="com-hito-t">{h.t}</h3>
                <p className="com-hito-d">{h.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--red)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,.25),transparent)' }} aria-hidden="true" />
        <div className="cnt" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1.5rem' }} data-r="up">¿NOS VEMOS EN LA PRÓXIMA?</h2>
          <p style={{ fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', marginBottom: '2.5rem' }} data-r="up">Treinta y ocho años después, seguimos quedando</p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} data-r="up">
            <a href="/comunidad/hazte-socio/" className="btn" style={{ background: 'var(--white)', color: 'var(--red)', borderColor: 'var(--white)', fontFamily: 'var(--fd)', fontSize: '.72rem', letterSpacing: '.15em', padding: '.8rem 2.5rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/comunidad/eventos/" className="btn btn-o" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'var(--white)' }}>VER LAS SALIDAS</a>
          </div>
        </div>
      </section>
    </>
  );
}
