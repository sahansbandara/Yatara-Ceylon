'use client';

import { useRouter, usePathname } from 'next/navigation';

const RANGE_OPTIONS = [
    { label: '3M', value: 3 },
    { label: '6M', value: 6 },
    { label: '12M', value: 12 },
    { label: '24M', value: 24 },
];

interface AnalyticsDateFilterProps {
    currentMonths: number;
}

export default function AnalyticsDateFilter({ currentMonths }: AnalyticsDateFilterProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (months: number) => {
        const params = new URLSearchParams();
        if (months !== 6) params.set('months', String(months));
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 mr-1">Range:</span>
            {RANGE_OPTIONS.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => handleChange(opt.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        currentMonths === opt.value
                            ? 'bg-antique-gold/20 text-antique-gold border border-antique-gold/30'
                            : 'bg-white/[0.04] text-white/40 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/60'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
