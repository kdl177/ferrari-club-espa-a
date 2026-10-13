/**
 * Carga en la base de datos el calendario que el club publica en
 * ferrariclubespana.com y borra los eventos de demostracion que se usaron
 * para montar la web (Jerez, Singapur, Toscana...), que nunca existieron.
 * Idempotente: se puede reejecutar sin duplicar.
 *
 *   node --env-file=.env.local scripts/seed-eventos.mjs
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DE_DEMOSTRACION = [
  'track-day-jerez-2026',
  'gp-singapur-2026',
  'ruta-otono-andalucia-2026',
  'visita-maranello-2026',
  'concurso-elegancia-xiii',
  'cena-gala-2026',
  'cavalcade-classiche-toscana-2026',
];

// Fechas y titulos tal y como los publica el club. No publica aforo, asi que
// se deja vacio: la inscripcion no tiene tope hasta que la junta lo fije.
const EVENTOS = [
  {
    slug: 'concurso-elegancia-costa-del-sol-2026',
    titulo: 'Concurso de Elegancia Costa del Sol',
    categoria: 'elegancia',
    fecha: new Date('2026-10-01T10:00:00Z'),
    ubicacion: 'Marbella, Málaga',
    descripcion: 'Concurso de Elegancia Costa del Sol, en Marbella.',
  },
  {
    slug: 'tandas-solidarias-calafat-2026',
    titulo: 'Tandas Solidarias — Circuito de Calafat',
    categoria: 'track',
    fecha: new Date('2026-11-07T09:00:00Z'),
    ubicacion: 'Circuito de Calafat, Tarragona',
    descripcion: 'Organización: Ferrari Club España.',
  },
  {
    slug: 'road-to-finali-mondiali-2026',
    titulo: 'Road to Finali Mondiali Ferrari',
    categoria: 'track',
    fecha: new Date('2026-11-17T09:00:00Z'),
    ubicacion: 'Circuit de Barcelona-Catalunya, Montmeló',
    descripcion:
      'Organización: Ferrari Club España. Opciones: todo el evento del 18 al 21 de noviembre (3 noches), cena de gala del 20 de noviembre con 1 noche de hotel y parking, o solo la cena de gala. No socios FOC: desde 2.550 € IVA incluido.',
  },
  {
    slug: 'cena-gala-navidad-barcelona-2026',
    titulo: 'Cena de Gala de Navidad',
    categoria: 'club',
    fecha: new Date('2026-11-20T20:00:00Z'),
    ubicacion: 'Barcelona',
    descripcion: 'Organización: Ferrari Club España.',
  },
  {
    slug: 'ucles-segobriga-2027',
    titulo: 'Uclés — Segóbriga',
    categoria: 'rutas',
    fecha: new Date('2027-04-29T09:00:00Z'),
    ubicacion: 'Uclés y Segóbriga, Cuenca',
    descripcion: 'Evento pospuesto de 2026 a 2027.',
  },
];

const borrados = await prisma.evento.deleteMany({ where: { slug: { in: DE_DEMOSTRACION } } });
console.log(`Eventos de demostración borrados: ${borrados.count}`);

for (const { slug, ...resto } of EVENTOS) {
  await prisma.evento.upsert({
    where: { slug },
    create: { slug, aforo: null, ...resto },
    update: resto,
  });
  console.log(`✓ ${slug}`);
}

const total = await prisma.evento.count();
console.log(`\nTotal eventos en BD: ${total}`);
await prisma.$disconnect();
