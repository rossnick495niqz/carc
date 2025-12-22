# PRO Hardening Handoff (v1.2)

## Changes
- **Entitlement**: `src/pro/entitlement.ts` (Flag/Local override).
- **UI**: 
  - `src/pro/ui/ProLockedModal.tsx` (Paywall).
  - `src/pro/ui/ProInfoScreen.tsx` (Benefits).
  - `src/pro/scenarios/ScenarioManager.tsx` (Management).
- **Storage**:
  - `src/pro/scenarios/migrations.ts` (V1 -> V2).
  - `src/pro/scenarios/types.ts` (Metadata).
  - Limits enforced (Max 10 saved, 3 compare).

## Gating Logic
Entitlement is determined by `getEntitlement()`:
1. Environment Variable: `VITE_PREMIUM=1` (Build/Dev).
2. Local Storage Override: `localStorage.setItem('premium_override', 'true')` (QA).
3. Default: `false`.

All UI components (Wizard, Compare) use this single source of truth.

## Scenario Storage
- **Schema**: V2 (includes `schemaVersion`, `appVersion`, `meta`).
- **Migrations**: Auto-runs on load. Upgrades legacy scenarios.
- **Limits**: 
  - Max 10 scenarios.
  - Attempting to save >10 triggers "Manage Scenarios" flow.

## PDF Resilience
- **Timeouts**: Generation limited to 20s.
- **Fallback**: Auto-suggests Basic PDF on timeout or error from Advanced PDF engine.
- **iOS**: DOM templates use `pdf-` prefix to avoid conflicts.

## Regression Results
- [x] **Base URL**: No absolute fetches found.
- [x] **Assets**: Icon/Splash present.
- [x] **Tests**: `npm test` passed (Entitlement, Migrations).
- [x] **Build**: `npm run build` passed.
