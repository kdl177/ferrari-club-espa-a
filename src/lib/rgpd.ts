import { prisma } from '@/lib/prisma';

/**
 * Version del texto legal vigente. Se guarda junto al consentimiento para
 * poder demostrar QUE version acepto cada persona: si manana cambia la
 * politica, los consentimientos antiguos siguen siendo trazables.
 */
export const POLITICA_VERSION = '2026-08';

/**
 * Derecho de acceso y portabilidad (art. 15 y 20 RGPD): devuelve todo lo
 * que la asociacion guarda sobre esta persona, en formato estructurado y
 * de uso comun, tal como promete la politica de privacidad.
 */
export async function exportarDatosSocio(socioId: string) {
  const socio = await prisma.user.findUnique({
    where: { id: socioId },
    include: {
      suscripcion: true,
      inscripciones: { include: { evento: true } },
      accounts: true,
      sessions: true,
    },
  });

  if (!socio) return null;

  // Los contactos se guardan por email, no por relacion: se buscan aparte.
  const contactos = await prisma.contactoRecibido.findMany({
    where: { email: socio.email },
    orderBy: { creadoEn: 'desc' },
  });

  return {
    generadoEn: new Date().toISOString(),
    responsableTratamiento: {
      nombre: 'Ferrari Club España',
      domicilio: 'Calle Constancia 41, Entreplanta, 28002 Madrid',
      email: 'ferrari@ferrariclubespana.com',
    },
    datosPersonales: {
      id: socio.id,
      email: socio.email,
      nombre: socio.nombre,
      apellidos: socio.apellidos,
      telefono: socio.telefono,
      ferrariModelo: socio.ferrariModelo,
      estadoCuota: socio.estadoCuota,
      emailVerificado: socio.emailVerified,
      altaEn: socio.creadoEn,
      ultimaActualizacion: socio.actualizadoEn,
    },
    consentimiento: {
      aceptadoEn: socio.consentimientoEn,
      versionAceptada: socio.consentimientoVersion,
    },
    membresia: socio.suscripcion
      ? {
          plan: socio.suscripcion.plan,
          estado: socio.suscripcion.estado,
          renuevaEn: socio.suscripcion.renuevaEn,
          altaEn: socio.suscripcion.creadoEn,
        }
      : null,
    inscripcionesEventos: socio.inscripciones.map((i) => ({
      evento: i.evento.titulo,
      fechaEvento: i.evento.fecha,
      estado: i.estado,
      inscritoEn: i.creadoEn,
    })),
    mensajesEnviados: contactos.map((c) => ({
      asunto: c.asunto,
      mensaje: c.mensaje,
      enviadoEn: c.creadoEn,
      atendido: c.atendido,
    })),
    sesionesActivas: socio.sessions.length,
    // Los identificadores de Stripe se incluyen porque son datos asociados
    // a la persona, aunque los gestione un encargado del tratamiento.
    identificadoresExternos: {
      stripeCustomerId: socio.stripeCustomerId,
    },
  };
}

export type ResultadoBaja = {
  ok: boolean;
  error?: string;
  anonimizado?: boolean;
};

/**
 * Derecho de supresion (art. 17 RGPD), aplicado con matiz.
 *
 * No se hace un DELETE: la politica de privacidad declara que los datos de
 * socio se conservan "hasta que prescriban las eventuales responsabilidades
 * legales", y ademas borrar la fila dejaria la suscripcion de Stripe
 * cobrando contra un socio inexistente.
 *
 * Se anonimiza: se destruye todo lo identificativo y se conserva el
 * historial contable/asociativo sin persona detras. Las sesiones se borran
 * (cierra el acceso de inmediato) y los mensajes de contacto tambien, que
 * no tienen valor contable.
 */
export async function darDeBajaSocio(socioId: string): Promise<ResultadoBaja> {
  const socio = await prisma.user.findUnique({
    where: { id: socioId },
    include: { suscripcion: true },
  });

  if (!socio) return { ok: false, error: 'No encontramos tu ficha de socio.' };

  if (socio.suscripcion && socio.suscripcion.estado === 'activa') {
    return {
      ok: false,
      error:
        'Tienes una suscripción activa. Para evitar cobros pendientes, contacta con secretaría para cancelarla antes de solicitar la baja.',
    };
  }

  const marca = `baja-${Date.now().toString(36)}`;

  await prisma.$transaction(async (tx) => {
    await tx.contactoRecibido.deleteMany({ where: { email: socio.email } });
    await tx.session.deleteMany({ where: { userId: socio.id } });
    await tx.account.deleteMany({ where: { userId: socio.id } });

    await tx.user.update({
      where: { id: socio.id },
      data: {
        email: `${marca}@anonimizado.local`,
        nombre: 'Socio',
        apellidos: 'dado de baja',
        telefono: null,
        ferrariModelo: null,
        emailVerified: null,
        estadoCuota: 'baja',
        esAdmin: false,
        consentimientoEn: null,
        consentimientoVersion: null,
      },
    });
  });

  return { ok: true, anonimizado: true };
}
