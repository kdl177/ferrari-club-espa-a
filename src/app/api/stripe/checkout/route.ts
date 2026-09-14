import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const PRICE_IDS: Record<string, string | undefined> = {
  base: process.env.STRIPE_PRICE_SOCIO_BASE,
  activo: process.env.STRIPE_PRICE_SOCIO_ACTIVO,
  familiar: process.env.STRIPE_PRICE_SOCIO_FAMILIAR,
};

export async function POST(req: Request) {
  const { socioId, plan } = await req.json();

  if (!socioId || typeof socioId !== 'string') {
    return NextResponse.json({ error: 'Falta socioId.' }, { status: 400 });
  }

  const priceId = PRICE_IDS[plan] ?? PRICE_IDS.base;
  if (!priceId) {
    return NextResponse.json({ error: 'Plan de cuota no configurado.' }, { status: 500 });
  }

  const socio = await prisma.user.findUnique({ where: { id: socioId } });
  if (!socio) {
    return NextResponse.json({ error: 'Socio no encontrado.' }, { status: 404 });
  }

  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: socio.stripeCustomerId ? undefined : socio.email,
    customer: socio.stripeCustomerId ?? undefined,
    client_reference_id: socio.id,
    metadata: { socioId: socio.id, plan: plan ?? 'base' },
    success_url: `${origin}/club/hazte-socio/bienvenido/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/club/hazte-socio/?checkout=cancelado`,
  });

  return NextResponse.json({ url: session.url });
}
