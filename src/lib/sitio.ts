export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://club-ferrari-espana.vercel.app').replace(/\/$/, '');

// Imagenes y PDF del archivo que aun viven en el servidor de la web anterior.
// Antes de apuntar el dominio a Vercel hay que copiarlos a otro origen y
// cambiar esta variable; si no, dejaran de cargarse.
export const ARCHIVO_BASE = (process.env.ARCHIVO_BASE || 'https://www.ferrariclubespana.com').replace(/\/$/, '');

export function deArchivo(url: string) {
  return url.replace(/^https?:\/\/(www\.)?ferrariclubespana\.com/, ARCHIVO_BASE);
}

export const CLUB = {
  nombre: 'Ferrari Club España',
  cif: 'G79495107',
  registro: 'Registro Nacional de Asociaciones, número 90277',
  direccion: 'Calle Constancia 41, entreplanta',
  cp: '28002',
  ciudad: 'Madrid',
  telefono: '+34 91 575 41 60',
  telefonoE164: '+34915754160',
  email: 'ferrari@ferrariclubespana.com',
  fundacion: 1988,
  oficialDesde: 2006,
};

export const ANIOS = new Date().getFullYear() - CLUB.fundacion;
