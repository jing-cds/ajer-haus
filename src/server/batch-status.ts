// src/server/batch-status.ts
// GET ?slug=... -> public, read-only stock status for a product's current
// batch, so the shop/collection pages can show real remaining stock instead
// of a hardcoded count.
import { sendJson } from '../lib/apiHelper.js';
import defaultPrisma from '../lib/prisma.js';
import { getAvailableStock } from '../lib/inventory.js';

export default async function handler(req: any, res: any, deps: { prisma?: any } = {}): Promise<any> {
  const prisma = deps.prisma ?? defaultPrisma;
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  if (!prisma) return sendJson(res, 503, { error: 'Not configured' });

  const { searchParams } = new URL(req.url, 'http://placeholder.local');
  const slug = searchParams.get('slug');
  if (!slug) return sendJson(res, 400, { error: 'Missing slug.' });

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { batches: { where: { status: 'LIVE' }, orderBy: { releaseAt: 'asc' }, take: 1 } },
  });
  if (!product || !product.isActive) {
    return sendJson(res, 404, { error: 'Product not found.' });
  }

  const batch = product.batches[0];
  if (!batch) {
    return sendJson(res, 200, { live: false, available: 0 });
  }

  const available = Math.max(0, await getAvailableStock(batch.id, prisma));
  return sendJson(res, 200, { live: true, available, soldOut: available <= 0 });
}
