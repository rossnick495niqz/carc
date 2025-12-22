export const isNativePlatform = (): boolean => {
    // Placeholder for Capacitor logic
    // In real app: return Capacitor.isNativePlatform();
    // For now we assume typical web unless explicitly flagged
    return typeof window !== 'undefined' && !!(window as any).Capacitor;
};
