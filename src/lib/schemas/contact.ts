// src/lib/schemas/contact.ts
import { z } from 'zod';

const TOPICS = ['An order', 'Delivery or pickup', 'Corporate gifting', 'Scent Story events', 'Something else'] as const;

/**
 * Zod schema for POST /api/contact — the "Say hello." modal's message form.
 */
export const ContactSchema = z.object({
  name: z
    .string({ message: 'Please enter your name' })
    .trim()
    .min(1, 'Please enter your name')
    .max(100, 'Name must be under 100 characters'),

  email: z
    .string({ message: 'Please enter your email address' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' })
    .max(255, 'Email address is too long'),

  topic: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && (TOPICS as readonly string[]).includes(val) ? val : 'Something else')),

  message: z
    .string({ message: 'Please enter a message' })
    .trim()
    .min(1, 'Please enter a message')
    .max(4000, 'Message must be under 4000 characters'),

  // Honeypot spam trap — real users never fill this in.
  _gotcha: z
    .string()
    .max(0, 'Spam detected')
    .optional()
    .nullable()
    .transform((val) => val || ''),
});

export type ContactInput = z.infer<typeof ContactSchema>;
