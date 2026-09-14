'use client';

import { useActionState, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { enviarContacto, type ContactoState } from '@/app/contacta/actions';

const initialState: ContactoState = { ok: false };

export default function ContactForm() {
  const params = useSearchParams();
  const [state, formAction, pending] = useActionState(enviarContacto, initialState);
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const a = params.get('asunto');
    const evento = params.get('evento');
    if (a) setAsunto(a);
    if (evento) setMensaje((prev) => prev || `Quisiera reservar para el evento: ${evento}`);
  }, [params]);

  if (state.ok) {
    return (
      <div className="form-success show">
        <strong style={{ color: 'var(--white)', display: 'block', marginBottom: '.75rem', fontFamily: 'var(--fh)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>✓ Mensaje enviado correctamente</strong>
        <span style={{ display: 'block', marginBottom: '.5rem' }}>Nos pondremos en contacto contigo en un plazo de 24-48 horas laborables.</span>
        <span style={{ color: 'var(--red)', fontSize: '.82rem' }}>Ferrari Club España · Calle Constancia 41 · 28002 Madrid</span>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="nombre">NOMBRE *</label>
          <input className="form-input" type="text" id="nombre" name="nombre" placeholder="Tu nombre" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="apellidos">APELLIDOS *</label>
          <input className="form-input" type="text" id="apellidos" name="apellidos" placeholder="Tus apellidos" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="cemail">EMAIL *</label>
          <input className="form-input" type="email" id="cemail" name="email" placeholder="tu@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="telefono">TELÉFONO</label>
          <input className="form-input" type="tel" id="telefono" name="telefono" placeholder="+34 600 000 000" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="asunto">ASUNTO *</label>
        <select className="form-input" id="asunto" name="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} style={{ cursor: 'pointer', color: 'var(--white)' }}>
          <option value="">Selecciona el asunto</option>
          <option value="info-general">Información general</option>
          <option value="hacerse-socio">Hacerme socio del club</option>
          <option value="eventos">Inscripción a eventos</option>
          <option value="patrocinio">Patrocinio y colaboraciones</option>
          <option value="prensa">Prensa / Media</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="ferrari">MODELO FERRARI (si eres propietario)</label>
        <input className="form-input" type="text" id="ferrari" name="ferrariModelo" placeholder="Ej: Ferrari 488 GTB (2018)" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="mensaje">MENSAJE *</label>
        <textarea className="form-input" id="mensaje" name="mensaje" rows={6} value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe tu mensaje aquí..." style={{ resize: 'vertical', minHeight: '140px' }} />
      </div>
      <div style={{ display: 'flex', gap: '.9rem', alignItems: 'flex-start', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--w08)', background: 'var(--w03)' }}>
        <input type="checkbox" id="privacidad" name="privacidad" style={{ accentColor: 'var(--red)', flexShrink: 0, width: 22, height: 22, marginTop: '.2rem', cursor: 'pointer' }} />
        <label htmlFor="privacidad" style={{ fontFamily: 'var(--fm)', fontSize: '.88rem', color: 'var(--w70)', lineHeight: 1.8, cursor: 'pointer' }}>
          Acepto la <a href="/privacidad/" style={{ color: 'var(--red)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Política de Privacidad</a> y el tratamiento de mis datos para responder a mi consulta.
        </label>
      </div>
      {state.error && <div className="alert alert-err" style={{ marginBottom: '1rem' }}>{state.error}</div>}
      <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} disabled={pending} data-mag>
        {pending ? 'ENVIANDO...' : 'ENVIAR MENSAJE'} {!pending && <span className="btn-ico">→</span>}
      </button>
    </form>
  );
}
