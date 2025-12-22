import { create } from 'zustand';
import { withBase } from '../../utils/url';
import { DataPackManifestSchema, UtilFeeTableSchema, CustomsTableSchema, type DataPackManifest, type UtilFeeTable, type CustomsTable } from './types';

interface DataPackState {
    manifest: DataPackManifest | null;
    tables: {
        util_fee: UtilFeeTable | null;
        customs: CustomsTable | null;
    };
    isLoading: boolean;
    error: string | null;

    initialize: () => Promise<void>;
    loadTable: (tableName: 'util_fee' | 'customs') => Promise<void>;
}

const DATA_PACK_BASE_URL = '/datapack'; // simplified for dev

export const useDataPackStore = create<DataPackState>((set, get) => ({
    manifest: null,
    tables: {
        util_fee: null,
        customs: null,
    },
    isLoading: false,
    error: null,

    initialize: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${DATA_PACK_BASE_URL}/manifest.json`);
            if (!response.ok) throw new Error('Failed to fetch manifest');

            const json = await response.json();
            const manifest = DataPackManifestSchema.parse(json);

            set({ manifest, isLoading: false });

            // Preload critical tables
            // Load Catalog first to check versions
            // For MVP v1.0, we just load the files directly from /data/official/
            // In v1.1 we will check catalog.json for versioning vs local cache.

            const [utilFeeRes, customsRes] = await Promise.all([
                fetch(withBase('data/official/util_fee.json')),
                fetch(withBase('data/official/customs.json')),
                fetch(withBase('data/catalog.json')).catch(() => null)
            ]);

            if (!utilFeeRes.ok || !customsRes.ok) throw new Error('Failed to fetch official data tables');

            const rawUtil = await utilFeeRes.json();
            const rawCustoms = await customsRes.json();

            // Runtime Safety: Validate against Schemas
            // We need to import schemas. Ideally these are shared.
            // For now, we perform a basic structural check or assume the build pipeline did its job.
            // But prompt asks for "DataPackStore must validate... at runtime".
            // Since schemas are in src/data/schemas/index.ts, we can import them.
            // (Imports might need adjustment depending on strict mode/paths, but assuming src/ relative works)

            const utilFeeData = UtilFeeTableSchema.parse(rawUtil);
            const customsData = CustomsTableSchema.parse(rawCustoms);

            set({
                tables: {
                    'util_fee': utilFeeData,
                    'customs': customsData
                },
                isLoading: false,
            });
        } catch (err) {
            console.error(err);
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    loadTable: async (tableName) => {
        const { manifest, tables } = get();
        if (!manifest) return;
        if (tables[tableName]) return; // already loaded

        set({ isLoading: true });
        try {
            const relativePath = manifest.tables[tableName];
            if (!relativePath) throw new Error(`Table ${tableName} not found in manifest`);

            const response = await fetch(`${DATA_PACK_BASE_URL}/${relativePath}`);
            if (!response.ok) throw new Error(`Failed to fetch table ${tableName}`);

            const json = await response.json();

            // Validate based on table name
            let parsedData;
            if (tableName === 'util_fee') {
                parsedData = UtilFeeTableSchema.parse(json);
            } else if (tableName === 'customs') {
                parsedData = CustomsTableSchema.parse(json);
            } else {
                throw new Error(`Unknown schema for table ${tableName}`);
            }

            set((state) => ({
                tables: { ...state.tables, [tableName]: parsedData },
                isLoading: false
            }));
        } catch (err) {
            console.error(err);
            set({ error: (err as Error).message, isLoading: false });
        }
    },
}));
