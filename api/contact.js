export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'info@daklekkagesopgelost.nl';
  const from = process.env.CONTACT_FROM_EMAIL || 'Daklekkages Opgelost <info@daklekkagesopgelost.nl>';

  if (!apiKey) {
    return response.status(503).json({ error: 'Contact form mail service is not configured' });
  }

  const body = request.body || {};
  const clean = (value) => String(value || '').trim().slice(0, 2000);
  const escapeHtml = (value) => clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const aanvraag = clean(body.aanvraag);
  const urgentie = clean(body.urgentie);
  const naam = clean(body.naam);
  const telefoon = clean(body.telefoon);
  const email = clean(body.email);
  const plaats = clean(body.plaats);
  const omschrijving = clean(body.omschrijving);

  if (!naam || !telefoon || !email || !omschrijving) {
    return response.status(400).json({ error: 'Missing required fields' });
  }

  const subject = `Aanvraag via website - ${aanvraag || 'dakinspectie'}`;
  const text = [
    'Nieuwe aanvraag via daklekkagesopgelost.nl',
    '',
    `Onderwerp: ${aanvraag || '-'}`,
    `Urgentie: ${urgentie || '-'}`,
    `Naam: ${naam}`,
    `Telefoon: ${telefoon}`,
    `E-mail: ${email}`,
    `Plaats: ${plaats || '-'}`,
    '',
    'Omschrijving:',
    omschrijving
  ].join('\n');
  const html = `
    <h2>Nieuwe aanvraag via daklekkagesopgelost.nl</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">
      <tr><td><strong>Onderwerp</strong></td><td>${escapeHtml(aanvraag || '-')}</td></tr>
      <tr><td><strong>Urgentie</strong></td><td>${escapeHtml(urgentie || '-')}</td></tr>
      <tr><td><strong>Naam</strong></td><td>${escapeHtml(naam)}</td></tr>
      <tr><td><strong>Telefoon</strong></td><td>${escapeHtml(telefoon)}</td></tr>
      <tr><td><strong>E-mail</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Plaats</strong></td><td>${escapeHtml(plaats || '-')}</td></tr>
    </table>
    <h3>Omschrijving</h3>
    <p style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:15px">${escapeHtml(omschrijving)}</p>
  `;

  const mailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject,
      text,
      html
    })
  });

  if (!mailResponse.ok) {
    return response.status(502).json({ error: 'Mail service failed' });
  }

  return response.status(200).json({ ok: true });
}
