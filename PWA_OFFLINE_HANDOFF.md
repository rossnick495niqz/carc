# PWA Offline Capability Handoff (v1.4)

## Architecture
- **Plugin**: `vite-plugin-pwa` with Workbox.
- **Strategy**: 
  - **Assets**: Precached (index.html, js, css, icons).
  - **Data**: Runtime cached (`StaleWhileRevalidate`) for `/data/*`.
- **UI**: `src/pwa/PwaManager.tsx` handles Offline Banner and Update Toast.

## Offline Behavior
1. **First Load**: Must be online to fetch basic assets and initial data pack.
2. **Subsequent Loads**: Works fully offline.
3. **Data Updates**:
   - App checks for updates in background.
   - If `catalog.json` or `fx` changes, new data is cached.
   - UI reflects "stale" data while revalidating.

## Installation
- **iOS**: "Share" -> "Add to Home Screen".
- **Android/Chrome**: Install prompt appears automatically (or via browser menu).
- **Desktop**: Installable as a Chrome App.

## Verification
- **Smoke Test**:
  1. Open app online. Wait for data load.
  2. Disconnect WiFi.
  3. Refresh page (Cmd+R).
  4. App should load, banner shows "Оффлайн: используем кэш".
  5. Calculations should work.

## Known Limitations
- **iOS Safari**: 50MB storage limit for cache.
- **Updates**: User must click "Обновить" in the toast to activate new Service Worker version (skipWaiting).
