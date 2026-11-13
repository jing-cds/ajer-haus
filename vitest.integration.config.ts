import { defineConfig } from 'vitest/config';

// Separate from vitest.config.ts specifically because that file hardcodes
// a mock DATABASE_URL for the unit tier — this tier needs the real
// TEST_DATABASE_URL (a throwaway Postgres, never the shared Neon project)
// to reach process.env unmodified. See tests/integration/helpers.ts and
// package.json's test:integration script.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    testTimeout: 20000,
  },
});
