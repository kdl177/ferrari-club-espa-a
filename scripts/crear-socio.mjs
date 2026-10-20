/**
 * Alta o actualizacion de un socio.
 *
 *   node scripts/crear-socio.mjs correo@dominio.com "Nombre" "Apellidos" [admin] [--clave]
 *
 * Sin --clave la cuenta entra solo con el enlace al correo. Con --clave se le
 * genera una contraseña aleatoria, se guarda cifrada (scrypt) y se muestra UNA
 * vez por pantalla: no queda escrita en ningun sitio.
 */
import 'dotenv/config';
import { randomBytes, scryptSync } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const args = process.argv.slice(2);
const conClave = args.includes('--clave');
const [email, nombre, apellidos, rol] = args.filter((a) => a !== '--clave');
if (!email) {
  console.error('Falta el email. Uso: node scripts/crear-socio.mjs correo@dominio.com "Nombre" "Apellidos" [admin] [--clave]');
  process.exit(1);
}

// Mismo formato que comprueba src/auth.ts: "sal:hash" en hex.
function cifrar(clave) {
  const sal = randomBytes(16).toString('hex');
  return `${sal}:${scryptSync(clave, sal, 64).toString('hex')}`;
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

// Sin caracteres que se confundan al dictarla (0/O, 1/l/I).
const ALFABETO = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const clave = conClave ? Array.from(randomBytes(16), (b) => ALFABETO[b % ALFABETO.length]).join('') : null;

const datos = {
  nombre: nombre || 'Socio',
  apellidos: apellidos || '',
  estadoCuota: 'activo',
  esAdmin: rol === 'admin',
  ...(clave ? { passwordHash: cifrar(clave) } : {}),
};

const previo = await prisma.user.findUnique({ where: { email } });

const socio = await prisma.user.upsert({
  where: { email },
  create: { email, ...datos, ferrariModelo: 'Por indicar' },
  update: datos,
});

console.log(previo ? 'Socio ya existente, actualizado:' : 'Socio creado:');
console.log({ id: socio.id, email: socio.email, estadoCuota: socio.estadoCuota, esAdmin: socio.esAdmin });
if (clave) console.log(`\nContraseña (no se vuelve a mostrar): ${clave}`);

await prisma.$disconnect();
