// Netlify ruft diese Function bei jedem Formulareingang auf.
// Zustaendig nur fuer den Mitgliedsantrag: Der Hof bekommt eine Benachrichtigung,
// die antragstellende Person eine Eingangsbestaetigung. Die uebrigen Formulare
// verschicken ihre Bestaetigung bereits selbst ueber event-confirm/brevo-subscribe.

const ABSENDER = { name: 'Homa-Hof Heiligenberg e. V.', email: 'news@homa-hof-heiligenberg.de' };

const FELDER = [
  ['vorname', 'Vorname'],
  ['nachname', 'Nachname'],
  ['adresse', 'Adresse'],
  ['email', 'E-Mail'],
  ['telefon', 'Telefon'],
  ['nachricht', 'Nachricht'],
];

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function senden(apiKey, { to, subject, html }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ sender: ABSENDER, to, subject, htmlContent: html }),
  });
  const body = await res.text();
  console.log('Brevo', subject, res.status, body.slice(0, 200));
  return res.ok;
}

function rahmen(inhalt) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#ECE0CF;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ECE0CF">
<tr><td align="center" style="padding:40px 10px;">
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
         style="width:600px;max-width:600px;background:#FCF8F1;border:1px solid #E3D6C2;border-radius:14px;">
    <tr><td style="padding:40px 48px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;
                   font-size:15px;line-height:26px;color:#5A4F43;">${inhalt}</td></tr>
  </table>
  <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;">
    <tr><td align="center" style="padding:24px 48px 0;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;
                                  font-size:12px;line-height:20px;color:#9A8E7D;">
      <strong style="color:#5A4F43;">Homa-Hof Heiligenberg e.&nbsp;V.</strong><br />
      Oberhaslach 6 &middot; 88633 Heiligenberg<br />
      <a href="mailto:info@homa-hof-heiligenberg.de" style="color:#9A8E7D;">info@homa-hof-heiligenberg.de</a>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

exports.handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  if (!payload || payload.form_name !== 'foerdermitglied') {
    return { statusCode: 200, body: 'ignoriert' };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY fehlt – Mitgliedsantrag konnte nicht gemeldet werden');
    return { statusCode: 200, body: 'not configured' };
  }

  const d = payload.data || {};
  const intern = process.env.ANTRAG_EMPFAENGER || 'info@homa-hof-heiligenberg.de';
  const name = [d.vorname, d.nachname].filter(Boolean).join(' ').trim() || 'ohne Namen';

  // Anhang: Netlify legt Datei-Uploads als Objekt mit url ab
  const datei = d['antrag-pdf'];
  const dateiZeile = datei && datei.url
    ? `<tr><td style="padding:6px 0;color:#9A8E7D;width:130px;">Antrag</td>
         <td style="padding:6px 0;"><a href="${esc(datei.url)}" style="color:#C0531D;">${esc(datei.filename || 'Datei öffnen')}</a></td></tr>`
    : `<tr><td style="padding:6px 0;color:#9A8E7D;width:130px;">Antrag</td>
         <td style="padding:6px 0;color:#9A8E7D;">keine Datei hochgeladen</td></tr>`;

  const zeilen = FELDER
    .filter(([k]) => String(d[k] || '').trim())
    .map(([k, label]) =>
      `<tr><td style="padding:6px 0;color:#9A8E7D;width:130px;vertical-align:top;">${label}</td>
           <td style="padding:6px 0;">${esc(d[k]).replace(/\n/g, '<br>')}</td></tr>`)
    .join('');

  // 1 — Benachrichtigung an den Hof
  await senden(apiKey, {
    to: [{ email: intern }],
    subject: `Neuer Mitgliedsantrag von ${name}`,
    html: rahmen(`
      <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C0531D;">
        &#10070;&nbsp;&nbsp;Mitgliedsantrag
      </div>
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:34px;
                 font-weight:400;color:#33291F;margin:12px 0 20px;">${esc(name)} möchte dabei sein</h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:15px;">
        ${zeilen}${dateiZeile}
      </table>
      <p style="margin:26px 0 0;font-size:13px;color:#9A8E7D;">
        Eingegangen über das Formular auf homa-hof-heiligenberg.de/mitmachen.
        Die antragstellende Person hat bereits eine Eingangsbestätigung erhalten.
      </p>`),
  });

  // 2 — Eingangsbestätigung an die antragstellende Person
  if (String(d.email || '').includes('@')) {
    await senden(apiKey, {
      to: [{ email: d.email, name }],
      subject: 'Dein Mitgliedsantrag ist angekommen',
      html: rahmen(`
        <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C0531D;">
          &#10070;&nbsp;&nbsp;Mitgliedsantrag
        </div>
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:34px;
                   font-weight:400;color:#33291F;margin:12px 0 20px;">
          ${d.vorname ? 'Danke, ' + esc(d.vorname) + ' –' : 'Danke –'}<br />dein Antrag ist da</h1>
        <p style="margin:0 0 16px;">
          Wir haben deinen Mitgliedsantrag erhalten und schauen ihn uns in Ruhe an.
          Du hörst so bald wie möglich von uns.
        </p>
        <p style="margin:0;">
          Wenn sich in der Zwischenzeit etwas ändert oder du noch etwas ergänzen möchtest,
          antworte einfach auf diese E-Mail.
        </p>`),
    });
  }

  return { statusCode: 200, body: 'ok' };
};
