import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Acceso Socios — Ferrari Club España',
  description: 'Área privada de socios del Ferrari Club España. Accede con tu usuario y contraseña.',
  alternates: { canonical: '/socios/' },
};

const AREA_CARDS = [
  { label: 'EVENTOS', title: 'Inscripción', accent: true },
  { label: 'REVISTA', title: 'Digital', accent: false },
  { label: 'DIRECTORIO', title: 'Socios', accent: false },
  { label: 'PERFIL', title: 'Mi cuenta', accent: true },
];

export default function SociosPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="login-wrap">
        <div className="login-panel">
          <a href="/" className="login-brand" style={{ textDecoration: 'none' }}>
            FERRARI CLUB ESPAÑA
            <em>ÁREA PRIVADA DE SOCIOS</em>
          </a>
          <div className="login-card">
            <h1 className="login-title">Acceso<br /><span style={{ color: 'var(--red)' }}>Socios</span></h1>
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
          <svg width="100%" height="100%" viewBox="0 0 760 900" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
            <defs>
              <radialGradient id="lg" cx="50%" cy="45%" r="65%"><stop offset="0%" stopColor="#1a0000" /><stop offset="100%" stopColor="#040404" /></radialGradient>
              <radialGradient id="lg2" cx="50%" cy="50%" r="35%"><stop offset="0%" stopColor="#330000" stopOpacity=".4" /><stop offset="100%" stopColor="transparent" stopOpacity="0" /></radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#lg)" />
            <rect width="100%" height="100%" fill="url(#lg2)" />
            <g stroke="rgba(204,0,0,.04)" fill="none" strokeWidth=".8">
              <line x1="0" y1="150" x2="760" y2="150" /><line x1="0" y1="300" x2="760" y2="300" />
              <line x1="0" y1="450" x2="760" y2="450" /><line x1="0" y1="600" x2="760" y2="600" />
              <line x1="0" y1="750" x2="760" y2="750" />
              <line x1="190" y1="0" x2="190" y2="900" /><line x1="380" y1="0" x2="380" y2="900" /><line x1="570" y1="0" x2="570" y2="900" />
            </g>
            <text x="380" y="480" fontFamily="Orbitron,sans-serif" fontSize="160" fill="rgba(204,0,0,.06)" textAnchor="middle" letterSpacing="5" transform="rotate(-15 380 450)">F</text>
            <text x="380" y="380" fontFamily="Orbitron,sans-serif" fontSize="18" fill="rgba(255,255,255,.08)" textAnchor="middle" letterSpacing="8">ÁREA PRIVADA DE SOCIOS</text>
            <g opacity=".25" fill="none">
              <rect x="60" y="580" width="180" height="100" stroke="rgba(204,0,0,.3)" rx="2" />
              <rect x="260" y="580" width="180" height="100" stroke="rgba(255,255,255,.1)" rx="2" />
              <rect x="460" y="580" width="220" height="100" stroke="rgba(204,0,0,.15)" rx="2" />
              <rect x="60" y="700" width="180" height="100" stroke="rgba(255,255,255,.08)" rx="2" />
              <rect x="260" y="700" width="180" height="100" stroke="rgba(204,0,0,.2)" rx="2" />
            </g>
            <text x="380" y="850" fontFamily="Orbitron,sans-serif" fontSize="10" fill="rgba(255,255,255,.08)" textAnchor="middle" letterSpacing="4">FERRARI CLUB ESPAÑA · EST. 1988</text>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem', pointerEvents: 'none' }}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '.65rem', letterSpacing: '.3em', color: 'rgba(204,0,0,.5)', textAlign: 'center' }}>ÁREA EXCLUSIVA</div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '.15em', color: 'rgba(255,255,255,.08)', textAlign: 'center', textTransform: 'uppercase' }}>SÓLO SOCIOS</div>
            <div style={{ width: '60px', height: '1px', background: 'rgba(204,0,0,.3)' }} />
            <div style={{ maxWidth: '320px', textAlign: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {AREA_CARDS.map((c) => (
                  <div key={c.label} style={{ padding: '1.25rem 1rem', border: `1px solid ${c.accent ? 'rgba(204,0,0,.12)' : 'rgba(255,255,255,.06)'}`, background: 'rgba(0,0,0,.4)' }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '.55rem', color: c.accent ? 'rgba(204,0,0,.4)' : 'rgba(255,255,255,.2)', letterSpacing: '.15em', marginBottom: '.4rem' }}>{c.label}</div>
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
