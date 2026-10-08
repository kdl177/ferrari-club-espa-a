// Fondo fotografico para las cabeceras de la web. Las fuentes son de 4K, pero
// se sirven en tres tamaños: a 1280 no tiene sentido descargar 2560.
export default function FondoHero({ nombre, alt }: { nombre: string; alt: string }) {
  const ruta = (w: number) => `/heroes/${nombre}-${w}.webp`;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-foto"
        src={ruta(1920)}
        srcSet={`${ruta(1280)} 1280w, ${ruta(1920)} 1920w, ${ruta(2560)} 2560w`}
        sizes="100vw"
        alt={alt}
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-foto-velo" aria-hidden="true" />
    </>
  );
}
