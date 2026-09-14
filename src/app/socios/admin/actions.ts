'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export type AdminState = { ok: boolean; error?: string };

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/* ── Contactos ─────────────────────────────────────────── */

export async function marcarContactoAtendido(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const id = String(formData.get('id') || '');
  const atendido = formData.get('atendido') === 'true';
  if (!id) return { ok: false, error: 'Contacto no indicado.' };

  await prisma.contactoRecibido.update({
    where: { id },
    data: { atendido },
  });

  revalidatePath('/socios/admin/contactos');
  revalidatePath('/socios/admin');
  return { ok: true };
}

/* ── Eventos ───────────────────────────────────────────── */

export async function guardarEvento(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const titulo = String(formData.get('titulo') || '').trim();
  const categoria = String(formData.get('categoria') || '').trim();
  const fechaRaw = String(formData.get('fecha') || '').trim();
  const ubicacion = String(formData.get('ubicacion') || '').trim();
  const descripcion = String(formData.get('descripcion') || '').trim();
  const aforoRaw = String(formData.get('aforo') || '').trim();

  if (!titulo) return { ok: false, error: 'El título es obligatorio.' };
  if (!categoria) return { ok: false, error: 'La categoría es obligatoria.' };
  if (!fechaRaw) return { ok: false, error: 'La fecha es obligatoria.' };
  if (!ubicacion) return { ok: false, error: 'La ubicación es obligatoria.' };
  if (!descripcion) return { ok: false, error: 'La descripción es obligatoria.' };

  const fecha = new Date(fechaRaw);
  if (Number.isNaN(fecha.getTime())) return { ok: false, error: 'Fecha no válida.' };

  const aforo = Number.parseInt(aforoRaw, 10);
  if (!Number.isFinite(aforo) || aforo < 1) return { ok: false, error: 'El aforo debe ser al menos 1.' };

  if (id) {
    const actual = await prisma.evento.findUnique({ where: { id } });
    if (!actual) return { ok: false, error: 'Evento no encontrado.' };
    // Reducir el aforo por debajo de las plazas ya ocupadas dejaria
    // inscripciones confirmadas sin plaza real.
    if (aforo < actual.plazasOcupadas) {
      return { ok: false, error: `Ya hay ${actual.plazasOcupadas} plazas ocupadas: el aforo no puede ser menor.` };
    }
    await prisma.evento.update({
      where: { id },
      data: { titulo, categoria, fecha, ubicacion, descripcion, aforo },
    });
  } else {
    let slug = slugify(titulo);
    if (await prisma.evento.findUnique({ where: { slug } })) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }
    await prisma.evento.create({
      data: { titulo, slug, categoria, fecha, ubicacion, descripcion, aforo },
    });
  }

  revalidatePath('/socios/admin/eventos');
  revalidatePath('/eventos');
  return { ok: true };
}

/* ── Noticias ──────────────────────────────────────────── */

export async function guardarNoticia(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const id = String(formData.get('id') || '').trim();
  const titulo = String(formData.get('titulo') || '').trim();
  const categoria = String(formData.get('categoria') || '').trim();
  const cuerpo = String(formData.get('cuerpo') || '').trim();
  const portada = String(formData.get('portada') || '').trim();
  const publicar = formData.get('publicar') === 'on';

  if (!titulo) return { ok: false, error: 'El título es obligatorio.' };
  if (!categoria) return { ok: false, error: 'La categoría es obligatoria.' };
  if (!cuerpo) return { ok: false, error: 'El cuerpo es obligatorio.' };

  const datos = {
    titulo,
    categoria,
    cuerpo,
    portada: portada || null,
    publicadoEn: publicar ? new Date() : null,
  };

  if (id) {
    const actual = await prisma.noticia.findUnique({ where: { id } });
    if (!actual) return { ok: false, error: 'Noticia no encontrada.' };
    await prisma.noticia.update({
      where: { id },
      // Si ya estaba publicada, conserva su fecha original de publicacion.
      data: { ...datos, publicadoEn: publicar ? actual.publicadoEn ?? new Date() : null },
    });
  } else {
    let slug = slugify(titulo);
    if (await prisma.noticia.findUnique({ where: { slug } })) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }
    await prisma.noticia.create({ data: { ...datos, slug } });
  }

  revalidatePath('/socios/admin/noticias');
  revalidatePath('/noticias');
  return { ok: true };
}

export async function borrarNoticia(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const id = String(formData.get('id') || '');
  if (!id) return { ok: false, error: 'Noticia no indicada.' };

  await prisma.noticia.delete({ where: { id } });

  revalidatePath('/socios/admin/noticias');
  revalidatePath('/noticias');
  return { ok: true };
}
