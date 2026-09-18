'use client';

import { useEffect, useRef, useState } from 'react';

type Side = 'left' | 'right';

type Props = {
  src: string;
  alt: string;
  intensity?: number;
  cell?: number;
  redBlocks?: boolean;
  side?: Side;
  position?: string;
  focus?: [number, number];
  dim?: number;
  priority?: boolean;
  className?: string;
};

type Block = { x: number; y: number; s: number; d: number; jx: number; jy: number };

const BLACK = '#0A0A0A';
const WHITE = '#F2F0EB';
const RED = '#DA291C';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(s: string, w: number, h: number) {
  let n = w * 31 + h;
  for (let i = 0; i < s.length; i++) n = (n * 33 + s.charCodeAt(i)) >>> 0;
  return n;
}

function parsePosition(pos: string): [number, number] {
  const [x = '50%', y = '50%'] = pos.split(/\s+/);
  const toF = (v: string) => Math.min(1, Math.max(0, parseFloat(v) / 100));
  return [toF(x), toF(y)];
}

function paint(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  o: { w: number; h: number; cell: number; intensity: number; dim: number; side: Side; edge: boolean; pos: [number, number]; mobile: boolean; seed: number }
) {
  const { w, h, cell, intensity, dim, side, edge, pos, mobile, seed } = o;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (w * h * dpr * dpr > 9e6) dpr = Math.max(1, Math.sqrt(9e6 / (w * h)));
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const off = document.createElement('canvas');
  off.width = cols;
  off.height = rows;
  const octx = off.getContext('2d', { willReadFrequently: true });
  if (!octx) return false;
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = 'high';
  const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
  const sw = cols / scale;
  const sh = rows / scale;
  octx.drawImage(img, (img.naturalWidth - sw) * pos[0], (img.naturalHeight - sh) * pos[1], sw, sh, 0, 0, cols, rows);
  const data = octx.getImageData(0, 0, cols, rows).data;

  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, w, h);

  const k = 1 + intensity * 3;
  const maxR = cell * 0.58 * (1 - dim);
  const fadeBand = edge ? w * 0.28 : 0;
  const path = new Path2D();
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const p = (j * cols + i) * 4;
      const lum = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
      let l = Math.min(1, Math.max(0, (lum - 0.5) * k + 0.5));
      if (fadeBand) {
        const cx = (i + 0.5) * cell;
        const dist = side === 'left' ? cx : w - cx;
        if (dist < fadeBand) {
          const t = dist / fadeBand;
          l *= t * t * (3 - 2 * t);
        }
      }
      const r = l * maxR;
      if (r < 0.35) continue;
      const x = (i + 0.5) * cell;
      const y = (j + 0.5) * cell;
      path.moveTo(x + r, y);
      path.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  ctx.fillStyle = WHITE;
  ctx.fill(path);

  if (edge) {
    const rnd = mulberry32(seed ^ 0x9e3779b9);
    const band = Math.min(w * 0.2, 200);
    const fromEdge = (t: number) => (side === 'left' ? t * band : w - t * band);
    ctx.fillStyle = RED;
    const lines = mobile ? 7 : 14;
    for (let n = 0; n < lines; n++) {
      const t = rnd() ** 2;
      const x = Math.round(fromEdge(t));
      const len = h * (0.12 + rnd() * 0.5);
      const y = rnd() * (h - len);
      ctx.fillRect(x, y, 1, len);
    }
    const dots = mobile ? 30 : 70;
    for (let n = 0; n < dots; n++) {
      const t = rnd() ** 1.6;
      const s = 1 + Math.round(rnd() * 2);
      ctx.fillRect(Math.round(fromEdge(t)), Math.round(rnd() * h), s, s);
    }
  }
  return true;
}

