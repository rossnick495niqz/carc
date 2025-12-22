export interface Entitlement {
    premium: boolean;
    source: 'flag' | 'local' | 'iap' | 'unknown';
}

const STORAGE_KEY = 'premium_override';
const IAP_STORAGE_KEY = 'iap_stub_purchased'; // Matches StubProvider key

export const getEntitlement = (): Entitlement => {
    // 1. Check Env Flag (Build time / Dev) - Highest priority
    if (import.meta.env.VITE_PREMIUM === '1' || import.meta.env.VITE_PREMIUM === 'true') {
        return { premium: true, source: 'flag' };
    }

    // 2. Check Local Storage Override (QA / Debug) - Second priority
    if (typeof window !== 'undefined') {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local === 'true') {
            return { premium: true, source: 'local' };
        }

        // 3. Check IAP Persistent State (Sync read for UI speed)
        // The actual Provider.init() / restore() is async and usually called on app boot
        // which updates this storage key.
        const iap = localStorage.getItem(IAP_STORAGE_KEY);
        if (iap === 'true') {
            return { premium: true, source: 'iap' };
        }
    }

    // Default
    return { premium: false, source: 'unknown' };
};

// Debug helper
export const setLocalEntitlement = (enabled: boolean) => {
    if (enabled) localStorage.setItem(STORAGE_KEY, 'true');
    else localStorage.removeItem(STORAGE_KEY);
    window.location.reload(); // Force refresh to apply
};

