import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Resend from 'next-auth/providers/resend';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM || 'Ferrari Club España <onboarding@resend.dev>',
    }),
  ],
  pages: {
    signIn: '/socios/',
    verifyRequest: '/socios/revisa-tu-email/',
  },
  session: {
    strategy: 'database',
  },
});
