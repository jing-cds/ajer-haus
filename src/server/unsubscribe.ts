// src/server/unsubscribe.ts
// GET ?token=... -> verifies a signed unsubscribe token (src/lib/
// signedToken.ts, kind: 'unsubscribe') and sets Subscriber.unsubscribedAt.
// GET rather than POST so the link works as a plain click from an email
// client with no JS/form involved.
import { sendJson } from '../lib/apiHelper.js';
import { verify } from '../lib/signedToken.js';
import defaultPrisma from '../lib/prisma.js';

export default async function handler(req: any, res: any, deps: { prisma?: any } = {}): Promise<any> {
  const prisma = deps.prisma ?? defaultPrisma;
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  if (!prisma) return sendJson(res, 503, { error: 'Not configured' });

  const { searchParams } = new URL(req.url, 'http://placeholder.local');
  const token = searchParams.get('token');
  if (!token) return sendJson(res, 400, { error: 'Missing token.' });

  const payload = verify(token);
  if (!payload || payload.kind !== 'unsubscribe' || !payload.email) {
    return sendJson(res, 401, { error: 'This unsubscribe link is invalid or has expired.' });
  }

  try {
    await prisma.subscriber.update({
      where: { email: payload.email },
      data: { unsubscribedAt: new Date() },
    });
  } catch (err: any) {
    // P2025 = row no longer exists, which still means "not subscribed" —
    // treat as success rather than surfacing an error to the clicker.
    if (err?.code !== 'P2025') {
      console.error('[unsubscribe] Failed to record unsubscribe:', err);
      return sendJson(res, 500, { error: 'Something went wrong. Please try again shortly.' });
    }
  }

  return sendJson(res, 200, { ok: true });
}
