// Archivo fotografico del club. A diferencia de src/lib/fotos.ts (Wikimedia,
// con atribucion obligatoria), estas imagenes son propias: no llevan credito
// externo. La mayoria son miniaturas de 300px, de ahi el mosaico de piezas
// pequeñas: ampliarlas se veria borroso.

export type Pieza = {
  src: string;
  alt: string;
  /** 'ancha' y 'alta' ocupan dos celdas; el resto, una. */
  forma?: 'ancha' | 'alta';
  /** Solo las 4 de resolucion alta aguantan destacarse. */
  grande?: boolean;
};

export const CIRCUITO: Pieza[] = [
  { src: '/galeria/g01.webp', alt: 'Hilera de Ferrari aparcados en el paddock junto a los camiones de Pirelli', forma: 'alta' },
  { src: '/galeria/g02.webp', alt: 'Ferrari en fila en el pit lane del Circuit de Barcelona-Catalunya', forma: 'ancha' },
  { src: '/galeria/g24.webp', alt: 'Concentración de Ferrari en una plaza de pueblo vista desde lo alto', grande: true, forma: 'ancha' },
  { src: '/galeria/g23.webp', alt: 'Ferrari 288 GTO y F40 rodando en fila por el circuito', forma: 'ancha' },
  { src: '/galeria/g19.webp', alt: 'Parrilla de Ferrari en la recta principal del circuito' },
  { src: '/galeria/g26.webp', alt: 'Ferrari F40 alineados en el paddock entre el público' },
];

export const VIAJES: Pieza[] = [
  { src: '/galeria/g06.webp', alt: 'Socios del club en la plaza de San Gimignano, Toscana', grande: true, forma: 'ancha' },
  { src: '/galeria/g04.webp', alt: 'Visita de los socios al taller Ferrari Classiche en Maranello' },
  { src: '/galeria/g05.webp', alt: 'Socios del club entre Ferrari históricos en el taller de Maranello' },
  { src: '/galeria/g03.webp', alt: 'Ferrari aparcados entre olivos en una finca mediterránea' },
  { src: '/galeria/g10.webp', alt: 'Socios del club a bordo de una embarcación en el lago de Como' },
  { src: '/galeria/g08.webp', alt: 'Socios del club ante el castillo de Olite en otoño' },
  { src: '/galeria/g14.webp', alt: 'Ferrari ante el castillo de Chambord durante la ruta por el Loira', forma: 'ancha' },
  { src: '/galeria/g25.webp', alt: 'Ferrari alineados ante la Ciudad de las Artes y las Ciencias de Valencia', grande: true, forma: 'ancha' },
];

export const CONCENTRACIONES: Pieza[] = [
  { src: '/galeria/g22.webp', alt: 'Ferrari reunidos en la plaza de un pueblo medieval' },
  { src: '/galeria/g21.webp', alt: 'Hilera de Ferrari ante una iglesia de piedra en un pueblo castellano' },
  { src: '/galeria/g12.webp', alt: 'Ferrari clásicos recorriendo la calle principal de un pueblo italiano', forma: 'ancha' },
  { src: '/galeria/g15.webp', alt: 'Ferrari aparcados en semicírculo durante una concentración del club' },
  { src: '/galeria/g09.webp', alt: 'Bandera gigante del club desplegada en una plaza durante un encuentro' },
  { src: '/galeria/g11.webp', alt: 'Socios del club reunidos en una comida de hermandad' },
  { src: '/galeria/g07.webp', alt: 'Botellas de vino con la etiqueta conmemorativa del encuentro de Rioja Alavesa', forma: 'alta' },
  { src: '/galeria/g16.webp', alt: 'Socios del club en la entrada de Ferrari Land' },
  { src: '/galeria/g13.webp', alt: 'Socios del club en el paddock de Fórmula 1 con la bandera de España' },
  { src: '/galeria/g20.webp', alt: 'Miembros del club con el equipo Ferrari durante un evento en circuito' },
  { src: '/galeria/g17.webp', alt: 'Socios del club junto a un Ferrari clásico de competición' },
  { src: '/galeria/g18.webp', alt: 'Socios del club junto a un LaFerrari en el pit lane' },
];

/** Portada de la pagina del club: las tomas de grupo que mejor cuentan quienes somos. */
export const MOSAICO_HERO: Pieza[] = [
  { src: '/galeria/g06.webp', alt: 'Socios del club en la plaza de San Gimignano, Toscana', grande: true },
  { src: '/galeria/g02.webp', alt: 'Ferrari en fila en el pit lane del Circuit de Barcelona-Catalunya' },
  { src: '/galeria/g03.webp', alt: 'Ferrari aparcados entre olivos en una finca mediterránea' },
  { src: '/galeria/g05.webp', alt: 'Socios del club entre Ferrari históricos en el taller de Maranello' },
  { src: '/galeria/g01.webp', alt: 'Hilera de Ferrari aparcados en el paddock junto a los camiones de Pirelli' },
];
