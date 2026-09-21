import type { FotoId } from './fotos';

export type Article = {
  slug: string;
  foto: FotoId;
  title: string;
  metaTitle: string;
  metaDesc: string;
  cat: string;
  date: string;
  readTime: string;
  heroLabel: string;
  heroFontSize: number;
  heroBg: string;
  lead: string;
  paragraphs1: string[];
  imageCaption?: string;
  imageLabel: string;
  resultBox?: { title: string; rows: { pos: string; car: string; time: string }[] };
  specsTable?: { label: string; value: string }[];
  h2_1: string;
  paragraphs2: string[];
  h2_2: string;
  paragraphs3: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: 'gp-paises-bajos',
    foto: 'f1-zandvoort-2024',
    title: 'GP de Países Bajos de F1 — Previo: Ferrari saldrá a Zandvoort con la intención de seguir mejorando',
    metaTitle: 'GP Países Bajos — Ferrari Club España',
    metaDesc: 'GP de Países Bajos de F1 — Ferrari saldrá a Zandvoort con la intención de seguir mejorando. Ferrari Club España.',
    cat: 'FÓRMULA 1',
    date: '18 AGO 2026',
    readTime: '4 MIN',
    heroLabel: 'F1',
    heroFontSize: 180,
    heroBg: '#1a0000',
    lead: 'Ferrari afronta el Gran Premio de Países Bajos con renovadas esperanzas tras los avances técnicos introducidos en las últimas carreras del campeonato.',
    paragraphs1: [
      'El equipo italiano llega al trazado costero de Zandvoort con un paquete de actualizaciones que ha venido desarrollando a lo largo del verano. La Scuderia ha confirmado importantes mejoras aerodinámicas en el suelo del monoplaza, un área crítica en los actuales reglamentos de Fórmula 1.',
      'El circuito Zandvoort, ubicado a pocos kilómetros del Mar del Norte, presenta características únicas que han favorecido históricamente a ciertos tipos de coches. El trazado de 4.259 km incluye curvas peraltadas y secciones de alta velocidad que exigirán al máximo a los Ferrari SF-26.',
    ],
    imageCaption: 'CIRCUITO DE ZANDVOORT · PAÍSES BAJOS · 4.259 KM · 14 CURVAS',
    imageLabel: 'ZANDVOORT',
    h2_1: 'Las Claves Técnicas',
    paragraphs2: [
      'El equipo ha optado por una configuración de carga aerodinámica media-alta para este trazado. Las curvas peraltadas de Zandvoort permiten velocidades de paso superiores a las de un circuito convencional, lo que demanda un equilibrio muy preciso entre downforce y resistencia al avance.',
      'Frederic Vasseur, director del equipo, señaló en la conferencia de prensa previa al Gran Premio: "Hemos trabajado muy duro durante el parón veraniego. El equipo ha dado un paso importante en la comprensión de la ventana de trabajo de nuestros neumáticos, y eso debería ayudarnos en Zandvoort."',
    ],
    h2_2: 'Expectativas del Weekend',
    paragraphs3: [
      'Las previsiones meteorológicas apuntan a un fin de semana con condiciones cambiantes, lo que podría añadir un elemento de incertidumbre a la estrategia. Ferrari ha demostrado en los últimos Grandes Premios una mayor capacidad de reacción ante condiciones variables, un aspecto en el que el equipo ha mejorado considerablemente.',
      'El Gran Premio de Países Bajos se disputará este domingo 25 de agosto con salida prevista a las 15:00 horas (hora española). Los socios del Ferrari Club España pueden seguir el evento en nuestro área de socios con análisis en tiempo real.',
    ],
  },
  {
    slug: '499p-monza',
    foto: '499p-spa-2023',
    title: 'Ferrari 499P domina en Monza y lidera el Campeonato Mundial de Resistencia',
    metaTitle: '499P Monza — Ferrari Club España',
    metaDesc: 'Ferrari 499P domina en Monza y lidera el Campeonato Mundial de Resistencia. Ferrari Club España.',
    cat: 'ENDURANCE · WEC',
    date: '12 AGO 2026',
    readTime: '5 MIN',
    heroLabel: 'WEC',
    heroFontSize: 150,
    heroBg: '#0d0000',
    lead: 'El Ferrari 499P número 50, tripulado por Fuoco, Molina y Nielsen, se impuso de forma categórica en la 6 Horas de Monza, consolidando el liderato del equipo AF Corse en el Campeonato Mundial de Resistencia (WEC).',
    paragraphs1: [
      'La prueba italiana, disputada en el mítico Autodromo Nazionale di Monza, fue un festival para los colores de Maranello. Los dos Ferrari 499P de AF Corse cruzaron la línea de meta en primera y segunda posición, repitiendo el doblete conseguido en Le Mans el año anterior.',
      'El coche número 50 marcó el ritmo desde los primeros compases de la carrera. La estrategia del equipo, basada en una gestión impecable de los neumáticos y paradas en boxes precisas al segundo, demostró la madurez que ha alcanzado el programa de hypercar de Ferrari.',
    ],
    imageLabel: '',
    resultBox: {
      title: 'CLASIFICACIÓN FINAL — 6 HORAS DE MONZA',
      rows: [
        { pos: 'P1', car: 'Ferrari 499P #50 — Fuoco / Molina / Nielsen', time: '6h 00m 14.832s' },
        { pos: 'P2', car: 'Ferrari 499P #51 — Pier Guidi / Calado / Giovinazzi', time: '+28.4s' },
        { pos: 'P3', car: 'Toyota GR010 HYBRID #8', time: '+1m 12.1s' },
        { pos: 'P4', car: 'Porsche 963 #6', time: '+2m 04.7s' },
      ],
    },
    h2_1: 'El 499P en su Mejor Forma',
    paragraphs2: [
      'El Ferrari 499P ha demostrado en Monza que se ha convertido en el hypercar de referencia en las actuales condiciones reglamentarias. El motor V6 biturbo de 680 CV, combinado con la unidad eléctrica del eje delantero, proporciona una aceleración excepcional en las salidas de las chicanes, donde el prototipo de Maranello muestra sus mayores ventajas sobre los rivales.',
      'Alessandro Pier Guidi, piloto del coche hermano que terminó en segunda posición, comentó tras la carrera: "Es un día increíble para Ferrari. Hemos trabajado muy duro durante toda la temporada y estos resultados son el reflejo de ese esfuerzo colectivo. El coche es fantástico."',
    ],
    h2_2: 'Rumbo al Título',
    paragraphs3: [
      'Con este resultado, Ferrari AF Corse lidera cómodamente el campeonato de constructores, con una ventaja de 43 puntos sobre Toyota, que sigue siendo su principal rival. Faltan cuatro pruebas para el final de la temporada, incluyendo las 8 Horas de Fuji y las legendarias 8 Horas de Bahréin.',
      'Desde el Ferrari Club España seguiremos de cerca el camino del Cavallino Rampante hacia lo que podría ser un histórico doblete de títulos en el WEC.',
    ],
  },
  {
    slug: 'sf90-xx-stradale',
    foto: 'sf90-xx-stradale',
    title: 'Ferrari SF90 XX Stradale: el Ferrari de calle más potente de toda la historia de la marca',
    metaTitle: 'SF90 XX Stradale — Ferrari Club España',
    metaDesc: 'Ferrari SF90 XX Stradale: 1.030 CV, el Ferrari de calle más potente de la historia. Ferrari Club España.',
    cat: 'MODELOS · TECNOLOGÍA',
    date: '08 AGO 2026',
    readTime: '6 MIN',
    heroLabel: 'SF90 XX',
    heroFontSize: 120,
    heroBg: '#180000',
    lead: 'Con 1.030 CV y un 0-100 km/h en apenas 2,3 segundos, el Ferrari SF90 XX Stradale representa la cumbre tecnológica del fabricante de Maranello, llevando la tecnología del motorsport directamente a la carretera.',
    paragraphs1: [
      'Ferrari ha decidido superar todos sus propios límites con el SF90 XX Stradale. Este hypercar de producción limitada hereda directamente la tecnología del SF90 XX que compitió en el FXX K Programme, adaptándola para su homologación como vehículo de calle. El resultado es un coche que desafía las leyes de la física tal y como las conocemos.',
      'El sistema de propulsión combina un motor V8 biturbo de 3,9 litros que desarrolla 780 CV con tres motores eléctricos que suman 250 CV adicionales. Los dos motores del eje delantero y uno trasero trabajan en perfecta armonía bajo la dirección del sistema de control electrónico eVia, garantizando una tracción y distribución de par sin precedentes.',
    ],
    imageCaption: 'FERRARI SF90 XX STRADALE · 1.030 CV · PRODUCCIÓN LIMITADA',
    imageLabel: '1030',
    specsTable: [
      { label: 'POTENCIA TOTAL', value: '1.030 CV (780 CV V8 + 250 CV eléctrico)' },
      { label: 'MOTOR TÉRMICO', value: 'V8 biturbo 3.9 L' },
      { label: 'MOTORES ELÉCTRICOS', value: '3 (2 eje delantero + 1 eje trasero)' },
      { label: '0–100 KM/H', value: '2.3 segundos' },
      { label: '0–200 KM/H', value: '6.5 segundos' },
      { label: 'VELOCIDAD MÁXIMA', value: '320 km/h' },
      { label: 'PESO EN VACÍO', value: '1.570 kg' },
      { label: 'RELACIÓN POTENCIA/PESO', value: '1.34 CV/kg' },
      { label: 'TRANSMISIÓN', value: '8 marchas F1-DCT' },
      { label: 'TRACCIÓN', value: '4WD eléctrico (4WD en modo EV)' },
      { label: 'AERODINÁMICA', value: '+20% downforce vs SF90 Stradale' },
      { label: 'PRODUCCIÓN', value: 'Serie limitada — lista de espera cerrada' },
    ],
    h2_1: 'Aerodinámica de Nivel XX',
    paragraphs2: [
      'El trabajo aerodinámico del SF90 XX Stradale es quizás su aspecto más llamativo desde el exterior. Ferrari ha optado por un diseño más agresivo que el SF90 Stradale convencional, con un alerón trasero activo de mayor tamaño, difusor trasero rediseñado y un fondo plano optimizado mediante simulaciones CFD y pruebas en el túnel de viento de Maranello.',
      'El resultado es un aumento del 20% en la carga aerodinámica con respecto al SF90 Stradale, manteniendo el mismo coeficiente de resistencia aerodinámica. Un logro que parecía imposible hace apenas una década y que demuestra el nivel de desarrollo alcanzado por Ferrari en materia aerodinámica.',
    ],
    h2_2: 'La Experiencia al Volante',
    paragraphs3: [
      'Quienes han tenido el privilegio de conducir el SF90 XX Stradale en el circuito de Fiorano describen una experiencia sobrenatural. La respuesta al acelerador es instantánea gracias a los motores eléctricos, que eliminan cualquier retraso entre la orden del conductor y la reacción del coche. Los frenos de carbono-cerámica detienen el coche con una eficacia brutal.',
      'Los socios del Ferrari Club España que sean propietarios de este exclusivo hypercar pueden compartir sus experiencias de rodada en nuestro Área de Socios. El club también organiza sesiones especiales en circuito para los miembros que dispongan de los modelos de la gama XX.',
    ],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
