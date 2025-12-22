export const FEATURE_FLAGS = {
    ENABLE_DETAILED_REPORT: false,
    ENABLE_CLOUD_SYNC: false,
    ENABLE_CURRENCY_HISTORY: false,
};

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
    // In real app, check remote config or purchase state
    return FEATURE_FLAGS[flag];
}
