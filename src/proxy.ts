import { auth } from '@/auth';

export const proxy = auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL('/socios/', req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/socios/panel/:path*', '/socios/admin/:path*'],
};
