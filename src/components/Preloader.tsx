'use client';

import { useEffect, useRef, useState } from 'react';

// Mosaico fijo al borde derecho, como en el hero: [x%, y%, tamaño px, retardo ms]
const BLOCKS: Array<[number, number, number, number, boolean?]> = [
  [93, 4, 52, 0], [96.5, 4, 52, 60], [90, 12, 52, 120], [96.5, 18, 52, 40],
  [93, 26, 52, 200], [96.5, 30, 52, 90], [88, 38, 52, 260], [96.5, 42, 52, 150],
  [93, 50, 52, 320], [96.5, 56, 52, 30], [91, 64, 52, 380], [96.5, 70, 52, 210],
  [94, 78, 52, 440], [96.5, 86, 52, 110], [90, 90, 52, 500],
  [81, 18, 52, 360, true], [79, 66, 52, 480, true],
];

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
      <div className="pre-blocks" aria-hidden="true">
        {BLOCKS.map(([x, y, s, d, wide], i) => (
          <span
            key={i}
            className="pre-blk"
            data-wide={wide || undefined}
            style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${d + 500}ms` }}
          />
        ))}
      </div>
      <div className="pre-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-principal.svg" alt="Ferrari Club España" width={232} height={64} />
      </div>
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
