import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import revista from '@/content/revista.json';
import { deArchivo } from '@/lib/sitio';

export const metadata: Metadata = {
  title: 'Revista Ferrari Club — Números atrasados · Ferrari Club España',
  description: `La revista del Ferrari Club España: ${revista.length} números, del ${revista.at(-1)?.numero} (${revista.at(-1)?.temporada}) al ${revista[0]?.numero} (${revista[0]?.temporada}), para leer en PDF.`,
  alternates: { canonical: '/revista/' },
};

export default function RevistaPage() {
  const ultimo = revista[0];
  const porAnio = new Map<string, typeof revista>();
  for (const r of revista.slice(1)) {
    const anio = r.temporada.match(/\d{4}/)?.[0] ?? '';
    porAnio.set(anio, [...(porAnio.get(anio) ?? []), r]);
  }

  return (
    <>
      <section className="page-hero">
        <div className="cnt revista-cab">
          <div>
            <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Club', href: '/club/' }, { label: 'Revista' }]} />
            <p className="sec-eye" style={{ marginTop: '1.5rem' }}>REVISTA DEL CLUB</p>
            <h1 className="sec-title" style={{ marginTop: '.75rem' }}>Ferrari<br /><span style={{ color: 'var(--red)' }}>Club</span></h1>
            <p className="sec-sub" style={{ marginTop: '1.25rem', maxWidth: '460px' }}>
              La revista del Ferrari Club España. {revista.length} números desde {revista.at(-1)?.temporada.toLowerCase()}, completos y en PDF.
            </p>
            <a href={deArchivo(ultimo.pdf)} className="btn btn-p" style={{ marginTop: '2rem' }} target="_blank" rel="noopener">
              LEER EL NÚMERO {ultimo.numero} <span className="btn-ico">↗</span>
            </a>
          </div>
          <a href={deArchivo(ultimo.pdf)} className="revista-ultimo" target="_blank" rel="noopener" aria-label={`Número ${ultimo.numero}, ${ultimo.temporada} (PDF)`}>
            <Image src={`/revista/${ultimo.numero}.webp`} alt={`Portada del número ${ultimo.numero}`} width={ultimo.ancho} height={ultimo.alto} priority sizes="(max-width: 760px) 70vw, 340px" />
            <span>Nº {ultimo.numero} · {ultimo.temporada.toUpperCase()}</span>
          </a>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '4rem 0 6rem' }}>
        <div className="cnt">
          {[...porAnio].map(([anio, numeros]) => (
            <div key={anio} className="revista-anio">
              <h2 className="revista-anio-t">{anio}</h2>
              <div className="revista-grid">
                {numeros.map((r) => (
                  <a key={r.numero} href={deArchivo(r.pdf)} className="revista-num" target="_blank" rel="noopener">
                    <Image src={`/revista/${r.numero}.webp`} alt={`Portada del número ${r.numero}`} width={r.ancho} height={r.alto} sizes="(max-width: 600px) 45vw, 200px" />
                    <span className="revista-n">Nº {r.numero}</span>
                    <span className="revista-t">{r.temporada}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
