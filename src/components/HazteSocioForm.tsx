'use client';

import { useActionState } from 'react';
import { crearSolicitudSocio, type SolicitudSocioState } from '@/app/club/hazte-socio/actions';

const initialState: SolicitudSocioState = { ok: false };

export default function HazteSocioForm() {
  const [state, formAction, pending] = useActionState(crearSolicitudSocio, initialState);

  if (state.ok) {
    return (
      <div className="form-success show" role="status">
        <strong style={{ color: 'var(--white)', display: 'block', marginBottom: '.75rem', fontFamily: 'var(--fh)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Solicitud recibida
        </strong>
        <span style={{ display: 'block' }}>
          Gracias. La secretaría del club se pondrá en contacto contigo para explicarte la cuota y completar el alta.
        </span>
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
      <div style={{ display: 'flex', gap: '.9rem', alignItems: 'flex-start', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--w08)', background: 'var(--w03)' }}>
        <input type="checkbox" id="privacidad-socio" name="privacidad" style={{ accentColor: 'var(--red)', flexShrink: 0, width: 22, height: 22, marginTop: '.2rem', cursor: 'pointer' }} />
        <label htmlFor="privacidad-socio" style={{ fontFamily: 'var(--fm)', fontSize: '.88rem', color: 'var(--w70)', lineHeight: 1.8, cursor: 'pointer' }}>
          Acepto la <a href="/privacidad/" style={{ color: 'var(--red)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Política de Privacidad</a> y el tratamiento de mis datos para gestionar mi alta como socio.
        </label>
      </div>
      {state.error && <div className="alert alert-err" style={{ marginBottom: '1rem' }}>{state.error}</div>}
      <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} disabled={pending} data-mag>
        {pending ? 'ENVIANDO SOLICITUD...' : 'ENVIAR SOLICITUD'} {!pending && <span className="btn-ico">→</span>}
      </button>
    </form>
  );
}
