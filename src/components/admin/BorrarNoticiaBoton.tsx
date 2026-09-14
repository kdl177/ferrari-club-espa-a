'use client';

import { useActionState, useState } from 'react';
import { borrarNoticia, type AdminState } from '@/app/socios/admin/actions';

const initialState: AdminState = { ok: false };

export default function BorrarNoticiaBoton({ id, titulo }: { id: string; titulo: string }) {
  const [state, formAction, pending] = useActionState(borrarNoticia, initialState);
  const [confirmando, setConfirmando] = useState(false);

  if (!confirmando) {
    return (
      <button type="button" className="admin-btn-borrar" onClick={() => setConfirmando(true)}>
        Eliminar noticia
      </button>
    );
  }

  return (
    <form action={formAction} className="admin-confirmar">
      <input type="hidden" name="id" value={id} />
      <span className="admin-confirmar-texto">¿Eliminar «{titulo}»? No se puede deshacer.</span>
      <button type="submit" className="admin-btn-borrar confirmar" disabled={pending}>
        {pending ? 'Eliminando...' : 'Sí, eliminar'}
      </button>
      <button type="button" className="admin-btn-mini" onClick={() => setConfirmando(false)}>
        Cancelar
      </button>
      {state.error && <span className="admin-error-mini">{state.error}</span>}
    </form>
  );
}
