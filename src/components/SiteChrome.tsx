'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
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
  { bg: '#0B0B0C', label: 'INICIO', size: '7vw', color: 'rgba(243,238,228,.06)' },
  { bg: '#0B0B0C', label: 'NOTICIAS', size: '6vw', color: 'rgba(243,238,228,.06)' },
  { bg: '#0B0B0C', label: 'CLUB', size: '7vw', color: 'rgba(243,238,228,.06)' },
  { bg: '#0B0B0C', label: 'EVENTOS', size: '6vw', color: 'rgba(243,238,228,.06)' },
  { bg: '#0B0B0C', label: 'CONC.', size: '4vw', color: 'rgba(243,238,228,.06)' },
  { bg: '#0B0B0C', label: 'SOCIOS', size: '7vw', color: 'rgba(243,238,228,.06)' },
  { bg: '#0B0B0C', label: 'CONTACTA', size: '5vw', color: 'rgba(243,238,228,.06)' },
];

const COLUMNAS = 5;
const CUBRIR_MS = 380 + (COLUMNAS - 1) * 45;

function NavLogo() {
  return (
    <Link href="/" className="nav-logo" aria-label="Ferrari Club España — Inicio">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-principal.svg" alt="" width={145} height={40} />
    </Link>
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState(0);
  const [cubierto, setCubierto] = useState(false);
  const [navegando, startNav] = useTransition();
  const [navegandoPrevio, setNavegandoPrevio] = useState(false);
  const [sttVisible, setSttVisible] = useState(false);

  const normPath = (pathname || '/').replace(/\/$/, '') || '/';

  // El panel de gestion tiene su propia cabecera y navegacion: no debe
  // arrastrar el cromo de la web publica (nav fija, footer, botones deco).
  const esAdminPanel = normPath.startsWith('/socios/admin');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setSttVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // El telon se levanta cuando la ruta nueva ya esta pintada, no cuando cambia
  // el pathname: una redireccion a la misma pagina lo dejaria echado.
  if (navegandoPrevio !== navegando) {
    setNavegandoPrevio(navegando);
    if (!navegando) setCubierto(false);
  }

  // Un solo punto de entrada para todos los enlaces internos, esten en el
  // menu o dentro de una pagina. En captura, para adelantarse a next/link.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest('a');
      if (!a || !a.href || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith('/api/') || /\.[a-z0-9]+$/i.test(url.pathname)) return;
      const limpio = (r: string) => r.replace(/\/$/, '') || '/';
      const aqui = limpio(window.location.pathname);
      if (aqui.startsWith('/socios/admin')) return;
      if (limpio(url.pathname) === aqui) {
        if (url.hash || url.search !== window.location.search) return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      e.preventDefault();
      if (cubierto) return;
      const href = url.pathname + url.search + url.hash;
      setMenuOpen(false);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        router.push(href);
        return;
      }
      setCubierto(true);
      router.prefetch(href);
      setTimeout(() => startNav(() => router.push(href)), CUBRIR_MS);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [cubierto, router]);

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

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>

      <div id="sp" aria-hidden="true" />
      <div id="pt" className={cubierto ? 'on' : ''} aria-hidden="true">
        {Array.from({ length: COLUMNAS }, (_, i) => (
          <span key={i} style={{ ['--i' as string]: i }} />
        ))}
      </div>

      {!esAdminPanel && (
      <header>
        <nav id="nav" className={scrolled ? 'sc' : ''} role="navigation">
          <NavLogo />
          <div className="nav-links">
            <a href="/" className={`nav-link${normPath === '/' ? ' active' : ''}`}>Inicio</a>
            <a href="/noticias/" className={`nav-link${isActive('/noticias/') ? ' active' : ''}`}>Noticias</a>
            <div className="nav-drop nav-link" tabIndex={0}>
              Club
              <div className="nav-drop-menu">
                <a href="/club/" className="nav-drop-item">Nuestro Club</a>
                <a href="/club/hazte-socio/" className="nav-drop-item">Hazte Socio</a>
              </div>
            </div>
            <a href="/eventos/" className={`nav-link${isActive('/eventos/') ? ' active' : ''}`}>Eventos</a>
            <a href="/concesionarios/" className={`nav-link${isActive('/concesionarios/') ? ' active' : ''}`}>Concesionarios</a>
            <a href="/contacta/" className={`nav-link${isActive('/contacta/') ? ' active' : ''}`}>Contacta</a>
            <a href="/socios/" className="nav-link-cta">Área Socios</a>
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
          <span style={{ fontFamily: 'var(--fm)', fontSize: '.55rem', color: 'rgba(243,238,228,.06)' }}>MADRID · EST. 1988</span>
        </div>
      </div>
      )}

      <main id="main-content">{children}</main>

      {!esAdminPanel && (
      <footer className="footer">
        <div className="cnt">
          <p className="footer-finale" data-r="up">Passione.<br /><em>Sempre.</em></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '3rem', marginBottom: '4rem' }}>
            <div>
              <span className="footer-col-title">NAVEGACIÓN</span>
              <a href="/" className="footer-link">Inicio</a>
              <a href="/noticias/" className="footer-link">Noticias</a>
              <a href="/club/" className="footer-link">Nuestro Club</a>
              <a href="/club/hazte-socio/" className="footer-link">Hazte Socio</a>
              <a href="/concesionarios/" className="footer-link">Concesionarios</a>
              <a href="/socios/" className="footer-link">Área Socios</a>
              <a href="/contacta/" className="footer-link">Contacta</a>
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
            <a href="/privacidad/" className="footer-priv">Política de Privacidad</a>
          </div>
          <div className="footer-brand" aria-hidden="true">FERRARI</div>
        </div>
      </footer>
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
