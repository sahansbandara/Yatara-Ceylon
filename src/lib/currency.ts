/**
 * Centralized LKR currency formatting for dashboard pages.
 *
 * Public-facing pages use CurrencyContext (supports USD toggle).
 * Dashboard/partner pages always display in LKR — use these helpers.
 */

/**
 * Format a number as Sri Lankan Rupees.
 * Example: 31000 → "LKR 31,000"
 */
export function formatLKR(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Compact LKR formatter for KPI cards and tight spaces.
 * Example: 1500000 → "LKR 1.5M", 45000 → "LKR 45K"
 */
export function formatLKRCompact(amount: number): string {
    if (amount >= 1_000_000) return `LKR ${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `LKR ${(amount / 1_000).toFixed(0)}K`;
    return formatLKR(amount);
}
