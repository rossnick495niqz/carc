import { describe, it, expect } from 'vitest';
import { convertFx } from './convert';
import { parseCbrXml } from './providers/cbr';
import { FxSnapshot } from './types';

const MOCK_SNAPSHOT: FxSnapshot = {
    Date: '2025-05-01',
    Timestamp: '2025-05-01T12:00:00Z',
    Valute: {
        'USD': { CharCode: 'USD', Nominal: 1, Name: 'Dollar', Value: 100.0 }, // 100 RUB
        'JPY': { CharCode: 'JPY', Nominal: 100, Name: 'Yen', Value: 50.0 }, // 100 JPY = 50 RUB -> 1 JPY = 0.5 RUB
        'EUR': { CharCode: 'EUR', Nominal: 1, Name: 'Euro', Value: 110.0 }
    }
};

describe('convertFx', () => {
    it('converts same currency', () => {
        const res = convertFx(100, 'USD', 'USD', MOCK_SNAPSHOT);
        expect(res.value).toBe(100);
        expect(res.rate).toBe(100.0);
    });

    it('converts to RUB (pivot)', () => {
        // 10 USD -> ? RUB. Rate 100.
        const res = convertFx(10, 'USD', 'RUB', MOCK_SNAPSHOT);
        expect(res.value).toBe(1000); // 10 * 100
        expect(res.rate).toBe(100);
    });

    it('converts from RUB', () => {
        // 1000 RUB -> ? USD. Rate 100.
        const res = convertFx(1000, 'RUB', 'USD', MOCK_SNAPSHOT);
        expect(res.value).toBe(10);
    });

    it('handles Nominal (JPY)', () => {
        // 200 JPY -> RUB. 
        // Rate is 50 RUB for 100 JPY. -> 0.5 RUB/JPY.
        // 200 * 0.5 = 100 RUB.
        const res = convertFx(200, 'JPY', 'RUB', MOCK_SNAPSHOT);
        expect(res.value).toBe(100);
        expect(res.nominal).toBe(100);
    });

    it('Cross rates (JPY -> USD)', () => {
        // 200 JPY -> ~100 RUB -> 1 USD
        const res = convertFx(200, 'JPY', 'USD', MOCK_SNAPSHOT);
        expect(res.value).toBe(1);
    });
});

describe('parseCbrXml', () => {
    const XML_FIXTURE = `
        <ValCurs Date="01.05.2025" name="Foreign Currency Market">
            <Valute ID="R01235">
                <NumCode>840</NumCode>
                <CharCode>USD</CharCode>
                <Nominal>1</Nominal>
                <Name>Доллар США</Name>
                <Value>95,1234</Value>
            </Valute>
            <Valute ID="R01375">
                <NumCode>156</NumCode>
                <CharCode>CNY</CharCode>
                <Nominal>1</Nominal>
                <Name>Юань</Name>
                <Value>13,5000</Value>
            </Valute>
        </ValCurs>
    `;

    it('parses valid XML string', () => {
        // We need robust environment for DOMParser (jsdom).
        // Assumes vitest environment is jsdom or setup correctly using polyfills if node.
        const snapshot = parseCbrXml(XML_FIXTURE);

        expect(snapshot.Date).toBe('2025-05-01');
        expect(snapshot.Valute['USD']).toBeDefined();
        expect(snapshot.Valute['USD'].Value).toBe(95.1234);
        expect(snapshot.Valute['USD'].Nominal).toBe(1);

        expect(snapshot.Valute['CNY'].Value).toBe(13.5);
    });
});
