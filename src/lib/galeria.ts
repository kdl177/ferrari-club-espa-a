// Archivo fotografico del club, tomado de su galeria en ferrariclubespana.com
// (Nuestro club). Son fotos propias: no llevan credito externo. Son las
// originales de la galeria, de unos 1000 px.

export type Pieza = {
  src: string;
  alt: string;
  /** 'ancha' y 'alta' ocupan dos celdas; el resto, una. */
  forma?: 'ancha' | 'alta';
  /** Las que mejor aguantan verse a doble tamaño. */
  grande?: boolean;
};

export const CIRCUITO: Pieza[] = [
  { src: '/galeria/g01.webp', alt: 'Hilera de Ferrari aparcados en el paddock junto a los camiones de Pirelli', forma: 'alta' },
  { src: '/galeria/g02.webp', alt: 'Ferrari en fila en el pit lane de un circuito', forma: 'ancha' },
  { src: '/galeria/g24.webp', alt: 'Concentración de Ferrari en una plaza de pueblo vista desde lo alto', grande: true, forma: 'ancha' },
  { src: '/galeria/g23.webp', alt: 'Ferrari 288 GTO y F40 rodando en fila por el circuito', forma: 'ancha' },
  { src: '/galeria/g19.webp', alt: 'Parrilla de Ferrari en la recta principal del circuito' },
  { src: '/galeria/g26.webp', alt: 'Ferrari F40 alineados en el paddock entre el público' },
];

export const VIAJES: Pieza[] = [
  { src: '/galeria/g06.webp', alt: 'Socios del club reunidos en una plaza', grande: true, forma: 'ancha' },
  { src: '/galeria/g04.webp', alt: 'Socios del club en un taller Ferrari' },
  { src: '/galeria/g05.webp', alt: 'Socios del club entre Ferrari clásicos en un taller' },
  { src: '/galeria/g03.webp', alt: 'Ferrari aparcados entre olivos' },
  { src: '/galeria/g10.webp', alt: 'Socios del club a bordo de una embarcación' },
  { src: '/galeria/g08.webp', alt: 'Socios del club ante un castillo' },
  { src: '/galeria/g25.webp', alt: 'Ferrari alineados ante la Ciudad de las Artes y las Ciencias de Valencia', grande: true, forma: 'ancha' },
  { src: '/galeria/g14.webp', alt: 'Ferrari aparcados ante un castillo' },
];

export const CONCENTRACIONES: Pieza[] = [
  { src: '/galeria/g22.webp', alt: 'Ferrari reunidos en una plaza' },
  { src: '/galeria/g21.webp', alt: 'Hilera de Ferrari ante una iglesia de piedra' },
  { src: '/galeria/g12.webp', alt: 'Ferrari clásicos recorriendo la calle de un pueblo', forma: 'ancha' },
  { src: '/galeria/g15.webp', alt: 'Ferrari aparcados en semicírculo durante una concentración del club' },
  { src: '/galeria/g09.webp', alt: 'Bandera gigante desplegada en una plaza', forma: 'ancha' },
  { src: '/galeria/g11.webp', alt: 'Socios del club reunidos en una comida' },
  { src: '/galeria/g07.webp', alt: 'Botellas de vino con la etiqueta del Ferrari Club España', forma: 'alta' },
  { src: '/galeria/g16.webp', alt: 'Socios del club en la entrada de Ferrari Land' },
  { src: '/galeria/g13.webp', alt: 'Socios del club en un paddock con la bandera de España' },
  { src: '/galeria/g20.webp', alt: 'Miembros del club con el equipo Ferrari durante un evento en circuito' },
  { src: '/galeria/g17.webp', alt: 'Socios del club junto a un Ferrari clásico de competición' },
  { src: '/galeria/g18.webp', alt: 'Socios del club junto a un LaFerrari en el pit lane' },
];

/** Portada de la pagina del club: las tomas de grupo que mejor cuentan quienes somos. */
export const MOSAICO_HERO: Pieza[] = [
  { src: '/galeria/g06.webp', alt: 'Socios del club reunidos en una plaza', grande: true },
  { src: '/galeria/g02.webp', alt: 'Ferrari en fila en el pit lane de un circuito' },
  { src: '/galeria/g03.webp', alt: 'Ferrari aparcados entre olivos' },
  { src: '/galeria/g05.webp', alt: 'Socios del club entre Ferrari clásicos en un taller' },
  { src: '/galeria/g01.webp', alt: 'Hilera de Ferrari aparcados en el paddock junto a los camiones de Pirelli' },
];

