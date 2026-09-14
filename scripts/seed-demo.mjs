/**
 * Datos de demostracion para revisar el panel admin.
 * Borrar con: node --env-file=.env.local scripts/seed-demo.mjs --limpiar
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const DEMO_EMAILS = [
  'junta@ferrariclubespana.demo',
  'carlos.mendez@demo.local',
  'elena.ruiz@demo.local',
  'javier.soto@demo.local',
  'marta.vidal@demo.local',
];

const DEMO_CONTACTO_EMAILS = [
  'alberto.nieto@demo.local',
  'lucia.ferrer@demo.local',
  'prensa@motorclasico.demo',
];

if (process.argv.includes('--limpiar')) {
  await prisma.contactoRecibido.deleteMany({ where: { email: { in: DEMO_CONTACTO_EMAILS } } });
  await prisma.user.deleteMany({ where: { email: { in: DEMO_EMAILS } } });
  console.log('Datos de demo eliminados.');
  console.log('socios:', await prisma.user.count(), '| contactos:', await prisma.contactoRecibido.count());
  await prisma.$disconnect();
  process.exit(0);
}

const dias = (n) => new Date(Date.now() - n * 86400000);
const horas = (n) => new Date(Date.now() - n * 3600000);

const SOCIOS = [
  { email: 'junta@ferrariclubespana.demo', nombre: 'Junta', apellidos: 'Directiva', ferrariModelo: 'Ferrari 812 Competizione', telefono: '+34 915 754 160', estadoCuota: 'activo', esAdmin: true, creadoEn: dias(900) },
  { email: 'carlos.mendez@demo.local', nombre: 'Carlos', apellidos: 'Méndez Arroyo', ferrariModelo: 'Ferrari 296 GTB (2024)', telefono: '+34 600 111 222', estadoCuota: 'activo', esAdmin: false, creadoEn: dias(40) },
  { email: 'elena.ruiz@demo.local', nombre: 'Elena', apellidos: 'Ruiz Salvador', ferrariModelo: 'Ferrari Roma Spider (2023)', telefono: '+34 600 333 444', estadoCuota: 'activo', esAdmin: false, creadoEn: dias(25) },
  { email: 'javier.soto@demo.local', nombre: 'Javier', apellidos: 'Soto Lima', ferrariModelo: 'Ferrari SF90 Stradale', telefono: '+34 600 555 666', estadoCuota: 'pendiente', esAdmin: false, creadoEn: dias(3) },
  { email: 'marta.vidal@demo.local', nombre: 'Marta', apellidos: 'Vidal Ortega', ferrariModelo: 'Ferrari F8 Tributo', telefono: '+34 600 777 888', estadoCuota: 'moroso', esAdmin: false, creadoEn: dias(400) },
];

for (const s of SOCIOS) {
  await prisma.user.upsert({ where: { email: s.email }, create: s, update: s });
}

// Suscripciones para los socios con cuota activa (como las crearia Stripe)
const carlos = await prisma.user.findUnique({ where: { email: 'carlos.mendez@demo.local' } });
const elena = await prisma.user.findUnique({ where: { email: 'elena.ruiz@demo.local' } });
const marta = await prisma.user.findUnique({ where: { email: 'marta.vidal@demo.local' } });

const SUBS = [
  { socioId: carlos.id, plan: 'activo', estado: 'activa', renuevaEn: new Date(Date.now() + 325 * 86400000), sub: 'sub_demo_carlos' },
  { socioId: elena.id, plan: 'base', estado: 'activa', renuevaEn: new Date(Date.now() + 340 * 86400000), sub: 'sub_demo_elena' },
  { socioId: marta.id, plan: 'familiar', estado: 'impagada', renuevaEn: new Date(Date.now() - 35 * 86400000), sub: 'sub_demo_marta' },
];

for (const s of SUBS) {
  await prisma.suscripcion.upsert({
    where: { socioId: s.socioId },
    create: { socioId: s.socioId, stripeSubscriptionId: s.sub, plan: s.plan, estado: s.estado, renuevaEn: s.renuevaEn },
    update: { plan: s.plan, estado: s.estado, renuevaEn: s.renuevaEn },
  });
}

const CONTACTOS = [
  {
    nombre: 'Alberto', apellidos: 'Nieto Gil', email: 'alberto.nieto@demo.local', telefono: '+34 611 222 333',
    asunto: 'hacerse-socio', ferrariModelo: 'Ferrari Portofino M',
    mensaje: 'Buenas tardes. Acabo de adquirir un Portofino M y me gustaría recibir información sobre el proceso de alta como socio y las cuotas vigentes. Gracias.',
    atendido: false, creadoEn: horas(2),
  },
  {
    nombre: 'Lucía', apellidos: 'Ferrer Blanco', email: 'lucia.ferrer@demo.local', telefono: null,
    asunto: 'eventos', ferrariModelo: null,
    mensaje: 'Quisiera reservar para el evento: Track Day Circuito de Jerez. ¿Quedan plazas disponibles para acompañante?',
    atendido: false, creadoEn: dias(1),
  },
  {
    nombre: 'Redacción', apellidos: 'Motor Clásico', email: 'prensa@motorclasico.demo', telefono: '+34 912 000 111',
    asunto: 'prensa', ferrariModelo: null,
    mensaje: 'Estamos preparando un reportaje sobre clubs oficiales Ferrari en España y nos gustaría concertar una entrevista con la Junta Directiva.',
    atendido: true, creadoEn: dias(6),
  },
];

await prisma.contactoRecibido.deleteMany({ where: { email: { in: DEMO_CONTACTO_EMAILS } } });
for (const c of CONTACTOS) await prisma.contactoRecibido.create({ data: c });

// Una noticia publicada y otra en borrador
await prisma.noticia.deleteMany({ where: { slug: { in: ['bienvenida-temporada-2026', 'borrador-cena-gala'] } } });
await prisma.noticia.create({
  data: {
    titulo: 'Arranca la temporada 2026 del club',
    slug: 'bienvenida-temporada-2026',
    categoria: 'CLUB',
    cuerpo: 'El Ferrari Club España abre la temporada 2026 con el calendario más ambicioso de su historia: más de 35 actividades repartidas entre track days, rutas, Grandes Premios y la visita anual a Maranello.',
    publicadoEn: dias(5),
  },
});
await prisma.noticia.create({
  data: {
    titulo: 'Cena de Gala 2026: apertura de inscripciones',
    slug: 'borrador-cena-gala',
    categoria: 'CLUB',
    cuerpo: 'Borrador pendiente de confirmar el menú y el precio por comensal con el hotel.',
    publicadoEn: null,
  },
});

// Sesion valida para entrar al panel como Junta Directiva
const admin = await prisma.user.findUnique({ where: { email: 'junta@ferrariclubespana.demo' } });
await prisma.session.deleteMany({ where: { userId: admin.id } });
const token = `demo-admin-${randomUUID()}`;
await prisma.session.create({
  data: { sessionToken: token, userId: admin.id, expires: new Date(Date.now() + 86400000) },
});

console.log('socios:', await prisma.user.count());
console.log('contactos:', await prisma.contactoRecibido.count());
console.log('noticias:', await prisma.noticia.count());
console.log('SESSION_TOKEN=' + token);

await prisma.$disconnect();
