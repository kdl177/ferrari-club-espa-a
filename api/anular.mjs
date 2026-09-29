import { handler, tokenDe, cuerpoDe } from './_lib/http.mjs';
import { anular } from './_lib/logica.mjs';

export const POST = handler(async (q, request) => {
  const cuerpo = await cuerpoDe(request);
  if (cuerpo === null) return { code: 400, datos: { error: 'Petición mal formada.' } };
  return anular(q, tokenDe(request), cuerpo);
});
