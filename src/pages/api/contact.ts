import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, phone, subject, catalogNumber, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return new Response(
          JSON.stringify({ error: 'Všetky povinné polia sú povinné' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Martin Diesel – Dopyt <noreply@ferkomedia.sk>',
      to: [import.meta.env.CONTACT_EMAIL || 'info@martindiesel.sk'],
      subject: `[Dopyt] ${subject}`,
      replyTo: email,
      html: `
        <h2>Nový dopyt z webu martindiesel.sk</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Meno / Firma</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Email</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${email}</td></tr>
          ${phone ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Telefón</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${phone}</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Predmet</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${subject}</td></tr>
          ${catalogNumber ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Katalógové číslo</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${catalogNumber}</td></tr>` : ''}
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
