// Red oficial segun ferrari.com/es-ES/auto/concesionarios. Direccion, telefono,
// horario y coordenadas proceden del micrositio oficial de cada concesionario.
// Vive aqui, y no en la pagina, porque lo leen /concesionarios y su version
// de /comunidad: duplicarlo acabaria con dos listas que divergen.
export const DEALERS = [
  { region: 'madrid', city: 'MADRID', name: 'Santogal Automóviles', addr: 'Puerto de Somport 8, 28050 Madrid', tel: '+34910488170', telFmt: '+34 910 48 81 70', hours: 'Lun–Vie: 9:00–14:00 / 15:30–18:30 · Sáb–Dom: cerrado', lat: 40.49527, lng: -3.67282, web: 'https://madrid.ferraridealers.com/es-ES/' },
  { region: 'cataluna', city: 'BARCELONA', name: 'Quadis Gallery Barcelona', addr: 'Pso. de la Zona Franca 10-12, 08038 Barcelona', tel: '+34932896363', telFmt: '+34 93 289 63 63', hours: 'Lun–Vie: 9:00–13:00 / 15:00–19:00 · Sáb–Dom: cerrado', lat: 41.35201, lng: 2.14547, web: 'https://barcelona.ferraridealers.com/es-ES/' },
  { region: 'levante', city: 'VALENCIA', name: 'Quadis Gallery Valencia', addr: 'Avenida del Maestro Rodrigo 50, 46015 Valencia', tel: '+34963479199', telFmt: '+34 963 47 91 99', hours: 'Lun–Vie: 8:30–14:00 / 16:00–18:30 · Sáb–Dom: cerrado', lat: 39.48569, lng: -0.40313, web: 'https://valencia.ferraridealers.com/es-ES/' },
  { region: 'andalucia', city: 'MARBELLA', name: 'C. de Salamanca', addr: 'Avenida Norberto Goizueta s/n, 29670 San Pedro Alcántara, Marbella', tel: '+34952782211', telFmt: '+34 952 78 22 11', hours: 'Lun–Vie: 9:00–19:00 · Sáb: 10:30–13:30 · Dom: cerrado', lat: 36.47971, lng: -4.99385, web: 'https://marbella.ferraridealers.com/es-ES/' },
];
