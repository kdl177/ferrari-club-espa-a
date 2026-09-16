import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { Prisma } from '@prisma/client';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { enviarEmailBienvenida } from '@/lib/email';

const PLAN_BY_PRICE: Record<string, 'base' | 'activo' | 'familiar'> = {
  [process.env.STRIPE_PRICE_SOCIO_BASE ?? '']: 'base',
  [process.env.STRIPE_PRICE_SOCIO_ACTIVO ?? '']: 'activo',
  [process.env.STRIPE_PRICE_SOCIO_FAMILIAR ?? '']: 'familiar',
};

type Resultado = { resultado: 'procesado' | 'ignorado'; detalle: string; socioId?: string };

async function manejarCheckoutCompletado(event: Stripe.Event): Promise<Resultado> {
  const session = event.data.object as Stripe.Checkout.Session;
  const socioId = session.client_reference_id ?? session.metadata?.socioId;

  if (!socioId) return { resultado: 'ignorado', detalle: 'Sesión sin client_reference_id ni metadata.socioId.' };
  if (!session.subscription) return { resultado: 'ignorado', detalle: 'Sesión sin subscription asociada.', socioId };
  if (!session.customer) return { resultado: 'ignorado', detalle: 'Sesión sin customer asociado.', socioId };

  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;

  let plan = (session.metadata?.plan as 'base' | 'activo' | 'familiar' | undefined) ?? undefined;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
  const resolvedPriceId = subscription.items.data[0]?.price.id;

  if (!plan && resolvedPriceId) plan = PLAN_BY_PRICE[resolvedPriceId];
  if (!plan) plan = 'base';

  const renuevaEn = currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null;
  const planNoReconocido = resolvedPriceId && !PLAN_BY_PRICE[resolvedPriceId] && !session.metadata?.plan;

  const socio = await prisma.user.update({
    where: { id: socioId },
    data: {
      estadoCuota: 'activo',
      stripeCustomerId: customerId,
      suscripcion: {
        upsert: {
          create: { stripeSubscriptionId: subscriptionId, plan, estado: 'activa', renuevaEn },
          update: { stripeSubscriptionId: subscriptionId, plan, estado: 'activa', renuevaEn },
        },
      },
    },
  });

  // Un fallo de email no debe impedir marcar el evento como procesado: la
  // activacion (lo que importa de verdad) ya se guardo.
  try {
    await enviarEmailBienvenida({ email: socio.email, nombre: socio.nombre || socio.email, plan, renuevaEn });
  } catch (err) {
    console.error('[webhook] fallo al enviar email de bienvenida:', err);
  }

  return {
    resultado: 'procesado',
    socioId,
    detalle: planNoReconocido
      ? `Activado con plan por defecto 'base': el price ${resolvedPriceId} no está en PLAN_BY_PRICE.`
      : `Suscripción activada, plan ${plan}.`,
  };
}

async function manejarPagoFallido(event: Stripe.Event): Promise<Resultado> {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

  if (!customerId) return { resultado: 'ignorado', detalle: 'Invoice sin customer asociado.' };

  const socio = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!socio) return { resultado: 'ignorado', detalle: `Ningún socio tiene stripeCustomerId=${customerId}.` };

  await prisma.user.update({
    where: { id: socio.id },
    data: { estadoCuota: 'moroso', suscripcion: { update: { estado: 'impagada' } } },
  });

  return { resultado: 'procesado', socioId: socio.id, detalle: 'Socio marcado como moroso.' };
}

async function manejarSuscripcionCancelada(event: Stripe.Event): Promise<Resultado> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

  const socio = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!socio) return { resultado: 'ignorado', detalle: `Ningún socio tiene stripeCustomerId=${customerId}.` };

  await prisma.user.update({
    where: { id: socio.id },
    data: { estadoCuota: 'baja', suscripcion: { update: { estado: 'cancelada' } } },
  });

  return { resultado: 'procesado', socioId: socio.id, detalle: 'Socio dado de baja.' };
}

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

  // Idempotencia: si Stripe reintenta un evento que ya procesamos (timeout
  // de red tras completar, por ejemplo), no lo volvemos a ejecutar. El
  // stripeEventId es unico por evento real de Stripe, no por reintento.
  const yaRegistrado = await prisma.eventoStripe.findUnique({ where: { stripeEventId: event.id } });
  if (yaRegistrado) {
    return NextResponse.json({ received: true, duplicado: true });
  }

  let resultado: Resultado = { resultado: 'ignorado', detalle: `Tipo de evento no manejado: ${event.type}.` };
  let huboError: string | null = null;

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        resultado = await manejarCheckoutCompletado(event);
        break;
      case 'invoice.payment_failed':
        resultado = await manejarPagoFallido(event);
        break;
      case 'customer.subscription.deleted':
        resultado = await manejarSuscripcionCancelada(event);
        break;
      default:
        break;
    }
  } catch (err) {
    huboError = err instanceof Error ? err.message : 'Error desconocido';
    console.error(`[webhook] error procesando ${event.type} (${event.id}):`, err);
  }

  // El registro se guarda SIEMPRE, incluso si el procesamiento exploto.
  // Es precisamente el caso que antes desaparecia en un console.error.
  await prisma.eventoStripe.create({
    data: {
      stripeEventId: event.id,
      tipo: event.type,
      resultado: huboError ? 'error' : resultado.resultado,
      detalle: huboError ?? resultado.detalle,
      socioId: resultado.socioId ?? null,
      payloadResumen: resumenPayload(event),
    },
  });

  if (huboError) {
    // 500 para que Stripe reintente: el fallo puede ser transitorio
    // (BD caida un instante) y merece una segunda oportunidad real.
    return NextResponse.json({ error: huboError }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function resumenPayload(event: Stripe.Event): Prisma.InputJsonValue {
  const obj = event.data.object as unknown as Record<string, unknown>;
  const resumen: Record<string, unknown> = {};
  if ('id' in obj) resumen.objectId = obj.id;
  if ('customer' in obj) resumen.customer = obj.customer;
  if ('subscription' in obj) resumen.subscription = obj.subscription;
  if ('client_reference_id' in obj) resumen.clientReferenceId = obj.client_reference_id;
  if ('metadata' in obj) resumen.metadata = obj.metadata;
  // JSON.parse(JSON.stringify(...)) garantiza que el objeto es JSON-compatible
  // (sin undefined, funciones, etc.), que es lo que Prisma.InputJsonValue exige.
  return JSON.parse(JSON.stringify(resumen));
}
