'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const MENU_ITEMS = [
  { n: '01', label: 'INICIO', href: '/' },
  { n: '02', label: 'NOTICIAS', href: '/noticias/' },
  {
    n: '03',
    label: 'CLUB',
    sub: [
      { label: 'Nuestro Club', href: '/club/' },
      { label: 'Hazte Socio', href: '/club/hazte-socio/' },
    ],
  },
  { n: '04', label: 'EVENTOS', href: '/eventos/' },
  { n: '05', label: 'CONCESIONARIOS', href: '/concesionarios/' },
  { n: '06', label: 'SOCIOS', href: '/socios/' },
  { n: '07', label: 'CONTACTA', href: '/contacta/' },
];

const MENU_PREVIEWS = [
  { bg: 'radial-gradient(ellipse at 40% 50%,#1c0000,#000)', label: 'INICIO', size: '7vw', color: 'rgba(218,41,28,.1)' },
  { bg: 'radial-gradient(ellipse at 55% 50%,#0c0c0c,#000)', label: 'NOTICIAS', size: '6vw', color: 'rgba(255,255,255,.04)' },
  { bg: 'radial-gradient(ellipse at 40% 50%,#1c0000,#000)', label: 'CLUB', size: '7vw', color: 'rgba(218,41,28,.1)' },
  { bg: 'radial-gradient(ellipse at 50% 60%,#1a0505,#0d0907)', label: 'EVENTOS', size: '6vw', color: 'rgba(218,41,28,.1)' },
  { bg: 'radial-gradient(ellipse at 50% 50%,#0c0c0c,#000)', label: 'CONC.', size: '4vw', color: 'rgba(255,255,255,.04)' },
  { bg: 'radial-gradient(ellipse at 40% 50%,#1c0000,#000)', label: 'SOCIOS', size: '7vw', color: 'rgba(218,41,28,.1)' },
  { bg: 'radial-gradient(ellipse at 60% 50%,#111,#000)', label: 'CONTACTA', size: '5vw', color: 'rgba(255,255,255,.04)' },
];

