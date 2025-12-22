import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval'; // IndexedDB wrapper
import { FxSnapshot } from './types';
import { fetchCbrXml } from './providers/cbr';

import { publicUrl } from '../shared/publicUrl';

const FALLBACK_URL = publicUrl('data/fx/cbr_daily.json');

// Custom IDB Storage for Zustand
const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};

interface FxState {
    snapshot: FxSnapshot | null;
    isLoading: boolean;
    error: string | null;

    init: () => Promise<void>;
    refresh: () => Promise<void>;
}

export const useFxStore = create<FxState>()(
    persist(
        (set, get) => ({
            snapshot: null,
            isLoading: false,
            error: null,

            init: async () => {
                // Hydration happens automatically via persist.
                // We just need to check if we should refresh.
                // Small delay to allow hydration to complete if async (IDB is async)
                // Zustand persist with async storage might not be ready immediately.
                // We can check `useFxStore.persist.hasHydrated()` if we needed strict control,
                // but for now let's just trigger refresh logic which validates freshness.

                const current = get().snapshot;
                if (!current) {
                    get().refresh();
                } else {
                    // Optional: Check if stale (>24h) and background refresh?
                    // Let's rely on the UI calling init() and us deciding here.
                    const date = new Date(current.Timestamp);
                    const now = new Date();
                    const hours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
                    if (hours > 24) {
                        get().refresh();
                    }
                }
            },

            refresh: async () => {
                set({ isLoading: true, error: null });
                try {
                    // 1. Try Live CBR
                    try {
                        const data = await fetchCbrXml();
                        set({ snapshot: data, isLoading: false, error: null });
                        return;
                    } catch (e) {
                        console.warn('Direct CBR fetch failed (likely CORS), trying fallback logic...', e);
                    }

                    // 2. Try Static JSON (local fallback)
                    const resp = await fetch(FALLBACK_URL);
                    if (!resp.ok) throw new Error('Static fallback missing');
                    const staticData = await resp.json();
                    set({ snapshot: staticData, isLoading: false, error: null });

                } catch (err) {
                    console.error('All FX fetch methods failed', err);
                    set({ isLoading: false, error: 'Could not update rates. Using cached or offline defaults.' });
                }
            }
        }),
        {
            name: 'fx-storage-idb', // New key to avoid conflict with old localstorage
            storage: createJSONStorage(() => idbStorage),
            partialize: (state) => ({ snapshot: state.snapshot }), // Don't persist loading/error states
        }
    )
);
