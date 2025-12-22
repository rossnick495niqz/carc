import { DOMParser } from 'xmldom';
import fs from 'fs';
import path from 'path';

// Types (Mirrored from src/fx/types.ts to avoid ts-node import issues with absolute paths if not configured)
const MAJOR_CURRENCIES = ['EUR', 'USD', 'CNY', 'JPY', 'KRW', 'GBP', 'CHF', 'KGS'];

interface FxRate {
    CharCode: string;
    Nominal: number;
    Name: string;
    Value: number;
    Previous?: number;
}

interface FxSnapshot {
    Date: string;
    Timestamp: string;
    Valute: Record<string, FxRate>;
}

const CBR_XML_URL = 'https://www.cbr.ru/scripts/XML_daily.asp';
const OUTPUT_PATH = path.join(process.cwd(), 'public/data/fx/cbr_daily.json');

async function fetchAndBuild() {
    console.log(`Fetching CBR data from ${CBR_XML_URL}...`);
    const response = await fetch(CBR_XML_URL);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    const xmlText = await response.text();
    console.log('Parsing XML...');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const valutes: Record<string, FxRate> = {};
    const dateStr = xmlDoc.documentElement.getAttribute('Date') || new Date().toLocaleDateString('ru-RU');

    // Parse dd.mm.yyyy -> yyyy-mm-dd
    const [dd, mm, yyyy] = dateStr.split('.');
    const isoDate = `${yyyy}-${mm}-${dd}`;

    const items = xmlDoc.getElementsByTagName('Valute');

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const charCode = item.getElementsByTagName('CharCode')[0]?.textContent || '';
        const nominalStr = item.getElementsByTagName('Nominal')[0]?.textContent || '1';
        const name = item.getElementsByTagName('Name')[0]?.textContent || '';
        const valStr = item.getElementsByTagName('Value')[0]?.textContent || '0';

        const nominal = parseInt(nominalStr, 10);
        const value = parseFloat(valStr.replace(',', '.'));

        if (charCode) {
            valutes[charCode] = {
                CharCode: charCode,
                Nominal: nominal,
                Name: name,
                Value: value
            };
        }
    }

    const snapshot: FxSnapshot = {
        Date: isoDate,
        Timestamp: new Date().toISOString(),
        Valute: valutes
    };

    console.log(`Extracted ${Object.keys(valutes).length} currencies.`);
    console.log(`Date: ${isoDate}`);

    // Validate major currencies exist
    const missing = MAJOR_CURRENCIES.filter(c => !valutes[c]);
    if (missing.length > 0) {
        console.warn(`WARNING: Missing major currencies: ${missing.join(', ')}`);
    }

    // Ensure dir exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(snapshot, null, 2));
    console.log(`Saved to ${OUTPUT_PATH}`);
}

fetchAndBuild().catch(err => {
    console.error(err);
    process.exit(1);
});
