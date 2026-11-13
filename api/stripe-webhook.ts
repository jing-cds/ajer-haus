// api/stripe-webhook.ts
// Vercel Serverless Function — the authoritative source of truth for order
// state. Stripe Checkout only tells the customer's browser "it worked";
// this webhook is what actually creates the Order and converts the stock
// reservation (or releases it back to stock if the customer never
// completes payment).
//
// IMPORTANT — raw body handling: Stripe's signature verification needs the
// exact, unparsed request bytes. We never touch `req.body` in this file —
// see getRawBody() below, which also transparently supports the local
// `astro dev` middleware (astro.config.mjs), which stashes the unparsed
// bytes on `req.rawBody` for this one route instead of JSON-parsing them.

import { DeliveryMethod } from '@prisma/client';
import defaultPrisma from '../src/lib/prisma.js';
import defaultStripe from '../src/lib/stripe.js';
import { releaseReservation, markReservationConverted } from '../src/lib/inventory.js';
import { sendJson } from '../src/lib/apiHelper.js';
import { sign } from '../src/lib/signedToken.js';
import { getSiteOrigin } from '../src/lib/siteOrigin.js';
import { generateOrderNumber } from '../src/lib/orderNumber.js';
import { FROM_EMAIL, orderConfirmationEmail } from '../src/lib/emailTemplate.js';
import { decodeOrderIntake } from '../src/lib/orderIntake.js';

const ORDER_LOOKUP_TOKEN_TTL_SECONDS = 180 * 24 * 60 * 60;
const MAX_ORDER_NUMBER_ATTEMPTS = 5;

