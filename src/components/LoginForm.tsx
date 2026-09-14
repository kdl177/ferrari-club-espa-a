'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Introduce un email válido.');
      return;
    }
    setError(null);
    setSending(true);
    await signIn('resend', { email, redirectTo: '/socios/panel/' });
  }

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <div className="form-group">
        <label className="form-label" htmlFor="email">EMAIL DE SOCIO</label>
        <input
          className="form-input"
          type="email"
          id="email"
          name="email"
          placeholder="email@ejemplo.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <p style={{ fontFamily: 'var(--fm)', fontSize: '.78rem', color: 'var(--w60)', lineHeight: 1.7 }}>
        Te enviaremos un enlace de acceso a tu email. Sin contraseñas.
      </p>
      <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} disabled={sending} data-mag>
        {sending ? 'ENVIANDO ENLACE...' : 'RECIBIR ENLACE DE ACCESO'} {!sending && <span className="btn-ico">→</span>}
      </button>
      {error && (
        <div className="alert alert-err">{error}</div>
      )}
      <div className="login-footer">
        <a href="mailto:ferrari@ferrariclubespana.com?subject=Recuperaci%C3%B3n%20de%20acceso%20socios">¿Problemas con tu email?</a>
      </div>
    </form>
  );
}
