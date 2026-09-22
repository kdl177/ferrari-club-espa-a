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

    const nombres = cards.map((c) => {
      const h = c.querySelector('.mcard-name');
      // textContent pega las dos lineas del titulo ("SF90 XX" + "Stradale"),
      // asi que el <br> se convierte en espacio antes de leerlo.
      return (h?.innerHTML ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ').trim();
    });

    const N = cards.length;
    const paso = 360 / N;
    const marcas = nombres
      .map(
        (_, i) =>
          `<span class="mdial-marca" style="--a:${i * paso}deg"><i></i></span>`
      )
      .join('');

    container.innerHTML = `
      <button class="mdial" aria-label="Ver el modelo siguiente">
        <span class="mdial-aro" aria-hidden="true">
          <span class="mdial-giro">${marcas}</span>
        </span>
        <span class="mdial-flecha" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M9 4l8 8-8 8"/></svg>
        </span>
      </button>
      <p class="mdial-info" aria-live="polite"><b></b><span></span></p>`;

    const dial = container.querySelector<HTMLButtonElement>('.mdial')!;
    const giro = container.querySelector<HTMLElement>('.mdial-giro')!;
    const marcasEl = Array.from(container.querySelectorAll<HTMLElement>('.mdial-marca'));
    const nombre = container.querySelector<HTMLElement>('.mdial-info b')!;
    const cuenta = container.querySelector<HTMLElement>('.mdial-info span')!;

    const max = () => sc.scrollWidth - sc.clientWidth;

    // El dial lleva su propio indice. Deducirlo del scroll no vale: las
    // ultimas tarjetas comparten el tope del carro, asi que dos modelos caen
    // en la misma posicion y el contador se quedaba clavado en uno de ellos.
    let i = 0;
    // El giro es acumulado para que la rueda siga hacia delante al volver del
    // ultimo modelo al primero, en vez de desandar cuatro puestos.
    let vueltas = 0;

    function destinoDe(n: number) {
      const izq = cards[n].offsetLeft - cards[0].offsetLeft;
      return Math.max(0, Math.min(izq, max()));
    }

    function pintar() {
      giro.style.transform = `rotate(${-(vueltas * 360 + i * paso)}deg)`;
      marcasEl.forEach((m, j) => m.classList.toggle('on', j === i));
      nombre.textContent = nombres[i];
      cuenta.textContent = `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
      container.hidden = max() < 8;
    }

    function siguiente() {
      if (i >= N - 1) {
        i = 0;
        vueltas += 1;
      } else {
        i += 1;
      }
      sc.scrollTo({ left: destinoDe(i), behavior: 'smooth' });
      pintar();
    }

    // Si el carro se mueve a mano, el dial se pone al dia con la tarjeta que
    // tenga mas cerca, sin girar de mas.
    function sincronizar() {
      let cerca = 0;
      let mejor = Infinity;
      cards.forEach((_, n) => {
        const d = Math.abs(sc.scrollLeft - destinoDe(n));
        if (d < mejor - 1) {
          mejor = d;
          cerca = n;
        }
      });
      if (cerca === i) return;
      // Camino corto: al mover el carro a mano la rueda no da la vuelta
      // larga, solo la da el boton al saltar del ultimo modelo al primero.
      const avance = (cerca - i + N) % N;
      if (avance > N - avance) vueltas += 1;
      i = cerca;
      pintar();
    }

    let quieto = 0;
    const alDesplazar = () => {
      window.clearTimeout(quieto);
      quieto = window.setTimeout(sincronizar, 140);
    };

    dial.addEventListener('click', siguiente);
    sc.addEventListener('scroll', alDesplazar, { passive: true });
    const ro = new ResizeObserver(pintar);
    ro.observe(sc);
    pintar();
    return () => {
      window.clearTimeout(quieto);
      dial.removeEventListener('click', siguiente);
      sc.removeEventListener('scroll', alDesplazar);
      ro.disconnect();
    };
  }, [preDone]);

  return (
    <>
      <Preloader onDone={() => setPreDone(true)} />
    </>
  );
}
