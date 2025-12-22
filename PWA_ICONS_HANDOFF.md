# PWA Icons Generation & Handoff
*Date: 2025-12-23*

Standard PNG icons have been generated from the source SVG (`assets/icon.svg`) and integrated into the PWA manifest.

## 1. Generated Assets
The following files were generated in `public/` and are copied to `dist/` on build:

| Filename | Size | Purpose |
| :--- | :--- | :--- |
| `pwa-192x192.png` | 192x192 | Standard home screen icon (Android) |
| `pwa-512x512.png` | 512x512 | Splash screen / App install |
| `maskable-512x512.png` | 512x512 | Adaptive icon (padded content) |
| `apple-touch-icon.png` | 180x180 | iOS Home Screen |

## 2. Manifest Configuration
`vite.config.ts` was updated to reference these PNGs instead of the SVG.
- **Scope/Start URL:** Default (relative)
- **Icons:** 
    - 192x192 (any)
    - 512x512 (any)
    - 512x512 (maskable)

## 3. How to Regenerate
If `assets/icon.svg` is updated, run these commands from project root (macOS only):

```bash
# 1. Render base high-res PNG
qlmanage -t -s 1024 -o /tmp assets/icon.svg
mv /tmp/icon.svg.png /tmp/icon_1024.png

# 2. Resize Standard Icons
sips -z 192 192 /tmp/icon_1024.png --out public/pwa-192x192.png
sips -z 512 512 /tmp/icon_1024.png --out public/pwa-512x512.png
sips -z 180 180 /tmp/icon_1024.png --out public/apple-touch-icon.png

# 3. Create Maskable Icon (Pad inner 384px to 512px)
sips -z 384 384 /tmp/icon_1024.png --out /tmp/icon_384.png
sips --padToHeightWidth 512 512 --padColor 171717 /tmp/icon_384.png --out public/maskable-512x512.png
```

## 4. Verification
Run `npm run build` and check `dist/`:
```bash
ls -la dist | grep "pwa\|maskable\|apple"
```
Check `dist/manifest.webmanifest` for valid JSON references.
