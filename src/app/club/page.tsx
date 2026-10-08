import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ArchivoComunidad from '@/components/ArchivoComunidad';
import { CIRCUITO, VIAJES, CONCENTRACIONES } from '@/lib/galeria';
import { ANIOS } from '@/lib/sitio';
import { HITOS } from '@/lib/club';
import revista from '@/content/revista.json';

export const metadata: Metadata = {
  title: 'Nuestro Club — Ferrari Club España',
  description:
    'El Ferrari Club España, Club Oficial de propietarios de Ferrari desde 1988: historia, actividades y junta directiva.',
  alternates: { canonical: '/club/' },
};

const ACTIVITIES = [
  { ico: '◉', title: 'Tandas en circuito', desc: 'Jornadas de pilotaje en los circuitos más carismáticos del país.' },
  { ico: '◈', title: 'Rutas', desc: 'Itinerarios por los paisajes más bonitos de la Península y de las Islas Canarias.' },
  { ico: '◎', title: 'Test de F1', desc: 'Los test de pretemporada en el Circuit de Barcelona-Catalunya, desde el box de Ferrari y el paddock de la Scuderia.' },
  { ico: '◇', title: 'Maranello', desc: 'Visita anual a la fábrica Ferrari, exclusiva para socios.' },
  { ico: '◆', title: 'Ferrari Tributes', desc: 'Tribute to Mille Miglia, Tribute to Targa Florio en Sicilia y la Ferrari Cavalcade, que recorre cada año una región de Italia.' },
  { ico: '●', title: 'Otras marcas', desc: 'Visitas a Pagani, Maserati y otras casas.' },
  { ico: '○', title: 'Clubs de Europa', desc: 'Eventos compartidos con otros clubs Ferrari europeos.' },
  { ico: '◉', title: 'Clásicos', desc: 'Con un vocal de la junta dedicado a los Ferrari clásicos.' },
];

const BOARD = [
  { cargo: 'Presidente', nombre: 'Josep Rodríguez Vilarrasa' },
  { cargo: 'Vicepresidente', nombre: 'Santiago Martínez Espiñeira' },
  { cargo: 'Tesorero', nombre: 'Gonzalo Marruenda Castro' },
  { cargo: 'Secretario', nombre: 'Eugenio Carlos Bachofer García' },
  { cargo: 'Vocal · Clásicos', nombre: 'Carlos López Balaguer' },
  { cargo: 'Vocal · Levante', nombre: 'Francisco José Ríos Defez' },
  { cargo: 'Vocal · Catalunya', nombre: 'Sergi Boneu Torres' },
  { cargo: 'Vocal · Canarias', nombre: 'Noemí Sánchez Jinorio' },
  { cargo: 'Vocal · Andalucía', nombre: 'Enrique Ramallo Moreno' },
  { cargo: 'Club Manager', nombre: 'Stoyka Popstoyanova' },
  { cargo: 'Web y comunicación', nombre: 'Fede García' },
];

