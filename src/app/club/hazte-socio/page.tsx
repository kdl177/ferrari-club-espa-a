import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import FondoHero from '@/components/FondoHero';
import FaqItem from '@/components/FaqItem';
import HazteSocioForm from '@/components/HazteSocioForm';
import { BENEFITS, REQUIREMENTS, FAQS } from '@/lib/socio';

export const metadata: Metadata = {
  title: 'Hazte Socio — Ferrari Club España',
  description: 'Únete al Club Oficial de Ferrari en España. Información sobre cómo hacerse socio del Ferrari Club España.',
  alternates: { canonical: '/club/hazte-socio/' },
};


export default function HazteSocioPage() {
  return (
    <>
      <section className="socio-hero">
        <FondoHero nombre="spider-488" alt="Un Ferrari 488 Spider rojo rodando con el techo abierto por una carretera entre árboles" />
        <div className="cnt" style={{ position: 'relative', zIndex: 2 }}>
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Club', href: '/club/' }, { label: 'Hazte Socio' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">MEMBRESÍA</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginTop: '.75rem' }} data-r="up">Hazte<br /><span style={{ color: 'var(--red)' }}>socio</span></h1>
          <p className="sec-sub" style={{ maxWidth: '560px', marginTop: '1.5rem' }} data-r="up">Únete al único club oficial de Ferrari en España y comparte tu pasión por <em>Il Cavallino Rampante</em> con más de 200 socios.</p>
        </div>
        <div style={{ position: 'absolute', bottom: '-3rem', right: 0, fontFamily: 'var(--fd)', fontSize: '18vw', color: 'rgba(255,255,255,.015)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }} aria-hidden="true">CFE</div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up"><div className="sec-eye">VENTAJAS DE SER SOCIO</div><h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: 0, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>Beneficios<br /><span style={{ color: 'var(--red)' }}>exclusivos</span></h2></div>
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
              <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '2.5rem', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>Requisitos<br /><span style={{ color: 'var(--red)' }}>& proceso</span></h2>
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
