/**
 * Trae las noticias publicadas en la web anterior (ferrariclubespana.com) a
 * src/content/noticias-archivo.json y guarda cada portada en public/noticias/.
 * Se puede reejecutar: solo descarga las portadas que falten.
 *
 *   node scripts/importar-noticias.mjs
 */
import { writeFile, mkdir, access } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEN = 'https://www.ferrariclubespana.com';
const SALIDA = 'src/content/noticias-archivo.json';
const PORTADAS = 'public/noticias';
const RUTA = /\/noticias\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/;

async function get(url, binario = false) {
  for (let intento = 0; ; intento++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (FerrariClubEspana-migracion)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return binario ? Buffer.from(await res.arrayBuffer()) : new TextDecoder('utf-8').decode(await res.arrayBuffer());
    } catch (e) {
      if (intento >= 2) throw new Error(`${url}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 2000 * (intento + 1)));
    }
  }
}

// Entidades con nombre que usa el CMS antiguo.
const ENTIDADES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú',
  ntilde: 'ñ', Ntilde: 'Ñ', uuml: 'ü', Uuml: 'Ü', ordm: 'º', ordf: 'ª', iexcl: '¡', iquest: '¿', laquo: '«', raquo: '»',
  copy: '©', reg: '®', deg: '°', euro: '€', ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  agrave: 'à', egrave: 'è', igrave: 'ì', ograve: 'ò', ugrave: 'ù', ccedil: 'ç', Ccedil: 'Ç', auml: 'ä', ouml: 'ö', middot: '·', times: '×',
  atilde: 'ã', otilde: 'õ', Atilde: 'Ã', acirc: 'â', ecirc: 'ê', icirc: 'î', ocirc: 'ô', ucirc: 'û', euml: 'ë', iuml: 'ï', szlig: 'ß',
  oslash: 'ø', aring: 'å', aelig: 'æ', bull: '•', trade: '™', frac12: '½', sup2: '²', sup3: '³', shy: '', acute: '´', rsaquo: '›', lsaquo: '‹',
};
function decodificar(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTIDADES[e] ?? m;
  });
}
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escaparAttr = (s) => escapar(s).replace(/"/g, '&quot;');
const texto = (html) => decodificar(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function bloqueDiv(html, inicio) {
  let i = html.indexOf('>', inicio) + 1;
  let prof = 1;
  const re = /<(\/?)div\b[^>]*>/gi;
  re.lastIndex = i;
  let m;
  while ((m = re.exec(html))) {
    prof += m[1] ? -1 : 1;
    if (prof === 0) return html.slice(i, m.index);
  }
  return html.slice(i);
}

const PERMITIDAS = new Set(['p', 'br', 'strong', 'em', 'a', 'img', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'hr', 'blockquote', 'iframe', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'sup', 'sub']);
const absoluta = (u) => (u.startsWith('/') ? ORIGEN + u : u);

// Deja solo etiquetas de contenido y sin estilos en linea: el aspecto lo pone
// la hoja de estilos de la web nueva.
function limpiar(fragmento) {
  const imagenes = [];
  let html = fragmento.replace(/<!--[\s\S]*?-->/g, '').replace(/<(\/?)(\w+)([^>]*)>/g, (_, cierre, nombre, attrs) => {
    let t = nombre.toLowerCase();
    if (t === 'b') t = 'strong';
    if (t === 'i') t = 'em';
    if (!PERMITIDAS.has(t)) return '';
    if (cierre) return ['br', 'hr', 'img'].includes(t) ? '' : `</${t}>`;
    const attr = (n) => (attrs.match(new RegExp(`${n}\\s*=\\s*["']([^"']*)["']`, 'i')) || [])[1] || '';
    if (t === 'img') {
      const src = absoluta(decodificar(attr('src')));
      if (!src || /overlay/.test(src)) return '';
      imagenes.push(src);
      return `<img src="${escaparAttr(src)}" alt="${escaparAttr(decodificar(attr('alt')))}">`;
    }
    if (t === 'a') return `<a href="${escaparAttr(absoluta(decodificar(attr('href'))))}">`;
    if (t === 'iframe') {
      const src = decodificar(attr('src'));
      return /youtube|youtu\.be|vimeo/.test(src) ? `<iframe src="${escaparAttr(src)}" loading="lazy" allowfullscreen>` : '';
    }
    return `<${t}>`;
  });
  html = html
    .replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, '')
    .replace(/(<br>\s*){3,}/g, '<br><br>')
    .replace(/<(strong|em)>\s*<\/\1>/g, '')
    .replace(/<iframe([^>]*)>(?!<\/iframe>)/g, '<iframe$1></iframe>')
    .trim();
  return { html, imagenes };
}

const PARRAFO = /<p>([\s\S]*?)<\/p>/;
const clave = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
const parecido = (a, b) => clave(texto(a)).startsWith(clave(b).slice(0, 20));
const firmaDe = (html) => texto(html.replace(/<br>/g, ' · ')).replace(/^[\s·]+|[\s·]+$/g, '');

// El CMS antiguo abre cada noticia repitiendo el titular y la firma dentro del
// cuerpo, con <p> en las recientes y con <h3>/<h4> en las anteriores a 2026.
// La web nueva los muestra en la cabecera, asi que se separan.
function separarCabecera(html, titulo) {
  let subtitulo = '';
  let firma = '';
  let resto = html;
  const quitar = (trozo) => {
    resto = resto.slice(resto.indexOf(trozo) + trozo.length).trim();
  };
  const h3 = resto.match(/^<h3>([\s\S]*?)<\/h3>/);
  const p1 = resto.match(PARRAFO);
  if (h3 && parecido(h3[1], titulo)) {
    quitar(h3[0]);
    const h4 = resto.match(/^<h4>([\s\S]*?)<\/h4>/);
    if (h4) {
      subtitulo = texto(h4[1]);
      quitar(h4[0]);
    }
  } else if (p1 && resto.indexOf(p1[0]) < 40 && parecido(p1[1], titulo)) {
    subtitulo = texto(p1[1].split(/<br>/).slice(1).join(' '));
    quitar(p1[0]);
  } else {
    return { subtitulo, firma, resto };
  }
  const p2 = resto.match(PARRAFO);
  if (p2 && resto.indexOf(p2[0]) < 40 && /redacci|fotos|fuente|©|&copy;/i.test(p2[1])) {
    firma = firmaDe(p2[1]);
    quitar(p2[0]);
  }
  resto = resto.replace(/^<hr>/, '').trim();
  return { subtitulo, firma, resto };
}

function categoria(titulo) {
  if (/f[oó]rmula 1|\bf1\b|scuderia|leclerc|hamilton|sainz|gran premio/i.test(titulo)) return 'Fórmula 1';
  if (/\bwec\b|le mans|daytona|imsa|gt world|resistencia|hyperpole|nürburgring|spa\b|challenge/i.test(titulo)) return 'Competición';
  if (/^nuevo ferrari|presenta|lanza|ferrari \d{2,3}|purosangue|roma|amalfi|luce/i.test(titulo)) return 'Modelos';
  return 'Actualidad';
}

async function noticia(url) {
  const [, y, m, d, slug] = url.match(RUTA);
  const html = (await get(url)).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '');
  const titulo = texto((html.match(/id="contenidosSeccionEncabezado"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
  const k = html.indexOf('id="blogEntrada"');
  const { html: cuerpoBruto, imagenes } = k > 0 ? limpiar(bloqueDiv(html, html.lastIndexOf('<div', k))) : { html: '', imagenes: [] };
  const og = (html.match(/property="og:image"\s+content="([^"]+)"/) || html.match(/content="([^"]+)"\s+property="og:image"/) || [])[1];
  const { subtitulo, firma, resto } = separarCabecera(cuerpoBruto, titulo);
  const plano = texto(resto);
  return {
    slug,
    fecha: `${y}-${m}-${d}`,
    titulo,
    subtitulo,
    firma,
    categoria: categoria(titulo),
    portadaOrigen: absoluta(og || imagenes[0] || ''),
    portada: `/noticias/${y}-${m}-${d}-${slug}.webp`,
    extracto: (subtitulo || plano).slice(0, 220),
    palabras: plano.split(' ').length,
    cuerpo: resto,
  };
}

async function guardarPortada(n) {
  const destino = `public${n.portada}`;
  try {
    await access(destino);
    return;
  } catch {}
  const img = await get(n.portadaOrigen, true);
  await sharp(img).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 72 }).toFile(destino);
}

async function medirPortada(n) {
  const { width, height } = await sharp(`public${n.portada}`).metadata();
  n.portadaAncho = width;
  n.portadaAlto = height;
}

async function enTandas(items, n, fn) {
  const fallos = [];
  for (let i = 0; i < items.length; i += n) {
    const res = await Promise.allSettled(items.slice(i, i + n).map(fn));
    res.forEach((r, j) => r.status === 'rejected' && fallos.push(`${items[i + j].slug ?? items[i + j]}: ${r.reason.message}`));
    process.stdout.write(`\r${Math.min(i + n, items.length)}/${items.length}`);
  }
  process.stdout.write('\n');
  return fallos;
}

const sitemap = await get(`${ORIGEN}/sitemap.xml`);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => RUTA.test(u));
console.log(`${urls.length} noticias en el sitemap`);

const noticias = [];
const fallosTexto = await enTandas(urls, 6, async (u) => noticias.push(await noticia(u)));
noticias.sort((a, b) => (a.fecha === b.fecha ? a.slug.localeCompare(b.slug) : b.fecha.localeCompare(a.fecha)));

await mkdir(PORTADAS, { recursive: true });
const fallosPortada = await enTandas(noticias, 8, async (n) => {
  await guardarPortada(n);
  await medirPortada(n);
});

await mkdir('src/content', { recursive: true });
await writeFile(SALIDA, JSON.stringify(noticias.map(({ portadaOrigen, ...n }) => n)));
console.log(`${noticias.length} noticias guardadas en ${SALIDA}`);
for (const f of [...fallosTexto, ...fallosPortada]) console.log('FALLO', f);
if (fallosTexto.length || fallosPortada.length) process.exitCode = 1;