export default function ClubPage() {
  // La rejilla del archivo va a 6 columnas: se recorta a multiplo de 6 para
  // que la ultima fila no quede a medias.
  const todas = [...CONCENTRACIONES, ...VIAJES, ...CIRCUITO];
  const archivo = todas.slice(0, Math.floor(todas.length / 6) * 6);

  return (
    <>
      <section className="com-ph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="com-ph-fondo" src="/galeria/g24.webp" alt="Concentración de Ferrari en una plaza de pueblo vista desde lo alto" />
        <div className="com-ph-velo" aria-hidden="true" />
        <div className="cnt com-ph-cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Nuestro Club' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>CLUB OFICIAL FERRARI</p>
          <h1 className="sec-title com-ph-titulo">Casi cuarenta años<br /><span style={{ color: 'var(--red)' }}>quedando</span></h1>
          <p className="sec-sub com-ph-sub">Nació en 1988 como club exclusivo para propietarios de Ferrari. Desde 2006 es el único Club Oficial del Cavallino en España.</p>
          <div style={{ display: 'flex', gap: '3.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <div className="stat"><span className="stat-n" data-count="200" data-suffix="+">200+</span><span className="stat-l">SOCIOS</span></div>
            <div className="stat"><span className="stat-n" data-count="1988">1988</span><span className="stat-l">FUNDACIÓN</span></div>
            <div className="stat"><span className="stat-n" data-count={ANIOS}>{ANIOS}</span><span className="stat-l">AÑOS</span></div>
            <div className="stat"><span className="stat-n" data-count="2006">2006</span><span className="stat-l">CLUB OFICIAL</span></div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div className="split-2">
            <div data-r="right">
              <div className="sec-eye">QUIÉNES SOMOS</div>
              <h2 className="sec-title" style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>Un club de<br /><span style={{ color: 'var(--red)' }}>propietarios</span></h2>
              <p className="com-texto">El Ferrari Club España nació en 1988 y desde 2006 recibe el apoyo directo de Ferrari, que le concedió el estatus de Club Oficial.</p>
              <p className="com-texto">A lo largo del año organiza eventos para que los socios disfruten de sus coches y del ambiente del club: en circuito, por carretera, en Maranello y en los encuentros de la propia Ferrari.</p>
            </div>
            <div data-r="left">
              <figure className="club-foto" style={{ margin: 0, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/galeria/g04.webp" alt="Socios del Ferrari Club España en un taller Ferrari" loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
              </figure>
              <div style={{ position: 'relative', padding: '3rem', border: '1px solid var(--w08)', background: 'var(--black)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--red)', boxShadow: '0 0 12px var(--red)' }} />
                <p style={{ fontFamily: 'var(--fe)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--w90)', lineHeight: 1.85, marginBottom: '2rem' }}>&ldquo;Si eres propietario de un Ferrari y deseas compartir con nosotros tu pasión por <em>Il Cavallino</em>, hazte Socio del Ferrari Club España.&rdquo;</p>
                <div className="rl" />
                <div style={{ marginTop: '2rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                  <div><span className="tech-l">SEDE</span><br /><span style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--white)' }}>Madrid, España</span></div>
                  <div><span className="tech-l">CATEGORÍA</span><br /><span style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--white)' }}>Club Oficial</span></div>
                  <div><span className="tech-l">RECONOCIMIENTO</span><br /><span style={{ fontFamily: 'var(--fh)', fontSize: '.95rem', color: 'var(--red)' }}>Ferrari S.p.A.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--black)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up"><div className="sec-eye">DE DÓNDE VENIMOS</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3rem' }}>El club,<br /><span style={{ color: 'var(--red)' }}>en tres fechas</span></h2></div>
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

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up"><div className="sec-eye">ACTIVIDADES</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>Qué<br /><span style={{ color: 'var(--red)' }}>hacemos</span></h2></div>
          <div className="activity-grid">
            {ACTIVITIES.map((a, i) => (
              <div className="act-card" data-r={i < 3 || i >= 6 ? 'up' : 'scale'} key={a.title + i}><div className="act-ico">{a.ico}</div><div className="act-title">{a.title}</div><div className="act-desc">{a.desc}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--black)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up"><div className="sec-eye">EQUIPO</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>Junta<br /><span style={{ color: 'var(--red)' }}>directiva</span></h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)', gap: '3rem', alignItems: 'center' }} className="junta-bloque">
            <figure style={{ margin: 0, overflow: 'hidden', border: '1px solid var(--p10)' }} data-r="right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/galeria/g08.webp" alt="Socios del Ferrari Club España reunidos ante un castillo" loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
            </figure>
            <div data-r="left">
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w60)', lineHeight: 1.9, marginBottom: '2rem' }}>Los miembros de la junta directiva y el equipo de la oficina de Madrid.</p>
              <div className="board-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '1px', background: 'var(--p10)', border: '1px solid var(--p10)' }}>
                {BOARD.map((b) => (
                  <div key={b.nombre} style={{ padding: '1.1rem .85rem', background: 'var(--ink)' }}>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '.66rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red-g)', marginBottom: '.4rem' }}>{b.cargo}</div>
                    <div style={{ fontFamily: 'var(--fh)', fontSize: '.92rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1.3 }}>{b.nombre}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">ARCHIVO</div>
            <h2 className="sec-title" style={{ marginTop: '1rem' }}>Nuestra<br /><span style={{ color: 'var(--red)' }}>memoria</span></h2>
            <p className="sec-sub" style={{ maxWidth: '620px', marginTop: '1.5rem', marginBottom: '3.5rem' }}>Casi cuatro décadas de circuitos, rutas y encuentros. Pulsa cualquiera para verla más grande.</p>
          </div>

          <ArchivoComunidad piezas={archivo} />
        </div>
      </section>

      <section style={{ background: 'linear-gradient(160deg,#0A0A0A,var(--black))', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 80% at 20% 60%,rgba(218,41,28,.13),transparent)', pointerEvents: 'none' }} aria-hidden="true" />
        <div style={{ position: 'absolute', bottom: '-1rem', right: '-2rem', fontFamily: 'var(--fd)', fontSize: '22vw', color: 'rgba(218,41,28,.04)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1, letterSpacing: '-.05em' }} aria-hidden="true">F</div>
        <div className="cnt" style={{ position: 'relative' }}>
          <p className="sec-eye" data-r="up">NUESTRA ESENCIA</p>
          <div style={{ maxWidth: '860px', marginTop: '2rem' }} data-r="up">
            <blockquote style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.65rem,3.8vw,3rem)', letterSpacing: '.04em', lineHeight: 1.22, color: 'var(--white)', paddingLeft: '1.75rem', borderLeft: '3px solid var(--red)', margin: 0 }}>
              «El único Club Oficial del Cavallino de nuestro país.»
            </blockquote>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.18em', color: 'var(--red)', marginTop: '1.25rem', paddingLeft: '1.75rem' }}>— FERRARI CLUB ESPAÑA · DESDE 1988</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 0, marginTop: '4.5rem' }} data-r="up">
            {[
              { n: '1988', l: 'Fundación del club' },
              { n: '200+', l: 'Socios' },
              { n: '2006', l: 'Club Oficial Ferrari' },
              { n: String(revista[0].numero), l: 'Números de la revista' },
            ].map((s) => (
              <div style={{ padding: '2rem', borderTop: '1px solid var(--w08)' }} key={s.l}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.8rem,5vw,4.5rem)', color: 'var(--red)', lineHeight: 1, letterSpacing: '-.02em' }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.18em', color: 'var(--w60)', marginTop: '.65rem', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--red)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,.25),transparent)' }} aria-hidden="true" />
        <div className="cnt" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1.5rem' }} data-r="up">¿ERES PROPIETARIO DE UN FERRARI?</h2>
          <p style={{ fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', marginBottom: '2.5rem' }} data-r="up">Únete al único club oficial de Ferrari en España</p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} data-r="up">
            <a href="/club/hazte-socio/" className="btn" style={{ background: 'var(--white)', color: 'var(--red)', borderColor: 'var(--white)', fontFamily: 'var(--fd)', fontSize: '.72rem', letterSpacing: '.15em', padding: '.8rem 2.5rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/contacta/" className="btn btn-o" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'var(--white)' }}>MÁS INFORMACIÓN</a>
          </div>
        </div>
      </section>
    </>
  );
}
