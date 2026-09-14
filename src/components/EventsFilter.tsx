'use client';

import { useState } from 'react';
import InscripcionBoton from './InscripcionBoton';

const CATS = [
  { key: 'all', label: 'TODOS' },
  { key: 'track', label: 'TRACK DAYS' },
  { key: 'rutas', label: 'RUTAS' },
  { key: 'f1', label: 'FÓRMULA 1' },
  { key: 'maranello', label: 'MARANELLO' },
  { key: 'cavalcade', label: 'CAVALCADE' },
  { key: 'elegancia', label: 'ELEGANCIA' },
];

const ESTILO_CAT: Record<string, { tag: string; tagClass: string; label: string; bg0: string; bg1: string }> = {
  track: { tag: 'TRACK DAYS', tagClass: '', label: 'TRACK', bg0: '#2a0000', bg1: '#080000' },
  f1: { tag: 'FÓRMULA 1', tagClass: '', label: 'F1', bg0: '#1a0000', bg1: '#050505' },
  rutas: { tag: 'RUTAS', tagClass: 'neutral', label: 'RUTA', bg0: '#141414', bg1: '#060606' },
  maranello: { tag: 'MARANELLO', tagClass: '', label: 'MARANELLO', bg0: '#1a0000', bg1: '#080000' },
  elegancia: { tag: 'ELEGANCIA', tagClass: 'neutral', label: 'Elegancia', bg0: '#0f0f0f', bg1: '#050505' },
  club: { tag: 'CLUB', tagClass: '', label: 'GALA 2026', bg0: '#1a0000', bg1: '#060606' },
  cavalcade: { tag: 'CAVALCADE', tagClass: 'premium', label: 'CAVALCADE', bg0: '#120000', bg1: '#050505' },
};

const ESTILO_FALLBACK = { tag: 'EVENTO', tagClass: 'neutral', label: 'FERRARI', bg0: '#141414', bg1: '#060606' };

export type EventItem = {
  id: string;
  categoria: string;
  titulo: string;
  fechaLabel: string;
  ubicacion: string;
  descripcion: string;
  aforo: number;
  plazasOcupadas: number;
  pasado: boolean;
  miInscripcion: 'confirmada' | 'lista_espera' | null;
};

function estadoDe(e: EventItem) {
  if (e.pasado) return { clase: '', texto: '— Completado', dot: '' };
  const libres = e.aforo - e.plazasOcupadas;
  if (libres <= 0) return { clase: ' limited', texto: '● Completo — lista de espera', dot: ' limited' };
  if (libres <= Math.max(3, Math.ceil(e.aforo * 0.2))) {
    return { clase: ' limited', texto: `● Últimas ${libres} plazas`, dot: ' limited' };
  }
  return { clase: ' open', texto: `● ${libres} plazas disponibles`, dot: ' open' };
}

export default function EventsFilter({ events, haySesion }: { events: EventItem[]; haySesion: boolean }) {
  const [active, setActive] = useState('all');
  const visible = events.filter((e) => active === 'all' || e.categoria === active);

  return (
    <>
      <div className="filters" data-r="up">
        {CATS.map((c) => (
          <button key={c.key} type="button" className={`filter-btn${active === c.key ? ' on' : ''}`} onClick={() => setActive(c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="evp-grid">
        {visible.map((e, i) => {
          const estilo = ESTILO_CAT[e.categoria] ?? ESTILO_FALLBACK;
          const st = estadoDe(e);
          return (
            <article className={`evp-card${e.pasado ? ' past' : ''}`} data-r="up" style={{ transitionDelay: `${(i % 3) * 0.07}s` }} key={e.id}>
              <div className="evp-thumb">
                <svg width="100%" height="100%" viewBox="0 0 620 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <defs><radialGradient id={`eg${i}`} cx="50%" cy="50%" r="68%"><stop offset="0%" stopColor={estilo.bg0} /><stop offset="100%" stopColor={estilo.bg1} /></radialGradient></defs>
                  <rect width="100%" height="100%" fill={`url(#eg${i})`} />
                  <text x="50%" y="55%" fontFamily={e.categoria === 'elegancia' ? 'Italiana' : 'Orbitron'} fontSize={estilo.label.length > 6 ? 34 : 60} fill="rgba(204,0,0,.07)" textAnchor="middle" letterSpacing="3" dominantBaseline="middle">{estilo.label}</text>
                </svg>
                <div className="evp-cat-row">
                  <span className={`evp-cat-tag${estilo.tagClass ? ' ' + estilo.tagClass : ''}`}>{estilo.tag}</span>
                  <span className={`evp-status-dot${st.dot}`} aria-hidden="true" />
                </div>
              </div>
              <div className="evp-body">
                <div className="evp-date">{e.fechaLabel}</div>
                <h2 className="evp-title">{e.titulo}</h2>
                <p className="evp-loc">📍 {e.ubicacion}</p>
                <p className="evp-desc">{e.descripcion}</p>
                <div className="evp-foot">
                  {e.pasado ? (
                    <>
                      <span className="evp-status" style={{ color: 'var(--w30)' }}>{st.texto}</span>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', color: 'var(--w30)', letterSpacing: '.08em' }}>{e.fechaLabel}</span>
                    </>
                  ) : (
                    <>
                      <span className={`evp-status${st.clase}`}>{st.texto}</span>
                      <InscripcionBoton
                        eventoId={e.id}
                        haySesion={haySesion}
                        yaInscrito={e.miInscripcion}
                        quedanPlazas={e.aforo - e.plazasOcupadas > 0}
                      />
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
