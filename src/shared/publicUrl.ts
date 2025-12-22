/**
 * Safely constructs a public URL using the configured BASE_URL.
 * Guarantees an absolute URL to avoid "Invalid base URL" errors.
 */
export function publicUrl(path: string): string {
    // Remove leading slash to avoid double slashes when joining
    const clean = path.replace(/^\/+/, "");

    // Ensure base is absolute by combining BASE_URL with origin
    const base = new URL(import.meta.env.BASE_URL, window.location.origin).toString();

    return new URL(clean, base).toString();
}
