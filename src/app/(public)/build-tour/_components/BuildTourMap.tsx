'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';

import type { JourneyStop } from '@/lib/trip/buildTourTypes';
import { LIGHT_LUXURY_MAP_STYLE, SRI_LANKA_BOUNDS } from '@/lib/maps/buildTourMapStyle';
import DistrictLayer from './DistrictLayer';
import curatedPlacesRaw from '@/data/places/sri-lanka.curated.json';

const curatedPlaces = curatedPlacesRaw as any[];

// Fetch optimized driving trip from OSRM (solves Traveling Salesman Problem)
// Returns the road geometry AND the optimal order of waypoints
interface TripResult {
    geometry: [number, number][];
    waypointOrder: number[]; // Optimized indices order
}

async function fetchOptimizedTrip(coordinates: [number, number][]): Promise<TripResult | null> {
    if (coordinates.length < 2) return null;
    try {
        const coordStr = coordinates.map(c => `${c[0]},${c[1]}`).join(';');
        // Use trip endpoint: optimizes waypoint order for the shortest route
        // roundtrip=false → one-way path (not a loop)
        // source=first → start from the first waypoint
        const res = await fetch(
            `https://router.project-osrm.org/trip/v1/driving/${coordStr}?overview=full&geometries=geojson&roundtrip=false&source=first`
        );
        const data = await res.json();

        if (data.code === 'Ok' && data.trips?.[0]) {
            const trip = data.trips[0];

            // Build optimized order: optimized position → original input index
            // Each waypoint appears at its original input index in the array,
            // and waypoint_index tells us where it goes in the optimized trip.
            const waypoints = data.waypoints as { waypoint_index: number }[];
            const waypointOrder: number[] = new Array(waypoints.length);
            waypoints.forEach((wp, originalIdx) => {
                waypointOrder[wp.waypoint_index] = originalIdx;
            });

            return {
                geometry: trip.geometry.coordinates,
                waypointOrder
            };
        }
    } catch (err) {
        console.warn('OSRM trip failed, falling back to straight lines:', err);
    }
    return null;
}

export interface BuildTourMapProps {
    selectedDistrictId: string | null;
    hoveredDistrictId: string | null;
    setHoveredDistrictId: (id: string | null) => void;
    setSelectedDistrictId: (id: string | null) => void;
    journeyStops: JourneyStop[];
    setJourneyStops: (stops: JourneyStop[]) => void;
    routeVisible: boolean;
}

