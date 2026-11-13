// src/server/subscribe.ts
// Newsletter + per-scent "notify me when it's poured" signup. One shared
// Subscriber model for both (see prisma/schema.prisma), same upsert shape
// Unstitch uses: a repeat signup never silently reverses an earlier
// unsubscribe, and switching to a different scent's waitlist resets
// notifiedAt so they're eligible for that scent's notification.
import { SubscribeSchema } from '../lib/schemas/subscribe.js';
import { checkRateLimit } from '../lib/rateLimit.js';
import { formatZodError, sendJson, parseRequestBody } from '../lib/apiHelper.js';
import defaultPrisma from '../lib/prisma.js';
import { sign } from '../lib/signedToken.js';
import { getSiteOrigin } from '../lib/siteOrigin.js';
import { FROM_EMAIL, notifyMeConfirmationEmail } from '../lib/emailTemplate.js';

const UNSUBSCRIBE_TOKEN_TTL_SECONDS = 365 * 24 * 60 * 60;

// `deps.prisma` defaults to the real singleton — passed explicitly only by
// a caller (or test) that wants a real injected client instead of
// vi.mock-ing this whole module.
export default async function handler(req: any, res: any, deps: { prisma?: any } = {}): Promise<any> {
  const prisma = deps.prisma ?? defaultPrisma;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const rateResult = checkRateLimit(req, { limit: 10, windowMs: 60000, prefix: 'subscribe' });
  if (!rateResult.success) {
    res.setHeader('Retry-After', Math.ceil((rateResult.resetTime - Date.now()) / 1000).toString());
    return sendJson(res, 429, { error: 'Too many requests. Please wait a moment before trying again.' });
  }

  const rawBody = parseRequestBody(req);
  if (rawBody._gotcha) {
    // Honeypot tripped — pretend success so the bot doesn't learn anything.
    return sendJson(res, 200, { ok: true });
  }

  const parseResult = SubscribeSchema.safeParse(rawBody);
  if (!parseResult.success) {
    const formatted = formatZodError(parseResult.error);
    return sendJson(res, 400, { error: formatted.message, fieldErrors: formatted.fieldErrors });
  }

  const { email, name, source, productSlug } = parseResult.data;

  if (!prisma) {
    console.log('[Dev/Mock] Subscriber recorded:', { email, name, source, productSlug });
    return sendJson(res, 200, { ok: true });
  }

  let product: { id: string; name: string } | null = null;
  try {
    if (productSlug) {
      product = await prisma.product.findUnique({ where: { slug: productSlug }, select: { id: true, name: true } });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email }, select: { productId: true } });
    const isSwitchingWaitlist = !!product && existing && existing.productId !== product.id;

    await prisma.subscriber.upsert({
      where: { email },
      update: {
        name: name || undefined,
        source: source || undefined,
        productId: product?.id || undefined,
        ...(isSwitchingWaitlist ? { notifiedAt: null } : {}),
      },
      create: {
        name: name || null,
        email,
        source: source || null,
        productId: product?.id || null,
      },
    });
  } catch (dbErr) {
    console.error('[subscribe] Database upsert error:', dbErr);
    return sendJson(res, 500, { error: 'Unable to save subscription. Please try again shortly.' });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const unsubscribeToken = sign({ kind: 'unsubscribe', email }, UNSUBSCRIBE_TOKEN_TTL_SECONDS);
      const unsubscribeLink = `${getSiteOrigin(req)}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
      const { html, text } = notifyMeConfirmationEmail({ productName: product?.name || 'the next place' });
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: product ? `You're on the list for ${product.name}` : "You're on the Ajer Haus list",
        html: `${html}<p style="font-size:11px;color:#999;margin-top:16px;"><a href="${unsubscribeLink}">Unsubscribe</a></p>`,
        text: `${text}\n\nUnsubscribe: ${unsubscribeLink}`,
      });
    } catch (emailErr) {
      console.warn('[subscribe] Confirmation email failed to send:', emailErr);
    }
  }

  return sendJson(res, 200, { ok: true });
}
