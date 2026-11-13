// src/server/admin/batches.ts
// GET  -> list batches with product name + live available stock.
// POST -> { action: 'update-stock', batchId, totalUnits } or
//         { action: 'set-status', batchId, status }
import { BatchStatus } from '@prisma/client';
import { defineAdminResource, AdminValidationError } from './resource.js';
import { getAvailableStock } from '../../lib/inventory.js';

const VALID_STATUSES = Object.values(BatchStatus);

export default defineAdminResource({
  idField: 'batchId',

  get: async (prisma) => {
    const batches = await prisma.batch.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true, slug: true } } },
    });
    const withStock = await Promise.all(
      batches.map(async (b: any) => ({ ...b, availableStock: await getAvailableStock(b.id) }))
    );
    return { batches: withStock };
  },

  actions: {
    'update-stock': async (prisma, body) => {
      const totalUnits = Number(body.totalUnits);
      if (!Number.isInteger(totalUnits) || totalUnits < 0) {
        throw new AdminValidationError('totalUnits must be a non-negative integer');
      }
      const batch = await prisma.batch.update({ where: { id: body.batchId }, data: { totalUnits } });
      return { batch };
    },

    'set-status': async (prisma, body) => {
      if (!VALID_STATUSES.includes(body.status)) {
        throw new AdminValidationError(`status must be one of ${VALID_STATUSES.join(', ')}`);
      }
      const batch = await prisma.batch.update({ where: { id: body.batchId }, data: { status: body.status } });
      return { batch };
    },
  },
});
