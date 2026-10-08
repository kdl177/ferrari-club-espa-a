import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import EventsFilter, { type EventItem } from '@/components/EventsFilter';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SITE_URL, CLUB } from '@/lib/sitio';

export const metadata: Metadata = {
  title: 'Eventos 2026 — Ferrari Club España',
  description: 'Calendario de eventos del Ferrari Club España: tandas en circuito, rutas, cena de gala y salidas del club. Fechas tal y como las publica el club.',
  alternates: { canonical: '/eventos/' },
};

export const dynamic = 'force-dynamic';

function formatearFecha(fecha: Date) {
  return fecha
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
    .toUpperCase()
    .replace(/(\d{4})$/, '· $1');
}

export default async function EventosPage() {
  const session = await auth();
  const email = session?.user?.email ?? null;

  const socio = email ? await prisma.user.findUnique({ where: { email } }) : null;

  const [eventos, misInscripciones] = await Promise.all([
    prisma.evento.findMany({ orderBy: { fecha: 'asc' } }),
    socio
      ? prisma.inscripcion.findMany({ where: { socioId: socio.id } })
      : Promise.resolve([]),
  ]);

  const inscripcionPorEvento = new Map(
    misInscripciones
      .filter((i) => i.estado !== 'cancelada')
      .map((i) => [i.eventoId, i.estado as 'confirmada' | 'lista_espera'])
  );

  const ahora = new Date();

  // Primero lo que viene; lo ya celebrado, al final y del mas reciente al mas antiguo.
  const ordenados = [...eventos.filter((e) => e.fecha >= ahora), ...eventos.filter((e) => e.fecha < ahora).reverse()];

  const items: EventItem[] = ordenados.map((e) => ({
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

  const jsonLd = eventos
    .filter((e) => e.fecha >= ahora)
    .map((e) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: e.titulo,
      startDate: e.fecha.toISOString(),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: e.ubicacion, address: { '@type': 'PostalAddress', addressLocality: e.ubicacion, addressCountry: 'ES' } },
      description: e.descripcion,
      image: [`${SITE_URL}/og.jpg`],
      organizer: { '@type': 'Organization', name: CLUB.nombre, url: SITE_URL },
      url: `${SITE_URL}/eventos/`,
    }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="ev-hero">
        <div className="cnt">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Eventos' }]} />
          <p className="sec-eye" style={{ marginTop: '1.5rem' }} data-r="up">CALENDARIO</p>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem,6vw,5.5rem)', marginTop: '.75rem' }} data-r="up">Próximos<br /><span style={{ color: 'var(--red)' }}>eventos</span></h1>
          <p className="sec-sub" style={{ maxWidth: '600px', marginTop: '1.5rem' }} data-r="up">A lo largo del año el club organiza tandas en circuito, rutas por carretera, viajes a Maranello y encuentros con otros clubs de Europa. Estas son las próximas fechas.</p>
          <div style={{ display: 'flex', gap: '3.5rem', marginTop: '3rem', flexWrap: 'wrap' }} data-r="up">
            <div className="stat"><span className="stat-n">{proximos}</span><span className="stat-l">EVENTOS ABIERTOS</span></div>
            <div className="stat"><span className="stat-n" data-count="200" data-suffix="+">200+</span><span className="stat-l">SOCIOS</span></div>
            <div className="stat"><span className="stat-n">{CLUB.fundacion}</span><span className="stat-l">DESDE</span></div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-3rem', right: 0, fontFamily: 'var(--fd)', fontSize: '20vw', color: 'rgba(255,255,255,.012)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1 }} aria-hidden="true">26</div>
      </section>

      <section style={{ background: 'var(--b90)', padding: '5rem 0' }}>
        <div className="cnt">
          <EventsFilter events={items} haySesion={!!socio} />
        </div>
      </section>

      <section className="ev-join">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 80% 50%,rgba(218,41,28,.12),transparent)', pointerEvents: 'none' }} aria-hidden="true" />
        <div className="cnt" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="rl-g" style={{ width: '60px', margin: '0 auto 2.5rem' }} aria-hidden="true" />
          <p className="sec-eye" data-r="up">ACCESO A EVENTOS</p>
          <h2 className="sec-title" style={{ marginTop: '1rem' }} data-r="up">Para inscribirte,<br /><span style={{ color: 'var(--red)' }}>hazte socio</span></h2>
          <p className="sec-sub" style={{ maxWidth: '540px', margin: '1.5rem auto 0' }} data-r="up">La inscripción a todos nuestros eventos está reservada para socios del Ferrari Club España. Únete y accede al calendario completo de actividades.</p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }} data-r="up">
            <a href="/club/hazte-socio/" className="btn btn-p btn-lg" data-mag>HAZTE SOCIO <span className="btn-ico">→</span></a>
            <a href="/contacta/" className="btn btn-o btn-lg">CONSULTAR DISPONIBILIDAD</a>
          </div>
        </div>
      </section>
    </>
  );
}
