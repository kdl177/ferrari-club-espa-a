/**
 * Prueba la condicion de carrera del aforo.
 * Maranello tiene 2 plazas libres (13/15). Lanzamos 5 socios a la vez.
 * Correcto: exactamente 2 confirmadas, 3 en lista de espera, plazasOcupadas = 15.
 * Un read-then-write ingenuo dejaria plazasOcupadas > 15.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SLUG = 'visita-maranello-2026';
const N = 5;

const evento = await prisma.evento.findUnique({ where: { slug: SLUG } });
console.log(`Evento: ${evento.titulo} — aforo ${evento.aforo}, ocupadas ${evento.plazasOcupadas}, libres ${evento.aforo - evento.plazasOcupadas}\n`);

// Socios de prueba con cuota activa
const socios = [];
for (let i = 1; i <= N; i++) {
  const email = `concurrencia${i}@test.local`;
  const s = await prisma.user.upsert({
    where: { email },
    create: { email, nombre: `Socio${i}`, apellidos: 'Concurrencia', estadoCuota: 'activo' },
    update: { estadoCuota: 'activo' },
  });
  socios.push(s);
}
console.log(`${socios.length} socios de prueba listos\n`);

// Misma logica transaccional que la server action, disparada en paralelo
async function inscribir(socio) {
  return prisma.$transaction(async (tx) => {
    const tomada = await tx.$executeRaw`
      UPDATE eventos
      SET "plazasOcupadas" = "plazasOcupadas" + 1
      WHERE id = ${evento.id} AND "plazasOcupadas" < aforo
    `;
    const estado = tomada === 1 ? 'confirmada' : 'lista_espera';
    await tx.inscripcion.upsert({
      where: { eventoId_socioId: { eventoId: evento.id, socioId: socio.id } },
      create: { eventoId: evento.id, socioId: socio.id, estado },
      update: { estado },
    });
    return { socio: socio.nombre, estado };
  });
}

const resultados = await Promise.all(socios.map(inscribir));
for (const r of resultados) console.log(`  ${r.socio}: ${r.estado}`);

const confirmadas = resultados.filter((r) => r.estado === 'confirmada').length;
const espera = resultados.filter((r) => r.estado === 'lista_espera').length;
const despues = await prisma.evento.findUnique({ where: { slug: SLUG } });

console.log(`\nConfirmadas: ${confirmadas} (esperado 2)`);
console.log(`Lista espera: ${espera} (esperado 3)`);
console.log(`plazasOcupadas: ${despues.plazasOcupadas} / ${despues.aforo} (esperado 15, NUNCA >15)`);

const ok = confirmadas === 2 && espera === 3 && despues.plazasOcupadas === 15;
console.log(`\n${ok ? 'CORRECTO: el aforo no se sobrepaso' : 'FALLO: aforo incorrecto'}`);

await prisma.$disconnect();
process.exit(ok ? 0 : 1);
