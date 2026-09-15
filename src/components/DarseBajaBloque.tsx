'use client';

import { useActionState, useState } from 'react';
import { solicitarBaja, type BajaState } from '@/app/socios/panel/privacidad/actions';

const initialState: BajaState = { ok: false };

export default function DarseBajaBloque({
  email,
  suscripcionActiva,
}: {
  email: string;
  suscripcionActiva: boolean;
}) {
  const [state, formAction, pending] = useActionState(solicitarBaja, initialState);
  const [abierto, setAbierto] = useState(false);

  if (suscripcionActiva) {
    return (
      <div className="alert alert-err">
        Tienes una suscripción activa. Para evitar cobros pendientes, cancélala antes de
        solicitar la baja:{' '}
        <a href="/contacta/?asunto=info-general" style={{ color: 'var(--red)', textDecoration: 'underline' }}>
          contacta con secretaría
        </a>
        .
      </div>
    );
  }

  if (!abierto) {
    return (
      <button type="button" className="btn-baja" onClick={() => setAbierto(true)}>
        Solicitar baja y eliminación de mis datos
      </button>
    );
  }

  return (
    <form action={formAction} className="admin-confirmar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
      <span className="admin-confirmar-texto">
        Para confirmar, escribe tu email <strong style={{ color: 'var(--white)' }}>{email}</strong>:
      </span>
      <input
        className="form-input"
        name="confirmacion"
        placeholder={email}
        autoComplete="off"
      />
      {state.error && <div className="alert alert-err">{state.error}</div>}
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
        <button type="submit" className="admin-btn-borrar confirmar" disabled={pending}>
          {pending ? 'Procesando...' : 'Confirmar baja definitiva'}
        </button>
        <button type="button" className="admin-btn-mini" onClick={() => setAbierto(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
