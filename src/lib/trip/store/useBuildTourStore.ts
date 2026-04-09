import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Place, Stop, RouteResult, FilterState, PanelTab, PlaceCategory } from '../types';
import { haversineDistance } from '@/lib/tourUtils';

interface BuildTourState {
    // ─── Data ────────────────────────────────────────────────────────────
    places: Place[];
    setPlaces: (places: Place[]) => void;

    // ─── Filters ─────────────────────────────────────────────────────────
    filters: FilterState;
    setSearchQuery: (query: string) => void;
    toggleCategory: (cat: PlaceCategory) => void;
    setDistrictFilter: (district: string | null) => void;
    clearFilters: () => void;

    // ─── Filtered places (derived) ───────────────────────────────────────
    getFilteredPlaces: () => Place[];

    // ─── Selected Stops ──────────────────────────────────────────────────
    stops: Stop[];
    addStop: (place: Place) => void;
    hydrateStopsFromPlaceIds: (placeIds: string[]) => void;
    removeStop: (stopId: string) => void;
    reorderStops: (oldIndex: number, newIndex: number) => void;
    clearStops: () => void;
    isInStops: (placeId: string) => boolean;
    optimizeOrder: () => void;

    // ─── Active / Hovered ────────────────────────────────────────────────
    activeStopId: string | null;
    setActiveStopId: (id: string | null) => void;
    hoveredPlaceId: string | null;
    setHoveredPlaceId: (id: string | null) => void;

    // ─── Route ───────────────────────────────────────────────────────────
    route: RouteResult | null;
    routeLoading: boolean;
    setRoute: (r: RouteResult | null) => void;
    setRouteLoading: (loading: boolean) => void;
    fetchRoute: () => Promise<void>;

    // ─── Trip Estimates (haversine fallback) ──────────────────────────────
    getTripEstimate: () => { totalKm: number; totalHours: number; driveMinutes: number } | null;

    // ─── UI ──────────────────────────────────────────────────────────────
    activeTab: PanelTab;
    setActiveTab: (tab: PanelTab) => void;
    drawerExpanded: boolean;
    setDrawerExpanded: (expanded: boolean) => void;
}

const initialFilters: FilterState = {
    searchQuery: '',
    categories: [],
    district: null,
};

