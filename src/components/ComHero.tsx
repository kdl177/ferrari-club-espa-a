import Breadcrumb from '@/components/Breadcrumb';

const SECCIONES = [
  { label: 'La comunidad', href: '/comunidad/' },
  { label: 'El club', href: '/comunidad/club/' },
  { label: 'Salidas', href: '/comunidad/eventos/' },
  { label: 'Noticias', href: '/comunidad/noticias/' },
  { label: 'Concesionarios', href: '/comunidad/concesionarios/' },
  { label: 'Hablamos', href: '/comunidad/contacta/' },
  { label: 'Hazte socio', href: '/comunidad/hazte-socio/' },
];

type Props = {
  seccion: string;
  titulo: string;
  tituloRojo: string;
  entrada: string;
  /** Foto del archivo del club que acompaña a la cabecera. */
  foto: string;
  fotoAlt: string;
  /** Nombre del video en /public/video sin extension. Si viene, manda sobre
   *  la foto, que se queda de imagen de carga. */
  video?: string;
};

export default function ComHero({ seccion, titulo, tituloRojo, entrada, foto, fotoAlt, video }: Props) {
  return (
    <section className="com-ph">
      {video ? (
        <video
          className="com-ph-fondo"
          autoPlay
          muted
          loop
          playsInline
          poster={`/video/${video}-poster.webp`}
          aria-label={fotoAlt}
        >
          <source src={`/video/${video}.webm`} type="video/webm" />
          <source src={`/video/${video}.mp4`} type="video/mp4" />
        </video>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="com-ph-fondo" src={foto} alt={fotoAlt} />
      )}
      <div className="com-ph-velo" aria-hidden="true" />
      <div className="cnt com-ph-cnt">
        <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'La comunidad', href: '/comunidad/' }, { label: seccion }]} />
        <p className="sec-eye" style={{ marginTop: '1.5rem' }}>{seccion.toUpperCase()}</p>
        <h1 className="sec-title com-ph-titulo">
          {titulo}<br /><span style={{ color: 'var(--red)' }}>{tituloRojo}</span>
        </h1>
        <p className="sec-sub com-ph-sub">{entrada}</p>
        <nav className="com-nav" aria-label="Secciones de la comunidad">
          {SECCIONES.map((s) => (
            <a key={s.href} href={s.href} aria-current={s.label === seccion ? 'page' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
