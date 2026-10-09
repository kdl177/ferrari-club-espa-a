/**
 * Trae el archivo "Mundo Ferrari" del club (www2.ferrariclubespana.com) a
 * src/content/mundo-ferrari.json y guarda sus imagenes en public/mundo-ferrari/.
 * Respeta el indice de cada seccion: sus apartados y el orden de los articulos.
 * Se puede reejecutar: solo descarga las imagenes que falten.
 *
 *   node scripts/importar-mundo-ferrari.mjs
 */
import { writeFile, mkdir, access } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEN = 'https://www2.ferrariclubespana.com/';
const SALIDA = 'src/content/mundo-ferrari.json';
const IMAGENES = 'public/mundo-ferrari';
const SECCIONES = [
  { clave: 'historia', indice: 'historia.html', titulo: 'Historia Ferrari' },
  { clave: 'maranello', indice: 'maranello.html', titulo: 'Maranello y la Fábrica Ferrari' },
  { clave: 'todos-los-ferrari', indice: 'banco.html', titulo: 'Todos los Ferrari' },
  { clave: 'arte', indice: 'arte.html', titulo: 'Galería de Arte Ferrari' },
  { clave: 'modelismo', indice: 'expo.html', titulo: 'Modelismo Ferrari' },
];

async function bajar(url) {
  for (let intento = 0; ; intento++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (FerrariClubEspana-migracion)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (intento >= 2) throw new Error(`${url}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 2000 * (intento + 1)));
    }
  }
}

// Las paginas de www2 mezclan UTF-8 y Windows-1252 segun el año en que se
// escribieron.
function decodificarPagina(buf) {
  let html;
  try {
    html = new TextDecoder('utf-8', { fatal: true }).decode(buf);
  } catch {
    html = new TextDecoder('windows-1252').decode(buf);
  }
  // Alguna pagina guardo UTF-8 como si fuera Latin-1 ("MarÃ­a"): se deshace.
  if (/Ã[\u0080-\u00bf]/.test(html)) {
    const arreglado = Buffer.from(html, 'latin1').toString('utf8');
    if (!arreglado.includes('\ufffd')) html = arreglado;
  }
  // Puntuacion codificada dos veces en el propio original ("\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u0153" por "\u2013").
  const DOBLES = { '\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u0153': '\u2013', '\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u201e\u00a2': '\u2019', '\u00c3\u00a2\u00e2\u201a\u00ac\u00cb\u0153': '\u2018', '\u00c3\u00a2\u00e2\u201a\u00ac\u00c5\u201c': '\u201c', '\u00c3\u00a2\u00e2\u201a\u00ac\u00c2\u00a6': '\u2026', '\u00c3\u00a2\u00e2\u201a\u00ac\u00c2': '\u201d' };
  for (const [mal, bien] of Object.entries(DOBLES)) html = html.split(mal).join(bien);
  return html;
}

// Las tablas de maquetacion anidadas dejan cierres sin apertura y viceversa.
// Se descartan los cierres huerfanos y se cierra lo que quede abierto, para
// que el articulo no rompa el contenedor de la pagina.
function equilibrar(html) {
  let abiertos = 0;
  const salida = html.replace(/<(\/?)div\b[^>]*>/g, (m, cierre) => {
    if (!cierre) {
      abiertos++;
      return m;
    }
    if (!abiertos) return '';
    abiertos--;
    return m;
  });
  return salida + '</div>'.repeat(abiertos);
}

function sinVacios(html) {
  let previo;
  do {
    previo = html;
    html = html.replace(/<div class="mf-(celda|fila)">(\s|&nbsp;|<br>|<\/?p>)*<\/div>/g, '');
  } while (html !== previo);
  return html;
}

const ENTIDADES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú',
  ntilde: 'ñ', Ntilde: 'Ñ', uuml: 'ü', Uuml: 'Ü', ordm: 'º', ordf: 'ª', iexcl: '¡', iquest: '¿', laquo: '«', raquo: '»',
  copy: '©', reg: '®', deg: '°', euro: '€', ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  agrave: 'à', egrave: 'è', igrave: 'ì', ograve: 'ò', ugrave: 'ù', ccedil: 'ç', Ccedil: 'Ç', auml: 'ä', ouml: 'ö', middot: '·', times: '×',
  atilde: 'ã', otilde: 'õ', acirc: 'â', ecirc: 'ê', icirc: 'î', ocirc: 'ô', ucirc: 'û', euml: 'ë', iuml: 'ï', szlig: 'ß', bull: '•', acute: '´',
};
const decodificar = (s) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENTIDADES[e] ?? m
  );
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const texto = (html) => decodificar(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const attr = (attrs, n) => {
  const m = attrs.match(new RegExp(`\\b${n}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? decodificar(m[1] ?? m[2] ?? m[3] ?? '') : '';
};
const slugDe = (archivo) => archivo.replace(/\.html?$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function cuerpoDe(html) {
  const sin = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, '');
  const i = sin.search(/<body/i);
  const fin = sin.search(/<\/body>/i);
  return sin.slice(i < 0 ? 0 : sin.indexOf('>', i) + 1, fin < 0 ? undefined : fin);
}

// Indice de una seccion: el texto de entrada y los articulos en orden, cada
// uno bajo el ultimo rotulo que terminaba en dos puntos ("Curiosidades:").
function leerIndice(html) {
  const marcado = cuerpoDe(html)
    .replace(/<a\s([^>]*)>([\s\S]*?)<\/a>/gi, (_, a, t) => `\n@@ENLACE ${attr(a, 'href')} ${texto(t)}\n`)
    .replace(/<br\s*\/?>|<\/?p[^>]*>|<\/?tr[^>]*>|<\/?td[^>]*>|<\/?li[^>]*>/gi, '\n');
  const lineas = texto(marcado.replace(/\n/g, ' §§ ')).split('§§').map((l) => l.trim()).filter(Boolean);
  const intro = [];
  const grupos = [];
  let titulo = '';
  const esEnlace = (l) => /^@@ENLACE \S+\.html?\b/i.test(l ?? '') && !/^@@ENLACE https?:/i.test(l ?? '');
  lineas.forEach((l, i) => {
    const m = l.match(/^@@ENLACE (\S+) ?(.*)$/);
    if (esEnlace(l)) {
      if (!grupos.length) grupos.push({ titulo: '', articulos: [] });
      if (m[2]) grupos.at(-1).articulos.push({ archivo: m[1], titulo: m[2] });
    } else if (!m && l.length < 90 && (/:$/.test(l) || (titulo && esEnlace(lineas[i + 1])))) {
      grupos.push({ titulo: l.replace(/:$/, ''), articulos: [] });
    } else if (!m && !grupos.length && !/^MUNDO FERRARI$|^©/.test(l)) {
      if (!titulo) titulo = l;
      else intro.push(l);
    }
  });
  return { titulo, intro, grupos: grupos.filter((g) => g.articulos.length) };
}

const DECORATIVA = /marginred|aball|nuevot|logo|fonsred|30anni|linea|flecha/i;
const PERMITIDAS = new Set(['p', 'br', 'strong', 'em', 'a', 'img', 'h2', 'h3', 'h4', 'blockquote', 'table', 'tr', 'td', 'th', 'sup', 'sub']);

function limpiar(fragmento, base, rutaDe) {
  const imagenes = [];
  let html = fragmento.replace(/<(\/?)(\w+)([^>]*)>/g, (_, cierre, nombre, attrs) => {
    let t = nombre.toLowerCase();
    if (t === 'b') t = 'strong';
    if (t === 'i') t = 'em';
    if (t === 'font' && !cierre && /size\s*=\s*["']?[45]/i.test(attrs)) return '<h3>';
    if (!PERMITIDAS.has(t)) return t === 'div' || t === 'center' ? '<br>' : '';
    if (cierre) return ['br', 'img', 'table'].includes(t) ? '' : `</${t}>`;
    if (t === 'img') {
      const src = new URL(attr(attrs, 'src'), base).href;
      if (DECORATIVA.test(src)) return '';
      imagenes.push(src);
      return `<img src="${escapar(src)}" alt="${escapar(attr(attrs, 'alt'))}">`;
    }
    if (t === 'a') {
      const href = attr(attrs, 'href');
      if (!href || /^javascript:/i.test(href)) return '<a>';
      const destino = new URL(href.split(' ')[0], base).href;
      return `<a href="${escapar(rutaDe(destino) ?? destino)}">`;
    }
    if (t === 'tr') return '<div class="mf-fila">';
    if (t === 'td' || t === 'th') return '<div class="mf-celda">';
    return t === 'table' ? '' : `<${t}>`;
  });
  html = html.replace(/<\/(tr|td|th)>/g, '</div>').replace(/<\/table>/g, '').replace(/&#1[03];?/g, ' ');
  // Los <font size=5> se cerraban con </font>, que ya no existe: se cierra el
  // rotulo en el siguiente salto o parrafo.
  html = html.replace(/<h3>([\s\S]*?)(?=<br>|<p>|<\/p>|<h3>|$)/g, (_, t) => (texto(t) ? `<h3>${t.trim()}</h3>` : t));
  html = html
    .replace(/<a>([\s\S]*?)<\/a>/g, '$1')
    .replace(/©\s*Copyright[\s\S]*$/i, '')
    .replace(/(\s*<br>\s*){3,}/g, '<br><br>')
    .replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, '')
    .replace(/<(strong|em|h3)>\s*<\/\1>/g, '')

    .replace(/^(\s|<br>|<\/?p>)+|(\s|<br>|<p>)+$/g, '')
    .trim();
  html = sinVacios(equilibrar(html))
    .replace(/(\s*<br>\s*){3,}/g, '<br><br>')
    .replace(/^(\s|<br>|<\/?p>)+/, '')
    .trim();
  return { html, imagenes };
}

async function guardarImagen(src, destino) {
  try {
    await access(`public${destino}`);
  } catch {
    // Alguna foto antigua esta truncada en origen: se aprovecha lo que haya.
    const img = sharp(await bajar(src), { failOn: 'none' }).rotate();
    const { width = 0, height = 0 } = await img.metadata();
    if (width < 120 || height < 60) return null;
    await img.resize({ width: 720, withoutEnlargement: true }).webp({ quality: 66 }).toFile(`public${destino}`);
  }
  const { width, height } = await sharp(`public${destino}`).metadata();
  return { width, height };
}

const salida = { secciones: [], articulos: [] };
const fallos = [];

for (const sec of SECCIONES) {
  const indice = leerIndice(decodificarPagina(await bajar(ORIGEN + sec.indice)));
  const rutas = new Map();
  for (const g of indice.grupos) for (const a of g.articulos) rutas.set(new URL(a.archivo, ORIGEN).href, `/mundo-ferrari/${sec.clave}/${slugDe(a.archivo)}/`);
  const rutaDe = (u) => rutas.get(u.split('#')[0]);

  salida.secciones.push({
    clave: sec.clave,
    titulo: sec.titulo,
    intro: indice.intro,
    grupos: indice.grupos.map((g) => ({ titulo: g.titulo, articulos: g.articulos.map((a) => slugDe(a.archivo)) })),
  });

  await mkdir(`${IMAGENES}/${sec.clave}`, { recursive: true });
  for (const g of indice.grupos) {
    for (const a of g.articulos) {
      const url = new URL(a.archivo, ORIGEN).href;
      const slug = slugDe(a.archivo);
      try {
        const pagina = decodificarPagina(await bajar(url));
        const { html, imagenes } = limpiar(cuerpoDe(pagina), url, rutaDe);
        let cuerpo = html;
        let portada = null;
        let n = 0;
        for (const src of imagenes) {
          const destino = `/mundo-ferrari/${sec.clave}/${slug}-${++n}.webp`;
          let medidas = null;
          try {
            medidas = await guardarImagen(src, destino);
          } catch (e) {
            fallos.push(`${slug}: ${e.message}`);
          }
          const etiqueta = new RegExp(`<img src="${escapar(src).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"([^>]*)>`);
          cuerpo = cuerpo.replace(
            etiqueta,
            medidas ? `<img src="${destino}" width="${medidas.width}" height="${medidas.height}" loading="lazy" decoding="async"$1>` : ''
          );
          if (medidas && !portada && medidas.width >= 280) portada = { src: destino, ...medidas };
        }
        // El titulo grande del articulo repite el del indice: se queda en la cabecera.
        // A veces va dentro de la tabla de maquetacion, no al principio del todo.
        const clave = (t) => texto(t).toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '').slice(0, 15);
        const h3 = cuerpo.match(/<h3>([\s\S]*?)<\/h3>/);
        if (h3 && h3.index < 400 && clave(h3[1]) === clave(a.titulo)) cuerpo = cuerpo.replace(h3[0], '');
        salida.articulos.push({ seccion: sec.clave, slug, grupo: g.titulo, titulo: a.titulo, portada, cuerpo, palabras: texto(cuerpo).split(' ').length });
      } catch (e) {
        fallos.push(`${slug}: ${e.message}`);
      }
    }
  }
}

await mkdir('src/content', { recursive: true });
await writeFile(SALIDA, JSON.stringify(salida));
console.log(`${salida.articulos.length} artículos en ${salida.secciones.length} secciones → ${SALIDA}`);
for (const f of fallos) console.log('FALLO', f);
if (fallos.length) process.exitCode = 1;
