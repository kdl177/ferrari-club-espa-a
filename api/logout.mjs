import { handler, tokenDe } from './_lib/http.mjs';
import { logout } from './_lib/logica.mjs';

export const POST = handler((q, request) => logout(q, tokenDe(request)));
