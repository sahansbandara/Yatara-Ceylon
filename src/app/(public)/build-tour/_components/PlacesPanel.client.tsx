'use client';

import { useMemo } from 'react';
import { Search, MapPin, Plus, Check, X, SlidersHorizontal } from 'lucide-react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import { ALL_CATEGORIES, CATEGORY_LABELS, getCategoryColor } from '@/lib/trip/types';
import type { PlaceCategory } from '@/lib/trip/types';

interface PlacesPanelProps {
    districts: string[];
}

export default function PlacesPanel({ districts }: PlacesPanelProps) {
    const filters = useBuildTourStore((s) => s.filters);
    const setSearchQuery = useBuildTourStore((s) => s.setSearchQuery);
    const toggleCategory = useBuildTourStore((s) => s.toggleCategory);
    const setDistrictFilter = useBuildTourStore((s) => s.setDistrictFilter);
    const getFilteredPlaces = useBuildTourStore((s) => s.getFilteredPlaces);
    const addStop = useBuildTourStore((s) => s.addStop);
    const isInStops = useBuildTourStore((s) => s.isInStops);
    const clearFilters = useBuildTourStore((s) => s.clearFilters);
    const setHoveredPlaceId = useBuildTourStore((s) => s.setHoveredPlaceId);

    const filteredPlaces = getFilteredPlaces();

    const hasFilters = filters.searchQuery || filters.categories.length > 0 || filters.district;

    return (
        <div className="h-full flex flex-col">
            {/* Search */}
            <div className="px-4 pt-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input
                        type="text"
                        value={filters.searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search places, districts..."
                        className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 text-xs placeholder:text-white/20 focus:outline-none focus:border-antique-gold/40 focus:bg-white/8 transition-all font-light tracking-wider"
                    />
                    {filters.searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category chips */}
            <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                    {ALL_CATEGORIES.map((cat) => {
                        const isActive = filters.categories.includes(cat);
                        const color = getCategoryColor(cat);
                        return (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-serif transition-all duration-200 ${isActive
                                    ? 'shadow-sm'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/5'
                                    }`}
                                style={
                                    isActive
                                        ? { backgroundColor: color + '25', color, borderColor: color + '40', border: '1px solid' }
                                        : undefined
                                }
                            >
                                {CATEGORY_LABELS[cat]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* District filter */}
            <div className="px-4 pb-3 flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3 text-white/20 flex-shrink-0" />
                <select
                    value={filters.district || ''}
                    onChange={(e) => setDistrictFilter(e.target.value || null)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-white/60 py-1.5 px-2 focus:outline-none focus:border-antique-gold/30 appearance-none font-serif tracking-wider"
                >
                    <option value="">All Districts</option>
                    {districts.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-[9px] text-antique-gold/60 hover:text-antique-gold uppercase tracking-wider font-serif whitespace-nowrap"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Results count */}
            <div className="px-4 pb-2">
                <p className="text-[9px] text-white/20 uppercase tracking-wider font-light">
                    {filteredPlaces.length} destinations
                </p>
            </div>

            {/* Place cards list */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar space-y-1.5">
                {filteredPlaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                        <MapPin className="w-6 h-6 text-white/10 mb-2" />
                        <p className="text-white/30 text-xs font-serif">No places found</p>
                        <p className="text-white/15 text-[10px] mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    filteredPlaces.map((place) => {
                        const inStops = isInStops(place.id);
                        const color = getCategoryColor(place.category);

                        return (
                            <div
                                key={place.id}
                                onMouseEnter={() => setHoveredPlaceId(place.id)}
                                onMouseLeave={() => setHoveredPlaceId(null)}
                                className={`group flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-300 cursor-pointer ${inStops
                                    ? 'bg-antique-gold/5 border border-antique-gold/15'
                                    : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                                    }`}
                                onClick={() => !inStops && addStop(place)}
                            >
                                {/* Category dot */}
                                <div
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-[#0a0f0d]"
                                    style={{ backgroundColor: color }}
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-serif text-[13px] text-white/85 truncate leading-tight">
                                        {place.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span
                                            className="text-[8px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded"
                                            style={{ color, backgroundColor: color + '15' }}
                                        >
                                            {place.category}
                                        </span>
                                        <span className="text-white/25 text-[9px]">{place.district}</span>
                                    </div>
                                    <p className="text-white/25 text-[9px] mt-1 line-clamp-1 font-light leading-relaxed">
                                        {place.teaser}
                                    </p>
                                </div>

                                {/* Add button */}
                                <div className="flex-shrink-0">
                                    {inStops ? (
                                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-antique-gold/20">
                                            <Check className="w-3.5 h-3.5 text-antique-gold" />
                                        </div>
                                    ) : (
                                        <button
                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 text-white/30 opacity-0 group-hover:opacity-100 hover:bg-antique-gold/20 hover:text-antique-gold transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addStop(place);
                                            }}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
