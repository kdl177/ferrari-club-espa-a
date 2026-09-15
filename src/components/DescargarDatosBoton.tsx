'use client';

import { useState } from 'react';
import { solicitarMisDatos } from '@/app/socios/panel/privacidad/actions';

export default function DescargarDatosBoton() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  async function descargar() {
    setCargando(true);
    setError(null);
    const res = await solicitarMisDatos();
    setCargando(false);

    if (!res.ok || !res.datos) {
      setError(res.error ?? 'No se pudieron recuperar tus datos.');
      return;
    }

    const blob = new Blob([res.datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mis-datos-ferrari-club-espana-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setListo(true);
  }

  return (
    <div>
      <button type="button" className="btn btn-p btn-sm" onClick={descargar} disabled={cargando}>
        {cargando ? 'PREPARANDO...' : 'DESCARGAR MIS DATOS'} {!cargando && <span className="btn-ico">↓</span>}
      </button>
      {listo && <div className="admin-ok">✓ Archivo descargado</div>}
      {error && <div className="alert alert-err" style={{ marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}
