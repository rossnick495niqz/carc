# Data Extraction Process

This document describes how official government documents are transformed into the JSON data used by the Auto Import Calculator.

## 1. Raw Data Acquisition
*   **Source**: Official government portals (`pravo.gov.ru`, `eec.eaeunion.org`).
*   **Method**: `scripts/data/fetch_raw.ts` (Automated HTTP Fetch).
*   **Output**: Saved to `data/official/raw/`.
*   **Verification**: SHA-256 checksums stored in `data/catalog.json`.

## 2. Parsing & Normalization
Currently, the parsing process involves **Manual Extraction Verification** due to the unstructured nature of the source PDF/HTML documents. 

1.  **Read**: The raw file is read to verify existence.
2.  **Verify**: The contents are manually checked against the known values (defined `scripts/data/build_parsed.ts`).
3.  **Generate**: The script outputs normalized JSON adhering to the `UtilFeeTableSchema` and `CustomsTableSchema`.

## 3. Automation
Run the full pipeline:
```bash
# 1. Download official docs
npx tsx scripts/data/fetch_raw.ts

# 2. Generate Catalog (Checksums)
npx tsx scripts/data/build_catalog.ts

# 3. Generate Validated JSONs
npx tsx scripts/data/build_parsed.ts

# 4. Deploy to App
# (Handled by build script: Copies to public/data/official/)
```

## 4. Updates
To update rates:
1.  Verify official source for new decrees.
2.  Update URLs in `fetch_raw.ts` if needed.
3.  Update the manual rate structures in `build_parsed.ts`.
4.  Run the pipeline.
