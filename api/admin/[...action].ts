// api/admin/[...action].ts
// Catch-all dispatcher for the admin endpoints, same consolidation trick
// Unstitch uses (~/Unstitch/api/admin/[...action].ts) to keep well under
// Vercel's Hobby-plan 12-Serverless-Function cap — login/logout/orders/
// batches as one function instead of four.
import { sendJson } from '../../src/lib/apiHelper.js';
import login from '../../src/server/admin/login.js';
import logout from '../../src/server/admin/logout.js';
import orders from '../../src/server/admin/orders.js';
import batches from '../../src/server/admin/batches.js';

const ROUTES: Record<string, (req: any, res: any) => Promise<any> | any> = {
  login,
  logout,
  orders,
  batches,
};

export default async function handler(req: any, res: any): Promise<any> {
  const { pathname } = new URL(req.url, 'http://placeholder.local');
  const prefix = '/api/admin/';
  const route = pathname.startsWith(prefix) ? pathname.slice(prefix.length).split('/')[0] : '';

  const target = ROUTES[route];
  if (!target) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  return target(req, res);
}
