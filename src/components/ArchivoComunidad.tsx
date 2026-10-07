'use client';

import { useState } from 'react';
import type { Pieza } from '@/lib/galeria';
import Visor from '@/components/Visor';

export default function ArchivoComunidad({ piezas }: { piezas: Pieza[] }) {
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <>
      <div className="com-archivo">
        {piezas.map((p, i) => (
          <figure className="com-archivo-pieza" key={p.src}>
            <button className="mz-abrir" onClick={() => setAbierta(i)} aria-label={`Ver más grande: ${p.alt}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
            </button>
          </figure>
        ))}
      </div>

      {/* La key reinicia el visor al abrir otra foto: sin ella arrastraria el
          desplazamiento de la vez anterior. */}
      <Visor key={abierta} piezas={piezas} abierta={abierta} onCerrar={() => setAbierta(null)} />
    </>
  );
}
