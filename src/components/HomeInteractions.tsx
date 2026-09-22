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
    const sc = document.getElementById('machine-scroll');
    const container = document.getElementById('mtrack-dots');
    if (!sc || !container) return;
    const cards = Array.from(sc.querySelectorAll<HTMLElement>('.mcard'));
    if (!cards.length) return;

    // Los puntos son paradas reales, no tarjetas: en pantallas anchas caben
    // varias tarjetas a la vez y sobraban puntos que chocaban contra el tope
    // y llevaban todos al mismo sitio.
    let paradas: number[] = [];
    let dots: HTMLButtonElement[] = [];

    function medir() {
      const max = sc!.scrollWidth - sc!.clientWidth;
      const base = cards[0].offsetLeft;
      paradas = [];
      for (const card of cards) {
        const x = Math.min(card.offsetLeft - base, max);
        if (!paradas.length || x - paradas[paradas.length - 1] > 8) paradas.push(x);
        if (x >= max) break;
      }
    }

    function pintar() {
      medir();
      container!.innerHTML = '';
      dots = paradas.map((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'mtd';
        btn.setAttribute('aria-label', `Ir al grupo ${i + 1} de ${paradas.length}`);
        btn.addEventListener('click', () => sc!.scrollTo({ left: paradas[i], behavior: 'smooth' }));
        container!.appendChild(btn);
        return btn;
      });
      container!.hidden = paradas.length < 2;
      marcar();
    }

    function marcar() {
      let idx = 0;
      paradas.forEach((x, i) => {
        if (sc!.scrollLeft >= x - 24) idx = i;
      });
      dots.forEach((d, j) => d.classList.toggle('on', j === idx));
    }

    pintar();
    sc.addEventListener('scroll', marcar, { passive: true });
    const ro = new ResizeObserver(pintar);
    ro.observe(sc);
    return () => {
      sc.removeEventListener('scroll', marcar);
      ro.disconnect();
    };
  }, [preDone]);

  return (
    <>
      <Preloader onDone={() => setPreDone(true)} />
    </>
  );
}
