# Store-Ready Skeleton Handoff (v1.3)

## Components
- **Core Abstraction**: `src/pro/iap/types.ts` & `provider.ts`.
- **Stub Provider**: `src/pro/iap/providers/stub.ts` (Mock purchases).
- **Manager**: `src/pro/iap/index.ts` (Singleton).
- **Entitlement**: Updated `src/pro/entitlement.ts` to check `localStorage['iap_stub_purchased']`.

## How to Test Purchase (Stub)
1. Run app locally (`npm run dev`).
2. Set environment: `VITE_IAP_PROVIDER=stub` (default).
3. To mimic successful purchase, set `VITE_IAP_STUB_SUCCESS=1` in `.env` or just rely on Stub default behavior if modified.
   - Currently, Stub provider logs to console and fails unless `VITE_IAP_STUB_SUCCESS=1`.
   - **Action**: Add `VITE_IAP_STUB_SUCCESS=1` to `.env.local` to test success flow.

## Native Integration Plan
1. **iOS/Android Config**: See `src/pro/iap/native/config.ts`.
2. **Capacitor Plugin**: Recommended `capacitor-iap` or RevenueCat (`@revenuecat/purchases-capacitor`).
3. **Implementation**:
   - Create `src/pro/iap/providers/capacitor.ts` implementing `IAPProvider`.
   - Update `src/pro/iap/index.ts` to switch provider based on `isNativePlatform()`.

## Limitations
- **No Cross-Platform Sync**: Users buying on iOS cannot restore on Android without a backend user system.
- **Entitlement Security**: Purely client-side for now (vulnerable on rooted devices, but acceptable for MVP).

## Verified
- [x] Unit Tests (Entitlement, Stub).
- [x] Build & Logic.
- [x] UI Wiring (Info Screen).
