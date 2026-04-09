'use client';

import { useState } from 'react';
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

    return (
        <section id="planner" className="relative w-full bg-off-white flex flex-col lg:block lg:h-[90vh] lg:min-h-[700px] lg:max-h-[1000px] lg:overflow-hidden">
            {/* ── Background Map (Top on mobile, Background on desktop) ────────────────────────── */}
            <div className="relative w-full h-[60vh] lg:absolute lg:inset-0 lg:h-full z-0 bg-[#f4f1eb]">
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
            <div className="absolute inset-0 w-full h-full max-w-[1920px] mx-auto z-10 pointer-events-none">
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
