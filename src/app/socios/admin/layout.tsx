import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/admin';
import { signOut } from '@/auth';

export const metadata: Metadata = {
  title: 'Panel del Club — Ferrari Club España',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const SECCIONES = [
  { href: '/socios/admin/', label: 'Resumen' },
  { href: '/socios/admin/socios/', label: 'Socios' },
  { href: '/socios/admin/eventos/', label: 'Eventos' },
  { href: '/socios/admin/noticias/', label: 'Noticias' },
  { href: '/socios/admin/contactos/', label: 'Contactos' },
  { href: '/socios/admin/pagos/', label: 'Pagos' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="admin-wrap">
      <header className="admin-head">
        <div className="cnt">
          <div className="admin-head-row">
            <div>
              <p className="sec-eye" style={{ marginBottom: '.5rem' }}>PANEL DEL CLUB</p>
              <h1 className="admin-title">Gestión<span style={{ color: 'var(--red)' }}>.</span></h1>
            </div>
            <div className="admin-user">
              <span className="admin-user-email">{admin.email}</span>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button type="submit" className="admin-logout">Cerrar sesión</button>
              </form>
            </div>
          </div>
          <nav className="admin-nav">
            {SECCIONES.map((s) => (
              <a key={s.href} href={s.href} className="admin-nav-link">{s.label}</a>
            ))}
          </nav>
        </div>
      </header>
      <main className="admin-main">
        <div className="cnt">{children}</div>
      </main>
    </div>
  );
}
