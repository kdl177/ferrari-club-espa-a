import type { Metadata } from 'next';
import PaginaLegal from '@/components/PaginaLegal';
import { CONDICIONES } from '@/content/condiciones-de-venta';

export const metadata: Metadata = {
  title: 'Condiciones de venta — Ferrari Club España',
  description: 'Condiciones generales de contratación del Ferrari Club España para la compra de inscripciones y productos a través de su web.',
  alternates: { canonical: '/condiciones-de-venta/' },
};

export default function CondicionesPage() {
  return (
    <PaginaLegal titulo="Condiciones" rojo="de venta" actualizada="CONDICIONES GENERALES DE CONTRATACIÓN">
      <div className="nota-cuerpo" dangerouslySetInnerHTML={{ __html: CONDICIONES }} />
    </PaginaLegal>
  );
}
