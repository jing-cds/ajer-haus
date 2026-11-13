// src/server/contact.ts
// The "Say hello." modal's message form. No database row — this just
// relays the message to the Ajer Haus inbox via Resend, same as
// src/server/subscribe.ts's confirmation email but with no Subscriber
// upsert of its own (a contact message is not a newsletter signup).
import { ContactSchema } from '../lib/schemas/contact.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { formatZodError, sendJson, parseRequestBody } from '../lib/apiHelper.js';
import { FROM_EMAIL, contactMessageEmail } from '../lib/emailTemplate.js';

const CONTACT_INBOX = process.env.CONTACT_INBOX_EMAIL || 'hello@ajerhaus.com';

export default async function handler(req: any, res: any): Promise<any> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const rateResult = checkRateLimit(req, { limit: 5, windowMs: 60000, prefix: 'contact' });
  if (!rateResult.success) {
    res.setHeader('Retry-After', Math.ceil((rateResult.resetTime - Date.now()) / 1000).toString());
    return sendJson(res, 429, { error: 'Too many requests. Please wait a moment before trying again.' });
  }

  const rawBody = parseRequestBody(req);
  if (rawBody._gotcha) {
    // Honeypot tripped — pretend success so the bot doesn't learn anything.
    return sendJson(res, 200, { ok: true });
  }

  const parseResult = ContactSchema.safeParse(rawBody);
  if (!parseResult.success) {
    const formatted = formatZodError(parseResult.error);
    return sendJson(res, 400, { error: formatted.message, fieldErrors: formatted.fieldErrors });
  }

  const { name, email, topic, message } = parseResult.data;

  if (!process.env.RESEND_API_KEY) {
    console.log('[Dev/Mock] Contact message recorded:', { name, email, topic, message });
    return sendJson(res, 200, { ok: true });
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { html, text } = contactMessageEmail({ name, email, topic, message });
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `Contact: ${topic} — ${name}`,
      html,
      text,
    });
  } catch (emailErr) {
    console.error('[contact] Failed to send message email:', emailErr);
    return sendJson(res, 500, { error: 'Unable to send your message. Please try again shortly, or email hello@ajerhaus.com directly.' });
  }

  return sendJson(res, 200, { ok: true });
}
