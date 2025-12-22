import { IAPProvider } from '../provider';
import { Product, PurchaseResult, EntitlementState } from '../types';

export class StubProvider implements IAPProvider {
    private isPremium = false;

    async init(): Promise<void> {
        console.log('[IAP Stub] Initialized');
        // Simulate checking persistent local storage for "purchased" state in stub mode
        const stored = localStorage.getItem('iap_stub_purchased');
        this.isPremium = stored === 'true';
    }

    async getProducts(ids: string[]): Promise<Product[]> {
        return ids.map(id => ({
            id,
            title: 'PRO Access (Stub)',
            description: 'Unlock all features (Dev/Test)',
            price: '999 ₽',
            currency: 'RUB'
        }));
    }

    async purchase(productId: string): Promise<PurchaseResult> {
        console.log(`[IAP Stub] Purchasing ${productId}...`);
        await new Promise(r => setTimeout(r, 1000)); // Simulate network

        if (import.meta.env.VITE_IAP_STUB_SUCCESS === '1') {
            this.isPremium = true;
            localStorage.setItem('iap_stub_purchased', 'true');
            return { ok: true };
        }

        return { ok: false, message: 'Stub purchase failed (set VITE_IAP_STUB_SUCCESS=1)' };
    }

    async restore(): Promise<PurchaseResult> {
        console.log('[IAP Stub] Restoring...');
        await new Promise(r => setTimeout(r, 1000));

        if (this.isPremium || import.meta.env.VITE_IAP_STUB_SUCCESS === '1') {
            this.isPremium = true;
            localStorage.setItem('iap_stub_purchased', 'true');
            return { ok: true };
        }
        return { ok: false, message: 'Nothing to restore (Stub)' };
    }

    async getEntitlement(): Promise<EntitlementState> {
        return {
            premium: this.isPremium,
            source: this.isPremium ? 'iap' : 'unknown'
        };
    }
}
