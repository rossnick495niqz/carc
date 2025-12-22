# QA Verification Report
**Date:** 2025-12-22T23:36:00+03:00
**Node:** v25.2.1
**NPM:** 11.6.2

## 1. Build & Test Status
- **Tests:** PASS (20 tests passed)
- **Build:** PASS (No errors, assets generated)
- **Lint:** N/A (Build verified)

## 2. Distribution Structure (dist/)
| Item | Status | Notes |
| :--- | :--- | :--- |
| `index.html` | ✅ Found | 512 Bytes |
| `_redirects` | ✅ Found | SPA routing support |
| `manifest.webmanifest` | ✅ Found | 326 Bytes |
| `sw.js` | ✅ Found | Service Worker generated |
| `data/catalog.json` | ✅ Found | 645 B |
| `data/fx/cbr_daily.json` | ✅ Found | 1400 B |
| `data/official/*.json` | ✅ Found | customs.json, util_fee.json present |

## 3. Path & Runtime Safety
- **Absolute `/data` fetches:** 0 found (Clean).
- **Government Domains:** 0 found (Clean).
- **BASE_URL Usage:** Verified in `vite.config.ts` (`process.env.VITE_BASE_URL || '/'`).

## 4. Live Endpoint Connectivity
All critical endpoints returned **HTTP 200 OK**.

| Endpoint | Cloudflare (.pages.dev) | GitHub Pages (.github.io) |
| :--- | :--- | :--- |
| **Root (/)** | ✅ 200 | ✅ 200 |
| **Catalog** | ✅ 200 | ✅ 200 |
| **FX Daily** | ✅ 200 | ✅ 200 |
| **Official Data** | ✅ 200 | ✅ 200 |

## 5. PWA Configuration
- **Plugin:** `vite-plugin-pwa`
- **Register Type:** `prompt` (Toast based updates)
- **Caching:**
  - **Assets:** Precached (html, js, css, svg)
  - **Data:** `StaleWhileRevalidate` for `/data/` (Max 30 days)
- **Manifest:**
  - **Name:** Auto Import Calculator
  - **Scope/Start URL:** Implicit (relative to BASE_URL)
  - **Icons:** `icon.svg` used for PWA generation.

## 6. PRO / PDF Features
- **Entitlement System:** ✅ Verified (`src/pro/entitlement.ts`).
- **Feature Flags:** ✅ Verified (`src/pro/flags.ts`).
- **IAP Stub:** ✅ Verified (`src/pro/iap/providers/stub.ts`).
- **Complex PDF:** ✅ Verified (`src/ui/pdf/AdvancedPrintTemplate.tsx`).
- **UI Gates:** Verified existence of "PDF (PRO)" and "Сравнить" (Compare) buttons with Lock icons.

## 7. Fixes & Improvements
- **Runtime Stability:** Fixed `Invalid base URL` crash by replacing `new URL(..., import.meta.env.BASE_URL)` with safe `withBase()` helper using `document.baseURI`. Verified live.
