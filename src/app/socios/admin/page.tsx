import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminResumenPage() {
  await requireAdmin();

  const ahora = new Date();

  const [
    sociosActivos,
    sociosPendientes,
    sociosMorosos,
    contactosSinAtender,
    eventosProximos,
    noticiasBorrador,
    ultimosContactos,
  ] = await Promise.all([
    prisma.user.count({ where: { estadoCuota: 'activo' } }),
    prisma.user.count({ where: { estadoCuota: 'pendiente' } }),
    prisma.user.count({ where: { estadoCuota: 'moroso' } }),
    prisma.contactoRecibido.count({ where: { atendido: false } }),
    prisma.evento.count({ where: { fecha: { gte: ahora } } }),
    prisma.noticia.count({ where: { publicadoEn: null } }),
    prisma.contactoRecibido.findMany({
      where: { atendido: false },
      orderBy: { creadoEn: 'desc' },
      take: 5,
    }),
  ]);

  const tarjetas = [
    { label: 'Socios activos', valor: sociosActivos, href: '/socios/admin/socios/' },
    { label: 'Altas pendientes', valor: sociosPendientes, href: '/socios/admin/socios/', alerta: sociosPendientes > 0 },
    { label: 'Cuotas impagadas', valor: sociosMorosos, href: '/socios/admin/socios/', alerta: sociosMorosos > 0 },
    { label: 'Contactos sin leer', valor: contactosSinAtender, href: '/socios/admin/contactos/', alerta: contactosSinAtender > 0 },
    { label: 'Eventos próximos', valor: eventosProximos, href: '/socios/admin/eventos/' },
    { label: 'Noticias en borrador', valor: noticiasBorrador, href: '/socios/admin/noticias/' },
  ];

  return (
    <>
      <div className="admin-cards">
        {tarjetas.map((t) => (
          <a key={t.label} href={t.href} className={`admin-card${t.alerta ? ' alerta' : ''}`}>
            <span className="admin-card-valor">{t.valor}</span>
            <span className="admin-card-label">{t.label}</span>
          </a>
        ))}
      </div>

      <section className="admin-seccion">
        <h2 className="admin-h2">Últimos mensajes sin atender</h2>
        {ultimosContactos.length === 0 ? (
          <p className="admin-vacio">No hay mensajes pendientes.</p>
        ) : (
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Remitente</th>
                <th>Asunto</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {ultimosContactos.map((c) => (
                <tr key={c.id}>
                  <td className="admin-td-mono">{c.creadoEn.toLocaleDateString('es-ES')}</td>
                  <td>{c.nombre} {c.apellidos}</td>
                  <td className="admin-td-mono">{c.asunto}</td>
                  <td className="admin-td-truncado">{c.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <a href="/socios/admin/contactos/" className="btn btn-o btn-sm" style={{ marginTop: '1.5rem' }}>Ver todos los contactos →</a>
      </section>
    </>
  );
}
