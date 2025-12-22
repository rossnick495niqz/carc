import { CustomsTable } from '../datapack/types';
import { CalculationInput, CalculationLineItem } from './types';
import { calculateCarAge } from './utilFee';
import { FxSnapshot } from '../../fx/types';
import { convertFx } from '../../fx/convert';

export function calculateCustomsDuty(
    input: CalculationInput,
    table: CustomsTable,
    fx: FxSnapshot
): CalculationLineItem[] {
    const age = calculateCarAge(input.manufacture_date);

    // Get EUR rate for final display conversion if needed, or intermediate logic
    // We heavily rely on EUR for brackets.
    // However, final values are in RUB.

    // Find matching rate
    const rate = table.rates.find(r => {
        // 1. Match Importer
        if (r.importer_type !== input.importer_type) return false;

        // 2. Match Age
        if (age < r.age_years[0] || age >= r.age_years[1]) return false;

        // 3. Match Engine Volume (if specified by rule)
        if (r.engine_volume) {
            if (input.engine_volume_cc <= r.engine_volume[0] || input.engine_volume_cc > r.engine_volume[1]) {
                return false;
            }
        }

        // 4. Match Price (if specified by rule)
        if (r.price_eur) {
            // Convert input price to EUR using strict FX logic
            const priceInEur = convertFx(input.car_price, input.car_price_currency, 'EUR', fx).value;

            if (priceInEur <= r.price_eur[0] || priceInEur > r.price_eur[1]) return false;
        }

        return true;
    });

    if (!rate) {
        return [{
            id: 'customs_duty_error',
            name: 'Таможенная пошлина',
            value_rub: 0,
            formula_display: 'Не найдена ставка',
            note: `Возраст: ${age.toFixed(1)} лет, Объем: ${input.engine_volume_cc}, Цена: ${input.car_price} ${input.car_price_currency}`,
            source: { title: 'N/A' }
        }];
    }

    let valueEur = 0;
    let formula = '';

    // We need to determine the 'customs value' in EUR for percentage calculations
    // If rate is %, applied to price.
    // Price must be in EUR? No, percentage is applied to value regardless of currency, but result is in that currency?
    // ETTS says percentages are usually of the "customs value". 
    // We will normalize customs value to EUR for simplicity of display, then convert final to RUB.
    // OR we convert input price to RUB, apply %, then we have RUB.


    const priceInEur = convertFx(input.car_price, input.car_price_currency, 'EUR', fx).value;

    // Logic A: Percentage based
    if (rate.rate_percentage !== undefined && rate.min_eur_per_cc === undefined) {
        // usually 48% or 54% of value
        // Result is in EUR usually? No, duty is calculated in local currency equivalent.
        // It's safer to calculate in EUR if brackets are EUR, but duty is payable in RUB.
        // Let's stick to EUR base for internal logic consistency with min_eur_per_cc
        valueEur = priceInEur * (rate.rate_percentage / 100);
        formula = `${rate.rate_percentage}% от стоимости`;
    }

    // Logic B: Percentage but not less than X EUR/cc
    else if (rate.rate_percentage !== undefined && rate.min_eur_per_cc !== undefined) {
        const valProc = priceInEur * (rate.rate_percentage / 100);
        const valVol = input.engine_volume_cc * rate.min_eur_per_cc;
        valueEur = Math.max(valProc, valVol);
        formula = `Max(${rate.rate_percentage}%, ${rate.min_eur_per_cc}€/см³)`;
    }

    // Logic C: Fixed rate per cc
    else if (rate.fixed_rate_eur !== undefined) {
        valueEur = input.engine_volume_cc * rate.fixed_rate_eur;
        formula = `${input.engine_volume_cc} см³ × ${rate.fixed_rate_eur}€`;
    }

    // Convert final EUR duty to RUB
    // Note: If we really wanted to be precise, we'd use CBN rate for duty.
    // converting valueEur -> Rub
    const eurToRub = fx.Valute['EUR'].Value; // rate.Value is RUB per 1 EUR
    const valueRub = valueEur * eurToRub;

    return [{
        id: 'customs_duty',
        name: 'Таможенная пошлина',
        value_rub: valueRub,
        formula_display: formula + ` × ${eurToRub.toFixed(2)}₽`,
        note: `Ставка для ${input.importer_type === 'personal' ? 'физлиц' : 'юрлиц'}, возраст ${age.toFixed(1)} лет`,
        source: {
            title: rate.source_ref,
        }
    }];
}
