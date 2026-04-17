export type CsvPrimitive = string | number | boolean | null | undefined;
export type CsvRow = Record<string, CsvPrimitive>;

function escapeCsvValue(value: CsvPrimitive) {
    if (value === null || value === undefined) return '';

    const normalized = String(value).replace(/"/g, '""');
    if (/[",\n]/.test(normalized)) {
        return `"${normalized}"`;
    }

    return normalized;
}

export function downloadCsv(filename: string, rows: CsvRow[]) {
    if (typeof document === 'undefined' || rows.length === 0) return;

    const headers = Array.from(
        rows.reduce((acc, row) => {
            Object.keys(row).forEach((key) => acc.add(key));
            return acc;
        }, new Set<string>())
    );

    const csv = [
        headers.join(','),
        ...rows.map((row) =>
            headers.map((header) => escapeCsvValue(row[header])).join(',')
        ),
    ].join('\n');

    const blob = new Blob(['\ufeff', csv], {
        type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}
