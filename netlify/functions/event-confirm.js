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

  const { email, vorname, eventTitle, eventDate, eventTime, eventLocation, confirmKey, newsletter } = data;
  if (!email || !eventTitle) return { statusCode: 400, body: 'email and eventTitle required' };

  const apiKey = process.env.BREVO_API_KEY;
  const templateId = parseInt(process.env.BREVO_EVENT_TEMPLATE_ID || '0', 10);

  if (!apiKey) {
    console.error('BREVO_API_KEY not set');
    return { statusCode: 200, body: JSON.stringify({ success: false, reason: 'not configured' }) };
  }

  const segmentKey = confirmKey || eventTitle;
  const displayDate = eventDate ? eventDate.split('-').reverse().join('.') : '';

  // 1 — Transaktionale Bestätigungsmail (immer, kein DOI nötig)
  if (templateId) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          to: [{ email, name: vorname || '' }],
          templateId,
          params: {
            EVENT_TITLE:    eventTitle,
            EVENT_DATE:     displayDate,
            EVENT_TIME:     eventTime    || '',
            EVENT_LOCATION: eventLocation || '',
            VORNAME:        vorname       || '',
          },
        }),
      });
      console.log('Brevo transactional:', res.status, await res.text());
    } catch (e) {
      console.error('Transactional email failed:', e.message);
    }
  } else {
    console.warn('BREVO_EVENT_TEMPLATE_ID not set – confirmation email skipped');
  }

  // 2 — Kontaktattribut LETZTE_VERANSTALTUNG setzen
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        attributes: { LETZTE_VERANSTALTUNG: segmentKey },
      }),
    });
    console.log('Brevo contact update:', res.status);
  } catch (e) {
    console.error('Contact update failed:', e.message);
  }

  // 3 — Newsletter-DOI auslösen falls gewünscht
  if (newsletter === 'ja') {
    const listId      = parseInt(process.env.BREVO_LIST_ID         || '0', 10);
    const doiTemplate = parseInt(process.env.BREVO_DOI_TEMPLATE_ID || '1', 10);
    const redirectUrl = process.env.BREVO_DOI_REDIRECT_URL || 'https://homahof-design-2026-website.netlify.app/newsletter-bestaetigt';

    if (listId) {
      try {
        const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
          body: JSON.stringify({
            email,
            includeListIds: [listId],
            templateId:     doiTemplate,
            redirectionUrl: redirectUrl,
            ...(vorname && { attributes: { FIRSTNAME: vorname } }),
          }),
        });
        console.log('Brevo DOI:', res.status);
      } catch (e) {
        console.error('DOI failed:', e.message);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
