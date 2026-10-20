// Fondo fijo a pantalla completa del area privada (panel de socio, Mi cuenta
// y administracion): la misma foto en las tres para que se lean como una zona.
export default function FondoSocios() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="panel-fondo"
        src="/heroes/panel-f8-1920.webp"
        srcSet="/heroes/panel-f8-1280.webp 1280w, /heroes/panel-f8-1920.webp 1920w, /heroes/panel-f8-2560.webp 2560w, /heroes/panel-f8-3348.webp 3348w"
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
      />
      <div className="panel-velo" aria-hidden="true" />
    </>
  );
}
