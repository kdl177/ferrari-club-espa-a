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

const ETIQUETA_CAT: Record<string, string> = {
  track: 'TRACK DAYS',
  f1: 'FÓRMULA 1',
  rutas: 'RUTAS',
  maranello: 'MARANELLO',
  elegancia: 'ELEGANCIA',
  club: 'CLUB',
  cavalcade: 'CAVALCADE',
};

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
  if (e.pasado) return { clase: '', texto: 'Completado' };
  const libres = e.aforo - e.plazasOcupadas;
  if (libres <= 0) return { clase: ' limited', texto: 'Parrilla completa · lista de espera' };
  if (libres <= Math.max(3, Math.ceil(e.aforo * 0.2))) {
    return { clase: ' limited', texto: libres === 1 ? 'Queda 1 cajón' : `Quedan ${libres} cajones` };
  }
  return { clase: ' open', texto: `${libres} cajones libres` };
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
          const etiqueta = ETIQUETA_CAT[e.categoria] ?? 'EVENTO';
          const [dia, mes = '', anio = ''] = e.fechaLabel.replace(/\./g, '').split(' ').filter((t) => t !== '·');
          const st = estadoDe(e);
          return (
            <article className={`evp-card${e.pasado ? ' past' : ''}`} data-r="up" style={{ transitionDelay: `${(i % 3) * 0.07}s` }} key={e.id}>
              <div className="evp-body">
                <div className="evp-cab">
                  <div className="cajon-f"><b>{dia}</b><small>{mes}</small></div>
                  <div>
                    <span className="evp-date">{etiqueta} · {anio}</span>
                    <h2 className="evp-title">{e.titulo}</h2>
                    <p className="evp-loc">{e.ubicacion}</p>
                  </div>
                </div>
                <p className="evp-desc">{e.descripcion}</p>
                {!e.pasado && e.aforo <= 40 && (
                  <div className="plazas" role="img" aria-label={`${e.plazasOcupadas} de ${e.aforo} plazas ocupadas`}>
                    {Array.from({ length: e.aforo }, (_, n) => (
                      <i key={n} className={n < e.plazasOcupadas ? 'on' : st.clase === ' limited' ? 'libre' : undefined} />
                    ))}
                  </div>
                )}
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
