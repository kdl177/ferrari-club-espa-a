import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import ContactoAtendidoBoton from '@/components/admin/ContactoAtendidoBoton';

export const dynamic = 'force-dynamic';

const ASUNTO_LABEL: Record<string, string> = {
  'info-general': 'Información general',
  'hacerse-socio': 'Hacerse socio',
  eventos: 'Eventos',
  patrocinio: 'Patrocinio',
  prensa: 'Prensa',
  otro: 'Otro',
};

export default async function AdminContactosPage() {
  await requireAdmin();

  const contactos = await prisma.contactoRecibido.findMany({
    orderBy: [{ atendido: 'asc' }, { creadoEn: 'desc' }],
  });

  const pendientes = contactos.filter((c) => !c.atendido).length;

  return (
    <section className="admin-seccion">
      <h2 className="admin-h2">
        Contactos recibidos <span className="admin-contador">{pendientes} sin atender</span>
      </h2>

      {contactos.length === 0 ? (
        <p className="admin-vacio">No se ha recibido ningún mensaje todavía.</p>
      ) : (
        <div className="admin-lista">
          {contactos.map((c) => (
            <article key={c.id} className={`admin-mensaje${c.atendido ? ' atendido' : ''}`}>
              <div className="admin-mensaje-head">
                <div>
                  <span className="admin-mensaje-asunto">{ASUNTO_LABEL[c.asunto] ?? c.asunto}</span>
                  <h3 className="admin-mensaje-de">{c.nombre} {c.apellidos}</h3>
                  <p className="admin-mensaje-meta">
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                    {c.telefono && <> · <a href={`tel:${c.telefono}`}>{c.telefono}</a></>}
                    {c.ferrariModelo && <> · {c.ferrariModelo}</>}
                  </p>
                </div>
                <div className="admin-mensaje-acciones">
                  <span className="admin-td-mono admin-mensaje-fecha">
                    {c.creadoEn.toLocaleDateString('es-ES')} {c.creadoEn.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <ContactoAtendidoBoton id={c.id} atendido={c.atendido} />
                </div>
              </div>
              <p className="admin-mensaje-cuerpo">{c.mensaje}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
