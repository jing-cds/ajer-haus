// api/[...route].ts
// Catch-all dispatcher for the lighter-traffic customer-facing endpoints
// (subscribe, unsubscribe, batch-status, order-lookup), consolidated into
// one Vercel Serverless Function — same trick Unstitch uses
// (~/Unstitch/api/[...route].ts) to stay well under Vercel's Hobby-plan
// 12-function cap. Checkout and the Stripe webhook stay in their own
// standalone functions (see api/create-checkout-session.ts,
// api/stripe-webhook.ts) since those are the hot/payment-critical paths.
import { sendJson } from '../src/lib/apiHelper.js';
import subscribe from '../src/server/subscribe.js';
import unsubscribe from '../src/server/unsubscribe.js';
import batchStatus from '../src/server/batch-status.js';
import orderLookup from '../src/server/order-lookup.js';
import contact from '../src/server/contact.js';

const ROUTES: Record<string, (req: any, res: any) => Promise<any> | any> = {
  subscribe,
  unsubscribe,
  contact,
  'batch-status': batchStatus,
  'order-lookup': orderLookup,
};

export default async function handler(req: any, res: any): Promise<any> {
  const { pathname } = new URL(req.url, 'http://placeholder.local');
  const prefix = '/api/';
  const route = pathname.startsWith(prefix) ? pathname.slice(prefix.length).split('/')[0] : '';

  const target = ROUTES[route];
  if (!target) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  return target(req, res);
}
