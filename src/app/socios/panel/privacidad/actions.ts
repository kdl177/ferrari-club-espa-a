'use server';

import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { exportarDatosSocio, darDeBajaSocio } from '@/lib/rgpd';

export type ExportState = { ok: boolean; error?: string; datos?: string };
export type BajaState = { ok: boolean; error?: string };

/** Resuelve el socio de la sesion actual. Nunca se confia en un id del cliente. */
async function socioDeLaSesion() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}

export async function solicitarMisDatos(): Promise<ExportState> {
  const socio = await socioDeLaSesion();
  if (!socio) return { ok: false, error: 'Necesitas iniciar sesión.' };

  const datos = await exportarDatosSocio(socio.id);
  if (!datos) return { ok: false, error: 'No encontramos tu ficha de socio.' };

  return { ok: true, datos: JSON.stringify(datos, null, 2) };
}

export async function solicitarBaja(
  _prev: BajaState,
  formData: FormData
): Promise<BajaState> {
  const socio = await socioDeLaSesion();
  if (!socio) return { ok: false, error: 'Necesitas iniciar sesión.' };

  // Confirmacion explicita: escribir el propio email evita la baja por
  // un clic accidental en una accion irreversible.
  const confirmacion = String(formData.get('confirmacion') || '').trim().toLowerCase();
  if (confirmacion !== socio.email.toLowerCase()) {
    return { ok: false, error: 'Escribe tu email exactamente para confirmar la baja.' };
  }

  const resultado = await darDeBajaSocio(socio.id);
  if (!resultado.ok) return { ok: false, error: resultado.error };

  // La cuenta ya no existe como tal: cerrar sesion y salir a la home.
  await signOut({ redirectTo: '/?baja=ok' });
  return { ok: true };
}
