import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import NoticiaForm from '@/components/admin/NoticiaForm';
import BorrarNoticiaBoton from '@/components/admin/BorrarNoticiaBoton';

export const dynamic = 'force-dynamic';

export default async function AdminNoticiasPage() {
  await requireAdmin();

  const noticias = await prisma.noticia.findMany({ orderBy: { creadoEn: 'desc' } });
  const publicadas = noticias.filter((n) => n.publicadoEn).length;

  return (
    <>
      <section className="admin-seccion">
        <h2 className="admin-h2">Nueva noticia</h2>
        <NoticiaForm />
      </section>

      <section className="admin-seccion">
        <h2 className="admin-h2">
          Noticias <span className="admin-contador">{publicadas} publicadas · {noticias.length - publicadas} en borrador</span>
        </h2>
        {noticias.length === 0 ? (
          <p className="admin-vacio">No hay noticias creadas.</p>
        ) : (
          <div className="admin-lista">
            {noticias.map((n) => (
              <details key={n.id} className="admin-item">
                <summary className="admin-item-head">
                  <div>
                    <span className="admin-mensaje-asunto">{n.categoria}</span>
                    <h3 className="admin-mensaje-de">{n.titulo}</h3>
                    <p className="admin-mensaje-meta">/{n.slug}</p>
                  </div>
                  <div className="admin-mensaje-acciones">
                    <span className={`admin-badge ${n.publicadoEn ? 'admin-badge-activo' : 'admin-badge-pendiente'}`}>
                      {n.publicadoEn ? `Publicada ${n.publicadoEn.toLocaleDateString('es-ES')}` : 'Borrador'}
                    </span>
                  </div>
                </summary>
                <div className="admin-item-cuerpo">
                  <NoticiaForm noticia={{
                    id: n.id,
                    titulo: n.titulo,
                    categoria: n.categoria,
                    cuerpo: n.cuerpo,
                    portada: n.portada ?? '',
                    publicada: !!n.publicadoEn,
                  }} />
                  <BorrarNoticiaBoton id={n.id} titulo={n.titulo} />
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
