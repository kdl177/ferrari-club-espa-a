import HalftoneImage from '@/components/HalftoneImage';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { pagina, fechaLarga } from '@/lib/noticias';
import { BENEFITS, PDF_INSCRIPCION } from '@/lib/socio';
import { ANIOS, deArchivo } from '@/lib/sitio';

export const revalidate = 3600;

const GALLERY_LABELS = ['TRACK', 'RUTA', 'F1', 'ELEGANCIA', 'CLUB', '', 'MARANELLO'];

function ParrillaArte() {
  return (
    <svg className="parrilla-arte" viewBox="0 0 420 520">
      <defs>
        <pattern id="p-parrilla" width="84" height="104" patternUnits="userSpaceOnUse">
          <path d="M12 50V14H40V50M54 102V66H82V102" fill="none" stroke="currentColor" strokeWidth="3" />
        </pattern>
        <linearGradient id="g-parrilla" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".35" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity=".12" />
        </linearGradient>
        <mask id="m-parrilla"><rect width="420" height="520" fill="url(#g-parrilla)" /></mask>
      </defs>
      <g mask="url(#m-parrilla)"><rect width="420" height="520" fill="url(#p-parrilla)" opacity=".34" /></g>
      <g className="blqs">
        <rect className="blq" style={{ animationDelay: '0.05s' }} x="19.5" y="24" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.12s' }} x="61.5" y="76" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.19s' }} x="103.5" y="24" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.26s' }} x="229.5" y="76" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.33s' }} x="355.5" y="24" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.40s' }} x="187.5" y="128" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.47s' }} x="145.5" y="180" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.54s' }} x="313.5" y="180" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.61s' }} x="271.5" y="232" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.68s' }} x="61.5" y="284" width="13" height="24" />
        <rect className="blq" style={{ animationDelay: '0.75s' }} x="103.5" y="336" width="13" height="24" />
      </g>
      <path d="M222 414V378H250V414" fill="none" stroke="#F0B323" strokeWidth="3" />
      <text x="262" y="400" fill="#F0B323" fontFamily="Archivo,Arial,sans-serif" fontWeight="700" fontSize="12" letterSpacing="2.4" style={{ fontStretch: '75%' }}>TU CAJÓN</text>
    </svg>
  );
}

async function proximosEventos() {
  try {
    return await prisma.evento.findMany({ where: { fecha: { gte: new Date() } }, orderBy: { fecha: 'asc' }, take: 4 });
  } catch (e) {
    console.error('No se pudieron leer los eventos:', e);
    return [];
  }
}

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const TIPO: Record<string, string> = { track: 'CIRCUITO', rutas: 'RUTA', club: 'CLUB', elegancia: 'ELEGANCIA', f1: 'FÓRMULA 1', maranello: 'MARANELLO', cavalcade: 'CAVALCADE' };

