/**
 * Verifica que el registro de eventos de Stripe (EventoStripe) captura los
 * tres casos que antes desaparecian en un console.error:
 *   1. evento procesado con exito (alta de socio real)
 *   2. evento IGNORADO por falta de socioId (el caso mas peligroso: un pago
 *      que Stripe confirma pero que el webhook descarta en silencio)
 *   3. evento con ERROR real (socioId que no existe en BD -> excepcion)
 * y que la idempotencia funciona: reenviar el mismo evento no lo duplica.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createHmac, randomUUID } from 'node:crypto';
import Stripe from 'stripe';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const WEBHOOK_URL = 'http://localhost:3000/api/stripe/webhook';
const SECRET = process.env.STRIPE_WEBHOOK_SECRET;

let fallos = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'OK  ' : 'FALLO'} ${msg}`); if (!ok) fallos++; };

function firmarYEnviar(event) {
  const payload = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', SECRET).update(`${timestamp}.${payload}`).digest('hex');
  return fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'stripe-signature': `t=${timestamp},v1=${signature}` },
    body: payload,
  });
}

function eventoCheckoutCompletado({ id, socioId, customer, subscription }) {
  return {
    id, object: 'event', type: 'checkout.session.completed',
    data: { object: { id: 'cs_' + id, object: 'checkout_session', client_reference_id: socioId, customer, subscription, metadata: { socioId, plan: 'activo' } } },
  };
}

// Limpieza previa
await prisma.eventoStripe.deleteMany({ where: { stripeEventId: { startsWith: 'evt_obs_test_' } } });
await prisma.user.deleteMany({ where: { email: 'obs.pagos@demo.local' } });

console.log('\n1. EVENTO PROCESADO (alta real)');
const socio = await prisma.user.create({
  data: { email: 'obs.pagos@demo.local', nombre: 'Prueba', apellidos: 'Observabilidad', estadoCuota: 'pendiente' },
});
const cus = new Stripe(process.env.STRIPE_SECRET_KEY);
const pm = await cus.paymentMethods.create({ type: 'card', card: { token: 'tok_visa' } });
const customer = await cus.customers.create({ email: socio.email, payment_method: pm.id, invoice_settings: { default_payment_method: pm.id } });
const subscription = await cus.subscriptions.create({ customer: customer.id, items: [{ price: process.env.STRIPE_PRICE_SOCIO_ACTIVO }] });

const evtProcesado = 'evt_obs_test_procesado_' + randomUUID();
const r1 = await firmarYEnviar(eventoCheckoutCompletado({ id: evtProcesado, socioId: socio.id, customer: customer.id, subscription: subscription.id }));
check(r1.status === 200, `webhook respondió 200 (fue ${r1.status})`);

const log1 = await prisma.eventoStripe.findUnique({ where: { stripeEventId: evtProcesado } });
check(log1?.resultado === 'procesado', `EventoStripe registrado como 'procesado' (fue '${log1?.resultado}')`);
check(log1?.socioId === socio.id, 'el registro guarda el socioId correcto');

console.log('\n2. EVENTO IGNORADO (sin socioId — el caso mas peligroso)');
const evtIgnorado = 'evt_obs_test_ignorado_' + randomUUID();
const r2 = await firmarYEnviar({
  id: evtIgnorado, object: 'event', type: 'checkout.session.completed',
  data: { object: { id: 'cs_sin_socio', object: 'checkout_session', client_reference_id: null, customer: 'cus_fantasma', metadata: {} } },
});
check(r2.status === 200, `webhook respondió 200 (fue ${r2.status})`);
const log2 = await prisma.eventoStripe.findUnique({ where: { stripeEventId: evtIgnorado } });
check(log2?.resultado === 'ignorado', `EventoStripe registrado como 'ignorado' (fue '${log2?.resultado}')`);
check(!!log2?.detalle?.includes('client_reference_id'), `el detalle explica la causa: "${log2?.detalle}"`);

console.log('\n3. EVENTO CON ERROR (socioId inexistente en BD)');
const evtError = 'evt_obs_test_error_' + randomUUID();
const r3 = await firmarYEnviar(eventoCheckoutCompletado({
  id: evtError, socioId: 'id-que-no-existe-en-bd', customer: 'cus_x', subscription: subscription.id,
}));
check(r3.status === 500, `webhook respondió 500 para que Stripe reintente (fue ${r3.status})`);
const log3 = await prisma.eventoStripe.findUnique({ where: { stripeEventId: evtError } });
check(log3?.resultado === 'error', `EventoStripe registrado como 'error' (fue '${log3?.resultado}')`);
check(!!log3?.detalle && log3.detalle.length > 0, `el detalle contiene el mensaje real de la excepcion: "${log3?.detalle?.slice(0, 80)}"`);

console.log('\n4. IDEMPOTENCIA (reenviar el mismo evento no lo duplica)');
const r4 = await firmarYEnviar(eventoCheckoutCompletado({ id: evtProcesado, socioId: socio.id, customer: customer.id, subscription: subscription.id }));
const cuerpo4 = await r4.json();
check(cuerpo4.duplicado === true, 'el reenvío se detecta como duplicado');
const totalConEseId = await prisma.eventoStripe.count({ where: { stripeEventId: evtProcesado } });
check(totalConEseId === 1, `solo existe 1 registro para ese stripeEventId (hay ${totalConEseId})`);

// Limpieza
await cus.subscriptions.cancel(subscription.id).catch(() => {});
await cus.customers.del(customer.id).catch(() => {});
await prisma.eventoStripe.deleteMany({ where: { stripeEventId: { startsWith: 'evt_obs_test_' } } });
await prisma.user.deleteMany({ where: { email: 'obs.pagos@demo.local' } });

console.log(`\n${fallos === 0 ? 'TODAS LAS COMPROBACIONES CORRECTAS' : fallos + ' FALLOS'}`);
await prisma.$disconnect();
process.exit(fallos === 0 ? 0 : 1);
