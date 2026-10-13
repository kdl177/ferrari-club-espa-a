'use client';

import { useActionState } from 'react';
import { enviarPresupuesto, type PresupuestoState } from '@/app/solicita-presupuesto/actions';
import { CAMPOS } from '@/lib/presupuesto';

const LARGOS = new Set(['extras', 'coberturas', 'observaciones']);
const FECHAS = new Set(['nacimiento', 'carnet', 'primeraMatriculacion']);
const TIPO: Record<string, string> = { email: 'email', telefono: 'tel' };

export default function PresupuestoForm() {
  const [state, formAction, pending] = useActionState<PresupuestoState, FormData>(enviarPresupuesto, { ok: false });

  if (state.ok) {
    return (
      <div className="form-success show" role="status">
        <strong style={{ color: 'var(--white)', display: 'block', marginBottom: '.75rem', fontFamily: 'var(--fh)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Solicitud enviada
        </strong>
        <span>Hemos recibido tu solicitud de presupuesto. Gracias.</span>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {CAMPOS.map((b) => (
        <fieldset key={b.bloque} className="pres-bloque">
          <legend className="sec-eye">{b.bloque.toUpperCase()}</legend>
          <div className="pres-campos">
            {b.campos.map(([n, etiqueta, obligatorio]) => (
              <div className={`form-group${LARGOS.has(n) ? ' pres-largo' : ''}`} key={n}>
                <label className="form-label" htmlFor={`p-${n}`}>{etiqueta.toUpperCase()}{obligatorio ? ' *' : ''}</label>
                {LARGOS.has(n) ? (
                  <textarea className="form-input" id={`p-${n}`} name={n} rows={3} style={{ resize: 'vertical' }} />
                ) : (
                  <input className="form-input" id={`p-${n}`} name={n} type={FECHAS.has(n) ? 'date' : TIPO[n] ?? 'text'} required={obligatorio} />
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      {[
        ['condiciones', <>He leído y acepto las <a href="/condiciones-de-venta/" className="priv-a">condiciones de venta</a></>],
        ['privacidad', <>He leído y acepto la <a href="/privacidad/" className="priv-a">política de privacidad</a></>],
      ].map(([n, texto]) => (
        <label key={n as string} className="pres-check">
          <input type="checkbox" name={n as string} required />
          <span>{texto}</span>
        </label>
      ))}

      {state.error && <div className="alert alert-err" style={{ margin: '1rem 0' }}>{state.error}</div>}
      <button type="submit" className="btn btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }} disabled={pending}>
        {pending ? 'ENVIANDO...' : 'SOLICITAR PRESUPUESTO'} {!pending && <span className="btn-ico">→</span>}
      </button>
    </form>
  );
}
