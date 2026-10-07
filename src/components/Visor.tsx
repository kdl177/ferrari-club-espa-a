'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Pieza } from '@/lib/galeria';

// Las fotos del archivo son miniaturas de 300px: el visor las muestra a su
// tamaño comodo, no a pantalla completa, o se verian pixeladas.
export default function Visor({ piezas, abierta, onCerrar }: {
  piezas: Pieza[];
  abierta: number | null;
  onCerrar: () => void;
}) {
  // Guarda solo el desplazamiento desde la foto que se abrio: asi el indice
  // sale del prop en cada render y no hace falta sincronizarlo con un efecto.
  const [salto, setSalto] = useState(0);
  const n = piezas.length;
  const i = abierta === null ? 0 : (((abierta + salto) % n) + n) % n;

  const mover = useCallback((paso: number) => setSalto((s) => s + paso), []);

  useEffect(() => {
    if (abierta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    document.addEventListener('keydown', tecla);
    // Sin esto la pagina de detras sigue haciendo scroll bajo el visor.
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = previo;
    };
  }, [abierta, mover, onCerrar]);

  if (abierta === null) return null;
  const p = piezas[i];

  return (
    <div className="visor" role="dialog" aria-modal="true" aria-label="Foto del archivo" onClick={onCerrar}>
      <button className="visor-x" onClick={onCerrar} aria-label="Cerrar">✕</button>
      <button
        className="visor-nav visor-ant"
        onClick={(e) => { e.stopPropagation(); mover(-1); }}
        aria-label="Foto anterior"
      >‹</button>

      <figure className="visor-marco" onClick={(e) => e.stopPropagation()}>
        <div className="visor-lienzo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.alt} />
        </div>
        <figcaption>
          <span className="visor-pie">{p.alt}</span>
          <span className="visor-n">{i + 1} / {piezas.length}</span>
        </figcaption>
      </figure>

      <button
        className="visor-nav visor-sig"
        onClick={(e) => { e.stopPropagation(); mover(1); }}
        aria-label="Foto siguiente"
      >›</button>
    </div>
  );
}
