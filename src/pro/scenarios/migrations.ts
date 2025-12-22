import { Scenario } from './types';

// const LATEST_SCHEMA = 2;
const CURRENT_APP_VERSION = '1.2.0'; // Hardcoded for now or import from package.json

export const migrateScenarios = (stored: any[]): Scenario[] => {
    return stored.map(s => migrateOne(s));
};

const migrateOne = (raw: any): Scenario => {
    let current = { ...raw };

    // V0/V1 -> V2
    if (!current.schemaVersion || current.schemaVersion < 2) {
        current.schemaVersion = 2;
        current.appVersion = CURRENT_APP_VERSION;

        // Ensure meta exists
        if (!current.meta) {
            current.meta = {
                fxDate: new Date().toISOString(), // Fallback
                fxSource: 'CBR (Migrated)',
                dataVersion: 'Legacy'
            };
        }

        // Ensure updateAt
        if (!current.updatedAt) {
            current.updatedAt = current.createdAt || Date.now();
        }
    }

    return current as Scenario;
};
