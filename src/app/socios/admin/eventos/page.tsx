import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import EventoForm from '@/components/admin/EventoForm';

export const dynamic = 'force-dynamic';

export default async function AdminEventosPage() {
  await requireAdmin();

  const eventos = await prisma.evento.findMany({
    include: { _count: { select: { inscripciones: true } } },
    orderBy: { fecha: 'desc' },
  });

  const ahora = new Date();

  return (
    <>
      <section className="admin-seccion">
        <h2 className="admin-h2">Nuevo evento</h2>
        <EventoForm />
      </section>

      <section className="admin-seccion">
        <h2 className="admin-h2">Eventos <span className="admin-contador">{eventos.length}</span></h2>
        {eventos.length === 0 ? (
          <p className="admin-vacio">No hay eventos creados.</p>
        ) : (
          <div className="admin-lista">
            {eventos.map((e) => {
              const pasado = e.fecha < ahora;
              const libres = e.aforo - e.plazasOcupadas;
              // Mismo criterio que la web publica: avisar antes de llenarse,
              // no solo cuando ya no queda sitio.
              const claseAforo =
                libres <= 0
                  ? 'admin-badge-moroso'
                  : libres <= Math.max(3, Math.ceil(e.aforo * 0.2))
                    ? 'admin-badge-pendiente'
                    : 'admin-badge-activo';
              return (
                <details key={e.id} className={`admin-item${pasado ? ' pasado' : ''}`}>
                  <summary className="admin-item-head">
                    <div>
                      <span className="admin-mensaje-asunto">{e.categoria}</span>
                      <h3 className="admin-mensaje-de">{e.titulo}</h3>
                      <p className="admin-mensaje-meta">
                        {e.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} · {e.ubicacion}
                      </p>
                    </div>
                    <div className="admin-mensaje-acciones">
                      <span className={`admin-badge ${claseAforo}`}>
                        {e.plazasOcupadas}/{e.aforo}
                      </span>
                      {pasado && <span className="admin-badge admin-badge-baja">Pasado</span>}
                    </div>
                  </summary>
                  <div className="admin-item-cuerpo">
                    <EventoForm evento={{
                      id: e.id,
                      titulo: e.titulo,
                      categoria: e.categoria,
                      fecha: e.fecha.toISOString().slice(0, 16),
                      ubicacion: e.ubicacion,
                      descripcion: e.descripcion,
                      aforo: e.aforo,
                    }} />
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
