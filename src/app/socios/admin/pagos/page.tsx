import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const BADGE_POR_RESULTADO: Record<string, string> = {
  procesado: 'admin-badge-activo',
  ignorado: 'admin-badge-baja',
  error: 'admin-badge-moroso',
};

const ETIQUETA_TIPO: Record<string, string> = {
  'checkout.session.completed': 'Alta de socio',
  'invoice.payment_failed': 'Pago fallido',
  'customer.subscription.deleted': 'Baja de suscripción',
};

export default async function AdminPagosPage() {
  await requireAdmin();

  const [total, procesados, ignorados, errores, ultimos] = await Promise.all([
    prisma.eventoStripe.count(),
    prisma.eventoStripe.count({ where: { resultado: 'procesado' } }),
    prisma.eventoStripe.count({ where: { resultado: 'ignorado' } }),
    prisma.eventoStripe.count({ where: { resultado: 'error' } }),
    prisma.eventoStripe.findMany({ orderBy: { creadoEn: 'desc' }, take: 50 }),
  ]);

  // socioId no es una relacion FK a proposito: un evento de Stripe debe
  // poder registrarse aunque el socio no exista (ese es precisamente el
  // caso de fallo que mas importa capturar). Los nombres se resuelven aparte.
  const socioIds = [...new Set(ultimos.map((e) => e.socioId).filter((id): id is string => !!id))];
  const socios = socioIds.length
    ? await prisma.user.findMany({ where: { id: { in: socioIds } }, select: { id: true, nombre: true, apellidos: true } })
    : [];
  const socioPorId = new Map(socios.map((s) => [s.id, s]));

  return (
    <>
      <section className="admin-seccion">
        <h2 className="admin-h2">Eventos de pago (Stripe)</h2>
        <p style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', color: 'var(--w60)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '640px' }}>
          Cada notificación que envía Stripe queda registrada aquí, incluida cualquiera
          que fallara al procesarse. Si un socio paga y no ve su cuota activada, la causa
          está en esta lista.
        </p>

        <div className="admin-cards" style={{ marginBottom: '3rem' }}>
          <div className="admin-card"><span className="admin-card-valor">{total}</span><span className="admin-card-label">Eventos totales</span></div>
          <div className="admin-card"><span className="admin-card-valor" style={{ color: '#4ade80' }}>{procesados}</span><span className="admin-card-label">Procesados</span></div>
          <div className={`admin-card${errores > 0 ? ' alerta' : ''}`}><span className="admin-card-valor">{errores}</span><span className="admin-card-label">Con error</span></div>
          <div className="admin-card"><span className="admin-card-valor">{ignorados}</span><span className="admin-card-label">Ignorados</span></div>
        </div>

        {ultimos.length === 0 ? (
          <p className="admin-vacio">Todavía no se ha recibido ningún evento de Stripe.</p>
        ) : (
          <div className="admin-tabla-scroll">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Resultado</th>
                  <th>Socio</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {ultimos.map((e) => (
                  <tr key={e.id}>
                    <td className="admin-td-mono">
                      {e.creadoEn.toLocaleDateString('es-ES')} {e.creadoEn.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>{ETIQUETA_TIPO[e.tipo] ?? e.tipo}</td>
                    <td>
                      <span className={`admin-badge ${BADGE_POR_RESULTADO[e.resultado] ?? ''}`}>
                        {e.resultado}
                      </span>
                    </td>
                    <td className="admin-td-mono">
                      {e.socioId && socioPorId.get(e.socioId)
                        ? `${socioPorId.get(e.socioId)!.nombre} ${socioPorId.get(e.socioId)!.apellidos}`
                        : e.socioId
                          ? `(socio eliminado: ${e.socioId.slice(0, 8)}…)`
                          : '—'}
                    </td>
                    <td className="admin-td-truncado" title={e.detalle ?? ''}>{e.detalle ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
