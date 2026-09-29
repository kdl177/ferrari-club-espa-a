import { handler, cuerpoDe } from './_lib/http.mjs';
import { login } from './_lib/logica.mjs';

export const POST = handler(async (q, request) => {
  const cuerpo = await cuerpoDe(request);
  if (cuerpo === null) return { code: 400, datos: { error: 'Petición mal formada.' } };
  return login(q, cuerpo, process.env.NODE_ENV === 'production');
});
