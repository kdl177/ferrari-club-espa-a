import { handler, tokenDe, cuerpoDe } from './_lib/http.mjs';
import { hashPassword } from './_lib/auth.mjs';
import {
  juntaResumen, juntaResolver, juntaAltaSocio, juntaCrearEvento, juntaInscritos
} from './_lib/logica.mjs';

export const GET = handler((q, request) => {
  const url = new URL(request.url);
  const evento = url.searchParams.get('inscritos');
  if (evento) return juntaInscritos(q, tokenDe(request), evento);
  return juntaResumen(q, tokenDe(request));
});

export const POST = handler(async (q, request) => {
  const cuerpo = await cuerpoDe(request);
  if (cuerpo === null) return { code: 400, datos: { error: 'Petición mal formada.' } };

  const token = tokenDe(request);
  switch (cuerpo.hacer) {
    case 'resolver': return juntaResolver(q, token, cuerpo);
    case 'alta':     return juntaAltaSocio(q, token, cuerpo, hashPassword);
    case 'evento':   return juntaCrearEvento(q, token, cuerpo);
    default:         return { code: 400, datos: { error: 'Acción no reconocida.' } };
  }
});
