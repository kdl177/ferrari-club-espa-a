'use server';

import { prisma } from '@/lib/prisma';
import { enviarEmailContactoAlClub } from '@/lib/email';

export type ContactoState = {
  ok: boolean;
  error?: string;
};

const ASUNTOS_VALIDOS = new Set([
  'info-general',
  'hacerse-socio',
  'eventos',
  'patrocinio',
  'prensa',
  'otro',
]);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function enviarContacto(
  _prevState: ContactoState,
  formData: FormData
): Promise<ContactoState> {
  const nombre = String(formData.get('nombre') || '').trim();
  const apellidos = String(formData.get('apellidos') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const telefono = String(formData.get('telefono') || '').trim();
  const asunto = String(formData.get('asunto') || '').trim();
  const ferrariModelo = String(formData.get('ferrariModelo') || '').trim();
  const mensaje = String(formData.get('mensaje') || '').trim();
  const privacidad = formData.get('privacidad') === 'on';

  if (!nombre) return { ok: false, error: 'Por favor, introduce tu nombre.' };
  if (!apellidos) return { ok: false, error: 'Por favor, introduce tus apellidos.' };
  if (!email || !isValidEmail(email)) return { ok: false, error: 'Por favor, introduce un email válido.' };
  if (!asunto || !ASUNTOS_VALIDOS.has(asunto)) return { ok: false, error: 'Por favor, selecciona un asunto.' };
  if (!mensaje) return { ok: false, error: 'Por favor, escribe tu mensaje.' };
  if (!privacidad) return { ok: false, error: 'Debes aceptar la política de privacidad para continuar.' };

  const contacto = await prisma.contactoRecibido.create({
    data: {
      nombre,
      apellidos,
      email,
      telefono: telefono || null,
      asunto,
      ferrariModelo: ferrariModelo || null,
      mensaje,
    },
  });

  // El mensaje ya está guardado. Un fallo de email no debe perderlo ni
  // mostrarle un error al visitante: la secretaría puede leerlo en el panel.
  try {
    await enviarEmailContactoAlClub({
      nombre,
      apellidos,
      email,
      telefono: telefono || null,
      asunto,
      ferrariModelo: ferrariModelo || null,
      mensaje,
      contactoId: contacto.id,
    });
  } catch (err) {
    console.error('[contacto] fallo al notificar al club por email:', err);
  }

  return { ok: true };
}
