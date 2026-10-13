'use client';

import { useState } from 'react';
import Image from 'next/image';
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
              <Image src={p.src} alt={p.alt} width={320} height={320} sizes="(max-width: 480px) 33vw, (max-width: 720px) 25vw, 17vw" quality={60} />
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
