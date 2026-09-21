import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import LiveNewsFeed from '@/components/LiveNewsFeed';
import Foto from '@/components/Foto';

export const metadata: Metadata = {
  title: 'Noticias — Ferrari Club España',
  description: 'Últimas noticias de Ferrari en vivo: Fórmula 1, WEC, modelos, eventos. Actualización automática desde las principales fuentes del mundo Ferrari.',
  alternates: { canonical: '/noticias/' },
};

const GRID_ARTICLES = [
  { cat: 'HISTORIA', title: '1975: Ferrari y Niki Lauda — el título que marcó una era', date: '22 JUL 2026', foto: '312t-goodwood' as const, label: 'HISTORY', size: 40, bg: '#0A0A0A', color: 'rgba(218,41,28,.07)' },
  { cat: 'MODELOS', title: 'Ferrari Roma Spider — La dolce vita al descubierto', date: '18 JUL 2026', foto: 'roma-spider' as const, label: 'ROMA SPIDER', size: 28, bg: '#0A0A0A', color: 'rgba(196,154,60,.07)' },
  { cat: 'CLUB', title: 'Tandas Solidarias en Calafat — Inscripción abierta', date: '12 JUL 2026', foto: '488-challenge-druids' as const, label: '', bg: '#0A0A0A', color: '' },
];

export default function NoticiasPage() {
  return (
    <>
      <section className="page-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Noticias' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">TABLÓN DE NOTICIAS</p>
          <h1 className="sec-title" style={{ marginTop: '.75rem' }} data-r="up">Mundo<br /><span style={{ color: 'var(--red)' }}>Ferrari</span></h1>
          <p className="sec-sub" style={{ marginTop: '1rem', maxWidth: '420px' }} data-r="up"><em>Las últimas noticias de Ferrari, Fórmula 1 y motorsport. Actualización automática.</em></p>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <LiveNewsFeed />
        </div>
      </section>

      <section style={{ background: 'var(--black)', padding: '5rem 0' }}>
        <div className="cnt">
          <div className="section-sep">ARTÍCULOS EDITORIALES DEL CLUB</div>

          <div className="editorial-grid" style={{ marginBottom: '2rem' }}>
            <a className="news-card" href="/noticias/gp-paises-bajos/" style={{ textDecoration: 'none' }}>
              <div className="news-card-img" style={{ height: '280px' }}><Foto id="f1-zandvoort-2024" /></div>
              <div>
                <span className="news-card-cat">FÓRMULA 1</span>
                <h2 className="news-card-title">GP de Países Bajos — Ferrari en Zandvoort con mejoras aerodinámicas</h2>
                <p className="news-card-desc">Ferrari afronta Zandvoort con renovadas esperanzas tras los avances técnicos de las últimas carreras. Mejoras aerodinámicas probadas en el trazado costero.</p>
                <div className="news-card-date">18 AGO 2026 · 4 MIN LECTURA</div>
              </div>
            </a>
            <div className="ed-side">
              <a className="news-card" href="/noticias/499p-monza/" style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="news-card-img" style={{ width: '110px', flexShrink: 0, height: '74px' }}><Foto id="499p-spa-2023" mini /></div>
                <div><span className="news-card-cat">ENDURANCE</span><h3 className="news-card-title" style={{ fontSize: '.85rem' }}>Ferrari 499P domina en Monza</h3><div className="news-card-date">12 AGO 2026</div></div>
              </a>
              <a className="news-card" href="/noticias/sf90-xx-stradale/" style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="news-card-img" style={{ width: '110px', flexShrink: 0, height: '74px' }}><Foto id="sf90-xx-stradale" mini /></div>
                <div><span className="news-card-cat">MODELOS</span><h3 className="news-card-title" style={{ fontSize: '.85rem' }}>SF90 XX Stradale: el más potente</h3><div className="news-card-date">08 AGO 2026</div></div>
              </a>
              <a className="news-card" href="/noticias/" style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="news-card-img" style={{ width: '110px', flexShrink: 0, height: '74px' }}><Foto id="cavalcade-pista" mini /></div>
                <div><span className="news-card-cat">CLUB</span><h3 className="news-card-title" style={{ fontSize: '.85rem' }}>Cavalcade Classiche 2026 — Italia</h3><div className="news-card-date">05 AGO 2026</div></div>
              </a>
              <a className="news-card" href="/noticias/" style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="news-card-img" style={{ width: '110px', flexShrink: 0, height: '74px' }}><Foto id="sainz-china-2024" mini /></div>
                <div><span className="news-card-cat">FÓRMULA 1</span><h3 className="news-card-title" style={{ fontSize: '.85rem' }}>Sainz remonta desde el P14 en Hungría</h3><div className="news-card-date">28 JUL 2026</div></div>
              </a>
            </div>
          </div>

          <div className="news-grid">
            {GRID_ARTICLES.map((a) => (
              <a className="news-card" href="/noticias/" data-r="up" key={a.title}>
                <div className="news-card-img"><Foto id={a.foto} /></div>
                <div><span className="news-card-cat">{a.cat}</span><h3 className="news-card-title">{a.title}</h3><div className="news-card-date">{a.date}</div></div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
