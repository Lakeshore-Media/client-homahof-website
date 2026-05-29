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

  const { email, firstName, lastName } = data;
  if (!email) return { statusCode: 400, body: 'Email required' };

  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LIST_ID || '0', 10);
  if (!apiKey) {
    console.error('BREVO_API_KEY not set');
    return { statusCode: 200, body: JSON.stringify({ success: false, reason: 'not configured' }) };
  }

  const attributes = {};
  if (firstName) attributes.FIRSTNAME = firstName;
  if (lastName)  attributes.LASTNAME  = lastName;

  const payload = {
    email,
    updateEnabled: true,
    ...(Object.keys(attributes).length && { attributes }),
    ...(listId && { listIds: [listId] }),
  };

  console.log('Brevo payload:', JSON.stringify(payload));

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(payload),
    });

    const body = await res.text();
    console.log('Brevo response:', res.status, body);

    // 201 = neu angelegt, 204 = aktualisiert
    if (res.status === 201 || res.status === 204) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: false, status: res.status, detail: body }) };
  } catch (e) {
    console.error('Brevo fetch failed', e.message);
    return { statusCode: 200, body: JSON.stringify({ success: false }) };
  }
};
