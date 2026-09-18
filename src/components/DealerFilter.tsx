'use client';

import { useEffect, useMemo, useState } from 'react';
import { distanciaKm } from '@/lib/geo';

const REGIONS = [
  { key: 'all', label: 'TODOS' },
  { key: 'madrid', label: 'MADRID' },
  { key: 'cataluna', label: 'CATALUÑA' },
  { key: 'andalucia', label: 'ANDALUCÍA' },
  { key: 'pais-vasco', label: 'PAÍS VASCO' },
  { key: 'levante', label: 'LEVANTE' },
];

export type Dealer = {
  region: string;
  city: string;
  name: string;
  addr: string;
  tel: string;
  telFmt: string;
  hours: string;
  coord: string;
  lat: number;
  lng: number;
  bg: string;
};

type EstadoGeo = 'inactivo' | 'buscando' | 'concedido' | 'denegado';

export default function DealerFilter({ dealers }: { dealers: Dealer[] }) {
  const [active, setActive] = useState('all');
  const [estadoGeo, setEstadoGeo] = useState<EstadoGeo>('inactivo');
  const [posicion, setPosicion] = useState<{ lat: number; lng: number } | null>(null);

  function pedirUbicacion() {
    if (!('geolocation' in navigator)) {
      setEstadoGeo('denegado');
      return;
    }
    setEstadoGeo('buscando');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosicion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setEstadoGeo('concedido');
      },
      () => setEstadoGeo('denegado'),
      { timeout: 8000, maximumAge: 300000 }
    );
  }

  // Con la ubicacion concedida, la distancia importa mas que el filtro
  // manual de region: mostramos todo, ordenado por cercania real.
  useEffect(() => {
    if (estadoGeo === 'concedido') setActive('all');
  }, [estadoGeo]);

  const conDistancia = useMemo(() => {
    if (!posicion) return dealers.map((d) => ({ ...d, distanciaKm: null as number | null }));
    return dealers
      .map((d) => ({ ...d, distanciaKm: distanciaKm(posicion.lat, posicion.lng, d.lat, d.lng) }))
      .sort((a, b) => a.distanciaKm - b.distanciaKm);
  }, [dealers, posicion]);

  const visible = estadoGeo === 'concedido'
    ? conDistancia
    : conDistancia.filter((d) => active === 'all' || d.region === active);

  return (
    <>
      <div className="geo-bar" data-r="up">
        {estadoGeo === 'concedido' ? (
          <span className="geo-activo">
            📍 Ordenado por cercanía a tu ubicación
          </span>
        ) : (
          <button type="button" className="geo-btn" onClick={pedirUbicacion} disabled={estadoGeo === 'buscando'}>
            {estadoGeo === 'buscando' ? 'Localizando…' : '📍 Ver el más cercano a mí'}
          </button>
        )}
        {estadoGeo === 'denegado' && (
          <span className="geo-nota">No se pudo acceder a tu ubicación. Filtra por región abajo.</span>
        )}
      </div>

      {estadoGeo !== 'concedido' && (
        <div className="region-filter" data-r="up">
          {REGIONS.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`filter-btn${active === r.key ? ' on' : ''}`}
              onClick={() => setActive(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div className="dealer-grid">
        {visible.map((d) => (
          <div className="dealer-card" data-r="up" key={d.name}>
            <div className="dealer-map">
              <svg width="100%" height="100%" viewBox="0 0 320 160" aria-hidden="true">
                <rect width="100%" height="100%" fill={d.bg} />
                <circle cx="160" cy="80" r="35" fill="rgba(218,41,28,.06)" stroke="rgba(218,41,28,.1)" strokeWidth="1" />
                <circle cx="160" cy="80" r="5" fill="rgba(218,41,28,.4)" />
                <line x1="160" y1="0" x2="160" y2="160" stroke="rgba(218,41,28,.05)" />
                <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(218,41,28,.05)" />
                <text x="160" y="135" fontFamily="Archivo" fontSize="8" fill="rgba(218,41,28,.25)" textAnchor="middle" letterSpacing="2">{d.coord}</text>
              </svg>
              {d.distanciaKm !== null && (
                <span className="dealer-distancia">{formatDistancia(d.distanciaKm)}</span>
              )}
            </div>
            <div className="dealer-body">
              <div className="dealer-city">{d.city}</div>
              <div className="dealer-name">{d.name}</div>
              <div className="dealer-info">
                <div className="dealer-row"><span className="dealer-ico">◎</span>{d.addr}</div>
                <div className="dealer-row"><span className="dealer-ico">☎</span><a href={`tel:${d.tel}`} className="dealer-tel">{d.telFmt}</a></div>
                <div className="dealer-row"><span className="dealer-ico">◷</span>{d.hours}</div>
              </div>
              <a href="https://www.ferrari.com/es-ES/dealers" target="_blank" rel="noopener" className="btn btn-o btn-sm">VER EN FERRARI.COM ↗</a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function formatDistancia(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
