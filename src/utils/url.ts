/**
 * Safely constructs a URL relative to the current document base.
 * @param path - The relative path to append (e.g. 'data/catalog.json')
 * @returns The absolute URL string
 */
export function withBase(path: string): string {
    // Remove leading slash to avoid double slashes when joining
    const safePath = path.replace(/^\//, '');

    // Use document.baseURI which is always absolute in the browser
    // handling <base> tags or standard path resolution.
    // Fallback to location.origin + pathname if baseURI is missing (rare).
    const base = document.baseURI || window.location.origin + window.location.pathname;

    return new URL(safePath, base).toString();
}
