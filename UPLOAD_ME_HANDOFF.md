# Auto Import Official Data Layer Handoff

## 1. Official Data Pipeline
The application uses a verified pipeline to fetch and serve official rate data from HTTPS government sources.

### Sources of Truth
*   **Util Fee**: `https://publication.pravo.gov.ru/Document/View/0001202410010001` (Decree No. 1118)
*   **Customs**: `https://docs.eaeunion.org/docs/ru-ru/01415817/clcd_12042018_44` (EAEU Council Decision No. 44 / ETTS)

### Architecture
1.  **Fetch (Build Time)**: `npm run data:fetch` downloads raw documents over HTTPS to `data/official/raw/`.
2.  **Catalog**: `npm run data:build` generates `data/catalog.json` containing:
    *   `source_url`: The exact official HTTPS link.
    *   `checksum`: SHA-256 of the downloaded file.
    *   `raw_path`: Path to `data/official/raw/`.
    *   `parsed_path`: Path to `data/official/parsed/`.
3.  **Parse**: Normalizes verified data into JSON.
4.  **Deploy**: Build step copies `parsed_path` files to `public/data/official/`. The App consumes *only* these local files.

## 2. Validation & Provenance
*   **Zod Schemas**: Strict type checking (`src/data/schemas/index.ts`).
*   **Runtime Safety**: The client-side app **never requests** external government URLs. It only fetches from `/data/official/`.
*   **Transparency**: `catalog.json` provides a complete audit trail of the data source.

## 3. How to Update Data
```bash
# 1. Fetch latest raw files
npm run data:fetch

# 2. Build parsed datasets and catalog
npm run data:build

# 3. Test integrity
npm test

# 4. Commit changes
git add data/official public/data
```

## 4. File Locations
*   **Catalog**: `data/catalog.json` (Source), `public/data/catalog.json` (Runtime).
*   **Raw Docs**: `data/official/raw/*.html`.
*   **Parsed JSON**: `data/official/parsed/*.json` (Source), `public/data/official/*.json` (Runtime).
