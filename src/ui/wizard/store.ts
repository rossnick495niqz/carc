import { create } from 'zustand';
import { CalculationInput } from '../../core/calc/types';

interface WizardState {
    step: number;
    input: Partial<CalculationInput>;

    setStep: (step: number) => void;
    updateInput: (patch: Partial<CalculationInput>) => void;
    reset: () => void;
}

const INITIAL_INPUT: Partial<CalculationInput> = {
    importer_type: 'personal',
    car_type: 'M1',
    car_price_currency: 'EUR',
    engine_type: 'petrol',
};

export const useWizardStore = create<WizardState>((set) => ({
    step: 1,
    input: INITIAL_INPUT,

    setStep: (step) => set({ step }),
    updateInput: (patch) => set((state) => ({ input: { ...state.input, ...patch } })),
    reset: () => set({ step: 1, input: INITIAL_INPUT }),
}));
