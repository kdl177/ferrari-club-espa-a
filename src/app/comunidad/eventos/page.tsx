import type { Metadata } from 'next';
import ComHero from '@/components/ComHero';
import EventsFilter, { type EventItem } from '@/components/EventsFilter';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Salidas — La comunidad · Ferrari Club España',
  description: 'El calendario del club: track days, rutas, Grands Prix y viajes a Maranello. Dónde nos vemos este año.',
  alternates: { canonical: '/comunidad/eventos/' },
};

export const dynamic = 'force-dynamic';

function formatearFecha(fecha: Date) {
  return fecha
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
    .toUpperCase()
    .replace(/(\d{4})$/, '· $1');
}

export default async function ComunidadEventosPage() {
  const session = await auth();
  const email = session?.user?.email ?? null;
  const socio = email ? await prisma.user.findUnique({ where: { email } }) : null;

  const [eventos, misInscripciones] = await Promise.all([
    prisma.evento.findMany({ orderBy: { fecha: 'asc' } }),
    socio ? prisma.inscripcion.findMany({ where: { socioId: socio.id } }) : Promise.resolve([]),
  ]);

  const inscripcionPorEvento = new Map(
    misInscripciones
      .filter((i) => i.estado !== 'cancelada')
      .map((i) => [i.eventoId, i.estado as 'confirmada' | 'lista_espera'])
  );

  const ahora = new Date();

  const items: EventItem[] = eventos.map((e) => ({
    id: e.id,
    categoria: e.categoria,
    titulo: e.titulo,
    fechaLabel: formatearFecha(e.fecha),
    ubicacion: e.ubicacion,
    descripcion: e.descripcion,
    aforo: e.aforo,
    plazasOcupadas: e.plazasOcupadas,
    pasado: e.fecha < ahora,
    miInscripcion: inscripcionPorEvento.get(e.id) ?? null,
  }));

  const proximos = items.filter((e) => !e.pasado).length;

  return (
    <>
      <ComHero
        seccion="Salidas"
        titulo="Dónde nos"
        tituloRojo="vemos este año"
        entrada="Circuito, carretera y Maranello. El calendario del club, abierto a socios."
        foto="/galeria/g03.webp"
        fotoAlt="Ferrari aparcados entre olivos durante una salida del club"
      />

      <section style={{ background: 'var(--ink)', padding: '3rem 0' }}>
        <div className="cnt">
          <div className="com-cifras">
            <div className="com-cifra"><span className="com-cifra-n">{proximos}</span><span className="com-cifra-l">SALIDAS ABIERTAS</span></div>
            <div className="com-cifra"><span className="com-cifra-n">6</span><span className="com-cifra-l">TIPOS DE PLAN</span></div>
            <div className="com-cifra"><span className="com-cifra-n">200+</span><span className="com-cifra-l">SOCIOS</span></div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--fce-grafito)', padding: '4rem 0 5rem' }}>
        <div className="cnt">
          <EventsFilter events={items} haySesion={!!socio} />
        </div>
      </section>

      <section style={{ background: 'var(--red)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,.25),transparent)' }} aria-hidden="true" />
        <div className="cnt" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,4.5vw,3.5rem)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1.5rem' }} data-r="up">¿TE VIENES A LA PRÓXIMA?</h2>
          <p style={{ fontFamily: 'var(--fh)', fontSize: '1.1rem', color: 'rgba(255,255,255,.8)', marginBottom: '2.5rem' }} data-r="up">Las plazas son para socios, y en algunas salidas se acaban</p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }} data-r="up">
            <a href="/club/hazte-socio/" className="btn" style={{ background: 'var(--white)', color: 'var(--red)', borderColor: 'var(--white)', fontFamily: 'var(--fd)', fontSize: '.72rem', letterSpacing: '.15em', padding: '.8rem 2.5rem' }} data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/comunidad/contacta/" className="btn btn-o" style={{ borderColor: 'rgba(255,255,255,.5)', color: 'var(--white)' }}>PREGUNTAR</a>
          </div>
        </div>
      </section>
    </>
  );
}
