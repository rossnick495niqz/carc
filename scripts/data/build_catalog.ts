/**
 * scripts/data/build_catalog.ts
 *
 * Scans data/official/raw, calculates checksums, and generates data/catalog.json.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
// import { DataCatalogSchema } from '../../src/data/schemas/index'; 

const RAW_DIR = path.join(process.cwd(), 'data/official/raw');
const CATALOG_PATH = path.join(process.cwd(), 'data/catalog.json');

const METADATA = {
    util_fee: {
        version: '2024-10-01',
        effective_from: '2024-10-01',
        source_title: 'Decree No. 1118',
        source_url: 'https://publication.pravo.gov.ru/Document/View/0001202410010001',
        filename: 'util_fee_decree_1118_2024.html',
        parsed_filename: 'util_fee.json',
        parser_version: '1.0.1'
    },
    customs: {
        version: '2024-01-01',
        effective_from: '2024-01-01',
        source_title: 'EAEU Council Decision No. 44 (ETTS)',
        source_url: 'https://docs.eaeunion.org/docs/ru-ru/01415817/clcd_12042018_44',
        filename: 'customs_etts_eaeu.html',
        parsed_filename: 'customs.json',
        parser_version: '1.0.1'
    }
};

async function main() {
    console.log('Building Catalog...');

    if (!fs.existsSync(RAW_DIR)) {
        console.error('Raw directory missing. Run fetch_raw.ts first.');
        process.exit(1);
    }

    const datasets = [];

    for (const [id, meta] of Object.entries(METADATA)) {
        const filePath = path.join(RAW_DIR, meta.filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Raw file ${meta.filename} missing for ${id}. Skipping.`);
            continue;
        }

        const buffer = fs.readFileSync(filePath);
        const checksum = crypto.createHash('sha256').update(buffer).digest('hex');
        const stat = fs.statSync(filePath);

        datasets.push({
            id,
            version: meta.version,
            effective_from: meta.effective_from,
            source_title: meta.source_title,
            source_url: meta.source_url,
            document_date: meta.effective_from,
            retrieved_at: stat.mtime.toISOString(),
            checksum,
            parser_version: meta.parser_version,

            // New path fields
            raw_path: `data/official/raw/${meta.filename}`,
            parsed_path: `data/official/parsed/${meta.parsed_filename}`
        });
    }

    const catalog = {
        datasets,
        last_updated: new Date().toISOString()
    };

    try {
        fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
        console.log(`✅ Generated ${CATALOG_PATH}`);
    } catch (e) {
        console.error('Catalog generation failed:', e);
        process.exit(1);
    }
}

main();
