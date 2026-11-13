import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    env: {
      // Mocked-unit tier (tests/lib, tests/api, tests/schemas) never hits a
      // real database — this just satisfies src/lib/prisma.ts's "is
      // DATABASE_URL set" check so the client constructs, then every test
      // mocks the Prisma calls it needs. tests/integration overrides this
      // with a real Postgres connection string — see tests/integration/setup.ts.
      DATABASE_URL: 'postgresql://mock_user:mock_pass@localhost:5432/ajer_haus_test?sslmode=disable',
    },
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'api/**'],
      exclude: ['src/lib/schemas/**'],
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 85,
        branches: 75,
      },
    },
  },
});