export const useBuildTourStore = create<BuildTourState>()(
    subscribeWithSelector((set, get) => ({
        // ─── Data ────────────────────────────────────────────────────────
        places: [],
        setPlaces: (places) => set({ places }),

        // ─── Filters ─────────────────────────────────────────────────────
        filters: initialFilters,
        setSearchQuery: (query) =>
            set((s) => ({ filters: { ...s.filters, searchQuery: query } })),
        toggleCategory: (cat) =>
            set((s) => {
                const current = s.filters.categories;
                const next = current.includes(cat)
                    ? current.filter((c) => c !== cat)
                    : [...current, cat];
                return { filters: { ...s.filters, categories: next } };
            }),
        setDistrictFilter: (district) =>
            set((s) => ({ filters: { ...s.filters, district } })),
        clearFilters: () => set({ filters: initialFilters }),

        // ─── Filtered places ─────────────────────────────────────────────
        getFilteredPlaces: () => {
            const { places, filters } = get();
            let filtered = places;

            if (filters.searchQuery) {
                const q = filters.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.district.toLowerCase().includes(q) ||
                        p.shortDescription.toLowerCase().includes(q)
                );
            }

            if (filters.categories.length > 0) {
                filtered = filtered.filter((p) => filters.categories.includes(p.category));
            }

            if (filters.district) {
                filtered = filtered.filter(
                    (p) => p.district.toLowerCase() === filters.district!.toLowerCase()
                );
            }

            return filtered;
        },

        // ─── Selected Stops ──────────────────────────────────────────────
        stops: [],
        addStop: (place) =>
            set((s) => {
                if (s.stops.some((st) => st.placeId === place.id)) return s;
                const newStop: Stop = {
                    stopId: `stop-${Date.now()}-${place.id}`,
                    placeId: place.id,
                    place,
                    order: s.stops.length,
                };
                return { stops: [...s.stops, newStop], activeTab: 'stops' as PanelTab };
            }),
        hydrateStopsFromPlaceIds: (placeIds) =>
            set((s) => {
                const nextStops = placeIds
                    .map((placeId, index) => {
                        const place = s.places.find((entry) => entry.id === placeId);
                        if (!place) return null;

                        return {
                            stopId: `hydrated-stop-${index}-${place.id}`,
                            placeId: place.id,
                            place,
                            order: index,
                        } as Stop;
                    })
                    .filter(Boolean) as Stop[];

                return {
                    stops: nextStops,
                    route: null,
                    activeTab: nextStops.length > 0 ? 'stops' as PanelTab : s.activeTab,
                };
            }),
        removeStop: (stopId) =>
            set((s) => ({
                stops: s.stops
                    .filter((st) => st.stopId !== stopId)
                    .map((st, i) => ({ ...st, order: i })),
            })),
        reorderStops: (oldIndex, newIndex) =>
            set((s) => {
                const arr = [...s.stops];
                const [moved] = arr.splice(oldIndex, 1);
                arr.splice(newIndex, 0, moved);
                return { stops: arr.map((st, i) => ({ ...st, order: i })) };
            }),
        clearStops: () => set({ stops: [], route: null }),
        isInStops: (placeId) => get().stops.some((st) => st.placeId === placeId),

        optimizeOrder: () =>
            set((s) => {
                if (s.stops.length < 3) return s;
                // Simple nearest-neighbor heuristic
                const remaining = [...s.stops];
                const ordered: Stop[] = [remaining.shift()!];

                while (remaining.length > 0) {
                    const last = ordered[ordered.length - 1];
                    let bestIdx = 0;
                    let bestDist = Infinity;
                    for (let i = 0; i < remaining.length; i++) {
                        const d = haversineDistance(
                            { lat: last.place.lat, lng: last.place.lng },
                            { lat: remaining[i].place.lat, lng: remaining[i].place.lng }
                        );
                        if (d < bestDist) {
                            bestDist = d;
                            bestIdx = i;
                        }
                    }
                    ordered.push(remaining.splice(bestIdx, 1)[0]);
                }

                return { stops: ordered.map((st, i) => ({ ...st, order: i })) };
            }),

        // ─── Active / Hovered ────────────────────────────────────────────
        activeStopId: null,
        setActiveStopId: (id) => set({ activeStopId: id }),
        hoveredPlaceId: null,
        setHoveredPlaceId: (id) => set({ hoveredPlaceId: id }),

        // ─── Route ───────────────────────────────────────────────────────
        route: null,
        routeLoading: false,
        setRoute: (r) => set({ route: r }),
        setRouteLoading: (loading) => set({ routeLoading: loading }),

        fetchRoute: async () => {
            const { stops } = get();
            if (stops.length < 2) {
                set({ route: null });
                return;
            }

            set({ routeLoading: true });
            try {
                const coords = stops.map((s) => ({
                    lat: s.place.lat,
                    lng: s.place.lng,
                }));
                const coordStr = coords.map((c) => `${c.lng},${c.lat}`).join(';');
                // Use OSRM Trip API — solves Traveling Salesman Problem
                // roundtrip=false → one-way path (not a loop)
                // source=first → always start from the first stop the user added
                const url = `https://router.project-osrm.org/trip/v1/driving/${coordStr}?overview=full&geometries=geojson&roundtrip=false&source=first`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.code === 'Ok' && data.trips?.[0]) {
                    const trip = data.trips[0];

                    // Extract optimized waypoint order:
                    // Each waypoint in data.waypoints has a `waypoint_index` (position in
                    // optimized trip) and appears at its original input index in the array.
                    // Build a mapping: optimized position → original input index
                    const waypoints = data.waypoints as { waypoint_index: number }[];
                    const optimizedOrder: number[] = new Array(waypoints.length);
                    waypoints.forEach((wp, originalIdx) => {
                        optimizedOrder[wp.waypoint_index] = originalIdx;
                    });

                    // Reorder stops in state to match the optimized driving sequence
                    const reorderedStops = optimizedOrder.map((origIdx, newOrder) => ({
                        ...stops[origIdx],
                        order: newOrder,
                    }));

                    // Road-following geometry from OSRM (flip [lng,lat] → [lat,lng] for Leaflet)
                    const geometry: [number, number][] = trip.geometry.coordinates.map(
                        (c: [number, number]) => [c[1], c[0]] as [number, number]
                    );

                    set({
                        stops: reorderedStops,
                        route: {
                            totalKm: Math.round(trip.distance / 1000),
                            totalHours: Math.round((trip.duration / 3600) * 10) / 10,
                            driveMinutes: Math.round(trip.duration / 60),
                            geometry,
                        },
                        routeLoading: false,
                    });
                } else {
                    throw new Error('No trip found');
                }
            } catch {
                // Fallback: optimize locally with nearest-neighbor, no road geometry
                get().optimizeOrder();
                const est = get().getTripEstimate();
                set({
                    route: est ? { ...est, geometry: null } : null,
                    routeLoading: false,
                });
            }
        },

        // ─── Trip Estimates ──────────────────────────────────────────────
        getTripEstimate: () => {
            const { stops } = get();
            if (stops.length < 2) return null;

            const ROAD_FACTOR = 1.35;
            const AVG_SPEED = 40;
            let totalAirKm = 0;

            for (let i = 0; i < stops.length - 1; i++) {
                totalAirKm += haversineDistance(
                    { lat: stops[i].place.lat, lng: stops[i].place.lng },
                    { lat: stops[i + 1].place.lat, lng: stops[i + 1].place.lng }
                );
            }

            const totalKm = Math.round(totalAirKm * ROAD_FACTOR);
            const driveMinutes = Math.round((totalKm / AVG_SPEED) * 60);
            const visitMinutes = stops.reduce(
                (sum, s) => sum + (s.place.estimatedVisitMinutes || 60),
                0
            );
            const totalHours = Math.round(((driveMinutes + visitMinutes) / 60) * 10) / 10;

            return { totalKm, totalHours, driveMinutes };
        },

        // ─── UI ──────────────────────────────────────────────────────────
        activeTab: 'discover',
        setActiveTab: (tab) => set({ activeTab: tab }),
        drawerExpanded: false,
        setDrawerExpanded: (expanded) => set({ drawerExpanded: expanded }),
    }))
);