function makeBlocks(w: number, h: number, side: Side, focus: [number, number], mobile: boolean, seed: number): Block[] {
  const rnd = mulberry32(seed);
  const B = mobile ? 40 : 52;
  const cols = Math.ceil(w / B);
  const rows = Math.ceil(h / B);
  const zone = Math.max(2, Math.round(cols * 0.22));
  const density = mobile ? 0.3 : 0.5;
  const out: Block[] = [];
  const push = (i: number, j: number) => {
    const j2 = rnd() < 0.2;
    out.push({
      x: i * B,
      y: j * B,
      s: B,
      d: Math.round(rnd() * 600),
      jx: j2 ? (rnd() < 0.5 ? -B : B) : 0,
      jy: j2 && rnd() < 0.4 ? (rnd() < 0.5 ? -B : B) : 0,
    });
  };
  // El pico de densidad cae dentro, no en el borde: una columna llena pegada
  // al canto lee como barra de color, no como trama rota.
  for (let j = 0; j < rows; j++) {
    for (let c = 0; c < zone; c++) {
      const t = c / zone;
      const p = Math.sin(Math.min(1, t * 1.45) * Math.PI) ** 1.4 * density;
      if (rnd() < p) push(side === 'left' ? c : cols - 1 - c, j);
    }
  }
  const fi = Math.round(focus[0] * cols);
  const fj = Math.round(focus[1] * rows);
  const stray = mobile ? 2 : 5;
  for (let n = 0; n < stray; n++) {
    const i = fi + Math.round((rnd() - 0.5) * 6);
    const j = fj + Math.round((rnd() - 0.5) * 5);
    if (i >= 0 && i < cols && j >= 0 && j < rows) push(i, j);
  }
  return out;
}

export default function HalftoneImage({
  src,
  alt,
  intensity = 0.6,
  cell = 6,
  redBlocks = true,
  side = 'right',
  position = '50% 50%',
  focus = [0.5, 0.5],
  dim = 0,
  priority = false,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [armed, setArmed] = useState(priority);
  const [visible, setVisible] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [fallback, setFallback] = useState(false);
  const sizeRef = useRef('');

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setArmed(true);
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setArmed(true);
          if (e.intersectionRatio > 0) setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: [0, 0.01] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !img || !canvas) return;
    let cancelled = false;
    let timer = 0;

    async function ready() {
      if (!img) return;
      if (!(img.complete && img.naturalWidth)) {
        await new Promise<void>((res, rej) => {
          img.addEventListener('load', () => res(), { once: true });
          img.addEventListener('error', () => rej(new Error('img')), { once: true });
        });
      }
      await img.decode().catch(() => {});
    }

    function render() {
      if (cancelled || !wrap || !img || !canvas) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const key = `${w}x${h}`;
      if (key === sizeRef.current) return;
      sizeRef.current = key;
      const mobile = window.innerWidth < 768;
      const seed = seedFrom(src, w, h);
      const ok = paint(canvas, img, {
        w,
        h,
        cell: mobile ? cell + 2 : cell,
        intensity,
        dim,
        side,
        edge: redBlocks,
        pos: parsePosition(position),
        mobile,
        seed,
      });
      if (!ok) {
        setFallback(true);
        return;
      }
      setBlocks(redBlocks ? makeBlocks(w, h, side, focus, mobile, seed) : []);
    }

    ready().then(render).catch(() => setFallback(true));

    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(render, 200);
    });
    ro.observe(wrap);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, src, intensity, cell, redBlocks, side, position, dim]);

  return (
    <div ref={wrapRef} className={`ht${visible ? ' on' : ''}${className ? ` ${className}` : ''}`} data-fallback={fallback || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className="ht-img"
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
      <canvas ref={canvasRef} className="ht-c" aria-hidden="true" />
      {blocks.length > 0 && (
        <div className="ht-blocks" aria-hidden="true">
          {blocks.map((b, i) => (
            <span
              key={i}
              className={`ht-b${b.jx || b.jy ? ' j' : ''}`}
              style={{
                left: b.x,
                top: b.y,
                width: b.s,
                height: b.s,
                ['--d' as string]: `${b.d}ms`,
                ['--jx' as string]: `${b.jx}px`,
                ['--jy' as string]: `${b.jy}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
