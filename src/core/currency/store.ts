import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CurrencyRate, CurrencyRateSchema } from './types';

// Default rate fallback if everything fails (e.g. first run offline)
const FALLBACK_RATE: CurrencyRate = {
    currency_pair: 'EUR/RUB',
    rate: 105.00,
    date: new Date().toISOString(),
    source: 'Fallback (Hardcoded)',
};

interface CurrencyState {
    currentRate: CurrencyRate;
    isStale: boolean;
    isLoading: boolean;
    error: string | null;

    fetchRate: () => Promise<void>;
}

const DATA_PACK_BASE_URL = '/datapack/tables'; // separate from manifest-managed tables for simpler live updates

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            currentRate: FALLBACK_RATE,
            isStale: true, // assume stale on hydrate until checked
            isLoading: false,
            error: null,

            fetchRate: async () => {
                set({ isLoading: true, error: null });
                try {
                    // Attempt fetch
                    const response = await fetch(`${DATA_PACK_BASE_URL}/eur_rub.json`, {
                        cache: 'no-store' // try to bypass browser cache for currency
                    });

                    if (!response.ok) throw new Error('Failed to fetch rates');

                    const json = await response.json();
                    const rate = CurrencyRateSchema.parse(json);

                    set({
                        currentRate: rate,
                        isStale: false,
                        isLoading: false
                    });
                } catch (err) {
                    console.error(err);
                    // On failure, rely on existing persisted state
                    // Check if existing state is actually stale (> 24h)
                    const lastDate = new Date(get().currentRate.date);
                    const now = new Date();
                    const hoursDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

                    set({
                        isLoading: false,
                        error: (err as Error).message,
                        isStale: hoursDiff > 24
                    });
                }
            },
        }),
        {
            name: 'auto-import-currency',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ currentRate: state.currentRate }), // only persist the data
        }
    )
);
