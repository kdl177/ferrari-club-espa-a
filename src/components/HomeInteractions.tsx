'use client';

import { useEffect, useRef, useState } from 'react';
import Preloader from './Preloader';

type GsapLike = typeof import('gsap').gsap;
type STLike = typeof import('gsap/ScrollTrigger').ScrollTrigger;

export default function HomeInteractions() {
  const [preDone, setPreDone] = useState(false);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeInited = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem('pre-done')) setPreDone(true);
  }, []);

  function playHero() {
    const gsap = (window as unknown as { gsap?: GsapLike }).gsap;
    if (!gsap) return;
    gsap.set(['#h-eye', '#h-t', '#h-s', '#h-cta'], { y: 30 });
    gsap
      .timeline()
      .to('#hero-rl', { width: '100%', duration: 1.15, ease: 'power4.inOut' })
      .to('#h-eye', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=.3')
      .to('#h-t', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=.45')
      .to('#h-s', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=.4')
      .to('#h-cta', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=.35')
      .to('#hero-rl', { opacity: 0, duration: 0.4 }, '<');

    const bg = document.getElementById('hbg');
    const photo = document.getElementById('hero-photo');
    let mx = 0, my = 0, cx = 0, cy = 0;
    if (bg && !window.matchMedia('(pointer:coarse)').matches) {
      document.addEventListener(
        'mousemove',
        (e) => {
          mx = (e.clientX / innerWidth - 0.5) * 2;
          my = (e.clientY / innerHeight - 0.5) * 2;
        },
        { passive: true }
      );
      (function pl() {
        cx += (mx - cx) * 0.045;
        cy += (my - cy) * 0.045;
        bg.style.transform = `translate3d(${cx * 22}px,${cy * 14}px,0)`;
        requestAnimationFrame(pl);
      })();
    }
    if (photo) {
      window.addEventListener(
        'scroll',
        () => {
          const y = window.scrollY * 0.35;
          (photo as HTMLElement).style.transform = `translateY(${y}px)`;
        },
        { passive: true }
      );
    }
  }

  function initThree() {
    const THREE = (window as unknown as { THREE?: typeof import('three') }).THREE;
    if (!THREE || threeInited.current) return;
    threeInited.current = true;
    if (navigator.deviceMemory && navigator.deviceMemory < 3) return;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return;
    const canvas = threeCanvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 1;
    const N = 3000;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      const isRed = Math.random() < 0.05, isGold = Math.random() < 0.025, c = Math.random() * 0.07 + 0.02;
      if (isRed) { col[i * 3] = 0.8; col[i * 3 + 1] = 0; col[i * 3 + 2] = 0; }
      else if (isGold) { col[i * 3] = 0.75; col[i * 3 + 1] = 0.59; col[i * 3 + 2] = 0.18; }
      else { col[i * 3] = c * 1.6; col[i * 3 + 1] = c * 0.5; col[i * 3 + 2] = c * 0.25; }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.006, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8, depthWrite: false });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    let mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 0.4; my = (e.clientY / innerHeight - 0.5) * 0.4; }, { passive: true });
    window.addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); }, { passive: true });
    canvas.classList.add('on');
    (function anim() {
      requestAnimationFrame(anim);
      pts.rotation.y += 0.0003;
      pts.rotation.x += 0.0001;
      camera.position.x += (mx - camera.position.x) * 0.04;
      camera.position.y += (-my - camera.position.y) * 0.04;
      renderer.render(scene, camera);
    })();
  }

  function initScrollScenes() {
    const gsap = (window as unknown as { gsap?: GsapLike }).gsap;
    const ST = (window as unknown as { ScrollTrigger?: STLike }).ScrollTrigger;
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);
    document.querySelectorAll('.ew').forEach((w, i) => {
      ST.create({
        trigger: w,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          if (i === 2) gsap.to(w, { opacity: 0.6, duration: 0.8 });
        },
      });
    });
  }

  useEffect(() => {
    if (!preDone) return;
    playHero();
    initScrollScenes();

    const ok =
      (!navigator.deviceMemory || navigator.deviceMemory >= 3) &&
      (!navigator.hardwareConcurrency || navigator.hardwareConcurrency >= 4);
    if (ok) {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = () => initThree();
      document.head.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <canvas id="three-canvas" ref={threeCanvasRef} aria-hidden="true" />
    </>
  );
}

declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}
