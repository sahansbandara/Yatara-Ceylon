'use client';

import { useMemo, useState, useEffect } from 'react';
import { X, Plus, Minus, ChevronRight, MapPin, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import type { JourneyStop } from '@/lib/trip/buildTourTypes';
import curatedPlacesRaw from '@/data/places/sri-lanka.curated.json';
import { DEFAULT_IMAGE_BLUR_DATA_URL, getPlaceThumbnailSrc } from '@/lib/image-utils';

const curatedPlaces = curatedPlacesRaw as any[];

interface PlannerSidebarProps {
    selectedDistrictId: string | null;
    selectedPlaceIds: string[];
    setSelectedPlaceIds: (ids: string[]) => void;
    journeyStops: JourneyStop[];
    setJourneyStops: (stops: JourneyStop[]) => void;
    setSelectedDistrictId: (id: string | null) => void;
    onSaveDraft: () => void;
    isSaving: boolean;
    onRequestProposal?: (estimatedPrice: number) => void;
    isEditing?: boolean;
    isPlanSubmitted?: boolean;
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function PlannerSidebar({
    selectedDistrictId,
    selectedPlaceIds,
    setSelectedPlaceIds,
    journeyStops,
    setJourneyStops,
    setSelectedDistrictId,
    onSaveDraft,
    isSaving,
    onRequestProposal,
    isEditing,
    isPlanSubmitted
}: PlannerSidebarProps) {
    const [activeMobileTab, setActiveMobileTab] = useState<'explore' | 'journey'>('explore');

    // Automatically switch to explore tab when a district is selected on mobile
    useEffect(() => {
        if (selectedDistrictId) {
            setActiveMobileTab('explore');
        }
    }, [selectedDistrictId]);

    // Derived Data
    const districtPlaces = useMemo(() => {
        if (!selectedDistrictId) return [];
        return curatedPlaces.filter(p => p.districtId === selectedDistrictId);
    }, [selectedDistrictId]);

    // Get human-readable district name from curated data
    const districtDisplayName = useMemo(() => {
        if (!selectedDistrictId) return '';
        const match = curatedPlaces.find(p => p.districtId === selectedDistrictId);
        return match?.district || selectedDistrictId;
    }, [selectedDistrictId]);

    const activeJourneyPlaces = useMemo(() => {
        return [...journeyStops].sort((a, b) => a.order - b.order).map(stop => {
            const place = curatedPlaces.find(p => p.id === stop.placeId);
            return { ...stop, place };
        }).filter(s => s.place);
    }, [journeyStops]);

    const estimatedDistance = useMemo(() => {
        let dist = 0;
        for (let i = 0; i < activeJourneyPlaces.length - 1; i++) {
            const p1 = activeJourneyPlaces[i].place;
            const p2 = activeJourneyPlaces[i + 1].place;
            if (p1 && p2 && p1.lat && p1.lng && p2.lat && p2.lng) {
                dist += getDistanceFromLatLonInKm(p1.lat, p1.lng, p2.lat, p2.lng);
            }
        }
        return dist;
    }, [activeJourneyPlaces]);

    const estimatedPrice = useMemo(() => {
        if (activeJourneyPlaces.length === 0) return 0;
        return 10000 + (estimatedDistance * 100);
    }, [estimatedDistance, activeJourneyPlaces]);

    // Handlers
    const handleAddPlace = (placeId: string) => {
        if (selectedPlaceIds.includes(placeId)) return;

        setSelectedPlaceIds([...selectedPlaceIds, placeId]);
        setJourneyStops([
            ...journeyStops,
            { id: `stop-${Date.now()}`, placeId, day: 1, order: journeyStops.length }
        ]);
    };

    const handleRemovePlace = (placeId: string) => {
        setSelectedPlaceIds(selectedPlaceIds.filter(id => id !== placeId));
        setJourneyStops(journeyStops.filter(s => s.placeId !== placeId));
    };

    const handleClearPlan = () => {
        setSelectedPlaceIds([]);
        setJourneyStops([]);
    };

    return (
        <div className="relative lg:absolute inset-0 w-full h-full pointer-events-auto lg:pointer-events-none flex flex-col lg:flex-row justify-between p-0 lg:p-6 z-10 gap-0 lg:gap-0 bg-[#f4f1eb] lg:bg-transparent lg:overflow-hidden overflow-y-auto custom-scrollbar">

            {/* ── Mobile Tabs ── */}
            <div className="lg:hidden flex w-full border-b border-black/5 shrink-0 sticky top-0 z-20 bg-[#f4f1eb]">
                <button
                    onClick={() => setActiveMobileTab('explore')}
                    className={`flex-1 py-3 text-xs font-semibold tracking-wide transition-colors uppercase ${activeMobileTab === 'explore' ? 'text-deep-emerald border-b-2 border-deep-emerald bg-black/5' : 'text-deep-emerald/50'}`}
                >
                    Directory
                </button>
                <button
                    onClick={() => setActiveMobileTab('journey')}
                    className={`flex-1 py-3 text-xs font-semibold tracking-wide transition-colors uppercase flex items-center justify-center gap-2 ${activeMobileTab === 'journey' ? 'text-deep-emerald border-b-2 border-deep-emerald bg-black/5' : 'text-deep-emerald/50'}`}
                >
                    My Journey
                    {journeyStops.length > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeMobileTab === 'journey' ? 'bg-deep-emerald text-white' : 'bg-black/10 text-deep-emerald/50'}`}>{journeyStops.length}</span>
                    )}
                </button>
            </div>

            {/* ── Left Column: Select a District / Curated Places ── */}
            <div className={`lg:pointer-events-auto w-full lg:w-[340px] flex-col h-full lg:h-full shrink-0 ${activeMobileTab === 'explore' ? 'flex' : 'hidden lg:flex'} p-4 lg:p-0`}>
                {selectedDistrictId ? (
                    <div className="tour-glass-drawer rounded-3xl flex flex-col flex-1 min-h-0 overflow-hidden transition-all duration-500 transform opacity-100 translate-x-0">
                        {/* Header */}
                        <div className="relative px-6 py-5 border-b border-black/5 bg-white/50 shrink-0">
                            <button
                                onClick={() => setSelectedDistrictId(null)}
                                className="absolute top-5 right-5 p-1.5 bg-black/5 hover:bg-black/10 rounded-full text-deep-emerald/50 hover:text-deep-emerald transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <h3 className="font-serif text-2xl text-deep-emerald capitalize mb-1">
                                {districtDisplayName}
                            </h3>
                            <p className="text-xs text-deep-emerald/60 leading-relaxed max-w-[85%]">
                                Discover curated experiences in this region for your luxury itinerary.
                            </p>
                        </div>

                        {/* Places List */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                            <div className="flex flex-col gap-3">
                                {districtPlaces.length > 0 ? districtPlaces.map(place => {
                                    const isAdded = selectedPlaceIds.includes(place.id);
                                    return (
                                        <div key={place.id} className={`flex items-center gap-4 p-3 rounded-2xl gem-place-card group/card ${isAdded ? 'active cursor-default' : 'cursor-pointer'}`}
                                            onClick={() => !isAdded && handleAddPlace(place.id)}
                                        >
                                            <div className="w-14 h-14 rounded-xl bg-black/5 overflow-hidden relative shrink-0 shadow-inner">
                                                {place.image ? (
                                                    <Image
                                                        src={getPlaceThumbnailSrc(place.image)}
                                                        alt={place.name}
                                                        fill
                                                        sizes="56px"
                                                        unoptimized
                                                        placeholder="blur"
                                                        blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                                                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-deep-emerald/20 to-antique-gold/20" />
                                                )}
                                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-deep-emerald truncate">{place.name}</h4>
                                                <p className="text-[10px] uppercase tracking-widest text-deep-emerald/50 mt-1">{place.category}</p>
                                            </div>
                                            <button
                                                disabled={isAdded}
                                                className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-all ${isAdded ? 'bg-deep-emerald text-white' : 'bg-white border border-black/5 text-deep-emerald/40 group-hover/card:border-deep-emerald group-hover/card:bg-deep-emerald group-hover/card:text-white'}`}
                                            >
                                                {isAdded ? <MapPin className="w-3.5 h-3.5" /> : <Plus className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    );
                                }) : (
                                    <p className="text-xs text-deep-emerald/40 py-6 text-center border border-dashed border-deep-emerald/20 rounded-2xl">
                                        No curated places found in this district yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="tour-glass-drawer rounded-3xl p-8 text-center transition-all duration-500 w-full lg:max-w-[340px]">
                        <div className="w-12 h-12 mx-auto bg-deep-emerald/5 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-5 h-5 text-deep-emerald/40" />
                        </div>
                        <h3 className="font-serif text-lg text-deep-emerald mb-2">Select a Region</h3>
                        <p className="text-xs text-deep-emerald/50 leading-relaxed">
                            Click on any region on the map to display its curated experiences.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Right Column: My Journey ── */}
            <div className={`lg:pointer-events-auto w-full lg:w-[340px] flex-col h-full lg:h-auto lg:max-h-[calc(100vh-140px)] shrink-0 ${activeMobileTab === 'journey' ? 'flex' : 'hidden lg:flex'} p-4 lg:p-0`}>
                <div className="tour-glass-drawer rounded-3xl flex flex-col flex-1 min-h-0 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-black/5 bg-white/50 shrink-0 flex items-center justify-between">
                        <h3 className="font-serif text-lg text-deep-emerald tracking-wide flex items-center gap-2">
                            My Journey
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex bg-deep-emerald/5 px-2 py-0.5 rounded-full items-center gap-1">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-deep-emerald/70">
                                    {journeyStops.length} Stops
                                </span>
                            </div>
                            {journeyStops.length > 1 && (
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-deep-emerald/50 flex flex-row items-center gap-1">
                                        <Clock className="w-3 h-3" /> ~{Math.round(journeyStops.length * 1.5)} hrs / {Math.round(estimatedDistance)} km
                                    </span>
                                    <span className="text-xs font-bold text-deep-emerald mt-0.5">
                                        Est: LKR {estimatedPrice.toLocaleString()}/person
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                        {activeJourneyPlaces.length > 1 && (
                            <div className="journey-timeline-line" />
                        )}
                        <div className="flex flex-col gap-4 relative z-10">
                            {activeJourneyPlaces.length > 0 ? activeJourneyPlaces.map((stop, index) => (
                                <div key={stop.id} className="group/journey flex items-center gap-4 gem-place-card p-3 pr-4 rounded-2xl relative">
                                    {/* Start Point Badge */}
                                    {index === 0 && (
                                        <div className="absolute -top-3 -left-1 bg-deep-emerald text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-md z-20 shadow-deep-emerald/20">
                                            Start
                                        </div>
                                    )}
                                    {/* Stop Thumbnail */}
                                    <div className="w-10 h-10 rounded-[10px] overflow-hidden relative shrink-0 shadow-md shadow-black/10">
                                        {stop.place?.image ? (
                                            <Image
                                                src={getPlaceThumbnailSrc(stop.place.image)}
                                                alt={stop.place.name || 'Place'}
                                                fill
                                                sizes="40px"
                                                unoptimized
                                                placeholder="blur"
                                                blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-deep-emerald/20 to-antique-gold/20" />
                                        )}
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[10px] pointer-events-none" />
                                    </div>

                                    {/* Stop Number Badge */}
                                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-antique-gold text-deep-emerald flex items-center justify-center text-[10px] font-bold shrink-0 shadow-md ring-2 ring-[#f4f1eb] z-20">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-deep-emerald truncate">{stop.place?.name}</h4>
                                        <p className="text-[10px] text-deep-emerald/50 truncate capitalize mt-0.5">{stop.place?.district} District</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemovePlace(stop.placeId)}
                                        className="w-7 h-7 rounded-full bg-red-50 text-red-900 border border-red-100 flex items-center justify-center opacity-0 group-hover/journey:opacity-100 transition-all hover:bg-red-900 hover:text-white hover:shadow-md"
                                        title="Remove stop"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-xs text-deep-emerald/40 leading-relaxed max-w-[80%] mx-auto">
                                        Your itinerary is empty. Add places from the directory to start building your journey.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-black/5 bg-white/50 shrink-0 flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button
                                onClick={handleClearPlan}
                                disabled={journeyStops.length === 0}
                                className="flex-1 py-3 rounded-xl border border-deep-emerald/20 text-deep-emerald hover:bg-red-50 hover:border-red-900/30 hover:text-red-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-deep-emerald disabled:border-deep-emerald/20 transition-all text-xs tracking-widest uppercase font-bold"
                            >
                                Clear
                            </button>
                            <button
                                onClick={onSaveDraft}
                                disabled={journeyStops.length === 0 || isSaving}
                                className="flex-1 py-3 rounded-xl bg-deep-emerald/10 text-deep-emerald hover:bg-deep-emerald/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-bold"
                            >
                                {isSaving ? "Saving..." : isEditing ? "Update Plan" : "Save Draft"}
                            </button>
                        </div>
                        <button
                            onClick={() => onRequestProposal?.(estimatedPrice)}
                            disabled={journeyStops.length === 0}
                            className={`w-full py-3.5 rounded-xl shadow-[0_8px_20px_rgba(4,57,39,0.15)] transition-all flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-bold ${
                                isPlanSubmitted
                                    ? 'bg-amber-600 text-white hover:-translate-y-0.5'
                                    : 'bg-deep-emerald text-white hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0'
                            }`}
                        >
                            {isPlanSubmitted ? (
                                <>Update & Re-submit <ChevronRight className="w-4 h-4" /></>
                            ) : (
                                <>Request Proposal <ChevronRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
