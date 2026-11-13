// tests/e2e/checkout.spec.ts
// One real-browser smoke test for the critical path: add to cart -> fill
// delivery details in the cart drawer -> redirected to Stripe's hosted
// test-mode Checkout -> pay with a Stripe test card -> redirected back to
// /order/success. This is the only check in the whole suite that would
// catch the cart drawer sending a field api/create-checkout-session's Zod
// schema doesn't expect, or vice versa — neither the mocked-unit nor the
// real-database integration tier drives an actual browser against the
// actual form.
//
// Needs a real Stripe TEST-mode key and a real (test) Postgres with the
// `shrine-of-remembrance` batch seeded and LIVE — see .github/workflows/ci.yml
// and prisma/seed.ts. Skips itself (rather than failing) if those aren't
// present, so a contributor without Stripe test keys configured locally
// still gets a clean `pnpm test:e2e` run.
import { test, expect } from '@playwright/test';

test.skip(!process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY not configured — skipping the Stripe-dependent E2E smoke test.');

test('add to cart, checkout, and land on the Stripe-redirected success page', async ({ page }) => {
  await page.goto('/collection');

  await page.getByRole('button', { name: 'More' }).first().click();
  await page.locator('[aria-label="Cart"]').first().click();

  const drawer = page.locator('.cdPanel');
  await expect(drawer).toBeVisible();

  await drawer.getByLabel('Name').fill('Playwright Test');
  await drawer.getByLabel('Email').fill('playwright-e2e@example.com');
  await drawer.getByLabel('Street address').fill('1 Test Street');
  await drawer.getByLabel('Postcode').fill('3000');

  await drawer.getByRole('button', { name: 'Continue to payment' }).click();

  // Redirected off-site to Stripe's hosted Checkout page.
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });

  await page.getByLabel('Email').fill('playwright-e2e@example.com');
  const cardFrame = page.frameLocator('iframe[title="Secure payment input frame"]').first();
  await cardFrame.getByLabel('Card number').fill('4242 4242 4242 4242');
  await cardFrame.getByLabel('Expiration').fill('12/34');
  await cardFrame.getByLabel('CVC').fill('123');
  const nameField = page.getByLabel('Cardholder name');
  if (await nameField.isVisible().catch(() => false)) {
    await nameField.fill('Playwright Test');
  }

  await page.getByRole('button', { name: /Pay/ }).click();

  await page.waitForURL(/\/order\/success/, { timeout: 20000 });
  await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible();
});
