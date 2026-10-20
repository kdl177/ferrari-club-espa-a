import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Resend from 'next-auth/providers/resend';
import Credentials from 'next-auth/providers/credentials';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { prisma } from '@/lib/prisma';

// Mismo formato que escribe scripts/crear-socio.mjs: "sal:hash" en hex.
function claveValida(clave: string, guardada: string) {
  const [sal, hash] = guardada.split(':');
  if (!sal || !hash) return false;
  const esperado = Buffer.from(hash, 'hex');
  const calculado = scryptSync(clave, sal, esperado.length);
  return timingSafeEqual(calculado, esperado);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM || 'Ferrari Club España <onboarding@resend.dev>',
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(datos) {
        const email = String(datos?.email ?? '').trim().toLowerCase();
        const clave = String(datos?.password ?? '');
        if (!email || !clave) return null;
        const socio = await prisma.user.findUnique({ where: { email } });
        if (!socio?.passwordHash || !claveValida(clave, socio.passwordHash)) return null;
        return { id: socio.id, email: socio.email, name: socio.nombre };
      },
    }),
  ],
  pages: {
    signIn: '/socios/',
    verifyRequest: '/socios/revisa-tu-email/',
  },
  // Auth.js solo admite contraseñas con sesiones JWT, no con sesiones en base
  // de datos. El enlace por correo sigue funcionando igual con JWT.
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
});
