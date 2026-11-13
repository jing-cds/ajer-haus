import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { loadDotEnv } from './loadDotEnv.js';

loadDotEnv();

if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient | null };

// Production points DATABASE_URL at Neon (uses the serverless/WebSocket
// driver, needed for the HTTP-reachable connection model Vercel's
// Serverless Functions run under). The real-Postgres integration test tier
// (tests/integration/) instead points it at a plain `postgres:16` service
// container — ordinary TCP, no Neon proxy in front of it — so a plain
// `pg`-based adapter is used there. Same generated Prisma Client either
// way; only the driver adapter differs, so `reserveStockForBatch` and the
// rest of src/lib/inventory.ts run against genuine Postgres row-locking in
// both cases, not a stand-in.
function isNeonConnectionString(connectionString: string): boolean {
  return /neon\.tech/.test(connectionString);
}

function createPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  try {
    const adapter = isNeonConnectionString(connectionString)
      ? new PrismaNeon({ connectionString })
      : new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error('Failed to initialize Prisma with a driver adapter:', err);
    return new PrismaClient();
  }
}

export const prisma: any = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
