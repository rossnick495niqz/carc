import { z } from 'zod';

export const FxRateSchema = z.object({
    CharCode: z.string(), // e.g. "USD"
    Nominal: z.number(), // e.g. 1, 10, 100
    Name: z.string(),
    Value: z.number(), // Rate in RUB for Nominal amount
    Previous: z.number().optional(),
});

export type FxRate = z.infer<typeof FxRateSchema>;

export const FxSnapshotSchema = z.object({
    Date: z.string(), // ISO date
    PreviousDate: z.string().optional(),
    PreviousURL: z.string().optional(),
    Timestamp: z.string(), // ISO datetime of fetch
    Valute: z.record(z.string(), FxRateSchema), // Map "USD" -> Rate
});

export type FxSnapshot = z.infer<typeof FxSnapshotSchema>;

// Currencies we explicitly care about for the UI
export const MAJOR_CURRENCIES = ['EUR', 'USD', 'CNY', 'JPY', 'KRW', 'GBP', 'CHF'];
// Kyrgyzstan
export const KGS_CURRENCY = 'KGS';
