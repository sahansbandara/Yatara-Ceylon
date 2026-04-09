'use client';

import { useMemo } from 'react';
import { X, Plus, Minus, ChevronRight, Save, Trash2, MapPin } from 'lucide-react';
import Image from 'next/image';
import type { JourneyStop, Place } from '@/lib/trip/buildTourTypes';
import curatedPlacesRaw from '@/data/places/sri-lanka.curated.json';

const curatedPlaces = curatedPlacesRaw as any[];

interface PlannerSidebarProps {
    selectedDistrictId: string | null;
    selectedPlaceIds: string[];
    setSelectedPlaceIds: (ids: string[]) => void;
    journeyStops: JourneyStop[];
    setJourneyStops: (stops: JourneyStop[]) => void;
    setSelectedDistrictId: (id: string | null) => void;
}

export default function PlannerSidebar({
    selectedDistrictId,
    selectedPlaceIds,
    setSelectedPlaceIds,
    journeyStops,
    setJourneyStops,
    setSelectedDistrictId
}: PlannerSidebarProps) {

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
        return journeyStops.map(stop => {
            const place = curatedPlaces.find(p => p.id === stop.placeId);
            return { ...stop, place };
        }).filter(s => s.place);
    }, [journeyStops]);

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
        <div className="relative lg:absolute inset-0 w-full h-full pointer-events-auto lg:pointer-events-none flex flex-col lg:flex-row justify-between p-4 md:p-6 z-10 gap-6 lg:gap-0 bg-[#f4f1eb] lg:bg-transparent">

            {/* ── Left Column: Select a District / Curated Places ── */}
            <div className="lg:pointer-events-auto w-full lg:w-[340px] flex flex-col h-[50vh] lg:h-full max-h-full shrink-0">
                {selectedDistrictId ? (
                    <div className="bg-white/75 backdrop-blur-2xl border border-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex flex-col flex-1 min-h-0 overflow-hidden transition-all duration-500 transform opacity-100 translate-x-0">
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
                                        <div key={place.id} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${isAdded ? 'border-deep-emerald/30 bg-deep-emerald/5 shadow-inner' : 'border-black/5 bg-white/50 hover:bg-white hover:shadow-md group/card cursor-pointer'}`}
                                            onClick={() => !isAdded && handleAddPlace(place.id)}
                                        >
                                            <div className="w-14 h-14 rounded-xl bg-black/5 overflow-hidden relative shrink-0">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-deep-emerald/20 to-antique-gold/20" />
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
                    <div className="bg-white/75 backdrop-blur-2xl border border-white rounded-3xl shadow-xl p-8 text-center transition-all duration-500 w-full lg:max-w-[340px]">
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
            <div className="lg:pointer-events-auto w-full lg:w-[340px] flex flex-col h-[60vh] lg:h-auto lg:max-h-[calc(100vh-140px)] shrink-0">
                <div className="bg-white/75 backdrop-blur-2xl border border-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex flex-col flex-1 min-h-0 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-black/5 bg-white/50 shrink-0 flex items-center justify-between">
                        <h3 className="font-serif text-lg text-deep-emerald tracking-wide flex items-center gap-2">
                            My Journey
                        </h3>
                        <div className="flex bg-deep-emerald/5 px-3 py-1 rounded-full items-center gap-2">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-deep-emerald/70">
                                {journeyStops.length} Stops
                            </span>
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                        {activeJourneyPlaces.length > 1 && (
                            <div className="absolute left-[39px] top-[36px] bottom-[36px] w-[2px] bg-gradient-to-b from-deep-emerald/5 via-deep-emerald/20 to-deep-emerald/5 rounded-full" />
                        )}
                        <div className="flex flex-col gap-4 relative z-10">
                            {activeJourneyPlaces.length > 0 ? activeJourneyPlaces.map((stop, index) => (
                                <div key={stop.id} className="group/journey flex items-center gap-4 bg-white/90 border border-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-3 pr-4 rounded-2xl transition-all hover:shadow-md">
                                    {/* Stop Number */}
                                    <div className="w-7 h-7 rounded-full bg-deep-emerald text-white flex items-center justify-center text-xs font-serif shrink-0 shadow-lg shadow-deep-emerald/20">
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
                    <div className="p-5 border-t border-black/5 bg-white/50 shrink-0 flex gap-3">
                        <button
                            onClick={handleClearPlan}
                            disabled={journeyStops.length === 0}
                            className="flex-1 py-3.5 rounded-xl border border-deep-emerald/20 text-deep-emerald hover:bg-red-50 hover:border-red-900/30 hover:text-red-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-deep-emerald disabled:border-deep-emerald/20 transition-all text-xs tracking-widest uppercase font-bold"
                        >
                            Clear
                        </button>
                        <button
                            disabled={journeyStops.length === 0}
                            className="flex-[2] py-3.5 rounded-xl bg-deep-emerald text-white shadow-[0_8px_20px_rgba(4,57,39,0.15)] hover:shadow-[0_8px_25px_rgba(4,57,39,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-bold"
                        >
                            Save Draft
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