// El resto de la galeria oficial del club (Nuestro club), en el orden en que
// la publica.
export const MAS_ARCHIVO: Pieza[] = [
  { src: '/galeria/a07.webp', alt: 'Socios del club con miembros del equipo Ferrari' },
  { src: '/galeria/a08.webp', alt: 'Ferrari aparcados en fila durante una concentración' },
  { src: '/galeria/a13.webp', alt: 'Ferrari rodando por un circuito', forma: 'ancha' },
  { src: '/galeria/a14.webp', alt: 'Ferrari aparcados ante un edificio moderno', forma: 'ancha' },
  { src: '/galeria/a16.webp', alt: 'Dos Ferrari aparcados ante un edificio' },
  { src: '/galeria/a17.webp', alt: 'Socios del club ante un gran Cavallino Rampante' },
  { src: '/galeria/a18.webp', alt: 'Ferrari alineados junto a un estanque', forma: 'ancha' },
  { src: '/galeria/a19.webp', alt: 'Ferrari aparcados en la entrada de Ferrari Land' },
  { src: '/galeria/a20.webp', alt: 'Ferrari aparcados en un puerto de montaña' },
  { src: '/galeria/a21.webp', alt: 'Ferrari F40 en un paddock' },
  { src: '/galeria/a22.webp', alt: 'Ferrari de competición en el paddock' },
  { src: '/galeria/a23.webp', alt: 'Copiloto con casco a bordo de un Ferrari' },
  { src: '/galeria/a24.webp', alt: 'Concentración de Ferrari en un puerto deportivo' },
  { src: '/galeria/a25.webp', alt: 'Ferrari junto a un cartel del Ferrari Club España' },
  { src: '/galeria/a26.webp', alt: 'Socios del club entre Ferrari clásicos' },
  { src: '/galeria/a27.webp', alt: 'Socios del club con monoplazas de Fórmula 1 de Ferrari' },
  { src: '/galeria/a28.webp', alt: 'Socios del club ante un restaurante' },
  { src: '/galeria/a29.webp', alt: 'Socios del club ante el Ristorante Montana' },
  { src: '/galeria/a31.webp', alt: 'Ferrari clásico rodando por una plaza' },
  { src: '/galeria/a32.webp', alt: 'Ferrari clásicos entre el público en una plaza' },
  { src: '/galeria/a35.webp', alt: 'Socios del club con una pancarta del club' },
  { src: '/galeria/a37.webp', alt: 'Socios del club en una nave de Riva' },
  { src: '/galeria/a38.webp', alt: 'Ferrari aparcados en una avenida arbolada' },
  { src: '/galeria/a39.webp', alt: 'Ferrari en fila en una calle' },
  { src: '/galeria/a40.webp', alt: 'Ferrari aparcados ante un edificio acristalado' },
  { src: '/galeria/a41.webp', alt: 'Monoplaza clásico de Ferrari con su equipo' },
  { src: '/galeria/a42.webp', alt: 'Ferrari clásicos entre el público' },
  { src: '/galeria/a43.webp', alt: 'Ferrari en una calle de un casco antiguo' },
  { src: '/galeria/a45.webp', alt: 'Socios del club con sus Ferrari' },
  { src: '/galeria/a46.webp', alt: 'Caravana de Ferrari del club por una carretera de montaña' },
  { src: '/galeria/a48.webp', alt: 'Socios del club junto a un monoplaza de Fórmula 1', forma: 'ancha' },
  { src: '/galeria/a51.webp', alt: 'Ferrari de los socios del club rodando en fila por un circuito', forma: 'ancha' },
  { src: '/galeria/a52.webp', alt: 'Celebración con una tarta entre dos Ferrari' },
  { src: '/galeria/a53.webp', alt: 'Entrega de una placa conmemorativa en un acto del club' },
  { src: '/galeria/a54.webp', alt: 'Socios del club saludando a bordo de una embarcación', forma: 'ancha' },
  { src: '/galeria/a55.webp', alt: 'Socios del club en un salón de un concesionario Ferrari' },
  { src: '/galeria/a56.webp', alt: 'Socios del club ante las bodegas Viña Tondonia' },
  { src: '/galeria/a57.webp', alt: 'Ferrari aparcados ante un edificio de formas metálicas' },
  { src: '/galeria/a58.webp', alt: 'Socios del club en una plaza' },
  { src: '/galeria/a60.webp', alt: 'Entrega de un obsequio en una tienda', forma: 'alta' },
  { src: '/galeria/a61.webp', alt: 'Socios del club en una sala de exposición Ferrari', forma: 'ancha' },
  { src: '/galeria/a64.webp', alt: 'Socios del club en una sala de archivo' },
  { src: '/galeria/a65.webp', alt: 'Socios del club en una sala de archivo' },
  { src: '/galeria/a66.webp', alt: 'Socios del club ante un motor Ferrari' },
  { src: '/galeria/a68.webp', alt: 'Socios del club en una cena de gala' },
  { src: '/galeria/a69.webp', alt: 'Ferrari aparcados alrededor de un jardín' },
  { src: '/galeria/a70.webp', alt: 'Socios del club junto a un tranvía antiguo' },
  { src: '/galeria/a71.webp', alt: 'Recuerdo con el escudo del Ferrari Club España', forma: 'alta' },
  { src: '/galeria/a72.webp', alt: 'Socios del club en una bodega' },
  { src: '/galeria/a73.webp', alt: 'Socios del club ante una bodega' },
  { src: '/galeria/a74.webp', alt: 'Socias del club en una tienda con fotografías de Ferrari' },
  { src: '/galeria/a75.webp', alt: 'Socios del club ante la entrada de la fábrica Ferrari' },
];
