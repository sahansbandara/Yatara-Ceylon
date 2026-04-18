'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CalendarClock, X } from 'lucide-react';
import {
    DATE_RANGE_PRESET_OPTIONS,
    DateRangePreset,
    getDateRangeLabel,
    resolveDateRangePreset,
} from '@/lib/date-range';

interface FinanceDateFilterProps {
    currentFrom?: string;
    currentTo?: string;
    currentPreset?: string;
}

export default function FinanceDateFilter({
    currentFrom,
    currentTo,
    currentPreset,
}: FinanceDateFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [from, setFrom] = useState(currentFrom || '');
    const [to, setTo] = useState(currentTo || '');

    useEffect(() => {
        setFrom(currentFrom || '');
        setTo(currentTo || '');
    }, [currentFrom, currentTo]);

    const pushRange = (nextFrom?: string, nextTo?: string, nextPreset?: string) => {
        const params = new URLSearchParams();
        if (nextFrom) params.set('from', nextFrom);
        if (nextTo) params.set('to', nextTo);
        if (nextPreset) params.set('preset', nextPreset);
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    const applyFilter = () => {
        if (from && to && from > to) {
            alert('The start date must be before the end date.');
            return;
        }

        pushRange(from || undefined, to || undefined);
    };

    const applyPreset = (preset: DateRangePreset) => {
        const range = resolveDateRangePreset(preset);
        setFrom(range.from);
        setTo(range.to);
        pushRange(range.from, range.to, preset);
    };

    const clearFilter = () => {
        setFrom('');
        setTo('');
        router.push(pathname);
    };

    const hasFilter = currentFrom || currentTo || currentPreset;

    return (
        <div className="liquid-glass-stat-dark rounded-2xl p-4 space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 text-white/40">
                    <CalendarClock className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        Finance Range
                    </span>
                    <span className="text-[11px] text-white/25">
                        {getDateRangeLabel(currentFrom, currentTo, currentPreset)}
                    </span>
                </div>
                {hasFilter && (
                    <button
                        onClick={clearFilter}
                        className="inline-flex items-center gap-1 text-xs text-white/45 transition-colors hover:text-white/70"
                    >
                        <X className="h-3 w-3" />
                        Clear range
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {DATE_RANGE_PRESET_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => applyPreset(option.value)}
                        className={`h-8 rounded-xl border px-3 text-[11px] font-medium transition-colors ${
                            currentPreset === option.value
                                ? 'border-antique-gold/30 bg-antique-gold/15 text-antique-gold'
                                : 'border-white/[0.08] bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white/75'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="date"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                        className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white focus:border-antique-gold/30 focus:outline-none focus:ring-2 focus:ring-antique-gold/20"
                        placeholder="From"
                    />
                    <span className="text-xs text-white/25">to</span>
                    <input
                        type="date"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                        className="h-9 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white focus:border-antique-gold/30 focus:outline-none focus:ring-2 focus:ring-antique-gold/20"
                        placeholder="To"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={applyFilter}
                        className="h-9 rounded-xl border border-antique-gold/30 bg-antique-gold/20 px-4 text-xs font-medium text-antique-gold transition-colors hover:bg-antique-gold/30"
                    >
                        Apply custom range
                    </button>
                </div>
            </div>
        </div>
    );
}
