'use server';

import { prisma } from '@/lib/prisma';
import { enviarEmailContactoAlClub } from '@/lib/email';
import { POLITICA_VERSION } from '@/lib/rgpd';
import { CAMPOS } from '@/lib/presupuesto';

export type PresupuestoState = { ok: boolean; error?: string };

export async function enviarPresupuesto(_prev: PresupuestoState, formData: FormData): Promise<PresupuestoState> {
  const v = (n: string) => String(formData.get(n) || '').trim();
  for (const b of CAMPOS) {
    for (const [n, etiqueta, obligatorio] of b.campos) {
      if (obligatorio && !v(n)) return { ok: false, error: `Falta: ${etiqueta}.` };
    }
  }
  const email = v('email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Introduce un correo electrónico válido.' };
  if (formData.get('condiciones') !== 'on') return { ok: false, error: 'Debes aceptar las condiciones de venta.' };
  if (formData.get('privacidad') !== 'on') return { ok: false, error: 'Debes aceptar la política de privacidad.' };

  const mensaje = CAMPOS.map(
    (b) => `${b.bloque.toUpperCase()}\n` + b.campos.filter(([n]) => n !== 'nombre' && n !== 'email' && n !== 'telefono').map(([n, etiqueta]) => `${etiqueta}: ${v(n) || '—'}`).join('\n')
  ).join('\n\n');

  const contacto = await prisma.contactoRecibido.create({
    data: {
      nombre: v('nombre'),
      apellidos: '',
      email,
      telefono: v('telefono'),
      asunto: 'seguros',
      ferrariModelo: v('modelo') || null,
      mensaje,
      consentimientoEn: new Date(),
      consentimientoVersion: POLITICA_VERSION,
    },
  });

  // La solicitud ya esta guardada y se ve en el panel. Un fallo de email no
  // debe perderla ni mostrar un error a quien la envia.
  try {
    await enviarEmailContactoAlClub({
      nombre: v('nombre'),
      apellidos: '',
      email,
      telefono: v('telefono'),
      asunto: 'seguros',
      ferrariModelo: v('modelo') || null,
      mensaje,
      contactoId: contacto.id,
    });
  } catch (err) {
    console.error('[presupuesto] fallo al notificar al club por email:', err);
  }
  return { ok: true };
}
