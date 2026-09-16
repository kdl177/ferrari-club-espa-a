/**
 * Verifica la formula de Haversine contra distancias reales conocidas.
 * No requiere BD: es matematica pura.
 */
function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

let fallos = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'OK  ' : 'FALLO'} ${msg}`); if (!ok) fallos++; };

const madrid = { lat: 40.4168, lng: -3.7038 };
const barcelona = { lat: 41.3851, lng: 2.1734 };
const sevilla = { lat: 37.3891, lng: -5.9845 };
const bilbao = { lat: 43.263, lng: -2.935 };

// Distancias en linea recta reales (Wikipedia/calculadoras geodesicas):
// Madrid-Barcelona ≈ 504 km · Madrid-Sevilla ≈ 390 km · Madrid-Bilbao ≈ 323 km

console.log('1. DISTANCIAS CONTRA VALORES CONOCIDOS (margen 5%)');
const mb = distanciaKm(madrid.lat, madrid.lng, barcelona.lat, barcelona.lng);
check(Math.abs(mb - 504) / 504 < 0.05, `Madrid-Barcelona: ${mb.toFixed(1)} km (esperado ~504)`);

const ms = distanciaKm(madrid.lat, madrid.lng, sevilla.lat, sevilla.lng);
check(Math.abs(ms - 390) / 390 < 0.05, `Madrid-Sevilla: ${ms.toFixed(1)} km (esperado ~390)`);

const mbi = distanciaKm(madrid.lat, madrid.lng, bilbao.lat, bilbao.lng);
check(Math.abs(mbi - 323) / 323 < 0.05, `Madrid-Bilbao: ${mbi.toFixed(1)} km (esperado ~323)`);

console.log('\n2. PROPIEDADES BASICAS');
check(distanciaKm(madrid.lat, madrid.lng, madrid.lat, madrid.lng) === 0, 'distancia de un punto a si mismo es 0');
check(
  Math.abs(distanciaKm(madrid.lat, madrid.lng, barcelona.lat, barcelona.lng) - distanciaKm(barcelona.lat, barcelona.lng, madrid.lat, madrid.lng)) < 0.001,
  'la distancia es simétrica (A→B == B→A)'
);

console.log('\n3. ORDEN POR CERCANIA (simulando visitante en Madrid)');
const dealers = [
  { city: 'BARCELONA', lat: barcelona.lat, lng: barcelona.lng },
  { city: 'SEVILLA', lat: sevilla.lat, lng: sevilla.lng },
  { city: 'BILBAO', lat: bilbao.lat, lng: bilbao.lng },
  { city: 'MADRID', lat: 40.42, lng: -3.70 }, // concesionario casi en el mismo punto
];
const ordenados = dealers
  .map((d) => ({ ...d, dist: distanciaKm(madrid.lat, madrid.lng, d.lat, d.lng) }))
  .sort((a, b) => a.dist - b.dist);
const orden = ordenados.map((d) => d.city);
check(orden[0] === 'MADRID', `el más cercano es MADRID (fue ${orden[0]})`);
check(orden[orden.length - 1] === 'SEVILLA' || orden[orden.length - 1] === 'BARCELONA', `el más lejano es Sevilla o Barcelona (fue ${orden[orden.length - 1]})`);
console.log('  orden real:', orden.map((c, i) => `${i + 1}.${c}`).join(' '));

console.log(`\n${fallos === 0 ? 'TODAS LAS COMPROBACIONES CORRECTAS' : fallos + ' FALLOS'}`);
process.exit(fallos === 0 ? 0 : 1);
