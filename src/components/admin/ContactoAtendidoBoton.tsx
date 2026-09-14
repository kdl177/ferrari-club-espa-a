'use client';

import { useActionState } from 'react';
import { marcarContactoAtendido, type AdminState } from '@/app/socios/admin/actions';

const initialState: AdminState = { ok: false };

export default function ContactoAtendidoBoton({ id, atendido }: { id: string; atendido: boolean }) {
  const [state, formAction, pending] = useActionState(marcarContactoAtendido, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="atendido" value={atendido ? 'false' : 'true'} />
      <button type="submit" className={`admin-btn-mini${atendido ? ' hecho' : ''}`} disabled={pending}>
        {pending ? '...' : atendido ? '✓ Atendido' : 'Marcar atendido'}
      </button>
      {state.error && <span className="admin-error-mini">{state.error}</span>}
    </form>
  );
}
