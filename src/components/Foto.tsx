import { FOTOS, type FotoId } from '@/lib/fotos';

// `enlace` solo fuera de tarjetas enlazadas: un <a> dentro de otro <a> es HTML
// invalido y rompe la hidratacion. El original queda enlazado en el articulo.
export default function Foto({ id, className, eager, mini, enlace }: { id: FotoId; className?: string; eager?: boolean; mini?: boolean; enlace?: boolean }) {
  const f = FOTOS[id];
  const credito = `Foto: ${f.autor} · ${f.licencia} · adaptada`;
  return (
    <figure className={`foto${mini ? ' foto-mini' : ''}${className ? ` ${className}` : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={f.src} alt={f.alt} title={mini ? credito : undefined} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {!mini && (
        <figcaption className="foto-credito">
          {enlace ? <>Foto: <a href={f.url} target="_blank" rel="noopener">{f.autor}</a> · {f.licencia} · adaptada</> : credito}
        </figcaption>
      )}
    </figure>
  );
}
