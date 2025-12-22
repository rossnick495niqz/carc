import { IAPProvider } from './provider';
import { StubProvider } from './providers/stub';

// Singleton to hold the provider
class IAPManager {
    provider: IAPProvider;

    constructor() {
        // Factory logic could go here (e.g. check Capacitor platform)
        // For now, default to Stub
        this.provider = new StubProvider();
    }

    async init() {
        await this.provider.init();
    }
}

export const iapManager = new IAPManager();
