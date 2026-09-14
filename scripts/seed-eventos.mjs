/**
 * Migra a la base de datos los eventos que hasta ahora vivían hardcodeados
 * en src/app/eventos/page.tsx. Idempotente: se puede reejecutar sin duplicar.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const EVENTOS = [
  {
    slug: 'track-day-jerez-2026',
    titulo: 'Track Day Circuito de Jerez',
    categoria: 'track',
    fecha: new Date('2026-09-20T09:00:00Z'),
    ubicacion: 'Circuito Jerez-Ángel Nieto, Cádiz',
    descripcion: 'Jornada exclusiva en el icónico circuito gaditano. Sesiones cronometradas, instructores Ferrari certificados y asistencia técnica durante toda la jornada.',
    aforo: 30,
  },
  {
    slug: 'gp-singapur-2026',
    titulo: 'GP Singapur — Ferrari Hospitality',
    categoria: 'f1',
    fecha: new Date('2026-09-19T12:00:00Z'),
    ubicacion: 'Marina Bay Street Circuit, Singapur',
    descripcion: 'Fin de semana de carrera con hospitality Ferrari, tribuna oficial y acceso al paddock. Cena exclusiva el sábado con el equipo del club.',
    aforo: 12,
  },
  {
    slug: 'ruta-otono-andalucia-2026',
    titulo: 'Ruta de Otoño — Andalucía',
    categoria: 'rutas',
    fecha: new Date('2026-10-04T08:30:00Z'),
    ubicacion: 'Sevilla → Ronda → Marbella',
    descripcion: 'Tres días de carretera entre olivares centenarios y sierras de Cádiz. Un trazado diseñado para disfrutar al máximo de nuestros Cavallini con paradas en Ronda y Marbella.',
    aforo: 20,
  },
  {
    slug: 'visita-maranello-2026',
    titulo: 'Visita a Maranello',
    categoria: 'maranello',
    fecha: new Date('2026-10-18T10:00:00Z'),
    ubicacion: 'Maranello, Módena, Italia',
    descripcion: 'Acceso exclusivo a la fábrica Ferrari, Museo Enzo Ferrari y el Museo Ferrari de Maranello. Visita guiada en español con intérprete especializado.',
    aforo: 15,
    plazasOcupadas: 13,
  },
  {
    slug: 'concurso-elegancia-xiii',
    titulo: 'XIII Concurso de Elegancia',
    categoria: 'elegancia',
    fecha: new Date('2026-11-08T11:00:00Z'),
    ubicacion: 'Parque del Retiro, Madrid',
    descripcion: 'Decimotercera edición del concurso de elegancia del club. Más de 40 Ferrari históricos y modernos presentados ante un jurado internacional. Tarde de puertas abiertas.',
    aforo: 40,
  },
  {
    slug: 'cena-gala-2026',
    titulo: 'Cena de Gala Anual 2026',
    categoria: 'club',
    fecha: new Date('2026-12-06T20:30:00Z'),
    ubicacion: 'Hotel Mandarin Oriental Ritz, Madrid',
    descripcion: 'Cena de clausura del año con reconocimientos a socios destacados, sorteo de experiencias exclusivas y actuación en directo. Etiqueta formal requerida.',
    aforo: 120,
  },
  {
    slug: 'cavalcade-classiche-toscana-2026',
    titulo: 'Cavalcade Classiche — Toscana',
    categoria: 'cavalcade',
    fecha: new Date('2026-07-13T09:00:00Z'),
    ubicacion: 'Toscana, Italia',
    descripcion: 'Cuatro días de ruta por la Toscana con Ferrari históricos. Edición especial con motivo del centenario de la escudería. 18 socios participantes.',
    aforo: 18,
    plazasOcupadas: 18,
  },
];

for (const ev of EVENTOS) {
  const { slug, plazasOcupadas = 0, ...resto } = ev;
  await prisma.evento.upsert({
    where: { slug },
    create: { slug, plazasOcupadas, ...resto },
    update: { ...resto },
  });
  console.log(`✓ ${slug} (aforo ${ev.aforo}, ocupadas ${plazasOcupadas})`);
}

const total = await prisma.evento.count();
console.log(`\nTotal eventos en BD: ${total}`);
await prisma.$disconnect();
