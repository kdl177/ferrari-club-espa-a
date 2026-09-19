import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revisa tu email — Ferrari Club España',
  robots: { index: false },
};

export default function RevisaTuEmailPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="login-wrap" style={{ gridTemplateColumns: '1fr' }}>
        <div className="login-panel">
          <a href="/" className="login-brand" style={{ textDecoration: 'none' }}>
            FERRARI CLUB ESPAÑA
            <em>ÁREA PRIVADA DE SOCIOS</em>
          </a>
          <div className="login-card" style={{ textAlign: 'center' }}>
            <h1 className="login-title">Revisa tu<br /><span style={{ color: 'var(--red)' }}>email</span></h1>
            <p className="login-sub">TE HEMOS ENVIADO UN ENLACE DE ACCESO</p>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w60)', lineHeight: 1.9 }}>
              Haz clic en el enlace que acabamos de enviarte para entrar en el área de socios. El enlace caduca en 24 horas.
            </p>
            <div className="login-footer">
              <a href="/socios/">Volver al acceso</a> · <a href="mailto:ferrari@ferrariclubespana.com">Contactar secretaría</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
