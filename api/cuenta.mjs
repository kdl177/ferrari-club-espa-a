import { handler, tokenDe, cuerpoDe } from './_lib/http.mjs';
import { hashPassword } from './_lib/auth.mjs';
import { cambiarPassword, editarPerfil } from './_lib/logica.mjs';

export const POST = handler(async (q, request) => {
  const cuerpo = await cuerpoDe(request);
  if (cuerpo === null) return { code: 400, datos: { error: 'Petición mal formada.' } };

  const token = tokenDe(request);
  switch (cuerpo.hacer) {
    case 'password': return cambiarPassword(q, token, cuerpo, hashPassword);
    case 'perfil':   return editarPerfil(q, token, cuerpo);
    default:         return { code: 400, datos: { error: 'Acción no reconocida.' } };
  }
});
