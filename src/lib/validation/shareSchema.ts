import { z } from 'zod';

export const createShareValueSchema = z.object({
  recordDate: z.string().or(z.date()),
  price: z.number().positive('Share price must be positive'),
  currency: z.string().default('INR'),
  source: z.enum(['MANUAL', 'API_FEED']).default('MANUAL'),
});

export type CreateShareValueInput = z.infer<typeof createShareValueSchema>;
