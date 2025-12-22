import { z } from 'zod';

export const DataPackSourceSchema = z.object({
    name: z.string(),
    url: z.string().url(),
    date: z.string(), // ISO date
});

export const DataPackManifestSchema = z.object({
    version: z.string(), // e.g. "0.1.0"
    build_date: z.string(), // ISO datestring
    effective_from: z.string(), // ISO datestring
    sources: z.array(DataPackSourceSchema),
    tables: z.record(z.string(), z.string()), // map table name -> relative path
    signature: z.string().optional(), // RSA/ECDSA signature
});

export type DataPackManifest = z.infer<typeof DataPackManifestSchema>;

export const UtilFeeRateSchema = z.object({
    category: z.string(), // e.g. "M1"
    importer_type: z.enum(['personal', 'commercial']),
    age_years: z.tuple([z.number(), z.number()]), // [min, max]
    engine_volume: z.tuple([z.number(), z.number()]), // [min, max]
    electric: z.boolean().optional(),
    hybrid: z.boolean().optional(),
    base_rate: z.number(),
    k: z.number(), // coefficient
    source_ref: z.string(), // reference to sources[] in manifest
});

export const UtilFeeTableSchema = z.object({
    version: z.string(),
    rates: z.array(UtilFeeRateSchema),
    metadata: z.any().optional(),
});

export type UtilFeeTable = z.infer<typeof UtilFeeTableSchema>;

export const CustomsRateSchema = z.object({
    importer_type: z.enum(['personal', 'commercial']),
    age_years: z.tuple([z.number(), z.number()]),
    engine_volume: z.tuple([z.number(), z.number()]).optional(),
    price_eur: z.tuple([z.number(), z.number()]).optional(),

    rate_percentage: z.number().optional(), // e.g. 15%
    min_eur_per_cc: z.number().optional(), // e.g. 2.5 eur/cc
    fixed_rate_eur: z.number().optional(), // e.g. 1.5 eur/cc (ETTS logic often just per cc)

    source_ref: z.string(),
});

export const CustomsTableSchema = z.object({
    version: z.string(),
    rates: z.array(CustomsRateSchema),
    metadata: z.any().optional(),
});

export type CustomsTable = z.infer<typeof CustomsTableSchema>;
