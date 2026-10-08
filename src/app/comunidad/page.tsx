import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ArchivoComunidad from '@/components/ArchivoComunidad';
import { CIRCUITO, VIAJES, CONCENTRACIONES } from '@/lib/galeria';

export const metadata: Metadata = {
  title: 'La comunidad — Ferrari Club España',
  description:
    'Las personas detrás del Ferrari Club España: concentraciones, rutas, viajes a Maranello y track days contados con las fotos y los vídeos del club.',
  alternates: { canonical: '/comunidad/' },
};

// Las fotos con gente, que es de lo que va esta pagina. Las de coches sueltos
// se quedan en /club.
const GENTE = [
  { src: '/galeria/g06.webp', alt: 'Socios del club reunidos en una plaza' },
  { src: '/galeria/g04.webp', alt: 'Socios del club en un taller Ferrari' },
  { src: '/galeria/g08.webp', alt: 'Socios del club ante un castillo' },
  { src: '/galeria/g14.webp', alt: 'Socios del club ante un castillo' },
  { src: '/galeria/g10.webp', alt: 'Socios del club a bordo de una embarcación' },
  { src: '/galeria/g13.webp', alt: 'Socios del club en un paddock con la bandera de España' },
  { src: '/galeria/g11.webp', alt: 'Socios del club reunidos en una comida' },
  { src: '/galeria/g16.webp', alt: 'Socios del club en la entrada de Ferrari Land' },
];

const MOMENTOS = [
  { n: '01', t: 'Tandas en circuito', d: 'Jornadas de pilotaje en los circuitos más carismáticos del país.' },
  { n: '02', t: 'Rutas', d: 'Itinerarios por los paisajes más bonitos de la Península y de las Islas Canarias.' },
  { n: '03', t: 'Maranello', d: 'Cada año, visita a la fábrica Ferrari de Maranello, exclusiva para socios.' },
  { n: '04', t: 'Test de Fórmula 1', d: 'Los test de pretemporada en el Circuit de Barcelona-Catalunya, desde el box de Ferrari.' },
];

export default function ComunidadPage() {
  // 6 columnas: se recorta a multiplo de 6 para que no quede una ultima fila
  // a medias con huecos.
  const todas = [...CONCENTRACIONES, ...VIAJES, ...CIRCUITO];
  const archivo = todas.slice(0, Math.floor(todas.length / 6) * 6);

  return (
    <>
      <section className="com-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="com-hero-video" src="/club/socios-plaza.webp" alt="Socios del Ferrari Club España reunidos en una plaza" />
        <div className="com-hero-velo" aria-hidden="true" />
        <div className="cnt com-hero-cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'La comunidad' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>DESDE 1988</p>
          <h1 className="sec-title com-hero-titulo">
            No es el coche.<br /><span style={{ color: 'var(--red)' }}>Es la gente.</span>
          </h1>
          <p className="sec-sub com-hero-sub">
            Más de 200 socios propietarios de Ferrari. Desde 2006, el único Club Oficial del Cavallino en España.
          </p>
          <div className="com-hero-acc">
            <a href="/comunidad/hazte-socio/" className="btn" data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="#archivo" className="btn btn-o">VER EL ARCHIVO</a>
          </div>
          <nav className="com-nav" aria-label="Secciones de la comunidad">
            <a href="/comunidad/club/">El club</a>
            <a href="/comunidad/eventos/">Salidas</a>
            <a href="/comunidad/noticias/">Noticias</a>
            <a href="/comunidad/concesionarios/">Concesionarios</a>
            <a href="/comunidad/contacta/">Hablamos</a>
            <a href="/comunidad/hazte-socio/">Hazte socio</a>
          </nav>
        </div>
      </section>

      <section style={{ background: 'var(--fce-grafito)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">LO QUE HACEMOS</div>
            <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3.5rem' }}>A lo largo<br /><span style={{ color: 'var(--red)' }}>del año</span></h2>
          </div>
          <div className="com-momentos">
            {MOMENTOS.map((m) => (
              <div className="com-momento" data-r="up" key={m.n}>
                <span className="com-momento-n">{m.n}</span>
                <h3 className="com-momento-t">{m.t}</h3>
                <p className="com-momento-d">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">CARAS CONOCIDAS</div>
            <h2 className="sec-title" style={{ marginTop: '1rem' }}>Los sitios<br /><span style={{ color: 'var(--red)' }}>donde hemos estado</span></h2>
            <p className="sec-sub" style={{ maxWidth: '620px', marginTop: '1.5rem', marginBottom: '3.5rem' }}>
              Fotos del archivo del Ferrari Club España.
            </p>
          </div>
          <div className="com-gente">
            {GENTE.map((g, i) => (
              <figure className="com-gente-pieza" data-r="up" key={g.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="archivo" style={{ background: 'var(--fce-grafito)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">ARCHIVO</div>
            <h2 className="sec-title" style={{ marginTop: '1rem' }}>Casi cuarenta<br /><span style={{ color: 'var(--red)' }}>años de esto</span></h2>
            <p className="sec-sub" style={{ maxWidth: '620px', marginTop: '1.5rem', marginBottom: '3.5rem' }}>
              Imágenes del archivo del club.
            </p>
          </div>
          <ArchivoComunidad piezas={archivo} />
        </div>
      </section>

      <section style={{ background: 'var(--red)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,.25),transparent)' }} aria-hidden="true" />
        <div className="cnt" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1.5rem' }} data-r="up">LA PRÓXIMA SALIDA TE ESPERA</h2>
          <p style={{ fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', marginBottom: '2.5rem' }} data-r="up">Si eres propietario de un Ferrari, hazte socio del Ferrari Club España</p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} data-r="up">
            <a href="/comunidad/hazte-socio/" className="btn" style={{ background: 'var(--white)', color: 'var(--red)', borderColor: 'var(--white)', fontFamily: 'var(--fd)', fontSize: '.72rem', letterSpacing: '.15em', padding: '.8rem 2.5rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/comunidad/eventos/" className="btn btn-o" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'var(--white)' }}>VER EVENTOS</a>
          </div>
        </div>
      </section>
    </>
  );
}
