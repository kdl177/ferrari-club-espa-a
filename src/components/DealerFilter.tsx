'use client';

import { useEffect, useMemo, useState } from 'react';
import { distanciaKm } from '@/lib/geo';

const REGIONS = [
  { key: 'all', label: 'TODOS' },
  { key: 'madrid', label: 'MADRID' },
  { key: 'cataluna', label: 'CATALUÑA' },
  { key: 'levante', label: 'LEVANTE' },
  { key: 'andalucia', label: 'ANDALUCÍA' },
];

export type Dealer = {
  region: string;
  city: string;
  name: string;
  addr: string;
  tel: string;
  telFmt: string;
  hours: string;
  lat: number;
  lng: number;
  web: string;
};

type EstadoGeo = 'inactivo' | 'buscando' | 'concedido' | 'denegado';

function mapaEmbebido(lat: number, lng: number) {
  const dx = 0.012;
  const dy = 0.0065;
  const bbox = [lng - dx, lat - dy, lng + dx, lat + dy].map((n) => n.toFixed(5)).join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

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
            Ordenado por cercanía a tu ubicación
          </span>
        ) : (
          <button type="button" className="geo-btn" onClick={pedirUbicacion} disabled={estadoGeo === 'buscando'}>
            {estadoGeo === 'buscando' ? 'Localizando…' : 'Ver el más cercano a mí'}
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
              {/* El iframe va inerte: un mapa embebido secuestra la rueda del raton
                  al pasar por encima. Toda la superficie abre el mapa grande. */}
              <iframe src={mapaEmbebido(d.lat, d.lng)} title={`Mapa de ${d.name}, ${d.city}`} loading="lazy" tabIndex={-1} />
              <a
                className="dealer-map-link"
                href={`https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lng}#map=17/${d.lat}/${d.lng}`}
                target="_blank"
                rel="noopener"
                aria-label={`Abrir el mapa de ${d.name} en OpenStreetMap`}
              />
              <span className="foto-credito dealer-map-credito">
                © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>
              </span>
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
              <div className="dealer-acciones">
                <a href={d.web} target="_blank" rel="noopener" className="btn btn-o btn-sm">WEB OFICIAL ↗</a>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`} target="_blank" rel="noopener" className="dealer-como">CÓMO LLEGAR ↗</a>
              </div>
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
