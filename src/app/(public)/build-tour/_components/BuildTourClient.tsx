'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { District, Place, JourneyStop } from '@/lib/trip/buildTourTypes';
import curatedPlacesRaw from '@/data/places/sri-lanka.curated.json';
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

export default function BuildTourClient({ initialPlanId }: { initialPlanId?: string }) {
    // ── Global Planner State ──────────────────────────────────
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
    const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
    const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
    const [journeyStops, setJourneyStops] = useState<JourneyStop[]>([]);
    const [routeVisible, setRouteVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    // Reopen an existing plan if initialPlanId is provided
    useEffect(() => {
        if (!initialPlanId) return;

        const loadSavedPlan = async () => {
            try {
                const res = await fetch(`/api/plans?id=${initialPlanId}`);
                if (!res.ok) return;
                const data = await res.json();
                const plan = data.plan;

                if (plan && plan.days) {
                    let stops: JourneyStop[] = [];
                    let placeIds: string[] = [];
                    let order = 0;
                    plan.days.forEach((d: any) => {
                        d.places.forEach((placeId: string) => {
                            stops.push({
                                id: `stop-${Date.now()}-${order}`,
                                placeId,
                                day: d.dayNo,
                                order: order++,
                            });
                            placeIds.push(placeId);
                        });
                    });
                    setJourneyStops(stops);
                    setSelectedPlaceIds(placeIds);
                }
            } catch (err) {
                console.error('Failed to load saved plan', err);
            }
        };

        loadSavedPlan();
    }, [initialPlanId]);

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            const daysMap = new Map<number, string[]>();
            journeyStops.forEach(stop => {
                const day = stop.day || 1;
                if (!daysMap.has(day)) daysMap.set(day, []);
                daysMap.get(day)!.push(stop.placeId);
            });

            const days = Array.from(daysMap.entries()).map(([dayNo, places]) => ({
                dayNo,
                places
            }));

            const curatedPlaces = curatedPlacesRaw as any[];
            const districtsUsed = Array.from(new Set(
                journeyStops
                    .map(s => curatedPlaces.find((p: any) => p.id === s.placeId)?.districtId)
                    .filter(Boolean)
            )) as string[];

            const payload = {
                title: 'Custom Tour Draft',
                days,
                districtsUsed,
                status: 'DRAFT',
            };

            const res = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/dashboard/my-plans');
            } else {
                const data = await res.json();
                if (res.status === 401 || res.status === 403) {
                    alert('Please sign in to save your draft.');
                    router.push('/login?callbackUrl=/build-tour');
                } else {
                    alert(data.error || 'Failed to save draft.');
                }
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while saving the draft.');
        } finally {
            setIsSaving(false);
        }
    };

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
                    onSaveDraft={handleSaveDraft}
                    isSaving={isSaving}
                />
            </div>
        </section>
    );
}
