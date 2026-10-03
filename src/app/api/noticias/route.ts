import { NextResponse } from 'next/server';

export const revalidate = 300;

type Article = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
  cat: string;
  catLabel: string;
  source: string;
  feed: string;
  lang: 'es' | 'en';
};

const FEEDS = [
  { url: 'https://es.motorsport.com/rss/f1/news/', source: 'es.motorsport.com', feed: 'Motorsport', cat: 'f1', catLabel: 'FÓRMULA 1', lang: 'es' },
  { url: 'https://www.marca.com/rss/motor/formula1.xml', source: 'marca.com', feed: 'Marca Motor', cat: 'f1', catLabel: 'FÓRMULA 1', lang: 'es' },
  { url: 'https://racer.com/feed/', source: 'racer.com', feed: 'Racer', cat: 'motorsport', catLabel: 'MOTORSPORT', lang: 'en' },
  { url: 'https://www.the-race.com/feed/', source: 'the-race.com', feed: 'The Race', cat: 'f1', catLabel: 'FÓRMULA 1', lang: 'en' },
  { url: 'https://www.autosport.com/rss/f1/news/', source: 'autosport.com', feed: 'Autosport', cat: 'f1', catLabel: 'FÓRMULA 1', lang: 'en' },
];

function stripCdata(s: string) {
  return s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? decodeEntities(stripCdata(m[1]).trim()) : '';
}

function attr(xml: string, tagName: string, attrName: string): string {
  const m = xml.match(new RegExp(`<${tagName}[^>]*${attrName}=["']([^"']+)["']`, 'i'));
  return m ? m[1] : '';
}

function extractThumbnail(itemXml: string): string {
  const mediaContent = attr(itemXml, 'media:content', 'url');
  if (mediaContent) return mediaContent;
  const mediaThumb = attr(itemXml, 'media:thumbnail', 'url');
  if (mediaThumb) return mediaThumb;
  const enclosure = attr(itemXml, 'enclosure', 'url');
  if (enclosure) return enclosure;
  const desc = tag(itemXml, 'description') || tag(itemXml, 'content:encoded');
  const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : '';
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').trim();
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<Article[]> {
  const res = await fetch(feed.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FerrariClubEspana/1.0)' },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`${feed.source}: HTTP ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.slice(0, 15).map((item) => {
    const rawDesc = tag(item, 'description');
    return {
      title: tag(item, 'title'),
      link: tag(item, 'link'),
      pubDate: tag(item, 'pubDate'),
      description: stripHtml(rawDesc).slice(0, 220),
      thumbnail: extractThumbnail(item),
      cat: feed.cat,
      catLabel: feed.catLabel,
      source: feed.source,
      feed: feed.feed,
      lang: feed.lang as 'es' | 'en',
    };
  });
}

export async function GET() {
  try {
    const results = await Promise.allSettled(FEEDS.map(fetchFeed));
    const articles: Article[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') articles.push(...r.value);
    }
    articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Los feeds en ingles publican mucho mas volumen: ordenar solo por fecha
    // dejaria el español fuera de la primera pagina. Se intercalan 1 a 1
    // manteniendo el orden cronologico dentro de cada idioma.
    const es = articles.filter((a) => a.lang === 'es');
    const en = articles.filter((a) => a.lang === 'en');
    const mezclados: Article[] = [];
    for (let i = 0; i < Math.max(es.length, en.length); i++) {
      if (es[i]) mezclados.push(es[i]);
      if (en[i]) mezclados.push(en[i]);
    }

    if (!articles.length) {
      return NextResponse.json({ ok: false, error: 'No se pudieron cargar los feeds de noticias.' }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      count: mezclados.length,
      updatedAt: new Date().toISOString(),
      articles: mezclados,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'Feed error' }, { status: 502 });
  }
}
