'use client';

import { useEffect, useRef, useState } from 'react';

type Article = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
  cat: string;
  catLabel: string;
  source: string;
};

const CATS = [
  { key: 'all', label: 'TODAS' },
  { key: 'f1', label: 'FÓRMULA 1' },
  { key: 'wec', label: 'ENDURANCE' },
  { key: 'modelos', label: 'MODELOS' },
  { key: 'motorsport', label: 'MOTORSPORT' },
  { key: 'club', label: 'CLUB' },
];

const REFRESH_MS = 10 * 60 * 1000;
const PAGE_SIZE = 12;
const LABELS: Record<string, string> = { f1: 'FORMULA 1', wec: 'ENDURANCE', modelos: 'FERRARI', motorsport: 'MOTORSPORT', club: 'CLUB' };

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `Hace ${diffH}h`;
    if (diffH < 48) return 'Ayer';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
  } catch {
    return '';
  }
}

function Placeholder({ cat }: { cat: string }) {
  const label = LABELS[cat] || 'FERRARI';
  const sz = label.length > 8 ? 20 : 28;
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="300" height="180" fill="#0A0A0A" />
      <rect width="300" height="2" y="179" fill="rgba(218,41,28,.4)" />
      <text x="150" y="96" fontFamily="Archivo,sans-serif" fontSize={sz} fill="rgba(218,41,28,.12)" textAnchor="middle" letterSpacing="4">{label}</text>
      <circle cx="150" cy="90" r="42" stroke="rgba(196,154,60,.07)" fill="none" strokeWidth="1" />
    </svg>
  );
}

export default function LiveNewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [ts, setTs] = useState('');
  const [cat, setCat] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [errMsg, setErrMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadNews() {
    setStatus('loading');
    try {
      const r = await fetch('/api/noticias');
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || 'Feed error');
      setArticles(data.articles || []);
      setVisible(PAGE_SIZE);
      setTs(data.updatedAt ? 'Actualizado ahora' : '');
      setStatus('live');
    } catch (e) {
      setStatus('error');
      setErrMsg(e instanceof Error ? e.message : 'Comprueba tu conexión e inténtalo de nuevo.');
    }
  }

  useEffect(() => {
    loadNews();
    timerRef.current = setInterval(loadNews, REFRESH_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = cat === 'all' ? articles : articles.filter((a) => a.cat === cat);
  const slice = filtered.slice(0, visible);

  return (
    <>
      <div className="live-bar">
        <span className={`live-dot ${status}`}>{status === 'loading' ? 'CARGANDO' : status === 'live' ? 'EN VIVO' : 'ERROR'}</span>
        <span className="live-ts">{ts}</span>
        <button type="button" className="refresh-btn" onClick={loadNews}>↻ ACTUALIZAR</button>
        {articles.length > 0 && <span className="live-count">{slice.length} / {filtered.length} artículos</span>}
      </div>

      <div className="filters" role="group" aria-label="Filtrar noticias">
        {CATS.map((c) => (
          <button key={c.key} type="button" className={`filter-btn${cat === c.key ? ' on' : ''}`} onClick={() => { setCat(c.key); setVisible(PAGE_SIZE); }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="live-grid" aria-live="polite" aria-label="Noticias en vivo">
        {status === 'loading' && !articles.length &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div className="skel-card" key={i}>
              <div className="skel-img" />
              <div className="skel-body">
                <div className="skel-line" style={{ height: 8, width: '40%' }} />
                <div className="skel-line" style={{ height: 14, width: '90%' }} />
                <div className="skel-line" style={{ height: 14, width: '75%' }} />
                <div className="skel-line" style={{ height: 9, width: '55%', marginTop: '.4rem' }} />
              </div>
            </div>
          ))}

        {status === 'error' && !articles.length && (
          <div className="error-state">
            <p style={{ fontSize: '1.1rem', color: 'var(--white)', fontFamily: 'var(--fh)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.75rem' }}>No se pudieron cargar las noticias</p>
            <p>{errMsg}</p>
            <button className="retry-btn" onClick={loadNews}>↻ Reintentar</button>
          </div>
        )}

        {!!articles.length && !filtered.length && (
          <div className="empty-state">
            No hay artículos en esta categoría.<br />
            <span style={{ color: 'var(--w50)', fontSize: '.8rem' }}>Prueba con otra categoría o espera la próxima actualización.</span>
          </div>
        )}

        {slice.map((a, i) => (
          <a
            key={a.link + i}
            className={`live-nc${i === 0 && cat === 'all' ? ' featured' : ''}`}
            href={a.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="live-nc-img">
              {a.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.thumbnail} alt={a.title} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <Placeholder cat={a.cat} />
              )}
            </div>
            <div className="live-nc-body">
              <div className="live-nc-meta">
                <span className="news-card-cat">{a.catLabel}</span>
                {a.source && <span className="live-source">{a.source}</span>}
              </div>
              <h3 className="live-nc-title">{a.title}</h3>
              {a.description && <p className="live-nc-desc">{a.description}</p>}
              <div className="live-nc-date">
                <span>{a.pubDate ? fmtDate(a.pubDate) : ''}</span>
                <span className="live-ext">LEER ↗</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="load-more-wrap">
          <button type="button" className="btn btn-o" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            VER MÁS NOTICIAS <span className="btn-ico">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
