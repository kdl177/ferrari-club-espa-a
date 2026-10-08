// Condiciones y ventajas de la membresia. Lo leen /club/hazte-socio y su
// version de /comunidad: si estuviera en una de las dos paginas, acabarian
// prometiendo cosas distintas. Todo sale de lo que el club publica en su web
// (Nuestro club, Hazte socio y Socios); nada de aqui es una promesa nueva.

export const PDF_INSCRIPCION = 'https://www.ferrariclubespana.com/clubferrari/resources/source/pdf/inscripcion.pdf';
export const PDF_INSCRIPCION_EN = 'https://www.ferrariclubespana.com/clubferrari/resources/source/pdf/inscripcion-english.pdf';

// La seccion Socios de la web del club, con sus mismos enlaces.
export const OFERTA_SOCIOS = [
  { t: 'Revista del Ferrari Club España', d: 'Todos los números disponibles.', enlace: '/revista/', accion: 'VER NÚMEROS' },
  { t: 'Oferta de los Concesionarios Oficiales Ferrari', d: 'Exclusiva para nuestros socios.', enlace: 'https://www.ferrariclubespana.com/clubferrari/resources/source/socios/descuentos-concesionarios.pdf', accion: 'VER OFERTA' },
  { t: 'Seguros para vehículos Ferrari', d: 'Oferta especial para los socios. El club colabora con las principales compañías aseguradoras del mercado.', enlace: '/contacta/?asunto=seguros', accion: 'SOLICITA PRESUPUESTO' },
  { t: 'Cursos de conducción', d: 'Curso de conducción deportiva para clientes Ferrari.', enlace: 'https://www.ferrari.com/en-EN/auto/driving-courses', accion: 'MÁS INFORMACIÓN' },
];

export const BENEFITS = [
  { title: 'Tandas en circuito', desc: 'Jornadas de pilotaje con tu Ferrari en los circuitos más carismáticos del país.' },
  { title: 'Rutas', desc: 'Itinerarios por los paisajes más bonitos de la Península y de las Islas Canarias.' },
  { title: 'Test de F1 de pretemporada', desc: 'En el Circuit de Barcelona-Catalunya, desde el box de Ferrari y la zona de paddock de la Scuderia, guiados por responsables del equipo.' },
  { title: 'Visita a Maranello', desc: 'Cada año, visita a la fábrica Ferrari de Maranello, exclusiva para socios.' },
  { title: 'Salidas al extranjero', desc: 'Visitas a otras marcas como Pagani o Maserati, eventos con clubs de Europa y encuentros de Ferrari como el Tribute to Mille Miglia.' },
  { title: 'Revista del club', desc: 'La revista del Ferrari Club España, con todos sus números disponibles para socios.' },
  { title: 'Oferta de los concesionarios', desc: 'Oferta de los concesionarios oficiales Ferrari, exclusiva para socios.' },
  { title: 'Seguros', desc: 'Oferta especial de seguros para vehículos Ferrari.' },
  { title: 'Cursos de conducción', desc: 'Curso de conducción deportiva para clientes Ferrari.' },
];

export const REQUIREMENTS = [
  { n: '01', title: 'Ser propietario de un Ferrari', desc: 'El club reúne a propietarios de Ferrari desde 1988.' },
  { n: '02', title: 'Enviar la solicitud', desc: 'Con el formulario de esta página o con el formulario de inscripción en PDF, en español o en inglés.' },
  { n: '03', title: 'Hablar con secretaría', desc: 'La oficina de Madrid te informa de la cuota y de todo lo necesario para completar el alta.' },
];

export const FAQS = [
  { q: '¿Quién puede hacerse socio?', a: 'El Ferrari Club España es un club de propietarios: para ser socio hay que tener un Ferrari.' },
  { q: '¿Es un club oficial?', a: 'Sí. Desde 2006 cuenta con el apoyo directo de Ferrari, que le concedió el estatus de Club Oficial. Es el único Club Oficial del Cavallino en España.' },
  { q: '¿Cuál es la cuota?', a: 'Te la indica la secretaría del club en el 91 575 41 60, de lunes a jueves de 9:00 a 17:30 y los viernes de 9:00 a 15:00.' },
  { q: '¿Puedo inscribirme sin el formulario web?', a: 'Sí. Puedes rellenar el formulario de inscripción en PDF, o llamar a la oficina de Madrid al 91 575 41 60, donde te informarán de todo lo necesario.' },
];
