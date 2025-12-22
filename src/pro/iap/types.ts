export interface Product {
    id: string;
    title: string;
    description: string;
    price: string;
    currency: string;
}

export interface PurchaseResult {
    ok: boolean;
    errorCode?: string;
    message?: string;
}

export type EntitlementSource = 'flag' | 'local' | 'iap' | 'unknown';

export interface EntitlementState {
    premium: boolean;
    source: EntitlementSource;
    updatedAt?: number;
}
