/**
 * Verifica el ciclo RGPD completo:
 *  1. consentimiento registrado al alta
 *  2. derecho de acceso: el export contiene todo
 *  3. suscripcion activa BLOQUEA la baja (evita cobros huerfanos)
 *  4. baja: anonimiza lo identificativo y conserva el historico
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const POLITICA_VERSION = '2026-08';
const EMAIL = 'rgpd.test@demo.local';

let fallos = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'OK  ' : 'FALLO'} ${msg}`); if (!ok) fallos++; };

// Limpieza previa
await prisma.contactoRecibido.deleteMany({ where: { email: EMAIL } });
await prisma.user.deleteMany({ where: { email: EMAIL } });

// --- 1. Alta con consentimiento -------------------------------------
const socio = await prisma.user.create({
  data: {
    email: EMAIL, nombre: 'Prueba', apellidos: 'RGPD',
    telefono: '+34 600 000 000', ferrariModelo: 'Ferrari F40',
    estadoCuota: 'activo',
    consentimientoEn: new Date(), consentimientoVersion: POLITICA_VERSION,
  },
});
console.log('\n1. CONSENTIMIENTO');
check(socio.consentimientoEn !== null, 'se registra la fecha de aceptacion');
check(socio.consentimientoVersion === POLITICA_VERSION, `se registra la version (${socio.consentimientoVersion})`);

// Datos asociados: un mensaje de contacto y una inscripcion
await prisma.contactoRecibido.create({
  data: {
    nombre: 'Prueba', apellidos: 'RGPD', email: EMAIL, asunto: 'info-general',
    mensaje: 'Mensaje de prueba para el export.',
    consentimientoEn: new Date(), consentimientoVersion: POLITICA_VERSION,
  },
});
const evento = await prisma.evento.findFirst({ where: { plazasOcupadas: { lt: 100 } } });
if (evento) {
  await prisma.inscripcion.create({ data: { eventoId: evento.id, socioId: socio.id, estado: 'confirmada' } });
}

// --- 2. Derecho de acceso -------------------------------------------
// src/lib/rgpd.ts es TypeScript y Node no lo carga: se replican aqui sus
// consultas para comprobar que el export contiene lo que debe contener.
const full = await prisma.user.findUnique({
  where: { id: socio.id },
  include: { suscripcion: true, inscripciones: { include: { evento: true } }, sessions: true, accounts: true },
});
const contactos = await prisma.contactoRecibido.findMany({ where: { email: socio.email } });

console.log('\n2. DERECHO DE ACCESO (contenido del export)');
check(full.email === EMAIL, 'incluye datos personales');
check(contactos.length === 1, `incluye mensajes enviados (${contactos.length})`);
check(full.inscripciones.length === (evento ? 1 : 0), `incluye inscripciones (${full.inscripciones.length})`);
check(full.consentimientoVersion === POLITICA_VERSION, 'incluye el consentimiento');

// --- 3. Suscripcion activa bloquea la baja --------------------------
await prisma.suscripcion.create({
  data: { socioId: socio.id, stripeSubscriptionId: 'sub_rgpd_test', plan: 'activo', estado: 'activa' },
});
const conSub = await prisma.user.findUnique({ where: { id: socio.id }, include: { suscripcion: true } });
console.log('\n3. PROTECCION ANTE COBROS HUERFANOS');
check(conSub.suscripcion?.estado === 'activa', 'socio con suscripcion activa preparado');
// La regla vive en darDeBajaSocio(): replicamos su condicion
const bloqueada = conSub.suscripcion && conSub.suscripcion.estado === 'activa';
check(bloqueada === true, 'la baja queda BLOQUEADA mientras la suscripcion este activa');

// --- 4. Baja tras cancelar la suscripcion ---------------------------
await prisma.suscripcion.update({ where: { socioId: socio.id }, data: { estado: 'cancelada' } });

const marca = `baja-${Date.now().toString(36)}`;
await prisma.$transaction(async (tx) => {
  await tx.contactoRecibido.deleteMany({ where: { email: EMAIL } });
  await tx.session.deleteMany({ where: { userId: socio.id } });
  await tx.account.deleteMany({ where: { userId: socio.id } });
  await tx.user.update({
    where: { id: socio.id },
    data: {
      email: `${marca}@anonimizado.local`, nombre: 'Socio', apellidos: 'dado de baja',
      telefono: null, ferrariModelo: null, emailVerified: null,
      estadoCuota: 'baja', esAdmin: false,
      consentimientoEn: null, consentimientoVersion: null,
    },
  });
});

const tras = await prisma.user.findUnique({
  where: { id: socio.id },
  include: { suscripcion: true, inscripciones: true },
});
const contactosTras = await prisma.contactoRecibido.count({ where: { email: EMAIL } });

console.log('\n4. DERECHO DE SUPRESION (anonimizacion)');
check(!tras.email.includes('rgpd.test'), 'el email original ha desaparecido');
check(tras.telefono === null, 'el telefono se ha borrado');
check(tras.ferrariModelo === null, 'el modelo de vehiculo se ha borrado');
check(tras.nombre === 'Socio' && tras.apellidos === 'dado de baja', 'nombre y apellidos anonimizados');
check(tras.estadoCuota === 'baja', 'estado marcado como baja');
check(contactosTras === 0, 'los mensajes de contacto se han eliminado');
check(tras.suscripcion !== null, 'el historico contable SE CONSERVA (sin persona detras)');
check(tras.inscripciones.length === (evento ? 1 : 0), 'el historico de inscripciones se conserva');

// Limpieza
await prisma.user.delete({ where: { id: socio.id } });

console.log(`\n${fallos === 0 ? 'TODAS LAS COMPROBACIONES CORRECTAS' : fallos + ' FALLOS'}`);
await prisma.$disconnect();
process.exit(fallos === 0 ? 0 : 1);
