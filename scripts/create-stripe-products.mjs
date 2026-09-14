import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANES = [
  { key: 'BASE', name: 'Socio Base', desc: 'Carnet oficial, acceso a eventos y publicaciones del club, directorio de socios, descuentos en concesionarios.', amount: 15000 },
  { key: 'ACTIVO', name: 'Socio Activo', desc: 'Todo lo del Socio Base + track days, rutas, visitas a Maranello, descuento en GP F1, Cavalcade Classiche, voto en asamblea.', amount: 35000 },
  { key: 'FAMILIAR', name: 'Socio Familiar', desc: '2 miembros por cuota, todos los beneficios del Socio Activo, invitaciones dobles, área de socios compartida.', amount: 50000 },
];

async function main() {
  for (const plan of PLANES) {
    const product = await stripe.products.create({
      name: `Ferrari Club España — ${plan.name}`,
      description: plan.desc,
    });
    const price = await stripe.prices.create({
      product: product.id,
      currency: 'eur',
      unit_amount: plan.amount,
      recurring: { interval: 'year' },
    });
    console.log(`STRIPE_PRICE_SOCIO_${plan.key}="${price.id}"`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
