# PRO Bundle Handoff

## Summary
Successfully implemented PRO features (Scenario Comparison, Advanced PDF) and verified regression baseline.

## Features Added

### 1. Feature Flags (`src/pro/flags.ts`)
- **Premium Gating**: Features are locked by default.
- **Dev Override**: enable by setting `VITE_PREMIUM=1` in `.env` or build command.

### 2. Scenario Comparison (PRO)
- **Save Scenario**: Free feature for all users (IndexedDB storage).
- **Compare Mode**: PRO-only. Compares up to 3 scenarios side-by-side.
- **UI**: Added "Compare" button to Result Screen.

### 3. Advanced PDF Report (PRO)
- **Basic PDF**: Remains free (simple screenshot-based).
- **Advanced PDF**: PRO-only. Professional layout, branding, legal transparency section.
- **Logic**: Uses `AdvancedPrintTemplate.tsx` rendered off-screen.

## Verified Regression Baseline
- [x] **Build**: Production build passes (`npm run build`).
- [x] **Tests**: Unit tests pass (`npm test`).
- [x] **Deployment**: `dist` structure is correct for Cloudflare/GitHub Pages.
- [x] **Assets**: Mobile assets (`assets/icon.svg`, `assets/splash.svg`) preserved.
- [x] **Path Safety**: No absolute `/data` fetches introduced.

## How to Test
1. **Enable Pro**:
   ```bash
   VITE_PREMIUM=1 npm run dev
   ```
2. **Test Comparison**:
   - Calculate -> "Сохранить" -> Enter name.
   - Click "Сравнить".
   - Select saved scenario in Slot B.
3. **Test PDF**:
   - Click "PDF (PRO)".
   - Verify generated PDF includes "Advanced" branding and disclaimer footer.

## GitHub Pages Routing Status
**Strategy**: Single Route + Hash Fragment (Compatible).
- No `404.html` or `HashRouter` required as the app relies on hash fragments (e.g. `/#eyJ...`) for state restoration.
- Deep linking works via Hashes. Path-based routing (e.g. `/saved`) is not implemented to avoid GH Pages 404s.

## Known Quirks
- **PDF Generation**:
  - **Loader**: Added "Loading..." state and disabled buttons during generation.
  - **Fallback**: If Advanced PDF generation fails, an alert suggests using the Basic PDF.
  - **iOS Safari**: File download interaction may vary. Use "Share" -> "Save to Files" or "Open in New Tab" if automatic download is blocked.
- **SPA Routing**: Relying on Hash strategy avoids server-side configuration needs.

