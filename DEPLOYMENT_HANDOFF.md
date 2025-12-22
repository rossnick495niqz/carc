# Deployment Handoff

## 1. Hosting Recommendation
**Primary Choice: Cloudflare Pages**
*   **Why**: Free, fastest global CDN, native SPA support (`_redirects`), instant builds, zero config for HTTPS/SSL.
*   **Reliability**: Excellent uptime and performance for Russian audience.

## 2. Cloudflare Pages Settings
*   **Project Name**: `carculator` (or your choice)
*   **Framework Preset**: Vite (or None)
*   **Build Command**: `npm ci && npm run build`
*   **Output Directory**: `dist`
*   **Environment Variables**: `NODE_VERSION=20` (Optional)

### SPA Routing
We added `public/_redirects` with `/* /index.html 200`. This ensures reloading pages like `/result` works correctly on Cloudflare by serving the index code.

## 3. GitHub Pages (Optional)
A workflow `.github/workflows/deploy_pages.yml` is included.
*   **Setup**: Repo Settings -> Pages -> Source: "GitHub Actions".
*   **Base Path**: The workflow dynamically sets the base URL (e.g., `/carculator/`) for asset loading.

## 4. Code Changes for Hosting
We fixed absolute path issues to support subdirectories (like GitHub Pages) and clean deployment.

*   **BASE_URL Fixes applied to**:
    *   `src/core/datapack/store.ts` (Official Data fetch)
    *   `src/fx/store.ts` (FX Fallback fetch)
    *   `vite.config.ts` (Build configuration)
*   **Logic**: fetches use `new URL('path', import.meta.env.BASE_URL)` to resolve correct paths relative to the host root.

## 5. Verification Checklist
After deploy:
1.  [ ] **Open the site**: Ensure it loads without white screen.
2.  [ ] **Check Data**: Open DevTools Network tab. Verify `util_fee.json` / `customs.json` fetch URLs are correct (e.g. `https://your-site/data/official/util_fee.json`).
3.  [ ] **Refresh Page**: Go to a step (e.g. `/params`), refresh the browser. It should **not** 404.
4.  [ ] **Offline**: Turn off WiFi, refresh. App should load (if PWA/ServiceWorker active) or at least show offline UI.
