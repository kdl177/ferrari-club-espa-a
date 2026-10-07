/**
 * Alta o actualizacion de un socio. Sin contraseña: el acceso del sitio es
 * por enlace magico al correo, asi que el email tiene que ser real.
 *
 *   node scripts/crear-socio.mjs correo@dominio.com "Nombre" "Apellidos" [admin]
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const [email, nombre, apellidos, rol] = process.argv.slice(2);
if (!email) {
  console.error('Falta el email. Uso: node scripts/crear-socio.mjs correo@dominio.com "Nombre" "Apellidos" [admin]');
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const datos = {
  nombre: nombre || 'Socio',
  apellidos: apellidos || '',
  estadoCuota: 'activo',
  esAdmin: rol === 'admin',
};

const previo = await prisma.user.findUnique({ where: { email } });

const socio = await prisma.user.upsert({
  where: { email },
  create: { email, ...datos, ferrariModelo: 'Por indicar' },
  update: datos,
});

console.log(previo ? 'Socio ya existente, actualizado:' : 'Socio creado:');
console.log({ id: socio.id, email: socio.email, estadoCuota: socio.estadoCuota, esAdmin: socio.esAdmin });

await prisma.$disconnect();
