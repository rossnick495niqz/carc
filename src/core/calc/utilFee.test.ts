import { describe, it, expect } from 'vitest';
import { calculateUtilFee, calculateCarAge } from './utilFee';
import { UtilFeeTable } from '../datapack/types';

// Mock Data
const MOCK_TABLE: UtilFeeTable = {
    version: "test-v1",
    rates: [
        {
            category: "M1",
            importer_type: "personal",
            age_years: [0, 3],
            engine_volume: [0, 3000],
            base_rate: 20000,
            k: 0.17,
            source_ref: "REF"
        },
        {
            category: "M1",
            importer_type: "commercial",
            age_years: [0, 3],
            engine_volume: [1000, 2000],
            base_rate: 20000,
            k: 15.03,
            source_ref: "REF"
        }
    ]
};

describe('calculateCarAge', () => {
    it('should calculate age correctly', () => {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const age = calculateCarAge(oneYearAgo.toISOString());
        expect(age).toBeCloseTo(1.0, 1);
    });
});

describe('calculateUtilFee', () => {
    it('should find rate for personal import of new car', () => {
        const input: any = {
            importer_type: 'personal',
            car_type: 'M1',
            engine_volume_cc: 1500,
            manufacture_date: new Date().toISOString(), // 0 years old
        };

        const result = calculateUtilFee(input, MOCK_TABLE);
        expect(result).toHaveLength(1);
        expect(result[0].value_rub).toBe(20000 * 0.17);
    });

    it('should find rate for commercial import', () => {
        const input: any = {
            importer_type: 'commercial',
            car_type: 'M1',
            engine_volume_cc: 1500,
            manufacture_date: new Date().toISOString(),
        };

        const result = calculateUtilFee(input, MOCK_TABLE);
        expect(result).toHaveLength(1);
        expect(result[0].value_rub).toBe(20000 * 15.03);
    });

    it('should return error item if no match', () => {
        const input: any = {
            importer_type: 'personal',
            car_type: 'M1',
            engine_volume_cc: 5000, // No rule in mock
            manufacture_date: new Date().toISOString(),
        };

        const result = calculateUtilFee(input, MOCK_TABLE);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('util_fee_error');
    });
});
