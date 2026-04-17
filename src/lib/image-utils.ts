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

export const DEFAULT_IMAGE_BLUR_DATA_URL =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' x2='100%25' y1='0%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23091d16'/%3E%3Cstop offset='50%25' stop-color='%2313342a'/%3E%3Cstop offset='100%25' stop-color='%23091d16'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='16' height='9' fill='url(%23g)'/%3E%3C/svg%3E";

export function getPlaceThumbnailSrc(src?: string | null): string {
    const normalized = normalizeImageUrl(src, '/images/hints/scenic.jpg');

    if (!normalized.startsWith('/images/places/')) {
        return normalized;
    }

    const filename = normalized
        .slice('/images/places/'.length)
        .replace(/\.(webp|png|jpe?g)$/i, '.jpg');

    return `/images/places/thumbs/${filename}`;
}
