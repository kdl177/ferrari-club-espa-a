import type { Metadata } from 'next';
import ComHero from '@/components/ComHero';
import { HITOS } from '@/lib/club';
import { ANIOS } from '@/lib/sitio';

export const metadata: Metadata = {
  title: 'El club — La comunidad · Ferrari Club España',
  description: 'El Ferrari Club España desde 1988: el único Club Oficial del Cavallino en España.',
  alternates: { canonical: '/comunidad/club/' },
};

export default function ComunidadClubPage() {
  return (
    <>
      <ComHero
        seccion="El club"
        titulo={`${ANIOS} años`}
        tituloRojo="de carretera"
        entrada="Nació en 1988 como club exclusivo para propietarios de Ferrari. Desde 2006 es el único Club Oficial del Cavallino en España."
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
              <p className="com-texto">El Ferrari Club España nació en 1988 y desde 2006 recibe el apoyo directo de Ferrari, que le concedió el estatus de Club Oficial.</p>
              <p className="com-texto">A lo largo del año organiza eventos para que los socios disfruten de sus coches y del ambiente del club: en circuito, por carretera, en Maranello y en los encuentros de la propia Ferrari.</p>

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
            <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3rem' }}>El club,<br /><span style={{ color: 'var(--red)' }}>en tres fechas</span></h2>
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
          <p style={{ fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', marginBottom: '2.5rem' }} data-r="up">Desde 1988, el club de los propietarios de Ferrari</p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} data-r="up">
            <a href="/comunidad/hazte-socio/" className="btn" style={{ background: 'var(--white)', color: 'var(--red)', borderColor: 'var(--white)', fontFamily: 'var(--fd)', fontSize: '.72rem', letterSpacing: '.15em', padding: '.8rem 2.5rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/comunidad/eventos/" className="btn btn-o" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'var(--white)' }}>VER LAS SALIDAS</a>
          </div>
        </div>
      </section>
    </>
  );
}
