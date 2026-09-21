import HomeInteractions from '@/components/HomeInteractions';
import HalftoneImage from '@/components/HalftoneImage';
import Foto from '@/components/Foto';

const MACHINES = [
  {
    slug: 'sf90-xx-stradale', model: 'HÍBRIDO ENCHUFABLE · 2023', name: <>SF90 XX<br />Stradale</>, dato: '799 unidades',
    texto: 'La versión más extrema del SF90 y el primer modelo XX homologado para circular por carretera. Su aerodinámica genera 530 kg de carga a 250 km/h.',
    specs: [['POTENCIA', '1030 CV'], ['PAR MÁXIMO', '804 Nm'], ['0–100 km/h', '2,3 s'], ['V. MÁX', '320 km/h'], ['MOTOR', 'V8 biturbo 3.990 cc + 3 eléctricos'], ['PESO EN SECO', '1.560 kg']],
    foto: { autor: 'Calreyn88', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_SF90_XX_Stradale_1.jpg', alt: 'Ferrari SF90 XX Stradale rojo con alerón trasero fijo, vista frontal tres cuartos' },
  },
  {
    slug: 'roma-spider', model: 'GT DESCAPOTABLE · 2023', name: <>Roma<br />Spider</>, dato: 'Capota en 13,5 s',
    texto: 'El Roma a cielo abierto, presentado en marzo de 2023. Su capota de lona se pliega en 13,5 segundos y mantiene las proporciones del coupé.',
    specs: [['POTENCIA', '620 CV'], ['PAR MÁXIMO', '760 Nm'], ['0–100 km/h', '3,4 s'], ['V. MÁX', '> 320 km/h'], ['MOTOR', 'V8 biturbo 3.855 cc'], ['PESO EN SECO', '1.556 kg']],
    foto: { autor: 'Pangalau', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:2024_Ferrari_Roma_Spider_in_Adelaide,_Australia.jpg', alt: 'Ferrari Roma Spider gris azulado con la capota abierta en un concesionario' },
  },
  {
    slug: '296-gtb', model: 'HÍBRIDO ENCHUFABLE · 2021', name: <>296<br />GTB</>, dato: '25 km en eléctrico',
    texto: 'El primer V6 de calle con el emblema del Cavallino: un tres litros biturbo con los cilindros a 120° y apoyo eléctrico enchufable, en posición central trasera.',
    specs: [['POTENCIA', '830 CV'], ['PAR MÁXIMO', '740 Nm'], ['0–100 km/h', '2,9 s'], ['V. MÁX', '> 330 km/h'], ['MOTOR', 'V6 biturbo 2.992 cc + eléctrico'], ['PESO EN SECO', '1.470 kg']],
    foto: { autor: 'Alexander Migl', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_296_GTB_1X7A6377.jpg', alt: 'Ferrari 296 GTB amarillo aparcado, vista frontal tres cuartos' },
  },
  {
    slug: '812-competizione', model: 'SERIE LIMITADA · 2021', name: <>812<br />Competizione</>, dato: '999 unidades',
    texto: 'La serie limitada del 812 Superfast, pensada para circuito. Su V12 atmosférico gira hasta 9.500 rpm, en su lanzamiento el régimen más alto de un Ferrari de calle.',
    specs: [['POTENCIA', '830 CV'], ['PAR MÁXIMO', '692 Nm'], ['0–100 km/h', '2,85 s'], ['V. MÁX', '> 340 km/h'], ['MOTOR', 'V12 atmosférico 6.496 cc'], ['PESO EN SECO', '1.487 kg']],
    foto: { autor: 'Calreyn88', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_812_Competizione_2.jpg', alt: 'Ferrari 812 Competizione gris sobre césped en una concentración' },
  },
  {
    slug: 'purosangue', model: 'CUATRO PUERTAS · 2022', name: 'Purosangue', dato: '4 puertas · 4 plazas',
    texto: 'El primer Ferrari de producción con cuatro puertas y cuatro plazas. Conserva un V12 atmosférico de 6,5 litros, con el par máximo de 716 Nm a 6.250 rpm.',
    specs: [['POTENCIA', '725 CV'], ['PAR MÁXIMO', '716 Nm'], ['0–100 km/h', '3,3 s'], ['V. MÁX', '> 310 km/h'], ['MOTOR', 'V12 atmosférico 6.496 cc'], ['PESO EN SECO', '2.033 kg']],
    foto: { autor: 'Alexander Migl', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_Purosangue_DSC_7008.jpg', alt: 'Ferrari Purosangue gris mate frente a un concesionario, vista frontal tres cuartos' },
  },
];

const EVENTS = [
  { day: '11', month: 'SEP', type: 'FÓRMULA 1 · GRAN PREMIO', title: 'GP España F1 — Circuito de Madrid', loc: 'Circuito de Madrid · Madrid, España', q: 'GP+Espa%C3%B1a+F1+%E2%80%94+Circuito+de+Madrid' },
  { day: '18', month: 'SEP', type: 'TRACK DAY · CIRCUITO', title: 'Uclés — Segóbriga', loc: 'Circuito de Uclés · Cuenca, España', q: 'Track+Day+Ucl%C3%A9s+%E2%80%94+Seg%C3%B3briga' },
  { day: '01', month: 'OCT', type: 'CONCURSO · ELEGANCIA', title: 'Concurso de Elegancia Costa del Sol', loc: 'Marbella · Málaga, España', q: 'Concurso+de+Elegancia+Costa+del+Sol' },
  { day: '07', month: 'NOV', type: 'SOLIDARIO · TRACK DAY', title: 'Tandas Solidarias — Circuito Calafat', loc: 'Circuito de Calafat · Tarragona, España', q: 'Tandas+Solidarias+%E2%80%94+Circuito+Calafat' },
];

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
          <h1 className="h-t" id="h-t"><span className="sr">Ferrari Club España. </span>Pasión por<br /><em>Il Cavallino.</em></h1>
          <p className="h-s" id="h-s">Club de Propietarios y Apasionados de Ferrari. Track days, rutas, Fórmula 1, visitas a Maranello y una cena de gala al año.</p>
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
          src="/fotos/cavalcade-dinos.webp"
          alt="Fila de Ferrari Dino rojos aparcados en una concentración de Ferrari"
          cell={5}
          intensity={0.45}
          side="left"
          position="50% 55%"
          focus={[0.34, 0.5]}
          dim={0.18}
        />
        <div className="band-meta" aria-hidden="true">
          <span>CAVALCADE</span>
          <span>—</span>
          <span>50 AÑOS DE FERRARI · REINO UNIDO</span>
        </div>
        <p className="foto-credito band-credito">Foto: <a href="https://commons.wikimedia.org/wiki/File:Cavalcade_of_Ferraris_at_the_Liner_Terminal_celebrating_50_years_of_Ferrari_in_the_UK.jpg" target="_blank" rel="noopener">Peter Gill</a> · CC BY 3.0 · adaptada</p>
      </section>

      <section className="machine-wrap" aria-label="Modelos Ferrari">
        <div className="cnt" style={{ paddingBottom: '2.5rem' }}>
          <div data-r="up">
            <div className="sec-eye">LOS COCHES</div>
            <h2 className="sec-title" style={{ marginTop: '.6rem' }}>The <span style={{ color: 'var(--red)' }}>machine</span></h2>
          </div>
        </div>
        <div className="machine-scroll" id="machine-scroll">
          <div className="machine-track" id="mtrack">
            {MACHINES.map((m) => (
              <article className="mcard" key={m.slug}>
                <figure className="mcard-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/coches/${m.slug}.webp`} alt={m.foto.alt} width={1040} height={650} loading="lazy" decoding="async" />
                  <span className="mcard-dato">{m.dato}</span>
                  <figcaption>
                    Foto: <a href={m.foto.url} target="_blank" rel="noopener">{m.foto.autor}</a> · {m.foto.licencia} · recortada
                  </figcaption>
                </figure>
                <div className="mcard-model">{m.model}</div>
                <h3 className="mcard-name">{m.name}</h3>
                <p className="mcard-texto">{m.texto}</p>
                <div className="mcard-specs">
                  {m.specs.map(([l, v]) => (
                    <div className="mspec" key={l}><span className="mspec-l">{l}</span><span className="mspec-v">{v}</span></div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mtrack-dots" id="mtrack-dots" aria-hidden="true" />
        <p className="cnt machine-fuente">Cifras oficiales de Ferrari S.p.A. (ferrari.com); peso en seco con equipamiento opcional. Fotografías de Wikimedia Commons bajo licencia Creative Commons.</p>
      </section>

      <section className="events-sec" aria-label="Próximos eventos">
        <div className="cnt">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }} data-r="up">
            <div><div className="sec-eye">CALENDARIO 2026</div><h2 className="sec-title" style={{ marginTop: '.75rem' }}>Próximos<br /><span style={{ color: 'var(--red)' }}>eventos</span></h2></div>
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
            <div><div className="sec-eye">ACTUALIDAD</div><h2 className="sec-title" style={{ marginTop: '.75rem' }}>Ferrari<br /><span style={{ color: 'var(--red)' }}>magazine</span></h2></div>
            <a href="/noticias/" className="btn btn-o btn-sm">VER TODAS →</a>
          </div>
          <div className="news-layout">
            <a className="news-card" href="/noticias/gp-paises-bajos/" data-r="right">
              <div className="news-card-img" style={{ aspectRatio: '16/8' }}><Foto id="f1-zandvoort-2024" /></div>
              <div>
                <span className="news-card-cat">FÓRMULA 1</span>
                <h2 className="news-card-title" style={{ fontSize: '1.45rem' }}>GP Países Bajos — Ferrari saldrá a Zandvoort a seguir mejorando</h2>
                <p className="news-card-desc">Ferrari afronta el Gran Premio de Países Bajos con renovadas esperanzas. El equipo lleva importantes mejoras aerodinámicas para el trazado costero.</p>
                <div className="news-card-date">18 AGO 2026 · 4 MIN LECTURA</div>
              </div>
            </a>
            <div className="news-side">
              {[
                { href: '/noticias/499p-monza/', foto: '499p-spa-2023' as const, tag: 'WEC', cat: 'ENDURANCE', title: 'Ferrari 499P domina en Monza', date: '12 AGO 2026', delay: 0 },
                { href: '/noticias/sf90-xx-stradale/', foto: 'sf90-xx-stradale' as const, tag: 'SF90 XX', cat: 'MODELOS', title: 'SF90 XX Stradale: el más potente', date: '08 AGO 2026', delay: 0.08 },
                { href: '/noticias/', foto: 'cavalcade-pista' as const, tag: 'CAVALCADE', cat: 'CLUB', title: 'Cavalcade Classiche 2026 — Italia', date: '05 AGO 2026', delay: 0.16 },
                { href: '/noticias/', foto: 'sainz-china-2024' as const, tag: 'F1', cat: 'FÓRMULA 1', title: 'Sainz remonta en Hungría', date: '28 JUL 2026', delay: 0.24 },
              ].map((n) => (
                <a className="news-card" href={n.href} data-r="left" style={{ display: 'flex', gap: '1rem', transitionDelay: `${n.delay}s` }} key={n.title}>
                  <div className="news-card-img" style={{ width: '110px', flexShrink: 0, height: '75px', aspectRatio: 'unset' }}><Foto id={n.foto} mini /></div>
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
            <h2 className="sec-title feature-title">La <span>pista</span><br />y la ruta</h2>
            <div className="feature-specs">
              {GALLERY_LABELS.filter(Boolean).map((label) => (
                <span className="feature-tag" key={label}>{label}</span>
              ))}
            </div>
          </div>
          <div className="feature-img" data-r="left">
            <HalftoneImage
              src="/fotos/488-challenge-amarillo.webp"
              alt="Ferrari 488 Challenge amarillo con el dorsal 80 en un tramo de circuito"
              cell={5}
              intensity={0.5}
              side="right"
              position="45% 50%"
              focus={[0.55, 0.5]}
              dim={0}
              fondo="#3A0F0D"
            />
            <p className="foto-credito">Foto: <a href="https://commons.wikimedia.org/wiki/File:Ferrari_488_Challenge_(35590398851).jpg" target="_blank" rel="noopener">Neil</a> · CC BY 2.0 · adaptada</p>
          </div>
        </div>
      </section>

      <section className="club-sec" aria-label="Sobre el club">
        <div className="cnt">
          <div className="split">
            <div data-r="right">
              <div className="sec-eye">NUESTRO CLUB</div>
              <h2 className="sec-title" style={{ marginTop: '1.25rem' }}>Club oficial<br /><span style={{ color: 'var(--red)' }}>desde 1988</span></h2>
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
            <h2 className="sec-title">Hazte<br /><span style={{ color: 'var(--red)' }}>socio</span></h2>
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
              <div className="mem-price">Plena<span> participación</span></div>
              <ul className="mem-features">
                <li>Todo lo del socio base</li><li>Track days y rutas</li><li>Visitas a Maranello</li><li>GP Fórmula 1 (descuento)</li><li>Cavalcade Classiche</li><li>Concursos de elegancia</li><li>Voto en asamblea</li>
              </ul>
              <a href="/club/hazte-socio/" className="btn btn-p" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            </div>
            <div className="mem-card" data-r="up" style={{ transitionDelay: '.2s' }}>
              <div className="sec-eye" style={{ fontSize: '.72rem', marginBottom: '1.25rem' }}>SOCIO FAMILIAR</div>
              <div className="mem-price">Cuota<span> familiar</span></div>
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
        <div className="cnt finale-grid">
          <div className="finale-txt" data-r="up">
            <div className="sec-eye" style={{ marginBottom: '1.5rem' }}>PASSIONE PER SEMPRE</div>
            <h2 className="finale-title">Tu cajón<br /><span>te espera.</span></h2>
            <p className="sec-sub" style={{ maxWidth: '44ch' }}>Únete a la comunidad oficial de propietarios y apasionados de Ferrari en España</p>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
              <a href="/club/hazte-socio/" className="btn btn-p btn-lg">HAZTE SOCIO <span className="btn-ico">→</span></a>
              <a href="/contacta/" className="btn btn-o btn-lg">CONTACTAR</a>
            </div>
            <div className="finale-stats">
              <div><span className="fin-stat-n" data-count="200" data-suffix="+">200+</span><span className="fin-stat-l">SOCIOS</span></div>
              <div><span className="fin-stat-n" data-count="38">38</span><span className="fin-stat-l">AÑOS</span></div>
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
