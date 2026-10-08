import Link from 'next/link';
import Image from 'next/image';
import { fechaLarga, type Noticia } from '@/lib/noticias';

function enlacePagina(n: number) {
  return n === 1 ? '/noticias/' : `/noticias/pagina/${n}/`;
}

export default function NoticiasLista({ noticias, pagina, total }: { noticias: Noticia[]; pagina: number; total: number }) {
  const desde = Math.max(1, Math.min(pagina - 2, total - 4));
  const numeros = Array.from({ length: Math.min(5, total) }, (_, i) => desde + i);

  return (
    <>
      <div className="live-grid">
        {noticias.map((n, i) => (
          <Link key={n.ruta} className={`live-nc${i === 0 && pagina === 1 ? ' featured' : ''}`} href={n.ruta}>
            <div className="live-nc-img">
              {n.portada && (
                <Image
                  src={n.portada}
                  alt=""
                  fill
                  sizes={i === 0 && pagina === 1 ? '(max-width: 760px) 100vw, 66vw' : '(max-width: 760px) 100vw, 33vw'}
                  quality={60}
                  unoptimized={!n.portada.startsWith('/')}
                  {...(i < 3 ? { loading: 'eager' as const, fetchPriority: i === 0 ? ('high' as const) : 'auto' } : {})}
                />
              )}
            </div>
            <div className="live-nc-body">
              <div className="live-nc-meta">
                <span className="news-card-cat">{n.categoria.toUpperCase()}</span>
              </div>
              <h2 className="live-nc-title">{n.titulo}</h2>
              {n.subtitulo && <p className="live-nc-desc">{n.subtitulo}</p>}
              <div className="live-nc-date">
                <time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time>
                <span className="live-ext">LEER →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {total > 1 && (
        <nav className="paginas" aria-label="Páginas de noticias">
          {pagina > 1 && <Link href={enlacePagina(pagina - 1)} className="pag" rel="prev">← Anteriores</Link>}
          {numeros.map((n) =>
            n === pagina ? (
              <span key={n} className="pag on" aria-current="page">{n}</span>
            ) : (
              <Link key={n} href={enlacePagina(n)} className="pag">{n}</Link>
            )
          )}
          {pagina < total && <Link href={enlacePagina(pagina + 1)} className="pag" rel="next">Siguientes →</Link>}
          <span className="pag-total">Página {pagina} de {total}</span>
        </nav>
      )}
    </>
  );
}