export default function BuildTourMap({
    selectedDistrictId,
    hoveredDistrictId,
    setHoveredDistrictId,
    setSelectedDistrictId,
    journeyStops,
    setJourneyStops,
    routeVisible
}: BuildTourMapProps) {

    const [viewState, setViewState] = useState({
        longitude: 80.7718, // Center of Sri Lanka approx
        latitude: 7.8731,
        zoom: 4.5, // Small enough to show full island with padding
        pitch: 0,
        bearing: 0
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newZoom = 4.2; // 3.2 + 1.0 = 4.2 (2x bigger than previous, but smaller than original 4.5)
            if (width > 1500) newZoom = 4.9; // 3.9 + 1.0 = 4.9
            else if (width > 1024) newZoom = 4.5; // 3.5 + 1.0 = 4.5
            else if (width > 768) newZoom = 4.2; // 3.2 + 1.0 = 4.2

            setViewState(prev => ({ ...prev, zoom: newZoom }));
        };

        handleResize(); // Set initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [cursorPos, setCursorPos] = useState<{ x: number, y: number } | null>(null);
    const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);

    const onHover = (event: MapLayerMouseEvent) => {
        const feature = event.features && event.features[0];
        if (feature && feature.properties?.district_id) {
            setHoveredDistrictId(feature.properties.district_id);
            setHoveredDistrictName(feature.properties.district_name || feature.properties.district_id);
            setCursorPos({ x: event.point.x, y: event.point.y });
        } else {
            setHoveredDistrictId(null);
            setHoveredDistrictName(null);
            setCursorPos(null);
        }
    };

    const onClick = (event: MapLayerMouseEvent) => {
        const feature = event.features && event.features[0];
        if (feature && feature.properties?.district_id) {
            setSelectedDistrictId(feature.properties.district_id);
        } else {
            setSelectedDistrictId(null);
        }
    };

    // ── Smart Road-Route with TSP Optimization ────────────────────────
    const [routeData, setRouteData] = useState<any>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Initial straight-line route calculation without calling OSRM API
    useEffect(() => {
        const stopsWithCoords = journeyStops.map(stop => {
            const place = curatedPlaces.find(p => p.id === stop.placeId);
            return place ? { stop, coord: [place.lng, place.lat] as [number, number] } : null;
        }).filter(Boolean) as { stop: JourneyStop; coord: [number, number] }[];

        if (stopsWithCoords.length < 1) {
            setRouteData(null);
            return;
        }

        if (stopsWithCoords.length < 2) {
            // Single stop — just show the point
            setRouteData({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature', properties: { stopNumber: 1 },
                    geometry: { type: 'Point', coordinates: stopsWithCoords[0].coord }
                }]
            });
            return;
        }

        const coords = stopsWithCoords.map(s => s.coord);

        // Build GeoJSON with straight lines connecting stops in their current manual order
        const buildStraightLineRoute = () => ({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature', properties: {},
                    geometry: { type: 'LineString', coordinates: coords }
                },
                ...coords.map((coord, i) => ({
                    type: 'Feature' as const,
                    properties: { stopNumber: i + 1 },
                    geometry: { type: 'Point' as const, coordinates: coord }
                }))
            ]
        });

        // By default, just draw the straight lines immediately (0 API calls locally)
        setRouteData(buildStraightLineRoute());

    }, [journeyStops.length, journeyStops.map(s => s.placeId).join(','), journeyStops.map(s => s.order).join(',')]);


    // ── Manual Optimization Trigger ───────────────────────────────────────────
    const handleOptimizeRoute = async () => {
        if (journeyStops.length < 2) return;

        setIsOptimizing(true);

        const stopsWithCoords = journeyStops.map(stop => {
            const place = curatedPlaces.find(p => p.id === stop.placeId);
            return place ? { stop, coord: [place.lng, place.lat] as [number, number] } : null;
        }).filter(Boolean) as { stop: JourneyStop; coord: [number, number] }[];

        const coords = stopsWithCoords.map(s => s.coord);

        // Helper: build GeoJSON result from road geometry + ordered coordinates
        const buildRouteGeoJson = (geometry: [number, number][], orderedCoords: [number, number][]) => ({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature', properties: {},
                    geometry: { type: 'LineString', coordinates: geometry }
                },
                ...orderedCoords.map((coord, i) => ({
                    type: 'Feature' as const,
                    properties: { stopNumber: i + 1 },
                    geometry: { type: 'Point' as const, coordinates: coord }
                }))
            ]
        });

        // Helper: fetch road geometry using OSRM /route/v1/ (sequential, no TSP)
        const fetchRouteGeometry = async (routeCoords: [number, number][]) => {
            const coordStr = routeCoords.map(c => `${c[0]},${c[1]}`).join(';');
            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`
            );
            const data = await res.json();
            if (data.code === 'Ok' && data.routes?.[0]) {
                return data.routes[0].geometry.coordinates as [number, number][];
            }
            return null;
        };

        // Helper: nearest-neighbor reordering
        const nearestNeighborOrder = (inputCoords: [number, number][]) => {
            const remaining = inputCoords.map((c, i) => ({ coord: c, origIdx: i }));
            const ordered = [remaining.shift()!];
            while (remaining.length > 0) {
                const last = ordered[ordered.length - 1].coord;
                let bestIdx = 0;
                let bestDist = Infinity;
                for (let i = 0; i < remaining.length; i++) {
                    const dx = last[0] - remaining[i].coord[0];
                    const dy = last[1] - remaining[i].coord[1];
                    const d = dx * dx + dy * dy;
                    if (d < bestDist) { bestDist = d; bestIdx = i; }
                }
                ordered.push(remaining.splice(bestIdx, 1)[0]);
            }
            return ordered.map(o => o.origIdx);
        };

        try {
            const result = await fetchOptimizedTrip(coords);

            if (result) {
                // Reorder journey stops based on OSRM's optimized waypoint order
                const optimizedStops = result.waypointOrder.map((origIdx, newIdx) => ({
                    ...stopsWithCoords[origIdx].stop,
                    order: newIdx
                }));
                // We trigger the state update which will also regenerate the straight lines via the effect,
                // but immediately overwrite it with the rich routeData to prioritize the road geometry.
                setJourneyStops(optimizedStops);

                const optimizedCoords = result.waypointOrder.map(idx => stopsWithCoords[idx].coord);
                setRouteData(buildRouteGeoJson(result.geometry, optimizedCoords));

            } else {
                // Fallback: nearest-neighbor reordering + OSRM route for road geometry
                console.warn('OSRM trip API failed, falling back to nearest-neighbor + route API');
                const nnOrder = nearestNeighborOrder(coords);
                const reorderedCoords = nnOrder.map(i => coords[i]);

                // Reorder stops with nearest-neighbor
                const reorderedStops = nnOrder.map((origIdx, newIdx) => ({
                    ...stopsWithCoords[origIdx].stop,
                    order: newIdx
                }));
                setJourneyStops(reorderedStops);

                try {
                    const roadGeometry = await fetchRouteGeometry(reorderedCoords);
                    if (roadGeometry) {
                        setRouteData(buildRouteGeoJson(roadGeometry, reorderedCoords));
                    } else {
                        throw new Error("No geom");
                    }
                } catch (err) {
                    console.warn('Network error fetching route geometry, leaving as straight lines:', err);
                }
            }
        } catch (globalErr) {
            console.error("Optimization completely failed:", globalErr);
            alert("Unable to reach the routing service. Your path has connected with straight lines.");
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="w-full h-full relative z-0">
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle={LIGHT_LUXURY_MAP_STYLE}
                interactiveLayerIds={['district-fills']}
                onMouseMove={onHover}
                onClick={onClick}
                onMouseLeave={() => {
                    setHoveredDistrictId(null);
                    setCursorPos(null);
                }}
                dragPan={false}
                scrollZoom={false}
                doubleClickZoom={false}
                dragRotate={false}
                touchZoomRotate={false}
                maxBounds={SRI_LANKA_BOUNDS}
                cursor={hoveredDistrictId ? 'pointer' : 'default'}
            >
                <DistrictLayer
                    hoveredDistrictId={hoveredDistrictId}
                    selectedDistrictId={selectedDistrictId}
                />

                {/* Route Line and Stop Points */}
                {routeData && journeyStops.length >= 1 && (
                    <Source id="journey-route" type="geojson" data={routeData as any}>
                        {/* Soft glow behind route */}
                        <Layer
                            id="route-glow"
                            type="line"
                            filter={['==', ['geometry-type'], 'LineString']}
                            paint={{
                                'line-color': '#D4AF37',
                                'line-width': 8,
                                'line-opacity': 0.15,
                                'line-blur': 4
                            }}
                        />
                        {/* Main road route line */}
                        <Layer
                            id="route-line"
                            type="line"
                            filter={['==', ['geometry-type'], 'LineString']}
                            paint={{
                                'line-color': '#D4AF37',
                                'line-width': 3.5,
                                'line-opacity': 0.9
                            }}
                            layout={{
                                'line-cap': 'round',
                                'line-join': 'round'
                            }}
                        />
                        {/* Stop node circles */}
                        <Layer
                            id="route-points"
                            type="circle"
                            filter={['==', ['geometry-type'], 'Point']}
                            paint={{
                                'circle-radius': 7,
                                'circle-color': '#043927',
                                'circle-stroke-width': 3,
                                'circle-stroke-color': '#fff'
                            }}
                        />
                    </Source>
                )}

                {/* Floating Map Controls at Bottom Center */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-4 pointer-events-none">
                    {/* Optimize Route Button */}
                    <div className="pointer-events-auto">
                        <button
                            onClick={handleOptimizeRoute}
                            disabled={isOptimizing || journeyStops.length < 2}
                            className="bg-deep-emerald text-white px-5 py-3 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-xs tracking-widest uppercase font-bold disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            {isOptimizing ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Optimizing...
                                </>
                            ) : (
                                '🛣️ Optimize Route'
                            )}
                        </button>
                    </div>
                </div>

                {/* Floating District Hover Chip */}
                {hoveredDistrictId && cursorPos && !selectedDistrictId && (
                    <div
                        className="absolute z-50 pointer-events-none bg-white/80 backdrop-blur-xl border border-white px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-opacity duration-200"
                        style={{
                            left: cursorPos.x,
                            top: cursorPos.y - 40,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <span className="text-deep-emerald font-serif text-sm tracking-wide capitalize">{hoveredDistrictName || hoveredDistrictId}</span>
                    </div>
                )}
            </Map>
        </div>
    );
}
