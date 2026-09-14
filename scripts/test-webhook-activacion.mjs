/**
 * Prueba la ruta de activación del webhook sin pasar por la UI de Checkout.
 * Crea una suscripción real de test en el sandbox y reconstruye el evento
 * checkout.session.completed con el socioId real, tal como lo enviaría Stripe.
 */
import 'dotenv/config';
import Stripe from 'stripe';
import { createHmac } from 'node:crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_URL = 'http://localhost:3000/api/stripe/webhook';
const SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const socioId = process.argv[2];
const socioEmail = process.argv[3];
if (!socioId || !socioEmail) {
  console.error('Uso: node scripts/test-webhook-activacion.mjs <socioId> <email>');
  process.exit(1);
}

// 1. Cliente + suscripción reales en el sandbox, con tarjeta de test.
const pm = await stripe.paymentMethods.create({
  type: 'card',
  card: { token: 'tok_visa' },
});

const customer = await stripe.customers.create({
  email: socioEmail,
  payment_method: pm.id,
  invoice_settings: { default_payment_method: pm.id },
});

const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: process.env.STRIPE_PRICE_SOCIO_ACTIVO }],
});

console.log('customer:', customer.id);
console.log('subscription:', subscription.id, '| status:', subscription.status);

// 2. Evento con la misma forma que envía Stripe, firmado con el secreto real.
const event = {
  id: `evt_test_${Date.now()}`,
  object: 'event',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: `cs_test_${Date.now()}`,
      object: 'checkout_session',
      client_reference_id: socioId,
      customer: customer.id,
      subscription: subscription.id,
      metadata: { socioId, plan: 'activo' },
    },
  },
};

const payload = JSON.stringify(event);
const timestamp = Math.floor(Date.now() / 1000);
const signature = createHmac('sha256', SECRET)
  .update(`${timestamp}.${payload}`)
  .digest('hex');

const res = await fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': `t=${timestamp},v1=${signature}`,
  },
  body: payload,
});

console.log('webhook respondió:', res.status, await res.text());
