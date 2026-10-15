// Repermission: bestaetigt eine bestehende Adresse ohne zweite DOI-Mail.
// Nachweis = Klick auf den Link in der Mail an genau diese Adresse + Zeitstempel + IP.
// Bestaetigt wird nur, wer bereits in der Repermission-Liste steht.

const LIST_NEWSLETTER   = parseInt(process.env.BREVO_LIST_ID || '3', 10);
const LIST_REPERMISSION = parseInt(process.env.BREVO_REPERMISSION_LIST_ID || '6', 10);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const email = String(data.email || '').trim().toLowerCase();
  if (!email) return { statusCode: 400, body: 'Email required' };

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY not set');
    return json({ success: false, reason: 'not_configured' });
  }

  const headers = { 'Content-Type': 'application/json', 'api-key': apiKey };

  const lookup = await fetch(
    'https://api.brevo.com/v3/contacts/' + encodeURIComponent(email) + '?identifierType=email_id',
    { headers }
  );

  if (lookup.status === 404) {
    console.log('Repermission: unbekannte Adresse');
    return json({ success: false, reason: 'unknown' });
  }
  if (!lookup.ok) {
    console.error('Repermission lookup failed', lookup.status, await lookup.text());
    return json({ success: false, reason: 'lookup_failed' });
  }

  const contact = await lookup.json();
  const lists = contact.listIds || [];

  if (contact.emailBlacklisted) {
    return json({ success: false, reason: 'blocked' });
  }
  if (lists.includes(LIST_NEWSLETTER) && !lists.includes(LIST_REPERMISSION)) {
    return json({ success: true, already: true });
  }
  if (!lists.includes(LIST_REPERMISSION)) {
    return json({ success: false, reason: 'unknown' });
  }

  const ip = event.headers['x-nf-client-connection-ip'] ||
             (event.headers['x-forwarded-for'] || '').split(',')[0].trim();

  const attributes = {
    OPTIN_QUELLE: 'Repermission 2026',
    'DOUBLE_OPT-IN': '1',
    RP_BESTAETIGT: new Date().toISOString().slice(0, 10) + (ip ? ' / ' + ip : ''),
  };
  if (data.firstName) attributes.VORNAME  = String(data.firstName).slice(0, 80);
  if (data.lastName)  attributes.NACHNAME = String(data.lastName).slice(0, 80);

  const update = async (attrs) => fetch(
    'https://api.brevo.com/v3/contacts/' + encodeURIComponent(email),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        attributes: attrs,
        listIds: [LIST_NEWSLETTER],
        unlinkListIds: [LIST_REPERMISSION],
      }),
    }
  );

  let res = await update(attributes);

  // Faellt zurueck, solange RP_BESTAETIGT in Brevo noch nicht angelegt ist
  if (!res.ok) {
    const detail = await res.text();
    console.warn('Repermission update failed, retry without RP_BESTAETIGT', res.status, detail);
    const { RP_BESTAETIGT, ...rest } = attributes;
    res = await update(rest);
  }

  if (!res.ok) {
    console.error('Repermission update failed', res.status, await res.text());
    return json({ success: false, reason: 'update_failed' });
  }

  console.log('Repermission bestaetigt');
  return json({ success: true });
};

function json(body) {
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
