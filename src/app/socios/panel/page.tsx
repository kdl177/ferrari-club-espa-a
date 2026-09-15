import type { Metadata } from 'next';
import { auth, signOut } from '@/auth';

export const metadata: Metadata = {
  title: 'Área de Socios — Ferrari Club España',
  robots: { index: false },
};

const AREA_CARDS = [
  { label: 'EVENTOS', title: 'Inscripción' },
  { label: 'REVISTA', title: 'Digital' },
  { label: 'DIRECTORIO', title: 'Socios' },
  { label: 'PERFIL', title: 'Mi cuenta' },
];

export default async function PanelSociosPage() {
  const session = await auth();
  const email = session?.user?.email ?? '';

  return (
    <div style={{ paddingTop: '10rem', paddingBottom: '6rem', background: 'var(--black)', minHeight: '100vh' }}>
      <div className="cnt">
        <p className="sec-eye" data-r="up">ÁREA PRIVADA</p>
        <h1 className="sec-title" style={{ fontSize: 'clamp(2rem,5vw,4rem)', marginTop: '.75rem' }} data-r="up">
          BIENVENIDO<br /><span style={{ color: 'var(--red)' }}>{email}</span>
        </h1>

        <div className="board-grid" style={{ marginTop: '3.5rem' }}>
          {AREA_CARDS.map((c) => (
            <div className="board-card" key={c.label}>
              <div className="board-name">{c.title}</div>
              <div className="board-role">{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="/socios/panel/privacidad/" className="btn btn-o">MIS DATOS Y PRIVACIDAD</a>
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
