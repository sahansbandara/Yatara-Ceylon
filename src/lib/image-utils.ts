export function normalizeImageUrl(src?: string | null, fallback?: string): string {
    if (!src) return fallback || '';

    const trimmed = src.trim();
    const protocolIndex = trimmed.indexOf('https://');
    const httpIndex = trimmed.indexOf('http://');
    const absoluteIndex = protocolIndex > 0
        ? protocolIndex
        : httpIndex > 0
            ? httpIndex
            : -1;

    const sanitized = absoluteIndex > 0 ? trimmed.slice(absoluteIndex) : trimmed;

    if (sanitized.startsWith('http://') || sanitized.startsWith('https://') || sanitized.startsWith('/')) {
        return sanitized;
    }

    return fallback || sanitized;
}