function NavLogo() {
  return (
    <Link href="/" className="nav-logo" aria-label="Ferrari Club España — Inicio">
      <span className="nav-logo-badge" aria-hidden="true">
        <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1 L31 7 L31 22 Q31 32 16 37 Q1 32 1 22 L1 7 Z" fill="#CC0000" stroke="#990000" strokeWidth=".8" />
          <path d="M16 3.5 L29 8.8 L29 22 Q29 30.5 16 34.8 Q3 30.5 3 22 L3 8.8 Z" fill="#AA0000" />
          <text x="16" y="24" fontFamily="Archivo,sans-serif" fontSize="13" fill="#F5EDE0" textAnchor="middle" fontWeight="400">F</text>
          <path d="M8 14 L24 14" stroke="rgba(245,237,224,.25)" strokeWidth=".8" />
        </svg>
      </span>
      <span className="nav-logo-text">FERRARI<em>·</em>CLUB<small>ESPAÑA — OFICIAL DESDE 1988</small></span>
    </Link>
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState(0);
  const [transitioning, setTransitioning] = useState<'in' | 'out' | 'idle'>('in');
  const [sttVisible, setSttVisible] = useState(false);
  const [raceOn, setRaceOn] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const raceCanvasRef = useRef<HTMLCanvasElement>(null);
  const pendingHrefRef = useRef<string | null>(null);

  const normPath = (pathname || '/').replace(/\/$/, '') || '/';

  // El panel de gestion tiene su propia cabecera y navegacion: no debe
  // arrastrar el cromo de la web publica (nav fija, footer, botones deco).
  const esAdminPanel = normPath.startsWith('/socios/admin');

  useEffect(() => {
    setTransitioning('in');
    const t = setTimeout(() => setTransitioning('idle'), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setSttVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!pendingHrefRef.current) return;
    if (transitioning !== 'idle') return;
  }, [transitioning]);

  function navigate(href: string) {
    if (href === pathname) return;
    setTransitioning('out');
    pendingHrefRef.current = href;
    setTimeout(() => {
      router.push(href);
    }, 480);
  }

  function isActive(href?: string) {
    if (!href) return false;
    const h = href.replace(/\/$/, '') || '/';
    return h === normPath || (h !== '/' && normPath.startsWith(h));
  }

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = document.querySelectorAll('[data-r],[data-stagger]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const gsap = (window as unknown as { gsap?: typeof import('gsap').gsap }).gsap;
    if (!gsap) return;
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      if (el.dataset.counted) return;
      const target = parseInt(el.dataset.count || '0', 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const obj = { val: 0 };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            el.dataset.counted = '1';
            if (target > 1900) {
              el.textContent = prefix + target + suffix;
            } else {
              gsap.to(obj, {
                val: target,
                duration: 2.2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = prefix + Math.round(obj.val) + suffix;
                },
              });
            }
            io.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      io.observe(el);
    });
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const cards = document.querySelectorAll<HTMLElement>('.mcard,.news-card,.mem-card,.evp-card');
    const handlers: Array<() => void> = [];
    cards.forEach((card) => {
      card.style.willChange = 'transform';
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const sx = x * 28, sy = y * 20;
        card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale3d(1.025,1.025,1.025)`;
        card.style.boxShadow = `${-sx}px ${-sy}px 40px rgba(218,41,28,.12),0 20px 60px rgba(0,0,0,.6)`;
        card.style.transition = 'transform .08s ease-out';
      };
      const onLeave = () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.transition = 'transform .5s ease-out,box-shadow .5s ease-out';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
    return () => handlers.forEach((h) => h());
  }, [pathname]);

  useEffect(() => {
    const gsap = (window as unknown as { gsap?: typeof import('gsap').gsap }).gsap;
    if (!gsap) return;
    const els = document.querySelectorAll<HTMLElement>('[data-mag]');
    const cleanups: Array<() => void> = [];
    els.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.35,
          y: (e.clientY - (r.top + r.height / 2)) * 0.35,
          duration: 0.35,
          ease: 'power2.out',
        });
      };
      const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' });
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, [pathname]);

  useEffect(() => {
    const canvas = raceCanvasRef.current;
    if (!canvas || !raceOn) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const trail: Array<{ x: number; y: number; t: number; vx: number; vy: number }> = [];
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const onMove = (e: MouseEvent) => {
      trail.push({ x: e.clientX, y: e.clientY, t: Date.now(), vx: 0, vy: 0 });
      if (trail.length > 2) {
        const p = trail[trail.length - 2];
        trail[trail.length - 1].vx = e.clientX - p.x;
        trail[trail.length - 1].vy = e.clientY - p.y;
      }
      if (trail.length > 80) trail.shift();
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const alive = trail.filter((p) => now - p.t < 400);
      trail.length = 0;
      alive.forEach((p) => trail.push(p));
      if (alive.length < 2) {
        raf = requestAnimationFrame(draw);
        return;
      }
      for (let i = 1; i < alive.length; i++) {
        const p = alive[i - 1], c = alive[i];
        const age = (now - c.t) / 400;
        const alpha = (1 - age) * 0.9;
        const w = Math.max(0.5, (1 - age) * 4);
        const speed = Math.hypot(c.vx, c.vy);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(c.x, c.y);
        ctx.strokeStyle = `rgba(218,41,28,${alpha})`;
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.stroke();
        if (speed > 18) {
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x - c.vx * 2.5, c.y - c.vy * 2.5);
          ctx.strokeStyle = `rgba(255,80,80,${alpha * 0.35})`;
          ctx.lineWidth = w * 0.4;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [raceOn]);

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>

      <div id="sp" aria-hidden="true" />
      <div
        id="pt"
        aria-hidden="true"
        style={{
          transform: transitioning === 'out' ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: transitioning === 'out' ? 'bottom' : 'top',
          transition: 'transform .6s',
          pointerEvents: transitioning === 'out' ? 'all' : 'none',
        }}
      />
      <canvas id="race-canvas" ref={raceCanvasRef} className={raceOn ? 'on' : ''} aria-hidden="true" />

      {!esAdminPanel && (
      <header>
        <nav id="nav" className={scrolled ? 'sc' : ''} role="navigation">
          <NavLogo />
          <div className="nav-links">
            <a href="/" className={`nav-link${normPath === '/' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/'); }}>Inicio</a>
            <a href="/noticias/" className={`nav-link${isActive('/noticias/') ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/noticias/'); }}>Noticias</a>
            <div className="nav-drop nav-link" tabIndex={0}>
              Club
              <div className="nav-drop-menu">
                <a href="/club/" className="nav-drop-item" onClick={(e) => { e.preventDefault(); navigate('/club/'); }}>Nuestro Club</a>
                <a href="/club/hazte-socio/" className="nav-drop-item" onClick={(e) => { e.preventDefault(); navigate('/club/hazte-socio/'); }}>Hazte Socio</a>
              </div>
            </div>
            <a href="/eventos/" className={`nav-link${isActive('/eventos/') ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/eventos/'); }}>Eventos</a>
            <a href="/concesionarios/" className={`nav-link${isActive('/concesionarios/') ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/concesionarios/'); }}>Concesionarios</a>
            <a href="/contacta/" className={`nav-link${isActive('/contacta/') ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/contacta/'); }}>Contacta</a>
            <a href="/socios/" className="nav-link-cta" onClick={(e) => { e.preventDefault(); navigate('/socios/'); }}>Área Socios</a>
          </div>
          <button
            className={`nav-mbtn${menuOpen ? ' open' : ''}`}
            id="mbtn"
            aria-label="Menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </nav>
      </header>
      )}

      {!esAdminPanel && (
      <div id="menu" className={menuOpen ? 'open' : ''} role="dialog" aria-modal="true">
        <nav className="menu-nav">
          {MENU_ITEMS.map((item, i) =>
            item.sub ? (
              <div
                key={item.label}
                className="mi"
                style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '.3rem' }}
                onMouseEnter={() => setActivePreview(i)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span className="mi-n">{item.n}</span>{item.label}
                </span>
                <div className="mi-sub">
                  {item.sub.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate(s.href); }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                className={`mi${isActive(item.href) ? ' active' : ''}`}
                href={item.href}
                onMouseEnter={() => setActivePreview(i)}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate(item.href!); }}
              >
                <span className="mi-n">{item.n}</span>{item.label}
              </a>
            )
          )}
        </nav>
        <div className="menu-preview" aria-hidden="true">
          {MENU_PREVIEWS.map((p, i) => (
            <div key={i} className={`mp${activePreview === i ? ' on' : ''}`} style={{ background: p.bg }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: p.size, color: p.color }}>{p.label}</span>
            </div>
          ))}
        </div>
        <div className="menu-footer">
          <div className="menu-social">
            <a href="https://www.facebook.com/ferrariclubespana" target="_blank" rel="noopener">FACEBOOK</a>
            <a href="https://www.instagram.com/ferrariclubespana" target="_blank" rel="noopener">INSTAGRAM</a>
          </div>
          <span style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', color: 'rgba(255,255,255,.08)' }}>MADRID · EST. 1988</span>
        </div>
      </div>
      )}

      <main id="main-content">{children}</main>

      {!esAdminPanel && (
      <footer className="footer">
        <div className="cnt">
          <p className="footer-finale" data-r="up">PASSIONE.<br /><em>SEMPRE.</em></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '3rem', marginBottom: '4rem' }}>
            <div>
              <span className="footer-col-title">NAVEGACIÓN</span>
              <a href="/" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Inicio</a>
              <a href="/noticias/" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/noticias/'); }}>Noticias</a>
              <a href="/club/" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/club/'); }}>Nuestro Club</a>
              <a href="/club/hazte-socio/" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/club/hazte-socio/'); }}>Hazte Socio</a>
              <a href="/concesionarios/" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/concesionarios/'); }}>Concesionarios</a>
              <a href="/socios/" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/socios/'); }}>Área Socios</a>
              <a href="/contacta/" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/contacta/'); }}>Contacta</a>
            </div>
            <div>
              <span className="footer-col-title">FERRARI OFICIAL</span>
              <a href="https://www.ferrari.com/es-ES" className="footer-link" target="_blank" rel="noopener">Ferrari.com ↗</a>
              <a href="https://www.ferrari.com/es-ES/formula1" className="footer-link" target="_blank" rel="noopener">Scuderia Ferrari ↗</a>
              <a href="https://store.ferrari.com" className="footer-link" target="_blank" rel="noopener">Ferrari Store ↗</a>
              <a href="https://www.ferrariland.com/es/" className="footer-link" target="_blank" rel="noopener">Ferrari Land ↗</a>
            </div>
            <div>
              <span className="footer-col-title">CONTACTO</span>
              <p style={{ fontFamily: 'var(--fm)', fontSize: '.78rem', color: 'var(--w60)', lineHeight: 2.2, letterSpacing: '.04em' }}>
                Calle Constancia 41<br />Entreplanta · 28002 Madrid<br />
                <a href="tel:+34915754160" style={{ color: 'var(--w60)' }}>+34 91 575 41 60</a><br />
                <a href="mailto:ferrari@ferrariclubespana.com" style={{ color: 'var(--w60)' }}>ferrari@ferrariclubespana.com</a>
              </p>
            </div>
            <div>
              <span className="footer-col-title">HORARIO</span>
              <p style={{ fontFamily: 'var(--fm)', fontSize: '.78rem', color: 'var(--w60)', lineHeight: 2.2 }}>Lun–Jue: 9:00–17:30<br />Vie: 9:00–15:00</p>
              <div style={{ marginTop: '1.5rem' }}>
                <span className="footer-col-title">REDES</span>
                <a href="https://www.facebook.com/ferrariclubespana" className="footer-link" target="_blank" rel="noopener">FACEBOOK ↗</a>
                <a href="https://www.instagram.com/ferrariclubespana" className="footer-link" target="_blank" rel="noopener">INSTAGRAM ↗</a>
              </div>
            </div>
          </div>
          <div className="rl-g" style={{ marginBottom: '2rem' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--fm)', fontSize: '.7rem', color: 'var(--w40)' }}>&copy; 2026 FERRARI CLUB ESPAÑA · C/ Constancia 41 Entreplanta · 28002 Madrid</span>
            <a href="/privacidad/" className="footer-priv" onClick={(e) => { e.preventDefault(); navigate('/privacidad/'); }}>Política de Privacidad</a>
          </div>
          <div className="footer-brand" aria-hidden="true">FERRARI</div>
        </div>
      </footer>
      )}

      {!esAdminPanel && (
        <>
          <button
            id="race-btn"
            aria-label="Race mode"
            className={raceOn ? 'on' : ''}
            onClick={() => setRaceOn((v) => !v)}
          >
            {raceOn ? '■ RACE ON' : '▶ RACE'}
          </button>
          <button
            id="sound-btn"
            aria-label="Sonido"
            style={soundOn ? { color: 'var(--white)', borderColor: 'var(--w30)' } : undefined}
            onClick={() => setSoundOn((v) => !v)}
          >
            {soundOn ? '♪ SOUND ON' : '♪ SOUND'}
          </button>
        </>
      )}

      <button
        id="stt"
        className={sttVisible ? 'vis' : ''}
        aria-label="Volver al inicio de la página"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 14V4M4 9l5-5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}
