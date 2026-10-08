// Los cuatro concesionarios que publica el club en ferrariclubespana.com
// (Concesionarios), con sus mismos datos. Las coordenadas son para el mapa.
// Vive aqui, y no en la pagina, porque lo leen /concesionarios y su version
// de /comunidad: duplicarlo acabaria con dos listas que divergen.
export const DEALERS = [
  {
    region: 'madrid', city: 'MADRID', name: 'Santogal Automóviles',
    servicio: 'Concesionario Oficial Ferrari · Servicio de Certificación, Restauración y Mantenimiento de vehículos Clásicos Ferrari (Servicio Recambios)',
    addr: 'Calle Puerto de Somport 8, 28050 Madrid', tel: '+34910488169', telFmt: '+34 910 488 169 · +34 910 488 170', email: 'ferrarimadrid@santogal.es',
    extra: { label: 'Taller y Servicio Post Venta', tel: '+34611042130', telFmt: '+34 611 042 130' },
    lat: 40.49527, lng: -3.67282, web: 'https://madrid.ferraridealers.com/es-ES',
  },
  {
    region: 'cataluna', city: 'BARCELONA', name: 'QUADIS Gallery',
    servicio: 'Concesionario Oficial Ferrari · Servicio de Certificación, Restauración y Mantenimiento de vehículos Clásicos Ferrari (Servicio Recambios)',
    addr: 'Passeig de la Zona Franca nº 10-12, 08038 Barcelona', tel: '+34932896363', telFmt: '932 896 363', email: 'aribas@carsgallery.es',
    lat: 41.35201, lng: 2.14547, web: 'https://barcelona.ferraridealers.com/es-ES',
  },
  {
    region: 'levante', city: 'VALENCIA', name: 'QUADIS Gallery',
    servicio: 'Concesionario Oficial Ferrari · Servicio Post Venta - Taller',
    addr: 'Avda. Maestro Rodrigo 50, 46035 Valencia', tel: '+34963479199', telFmt: '963 479 199', email: 'info@carsgallery.es',
    lat: 39.48569, lng: -0.40313, web: 'http://www.carsgallery.es',
  },
  {
    region: 'andalucia', city: 'MARBELLA', name: 'C. de Salamanca',
    servicio: 'Concesionario y Servicio Oficial Ferrari (Servicio Recambios)',
    addr: 'Avenida Norberto Goizueta s/n, 29670 San Pedro Alcántara, Marbella (Málaga)', tel: '+34952782211', telFmt: '952 782 211', email: 'info@cdesalamanca.com',
    lat: 36.47971, lng: -4.99385, web: 'https://marbella.ferraridealers.com/es-ES',
  },
];
