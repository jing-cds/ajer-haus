// src/lib/schemas/checkout.ts
import { z } from 'zod';
import { isVictorianPostcode } from '../delivery.js';

/**
 * Zod schema for POST /api/create-checkout-session.
 *
 * The client only ever sends WHAT to buy, HOW MANY, and delivery details —
 * never a price. The server looks up the real Product/Batch by slug and
 * prices from `priceCents` in the database, so a tampered client request
 * can change the quantity at most, never the amount charged.
 */
export const CreateCheckoutSessionSchema = z.object({
  slug: z
    .string({ message: 'Missing product slug' })
    .trim()
    .min(1)
    .max(160)
    .default('shrine-of-remembrance'),

  quantity: z
    .number({ message: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(12, 'Quantity must be 12 or fewer per order'),

  name: z
    .string({ message: 'Please add your name' })
    .trim()
    .min(1, 'Please add your name')
    .max(200, 'Name is too long'),

  email: z
    .string({ message: 'Please add a valid email' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please add a valid email' })
    .max(255),

  method: z.enum(['delivery', 'pickup'], { message: 'Choose a delivery method' }),

  // Required when method === 'delivery' — validated in the handler (Zod's
  // own cross-field refine reports the wrong field path for this shape),
  // same two-step pattern the handler already needs for postcode-vs-VIC
  // checking anyway.
  address: z
    .string()
    .trim()
    .max(200, 'Address is too long')
    .optional()
    .nullable()
    .transform((val) => val || undefined),

  // Also required for delivery, same pattern as `address` above. Previously
  // not collected at all anywhere in the stack, so every delivery Address
  // got written with a hardcoded suburb: '' — see src/lib/orderIntake.ts.
  suburb: z
    .string()
    .trim()
    .max(120, 'Suburb is too long')
    .optional()
    .nullable()
    .transform((val) => val || undefined),

  // Victorian-ness (not just "4 digits") is checked here with the same
  // isVictorianPostcode src/lib/delivery.ts's resolveDeliveryFeeCents uses
  // for the real gate — this used to be a looser /^\d{0,4}$/, which let a
  // non-Victorian postcode (e.g. a 4-digit NSW one) pass schema validation
  // and only get caught later, deeper in the handler.
  postcode: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => val || undefined)
    .refine((val) => val === undefined || isVictorianPostcode(val), {
      message: 'We only deliver within Victoria (postcodes 3000–3999)',
    }),

  marketingOptIn: z.boolean().optional().default(false),
});

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;
