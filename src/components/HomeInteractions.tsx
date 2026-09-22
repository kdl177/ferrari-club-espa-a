'use client';

import { useEffect, useState } from 'react';
import Preloader from './Preloader';

type GsapLike = typeof import('gsap').gsap;

export default function HomeInteractions() {
  const [preDone, setPreDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pre-done')) setPreDone(true);
  }, []);

  function playHero() {
    const gsap = (window as unknown as { gsap?: GsapLike }).gsap;
    if (!gsap) return;
    gsap.set(['#h-eye', '#h-t', '#h-s', '#h-cta'], { y: 24 });
    gsap
      .timeline()
      .to('#h-eye', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('#h-t', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=.45')
      .to('#h-s', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=.4')
      .to('#h-cta', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=.35');
  }

  useEffect(() => {
    if (!preDone) return;
    playHero();
  }, [preDone]);

  useEffect(() => {
    const el = document.getElementById('machine-scroll');
    const caja = document.getElementById('mtrack-dots');
    if (!el || !caja) return;
    const sc = el;
    const container = caja;
    const cards = Array.from(sc.querySelectorAll<HTMLElement>('.mcard'));
    if (!cards.length) return;

    // Las paradas son posiciones reales, no tarjetas: en pantallas anchas
    // caben varias a la vez y sobrarian paradas que chocan contra el tope.
    const nombres = cards.map((c) => {
      const h = c.querySelector('.mcard-name');
      // textContent pega las dos lineas del titulo ("SF90 XX" + "Stradale"),
      // asi que el <br> se convierte en espacio antes de leerlo.
      return (h?.innerHTML ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ').trim();
    });
    let paradas: number[] = [];

    container.innerHTML = `
      <button class="mtrack-flecha" data-dir="-1" aria-label="Ver el modelo anterior">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 7 12l8 8"/></svg>
      </button>
      <div class="mtrack-riel"><span class="mtrack-pulgar"></span></div>
      <button class="mtrack-flecha" data-dir="1" aria-label="Ver el modelo siguiente">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>
      </button>
      <p class="mtrack-etiqueta"><b></b><span></span></p>`;

    const riel = container.querySelector<HTMLElement>('.mtrack-riel')!;
    const pulgar = container.querySelector<HTMLElement>('.mtrack-pulgar')!;
    const flechas = Array.from(container.querySelectorAll<HTMLButtonElement>('.mtrack-flecha'));
    const nombre = container.querySelector<HTMLElement>('.mtrack-etiqueta b')!;
    const cuenta = container.querySelector<HTMLElement>('.mtrack-etiqueta span')!;

    const max = () => sc.scrollWidth - sc.clientWidth;

    function medir() {
      const tope = max();
      const base = cards[0].offsetLeft;
      paradas = [];
      for (const card of cards) {
        const x = Math.min(card.offsetLeft - base, tope);
        if (!paradas.length || x - paradas[paradas.length - 1] > 8) paradas.push(x);
        if (x >= tope) break;
      }
      // El pulgar ocupa la fraccion visible del carro, como una barra normal.
      pulgar.style.width = `${Math.max(12, (sc.clientWidth / sc.scrollWidth) * 100)}%`;
      container.hidden = max() < 8;
      pintar();
    }

    function actual() {
      // En el tope siempre gana la ultima: si caben varias tarjetas a la vez,
      // el contador se quedaba en la antepenultima al llegar al final.
      if (sc.scrollLeft >= max() - 8) return cards.length - 1;
      let idx = 0;
      cards.forEach((c, i) => {
        if (sc.scrollLeft >= c.offsetLeft - cards[0].offsetLeft - 24) idx = i;
      });
      return idx;
    }

    function pintar() {
      const tope = max();
      const t = tope > 0 ? sc.scrollLeft / tope : 0;
      pulgar.style.left = `${t * (100 - parseFloat(pulgar.style.width))}%`;
      const i = actual();
      nombre.textContent = nombres[i];
      cuenta.textContent = `${String(i + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
      flechas[0].disabled = sc.scrollLeft < 8;
      flechas[1].disabled = sc.scrollLeft >= tope - 8;
    }

    // El rotulo cuenta tarjetas y las flechas cuentan paradas: en escritorio
    // hay 5 tarjetas y 4 paradas, y mezclarlas dejaba la flecha izquierda
    // pidiendo el mismo tope en el que ya estaba.
    function paradaActual() {
      let idx = 0;
      paradas.forEach((x, i) => {
        if (sc.scrollLeft >= x - 24) idx = i;
      });
      return idx;
    }

    function irA(dir: number) {
      const i = Math.max(0, Math.min(paradas.length - 1, paradaActual() + dir));
      sc.scrollTo({ left: paradas[i] ?? 0, behavior: 'smooth' });
    }

    const onFlecha = (e: Event) => {
      const b = (e.currentTarget as HTMLElement).dataset.dir;
      irA(Number(b));
    };
    flechas.forEach((f) => f.addEventListener('click', onFlecha));

    // Arrastrar el pulgar mueve el carro, como una barra de desplazamiento.
    const onPointer = (e: PointerEvent) => {
      const r = riel.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      sc.scrollLeft = t * max();
    };
    const onDown = (e: PointerEvent) => {
      riel.setPointerCapture(e.pointerId);
      riel.classList.add('agarrado');
      onPointer(e);
    };
    const onMove = (e: PointerEvent) => {
      if (riel.hasPointerCapture(e.pointerId)) onPointer(e);
    };
    const onUp = (e: PointerEvent) => {
      riel.releasePointerCapture(e.pointerId);
      riel.classList.remove('agarrado');
    };
    riel.addEventListener('pointerdown', onDown);
    riel.addEventListener('pointermove', onMove);
    riel.addEventListener('pointerup', onUp);

    medir();
    sc.addEventListener('scroll', pintar, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(sc);
    return () => {
      sc.removeEventListener('scroll', pintar);
      flechas.forEach((f) => f.removeEventListener('click', onFlecha));
      riel.removeEventListener('pointerdown', onDown);
      riel.removeEventListener('pointermove', onMove);
      riel.removeEventListener('pointerup', onUp);
      ro.disconnect();
    };
  }, [preDone]);

  return (
    <>
      <Preloader onDone={() => setPreDone(true)} />
    </>
  );
}
