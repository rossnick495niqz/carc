import { describe, it, expect, beforeEach } from 'vitest';
import { getEntitlement } from '../entitlement';
import { StubProvider } from './providers/stub';

describe('IAP Skeleton', () => {

    describe('Entitlement Priority', () => {
        // const originalLocalStorage = global.localStorage;

        beforeEach(() => {
            const store: Record<string, string> = {};
            global.localStorage = {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => { store[key] = value; },
                removeItem: (key: string) => { delete store[key]; },
                clear: () => { },
                key: () => null,
                length: 0
            };
        });

        it('should default to false', () => {
            const e = getEntitlement();
            expect(e.premium).toBe(false);
            expect(e.source).toBe('unknown');
        });

        it('should respect IAP persistent state', () => {
            localStorage.setItem('iap_stub_purchased', 'true');
            const e = getEntitlement();
            expect(e.premium).toBe(true);
            expect(e.source).toBe('iap');
        });

        // Note: Can't test VITE_PREMIUM env priority easily in unit test without complex mocking,
        // but logic is simple enough.
    });

    describe('Stub Provider', () => {
        it('should return products', async () => {
            const stub = new StubProvider();
            const products = await stub.getProducts(['123']);
            expect(products.length).toBe(1);
            expect(products[0].id).toBe('123');
        });

        it('should fail purchase by default', async () => {
            const stub = new StubProvider();
            const res = await stub.purchase('test');
            expect(res.ok).toBe(false);
        });
    });
});
