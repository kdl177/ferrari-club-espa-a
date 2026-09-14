import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { enviarEmailBienvenida } from '@/lib/email';

const PLAN_BY_PRICE: Record<string, 'base' | 'activo' | 'familiar'> = {
  [process.env.STRIPE_PRICE_SOCIO_BASE ?? '']: 'base',
  [process.env.STRIPE_PRICE_SOCIO_ACTIVO ?? '']: 'activo',
  [process.env.STRIPE_PRICE_SOCIO_FAMILIAR ?? '']: 'familiar',
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Falta la firma del webhook.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Firma inválida';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const socioId = session.client_reference_id ?? session.metadata?.socioId;
      if (!socioId || !session.subscription || !session.customer) break;

      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
      const plan = (session.metadata?.plan as 'base' | 'activo' | 'familiar') ?? 'base';

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

      const renuevaEn = currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null;

      const socio = await prisma.user.update({
        where: { id: socioId },
        data: {
          estadoCuota: 'activo',
          stripeCustomerId: customerId,
          suscripcion: {
            upsert: {
              create: {
                stripeSubscriptionId: subscriptionId,
                plan,
                estado: 'activa',
                renuevaEn,
              },
              update: {
                stripeSubscriptionId: subscriptionId,
                plan,
                estado: 'activa',
                renuevaEn,
              },
            },
          },
        },
      });

      // Un fallo de email no debe devolver error: Stripe reintentaría el evento
      // y volvería a ejecutar la activación.
      try {
        await enviarEmailBienvenida({
          email: socio.email,
          nombre: socio.nombre || socio.email,
          plan,
          renuevaEn,
        });
      } catch (err) {
        console.error('[webhook] fallo al enviar email de bienvenida:', err);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (!customerId) break;

      const socio = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
      if (!socio) break;

      await prisma.user.update({
        where: { id: socio.id },
        data: {
          estadoCuota: 'moroso',
          suscripcion: { update: { estado: 'impagada' } },
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

      const socio = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
      if (!socio) break;

      await prisma.user.update({
        where: { id: socio.id },
        data: {
          estadoCuota: 'baja',
          suscripcion: { update: { estado: 'cancelada' } },
        },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
