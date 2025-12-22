# Auto Import Calculator

## Deployment

### Cloudflare Pages (Recommended)
1.  Connect your GitHub repository.
2.  **Build Command**: `npm ci && npm run build`
3.  **Output Directory**: `dist`
4.  **Node Version**: Set `NODE_VERSION` env var to `20` (optional but good practice).
5.  *Routing*: The `public/_redirects` file handles SPA routing automatically.

### GitHub Pages
1.  Go to Settings -> Pages.
2.  Source: "GitHub Actions".
3.  The workflow in `.github/workflows/deploy_pages.yml` will deploy on push to main.
4.  *Note*: The workflow attempts to set base path automatically. If issues arise, check `VITE_BASE_URL`.

A professional-grade, offline-first Progressive Web App (PWA) for accurately calculating car import duties and taxes (customs duties, utilization fees) based on official regulations (PP 1291, ETTS 107).

Built with React, TypeScript, Vite, TailwindCSS, and Capacitor for native mobile support.

**Version**: `v1.0.0` (Check footer or `/version.json`)

---

## A) Prerequisites (macOS)

Ensure you have the following installed before starting:

1.  **Node.js**: Recommended via Homebrew.
    ```bash
    brew install node
    node -v # Requires v20+ (LTS recommended)
    ```
2.  **Git**: For version control.
3.  **CocoaPods** (Optional, usually required for some Capacitor iOS plugins):
    ```bash
    brew install cocoapods
    ```

### For Mobile Builds:
*   **iOS**: Install **Xcode** from the Mac App Store. Open it once to accept license agreements.
*   **Android**: Install **Android Studio**. During setup, ensure the **Android SDK** and **Command Line Tools** are installed.

---

## B) Web Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *Troubleshooting*: If you encounter errors, try `rm -rf node_modules package-lock.json && npm install`.

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    *   Open [http://localhost:5173](http://localhost:5173) in your browser.
    *   Changes source files (`src/`) will hot-reload automatically.

---

## C) Web Production

To build the optimized web application:

1.  **Build**:
    ```bash
    npm run build
    ```
    *   Output folder: `dist/`

2.  **Preview locally**:
    ```bash
    npm run preview
    ```
    *   Verifies the `dist/` build runs correctly in a local web server.

---

## D) Capacitor iOS

### One-time Setup:
If the `ios` folder does not exist:
```bash
# Initialize Capacitor (if not already done)
npx cap init "Auto Import" com.carculator.app --web-dir dist

# Install iOS platform
npm install @capacitor/ios
npx cap add ios
```

### Every Change (Development Cycle):
1.  **Build Web Assets**:
    ```bash
    npm run build
    ```
2.  **Sync to Native**:
    ```bash
    npx cap sync
    ```
    *   Copies `dist/` to the native iOS project and updates plugins.
3.  **Open in Xcode**:
    ```bash
    npx cap open ios
    ```
4.  **Run**:
    Inside Xcode, select your Team/Signing Certificate in project settings, choose a Simulator or Device, and hit **Play (Cmd+R)**.

---

## E) Capacitor Android

### One-time Setup:
If the `android` folder does not exist:
```bash
npm install @capacitor/android
npx cap add android
```

### Every Change (Development Cycle):
1.  **Build Web Assets**:
    ```bash
    npm run build
    ```
2.  **Sync to Native**:
    ```bash
    npx cap sync
    ```
3.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
4.  **Run**:
    Wait for Gradle Sync to finish. Click the green **Run** arrow to launch on an Emulator or connected device.

---

## F) App Icons + Splash Screens

The project currently uses default Capacitor/Vite assets. To provide a premium feel:

### 1. Asset Generation
We recommend using **@capacitor/assets** to generate all required sizes from a single source file.

1.  Create `assets/logo.png` (1024x1024, no transparency preference) and `assets/splash.png` (2732x2732).
2.  Install the tool:
    ```bash
    npm install --save-dev @capacitor/assets
    ```
3.  Generate resources:
    ```bash
    npx capacitor-assets generate --iconBackgroundColor '#111111' --splashBackgroundColor '#111111'
    ```

### 2. Manual Adjustments
*   **iOS**: Check `ios/App/App/Assets.xcassets/AppIcon.appiconset`.
*   **Android**: Check `android/app/src/main/res/mipmap-*`.
*   **Web (PWA)**: Update `public/manifest.json`, `public/favicon.ico`, and `public/apple-touch-icon.png`.

---

## G) What is Missing / Roadmap

### ✅ Completed
*   **Core Calculation Engine**: Full logic for `util_fee` (PP 1291) and `customs` (ETTS 107).
*   **Data Layer**: Official JSON schemas with `CurrencyStore` handling EUR/RUB fetching (CBR) and offline fallback.
*   **UI/UX**: Premium animated Wizard (Framer Motion), glassmorphism, Dark UI.
*   **Mobile Config**: Capacitor configured for basic iOS/Android builds.

### 🚧 WIP / Missing
*   **Real-world Assets**:
    *   Store-ready App Icons and Splash Screens are currently placeholders.
    *   Web Manifest icons need specific sizes (192, 512).
*   **Premium Features**:
    *   PDF Export logic (Stub exists in UI).
    *   Cloud Sync / User persistence (Feature flagged off).
*   **Store Deployment**:
    *   Apple Developer Account & Team ID setup.
    *   Google Play Console signing keys generation.
