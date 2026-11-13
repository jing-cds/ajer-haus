// src/server/admin/resource.ts
// One deep module behind the admin GET-list / POST-action pattern that
// batches.ts and orders.ts each hand-rolled identically: the admin guard,
// the "is Prisma configured" check, and POST's id-presence + action-dispatch
// shape. A third admin resource becomes config here, not a third copy.
import { requireAdmin } from '../../lib/adminAuth.js';
import { sendJson, parseRequestBody } from '../../lib/apiHelper.js';
import defaultPrisma from '../../lib/prisma.js';

/** Thrown by a GET loader or POST action to produce a 400 with `message`. */
export class AdminValidationError extends Error {}

type AdminGet = (prisma: any) => Promise<Record<string, any>>;
type AdminAction = (prisma: any, body: any) => Promise<Record<string, any>>;

export function defineAdminResource({
  idField,
  get,
  actions,
}: {
  /** The POST body field naming the row the action applies to, e.g. "batchId". */
  idField: string;
  get: AdminGet;
  actions: Record<string, AdminAction>;
}) {
  return async function handler(req: any, res: any, deps: { prisma?: any } = {}): Promise<any> {
    const prisma = deps.prisma ?? defaultPrisma;
    if (!requireAdmin(req, res)) return;
    if (!prisma) return sendJson(res, 503, { error: 'Database not configured' });

    if (req.method === 'GET') {
      try {
        return sendJson(res, 200, await get(prisma));
      } catch (err) {
        if (err instanceof AdminValidationError) return sendJson(res, 400, { error: err.message });
        throw err;
      }
    }

    if (req.method === 'POST') {
      const body = parseRequestBody(req);
      const id = body[idField];
      if (!id || typeof id !== 'string') {
        return sendJson(res, 400, { error: `${idField} is required` });
      }

      const action = actions[body.action];
      if (!action) {
        return sendJson(res, 400, { error: 'Unknown action' });
      }

      try {
        return sendJson(res, 200, await action(prisma, body));
      } catch (err) {
        if (err instanceof AdminValidationError) return sendJson(res, 400, { error: err.message });
        throw err;
      }
    }

    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  };
}
