'use client';

import { useEffect, useRef, useState } from 'react';

const STAGES = [
  { id: 't0', label: 'MOTOR', dots: '···········' },
  { id: 't1', label: 'PISTA', dots: '············' },
  { id: 't2', label: 'CLUB', dots: '··············' },
  { id: 't3', label: 'SOCIOS', dots: '··········' },
  { id: 't4', label: 'EXPERIENCIA', dots: '·····' },
];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [skip, setSkip] = useState(true);
  const [ready, setReady] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [pct, setPct] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const done = sessionStorage.getItem('pre-done');
    if (done) {
      setVisible(false);
      onDone();
      return;
    }
    setSkip(false);

    const timers: number[] = [];
    STAGES.forEach((s, i) => {
      const d = 180 * (i + 1);
      timers.push(
        window.setTimeout(() => {
          setLoading((prev) => new Set(prev).add(s.id));
          timers.push(
            window.setTimeout(() => {
              setReady((prev) => new Set(prev).add(s.id));
            }, 200)
          );
        }, d)
      );
    });

    const t0 = performance.now();
    let raf = 0;
    function tick(now: number) {
      const p = Math.min((now - t0) / 1400, 1);
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (barRef.current) {
        barRef.current.style.boxShadow = '0 0 50px var(--red),0 0 100px var(--red-10)';
      }
      window.setTimeout(() => {
        sessionStorage.setItem('pre-done', '1');
        setVisible(false);
        onDone();
      }, 300);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skip || !visible) return null;

  return (
    <div id="pre" role="status" aria-live="polite">
      <video id="pre-video" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/ferrari-intro.mp4" type="video/mp4" />
      </video>
      <div id="pre-ov" aria-hidden="true" />
      <div className="pre-brand">FERRARI CLUB ESPAÑA</div>
      <div className="pre-sub">CLUB OFICIAL — DESDE 1988</div>
      <div className="pre-term" aria-hidden="true">
        {STAGES.map((s) => (
          <div className="pre-tl" key={s.id}>
            <span className="pre-tk">{s.label}</span>
            <span className={`pre-ts${ready.has(s.id) ? ' ok' : ''}`} id={s.id}>
              {ready.has(s.id) ? 'READY ·' : loading.has(s.id) ? 'LOADING...' : `${s.dots} STANDBY`}
            </span>
          </div>
        ))}
      </div>
      <div className="pre-bw" aria-hidden="true">
        <div className="pre-bar" ref={barRef} id="pb" style={{ width: `${pct}%` }} />
      </div>
      <div className="pre-pct" id="pp" aria-hidden="true">{pct}</div>
      <div className="pre-coord" aria-hidden="true">40.4168° N · 3.7038° O — MADRID</div>
    </div>
  );
}
