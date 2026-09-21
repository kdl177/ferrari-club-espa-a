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
    container.innerHTML = '';
    cards.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'mtd' + (i === 0 ? ' on' : '');
      btn.setAttribute('aria-label', 'Modelo ' + (i + 1));
      btn.addEventListener('click', () =>
        sc.scrollTo({ left: i * (cards[0].offsetWidth + 32), behavior: 'smooth' })
      );
      container.appendChild(btn);
    });
    const dots = container.querySelectorAll('.mtd');
    const onScroll = () => {
      const idx = Math.round(sc.scrollLeft / (cards[0].offsetWidth + 32));
      dots.forEach((d, j) => d.classList.toggle('on', j === idx));
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    return () => sc.removeEventListener('scroll', onScroll);
  }, [preDone]);

  return (
    <>
      <Preloader onDone={() => setPreDone(true)} />
    </>
  );
}
