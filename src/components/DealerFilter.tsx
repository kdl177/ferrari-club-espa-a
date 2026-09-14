'use client';

import { useState } from 'react';

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
  bg: string;
};

export default function DealerFilter({ dealers }: { dealers: Dealer[] }) {
  const [active, setActive] = useState('all');
  const visible = dealers.filter((d) => active === 'all' || d.region === active);

  return (
    <>
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
      <div className="dealer-grid">
        {visible.map((d) => (
          <div className="dealer-card" data-r="up" key={d.name}>
            <div className="dealer-map">
              <svg width="100%" height="100%" viewBox="0 0 320 160" aria-hidden="true">
                <rect width="100%" height="100%" fill={d.bg} />
                <circle cx="160" cy="80" r="35" fill="rgba(204,0,0,.06)" stroke="rgba(204,0,0,.1)" strokeWidth="1" />
                <circle cx="160" cy="80" r="5" fill="rgba(204,0,0,.4)" />
                <line x1="160" y1="0" x2="160" y2="160" stroke="rgba(204,0,0,.05)" />
                <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(204,0,0,.05)" />
                <text x="160" y="135" fontFamily="Orbitron" fontSize="8" fill="rgba(204,0,0,.25)" textAnchor="middle" letterSpacing="2">{d.coord}</text>
              </svg>
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
