import { getEntitlement } from './entitlement';

// Deprecated direct env check, use getEntitlement
export const isPremiumEnabled = (): boolean => {
    return getEntitlement().premium;
}

export const FeatureFlags = {
    // Allows saving and comparing multiple calculation scenarios
    ENABLE_SCENARIO_COMPARISON: true, // Always visible UI, but gated action

    // Allows generating detailed PDF reports
    ENABLE_ADVANCED_PDF: true, // Always visible UI, but gated action

    // Checks if the user has "Pro" status (single source of truth)
    hasProAccess: isPremiumEnabled,
};
