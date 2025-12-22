import { Product, PurchaseResult, EntitlementState } from './types';

export interface IAPProvider {
    init(): Promise<void>;
    getProducts(ids: string[]): Promise<Product[]>;
    purchase(productId: string): Promise<PurchaseResult>;
    restore(): Promise<PurchaseResult>;
    getEntitlement(): Promise<EntitlementState>;
}
