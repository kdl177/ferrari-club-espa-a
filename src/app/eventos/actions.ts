'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export type InscripcionState = {
  ok: boolean;
  estado?: 'confirmada' | 'lista_espera';
  error?: string;
};

export async function inscribirseEvento(
  _prevState: InscripcionState,
  formData: FormData
): Promise<InscripcionState> {
  const eventoId = String(formData.get('eventoId') || '');
  if (!eventoId) return { ok: false, error: 'Evento no indicado.' };

  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { ok: false, error: 'Necesitas iniciar sesión como socio para inscribirte.' };
  }

  const socio = await prisma.user.findUnique({ where: { email } });
  if (!socio) return { ok: false, error: 'No encontramos tu ficha de socio.' };

  if (socio.estadoCuota !== 'activo') {
    return { ok: false, error: 'Tu cuota no está activa. Contacta con secretaría para regularizarla.' };
  }

  const yaInscrito = await prisma.inscripcion.findUnique({
    where: { eventoId_socioId: { eventoId, socioId: socio.id } },
  });
  if (yaInscrito && yaInscrito.estado !== 'cancelada') {
    return {
      ok: true,
      estado: yaInscrito.estado === 'confirmada' ? 'confirmada' : 'lista_espera',
    };
  }

  // Aforo y plaza se resuelven en una transacción: dos socios pidiendo la
  // última plaza a la vez no pueden pasar ambos. El updateMany condicional
  // (plazasOcupadas < aforo) solo afecta filas si queda sitio de verdad.
  const estado = await prisma.$transaction(async (tx) => {
    const plazaTomada = await tx.$executeRaw`
      UPDATE eventos
      SET "plazasOcupadas" = "plazasOcupadas" + 1
      WHERE id = ${eventoId} AND "plazasOcupadas" < aforo
    `;

    const nuevoEstado: 'confirmada' | 'lista_espera' =
      plazaTomada === 1 ? 'confirmada' : 'lista_espera';

    await tx.inscripcion.upsert({
      where: { eventoId_socioId: { eventoId, socioId: socio.id } },
      create: { eventoId, socioId: socio.id, estado: nuevoEstado },
      update: { estado: nuevoEstado },
    });

    return nuevoEstado;
  });

  revalidatePath('/eventos');
  return { ok: true, estado };
}
