import { FxSnapshot } from './types';

/**
 * Converts an amount from one currency to another using the provided snapshot.
 * Base currency is always deemed to be RUB for CBR data structure.
 */
export function convertFx(
    amount: number,
    from: string,
    to: string,
    snapshot: FxSnapshot
): { value: number; rate: number; nominal: number } {
    // 1. Normalize to RUB
    let valueInRub = 0;
    let fromRate = 1;
    let fromNominal = 1;

    if (from === 'RUB') {
        valueInRub = amount;
    } else {
        const rate = snapshot.Valute[from];
        if (!rate) throw new Error(`Currency ${from} not found in snapshot`);
        fromRate = rate.Value;
        fromNominal = rate.Nominal;
        valueInRub = (amount / rate.Nominal) * rate.Value;
    }

    // 2. Convert RUB to target
    if (to === 'RUB') {
        // If getting RUB value, we really just want the valueInRub.
        // The "rate" is implied from the distinct step above.
        return {
            value: valueInRub,
            rate: fromRate,
            nominal: fromNominal
        };
    } else {
        const rate = snapshot.Valute[to];
        if (!rate) throw new Error(`Currency ${to} not found in snapshot`);

        const value = (valueInRub * rate.Nominal) / rate.Value;

        // Cross-rate calculation is complex to represent in one "rate" number
        // usually we return the resulting value.
        // If strict breakdown needed, we might need return separate metadata.

        return {
            value,
            rate: rate.Value, // This is rate of Target to RUB
            nominal: rate.Nominal
        };
    }
}
