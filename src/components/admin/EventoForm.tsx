'use client';

import { useActionState } from 'react';
import { guardarEvento, type AdminState } from '@/app/socios/admin/actions';

const initialState: AdminState = { ok: false };

const CATEGORIAS = ['track', 'rutas', 'f1', 'maranello', 'cavalcade', 'elegancia', 'club'];

type EventoEditable = {
  id: string;
  titulo: string;
  categoria: string;
  fecha: string;
  ubicacion: string;
  descripcion: string;
  aforo: number;
};

export default function EventoForm({ evento }: { evento?: EventoEditable }) {
  const [state, formAction, pending] = useActionState(guardarEvento, initialState);
  const editando = !!evento;

  return (
    <form action={formAction} className="admin-form">
      {editando && <input type="hidden" name="id" value={evento.id} />}

      <div className="admin-form-row">
        <label className="admin-campo">
          <span className="form-label">TÍTULO *</span>
          <input className="form-input" name="titulo" defaultValue={evento?.titulo} placeholder="Track Day Circuito de Jerez" />
        </label>
        <label className="admin-campo admin-campo-corto">
          <span className="form-label">CATEGORÍA *</span>
          <select className="form-input" name="categoria" defaultValue={evento?.categoria ?? 'track'}>
            {CATEGORIAS.map((c) => <option key={c} value={c} style={{ background: '#0a0a0a' }}>{c}</option>)}
          </select>
        </label>
      </div>

      <div className="admin-form-row">
        <label className="admin-campo">
          <span className="form-label">FECHA Y HORA *</span>
          <input className="form-input" type="datetime-local" name="fecha" defaultValue={evento?.fecha} />
        </label>
        <label className="admin-campo admin-campo-corto">
          <span className="form-label">AFORO *</span>
          <input className="form-input" type="number" name="aforo" min={1} defaultValue={evento?.aforo ?? 20} />
        </label>
      </div>

      <label className="admin-campo">
        <span className="form-label">UBICACIÓN *</span>
        <input className="form-input" name="ubicacion" defaultValue={evento?.ubicacion} placeholder="Circuito Jerez-Ángel Nieto, Cádiz" />
      </label>

      <label className="admin-campo">
        <span className="form-label">DESCRIPCIÓN *</span>
        <textarea className="form-input" name="descripcion" rows={3} defaultValue={evento?.descripcion} style={{ resize: 'vertical' }} />
      </label>

      {state.error && <div className="alert alert-err">{state.error}</div>}
      {state.ok && <div className="admin-ok">✓ Guardado</div>}

      <button type="submit" className="btn btn-p btn-sm" disabled={pending}>
        {pending ? 'GUARDANDO...' : editando ? 'GUARDAR CAMBIOS' : 'CREAR EVENTO'}
      </button>
    </form>
  );
}
