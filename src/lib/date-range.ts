export type DateRangePreset = 'today' | 'last7' | 'last30' | 'mtd' | 'qtd' | 'ytd';

export const DATE_RANGE_PRESET_OPTIONS: Array<{ value: DateRangePreset; label: string }> = [
    { value: 'today', label: 'Today' },
    { value: 'last7', label: '7D' },
    { value: 'last30', label: '30D' },
    { value: 'mtd', label: 'MTD' },
    { value: 'qtd', label: 'QTD' },
    { value: 'ytd', label: 'YTD' },
];

export function isDateRangePreset(value?: string): value is DateRangePreset {
    return DATE_RANGE_PRESET_OPTIONS.some((option) => option.value === value);
}

export function formatDateInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function resolveDateRangePreset(
    preset: DateRangePreset,
    baseDate = new Date()
) {
    const start = new Date(baseDate);
    const end = new Date(baseDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    switch (preset) {
        case 'today':
            break;
        case 'last7':
            start.setDate(start.getDate() - 6);
            break;
        case 'last30':
            start.setDate(start.getDate() - 29);
            break;
        case 'mtd':
            start.setDate(1);
            break;
        case 'qtd': {
            const quarterStartMonth = Math.floor(start.getMonth() / 3) * 3;
            start.setMonth(quarterStartMonth, 1);
            break;
        }
        case 'ytd':
            start.setMonth(0, 1);
            break;
    }

    return {
        from: formatDateInput(start),
        to: formatDateInput(end),
    };
}

export function getDateRangeLabel(
    from?: string,
    to?: string,
    preset?: string
) {
    if (preset && isDateRangePreset(preset)) {
        return DATE_RANGE_PRESET_OPTIONS.find((option) => option.value === preset)?.label || 'Custom';
    }

    if (from && to) return `${from} to ${to}`;
    if (from) return `From ${from}`;
    if (to) return `Until ${to}`;
    return 'All time';
}

export function buildMonthBuckets(from: string, to: string) {
    const cursor = new Date(`${from}T00:00:00.000Z`);
    cursor.setUTCDate(1);
    const end = new Date(`${to}T00:00:00.000Z`);
    end.setUTCDate(1);
    const multiYear = cursor.getUTCFullYear() !== end.getUTCFullYear();

    const buckets: Array<{ year: number; month: number; label: string }> = [];
    while (cursor <= end) {
        buckets.push({
            year: cursor.getUTCFullYear(),
            month: cursor.getUTCMonth() + 1,
            label: cursor.toLocaleDateString('en-US', {
                month: 'short',
                year: multiYear ? '2-digit' : undefined,
                timeZone: 'UTC',
            }),
        });
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    return buckets;
}
