import { z } from 'zod';

export const CurrencyRateSchema = z.object({
  currency_pair: z.literal('EUR/RUB'), // potentially extensible
  rate: z.number(), // e.g. 105.50
  date: z.string(), // ISO 8601, e.g. "2025-12-22T10:00:00Z"
  source: z.string(), // e.g. "CBR"
  next_update: z.string().optional(), // Estimated next update time
});

export type CurrencyRate = z.infer<typeof CurrencyRateSchema>;
