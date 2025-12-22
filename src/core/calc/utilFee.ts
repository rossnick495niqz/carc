import { UtilFeeTable } from '../datapack/types';
import { CalculationInput, CalculationLineItem } from './types';

// Helper to calculate age from dates
export function calculateCarAge(manufactureDate: string): number {
    const mDate = new Date(manufactureDate);
    const now = new Date();

    // Diff in milliseconds
    const diff = now.getTime() - mDate.getTime();
    // Years float
    return diff / (1000 * 60 * 60 * 24 * 365.25);
}

export function calculateUtilFee(
    input: CalculationInput,
    table: UtilFeeTable
): CalculationLineItem[] {
    const age = calculateCarAge(input.manufacture_date);
    const isElectric = input.engine_type === 'electric';


    // Find matching rate
    const rate = table.rates.find(r => {
        // 1. Match category (assume M1 for now)
        if (r.category !== input.car_type) return false;

        // 2. Match importer (phys/jur)
        // Note: rules are complex. "Personal" only applied if specific criteria met.
        // For now assume input.importer_type maps directly (wizard logic will handle "is it really personal?")
        if (r.importer_type !== input.importer_type) return false;

        // 3. Match age
        if (age < r.age_years[0] || age >= r.age_years[1]) return false;

        // 4. Match Engine Type (Electric/Hybrid/ICE)
        // If the rule specifies 'electric', we must match it.
        // If the rule doesn't specify 'electric' (undefined), we assume it's for ICE (electric=false).

        const ruleIsElectric = !!r.electric;
        if (isElectric !== ruleIsElectric) return false;

        // 5. Match engine volume
        if (r.engine_volume) {
            // Electric cars often have 0 volume in input, ensuring [0,0] or [0,999] matches
            if (input.engine_volume_cc <= r.engine_volume[0] || input.engine_volume_cc > r.engine_volume[1]) {
                return false;
            }
        }

        return true;
    });

    if (!rate) {
        // If no match found, ideally return an error item or 0 with warning
        return [{
            id: 'util_fee_error',
            name: 'Утилизационный сбор',
            value_rub: 0,
            formula_display: 'Не найдена ставка',
            note: `Нет ставки для Age=${age.toFixed(1)}, Vol=${input.engine_volume_cc}`,
            source: { title: 'N/A' }
        }];
    }

    const val = rate.base_rate * rate.k;

    return [{
        id: 'util_fee',
        name: 'Утилизационный сбор',
        value_rub: val,
        formula_display: `${rate.base_rate} × ${rate.k}`,
        note: `Базовая ставка × Коэф. (${rate.category}, ${input.importer_type === 'personal' ? 'Физлицо' : 'Юрлицо'})`,
        source: {
            title: rate.source_ref,
            // In real app, look up source_ref in manifest to get full URL
        }
    }];
}
