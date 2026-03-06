'use client';

import { useEffect, useMemo, useState } from 'react';
import { Map, List, Route, ChevronUp, ChevronDown, Compass, MapPin, Send } from 'lucide-react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import type { Place, PanelTab } from '@/lib/trip/types';
import curatedPlaces from '@/data/places/sri-lanka.curated.json';
import dynamic from 'next/dynamic';
import ConciergePanel from './ConciergePanel.client';
import SelectedStopsPanel from './SelectedStopsPanel.client';
import RouteSummaryBar from './RouteSummaryBar.client';

const MapViewport = dynamic(() => import('./MapViewport.client'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0f0d]">
            <div className="w-8 h-8 border-2 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin" />
        </div>
    ),
});

const TABS: { id: PanelTab; label: string; icon: typeof Map }[] = [
    { id: 'discover', label: 'Explore', icon: Compass },
    { id: 'stops', label: 'Stops', icon: List },
    { id: 'summary', label: 'Route', icon: Route },
];

export default function BuildTourShell() {
    const setPlaces = useBuildTourStore((s) => s.setPlaces);
    const stops = useBuildTourStore((s) => s.stops);
    const activeTab = useBuildTourStore((s) => s.activeTab);
    const setActiveTab = useBuildTourStore((s) => s.setActiveTab);
    const drawerExpanded = useBuildTourStore((s) => s.drawerExpanded);
    const setDrawerExpanded = useBuildTourStore((s) => s.setDrawerExpanded);

    // Active region for map-lite experience
    const [activeRegionId, setActiveRegionId] = useState<string | null>(null);

    // Load curated places on mount
    useEffect(() => {
        setPlaces(curatedPlaces as Place[]);
    }, [setPlaces]);

    return (
        <section id="trip-builder" className="relative w-full bg-[#0a0f0d]">
            {/* ── Desktop Layout ─────────────────────────────────── */}
            <div className="hidden lg:flex h-[85vh] min-h-[600px]">
                {/* Left Panel — Concierge Experience */}
                <div className="w-[420px] xl:w-[460px] flex-shrink-0 flex flex-col bg-black/10 backdrop-blur-xl border-r border-white/10 shadow-[20px_0_40px_rgba(0,0,0,0.5)] z-10 relative">
                    {/* Tab bar */}
                    <div className="flex border-b border-white/5">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] uppercase tracking-[0.2em] font-serif transition-all duration-300 relative ${isActive
                                        ? 'text-antique-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                                        : 'text-white/30 hover:text-white/50'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                    {tab.id === 'stops' && stops.length > 0 && (
                                        <span className="w-4 h-4 flex items-center justify-center bg-antique-gold text-deep-emerald text-[8px] font-bold rounded-full">
                                            {stops.length}
                                        </span>
                                    )}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-antique-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'discover' && (
                            <ConciergePanel
                                activeRegionId={activeRegionId}
                                onSelectRegion={setActiveRegionId}
                            />
                        )}
                        {activeTab === 'stops' && <SelectedStopsPanel />}
                        {activeTab === 'summary' && <RouteSummaryBar />}
                    </div>
                </div>

                {/* Right Map — Curated Regions */}
                <div className="flex-1 relative">
                    <MapViewport activeRegionId={activeRegionId} />
                </div>
            </div>

            {/* ── Mobile Layout ──────────────────────────────────── */}
            <div className="lg:hidden relative h-[85vh] min-h-[550px]">
                {/* Fullscreen map */}
                <div className="absolute inset-0">
                    <MapViewport activeRegionId={activeRegionId} />
                </div>

                {/* Bottom sheet */}
                <div
                    className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-500 ease-out ${drawerExpanded ? 'max-h-[70vh]' : 'max-h-[56px]'
                        }`}
                >
                    <div className="bg-black/20 backdrop-blur-xl rounded-t-2xl h-full flex flex-col overflow-hidden border-t border-[rgba(212,175,55,0.15)]">
                        {/* Sheet handle */}
                        <button
                            onClick={() => setDrawerExpanded(!drawerExpanded)}
                            className="flex items-center justify-between px-5 py-3 border-b border-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-1 bg-white/20 rounded-full mx-auto" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white/50 text-xs font-serif">
                                    {stops.length} stops
                                </span>
                                {drawerExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-white/30" />
                                ) : (
                                    <ChevronUp className="w-4 h-4 text-white/30" />
                                )}
                            </div>
                        </button>

                        {/* Mobile tabs */}
                        {drawerExpanded && (
                            <>
                                <div className="flex border-b border-white/5">
                                    {TABS.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] uppercase tracking-wider font-serif transition-all duration-300 ${isActive
                                                    ? 'text-antique-gold border-b-2 border-antique-gold shadow-[0_-2px_8px_rgba(212,175,55,0.2)]'
                                                    : 'text-white/30 hover:text-white/50'
                                                    }`}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {tab.label}
                                                {tab.id === 'stops' && stops.length > 0 && (
                                                    <span className="w-3.5 h-3.5 flex items-center justify-center bg-antique-gold text-deep-emerald text-[7px] font-bold rounded-full">
                                                        {stops.length}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    {activeTab === 'discover' && (
                                        <ConciergePanel
                                            activeRegionId={activeRegionId}
                                            onSelectRegion={setActiveRegionId}
                                        />
                                    )}
                                    {activeTab === 'stops' && <SelectedStopsPanel />}
                                    {activeTab === 'summary' && <RouteSummaryBar />}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
