function mapaEmbebido(lat: number, lng: number) {
  // Recuadro ajustado para que OSM resuelva el mismo zoom (15) tanto en el
  // contenedor ancho de escritorio como en el estrecho de movil.
  const dx = 0.0098;
  const dy = 0.0052;
  const bbox = [lng - dx, lat - dy, lng + dx, lat + dy].map((n) => n.toFixed(5)).join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function MapaOSM({
  lat,
  lng,
  titulo,
  className,
  children,
}: {
  lat: number;
  lng: number;
  titulo: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`mapa${className ? ` ${className}` : ''}`}>
      {/* El iframe va inerte: un mapa embebido secuestra la rueda del raton
          al pasar por encima. Toda la superficie abre el mapa grande. */}
      <iframe src={mapaEmbebido(lat, lng)} title={titulo} loading="lazy" tabIndex={-1} />
      <a
        className="mapa-link"
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}
        target="_blank"
        rel="noopener"
        aria-label={`${titulo}: abrir en OpenStreetMap`}
      />
      <span className="foto-credito mapa-credito">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>
      </span>
      {children}
    </div>
  );
}