function getRawBody(req: any): Promise<Buffer> {
  if (Buffer.isBuffer(req.rawBody)) return Promise.resolve(req.rawBody);
  if (typeof req.rawBody === 'string') return Promise.resolve(Buffer.from(req.rawBody));
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function sendOrderConfirmationEmail({
  email,
  orderId,
  orderNumber,
  totalCents,
  currency,
  items,
  deliveryMethodLabel,
  deliveryFeeCents,
  deliveryAddress,
}: {
  email: string;
  orderId: string;
  orderNumber: string;
  totalCents: number;
  currency: string;
  items: Array<{ name: string; quantity: number }>;
  deliveryMethodLabel: string;
  deliveryFeeCents: number;
  deliveryAddress: { line1: string; line2?: string | null; suburb: string; postcode: string } | null;
}) {
  const lookupToken = sign({ kind: 'order-lookup', orderId }, ORDER_LOOKUP_TOKEN_TTL_SECONDS);
  const lookupLink = `${getSiteOrigin()}/order/lookup?token=${encodeURIComponent(lookupToken)}`;

  if (!process.env.RESEND_API_KEY) {
    console.log('[stripe-webhook] Dev/mock order confirmation email:', { email, orderNumber, lookupLink });
    return;
  }
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { html, text } = orderConfirmationEmail({
      orderNumber,
      totalCents,
      currency,
      lookupLink,
      items,
      deliveryMethodLabel,
      deliveryFeeCents,
      deliveryAddress,
    });
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your Ajer Haus order ${orderNumber} is confirmed`,
      html,
      text,
    });
    if (result.error) {
      console.warn('[stripe-webhook] Order confirmation email failed to send:', result.error);
    }
  } catch (err) {
    console.warn('[stripe-webhook] Order confirmation email threw:', err);
  }
}

/**
 * Handles `checkout.session.completed` — payment succeeded. Creates the
 * Customer (find-or-create by email), the Order + one OrderItem, and the
 * Payment record, then converts the stock Reservation. Idempotent on
 * `Payment.providerPaymentId`, so a Stripe retry of the same event is a
 * safe no-op.
 */
async function handleCheckoutCompleted(prisma: any, session: any) {
  const intake = decodeOrderIntake(session.metadata);
  const { reservationId, productId, batchId, quantity, recipientName, deliveryMethod, deliveryFeeCents, address, marketingOptIn } = intake;
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

  if (!paymentIntentId) {
    console.error('[stripe-webhook] checkout.session.completed with no payment_intent id, session:', session.id);
    return;
  }

  // Idempotency guard: if we've already recorded this PaymentIntent, this
  // is a Stripe webhook retry (or a race with another delivery) — no-op.
  const existingPayment = await prisma.payment.findUnique({ where: { providerPaymentId: paymentIntentId } });
  if (existingPayment) {
    console.log('[stripe-webhook] Payment already recorded, skipping:', paymentIntentId);
    return;
  }

  const email = session.customer_details?.email || session.customer_email;
  if (!email) {
    console.error('[stripe-webhook] checkout.session.completed with no customer email, session:', session.id);
    return;
  }

  const totalCents = session.amount_total ?? 0;
  const currency = (session.currency || 'aud').toUpperCase();
  const subtotalCents = totalCents - deliveryFeeCents;

  let orderItemsForEmail: Array<{ name: string; quantity: number }> = [];
  let deliveryAddressForEmail: { line1: string; line2?: string | null; suburb: string; postcode: string } | null = null;

  const order = await prisma.$transaction(async (tx: any) => {
    const customer = await tx.customer.upsert({
      where: { email },
      update: {
        name: recipientName || undefined,
        ...(marketingOptIn ? { marketingOptIn: true } : {}),
      },
      create: { email, name: recipientName || null, marketingOptIn },
    });

    // Bag drawer's "keep me posted" opt-in, carried through as Checkout
    // Session metadata — never touches unsubscribedAt, same rule
    // src/server/subscribe.ts follows, so a buyer who previously
    // unsubscribed isn't silently resubscribed just because they bought
    // something.
    if (marketingOptIn) {
      await tx.subscriber.upsert({
        where: { email },
        update: { name: recipientName || undefined, source: 'checkout' },
        create: { email, name: recipientName || null, source: 'checkout' },
      });
    }

    let deliveryAddressId: string | null = null;
    if (deliveryMethod === 'delivery' && address) {
      const createdAddress = await tx.address.create({
        data: {
          customerId: customer.id,
          recipientName: recipientName || 'Unknown',
          line1: address.line1,
          suburb: address.suburb,
          postcode: address.postcode,
        },
      });
      deliveryAddressId = createdAddress.id;
      deliveryAddressForEmail = { line1: createdAddress.line1, suburb: createdAddress.suburb, postcode: createdAddress.postcode };
    }

    // Retry on a rare orderNumber collision (six random digits — see
    // src/lib/orderNumber.ts) rather than relying on luck alone.
    // OrderIntake.deliveryMethod stays lowercase ('delivery'/'pickup') to
    // match the rest of the checkout vocabulary (src/lib/schemas/
    // checkout.ts, src/lib/delivery.ts) — Prisma's DeliveryMethod enum is
    // uppercase, so that translation happens right here, at the one place
    // that writes it. Previously the raw lowercase value was passed
    // straight through: every real checkout failed this write (caught by
    // Prisma's enum validation), rolling back the whole transaction — the
    // mocked unit test never caught it because its fake tx.order.create
    // doesn't validate against the real schema.
    const prismaDeliveryMethod = deliveryMethod === 'pickup' ? DeliveryMethod.PICKUP : DeliveryMethod.DELIVERY;
    let order: any = null;
    for (let attempt = 0; attempt < MAX_ORDER_NUMBER_ATTEMPTS; attempt++) {
      try {
        order = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customerId: customer.id,
            status: 'PAID',
            deliveryMethod: prismaDeliveryMethod,
            deliveryAddressId,
            subtotalCents,
            deliveryFeeCents,
            totalCents,
            currency,
            idempotencyKey: session.id,
          },
        });
        break;
      } catch (err: any) {
        if (err?.code === 'P2002' && attempt < MAX_ORDER_NUMBER_ATTEMPTS - 1) continue;
        throw err;
      }
    }

    if (productId && batchId && quantity > 0) {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (product) {
        orderItemsForEmail = [{ name: product.name, quantity }];
        const unitPriceCents = Math.round(subtotalCents / quantity);
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId,
            batchId,
            quantity,
            unitPriceCents,
            lineTotalCents: subtotalCents,
          },
        });
      }
    }

    await tx.payment.create({
      data: {
        orderId: order.id,
        providerPaymentId: paymentIntentId,
        status: 'SUCCEEDED',
        amountCents: totalCents,
        currency,
        rawPayload: session,
      },
    });

    if (reservationId) {
      await markReservationConverted(tx, reservationId);
    }

    return order;
  });

  await sendOrderConfirmationEmail({
    email,
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalCents,
    currency,
    items: orderItemsForEmail,
    deliveryMethodLabel: deliveryMethod === 'pickup' ? 'Pickup (Melbourne CBD)' : 'Delivery (Victoria)',
    deliveryFeeCents,
    deliveryAddress: deliveryAddressForEmail,
  }).catch(() => {});
}

/**
 * Handles `checkout.session.expired` — the customer never completed
 * payment within the hold window. Releases the reservation back to
 * available stock.
 */
async function handleCheckoutExpired(session: any) {
  const reservationId = session.metadata?.reservationId;
  if (!reservationId) return;
  await releaseReservation(reservationId);
  console.log(`[stripe-webhook] Released reservation ${reservationId} from expired session ${session.id}`);
}

export default async function handler(req: any, res: any, deps: { prisma?: any; stripe?: any } = {}): Promise<any> {
  const prisma = deps.prisma ?? defaultPrisma;
  const stripe = deps.stripe ?? defaultStripe;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (!stripe) {
    console.error('[stripe-webhook] Stripe is not configured (missing STRIPE_SECRET_KEY).');
    return sendJson(res, 503, { error: 'Not configured' });
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return sendJson(res, 503, { error: 'Not configured' });
  }
  if (!prisma) {
    console.error('[stripe-webhook] Prisma is not configured (missing DATABASE_URL).');
    return sendJson(res, 503, { error: 'Not configured' });
  }

  const signature = req.headers['stripe-signature'];
  let event: any;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err instanceof Error ? err.message : err);
    return sendJson(res, 400, { error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(prisma, event.data.object);
        break;
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object);
        break;
      default:
        // Unhandled event types are fine to ignore — Stripe considers a
        // 2xx response "delivered" regardless of whether we acted on it.
        break;
    }
  } catch (err) {
    console.error(`[stripe-webhook] Error handling ${event.type}:`, err);
    // Return 500 so Stripe retries — the DB write may be transiently down.
    return sendJson(res, 500, { error: 'Webhook handler error' });
  }

  return sendJson(res, 200, { received: true });
}
