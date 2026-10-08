import { Fragment } from 'react';

// La Bodoni Moda variable pierde los guiones por encima de un tamaño optico
// de ~30: a tamaño de titular se quedan en blanco. Se les fija uno menor.
export default function Guiones({ children }: { children: string }) {
  return (
    <>
      {children.split(/([-‐-―])/).map((t, i) =>
        i % 2 ? <span className="guion" key={i}>{t}</span> : <Fragment key={i}>{t}</Fragment>
      )}
    </>
  );
}
