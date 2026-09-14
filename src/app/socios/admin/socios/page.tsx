import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ESTADO_LABEL: Record<string, string> = {
  activo: 'Activo',
  pendiente: 'Pendiente',
  moroso: 'Impagado',
  baja: 'Baja',
};

const PLAN_LABEL: Record<string, string> = {
  base: 'Base',
  activo: 'Activo',
  familiar: 'Familiar',
};

export default async function AdminSociosPage() {
  await requireAdmin();

  const socios = await prisma.user.findMany({
    include: { suscripcion: true, _count: { select: { inscripciones: true } } },
    orderBy: { creadoEn: 'desc' },
  });

  return (
    <section className="admin-seccion">
      <h2 className="admin-h2">Socios <span className="admin-contador">{socios.length}</span></h2>

      {socios.length === 0 ? (
        <p className="admin-vacio">Todavía no hay socios registrados.</p>
      ) : (
        <div className="admin-tabla-scroll">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Email</th>
                <th>Ferrari</th>
                <th>Cuota</th>
                <th>Plan</th>
                <th>Renueva</th>
                <th>Eventos</th>
                <th>Alta</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.nombre} {s.apellidos}
                    {s.esAdmin && <span className="admin-badge admin-badge-admin">ADMIN</span>}
                  </td>
                  <td className="admin-td-mono">{s.email}</td>
                  <td className="admin-td-mono">{s.ferrariModelo ?? '—'}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${s.estadoCuota}`}>
                      {ESTADO_LABEL[s.estadoCuota] ?? s.estadoCuota}
                    </span>
                  </td>
                  <td className="admin-td-mono">{s.suscripcion ? PLAN_LABEL[s.suscripcion.plan] ?? s.suscripcion.plan : '—'}</td>
                  <td className="admin-td-mono">
                    {s.suscripcion?.renuevaEn ? s.suscripcion.renuevaEn.toLocaleDateString('es-ES') : '—'}
                  </td>
                  <td className="admin-td-mono">{s._count.inscripciones}</td>
                  <td className="admin-td-mono">{s.creadoEn.toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="admin-nota">
        El estado de la cuota lo determina Stripe automáticamente: se activa al confirmarse el pago
        y pasa a impagado si falla una renovación. No se edita a mano desde aquí.
      </p>
    </section>
  );
}
