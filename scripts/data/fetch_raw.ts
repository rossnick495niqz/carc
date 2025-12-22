/**
 * scripts/data/fetch_raw.ts
 *
 * Downloads official source documents to data/official/raw/.
 */

import fs from 'fs';
import path from 'path';

const RAW_DIR = path.join(process.cwd(), 'data/official/raw');

const SOURCES = [
    {
        id: 'util_fee',
        // Updated to HTTPS
        url: 'https://publication.pravo.gov.ru/Document/View/0001202410010001',
        filename: 'util_fee_decree_1118_2024.html',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    },
    {
        id: 'customs',
        // Updated to exact Decision 107 URL (Example specific link)
        // Note: Real EAEU links often redirect, but this is the HTTPS entry point for Decision 107.
        url: 'https://docs.eaeunion.org/docs/ru-ru/01415817/clcd_12042018_44',
        filename: 'customs_etts_eaeu.html',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    }
];

async function main() {
    console.log('Fetching Official Documents (HTTPS)...');

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    for (const source of SOURCES) {
        console.log(`[FETCH] ${source.url} -> ${source.filename}`);
        try {
            const response = await fetch(source.url, { headers: source.headers });
            if (!response.ok) {
                console.warn(`⚠️ Failed to fetch ${source.url}: ${response.status} ${response.statusText}`);
                continue;
            }

            const text = await response.text();

            if (!text || text.length < 500) {
                throw new Error('Retrieved content too short/empty');
            }

            fs.writeFileSync(path.join(RAW_DIR, source.filename), text);
            console.log(`✅ Saved ${source.filename} (${text.length} bytes)`);

        } catch (err) {
            console.error(`❌ Error fetching ${source.url}:`, err);
        }
    }
}

main();
