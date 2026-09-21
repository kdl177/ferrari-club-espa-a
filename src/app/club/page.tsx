import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Foto from '@/components/Foto';

export const metadata: Metadata = {
  title: 'Nuestro Club — Ferrari Club España',
  description:
    'Conoce la historia, misión y estructura del Club Oficial de Propietarios y Apasionados de Ferrari en España desde 1988.',
  alternates: { canonical: '/club/' },
};

const TIMELINE_LEFT = [
  { year: '1988', title: 'Fundación del Club', desc: 'Un grupo de propietarios de Ferrari en España decide unirse para compartir su pasión. Nace el Ferrari Club España en Madrid.' },
  { year: '1992', title: 'Primeros Eventos Internacionales', desc: 'El club participa por primera vez en eventos de carácter internacional, estableciendo lazos con otros clubs europeos.' },
  { year: '1997', title: 'Primer Track Day Oficial', desc: 'Organización del primer track day oficial del club en el Circuito del Jarama, con más de 30 Ferraris en pista.' },
  { year: '2001', title: 'Primera Visita a Maranello', desc: 'Viaje oficial a la fábrica Ferrari en Maranello, Italia. Los socios visitan las instalaciones, el museo y los talleres.' },
];

const TIMELINE_RIGHT = [
  { year: '2006', title: 'Reconocimiento Oficial Ferrari', desc: 'Ferrari S.p.A. otorga al club el estatus de "Ferrari Owners Club Oficial" para España, un reconocimiento que solo ostentan los clubs más destacados del mundo.' },
  { year: '2010', title: 'Expansión a 200 Socios', desc: 'El club supera los 200 socios activos, consolidándose como el mayor club oficial de Ferrari en España.' },
  { year: '2018', title: '30 Aniversario', desc: 'Celebración del 30 aniversario con una gran concentración y exposición de Ferraris históricos en el Museo Ferrari de Maranello.' },
  { year: '2026', title: 'Presente', desc: 'Más de 200 socios, decenas de eventos al año y el reconocimiento de Ferrari S.p.A. como uno de los clubs más activos de Europa.' },
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
  return (
    <>
      <section className="club-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Nuestro Club' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">CLUB OFICIAL FERRARI</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">Nuestro<br /><span style={{ color: 'var(--red)' }}>club</span></h1>
          <p className="sec-sub" style={{ maxWidth: '600px', marginTop: '1.5rem' }} data-r="up">Club de Propietarios y Apasionados de Ferrari desde 1988. El único club oficial de <em>Il Cavallino Rampante</em> en España.</p>
          <div style={{ display: 'flex', gap: '4rem', marginTop: '3.5rem', flexWrap: 'wrap' }} data-r="up">
            <div className="stat"><span className="stat-n" data-count="200" data-suffix="+">200+</span><span className="stat-l">SOCIOS</span></div>
            <div className="stat"><span className="stat-n" data-count="1988">1988</span><span className="stat-l">FUNDACIÓN</span></div>
            <div className="stat"><span className="stat-n" data-count="38">38</span><span className="stat-l">AÑOS</span></div>
            <div className="stat"><span className="stat-n" data-count="2006">2006</span><span className="stat-l">CLUB OFICIAL</span></div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-2rem', right: 0, fontFamily: 'var(--fd)', fontSize: '18vw', color: 'rgba(255,255,255,.015)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }} aria-hidden="true">1988</div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div data-r="right">
              <div className="sec-eye">PRESENTACIÓN</div>
              <h2 className="sec-title" style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>Passione<br /><span style={{ color: 'var(--red)' }}>italiana</span></h2>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w60)', lineHeight: 1.9, marginTop: '1.5rem' }}>El Ferrari Club España es el Club Oficial de Propietarios y Apasionados de Ferrari en España. Fundado en 1988, nació de la pasión compartida por <em>Il Cavallino Rampante</em> entre propietarios de vehículos de la marca.</p>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w60)', lineHeight: 1.9, marginTop: '1rem' }}>En 2006 recibimos el respaldo directo y oficial de Ferrari S.p.A., lo que nos convirtió en el representante oficial de los Owners Clubs de Ferrari en territorio español.</p>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w60)', lineHeight: 1.9, marginTop: '1rem' }}>Nuestra misión es reunir a los propietarios y amantes de Ferrari, organizar eventos exclusivos, fomentar el automovilismo deportivo y mantener viva la llama de la más apasionante marca de automóviles del mundo.</p>
            </div>
            <div data-r="left">
              <Foto id="museo-maranello" className="club-foto" enlace />
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
          <div data-r="up"><div className="sec-eye">NUESTRA HISTORIA</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3.5rem' }}>Línea del<br /><span style={{ color: 'var(--red)' }}>tiempo</span></h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
            <div className="timeline" data-r="right">
              {TIMELINE_LEFT.map((t) => (
                <div className="tl-item" key={t.year}><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-desc">{t.desc}</div></div>
              ))}
            </div>
            <div className="timeline" data-r="left">
              {TIMELINE_RIGHT.map((t) => (
                <div className="tl-item" key={t.year}><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-desc">{t.desc}</div></div>
              ))}
            </div>
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
          <div className="board-grid">
            {BOARD.map((b, i) => (
              <div className="board-card" data-r={i < 3 || i >= 6 ? 'up' : 'scale'} key={b.name + i}><div className="board-avatar">{b.av}</div><div className="board-name">{b.name}</div><div className="board-role">JUNTA DIRECTIVA</div></div>
            ))}
          </div>
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
