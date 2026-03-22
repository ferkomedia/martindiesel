import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { name, email, phone, subject, catalogNumber, message, lang } = await request.json();

    if (!name || !email || !subject || !message) {
      return new Response(
          JSON.stringify({ error: 'Všetky povinné polia sú povinné' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const runtime = (locals as any).runtime;
    const apiKey = runtime?.env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    const contactEmail = runtime?.env?.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL || 'info@martindiesel.sk';

    if (!apiKey) {
      console.error('RESEND_API_KEY not found');
      return new Response(
          JSON.stringify({ error: 'Chýba konfigurácia emailu' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);
    const isPL = lang === 'pl';

    // 1. Email firme
    const { error } = await resend.emails.send({
      from: 'Martin Diesel – Dopyt <noreply@ferkomedia.sk>',
      to: [contactEmail],
      subject: `[Dopyt${isPL ? ' PL' : ''}] ${subject}`,
      replyTo: email,
      html: `
        <h2>Nový dopyt z webu martindiesel.sk ${isPL ? '(poľský zákazník)' : ''}</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Meno / Firma</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Email</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${email}</td></tr>
          ${phone ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Telefón</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${phone}</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Predmet</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${subject}</td></tr>
          ${catalogNumber ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Katalógové číslo</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${catalogNumber}</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Jazyk</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${isPL ? '🇵🇱 Poľština' : '🇸🇰 Slovenčina'}</td></tr>
        </table>
        <h3 style="margin-top:20px;">Správa:</h3>
        <p style="background:#f8fafc;padding:16px;border-radius:8px;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
          JSON.stringify({ error: 'Nepodarilo sa odoslať email' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Auto-reply zákazníkovi (SK alebo PL)
    const replySubject = isPL
        ? 'Dziękujemy za zapytanie | Martin Diesel'
        : 'Ďakujeme za váš dopyt | Martin Diesel';

    const replyBody = isPL
        ? `
        <p style="font-size:16px;">Dzień dobry <strong>${name}</strong>,</p>
        <p>dziękujemy za zapytanie. Otrzymaliśmy Państwa wiadomość i skontaktujemy się <strong>w ciągu 24 godzin</strong>.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Temat:</p>
          <p style="margin:0;font-weight:600;">${subject}</p>
          ${catalogNumber ? `<p style="margin:12px 0 4px;font-size:13px;color:#64748b;">Numer katalogowy:</p><p style="margin:0;font-weight:600;">${catalogNumber}</p>` : ''}
        </div>
        <p>W razie dodatkowych pytań prosimy o kontakt:</p>
        <p style="margin:4px 0;"><strong>Tel:</strong> +421 43 4224 130</p>
        <p style="margin:4px 0;"><strong>Email:</strong> info@martindiesel.sk</p>
        <p style="margin:4px 0;"><strong>Pn–Pt:</strong> 7:00 – 15:30</p>
      `
        : `
        <p style="font-size:16px;">Dobrý deň <strong>${name}</strong>,</p>
        <p>ďakujeme za váš dopyt. Prijali sme vašu správu a ozveme sa vám <strong>do 24 hodín</strong>.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Predmet:</p>
          <p style="margin:0;font-weight:600;">${subject}</p>
          ${catalogNumber ? `<p style="margin:12px 0 4px;font-size:13px;color:#64748b;">Katalógové číslo:</p><p style="margin:0;font-weight:600;">${catalogNumber}</p>` : ''}
        </div>
        <p>Ak máte ďalšie otázky, neváhajte nás kontaktovať:</p>
        <p style="margin:4px 0;"><strong>Tel:</strong> +421 43 4224 130</p>
        <p style="margin:4px 0;"><strong>Email:</strong> info@martindiesel.sk</p>
        <p style="margin:4px 0;"><strong>Po–Pi:</strong> 7:00 – 15:30</p>
      `;

    try {
      await resend.emails.send({
        from: 'Martin Diesel <noreply@ferkomedia.sk>',
        to: [email],
        subject: replySubject,
        replyTo: contactEmail,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e293b;">
            <div style="background:#0f172a;padding:24px 32px;border-radius:12px 12px 0 0;">
              <h1 style="color:#fff;font-size:20px;margin:0;">Martin Diesel</h1>
            </div>
            <div style="padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
              ${replyBody}
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 16px;">
              <p style="font-size:12px;color:#94a3b8;margin:0;">Martin Diesel | Langsfeldova 1, 036 01 Martin | <a href="https://martindiesel.sk" style="color:#16a34a;">martindiesel.sk</a></p>
            </div>
          </div>
        `,
      });
    } catch (replyErr) {
      console.error('Auto-reply error:', replyErr);
    }

    return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
        JSON.stringify({ error: 'Interná chyba servera' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