export default async function Home() {
  const [eventos, { noticias }] = await Promise.all([proximosEventos(), pagina(1)]);
  const ultimas = noticias.slice(0, 3);
  return (
    <>
      <section className="hero" id="hero">
        <div className="hero-bg" id="hbg">
          <HalftoneImage
            className="hero-ht"
            src="/club/circuito-recta.webp"
            alt="Ferrari de los socios del club en la recta de un circuito"
            cell={6}
            intensity={0.6}
            side="right"
            position="45% 52%"
            focus={[0.66, 0.45]}
            dim={0.38}
            priority
          />
        </div>

        <div className="hero-content">
          <p className="h-eye" id="h-eye">CLUB OFICIAL · DESDE 1988 · MÁS DE 200 SOCIOS</p>
          <h1 className="h-t" id="h-t"><span className="sr">Ferrari Club España. </span>Pasión por<br /><em>Il Cavallino.</em></h1>
          <p className="h-s" id="h-s">Club de propietarios Ferrari de España. Tandas en circuito, rutas, test de Fórmula 1 y visitas a la fábrica de Maranello.</p>
          <div className="h-cta" id="h-cta">
            <a href="/club/hazte-socio/" className="btn btn-p btn-lg" data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/eventos/" className="btn btn-o btn-lg">VER CALENDARIO</a>
          </div>
        </div>
        <div className="hero-num" aria-hidden="true">CFE · 1988</div>
        <div className="hero-coord" aria-hidden="true">40.4168°N · 3.7038°W</div>
      </section>

      <section className="editorial" aria-label="Espíritu Ferrari">
        <div className="cnt">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '2rem' }} data-r="right">
            <div className="sec-eye" style={{ marginBottom: 0 }}>ESPÍRITU FERRARI</div>
            <div className="editorial-linea" />
          </div>
          <span className="ew" data-r="up" style={{ transitionDelay: '.05s' }}>Passione.</span>
          <span className="ew" data-r="up" style={{ transitionDelay: '.15s' }}>Velocità.</span>
          <span className="ew accent" data-r="up" style={{ transitionDelay: '.25s' }}>Emozione.</span>
        </div>
      </section>

      <section className="band" aria-label="Il Cavallino">
        <HalftoneImage
          className="band-ht"
          src="/club/circuito-curva.webp"
          alt="Ferrari de los socios del club rodando en fila por un circuito"
          cell={5}
          intensity={0.45}
          side="left"
          position="50% 55%"
          focus={[0.34, 0.5]}
          dim={0.18}
        />
      </section>

      <section className="events-sec" aria-label="Próximos eventos">
        <div className="cnt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }} data-r="up">
            <div><div className="sec-eye">CALENDARIO</div><h2 className="sec-title" style={{ marginTop: '.75rem' }}>Próximos<br /><span style={{ color: 'var(--red)' }}>eventos</span></h2></div>
            <a href="/eventos/" className="btn btn-o btn-sm">VER TODOS →</a>
          </div>
          <div className="events-list">
            {eventos.map((e, i) => (
              <a className="ev-card" href="/eventos/" data-r="up" style={{ transitionDelay: `${i * 0.07}s` }} key={e.id}>
                <div className="ev-date"><div className="ev-day">{String(e.fecha.getUTCDate()).padStart(2, '0')}</div><div className="ev-month">{MESES[e.fecha.getUTCMonth()]}</div></div>
                <div className="ev-body"><div className="ev-type">{TIPO[e.categoria] ?? 'EVENTO'} · {e.fecha.getUTCFullYear()}</div><div className="ev-title">{e.titulo}</div><div className="ev-loc">{e.ubicacion}</div></div>
                <div className="ev-cta"><span>VER →</span></div>
              </a>
            ))}
            {eventos.length === 0 && (
              <p className="sec-sub">El calendario de la próxima temporada se publica en breve. Mientras, puedes <a href="/contacta/" style={{ color: 'var(--red)' }}>escribir a secretaría</a>.</p>
            )}
          </div>
        </div>
      </section>

      <section className="news-sec" aria-label="Últimas noticias">
        <div className="cnt">
          <div className="news-cabecera">
            <div>
              <div className="sec-eye">ACTUALIDAD</div>
              <h2 className="sec-title" style={{ marginTop: '.75rem' }}>Ferrari<br /><span style={{ color: 'var(--red)' }}>al día</span></h2>
              <p className="sec-sub" style={{ marginTop: '1.25rem', maxWidth: '30rem' }}>
                Cada Gran Premio en tres tiempos, la resistencia y las novedades de Maranello, contados por la redacción del club.
              </p>
            </div>
            <a href="/noticias/" className="btn btn-o btn-sm">TODAS LAS NOTICIAS →</a>
          </div>
          <div className="live-grid">
            {ultimas.map((n) => (
              <Link key={n.ruta} className="live-nc" href={n.ruta}>
                <div className="live-nc-img">
                  {n.portada && <Image src={n.portada} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" quality={60} unoptimized={!n.portada.startsWith('/')} />}
                </div>
                <div className="live-nc-body">
                  <div className="live-nc-meta"><span className="news-card-cat">{n.categoria.toUpperCase()}</span></div>
                  <h3 className="live-nc-title">{n.titulo}</h3>
                  <div className="live-nc-date"><time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time><span className="live-ext">LEER →</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="feature" aria-label="El club en imágenes">
        <div className="cnt feature-grid">
          <div className="feature-txt" data-r="right">
            <div className="sec-eye">ARCHIVO</div>
            <h2 className="sec-title feature-title">La <span>pista</span><br />y la ruta</h2>
            <div className="feature-specs">
              {GALLERY_LABELS.filter(Boolean).map((label) => (
                <span className="feature-tag" key={label}>{label}</span>
              ))}
            </div>
          </div>
          <div className="feature-img" data-r="left">
            <HalftoneImage
              src="/club/ruta-caravana.webp"
              alt="Caravana de Ferrari del club por una carretera de montaña"
              cell={5}
              intensity={0.5}
              side="right"
              position="45% 50%"
              focus={[0.55, 0.5]}
              dim={0}
              fondo="#3A0F0D"
            />
          </div>
        </div>
      </section>

      <section className="club-sec" aria-label="Sobre el club">
        <div className="cnt">
          <div className="split">
            <div data-r="right">
              <div className="sec-eye">NUESTRO CLUB</div>
              <h2 className="sec-title" style={{ marginTop: '1.25rem' }}>Club oficial<br /><span style={{ color: 'var(--red)' }}>desde 1988</span></h2>
              <p className="sec-sub" style={{ marginTop: '1.5rem' }}>Creado en 1988 como club exclusivo para propietarios de Ferrari. Desde 2006 recibe el apoyo directo de la marca y es el único Club Oficial del Cavallino en España.</p>
              <div className="stats4">
                <div className="stat"><span className="stat-n" data-count="200" data-suffix="+">200+</span><span className="stat-l">SOCIOS</span></div>
                <div className="stat"><span className="stat-n" data-count="1988">1988</span><span className="stat-l">FUNDACIÓN</span></div>
                <div className="stat"><span className="stat-n" data-count={ANIOS}>{ANIOS}</span><span className="stat-l">AÑOS</span></div>
                <div className="stat"><span className="stat-n" data-count="2006">2006</span><span className="stat-l">OFICIAL FERRARI</span></div>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                <a href="/club/" className="btn btn-p" data-mag>CONOCE EL CLUB <span className="btn-ico">→</span></a>
                <a href="/club/hazte-socio/" className="btn btn-o">HAZTE SOCIO</a>
              </div>
            </div>
            <div data-r="left">
              <div className="club-frame">
                <div className="cf-corner cf-tr" /><div className="cf-corner cf-bl" />
                <p style={{ fontFamily: 'var(--fe)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--white)', lineHeight: 1.9, marginBottom: '2rem' }}>
                  &ldquo;Si eres propietario de un Ferrari y deseas compartir con nosotros tu pasión por <em>Il Cavallino</em>, hazte Socio del Ferrari Club España.&rdquo;
                </p>
                <div className="rl" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                  <div><span className="tech-l">TIPO</span><p style={{ fontFamily: 'var(--fh)', fontSize: '1rem', color: 'var(--white)', marginTop: '.35rem' }}>Club Oficial</p></div>
                  <div><span className="tech-l">SEDE</span><p style={{ fontFamily: 'var(--fh)', fontSize: '1rem', color: 'var(--white)', marginTop: '.35rem' }}>Madrid</p></div>
                  <div><span className="tech-l">AVALADO</span><p style={{ fontFamily: 'var(--fh)', fontSize: '1rem', color: 'var(--red)', marginTop: '.35rem' }}>Ferrari S.p.A.</p></div>
                </div>
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--w08)' }}>
                  <div className="sec-eye" style={{ fontSize: '.7rem', marginBottom: '.85rem' }}>ACTIVIDADES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                    {['TRACK DAYS', 'RUTAS', 'FÓRMULA 1', 'MARANELLO', 'CAVALCADE', 'ELEGANCIA'].map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.08em', padding: '.4rem .9rem',
                          border: `1px solid ${t === 'CAVALCADE' ? 'var(--red-20)' : 'var(--w20)'}`,
                          color: t === 'CAVALCADE' ? 'var(--red)' : 'var(--w60)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mem-sec" aria-label="Membresía">
        <div className="cnt">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }} data-r="up">
            <div className="sec-eye" style={{ justifyContent: 'center', marginBottom: '1rem' }}>ÚNETE AL CLUB</div>
            <h2 className="sec-title">Hazte<br /><span style={{ color: 'var(--red)' }}>socio</span></h2>
            <p className="sec-sub" style={{ maxWidth: '520px', margin: '1rem auto 0', textAlign: 'center' }}>Si tienes un Ferrari, esto es lo que el club organiza para sus socios a lo largo del año.</p>
          </div>
          <div className="benefit-grid">
            {BENEFITS.slice(0, 6).map((b) => (
              <div className="ben-item" data-r="up" key={b.title}><div className="ben-title">{b.title}</div><div className="ben-desc">{b.desc}</div></div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }} data-r="up">
            <a href="/club/hazte-socio/" className="btn btn-p" data-mag>SOLICITAR EL INGRESO <span className="btn-ico">→</span></a>
            <a href={deArchivo(PDF_INSCRIPCION)} className="btn btn-o" target="_blank" rel="noopener">FORMULARIO EN PDF <span className="btn-ico">↓</span></a>
          </div>
          <p style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: 'var(--w60)', textAlign: 'center', marginTop: '2rem' }} data-r="up">
            Secretaría: <a href="tel:+34915754160" style={{ color: 'var(--red)' }}>+34 91 575 41 60</a> · <a href="mailto:ferrari@ferrariclubespana.com" style={{ color: 'var(--red)' }}>ferrari@ferrariclubespana.com</a>
          </p>
        </div>
      </section>

      <section className="finale" aria-label="Llamada a la acción">
        <div className="cnt finale-grid">
          <div className="finale-txt" data-r="up">
            <div className="sec-eye" style={{ marginBottom: '1.5rem' }}>PASSIONE PER SEMPRE</div>
            <h2 className="finale-title">Tu cajón<br /><span>te espera.</span></h2>
            <p className="sec-sub" style={{ maxWidth: '44ch' }}>Si eres propietario de un Ferrari y deseas compartir con nosotros tu pasión por Il Cavallino, hazte socio del Ferrari Club España.</p>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
              <a href="/club/hazte-socio/" className="btn btn-p btn-lg">HAZTE SOCIO <span className="btn-ico">→</span></a>
              <a href="/contacta/" className="btn btn-o btn-lg">CONTACTAR</a>
            </div>
            <div className="finale-stats">
              <div><span className="fin-stat-n" data-count="200" data-suffix="+">200+</span><span className="fin-stat-l">SOCIOS</span></div>
              <div><span className="fin-stat-n" data-count={ANIOS}>{ANIOS}</span><span className="fin-stat-l">AÑOS</span></div>
              <div><span className="fin-stat-n" data-count="1">1</span><span className="fin-stat-l">CLUB OFICIAL</span></div>
            </div>
          </div>
          <div className="finale-arte" data-r="left" aria-hidden="true">
            <ParrillaArte />
          </div>
        </div>
      </section>
    </>
  );
}
