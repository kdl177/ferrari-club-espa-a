import HomeInteractions from '@/components/HomeInteractions';
import HalftoneImage from '@/components/HalftoneImage';

const MACHINES = [
  {
    tag: 'SF-90', color: 'rgba(218,41,28,.08)', bg: '#0A0A0A', ringColor: 'rgba(218,41,28,.15)',
    model: 'IBRIDO · 2024', name: <>SF-90 XX<br />Stradale</>,
    specs: [['POTENCIA', '1030 CV'], ['0–100 km/h', '2.3 s'], ['V. MÁX', '320 km/h'], ['MOTOR', 'V8 + 3 eléctricos']],
  },
  {
    tag: 'ROMA', color: 'rgba(218,41,28,.07)', bg: '#0A0A0A', ringColor: 'rgba(218,41,28,.12)',
    model: 'GT SPIDER · 2023', name: <>Roma<br />Spider</>,
    specs: [['POTENCIA', '620 CV'], ['0–100 km/h', '3.4 s'], ['V. MÁX', '320 km/h'], ['MOTOR', 'V8 biturbo 3.9 L']],
  },
  {
    tag: '296', color: 'rgba(218,41,28,.07)', bg: '#0A0A0A', ringColor: 'rgba(255,255,255,.06)',
    model: 'IBRIDO · 2022', name: <>296<br />GTB</>,
    specs: [['POTENCIA', '830 CV'], ['0–100 km/h', '2.9 s'], ['V. MÁX', '330 km/h'], ['MOTOR', 'V6 + eléctrico']],
  },
  {
    tag: '812', color: 'rgba(218,41,28,.07)', bg: '#0A0A0A', ringColor: 'rgba(218,41,28,.1)',
    model: 'GT · 2021', name: <>812<br />Competizione</>,
    specs: [['POTENCIA', '830 CV'], ['0–100 km/h', '2.85 s'], ['V. MÁX', '340 km/h'], ['MOTOR', 'V12 N/A 6.5 L']],
  },
  {
    tag: 'PUROSANGUE', color: 'rgba(218,41,28,.07)', bg: '#0A0A0A', ringColor: 'rgba(218,41,28,.09)',
    model: 'SUV · 2023', name: 'Purosangue',
    specs: [['POTENCIA', '725 CV'], ['0–100 km/h', '3.3 s'], ['V. MÁX', '310 km/h'], ['MOTOR', 'V12 N/A 6.5 L']],
  },
];

const EVENTS = [
  { day: '11', month: 'SEP', type: 'FÓRMULA 1 · GRAN PREMIO', title: 'GP España F1 — Circuito de Madrid', loc: 'Circuito de Madrid · Madrid, España', q: 'GP+Espa%C3%B1a+F1+%E2%80%94+Circuito+de+Madrid' },
  { day: '18', month: 'SEP', type: 'TRACK DAY · CIRCUITO', title: 'Uclés — Segóbriga', loc: 'Circuito de Uclés · Cuenca, España', q: 'Track+Day+Ucl%C3%A9s+%E2%80%94+Seg%C3%B3briga' },
  { day: '01', month: 'OCT', type: 'CONCURSO · ELEGANCIA', title: 'Concurso de Elegancia Costa del Sol', loc: 'Marbella · Málaga, España', q: 'Concurso+de+Elegancia+Costa+del+Sol' },
  { day: '07', month: 'NOV', type: 'SOLIDARIO · TRACK DAY', title: 'Tandas Solidarias — Circuito Calafat', loc: 'Circuito de Calafat · Tarragona, España', q: 'Tandas+Solidarias+%E2%80%94+Circuito+Calafat' },
];

const GALLERY_LABELS = ['TRACK', 'RUTA', 'F1', 'ELEGANCIA', 'CLUB', '', 'MARANELLO'];

