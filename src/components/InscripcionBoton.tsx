'use client';

import { useActionState } from 'react';
import { inscribirseEvento, type InscripcionState } from '@/app/eventos/actions';

const initialState: InscripcionState = { ok: false };

type Props = {
  eventoId: string;
  haySesion: boolean;
  yaInscrito: 'confirmada' | 'lista_espera' | null;
  quedanPlazas: boolean;
};

export default function InscripcionBoton({ eventoId, haySesion, yaInscrito, quedanPlazas }: Props) {
  const [state, formAction, pending] = useActionState(inscribirseEvento, initialState);

  const estadoFinal = state.ok ? state.estado : yaInscrito;

  if (estadoFinal === 'confirmada') {
    return <span className="evp-link" style={{ color: '#4ade80' }}>✓ Inscrito</span>;
  }
  if (estadoFinal === 'lista_espera') {
    return <span className="evp-link" style={{ color: 'var(--w50)' }}>En lista de espera</span>;
  }

  if (!haySesion) {
    return <a href="/socios/" className="evp-link">Acceder para inscribirse →</a>;
  }

  return (
    <form action={formAction} style={{ display: 'inline' }}>
      <input type="hidden" name="eventoId" value={eventoId} />
      <button
        type="submit"
        className="evp-link"
        disabled={pending}
        style={{ background: 'none', border: 'none', cursor: pending ? 'default' : 'pointer', padding: 0, font: 'inherit' }}
      >
        {pending ? 'Enviando...' : quedanPlazas ? 'Inscribirme →' : 'Apuntarme a lista de espera →'}
      </button>
      {state.error && (
        <span style={{ display: 'block', marginTop: '.4rem', fontSize: '.68rem', color: 'var(--red-g)' }}>{state.error}</span>
      )}
    </form>
  );
}
