import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import DescargarDatosBoton from '@/components/DescargarDatosBoton';
import DarseBajaBloque from '@/components/DarseBajaBloque';

export const metadata: Metadata = {
  title: 'Mis datos y privacidad — Ferrari Club España',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

export default async function PrivacidadSocioPage() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect('/socios/');

  const socio = await prisma.user.findUnique({
    where: { email },
    include: { suscripcion: true },
  });
  if (!socio) redirect('/socios/');

  const suscripcionActiva = socio.suscripcion?.estado === 'activa';

  return (
    <div style={{ paddingTop: '13rem', paddingBottom: '6rem', background: 'var(--black)', minHeight: '100vh' }}>
      <div className="cnt" style={{ maxWidth: '860px' }}>
        <p className="sec-eye" data-r="up">ÁREA DE SOCIOS</p>
        <h1 className="sec-title" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginTop: '.75rem', marginBottom: '1rem' }} data-r="up">
          MIS DATOS Y<br /><span style={{ color: 'var(--red)' }}>PRIVACIDAD</span>
        </h1>
        <p className="sec-sub" style={{ marginBottom: '3.5rem' }} data-r="up">
          Aquí puedes ejercer los derechos que te reconoce el RGPD sobre los datos que
          el club guarda de ti.
        </p>

        <section className="admin-seccion">
          <h2 className="admin-h2">Consentimiento registrado</h2>
          {socio.consentimientoEn ? (
            <p style={{ fontFamily: 'var(--fm)', fontSize: '.85rem', color: 'var(--w70)', lineHeight: 1.9 }}>
              Aceptaste la política de privacidad el{' '}
              <strong style={{ color: 'var(--white)' }}>
                {socio.consentimientoEn.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
              {socio.consentimientoVersion && <> (versión {socio.consentimientoVersion})</>}.
            </p>
          ) : (
            <p className="admin-nota">
              No consta consentimiento registrado para esta cuenta. Si crees que es un error,
              escribe a secretaría.
            </p>
          )}
        </section>

        <section className="admin-seccion">
          <h2 className="admin-h2">Derecho de acceso y portabilidad</h2>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w70)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
            Descarga todo lo que el club guarda sobre ti en un archivo estructurado:
            tus datos personales, tu membresía, tus inscripciones a eventos y los
            mensajes que nos has enviado.
          </p>
          <DescargarDatosBoton />
        </section>

        <section className="admin-seccion">
          <h2 className="admin-h2">Derecho de supresión</h2>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '.92rem', color: 'var(--w70)', lineHeight: 1.9, marginBottom: '1rem' }}>
            Puedes solicitar la baja y la eliminación de tus datos personales. Se borrarán
            tu nombre, email, teléfono y modelo de vehículo, junto con tus mensajes y
            accesos.
          </p>
          <p className="admin-nota" style={{ marginBottom: '1.5rem' }}>
            El histórico contable de cuotas se conserva de forma anónima, sin ningún dato
            que permita identificarte, porque la normativa obliga a mantenerlo hasta que
            prescriban las responsabilidades legales. Esta acción no se puede deshacer.
          </p>
          <DarseBajaBloque email={socio.email} suscripcionActiva={suscripcionActiva} />
        </section>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--w08)' }}>
          <a href="/socios/panel/" className="btn btn-o btn-sm">← Volver al área de socios</a>
        </div>
      </div>
    </div>
  );
}
