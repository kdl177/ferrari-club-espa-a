/**
 * Requiere BD y servidor arriba: `npm run db:up` y `npm run dev`.
 *
 * Verifica que /api/stripe/checkout solo abre cobro para altas pendientes:
 *  1. socio en 'pendiente' -> deja pasar
 *  2. socio en 'activo'    -> 409 (no se cobra a quien ya es socio)
 *  3. socio inexistente    -> 404
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000';
const EMAIL = 'checkout.test@demo.local';

let fallos = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'OK  ' : 'FALLO'} ${msg}`); if (!ok) fallos++; };

const pedirCheckout = async (socioId) => {
  const r = await fetch(`${BASE}/api/stripe/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ socioId, plan: 'base' }),
  });
  return r.status;
};

await prisma.user.deleteMany({ where: { email: EMAIL } });

const socio = await prisma.user.create({
  data: { email: EMAIL, nombre: 'Test', apellidos: 'Checkout', ferrariModelo: '296 GTB', estadoCuota: 'pendiente' },
});

check(await pedirCheckout(socio.id) < 400, 'alta pendiente puede pagar la cuota');

await prisma.user.update({ where: { id: socio.id }, data: { estadoCuota: 'activo' } });
check(await pedirCheckout(socio.id) === 409, 'socio ya activo no puede abrir otro cobro');

check(await pedirCheckout('id-que-no-existe') === 404, 'socio inexistente rechazado');

await prisma.user.deleteMany({ where: { email: EMAIL } });
await prisma.$disconnect();

console.log(fallos === 0 ? '\nTodo correcto.' : `\n${fallos} fallo(s).`);
process.exit(fallos === 0 ? 0 : 1);
