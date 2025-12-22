import { describe, it, expect, beforeEach } from 'vitest';
import { getEntitlement } from './entitlement';
import { migrateScenarios } from './scenarios/migrations';

describe('PRO Hardening', () => {

    describe('Entitlement', () => {
        // const originalLocalStorage = global.localStorage;

        beforeEach(() => {
            // Mock localStorage
            const store: Record<string, string> = {};
            global.localStorage = {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => { store[key] = value; },
                removeItem: (key: string) => { delete store[key]; },
                clear: () => { },
                key: () => null,
                length: 0
            };
        });

        // Restore after tests (optional, but good practice if other tests needed real one)
        // afterEach(() => { global.localStorage = originalLocalStorage; });

        it('should return false by default', () => {
            const e = getEntitlement();
            expect(e.premium).toBe(false);
        });

        // Note: Can't easily mock import.meta.env or localStorage in this setup without setupFiles.
        // But we can verify default behavior.
    });

    describe('Migrations', () => {
        it('should migrate V0/V1 to V2', () => {
            const legacy = [
                { id: '1', title: 'Old', createdAt: 100 }
            ];

            const migrated = migrateScenarios(legacy);

            expect(migrated[0].schemaVersion).toBe(2);
            expect(migrated[0].appVersion).toBe('1.2.0');
            expect(migrated[0].meta.dataVersion).toBeDefined();
            expect(migrated[0].updatedAt).toBeDefined();
        });

        it('should leave V2 untouched', () => {
            const v2 = [
                { id: '2', schemaVersion: 2, appVersion: '1.2.0', meta: { test: 1 } }
            ];
            const migrated = migrateScenarios(v2);
            expect(migrated[0]).toEqual(v2[0]);
        });
    });
});
