import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import FaqItem from '@/components/FaqItem';
import HazteSocioForm from '@/components/HazteSocioForm';

export const metadata: Metadata = {
  title: 'Hazte Socio — Ferrari Club España',
  description: 'Únete al Club Oficial de Ferrari en España. Información sobre cómo hacerse socio del Ferrari Club España.',
  alternates: { canonical: '/club/hazte-socio/' },
};

const BENEFITS = [
  { title: 'Acceso a Track Days', desc: 'Participa en nuestras jornadas exclusivas en los mejores circuitos de España con tu Ferrari.' },
  { title: 'Rutas por España', desc: 'Rutas organizadas por carreteras únicas de la península ibérica junto con otros socios.' },
  { title: 'F1 y Grandes Premios', desc: 'Acceso prioritario a entradas y áreas especiales en los Grandes Premios de Fórmula 1.' },
  { title: 'Visitas a Maranello', desc: 'Viajes oficiales a la fábrica Ferrari: talleres, museo, pista Fiorano y zonas exclusivas.' },
  { title: 'Carnet y Credencial', desc: 'Carnet oficial de socio del Ferrari Club España con validez internacional en otros clubs Ferrari.' },
  { title: 'Revista del Club', desc: 'Publicaciones periódicas con noticias, reportajes y información exclusiva del mundo Ferrari.' },
  { title: 'Red de Socios', desc: 'Acceso a la comunidad de más de 200 socios apasionados de Ferrari en toda España.' },
  { title: 'Descuentos y Ventajas', desc: 'Acuerdos con concesionarios oficiales y empresas del sector para descuentos exclusivos.' },
  { title: 'Eventos Internacionales', desc: 'Participación en las grandes concentraciones internacionales de Ferrari: Cavalcade, XX Programme.' },
];

const REQUIREMENTS = [
  { n: '01', title: 'Propietario de Ferrari', desc: 'Es imprescindible ser propietario actual de un vehículo de la marca Ferrari para poder ser socio del club.' },
  { n: '02', title: 'Solicitud de Ingreso', desc: 'Contacta con la secretaría del club para recibir la documentación necesaria. Puedes escribirnos o llamarnos directamente.' },
  { n: '03', title: 'Documentación del Vehículo', desc: 'Adjunta copia del permiso de circulación del Ferrari del que eres propietario.' },
  { n: '04', title: 'Cuota de Ingreso', desc: 'Abono de la cuota anual de socio. Contacta con nosotros para conocer las cuotas vigentes.' },
  { n: '05', title: 'Aprobación por la Junta', desc: 'La Junta Directiva estudia cada solicitud y comunica la resolución en un plazo de 30 días.' },
];

const FAQS = [
  { q: '¿Puedo ser socio si tengo Ferrari en leasing?', a: 'Sí, en caso de leasing o renting podrás ser socio siempre que seas el usuario habitual del vehículo. Contacta con nosotros para estudiar tu caso particular.' },
  { q: '¿Cuál es la cuota anual?', a: 'Las cuotas se actualizan anualmente. Contacta con nuestra secretaría para conocer la cuota vigente y las formas de pago disponibles.' },
  { q: '¿La membresía es válida en otros países?', a: 'Al ser un club oficial Ferrari, tu carnet de socio es reconocido por todos los clubs Ferrari Owners Club del mundo, lo que te da acceso a sus eventos y actividades.' },
  { q: '¿Cuánto tarda el proceso de ingreso?', a: 'Una vez recibida la solicitud completa y la documentación, la Junta Directiva estudia tu caso en un plazo máximo de 30 días y te comunica la resolución por escrito.' },
];

export default function HazteSocioPage() {
  return (
    <>
      <section className="socio-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Club', href: '/club/' }, { label: 'Hazte Socio' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">MEMBRESÍA</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">HAZTE<br /><span style={{ color: 'var(--red)' }}>SOCIO</span></h1>
          <p className="sec-sub" style={{ maxWidth: '560px', marginTop: '1.5rem' }} data-r="up">Únete al único club oficial de Ferrari en España y comparte tu pasión por <em>Il Cavallino Rampante</em> con más de 200 socios.</p>
        </div>
        <div style={{ position: 'absolute', bottom: '-3rem', right: 0, fontFamily: 'var(--fd)', fontSize: '18vw', color: 'rgba(255,255,255,.015)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }} aria-hidden="true">CFE</div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up"><div className="sec-eye">VENTAJAS DE SER SOCIO</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: 0, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>BENEFICIOS<br /><span style={{ color: 'var(--red)' }}>EXCLUSIVOS</span></h2></div>
          <div className="benefit-grid">
            {BENEFITS.map((b, i) => (
              <div className="ben-item" data-r={i < 3 || i >= 6 ? 'up' : 'scale'} key={b.title}><div className="ben-title">{b.title}</div><div className="ben-desc">{b.desc}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--black)', padding: '6rem 0' }}>
        <div className="cnt">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
            <div data-r="right">
              <div className="sec-eye">CÓMO HACERSE SOCIO</div>
              <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '2.5rem', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>REQUISITOS<br /><span style={{ color: 'var(--red)' }}>& PROCESO</span></h2>
              {REQUIREMENTS.map((r, i) => (
                <div className="req-item" style={i === REQUIREMENTS.length - 1 ? { borderBottom: 'none' } : undefined} key={r.n}>
                  <div className="req-n">{r.n}</div>
                  <div><div className="req-content-title">{r.title}</div><div className="req-content-desc">{r.desc}</div></div>
                </div>
              ))}
              <p style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: 'var(--w60)', marginTop: '2.5rem', lineHeight: 1.8 }}>
                ¿Prefieres hablar antes con nosotros? <a href="/contacta/?asunto=hacerse-socio" style={{ color: 'var(--red)' }}>Contacta con secretaría</a>.
              </p>
            </div>
            <div data-r="left">
              <div style={{ position: 'relative', padding: '3rem', border: '1px solid var(--w08)', background: 'var(--b90)', height: '100%' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--red)', boxShadow: '0 0 12px var(--red)' }} />
                <div className="sec-eye" style={{ marginBottom: '2rem' }}>SOLICITUD DE INGRESO</div>
                <HazteSocioForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up"><div className="sec-eye">PREGUNTAS FRECUENTES</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>FAQ</h2></div>
          <div style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} question={f.q} answer={f.a} last={i === FAQS.length - 1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
