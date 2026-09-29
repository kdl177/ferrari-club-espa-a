import { handler, tokenDe } from './_lib/http.mjs';
import { panel } from './_lib/logica.mjs';

export const GET = handler((q, request) => panel(q, tokenDe(request)));
