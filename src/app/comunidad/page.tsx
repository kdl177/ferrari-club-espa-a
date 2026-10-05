import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
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
  { src: '/galeria/g06.webp', alt: 'Socios del club reunidos en la plaza de San Gimignano, en la Toscana', pie: 'San Gimignano · Ruta por la Toscana' },
  { src: '/galeria/g04.webp', alt: 'Socios del club durante la visita al taller Ferrari Classiche de Maranello', pie: 'Maranello · Visita a Classiche' },
  { src: '/galeria/g08.webp', alt: 'Socios del club ante el castillo de Olite en otoño', pie: 'Olite · Encuentro de otoño' },
  { src: '/galeria/g14.webp', alt: 'Socios del club ante el castillo de Chambord durante la ruta por el Loira', pie: 'Chambord · Ruta por el Loira' },
  { src: '/galeria/g10.webp', alt: 'Socios del club a bordo de una embarcación en el lago de Como', pie: 'Lago de Como · Travesía del club' },
  { src: '/galeria/g13.webp', alt: 'Socios del club en el paddock de Fórmula 1 con la bandera de España', pie: 'Paddock F1 · Gran Premio' },
  { src: '/galeria/g11.webp', alt: 'Socios del club reunidos en una comida de hermandad', pie: 'Sobremesa · Comida del club' },
  { src: '/galeria/g16.webp', alt: 'Socios del club en la entrada de Ferrari Land', pie: 'Ferrari Land · Salida familiar' },
];

const MOMENTOS = [
  { n: '01', t: 'Nos juntamos', d: 'Una plaza, una mañana y los coches aparcados en fila. Lo demás sale solo: café, conversación y gente mirando.' },
  { n: '02', t: 'Salimos a rodar', d: 'Rutas por carreteras que merecen la pena. Asturias, los Pirineos, la Toscana, el Loira. El coche es la excusa.' },
  { n: '03', t: 'Vamos a la fuente', d: 'Maranello, el museo, los talleres de Classiche y Fiorano. Ver de dónde sale todo esto, al menos una vez.' },
  { n: '04', t: 'Pisamos circuito', d: 'Jarama, Montmeló, Jerez, Calafat. Días en pista con el club, a tu ritmo y sin cronómetro si no quieres.' },
];

export default function ComunidadPage() {
  // 6 columnas: se recorta a multiplo de 6 para que no quede una ultima fila
  // a medias con huecos.
  const todas = [...CONCENTRACIONES, ...VIAJES, ...CIRCUITO];
  const archivo = todas.slice(0, Math.floor(todas.length / 6) * 6);

  return (
    <>
      <section className="com-hero">
        <video
          className="com-hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/juntada-poster.webp"
          aria-label="Vista aérea de una concentración del club: decenas de Ferrari aparcados en una plaza junto al lago"
        >
          <source src="/video/juntada.webm" type="video/webm" />
          <source src="/video/juntada.mp4" type="video/mp4" />
        </video>
        <div className="com-hero-velo" aria-hidden="true" />
        <div className="cnt com-hero-cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'La comunidad' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }}>DESDE 1988</p>
          <h1 className="sec-title com-hero-titulo">
            No es el coche.<br /><span style={{ color: 'var(--red)' }}>Es la gente.</span>
          </h1>
          <p className="sec-sub com-hero-sub">
            Doscientos propietarios que se juntan a rodar, a viajar y a comer. Los Ferrari son lo que tenemos en común, no lo que nos reúne.
          </p>
          <div className="com-hero-acc">
            <a href="/club/hazte-socio/" className="btn" data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="#archivo" className="btn btn-o">VER EL ARCHIVO</a>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">LO QUE HACEMOS</div>
            <h2 className="sec-title" style={{ marginTop: '1rem', marginBottom: '3.5rem' }}>Cuatro cosas,<br /><span style={{ color: 'var(--red)' }}>todo el año</span></h2>
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

      <section style={{ background: 'var(--black)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">CARAS CONOCIDAS</div>
            <h2 className="sec-title" style={{ marginTop: '1rem' }}>Los sitios<br /><span style={{ color: 'var(--red)' }}>donde hemos estado</span></h2>
            <p className="sec-sub" style={{ maxWidth: '620px', marginTop: '1.5rem', marginBottom: '3.5rem' }}>
              Cada foto es una salida del club. Algunas tienen quince años y los que salen siguen viniendo.
            </p>
          </div>
          <div className="com-gente">
            {GENTE.map((g, i) => (
              <figure className="com-gente-pieza" data-r="up" key={g.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
                <figcaption>{g.pie}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="archivo" style={{ background: 'var(--b90)', padding: '6rem 0' }}>
        <div className="cnt">
          <div data-r="up">
            <div className="sec-eye">ARCHIVO</div>
            <h2 className="sec-title" style={{ marginTop: '1rem' }}>Casi cuarenta<br /><span style={{ color: 'var(--red)' }}>años de esto</span></h2>
            <p className="sec-sub" style={{ maxWidth: '620px', marginTop: '1.5rem', marginBottom: '3.5rem' }}>
              Veintiséis imágenes del archivo del club, a color y sin ordenar por temas: así es como se recuerda.
            </p>
          </div>
          <div className="com-archivo">
            {archivo.map((p) => (
              <figure className="com-archivo-pieza" key={p.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--red)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,.25),transparent)' }} aria-hidden="true" />
        <div className="cnt" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1.5rem' }} data-r="up">LA PRÓXIMA SALIDA TE ESPERA</h2>
          <p style={{ fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', marginBottom: '2.5rem' }} data-r="up">Si tienes un Ferrari, ya tienes lo único que hace falta</p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} data-r="up">
            <a href="/club/hazte-socio/" className="btn" style={{ background: 'var(--white)', color: 'var(--red)', borderColor: 'var(--white)', fontFamily: 'var(--fd)', fontSize: '.72rem', letterSpacing: '.15em', padding: '.8rem 2.5rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/eventos/" className="btn btn-o" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'var(--white)' }}>VER EVENTOS</a>
          </div>
        </div>
      </section>
    </>
  );
}
