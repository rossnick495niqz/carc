import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// Minimal manual replication of schemas to avoid complex TS import issues in simple node script
const UtilFeeSchema = z.object({
    version: z.string(),
    rates: z.array(z.object({
        category: z.string(),
        importer_type: z.enum(['personal', 'commercial']),
        age_years: z.tuple([z.number(), z.number()]),
        engine_volume: z.tuple([z.number(), z.number()]),
        base_rate: z.number(),
        k: z.number()
    }))
});

const CustomsSchema = z.object({
    version: z.string(),
    rates: z.array(z.object({
        importer_type: z.enum(['personal', 'commercial']),
        age_years: z.tuple([z.number(), z.number()]),
        // other fields optional
    }))
});

const tablesDir = path.join(process.cwd(), 'public/datapack/tables');

console.log('Validating Data Packs...');

try {
    const utilFee = JSON.parse(fs.readFileSync(path.join(tablesDir, 'util_fee.json'), 'utf-8'));
    UtilFeeSchema.parse(utilFee);
    console.log('✅ util_fee.json is valid');

    const customs = JSON.parse(fs.readFileSync(path.join(tablesDir, 'customs.json'), 'utf-8'));
    CustomsSchema.parse(customs);
    console.log('✅ customs.json is valid');

} catch (e) {
    console.error('Validation Failed:', e);
    process.exit(1);
}
