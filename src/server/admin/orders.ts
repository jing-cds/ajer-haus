// src/server/admin/orders.ts
// GET  -> list orders (most recent first), with customer + item summary.
// POST -> { action: 'mark-shipped', orderId, trackingNumber } or
//         { action: 'mark-delivered', orderId }
import { OrderStatus } from '@prisma/client';
import { defineAdminResource } from './resource.js';

export default defineAdminResource({
  idField: 'orderId',

  get: async (prisma) => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        customer: { select: { email: true, name: true } },
        deliveryAddress: true,
        items: { include: { product: { select: { name: true } } } },
        payment: { select: { status: true, providerPaymentId: true } },
      },
    });
    return { orders };
  },

  actions: {
    'mark-shipped': async (prisma, body) => {
      const trackingNumber = typeof body.trackingNumber === 'string' ? body.trackingNumber.trim() : null;
      const order = await prisma.order.update({
        where: { id: body.orderId },
        data: { status: OrderStatus.OUT_FOR_DELIVERY, shippedAt: new Date(), trackingNumber: trackingNumber || null },
      });
      return { order };
    },

    'mark-delivered': async (prisma, body) => {
      const order = await prisma.order.update({
        where: { id: body.orderId },
        data: { status: OrderStatus.DELIVERED, deliveredAt: new Date() },
      });
      return { order };
    },
  },
});
