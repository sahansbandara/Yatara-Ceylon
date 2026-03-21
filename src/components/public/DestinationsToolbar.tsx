'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Map, X } from 'lucide-react';
import Link from 'next/link';

const REGIONS = [
    'All',
    'Hill Country',
    'Cultural Triangle',
    'South Coast',
    'East Coast',
    'North',
    'West Coast',
    'Colombo',
    'Wildlife',
];

export default function DestinationsToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRegion = searchParams.get('region') || 'All';
    const currentSearch = searchParams.get('q') || '';
    const [searchValue, setSearchValue] = useState(currentSearch);

    const updateFilters = useCallback(
        (region?: string, q?: string) => {
            const params = new URLSearchParams();
            const regionVal = region ?? currentRegion;
            const searchVal = q ?? searchValue;

            if (regionVal && regionVal !== 'All') {
                params.set('region', regionVal.toLowerCase().replace(/\s+/g, '-'));
            }
            if (searchVal.trim()) {
                params.set('q', searchVal.trim());
            }

            const qs = params.toString();
            router.push(`/destinations${qs ? `?${qs}` : ''}`, { scroll: false });
        },
        [currentRegion, searchValue, router]
    );

    const handleRegionClick = (region: string) => {
        updateFilters(region, searchValue);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters(currentRegion, searchValue);
    };

    const clearSearch = () => {
        setSearchValue('');
        updateFilters(currentRegion, '');
    };

    return (
        <div className="liquid-glass-toolbar rounded-2xl p-4 md:p-5 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative flex-shrink-0 lg:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search destinations…"
                        className="w-full pl-10 pr-9 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-[13px] tracking-wide placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.08] transition-all duration-300"
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </form>

                {/* Region Chips */}
                <div className="flex-1 flex flex-wrap gap-2">
                    {REGIONS.map((region) => {
                        const isActive =
                            region === 'All'
                                ? !searchParams.get('region')
                                : currentRegion === region.toLowerCase().replace(/\s+/g, '-') ||
                                  searchParams.get('region') === region.toLowerCase().replace(/\s+/g, '-');
                        return (
                            <button
                                key={region}
                                onClick={() => handleRegionClick(region)}
                                className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-300 whitespace-nowrap
                                    ${isActive
                                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                                        : 'bg-white/[0.04] text-white/50 border border-white/[0.08] hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.06]'
                                    }`}
                            >
                                {region}
                            </button>
                        );
                    })}
                </div>

                {/* Map CTA */}
                <Link
                    href="/build-tour"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300 whitespace-nowrap flex-shrink-0"
                >
                    <Map className="h-3.5 w-3.5" />
                    Interactive Map
                </Link>
            </div>
        </div>
    );
}
