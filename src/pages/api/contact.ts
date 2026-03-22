// src/pages/api/contact.ts
// ============================================================
// KONTAKTNÝ FORMULÁR API ENDPOINT
// ============================================================
// Beží na Cloudflare Workers (server-side).
// Používa Resend na odosielanie emailov.
//
// NASTAVENIE:
// 1. Zaregistruj sa na resend.com
// 2. Pridaj environment variable v Cloudflare Pages:
//    Settings → Environment variables → RESEND_API_KEY
// 3. Nastav CONTACT_EMAIL na email kam chceš dostávať správy
// ============================================================

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false; // Musí bežať server-side

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, subject, message } = await request.json();

    // Validácia
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Všetky polia sú povinné' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Inicializuj Resend
    // V Cloudflare Pages nastav env variable RESEND_API_KEY
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // Odošli email
    const { error } = await resend.emails.send({
      from: 'Kontaktný formulár <onboarding@resend.dev>', // Zmeň na svoju doménu
      to: [import.meta.env.CONTACT_EMAIL || 'tvoj@email.sk'],
      subject: `[Kontakt] ${subject}`,
      html: `
        <h2>Nová správa z kontaktného formulára</h2>
        <p><strong>Meno:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Predmet:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
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
