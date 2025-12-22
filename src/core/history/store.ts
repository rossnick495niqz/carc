import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CalculationInput, CalculationLineItem } from '../calc/types';

export interface SavedCalculation {
    id: string;
    date: string; // ISO
    input: CalculationInput;
    total_rub: number;
    items_summary: string[]; // e.g. ["Customs: 5000", "Util: 20000"]
}

interface HistoryState {
    saved: SavedCalculation[];
    saveCalculation: (input: CalculationInput, items: CalculationLineItem[]) => void;
    deleteCalculation: (id: string) => void;
    clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            saved: [],

            saveCalculation: (input, items) => {
                const total = items.reduce((sum, i) => sum + i.value_rub, 0);
                const record: SavedCalculation = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    input,
                    total_rub: total,
                    items_summary: items.map(i => `${i.name}: ${i.value_rub.toLocaleString('ru-RU')}₽`),
                };

                set((state) => ({ saved: [record, ...state.saved] }));
            },

            deleteCalculation: (id) => {
                set((state) => ({ saved: state.saved.filter(s => s.id !== id) }));
            },

            clearHistory: () => set({ saved: [] }),
        }),
        {
            name: 'auto-import-history',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
