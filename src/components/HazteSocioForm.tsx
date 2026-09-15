'use client';

import { useActionState, useEffect, useState } from 'react';
import { crearSolicitudSocio, type SolicitudSocioState } from '@/app/club/hazte-socio/actions';

const initialState: SolicitudSocioState = { ok: false };

const PLANES = [
  { value: 'base', label: 'Socio Base — cuota anual' },
  { value: 'activo', label: 'Socio Activo — plena participación' },
  { value: 'familiar', label: 'Socio Familiar — cuota familiar' },
];

export default function HazteSocioForm() {
  const [state, formAction, pending] = useActionState(crearSolicitudSocio, initialState);
  const [plan, setPlan] = useState('activo');
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.ok || !state.socioId) return;

    setRedirecting(true);
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ socioId: state.socioId, plan }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setCheckoutError(data.error || 'No se pudo iniciar el pago. Contacta con secretaría.');
          setRedirecting(false);
        }
      })
      .catch(() => {
        setCheckoutError('No se pudo iniciar el pago. Contacta con secretaría.');
        setRedirecting(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok, state.socioId]);

  if (state.ok) {
    return (
      <div className="form-success show">
        <strong style={{ color: 'var(--white)', display: 'block', marginBottom: '.75rem', fontFamily: 'var(--fh)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          ✓ Solicitud recibida
        </strong>
        <span style={{ display: 'block', marginBottom: '.5rem' }}>
          {redirecting
            ? 'Te llevamos a la pasarela de pago para completar la cuota de socio...'
            : checkoutError || 'Redirigiendo al pago...'}
        </span>
        {checkoutError && (
          <a href="/contacta/?asunto=hacerse-socio" style={{ color: 'var(--red)', fontSize: '.82rem' }}>Contactar con secretaría →</a>
        )}
      </div>
    );
  }

  return (
    <form action={formAction}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="nombre">NOMBRE *</label>
          <input className="form-input" type="text" id="nombre" name="nombre" placeholder="Tu nombre" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="apellidos">APELLIDOS *</label>
          <input className="form-input" type="text" id="apellidos" name="apellidos" placeholder="Tus apellidos" required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="email">EMAIL *</label>
          <input className="form-input" type="email" id="email" name="email" placeholder="tu@email.com" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="telefono">TELÉFONO</label>
          <input className="form-input" type="tel" id="telefono" name="telefono" placeholder="+34 600 000 000" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="ferrariModelo">MODELO FERRARI *</label>
        <input className="form-input" type="text" id="ferrariModelo" name="ferrariModelo" placeholder="Ej: Ferrari 488 GTB (2018)" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="plan">TIPO DE MEMBRESÍA *</label>
        <select className="form-input" id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} style={{ cursor: 'pointer', color: 'var(--white)' }}>
          {PLANES.map((p) => (
            <option key={p.value} value={p.value} style={{ background: '#0a0a0a' }}>{p.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '.9rem', alignItems: 'flex-start', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--w08)', background: 'var(--w03)' }}>
        <input type="checkbox" id="privacidad-socio" name="privacidad" style={{ accentColor: 'var(--red)', flexShrink: 0, width: 22, height: 22, marginTop: '.2rem', cursor: 'pointer' }} />
        <label htmlFor="privacidad-socio" style={{ fontFamily: 'var(--fm)', fontSize: '.88rem', color: 'var(--w70)', lineHeight: 1.8, cursor: 'pointer' }}>
          Acepto la <a href="/privacidad/" style={{ color: 'var(--red)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Política de Privacidad</a> y el tratamiento de mis datos para gestionar mi alta como socio.
        </label>
      </div>
      {state.error && <div className="alert alert-err" style={{ marginBottom: '1rem' }}>{state.error}</div>}
      <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} disabled={pending} data-mag>
        {pending ? 'ENVIANDO SOLICITUD...' : 'CONTINUAR AL PAGO'} {!pending && <span className="btn-ico">→</span>}
      </button>
    </form>
  );
}
