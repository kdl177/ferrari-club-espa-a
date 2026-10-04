import type { Pieza } from '@/lib/galeria';

export default function Mosaico({ piezas, hero, eager }: { piezas: Pieza[]; hero?: boolean; eager?: boolean }) {
  // A 3 columnas una seccion con un numero impar de piezas deja un hueco al
  // final; se marca para que su primera pieza ancha ocupe dos celdas.
  const impar = piezas.length % 3 !== 0;
  return (
    <div className={hero ? 'mosaico-hero' : `mosaico${impar ? ' mosaico-impar' : ''}`}>
      {piezas.map((p, i) => (
        <figure
          key={p.src}
          className={`mz-pieza${p.forma === 'ancha' ? ' es-ancha' : ''}${p.forma === 'alta' ? ' es-alta' : ''}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.src}
            alt={p.alt}
            loading={eager && i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}
