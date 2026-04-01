'use client';

import { useEffect, useState } from 'react';
import { Map, List, Route, ChevronUp, ChevronDown, Compass, Maximize2, RotateCcw } from 'lucide-react';
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
        <div className="w-full h-full flex items-center justify-center bg-[#081c16]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin" />
                <span className="text-white/20 text-[10px] uppercase tracking-wider font-serif">Loading map...</span>
            </div>
        </div>
    ),
});

const TABS: { id: PanelTab; label: string; icon: typeof Map }[] = [
    { id: 'discover', label: 'Explore', icon: Compass },
    { id: 'stops', label: 'Stops', icon: List },
    { id: 'summary', label: 'Route', icon: Route },
];

export default function BuildTourShell({ initialPlanId }: { initialPlanId?: string | null }) {
    const setPlaces = useBuildTourStore((s) => s.setPlaces);
    const stops = useBuildTourStore((s) => s.stops);
    const activeTab = useBuildTourStore((s) => s.activeTab);
    const setActiveTab = useBuildTourStore((s) => s.setActiveTab);
    const drawerExpanded = useBuildTourStore((s) => s.drawerExpanded);
    const setDrawerExpanded = useBuildTourStore((s) => s.setDrawerExpanded);
    const hydrateStopsFromPlaceIds = useBuildTourStore((s) => s.hydrateStopsFromPlaceIds);

    const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activePlanId, setActivePlanId] = useState<string | null>(null);
    const [planStatusMessage, setPlanStatusMessage] = useState<string | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(false);

    useEffect(() => {
        setPlaces(curatedPlaces as Place[]);
    }, [setPlaces]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    useEffect(() => {
        if (!initialPlanId) return;

        let cancelled = false;
        setLoadingPlan(true);
        setPlanStatusMessage(null);

        void fetch(`/api/plans?id=${initialPlanId}`)
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Unable to load saved plan.');
                }

                const plan = data.plan;
                const placeIds = (plan.days || []).flatMap((day: { places?: string[] }) => day.places || []);
                if (!cancelled) {
                    hydrateStopsFromPlaceIds(placeIds);
                    setActivePlanId(plan._id);
                    setActiveTab(placeIds.length > 0 ? 'stops' : 'discover');
                    setPlanStatusMessage('Loaded your saved plan. Continue editing or save over it when ready.');
                    setTimeout(() => {
                        void useBuildTourStore.getState().fetchRoute();
                    }, 0);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setPlanStatusMessage(error.message || 'Unable to load this saved plan.');
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingPlan(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [hydrateStopsFromPlaceIds, initialPlanId, setActiveTab]);

    return (
        <section
            id="trip-builder"
            className={`relative w-full bg-[#0a0f0d] transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}
        >
            {/* ── Section Label ─────────────────────────────────── */}
            {!isFullscreen && (
                <div className="flex items-center justify-center gap-3 pt-6 pb-4">
                    <div className="h-px w-10 bg-antique-gold/20" />
                    <span className="text-antique-gold/60 text-[9px] tracking-[0.3em] uppercase font-serif">
                        Interactive Planner
                    </span>
                    <div className="h-px w-10 bg-antique-gold/20" />
                </div>
            )}

            {(loadingPlan || planStatusMessage) && !isFullscreen && (
                <div className="px-4 sm:px-6 lg:px-8 pb-3">
                    <div className="mx-auto max-w-[1600px] rounded-2xl border border-antique-gold/20 bg-antique-gold/5 px-4 py-3 text-xs text-antique-gold/80">
                        {loadingPlan ? 'Loading saved plan...' : planStatusMessage}
                    </div>
                </div>
            )}

            {/* ── Desktop Layout ─────────────────────────────────── */}
            <div className={`hidden lg:block ${isFullscreen ? 'px-0' : 'px-4 sm:px-6 lg:px-8 pb-6'}`}>
                <div className={`planner-shell-glass rounded-2xl overflow-hidden ${isFullscreen ? 'rounded-none h-screen' : ''}`}
                    style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 180px)', minHeight: '600px', maxHeight: isFullscreen ? '100vh' : '860px' }}
                >
                    <div className="flex h-full">
                        {/* Left Panel — 32% width */}
                        <div className="w-[32%] min-w-[320px] max-w-[420px] flex-shrink-0 flex flex-col planner-sidebar-glass relative z-10">
                            {/* Tab bar */}
                            <div className="flex border-b border-white/5">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-[0.2em] font-serif transition-all duration-300 relative ${isActive
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
                                {activeTab === 'stops' && (
                                    <SelectedStopsPanel
                                        activePlanId={activePlanId}
                                        onPlanSaved={(planId) => {
                                            setActivePlanId(planId);
                                            setPlanStatusMessage('Saved to My Plans. You can reopen or delete it from your dashboard.');
                                        }}
                                    />
                                )}
                                {activeTab === 'summary' && <RouteSummaryBar />}
                            </div>
                        </div>

                        {/* Right Map — 68% width with dark theme */}
                        <div className="flex-1 relative planner-map-container">
                            {/* Planner toolbar */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
                                <div className="planner-toolbar-glass rounded-full px-2 py-1.5 flex items-center gap-1">
                                    {[
                                        { label: 'Explore', id: 'discover' as PanelTab },
                                        { label: 'Stops', id: 'stops' as PanelTab },
                                        { label: 'Route', id: 'summary' as PanelTab },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-serif transition-all duration-300 ${activeTab === item.id
                                                ? 'bg-antique-gold/20 text-antique-gold border border-antique-gold/30'
                                                : 'text-white/30 hover:text-white/50'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                    <div className="w-px h-4 bg-white/10 mx-1" />
                                    <button
                                        onClick={() => {
                                            setActiveRegionId(null);
                                            useBuildTourStore.getState().setDistrictFilter(null);
                                        }}
                                        className="p-1.5 rounded-full text-white/25 hover:text-antique-gold/70 hover:bg-antique-gold/10 transition-all"
                                        title="Reset view"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={toggleFullscreen}
                                        className="p-1.5 rounded-full text-white/25 hover:text-antique-gold/70 hover:bg-antique-gold/10 transition-all"
                                        title="Toggle fullscreen"
                                    >
                                        <Maximize2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <MapViewport activeRegionId={activeRegionId} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile Layout ──────────────────────────────────── */}
            <div className="lg:hidden relative h-[85vh] min-h-[550px]">
                <div className="absolute inset-0 planner-map-container">
                    <MapViewport activeRegionId={activeRegionId} />
                </div>

                {/* Bottom sheet */}
                <div
                    className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-500 ease-out ${drawerExpanded ? 'max-h-[70vh]' : 'max-h-[56px]'
                        }`}
                >
                    <div className="bg-black/20 backdrop-blur-xl rounded-t-2xl h-full flex flex-col overflow-hidden border-t border-[rgba(212,175,55,0.15)]">
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
                                    {activeTab === 'stops' && (
                                        <SelectedStopsPanel
                                            activePlanId={activePlanId}
                                            onPlanSaved={(planId) => {
                                                setActivePlanId(planId);
                                                setPlanStatusMessage('Saved to My Plans. You can reopen or delete it from your dashboard.');
                                            }}
                                        />
                                    )}
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
