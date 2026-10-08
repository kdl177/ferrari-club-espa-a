import type { Metadata } from 'next';
import PaginaLegal from '@/components/PaginaLegal';
import { CLUB } from '@/lib/sitio';

export const metadata: Metadata = {
  title: 'Aviso legal — Ferrari Club España',
  description: 'Datos identificativos del titular de la web del Ferrari Club España y condiciones de uso, según la Ley 34/2002 (LSSI).',
  alternates: { canonical: '/aviso-legal/' },
};

const fuerte = { color: 'var(--w90)' };

export default function AvisoLegalPage() {
  return (
    <PaginaLegal titulo="Aviso" rojo="legal" actualizada="LSSI · LEY 34/2002">
      <h2 className="priv-h2">1. Titular de la web</h2>
      <p className="priv-p">En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, se informa de los datos del titular de este sitio web:</p>
      <ul className="priv-ul">
        <li><strong style={fuerte}>Denominación:</strong> {CLUB.nombre}</li>
        <li><strong style={fuerte}>CIF:</strong> {CLUB.cif}</li>
        <li><strong style={fuerte}>Inscripción:</strong> {CLUB.registro}</li>
        <li><strong style={fuerte}>Domicilio:</strong> {CLUB.direccion}, {CLUB.cp} {CLUB.ciudad}</li>
        <li><strong style={fuerte}>Teléfono:</strong> <a href={`tel:${CLUB.telefonoE164}`} className="priv-a">{CLUB.telefono}</a></li>
        <li><strong style={fuerte}>Email:</strong> <a href={`mailto:${CLUB.email}`} className="priv-a">{CLUB.email}</a></li>
      </ul>

      <h2 className="priv-h2">2. Datos personales, cookies y condiciones de venta</h2>
      <p className="priv-p">El tratamiento de los datos personales se explica en la <a href="/privacidad/" className="priv-a">política de privacidad</a> y el uso de cookies en la <a href="/cookies/" className="priv-a">política de cookies</a>. Las compras a través de la web se rigen por las <a href="/condiciones-de-venta/" className="priv-a">condiciones de venta</a>.</p>
    </PaginaLegal>
  );
}
