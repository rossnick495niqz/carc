import { describe, it, expect } from 'vitest';
import { UtilFeeTableSchema, CustomsTableSchema, DataCatalogSchema } from './schemas/index';
import fs from 'fs';
import path from 'path';

describe('Data Layer (Refined)', () => {

    it('Catalog validates against schema (Refined)', () => {
        const filePath = path.join(process.cwd(), 'data/catalog.json');
        if (!fs.existsSync(filePath)) {
            console.warn('Skipping: catalog.json missing');
            return;
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const res = DataCatalogSchema.safeParse(data);
        if (!res.success) console.error(res.error);
        expect(res.success).toBe(true);
    });

    it('Catalog paths exist', () => {
        const filePath = path.join(process.cwd(), 'data/catalog.json');
        if (!fs.existsSync(filePath)) return;
        const catalog = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        for (const ds of catalog.datasets) {
            // Check raw path
            const raw = path.join(process.cwd(), ds.raw_path);
            expect(fs.existsSync(raw)).toBe(true);

            // Check parsed path
            const parsed = path.join(process.cwd(), ds.parsed_path);
            expect(fs.existsSync(parsed)).toBe(true);
        }
    });

    it('Parsed JSONs validate against schemas', () => {
        const parsedDir = path.join(process.cwd(), 'data/official/parsed');
        if (!fs.existsSync(parsedDir)) return;

        // Util Fee
        const uPath = path.join(parsedDir, 'util_fee.json');
        if (fs.existsSync(uPath)) {
            const data = JSON.parse(fs.readFileSync(uPath, 'utf-8'));
            expect(UtilFeeTableSchema.safeParse(data).success).toBe(true);
        }

        // Customs
        const cPath = path.join(parsedDir, 'customs.json');
        if (fs.existsSync(cPath)) {
            const data = JSON.parse(fs.readFileSync(cPath, 'utf-8'));
            expect(CustomsTableSchema.safeParse(data).success).toBe(true);
        }
    });
});
