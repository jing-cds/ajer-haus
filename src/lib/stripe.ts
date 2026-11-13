import Stripe from 'stripe';
import { loadDotEnv } from './loadDotEnv.js';

loadDotEnv();

const globalForStripe = globalThis as unknown as { stripe?: Stripe | null };

function createStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: '2026-08-26.dahlia',
  });
}

// `stripe` is null when STRIPE_SECRET_KEY isn't configured (e.g. local dev
// before keys are set up). Callers must check for null and return a
// 503-style error rather than letting this throw deep inside a request.
export const stripe = globalForStripe.stripe ?? createStripeClient();

if (process.env.NODE_ENV !== 'production' && stripe) {
  globalForStripe.stripe = stripe;
}

export default stripe;
