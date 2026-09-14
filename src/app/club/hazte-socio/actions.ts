'use server';

import { prisma } from '@/lib/prisma';

export type SolicitudSocioState = {
  ok: boolean;
  error?: string;
  socioId?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function crearSolicitudSocio(
  _prevState: SolicitudSocioState,
  formData: FormData
): Promise<SolicitudSocioState> {
  const nombre = String(formData.get('nombre') || '').trim();
  const apellidos = String(formData.get('apellidos') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const telefono = String(formData.get('telefono') || '').trim();
  const ferrariModelo = String(formData.get('ferrariModelo') || '').trim();

  if (!nombre) return { ok: false, error: 'Introduce tu nombre.' };
  if (!apellidos) return { ok: false, error: 'Introduce tus apellidos.' };
  if (!email || !isValidEmail(email)) return { ok: false, error: 'Introduce un email válido.' };
  if (!ferrariModelo) return { ok: false, error: 'Indica el modelo de Ferrari del que eres propietario.' };

  const existente = await prisma.user.findUnique({ where: { email } });

  if (existente?.estadoCuota && existente.estadoCuota !== 'baja') {
    return { ok: false, error: 'Ya existe una solicitud o membresía activa con este email. Contacta con secretaría si crees que es un error.' };
  }

  const socio = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      nombre,
      apellidos,
      telefono: telefono || null,
      ferrariModelo,
      estadoCuota: 'pendiente',
    },
    update: {
      nombre,
      apellidos,
      telefono: telefono || null,
      ferrariModelo,
      estadoCuota: 'pendiente',
    },
  });

  return { ok: true, socioId: socio.id };
}
