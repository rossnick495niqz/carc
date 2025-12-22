import { create } from 'zustand';
import { get, set } from 'idb-keyval';
import { Scenario } from './types';
import { migrateScenarios } from './migrations';
import { v4 as uuidv4 } from 'uuid';

const DB_KEY = 'carc_scenarios_v1';
const MAX_SCENARIOS = 10;

interface ScenarioState {
    scenarios: Scenario[];
    isLoading: boolean;
    error: string | null;

    loadScenarios: () => Promise<void>;
    saveScenario: (title: string, input: any, results: any, totalRub: number, currency: string) => Promise<void>;
    deleteScenario: (id: string) => Promise<void>;
    updateScenarioTitle: (id: string, newTitle: string) => Promise<void>;

    // Comparison slots
    compareSlots: (string | null)[]; // Array of 3 scenario IDs
    setSlot: (index: number, scenarioId: string | null) => void;
}

export const useScenarioStore = create<ScenarioState>((setState, getState) => ({
    scenarios: [],
    isLoading: false,
    error: null,
    compareSlots: [null, null, null],

    loadScenarios: async () => {
        setState({ isLoading: true });
        try {
            const raw = await get<any[]>(DB_KEY);
            const migrated = migrateScenarios(raw || []);

            // If migrations happened, persist immediately
            if (raw && JSON.stringify(raw) !== JSON.stringify(migrated)) {
                await set(DB_KEY, migrated);
            }

            setState({ scenarios: migrated, isLoading: false });
        } catch (e) {
            console.error(e);
            setState({ error: 'Failed to load scenarios', isLoading: false });
        }
    },

    saveScenario: async (title, input, results, totalRub, currency) => {
        const current = getState().scenarios;
        if (current.length >= MAX_SCENARIOS) {
            throw new Error(`Limit reached. Maximum ${MAX_SCENARIOS} scenarios allowed.`);
        }

        const newScenario: Scenario = {
            id: uuidv4(),
            schemaVersion: 2,
            appVersion: '1.2.0',
            title: title || `Scenario ${new Date().toLocaleTimeString()}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            input,
            results,
            totalRub,
            currency,
            meta: {
                fxDate: new Date().toISOString(), // In real app, pass this from FxStore
                fxSource: 'CBR',
                dataVersion: '1.0'
            }
        };

        const updated = [newScenario, ...current];
        await set(DB_KEY, updated);
        setState({ scenarios: updated });
    },

    deleteScenario: async (id) => {
        const updated = getState().scenarios.filter(s => s.id !== id);
        await set(DB_KEY, updated);
        // Also clear from slots
        const slots = getState().compareSlots.map(sid => sid === id ? null : sid);
        setState({ scenarios: updated, compareSlots: slots });
    },

    updateScenarioTitle: async (id, newTitle) => {
        const updated = getState().scenarios.map(s =>
            s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s
        );
        await set(DB_KEY, updated);
        setState({ scenarios: updated });
    },

    setSlot: (index, scenarioId) => {
        const slots = [...getState().compareSlots];
        slots[index] = scenarioId;
        setState({ compareSlots: slots });
    }
}));
