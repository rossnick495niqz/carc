export interface CalculationInput {
    importer_type: 'personal' | 'commercial'; // commercial includes IP/Jur
    origin_country_code: string; // e.g. 'DE', 'KG', 'RU' (for domestic resale?)

    car_type: 'M1' | 'N1' | 'M2' | 'M3' | 'L'; // default M1 (passenger)

    engine_type: 'petrol' | 'diesel' | 'hybrid' | 'electric';
    engine_volume_cc: number; // cm3
    engine_power_hp: number; // for some taxes

    car_price: number;
    car_price_currency: 'EUR' | 'USD' | 'RUB' | 'CNY'; // etc

    manufacture_date: string; // YYYY-MM-DD or just YYYY-MM
    registration_date?: string; // used for age calculation
}

export interface CalculationLineItem {
    id: string; // stable ID for tracking
    name: string; // Human readable label
    value_rub: number;

    formula_display: string; // "20000 * 0.17"
    note?: string; // "Personal import < 3 years"

    source: {
        title: string;
        url?: string;
        date?: string;
    };
}

export interface CalculationResult {
    total_rub: number;
    items: CalculationLineItem[];

    meta: {
        calculated_at: string;
        datapack_version: string;
        age_years_float: number;
    };
}
