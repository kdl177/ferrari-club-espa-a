'use client';

import { useActionState } from 'react';
import { guardarNoticia, type AdminState } from '@/app/socios/admin/actions';

const initialState: AdminState = { ok: false };

const CATEGORIAS = ['FÓRMULA 1', 'ENDURANCE', 'MODELOS', 'CLUB', 'HISTORIA', 'MOTORSPORT'];

type NoticiaEditable = {
  id: string;
  titulo: string;
  categoria: string;
  cuerpo: string;
  portada: string;
  publicada: boolean;
};

export default function NoticiaForm({ noticia }: { noticia?: NoticiaEditable }) {
  const [state, formAction, pending] = useActionState(guardarNoticia, initialState);
  const editando = !!noticia;

  return (
    <form action={formAction} className="admin-form">
      {editando && <input type="hidden" name="id" value={noticia.id} />}

      <div className="admin-form-row">
        <label className="admin-campo">
          <span className="form-label">TÍTULO *</span>
          <input className="form-input" name="titulo" defaultValue={noticia?.titulo} placeholder="Ferrari 499P domina en Monza" />
        </label>
        <label className="admin-campo admin-campo-corto">
          <span className="form-label">CATEGORÍA *</span>
          <select className="form-input" name="categoria" defaultValue={noticia?.categoria ?? 'CLUB'}>
            {CATEGORIAS.map((c) => <option key={c} value={c} style={{ background: '#0a0a0a' }}>{c}</option>)}
          </select>
        </label>
      </div>

      <label className="admin-campo">
        <span className="form-label">IMAGEN DE PORTADA (URL)</span>
        <input className="form-input" name="portada" defaultValue={noticia?.portada} placeholder="https://..." />
      </label>

      <label className="admin-campo">
        <span className="form-label">CUERPO *</span>
        <textarea className="form-input" name="cuerpo" rows={8} defaultValue={noticia?.cuerpo} style={{ resize: 'vertical' }} placeholder="Texto del artículo..." />
      </label>

      <label className="admin-check">
        <input type="checkbox" name="publicar" defaultChecked={noticia?.publicada} />
        <span>Publicar (visible en la web pública)</span>
      </label>

      {state.error && <div className="alert alert-err">{state.error}</div>}
      {state.ok && <div className="admin-ok">✓ Guardado</div>}

      <button type="submit" className="btn btn-p btn-sm" disabled={pending}>
        {pending ? 'GUARDANDO...' : editando ? 'GUARDAR CAMBIOS' : 'CREAR NOTICIA'}
      </button>
    </form>
  );
}
