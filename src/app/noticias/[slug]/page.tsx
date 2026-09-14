import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { ARTICLES, getArticle } from '@/lib/articles';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDesc,
    alternates: { canonical: `/noticias/${article.slug}/` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);
  const shareUrl = `https://club-ferrari-espana.vercel.app/noticias/${article.slug}/`;

  return (
    <>
      <div className="art-hero">
        <svg width="100%" height="100%" viewBox="0 0 1920 600" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} aria-hidden="true">
          <defs><radialGradient id="ah" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor={article.heroBg} /><stop offset="100%" stopColor="#040404" /></radialGradient></defs>
          <rect width="100%" height="100%" fill="url(#ah)" />
          <text x="960" y="330" fontFamily="Orbitron,sans-serif" fontSize={article.heroFontSize} fill="rgba(204,0,0,.05)" textAnchor="middle" letterSpacing="10">{article.heroLabel}</text>
          <g stroke="rgba(204,0,0,.03)" strokeWidth="1" fill="none">
            <line x1="0" y1="200" x2="1920" y2="200" /><line x1="0" y1="400" x2="1920" y2="400" />
          </g>
        </svg>
        <div className="art-hero-ov" />
        <div className="cnt" style={{ position: 'relative', zIndex: 2, paddingBottom: '3rem', width: '100%' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Noticias', href: '/noticias/' }, { label: article.cat }]} />
          </div>
          <div className="art-cat">{article.cat}</div>
          <h1 style={{ fontFamily: 'var(--fh)', fontSize: 'clamp(1.4rem,3.5vw,2.4rem)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--white)', maxWidth: '820px', lineHeight: 1.2 }}>{article.title}</h1>
        </div>
      </div>

      <div style={{ background: 'var(--black)' }}>
        <div className="art-body">
          <div className="art-meta">
            <div className="art-meta-item"><strong>FECHA</strong>{article.date}</div>
            <div className="art-meta-item"><strong>LECTURA</strong>{article.readTime}</div>
            <div className="art-meta-item"><strong>CATEGORÍA</strong>{article.cat}</div>
            <div className="art-meta-item"><strong>FUENTE</strong>FERRARI CLUB ESPAÑA</div>
          </div>

          <p className="art-lead" data-r="up">{article.lead}</p>

          {article.paragraphs1.map((p, i) => <p className="art-p" data-r="up" key={i}>{p}</p>)}

          {article.resultBox ? (
            <div className="art-img-block" data-r="up">
              <div className="result-box">
                <div style={{ fontFamily: 'var(--fm)', fontSize: '.58rem', letterSpacing: '.2em', color: 'var(--red-g)', marginBottom: '1rem' }}>{article.resultBox.title}</div>
                {article.resultBox.rows.map((r) => (
                  <div className="result-row" key={r.pos}><span className="result-pos">{r.pos}</span><span className="result-car">{r.car}</span><span className="result-time">{r.time}</span></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="art-img-block" data-r="up">
              <svg width="100%" viewBox="0 0 780 380" style={{ display: 'block', width: '100%' }} aria-label={article.imageCaption} role="img">
                <rect width="100%" height="100%" fill="#0a0000" />
                <defs><radialGradient id="aig" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor={article.heroBg} /><stop offset="100%" stopColor="#050000" /></radialGradient></defs>
                <rect width="100%" height="100%" fill="url(#aig)" />
                <text x="390" y="205" fontFamily="Orbitron" fontSize="45" fill="rgba(204,0,0,.06)" textAnchor="middle" letterSpacing="3">{article.imageLabel}</text>
              </svg>
              {article.imageCaption && <p className="art-caption">{article.imageCaption}</p>}
            </div>
          )}

          <h2 className="art-h2" data-r="up">{article.h2_1}</h2>
          {article.paragraphs2.map((p, i) => <p className="art-p" data-r="up" key={i}>{p}</p>)}

          {article.specsTable && (
            <div data-r="up">
              <table className="specs-table">
                <tbody>
                  {article.specsTable.map((row) => (
                    <tr key={row.label}><td>{row.label}</td><td>{row.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="art-h2" data-r="up">{article.h2_2}</h2>
          {article.paragraphs3.map((p, i) => <p className="art-p" data-r="up" key={i}>{p}</p>)}

          <div className="art-share" data-r="up">
            <span className="art-share-label">COMPARTIR</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="share-btn">FACEBOOK ↗</a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener" className="share-btn">TWITTER / X ↗</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="share-btn">WHATSAPP ↗</a>
          </div>
        </div>
      </div>

      <section className="related">
        <div className="cnt">
          <div className="sec-eye" data-r="up">TAMBIÉN TE PUEDE INTERESAR</div>
          <div className="related-grid">
            {related.map((r) => (
              <a className="news-card" href={`/noticias/${r.slug}/`} data-r="up" key={r.slug}>
                <div className="news-card-img"><svg width="100%" height="100%" viewBox="0 0 400 200"><rect width="100%" height="100%" fill={r.heroBg} /><text x="200" y="110" fontFamily="Orbitron" fontSize="34" fill="rgba(204,0,0,.07)" textAnchor="middle">{r.heroLabel}</text></svg></div>
                <div><span className="news-card-cat">{r.cat}</span><h3 className="news-card-title">{r.title}</h3><div className="news-card-date">{r.date}</div></div>
              </a>
            ))}
            <a className="news-card" href="/noticias/" data-r="scale">
              <div className="news-card-img"><svg width="100%" height="100%" viewBox="0 0 400 200"><rect width="100%" height="100%" fill="#0d0d0d" /><text x="200" y="110" fontFamily="Orbitron" fontSize="28" fill="rgba(255,255,255,.04)" textAnchor="middle">NOTICIAS</text></svg></div>
              <div><span className="news-card-cat">TODAS LAS NOTICIAS</span><h3 className="news-card-title">Ver todas las noticias de Ferrari Club España</h3><div className="news-card-date">ACTUALIZADO DIARIAMENTE</div></div>
            </a>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}><a href="/noticias/" className="btn btn-o">VER TODAS LAS NOTICIAS</a></div>
        </div>
      </section>
    </>
  );
}
