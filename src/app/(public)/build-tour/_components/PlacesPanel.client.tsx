'use client';

import { Search, MapPin, Plus, Check, X, SlidersHorizontal, Clock } from 'lucide-react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import { ALL_CATEGORIES, CATEGORY_LABELS, getCategoryColor } from '@/lib/trip/types';
import type { PlaceCategory } from '@/lib/trip/types';
import Image from 'next/image';
import { DEFAULT_IMAGE_BLUR_DATA_URL, getPlaceThumbnailSrc } from '@/lib/image-utils';

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

    // Format visit minutes to readable string
    const formatVisit = (mins: number) => {
        if (mins < 60) return `${mins}m`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

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
                        className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/80 text-xs placeholder:text-white/20 focus:outline-none focus:border-antique-gold/40 focus:bg-white/8 transition-all font-nav font-light tracking-wider"
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
                                className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-nav transition-all duration-200 ${isActive
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
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/60 py-1.5 px-2 focus:outline-none focus:border-antique-gold/30 appearance-none font-nav tracking-wider"
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
                        className="text-[9px] text-antique-gold/60 hover:text-antique-gold uppercase tracking-wider font-nav whitespace-nowrap"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Results count */}
            <div className="px-4 pb-2">
                <p className="text-[9px] text-white/20 uppercase tracking-wider font-nav font-light">
                    {filteredPlaces.length} destinations
                </p>
            </div>

            {/* Premium Place Cards */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar space-y-2">
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
                                className={`group rounded-xl overflow-hidden transition-all duration-400 cursor-pointer ${inStops
                                    ? 'bg-antique-gold/[0.06] border border-antique-gold/15 shadow-sm'
                                    : 'hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]'
                                    }`}
                                onClick={() => !inStops && addStop(place)}
                            >
                                <div className="flex gap-3 p-2.5">
                                    {/* Thumbnail */}
                                    <div className="w-[72px] h-[72px] rounded-lg overflow-hidden flex-shrink-0 relative bg-white/5">
                                        <Image
                                            src={getPlaceThumbnailSrc(place.image)}
                                            alt={place.name}
                                            fill
                                            unoptimized
                                            placeholder="blur"
                                            blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="72px"
                                        />
                                        {/* Category badge overlay */}
                                        <div
                                            className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[7px] uppercase tracking-wider font-nav font-semibold"
                                            style={{ color: '#fff', backgroundColor: color + 'CC' }}
                                        >
                                            {CATEGORY_LABELS[place.category as PlaceCategory] || place.category}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div>
                                            <p className="font-serif text-[13px] text-white/90 truncate leading-tight">
                                                {place.name}
                                            </p>
                                            <p className="text-white/30 text-[9px] mt-0.5 font-nav tracking-wider">
                                                {place.district}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-1.5">
                                            {/* Duration estimate */}
                                            <div className="flex items-center gap-1 text-white/25">
                                                <Clock className="w-2.5 h-2.5" />
                                                <span className="text-[9px] font-nav">{formatVisit(place.estimatedVisitMinutes)}</span>
                                            </div>

                                            {/* Add button */}
                                            {inStops ? (
                                                <div className="flex items-center gap-1 text-antique-gold/70">
                                                    <Check className="w-3 h-3" />
                                                    <span className="text-[8px] font-nav uppercase tracking-wider">Added</span>
                                                </div>
                                            ) : (
                                                <button
                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] text-white/40 text-[8px] font-nav uppercase tracking-wider opacity-0 group-hover:opacity-100 hover:bg-antique-gold/15 hover:text-antique-gold transition-all duration-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addStop(place);
                                                    }}
                                                >
                                                    <Plus className="w-2.5 h-2.5" />
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
