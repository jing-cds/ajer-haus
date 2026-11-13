// prisma/seed.ts — seeds the seven Place Collection scents (src/data/
// places.js) as Products, plus one LIVE Batch for the Shrine candle (the
// only one currently open for pre-order per src/data/shop.js's FAQ copy).
// Run with `pnpm db:seed`.
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

// Mirrors src/data/places.js — kept as a plain literal here rather than
// imported, since this script runs standalone via tsx, outside Astro/Vite's
// module graph (and the two will drift at a different pace anyway: this is
// "what's in the database today", places.js is "what's on the page today").
const SCENTS = [
  { id: 'shrine', slug: 'shrine-of-remembrance', name: 'Shrine of Remembrance', tagline: 'Native frangipani · oud · sweet · woody', priceCents: 2600, live: true },
  { id: 'hosier', slug: 'love-affair-at-hosier', name: 'Love Affair at Hosier', tagline: 'Woodsmoke · tobacco · ashy · mature', priceCents: 2600, live: false },
  { id: 'morning', slug: 'melbourne-morning', name: 'Melbourne Morning', tagline: 'Wattleseed · warmth · nutty', priceCents: 2600, live: false },
  { id: 'ocean', slug: 'the-great-ocean-road', name: 'The Great Ocean Road', tagline: 'Sea salt · sage · breezy', priceCents: 2600, live: false },
  { id: 'fed', slug: 'night-out-at-fed-square', name: 'Night Out at Fed Square', tagline: 'Lime · coconut · zesty · creamy', priceCents: 2600, live: false },
  { id: 'rain', slug: 'its-about-to-rain', name: "It's About to Rain", tagline: 'Lemon · sandalwood · earthy · deep', priceCents: 2600, live: false },
  { id: 'yarra', slug: 'yarra-at-dusk', name: 'Yarra at Dusk', tagline: 'Eucalyptus · fern · fresh · crisp', priceCents: 2600, live: false },
];

async function main() {
  for (const scent of SCENTS) {
    const product = await prisma.product.upsert({
      where: { slug: scent.slug },
      update: { name: scent.name, tagline: scent.tagline, priceCents: scent.priceCents, isActive: scent.live },
      create: {
        slug: scent.slug,
        sku: `AH-${scent.id.toUpperCase()}`,
        name: scent.name,
        tagline: scent.tagline,
        priceCents: scent.priceCents, // placeholder price for the six not-yet-priced scents
        isActive: scent.live,
      },
    });

    if (scent.live) {
      await prisma.batch.upsert({
        where: { productId_batchCode: { productId: product.id, batchCode: 'B001' } },
        update: {},
        create: {
          productId: product.id,
          batchCode: 'B001',
          totalUnits: 40, // placeholder — adjust from the admin batch editor once the real print run size is known
          status: 'LIVE',
        },
      });
    }
  }
  console.log(`Seeded ${SCENTS.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