export default function Home() {
  return (
    <>
      <section className="hero" id="hero">
        <HomeInteractions />
        <div className="hero-bg" id="hbg">
          <HalftoneImage
            className="hero-ht"
            src="/ferrari-hero.jpg"
            alt="Ferrari Testarossa roja fotografiada de perfil sobre pista"
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
          <h1 className="h-t" id="h-t">FERRARI<em>CLUB</em><small>ESPAÑA</small></h1>
          <p className="h-s" id="h-s"><em>Club de Propietarios y Apasionados de Ferrari</em></p>
          <div className="h-cta" id="h-cta">
            <a href="/club/hazte-socio/" className="btn btn-p btn-lg" data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/noticias/" className="btn btn-o btn-lg">ÚLTIMAS NOTICIAS</a>
          </div>
        </div>
        <div className="hero-num" aria-hidden="true">CFE · 1988</div>
        <div className="hero-coord" aria-hidden="true">40.4168°N · 3.7038°W</div>
      </section>

      <section className="editorial" aria-label="Espíritu Ferrari">
        <div className="cnt">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '2rem' }} data-r="right">
            <div className="sec-eye" style={{ marginBottom: 0, color: 'rgba(0,0,0,.55)' }}>ESPÍRITU FERRARI</div>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,.2)' }} />
          </div>
          <span className="ew" data-r="up" style={{ transitionDelay: '.05s' }}>PASSIONE.</span>
          <span className="ew" data-r="up" style={{ transitionDelay: '.15s' }}>VELOCITÀ.</span>
          <span className="ew accent" data-r="up" style={{ transitionDelay: '.25s' }}>EMOZIONE.</span>
        </div>
      </section>

      <section className="band" aria-label="Il Cavallino">
        <HalftoneImage
          className="band-ht"
          src="/ferrari-hero.jpg"
          alt="Detalle del escudo Cavallino Rampante sobre la carrocería de un Ferrari"
          cell={7}
          intensity={0.7}
          side="left"
          position="52% 42%"
          focus={[0.34, 0.5]}
          dim={0.34}
        />
        <div className="band-meta" aria-hidden="true">
          <span>MARANELLO</span>
          <span>—</span>
          <span>IL CAVALLINO RAMPANTE</span>
        </div>
      </section>

      <section className="machine-wrap" aria-label="Modelos Ferrari">
        <div className="cnt" style={{ paddingBottom: '2.5rem' }}>
          <div data-r="up">
            <div className="sec-eye">LOS COCHES</div>
            <h2 className="sec-title" style={{ marginTop: '.6rem' }}>THE <span style={{ color: 'var(--red)' }}>MACHINE</span></h2>
          </div>
        </div>
        <div className="machine-scroll" id="machine-scroll">
          <div className="machine-track" id="mtrack">
            {MACHINES.map((m) => (
              <div className="mcard" key={m.tag}>
                <div className="mcard-img">
                  <svg width="100%" height="100%" viewBox="0 0 400 200" aria-hidden="true">
                    <rect width="100%" height="100%" fill={m.bg} />
                    <text x="200" y="115" fontFamily="Archivo" fontSize="40" fill={m.color} textAnchor="middle" letterSpacing="3">{m.tag}</text>
                    <g fill="none" stroke={m.ringColor} strokeWidth="1.2" transform="translate(200,125)">
                      <path d="M-155 13 Q-110 25 -55 31 Q0 36 55 31 Q110 25 155 13" />
                      <path d="M-105 13 Q-85 -14 -38 -24 Q0 -30 38 -24 Q85 -14 105 13" />
                      <circle cx="-83" cy="20" r="24" /><circle cx="83" cy="20" r="24" />
                    </g>
                  </svg>
                </div>
                <div className="mcard-model">{m.model}</div>
                <div className="mcard-name">{m.name}</div>
                <div className="mcard-specs">
                  {m.specs.map(([l, v]) => (
                    <div className="mspec" key={l}><span className="mspec-l">{l}</span><span className="mspec-v">{v}</span></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mtrack-dots" id="mtrack-dots" aria-hidden="true" />
      </section>

      <section className="events-sec" aria-label="Próximos eventos">
        <div className="cnt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }} data-r="up">
            <div><div className="sec-eye">CALENDARIO 2026</div><h2 className="sec-title" style={{ marginTop: '.75rem' }}>PRÓXIMOS<br /><span style={{ color: 'var(--red)' }}>EVENTOS</span></h2></div>
            <a href="/contacta/" className="btn btn-o btn-sm">VER TODOS →</a>
          </div>
          <div className="events-list">
            {EVENTS.map((e, i) => (
              <a className="ev-card" href={`/contacta/?asunto=eventos&evento=${e.q}`} data-r="up" style={{ transitionDelay: `${i * 0.07}s` }} key={e.title}>
                <div className="ev-date"><div className="ev-day">{e.day}</div><div className="ev-month">{e.month}</div></div>
                <div className="ev-body"><div className="ev-type">{e.type}</div><div className="ev-title">{e.title}</div><div className="ev-loc">{e.loc}</div></div>
                <div className="ev-cta"><span>RESERVAR →</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="news-sec" aria-label="Últimas noticias">
        <div className="cnt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }} data-r="up">
            <div><div className="sec-eye">ACTUALIDAD</div><h2 className="sec-title" style={{ marginTop: '.75rem' }}>FERRARI<br /><span style={{ color: 'var(--red)' }}>MAGAZINE</span></h2></div>
            <a href="/noticias/" className="btn btn-o btn-sm">VER TODAS →</a>
          </div>
          <div className="news-layout">
            <a className="news-card" href="/noticias/gp-paises-bajos/" data-r="right">
              <div className="news-card-img" style={{ aspectRatio: '16/8' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                  <defs><radialGradient id="ng0" cx="50%" cy="50%" r="65%"><stop offset="0%" stopColor="#0A0A0A" /><stop offset="100%" stopColor="#0A0A0A" /></radialGradient></defs>
                  <rect width="100%" height="100%" fill="url(#ng0)" />
                  <text x="400" y="225" fontFamily="Archivo" fontSize="80" fill="rgba(218,41,28,.08)" textAnchor="middle" letterSpacing="5">F1</text>
                  <g stroke="rgba(218,41,28,.03)" fill="none"><line x1="0" y1="133" x2="800" y2="133" /><line x1="0" y1="267" x2="800" y2="267" /></g>
                </svg>
              </div>
              <div>
                <span className="news-card-cat">FÓRMULA 1</span>
                <h2 className="news-card-title" style={{ fontSize: '1.45rem' }}>GP Países Bajos — Ferrari saldrá a Zandvoort a seguir mejorando</h2>
                <p className="news-card-desc">Ferrari afronta el Gran Premio de Países Bajos con renovadas esperanzas. El equipo lleva importantes mejoras aerodinámicas para el trazado costero.</p>
                <div className="news-card-date">18 AGO 2026 · 4 MIN LECTURA</div>
              </div>
            </a>
            <div className="news-side">
              {[
                { href: '/noticias/499p-monza/', tag: 'WEC', cat: 'ENDURANCE', title: 'Ferrari 499P domina en Monza', date: '12 AGO 2026', delay: 0 },
                { href: '/noticias/sf90-xx-stradale/', tag: 'SF90 XX', cat: 'MODELOS', title: 'SF90 XX Stradale: el más potente', date: '08 AGO 2026', delay: 0.08 },
                { href: '/noticias/', tag: 'CAVALCADE', cat: 'CLUB', title: 'Cavalcade Classiche 2026 — Italia', date: '05 AGO 2026', delay: 0.16 },
                { href: '/noticias/', tag: 'F1', cat: 'FÓRMULA 1', title: 'Sainz remonta en Hungría', date: '28 JUL 2026', delay: 0.24 },
              ].map((n) => (
                <a className="news-card" href={n.href} data-r="left" style={{ display: 'flex', gap: '1rem', transitionDelay: `${n.delay}s` }} key={n.title}>
                  <div className="news-card-img" style={{ width: '110px', flexShrink: 0, height: '75px', aspectRatio: 'unset' }}>
                    <svg width="100%" height="100%" viewBox="0 0 110 75" aria-hidden="true">
                      <rect width="100%" height="100%" fill="#0A0A0A" />
                      <text x="55" y="42" fontFamily="Archivo" fontSize="10" fill="rgba(218,41,28,.14)" textAnchor="middle">{n.tag}</text>
                    </svg>
                  </div>
                  <div><span className="news-card-cat">{n.cat}</span><h3 className="news-card-title" style={{ fontSize: '.88rem' }}>{n.title}</h3><div className="news-card-date">{n.date}</div></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="feature" aria-label="El club en imágenes">
        <div className="cnt feature-grid">
          <div className="feature-txt" data-r="right">
            <div className="sec-eye">ARCHIVO</div>
            <h2 className="sec-title feature-title">LA <span>PISTA</span><br />Y LA RUTA</h2>
            <div className="feature-specs">
              {GALLERY_LABELS.filter(Boolean).map((label) => (
                <span className="feature-tag" key={label}>{label}</span>
              ))}
            </div>
          </div>
          <div className="feature-img" data-r="left">
            <HalftoneImage
              src="/ferrari-hero.jpg"
              alt="Llanta y paso de rueda de un Ferrari Testarossa"
              cell={5}
              intensity={0.55}
              side="right"
              position="72% 70%"
              focus={[0.55, 0.5]}
              dim={0.12}
            />
          </div>
        </div>
      </section>

      <section className="club-sec" aria-label="Sobre el club">
        <div className="cnt">
          <div className="split">
            <div data-r="right">
              <div className="sec-eye">NUESTRO CLUB</div>
              <h2 className="sec-title" style={{ marginTop: '1.25rem' }}>CLUB OFICIAL<br /><span style={{ color: 'var(--red)' }}>DESDE 1988</span></h2>
              <p className="sec-sub" style={{ marginTop: '1.5rem' }}>El único club oficial de <em>Il Cavallino Rampante</em> en España con respaldo directo de Ferrari S.p.A. desde 2006. Propietarios de Ferrari unidos por la misma pasión.</p>
              <div className="stats4">
                <div className="stat"><span className="stat-n" data-count="200" data-suffix="+">200+</span><span className="stat-l">SOCIOS</span></div>
                <div className="stat"><span className="stat-n" data-count="1988">1988</span><span className="stat-l">FUNDACIÓN</span></div>
                <div className="stat"><span className="stat-n" data-count="38">38</span><span className="stat-l">AÑOS</span></div>
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
            <h2 className="sec-title">HAZTE<br /><span style={{ color: 'var(--red)' }}>SOCIO</span></h2>
            <p className="sec-sub" style={{ maxWidth: '500px', margin: '1rem auto 0', textAlign: 'center' }}>Elige tu nivel de membresía y únete a la comunidad Ferrari más exclusiva de España.</p>
          </div>
          <div className="mem-grid">
            <div className="mem-card" data-r="up">
              <div className="sec-eye" style={{ fontSize: '.72rem', marginBottom: '1.25rem' }}>SOCIO BASE</div>
              <div className="mem-price">Cuota<span> anual</span></div>
              <ul className="mem-features">
                <li>Carnet oficial de socio</li><li>Acceso a eventos del club</li><li>Acceso a publicaciones del club</li><li>Directorio de socios</li><li>Descuentos en concesionarios</li>
              </ul>
              <a href="/contacta/" className="btn btn-o" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}>SOLICITAR INFO <span className="btn-ico">→</span></a>
            </div>
            <div className="mem-card featured" data-r="up" style={{ transitionDelay: '.1s' }}>
              <div className="sec-eye" style={{ fontSize: '.72rem', marginBottom: '1.25rem' }}>SOCIO ACTIVO</div>
              <div className="mem-price">PLENA<span> participación</span></div>
              <ul className="mem-features">
                <li>Todo lo del socio base</li><li>Track days y rutas</li><li>Visitas a Maranello</li><li>GP Fórmula 1 (descuento)</li><li>Cavalcade Classiche</li><li>Concursos de elegancia</li><li>Voto en asamblea</li>
              </ul>
              <a href="/club/hazte-socio/" className="btn btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            </div>
            <div className="mem-card" data-r="up" style={{ transitionDelay: '.2s' }}>
              <div className="sec-eye" style={{ fontSize: '.72rem', marginBottom: '1.25rem' }}>SOCIO FAMILIAR</div>
              <div className="mem-price">CUOTA<span> familiar</span></div>
              <ul className="mem-features">
                <li>2 miembros por cuota</li><li>Todos los beneficios activos</li><li>Invitaciones dobles</li><li>Área socios compartida</li><li>Prioridad en eventos</li>
              </ul>
              <a href="/contacta/" className="btn btn-o" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }}>CONTACTAR <span className="btn-ico">→</span></a>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: 'var(--w60)', textAlign: 'center', marginTop: '2rem' }} data-r="up">
            Secretaría: <a href="tel:+34915754160" style={{ color: 'var(--red)' }}>+34 91 575 41 60</a> · <a href="mailto:ferrari@ferrariclubespana.com" style={{ color: 'var(--red)' }}>ferrari@ferrariclubespana.com</a>
          </p>
        </div>
      </section>

      <section className="finale" aria-label="Llamada a la acción">
        <div className="cnt" style={{ position: 'relative', zIndex: 1 }}>
          <div data-r="up">
            <div className="sec-eye" style={{ justifyContent: 'center', marginBottom: '2rem', color: 'rgba(240,228,210,.5)' }}>PASSIONE PER SEMPRE</div>
            <h2 className="finale-title">PASSION<br /><span>IN MOTION</span></h2>
          </div>
          <p style={{ fontFamily: 'var(--fe)', fontStyle: 'italic', fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(240,228,210,.7)', maxWidth: '460px', margin: '1.5rem auto 3rem', textAlign: 'center', lineHeight: 1.75 }} data-r="up">
            <em>Únete a la comunidad oficial de propietarios y apasionados de Ferrari en España</em>
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} data-r="up">
            <a href="/club/hazte-socio/" className="btn btn-w btn-lg">HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/contacta/" className="btn btn-wo btn-lg">CONTACTAR</a>
          </div>
          <div style={{ display: 'flex', gap: '5rem', justifyContent: 'center', marginTop: '5rem', flexWrap: 'wrap' }} data-r="up">
            <div style={{ textAlign: 'center' }}><span className="fin-stat-n" data-count="200" data-suffix="+">200+</span><span className="fin-stat-l">SOCIOS</span></div>
            <div style={{ textAlign: 'center' }}><span className="fin-stat-n" data-count="38">38</span><span className="fin-stat-l">AÑOS</span></div>
            <div style={{ textAlign: 'center' }}><span className="fin-stat-n" data-count="1">1</span><span className="fin-stat-l">CLUB OFICIAL</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
