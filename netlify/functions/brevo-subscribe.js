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

  const { email, firstName, lastName, interests } = data;
  if (!email) return { statusCode: 400, body: 'Email required' };

  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LIST_ID || '0', 10);
  const templateId = parseInt(process.env.BREVO_DOI_TEMPLATE_ID || '1', 10);
  const redirectionUrl = process.env.BREVO_DOI_REDIRECT_URL || 'https://homahof-design-2026-website.netlify.app/newsletter-bestaetigt';

  if (!apiKey || !listId) {
    console.error('BREVO_API_KEY or BREVO_LIST_ID not set');
    return { statusCode: 200, body: JSON.stringify({ success: false, reason: 'not configured' }) };
  }

  const attributes = {};
  if (firstName) attributes.FIRSTNAME = firstName;
  if (lastName)  attributes.LASTNAME  = lastName;
  if (Array.isArray(interests)) {
    if (interests.includes('seminare'))  attributes.INT_SEMINARE  = true;
    if (interests.includes('hof'))       attributes.INT_HOF       = true;
    if (interests.includes('agnihotra')) attributes.INT_AGNIHOTRA = true;
  }

  const payload = {
    email,
    includeListIds: [listId],
    templateId,
    redirectionUrl,
    ...(Object.keys(attributes).length && { attributes }),
  };

  console.log('Brevo DOI payload:', JSON.stringify(payload));

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(payload),
    });

    const body = await res.text();
    console.log('Brevo DOI response:', res.status, body);

    // 204 = DOI-Mail erfolgreich ausgelöst
    if (res.status === 204) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: false, status: res.status, detail: body }) };
  } catch (e) {
    console.error('Brevo DOI fetch failed', e.message);
    return { statusCode: 200, body: JSON.stringify({ success: false }) };
  }
};
