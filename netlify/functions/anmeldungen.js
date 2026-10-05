const FORMULARE = [
  { id: '6a195c7330ad0c0008636a47', quelle: 'Veranstaltungen' },
  { id: '6a195c7230ad0c0008636a3b', quelle: 'Am Hof' },
];

function feld(d, ...namen) {
  for (const n of namen) {
    const v = (d && d[n] != null ? String(d[n]) : '').trim();
    if (v) return v;
  }
  return '';
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: 'Invalid JSON' }; }

  const erwartet = process.env.ANMELDUNGEN_PASSWORT;
  const token    = process.env.NETLIFY_API_TOKEN;

  if (!erwartet || !token) {
    console.error('ANMELDUNGEN_PASSWORT oder NETLIFY_API_TOKEN fehlt');
    return { statusCode: 500, body: JSON.stringify({ fehler: 'Serverseitig nicht eingerichtet.' }) };
  }

  // Brute-Force ausbremsen: jede Antwort kostet dieselbe Zeit
  await new Promise((r) => setTimeout(r, 400));
  if (body.passwort !== erwartet) {
    return { statusCode: 401, body: JSON.stringify({ fehler: 'Passwort stimmt nicht.' }) };
  }

  const anmeldungen = [];
  for (const f of FORMULARE) {
    try {
      const res = await fetch(
        `https://api.netlify.com/api/v1/forms/${f.id}/submissions?per_page=500`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) { console.error('Netlify API', f.quelle, res.status); continue; }
      for (const s of await res.json()) {
        const d = s.data || {};
        const name = [feld(d, 'vorname'), feld(d, 'nachname')].filter(Boolean).join(' ') || feld(d, 'name');
        anmeldungen.push({
          veranstaltung: feld(d, 'veranstaltung') || 'Ohne Zuordnung',
          name,
          email:        feld(d, 'email'),
          teilnehmer:   feld(d, 'teilnehmer') || '1',
          nachricht:    feld(d, 'nachricht'),
          newsletter:   feld(d, 'newsletter') === 'ja',
          eingegangen:  s.created_at,
          quelle:       f.quelle,
        });
      }
    } catch (e) {
      console.error('Abruf fehlgeschlagen', f.quelle, e.message);
    }
  }

  anmeldungen.sort((a, b) => new Date(b.eingegangen) - new Date(a.eingegangen));

  // nach Veranstaltung bündeln, nächster Termin zuerst
  const nachVeranstaltung = {};
  for (const a of anmeldungen) {
    (nachVeranstaltung[a.veranstaltung] ||= []).push(a);
  }
  const gruppen = Object.entries(nachVeranstaltung)
    .map(([titel, liste]) => ({
      titel,
      anzahl: liste.length,
      personen: liste.reduce((s, x) => s + (parseInt(x.teilnehmer, 10) || 1), 0),
      neueste: liste[0].eingegangen,
      liste,
    }))
    .sort((a, b) => new Date(b.neueste) - new Date(a.neueste));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ gruppen, gesamt: anmeldungen.length, stand: new Date().toISOString() }),
  };
};
