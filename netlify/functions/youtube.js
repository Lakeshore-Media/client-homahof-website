// Liefert die neuesten Videos des Kanals als JSON und reicht die Vorschaubilder
// ueber die eigene Domain durch. So entsteht beim Seitenaufruf kein Request an
// Google — erst wer ein Video startet, verbindet sich mit YouTube.

const CHANNEL_ID = 'UCri0oUS1SI1V4zNlyxoGNpw'; // Agnihotra Homa-Hof Heiligenberg
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function entschluessle(s) {
  return String(s || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function einzeln(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? entschluessle(m[1].trim()) : '';
}

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const id = q.thumb;

  // Vorschaubild durchreichen. Standard ist die kleine Variante (rund 17 kB);
  // die grosse (rund 200 kB) lohnt nur fuer die Buehne, nicht fuer die Karten.
  if (id) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return { statusCode: 400, body: 'ungueltige id' };
    const varianten = q.gross === '1' ? ['maxresdefault', 'hqdefault'] : ['hqdefault'];
    for (const name of varianten) {
      try {
        const r = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`);
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          },
          body: buf.toString('base64'),
          isBase64Encoded: true,
        };
      } catch (e) {
        console.error('Vorschaubild', id, name, e.message);
      }
    }
    return { statusCode: 404, body: 'kein Vorschaubild' };
  }

  // Videoliste
  try {
    const res = await fetch(FEED);
    if (!res.ok) throw new Error('Feed antwortet ' + res.status);
    const xml = await res.text();

    const videos = (xml.match(/<entry>[\s\S]*?<\/entry>/g) || [])
      .map((e) => {
        const vid = einzeln(e, 'yt:videoId');
        return {
          id: vid,
          titel: einzeln(e, 'title'),
          datum: einzeln(e, 'published'),
          beschreibung: einzeln(e, 'media:description').split('\n')[0].slice(0, 180),
          bild: `/api/youtube?thumb=${vid}`,
          bildGross: `/api/youtube?thumb=${vid}&gross=1`,
        };
      })
      .filter((v) => /^[A-Za-z0-9_-]{11}$/.test(v.id));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // eine Stunde im Browser, einen Tag im CDN – der Feed aendert sich selten
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
      body: JSON.stringify({ videos, stand: new Date().toISOString() }),
    };
  } catch (e) {
    console.error('YouTube-Feed nicht erreichbar:', e.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ videos: [], fehler: true }),
    };
  }
};
