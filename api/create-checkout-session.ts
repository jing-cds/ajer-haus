// api/create-checkout-session.ts
// Vercel Serverless Function — starts a Stripe Checkout (hosted) session
// for the current live batch of a product. Never trusts a client-sent
// price: the amount charged always comes from Product.priceCents in the
// database, looked up by slug, at the moment the session is created.
//
// Unlike Unstitch (which collects the shipping address on Stripe's own
// hosted page via shipping_address_collection), Ajer Haus's existing cart
// drawer (src/components/SiteOverlays.jsx) already collects name/address/
// postcode itself before this call — so that address is trusted and passed
// straight through to Stripe as metadata rather than asked for twice.

import { CreateCheckoutSessionSchema } from '../src/lib/schemas/checkout.js';
import { checkRateLimit } from '../src/lib/rateLimit.js';
import { formatZodError, sendJson, parseRequestBody } from '../src/lib/apiHelper.js';
import defaultPrisma from '../src/lib/prisma.js';
import defaultStripe from '../src/lib/stripe.js';
import { reserveStockForBatch, releaseReservation, InsufficientStockError, BatchNotFoundError } from '../src/lib/inventory.js';
import { getSiteOrigin } from '../src/lib/siteOrigin.js';
import { resolveDeliveryFeeCents, OutOfDeliveryAreaError } from '../src/lib/delivery.js';
import { encodeOrderIntakeMetadata } from '../src/lib/orderIntake.js';

// Checkout Sessions get a 30-minute hold on the reserved stock — Stripe's
// documented minimum for `expires_at`. Long enough to actually enter card
// details, short enough that a walked-away customer doesn't tie up real
// stock on a small batch for long.
const SESSION_HOLD_SECONDS = 30 * 60;

export default async function handler(req: any, res: any, deps: { prisma?: any; stripe?: any } = {}): Promise<any> {
  const prisma = deps.prisma ?? defaultPrisma;
  const stripe = deps.stripe ?? defaultStripe;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const rateResult = checkRateLimit(req, { limit: 12, windowMs: 60000, prefix: 'checkout' });
  if (!rateResult.success) {
    res.setHeader('Retry-After', Math.ceil((rateResult.resetTime - Date.now()) / 1000).toString());
    return sendJson(res, 429, { error: 'Too many requests. Please wait a moment before trying again.' });
  }

  if (!prisma) {
    console.error('[create-checkout-session] Prisma is not configured (missing DATABASE_URL).');
    return sendJson(res, 503, { error: 'The store is temporarily unavailable. Please try again shortly.' });
  }
  if (!stripe) {
    console.error('[create-checkout-session] Stripe is not configured (missing STRIPE_SECRET_KEY).');
    return sendJson(res, 503, { error: 'Checkout is temporarily unavailable. Please try again shortly.' });
  }

  const rawBody = parseRequestBody(req);
  const parseResult = CreateCheckoutSessionSchema.safeParse(rawBody);
  if (!parseResult.success) {
    const formatted = formatZodError(parseResult.error);
    return sendJson(res, 400, { error: formatted.message, fieldErrors: formatted.fieldErrors });
  }
  const { slug, quantity, name, email, method, address, suburb, postcode, marketingOptIn } = parseResult.data;

  if (method === 'delivery' && !address) {
    return sendJson(res, 400, { error: 'Please add your street address.' });
  }
  if (method === 'delivery' && !suburb) {
    return sendJson(res, 400, { error: 'Please add your suburb.' });
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { batches: { where: { status: 'LIVE' }, orderBy: { releaseAt: 'asc' }, take: 1 } },
  });
  if (!product || !product.isActive) {
    return sendJson(res, 404, { error: 'That product is not available.' });
  }
  const batch = product.batches[0];
  if (!batch) {
    return sendJson(res, 409, { error: 'This batch is not currently live.' });
  }

  const subtotalCents = product.priceCents * quantity;
  let deliveryFeeCents: number;
  try {
    deliveryFeeCents = resolveDeliveryFeeCents(method, postcode, subtotalCents);
  } catch (err) {
    if (err instanceof OutOfDeliveryAreaError) {
      return sendJson(res, 400, {
        error: 'We currently deliver within Victoria only (postcodes 3000–3999). Email hello@ajerhaus.com if you are elsewhere.',
      });
    }
    throw err;
  }

  let reservation;
  try {
    reservation = await reserveStockForBatch(batch.id, quantity, SESSION_HOLD_SECONDS);
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return sendJson(res, 409, {
        error: err.available > 0 ? `Only ${err.available} left in this batch.` : 'This batch is sold out.',
      });
    }
    if (err instanceof BatchNotFoundError) {
      return sendJson(res, 404, { error: 'That product is not available.' });
    }
    console.error('[create-checkout-session] Reservation failed:', err);
    return sendJson(res, 500, { error: 'Unable to reserve stock. Please try again.' });
  }

  const origin = getSiteOrigin(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: { name: product.name, description: product.tagline || undefined },
            unit_amount: product.priceCents,
          },
          quantity,
        },
        ...(deliveryFeeCents > 0
          ? [
              {
                price_data: {
                  currency: product.currency.toLowerCase(),
                  product_data: { name: 'Delivery (Victoria)' },
                  unit_amount: deliveryFeeCents,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      customer_email: email,
      expires_at: Math.floor(Date.now() / 1000) + SESSION_HOLD_SECONDS,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/cancelled`,
      metadata: encodeOrderIntakeMetadata({
        reservationId: reservation.id,
        productId: product.id,
        batchId: batch.id,
        quantity,
        recipientName: name,
        deliveryMethod: method,
        deliveryFeeCents,
        address: method === 'delivery' ? { line1: address || '', suburb: suburb || '', postcode: postcode || '' } : null,
        marketingOptIn: !!marketingOptIn,
      }),
    });

    return sendJson(res, 200, { url: session.url });
  } catch (err) {
    // The Checkout Session was never created (or Stripe rejected it) — the
    // reservation would otherwise sit ACTIVE until it naturally expires.
    // Release it immediately rather than waiting on checkout.session.expired,
    // which will never fire for a session that doesn't exist.
    await releaseReservation(reservation.id).catch((releaseErr) => {
      console.error('[create-checkout-session] Failed to release reservation after Stripe error:', releaseErr);
    });
    console.error('[create-checkout-session] Stripe session creation failed:', err);
    return sendJson(res, 500, { error: 'Unable to start checkout. Please try again.' });
  }
}
