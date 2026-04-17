'use client';

import { useState, useEffect } from 'react';
import type { District, Place, JourneyStop } from '@/lib/trip/buildTourTypes';
import dynamic from 'next/dynamic';
import type { BuildTourMapProps } from './BuildTourMap';
import PlannerSidebar from './PlannerSidebar';

const BuildTourMap = dynamic<BuildTourMapProps>(() => import('./BuildTourMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[#f4f1eb]">
            <div className="w-10 h-10 border-2 border-deep-emerald/20 border-t-deep-emerald rounded-full animate-spin" />
        </div>
    )
});

export default function BuildTourClient() {
    // ── Global Planner State ──────────────────────────────────
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
    const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
    const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
    const [journeyStops, setJourneyStops] = useState<JourneyStop[]>([]);
    const [routeVisible, setRouteVisible] = useState(false);

    // Sync with external components (e.g. PopularTours, ThemeCarousel)
    useEffect(() => {
        const handleLoadTour = (e: CustomEvent<{ placeIds: string[], replace: boolean }>) => {
            const { placeIds, replace } = e.detail;

            if (replace) {
                const newStops: JourneyStop[] = placeIds.map((id, index) => ({
                    id: `stop-${Date.now()}-${index}`,
                    placeId: id,
                    day: 1,
                    order: index
                }));
                setJourneyStops(newStops);
                setSelectedPlaceIds(placeIds);
            } else {
                setJourneyStops(prev => {
                    const existingIds = new Set(prev.map(s => s.placeId));
                    const toAdd = placeIds.filter(id => !existingIds.has(id));
                    const newStops: JourneyStop[] = toAdd.map((id, index) => ({
                        id: `stop-${Date.now()}-${prev.length + index}`,
                        placeId: id,
                        day: prev.length > 0 ? Math.max(...prev.map(s => s.day)) : 1, // Add to highest day
                        order: prev.length + index
                    }));
                    return [...prev, ...newStops];
                });
                setSelectedPlaceIds(prev => {
                    const existing = new Set(prev);
                    const newIds = placeIds.filter(id => !existing.has(id));
                    return [...prev, ...newIds];
                });
            }
        };

        window.addEventListener('yatara:load-tour', handleLoadTour as EventListener);
        return () => window.removeEventListener('yatara:load-tour', handleLoadTour as EventListener);
    }, []);

    return (
        <section id="planner" className="relative w-full bg-off-white flex flex-col lg:block h-[calc(100vh-85px)] lg:overflow-hidden">
            {/* ── Background Map (Top on mobile, Background on desktop) ────────────────────────── */}
            <div className="relative w-full h-[45vh] shrink-0 lg:absolute lg:inset-0 lg:h-full z-0 bg-[#f4f1eb]">
                <BuildTourMap
                    selectedDistrictId={selectedDistrictId}
                    hoveredDistrictId={hoveredDistrictId}
                    setHoveredDistrictId={setHoveredDistrictId}
                    setSelectedDistrictId={setSelectedDistrictId}
                    journeyStops={journeyStops}
                    setJourneyStops={setJourneyStops}
                    routeVisible={routeVisible}
                />
            </div>

            {/* ── Foreground Overlay UI ────────────────────────── */}
            <div className="relative flex-1 min-h-0 w-full lg:absolute lg:inset-0 lg:max-w-[1920px] mx-auto z-10 pointer-events-auto lg:pointer-events-none">
                <PlannerSidebar
                    selectedDistrictId={selectedDistrictId}
                    selectedPlaceIds={selectedPlaceIds}
                    setSelectedPlaceIds={setSelectedPlaceIds}
                    journeyStops={journeyStops}
                    setJourneyStops={setJourneyStops}
                    setSelectedDistrictId={setSelectedDistrictId}
                />
            </div>
        </section>
    );
}
