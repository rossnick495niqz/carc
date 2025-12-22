import { z } from 'zod';

// --- Base Metadata ---
export const SourceRefSchema = z.object({
    title: z.string(),
    url: z.string().optional(),
    doc_date: z.string().optional(), // YYYY-MM-DD
});

// --- Catalog Entry ---
export const CatalogEntrySchema = z.object({
    id: z.string(), // "util_fee" | "customs"
    version: z.string(), // e.g. "2024-10-01"
    effective_from: z.string(), // ISO Date
    source_title: z.string(),
    source_url: z.string(), // Official URL to raw doc
    document_date: z.string().optional(),
    retrieved_at: z.string(), // ISO Timestamp
    checksum: z.string(), // SHA-256 of raw file
    parser_version: z.string(), // Version of the parser script used

    // Paths relative to project root
    raw_path: z.string(),
    parsed_path: z.string(),
});

export const DataCatalogSchema = z.object({
    datasets: z.array(CatalogEntrySchema),
    last_updated: z.string(),
});

// --- Util Fee Table ---
export const UtilFeeRateSchema = z.object({
    category: z.string(),
    age_years: z.tuple([z.number(), z.number()]),
    engine_volume: z.tuple([z.number(), z.number()]).optional(),
    electric: z.boolean().optional(),
    hybrid: z.boolean().optional(),
    k_factor: z.number(),
    base_rate: z.number(),
    importer_type: z.enum(['personal', 'commercial']),
    source_ref: z.string().optional(),
});

export const UtilFeeTableSchema = z.object({
    id: z.literal('util_fee'),
    version: z.string(),
    rates: z.array(UtilFeeRateSchema),
    metadata: z.object({ parser_version: z.string().optional() }).optional(),
});

// --- Customs Table ---
export const CustomsRateSchema = z.object({
    importer_type: z.enum(['personal', 'commercial']),
    age_years: z.tuple([z.number(), z.number()]),
    engine_volume: z.tuple([z.number(), z.number()]).optional(),
    price_eur: z.tuple([z.number(), z.number()]).optional(),

    // Logic types
    rate_percentage: z.number().optional(),
    min_eur_per_cc: z.number().optional(),
    fixed_rate_eur: z.number().optional(),

    source_ref: z.string().optional(),
});

export const CustomsTableSchema = z.object({
    id: z.literal('customs'),
    version: z.string(),
    rates: z.array(CustomsRateSchema),
    metadata: z.object({ parser_version: z.string().optional() }).optional(),
});
