import type { Pieza } from '@/lib/galeria';

export default function Mosaico({ piezas, hero, eager }: { piezas: Pieza[]; hero?: boolean; eager?: boolean }) {
  return (
    <div className={hero ? 'mosaico-hero' : 'mosaico'}>
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
