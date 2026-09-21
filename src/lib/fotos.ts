export type Foto = { src: string; alt: string; autor: string; licencia: string; url: string };

// Fotografias de Wikimedia Commons. La licencia exige nombrar al autor,
// enlazar el original e indicar que la imagen se ha adaptado.
export const FOTOS = {
  'cavalcade-dinos': { src: '/fotos/cavalcade-dinos.webp', alt: 'Fila de Ferrari Dino rojos aparcados en una concentración de Ferrari', autor: 'Peter Gill / UK', licencia: 'CC BY 3.0', url: 'https://commons.wikimedia.org/wiki/File:Cavalcade_of_Ferraris_at_the_Liner_Terminal_celebrating_50_years_of_Ferraris_in_Australia_%282007%29_-_panoramio.jpg' },
  '488-challenge-druids': { src: '/fotos/488-challenge-druids.webp', alt: 'Ferrari 488 Challenge rojo en plena curva durante una carrera en circuito', autor: 'BrokenGearbox', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_488_Challenge_at_Druids.jpg' },
  '488-challenge-amarillo': { src: '/fotos/488-challenge-amarillo.webp', alt: 'Ferrari 488 Challenge amarillo con el dorsal 80 en un tramo de circuito', autor: 'Neil', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_488_Challenge_%2835590398851%29.jpg' },
  'cavalcade-pista': { src: '/fotos/cavalcade-pista.webp', alt: 'Ferrari blanco con franjas rodando por carretera durante un Cavalcade', autor: 'Pranav 311', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_Cavalcade.png' },
  'f1-zandvoort-2024': { src: '/fotos/f1-zandvoort-2024.webp', alt: 'Monoplaza Ferrari de Fórmula 1 tomando una curva en el Gran Premio de Países Bajos de 2024', autor: 'Steffen Prößdorf', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3912_by_Stepro.jpg' },
  'sainz-china-2024': { src: '/fotos/sainz-china-2024.webp', alt: 'Carlos Sainz al volante del Ferrari SF-24 en el Gran Premio de China de 2024', autor: 'Liauzh', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz_Chinese_GP_2024.jpg' },
  '499p-spa-2023': { src: '/fotos/499p-spa-2023.webp', alt: 'Ferrari 499P de AF Corse en las 6 Horas de Spa-Francorchamps de 2023', autor: 'MarcelX42', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:2023_6_Hours_of_Spa-Francorchamps_Ferrari_AF_Corse_Ferrari_499P_No.51_%28DSC07093%29.jpg' },
  'museo-maranello': { src: '/fotos/museo-maranello.webp', alt: 'Entrada del Museo Ferrari en Maranello con el Cavallino en la fachada', autor: 'Wistula', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari-Museum_Maranello_3.JPG' },
  '312t-goodwood': { src: '/fotos/312t-goodwood.webp', alt: 'Ferrari 312T de Fórmula 1 de los años setenta rodando en Goodwood', autor: 'Nic Redhead', licencia: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_312T_at_Goodwood_2012_%284%29.jpg' },
  'interior-california': { src: '/fotos/interior-california.webp', alt: 'Volante y cuadro de instrumentos de un Ferrari California', autor: 'andy_carter', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Interior_Ferrari_California_Steering_Wheel.jpg' },
  'sf90-xx-stradale': { src: '/coches/sf90-xx-stradale.webp', alt: 'Ferrari SF90 XX Stradale rojo con alerón trasero fijo, vista frontal tres cuartos', autor: 'Calreyn88', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Ferrari_SF90_XX_Stradale_1.jpg' },
  'roma-spider': { src: '/coches/roma-spider.webp', alt: 'Ferrari Roma Spider gris azulado con la capota abierta en un concesionario', autor: 'Pangalau', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:2024_Ferrari_Roma_Spider_in_Adelaide,_Australia.jpg' },
} satisfies Record<string, Foto>;

export type FotoId = keyof typeof FOTOS;
