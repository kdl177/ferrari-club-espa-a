import type { Metadata } from 'next';
import Link from 'next/link';
import HalftoneImage from '@/components/HalftoneImage';
import LoginForm from '@/components/LoginForm';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Acceso Socios — Ferrari Club España',
  description: 'Área privada de socios del Ferrari Club España. Accede con tu usuario y contraseña.',
  alternates: { canonical: '/socios' },
};

const AREA_CARDS = [
  { label: 'EVENTOS', title: 'Inscripción', accent: true },
  { label: 'REVISTA', title: 'Digital', accent: false },
  { label: 'DIRECTORIO', title: 'Socios', accent: false },
  { label: 'PERFIL', title: 'Mi cuenta', accent: true },
];

export default async function SociosPage() {
  // La sesion dura 30 dias, pero esta es la pagina a la que lleva el boton
  // "Area Socios" de la cabecera: sin esto, un socio ya dentro veia otra vez
  // el formulario y parecia que la sesion se habia cerrado.
  const session = await auth();
  if (session?.user?.email) redirect('/socios/panel');

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="login-wrap">
        <div className="login-panel">
          <Link href="/" className="login-brand" style={{ textDecoration: 'none' }}>
            FERRARI CLUB ESPAÑA
            <em>ÁREA PRIVADA DE SOCIOS</em>
          </Link>
          <div className="login-card">
            <h1 className="login-title">Acceso<br /><span style={{ color: 'var(--red)' }}>socios</span></h1>
            <p className="login-sub">INTRODUCE TUS CREDENCIALES DE SOCIO</p>
            <LoginForm />
            <div className="login-divider" style={{ margin: '2rem 0' }}><span>¿AÚN NO ERES SOCIO?</span></div>
            <a href="/club/hazte-socio/" className="btn btn-o" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>HAZTE SOCIO DEL CLUB <span className="btn-ico">→</span></a>
            <div className="login-footer">
              <a href="/contacta/">¿Problemas de acceso?</a> · <a href="mailto:ferrari@ferrariclubespana.com">Contactar secretaría</a>
            </div>
          </div>
        </div>

        <div className="login-visual" aria-hidden="true">
          <HalftoneImage className="login-ht" src="/fotos/interior-california.webp" alt="" cell={6} intensity={0.55} side="right" position="50% 50%" dim={0.3} />
          <p className="foto-credito login-credito">Foto: andy_carter · CC BY 2.0 · adaptada</p>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem', pointerEvents: 'none' }}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '.65rem', letterSpacing: '.3em', color: 'rgba(218,41,28,.5)', textAlign: 'center' }}>ÁREA EXCLUSIVA</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '.15em', color: 'rgba(255,255,255,.08)', textAlign: 'center', textTransform: 'uppercase' }}>SÓLO SOCIOS</div>
            <div style={{ width: '60px', height: '1px', background: 'rgba(218,41,28,.3)' }} />
            <div style={{ maxWidth: '320px', textAlign: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {AREA_CARDS.map((c) => (
                  <div key={c.label} style={{ padding: '1.25rem 1rem', border: `1px solid ${c.accent ? 'rgba(218,41,28,.12)' : 'rgba(255,255,255,.06)'}`, background: 'rgba(0,0,0,.4)' }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '.55rem', color: c.accent ? 'rgba(218,41,28,.4)' : 'rgba(255,255,255,.2)', letterSpacing: '.15em', marginBottom: '.4rem' }}>{c.label}</div>
                    <div style={{ fontFamily: 'var(--fh)', fontSize: '.75rem', color: 'rgba(255,255,255,.3)' }}>{c.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
