import { describe, it, expect } from 'vitest';
import { BatchStatus, OrderStatus } from '@prisma/client';
import { BATCH_CHIP, ORDER_CHIP } from '../../src/components/AdminDashboard.jsx';

// AdminDashboard.jsx can't import @prisma/client itself (it's bundled for
// the browser, and the generated client pulls in Node-only query-engine
// bindings) — so this is the seam that catches the map drifting from the
// schema instead: a status added to BatchStatus/OrderStatus without a
// matching chip-map entry fails here, not silently in the admin UI.
describe('admin status chip maps stay exhaustive against the Prisma enums', () => {
  it('BATCH_CHIP covers every BatchStatus value', () => {
    expect(Object.keys(BATCH_CHIP).sort()).toEqual(Object.values(BatchStatus).sort());
  });

  it('ORDER_CHIP covers every OrderStatus value', () => {
    expect(Object.keys(ORDER_CHIP).sort()).toEqual(Object.values(OrderStatus).sort());
  });
});
