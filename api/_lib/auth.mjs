import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const KEYLEN = 64;
const COSTE = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, KEYLEN, COSTE);
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const partes = String(stored || '').split('$');
  if (partes.length !== 3 || partes[0] !== 'scrypt') return false;
  const [, salt, hex] = partes;
  const esperado = Buffer.from(hex, 'hex');
  if (esperado.length !== KEYLEN) return false;
  const derived = await scryptAsync(password, salt, KEYLEN, COSTE);
  return timingSafeEqual(derived, esperado);
}

export function nuevoToken() {
  return randomBytes(32).toString('base64url');
}

export const SESION_HORAS = 12;

export function cookieSesion(token, seguro) {
  const attrs = [
    `cav_sesion=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    `Max-Age=${SESION_HORAS * 3600}`
  ];
  if (seguro) attrs.push('Secure');
  return attrs.join('; ');
}

export function cookieBorrado() {
  return 'cav_sesion=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0';
}

export function leerCookie(header, nombre) {
  if (!header) return null;
  for (const trozo of header.split(';')) {
    const i = trozo.indexOf('=');
    if (i < 0) continue;
    if (trozo.slice(0, i).trim() === nombre) return trozo.slice(i + 1).trim();
  }
  return null;
}
