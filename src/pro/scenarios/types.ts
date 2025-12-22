import { CalculationInput, CalculationLineItem } from "../../core/calc/types";

export interface Scenario {
    id: string; // uuid
    schemaVersion: number; // 2
    appVersion: string; // "1.2.0"
    title: string;
    createdAt: number;
    updatedAt: number;

    input: CalculationInput;
    results: CalculationLineItem[];
    totalRub: number;
    currency: string;

    meta: {
        fxDate: string;
        fxSource: string;
        dataVersion: string;
    };
}

export type ScenarioDelta = {
    totalDiff: number;
    itemDiffs: Record<string, number>; // key: item.name -> diff
}
