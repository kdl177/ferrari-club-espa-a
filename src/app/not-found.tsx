import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: '78vh', display: 'flex', alignItems: 'center' }}>
      <div className="cnt">
        <p className="sec-eye">ERROR 404</p>
        <h1 className="sec-title" style={{ marginTop: '1rem' }}>Fuera<br /><span style={{ color: 'var(--red)' }}>de pista</span></h1>
        <p className="sec-sub" style={{ maxWidth: '520px', marginTop: '1.5rem' }}>
          La página que buscas no existe o ha cambiado de dirección. Si venías de la web anterior del club, las noticias siguen en la misma ruta y el resto está en el menú.
        </p>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
          <Link href="/" className="btn btn-p">IR AL INICIO <span className="btn-ico">→</span></Link>
          <Link href="/noticias/" className="btn btn-o">VER NOTICIAS</Link>
          <Link href="/contacta/" className="btn btn-o">CONTACTAR</Link>
        </div>
      </div>
    </section>
  );
}
