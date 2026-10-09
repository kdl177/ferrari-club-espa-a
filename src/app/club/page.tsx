import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ArchivoComunidad from '@/components/ArchivoComunidad';
import { CIRCUITO, VIAJES, CONCENTRACIONES } from '@/lib/galeria';

export const metadata: Metadata = {
  title: 'Nuestro Club — Ferrari Club España',
  description:
    'Conoce la historia, misión y estructura del Club Oficial de Propietarios y Apasionados de Ferrari en España desde 1988.',
  alternates: { canonical: '/club' },
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

const ACTIVITIES = [
  { ico: '◉', title: 'Track Days', desc: 'Jornadas en circuito exclusivas para socios del club. Circuitos como Jarama, Jerez, Montmeló, Calafat y Navarra.' },
  { ico: '◈', title: 'Rutas', desc: 'Rutas por carreteras españolas con los más bellos paisajes. Asturias, Pirineos, Sierra Nevada, Picos de Europa.' },
  { ico: '◎', title: 'Fórmula 1', desc: 'Asistencia a los Grandes Premios de F1 en España e internacionales. Acceso al paddock y áreas exclusivas.' },
  { ico: '◇', title: 'Visitas Maranello', desc: 'Viajes oficiales a la fábrica Ferrari en Maranello. Visita a talleres, museo, pista de pruebas Fiorano.' },
  { ico: '◆', title: 'Eventos Internacionales', desc: 'Participación en las principales concentraciones internacionales de Ferrari: Cavalcade, XX Programme, Classiche.' },
  { ico: '●', title: 'Concursos Elegancia', desc: 'Organización y participación en concursos de elegancia con Ferraris históricos y de colección en España.' },
  { ico: '○', title: 'Eventos Solidarios', desc: 'Tandas en circuito y acciones benéficas. El club participa activamente en iniciativas solidarias.' },
  { ico: '◉', title: 'Mundo Ferrari', desc: 'Acceso preferente a noticias y novedades de Ferrari. Contacto directo con el departamento de Owners Clubs de Ferrari.' },
];

const BOARD = [
  { av: 'P', name: 'Presidente' },
  { av: 'VP', name: 'Vicepresidente' },
  { av: 'S', name: 'Secretario' },
  { av: 'T', name: 'Tesorero' },
  { av: 'VO', name: 'Vocal' },
  { av: 'VO', name: 'Vocal' },
  { av: 'VO', name: 'Vocal' },
  { av: 'VO', name: 'Vocal' },
  { av: 'VO', name: 'Vocal' },
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
          <p className="sec-sub com-ph-sub">Empezó en 1988 con unos cuantos propietarios y la idea de verse los fines de semana. Sigue igual, con más gente.</p>
          <div style={{ display: 'flex', gap: '3.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <div className="stat"><span className="stat-n" data-count="200" data-suffix="+">200+</span><span className="stat-l">SOCIOS</span></div>
            <div className="stat"><span className="stat-n" data-count="1988">1988</span><span className="stat-l">FUNDACIÓN</span></div>
            <div className="stat"><span className="stat-n" data-count="38">38</span><span className="stat-l">AÑOS</span></div>
            <div className="stat"><span className="stat-n" data-count="2006">2006</span><span className="stat-l">CLUB OFICIAL</span></div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div data-r="right">
              <div className="sec-eye">QUIÉNES SOMOS</div>
              <h2 className="sec-title" style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>Un club de<br /><span style={{ color: 'var(--red)' }}>propietarios</span></h2>
              <p className="com-texto">El Ferrari Club España nació en 1988 y en 2006 recibió el reconocimiento oficial de Ferrari S.p.A. como Owners Club para España. Eso quiere decir que el carnet vale en cualquier club Ferrari del mundo.</p>
              <p className="com-texto">Lo que hacemos es sencillo: organizar salidas para que la gente use sus coches y se conozca entre sí. Circuito, carretera, Maranello y mesa larga.</p>
              <p className="com-texto">No hay cuota de exclusividad ni lista de espera: hace falta tener un Ferrari y ganas de venir.</p>
            </div>
            <div data-r="left">
              <figure className="club-foto" style={{ margin: 0, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/galeria/g04.webp" alt="Socios del Ferrari Club España durante la visita oficial al taller Ferrari Classiche de Maranello" loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
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
          <div data-r="up"><div className="sec-eye">DE DÓNDE VENIMOS</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3rem' }}>Ocho momentos<br /><span style={{ color: 'var(--red)' }}>que contar</span></h2></div>
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
              <img src="/galeria/g08.webp" alt="Socios y junta directiva del Ferrari Club España reunidos ante el castillo de Olite" loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
            </figure>
            <div data-r="left">
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w60)', lineHeight: 1.9, marginBottom: '2rem' }}>La junta directiva coordina el calendario de eventos, la relación con Ferrari S.p.A. y el día a día del club. Todos sus miembros son socios y propietarios, y el cargo es voluntario.</p>
              <div className="board-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '1px', background: 'var(--p10)', border: '1px solid var(--p10)' }}>
                {BOARD.map((b, i) => (
                  <div key={b.name + i} style={{ padding: '1.1rem .85rem', background: 'var(--ink)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--fh)', fontSize: '.84rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--white)' }}>{b.name}</div>
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
              «El emblema del Cavallino Rampante no es solo un símbolo. Es la promesa de que cada curva, cada recta y cada giro de motor será para siempre el instante más puro de la conducción.»
            </blockquote>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', letterSpacing: '.18em', color: 'var(--red)', marginTop: '1.25rem', paddingLeft: '1.75rem' }}>— FERRARI CLUB ESPAÑA · DESDE 1988</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 0, marginTop: '4.5rem' }} data-r="up">
            {[
              { n: '1988', l: 'Fundación del club' },
              { n: '200+', l: 'Socios activos' },
              { n: '35+', l: 'Eventos por año' },
              { n: 'ES', l: 'Club oficial España' },
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
