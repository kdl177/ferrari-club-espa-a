import type { Metadata } from 'next';
import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Área de Socios — Ferrari Club España',
  robots: { index: false },
};

// Solo destinos que existen. La revista y el directorio de socios que
// figuraban aqui no tienen pagina: un boton que no lleva a nada es peor que
// no tenerlo.
const AREA_CARDS = [
  { label: 'EVENTOS', title: 'Inscripción', href: '/eventos' },
  { label: 'ACTUALIDAD', title: 'Noticias', href: '/noticias' },
  { label: 'PERFIL', title: 'Mi cuenta', href: '/socios/panel/privacidad' },
  { label: 'SECRETARÍA', title: 'Contacto', href: '/contacta' },
];

export default async function PanelSociosPage() {
  const session = await auth();
  const email = session?.user?.email ?? '';
  const socio = email ? await prisma.user.findUnique({ where: { email }, select: { esAdmin: true } }) : null;

  const tarjetas = socio?.esAdmin
    ? [...AREA_CARDS, { label: 'ADMINISTRACIÓN', title: 'Panel del club', href: '/socios/admin' }]
    : AREA_CARDS;

  return (
    <div style={{ paddingTop: '10rem', paddingBottom: '6rem', background: 'var(--black)', minHeight: '100vh' }}>
      <div className="cnt">
        <p className="sec-eye" data-r="up">ÁREA PRIVADA</p>
        <h1 className="sec-title" style={{ fontSize: 'clamp(2rem,5vw,4rem)', marginTop: '.75rem' }} data-r="up">
          BIENVENIDO<br /><span style={{ color: 'var(--red)' }}>{email}</span>
        </h1>

        <div className="board-grid" style={{ marginTop: '3.5rem' }}>
          {tarjetas.map((c) => (
            <Link href={c.href} className="board-card panel-card" key={c.label}>
              <div className="board-name">{c.title}</div>
              <div className="board-role">{c.label}</div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/socios/panel/privacidad" className="btn btn-o">MIS DATOS Y PRIVACIDAD</Link>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button type="submit" className="btn btn-o">CERRAR SESIÓN</button>
          </form>
        </div>
      </div>
    </div>
  );
}
