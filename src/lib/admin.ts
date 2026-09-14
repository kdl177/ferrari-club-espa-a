import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * Puerta de acceso al panel. Devuelve el socio administrador o corta la
 * ejecucion redirigiendo. Se comprueba en cada pagina y en cada server
 * action del panel: el proxy protege la navegacion, pero una action se
 * puede invocar directamente, asi que nunca se confia solo en el proxy.
 */
export async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) redirect('/socios/');

  const socio = await prisma.user.findUnique({ where: { email } });

  if (!socio?.esAdmin) redirect('/socios/panel/');

  return socio;
}
