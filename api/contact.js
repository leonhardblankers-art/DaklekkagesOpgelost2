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

  const confirmationSubject = 'We hebben uw aanvraag ontvangen';
  const confirmationText = [
    `Beste ${naam},`,
    '',
    'Bedankt voor uw aanvraag via Daklekkages Opgelost. We hebben uw bericht goed ontvangen.',
    '',
    'Samenvatting van uw aanvraag:',
    `Onderwerp: ${aanvraag || '-'}`,
    `Urgentie: ${urgentie || '-'}`,
    `Plaats: ${plaats || '-'}`,
    '',
    'Een medewerker bekijkt uw situatie en neemt zo snel mogelijk contact met u op. Bij spoed kunt u ons direct bellen via 085 130 82 51.',
    'Voor vragen zijn we ook bereikbaar via WhatsApp: 06 232 939 35.',
    '',
    'Met vriendelijke groet,',
    'Daklekkages Opgelost'
  ].join('\n');
  const confirmationHtml = `
    <div style="margin:0;padding:0;background:#f4f8f6;font-family:Arial,sans-serif;color:#0b0d10">
      <div style="max-width:640px;margin:0 auto;padding:28px 16px">
        <div style="overflow:hidden;border-radius:22px;background:#ffffff;border:1px solid #dce8e2;box-shadow:0 18px 45px rgba(15,17,21,.08)">
          <div style="padding:22px 24px;background:#1D9753;color:#ffffff">
            <div style="font-size:13px;font-weight:700;letter-spacing:.2px;opacity:.92">Daklekkages Opgelost</div>
            <h1 style="margin:8px 0 0;font-size:26px;line-height:1.18">We hebben uw aanvraag ontvangen</h1>
          </div>
          <div style="padding:24px">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.7">Beste ${escapeHtml(naam)},</p>
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7">Bedankt voor uw aanvraag. We hebben uw bericht goed ontvangen en bekijken welke vervolgstap logisch is voor uw dak.</p>

            <div style="margin:20px 0;padding:18px;border-radius:16px;background:#f3faf6;border:1px solid #cbeedd">
              <div style="display:inline-block;margin-bottom:10px;padding:6px 10px;border-radius:999px;background:#e3f5eb;color:#167a44;font-size:12px;font-weight:800">Samenvatting</div>
              <table cellpadding="7" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px;line-height:1.5">
                <tr><td style="width:120px;color:#516071"><strong>Onderwerp</strong></td><td>${escapeHtml(aanvraag || '-')}</td></tr>
                <tr><td style="color:#516071"><strong>Urgentie</strong></td><td>${escapeHtml(urgentie || '-')}</td></tr>
                <tr><td style="color:#516071"><strong>Plaats</strong></td><td>${escapeHtml(plaats || '-')}</td></tr>
              </table>
            </div>

            <p style="margin:0 0 18px;font-size:16px;line-height:1.7">Een medewerker neemt zo snel mogelijk contact met u op. Bij spoed kunt u ons direct bellen.</p>

            <div style="display:block;margin:22px 0">
              <a href="tel:0851308251" style="display:inline-block;margin:0 8px 10px 0;padding:12px 16px;border-radius:12px;background:#1D9753;color:#ffffff;text-decoration:none;font-weight:800">Bel 085 130 82 51</a>
              <a href="https://wa.me/31623293935" style="display:inline-block;margin:0 0 10px 0;padding:12px 16px;border-radius:12px;background:#ff7a00;color:#ffffff;text-decoration:none;font-weight:800">WhatsApp 06 232 939 35</a>
            </div>

            <p style="margin:18px 0 0;color:#516071;font-size:14px;line-height:1.7">U hoeft deze mail niet te beantwoorden, maar dat mag natuurlijk wel. Bij vragen kunt u ook WhatsApp gebruiken via <a href="https://wa.me/31623293935" style="color:#1D9753;font-weight:800">06 232 939 35</a>.</p>
            <p style="margin:22px 0 0;font-size:16px;line-height:1.7">Met vriendelijke groet,<br><strong>Daklekkages Opgelost</strong></p>
          </div>
        </div>
      </div>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: email,
      reply_to: to,
      subject: confirmationSubject,
      text: confirmationText,
      html: confirmationHtml
    })
  });

  return response.status(200).json({ ok: true });
}
