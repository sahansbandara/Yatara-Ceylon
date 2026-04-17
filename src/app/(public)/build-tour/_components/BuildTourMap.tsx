'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { getViewportPadding } from '@/lib/buildTour/getViewportPadding';

import type { JourneyStop } from '@/lib/trip/buildTourTypes';
import { LIGHT_LUXURY_MAP_STYLE, SRI_LANKA_BOUNDS } from '@/lib/maps/buildTourMapStyle';
import DistrictLayer from './DistrictLayer';
import curatedPlacesRaw from '@/data/places/sri-lanka.curated.json';
import { DEFAULT_IMAGE_BLUR_DATA_URL, getPlaceThumbnailSrc } from '@/lib/image-utils';

const curatedPlaces = curatedPlacesRaw as any[];

// Fetch optimized driving trip from OSRM (solves Traveling Salesman Problem)
// Returns the road geometry AND the optimal order of waypoints
interface TripResult {
    geometry: [number, number][];
    waypointOrder: number[]; // Optimized indices order
}

async function fetchOptimizedTrip(coordinates: [number, number][], sourceFirst: boolean = false): Promise<TripResult | null> {
    if (coordinates.length < 2) return null;
    try {
        const coordStr = coordinates.map(c => `${c[0]},${c[1]}`).join(';');
        // Use trip endpoint: optimizes waypoint order for the shortest route
        // roundtrip=false → one-way path (not a loop)
        const sourceParam = sourceFirst ? 'first' : 'any';
        const res = await fetch(
            `https://router.project-osrm.org/trip/v1/driving/${coordStr}?overview=full&geometries=geojson&roundtrip=false&source=${sourceParam}&destination=any`
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

    const mapRef = useRef<MapRef>(null);

    const [viewState, setViewState] = useState({
        longitude: 80.7718, // Center of Sri Lanka approx
        latitude: 7.8731,
        zoom: 7, // Initial zoom that gets immediately overridden by fitBounds
        pitch: 0,
        bearing: 0
    });

    const fitSriLankaBounds = useCallback(() => {
        if (!mapRef.current) return;
        const padding = getViewportPadding();
        mapRef.current.fitBounds(SRI_LANKA_BOUNDS, {
            padding,
            duration: 1000,
            maxZoom: 8
        });
    }, []);

    // Initial load and resize bounds framing
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (!selectedDistrictId) {
                    fitSriLankaBounds();
                } else {
                    // Refit to district if selected (will be handled by DistrictLayer or here)
                }
            }, 300);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [selectedDistrictId, fitSriLankaBounds]);

    // Handle selected district zoom
    useEffect(() => {
        if (!selectedDistrictId) {
            fitSriLankaBounds();
        }
    }, [selectedDistrictId, fitSriLankaBounds]);

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

    // Helper to calculate bounding box of a GeoJSON feature
    const getFeatureBounds = (feature: any): [number, number, number, number] => {
        let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
        const processCoords = (coords: any[]) => {
            if (typeof coords[0] === 'number') {
                const [lng, lat] = coords;
                if (lng < minLng) minLng = lng;
                if (lat < minLat) minLat = lat;
                if (lng > maxLng) maxLng = lng;
                if (lat > maxLat) maxLat = lat;
            } else {
                coords.forEach(processCoords);
            }
        };
        if (feature.geometry?.coordinates) {
            processCoords(feature.geometry.coordinates);
        }
        return [minLng, minLat, maxLng, maxLat];
    };

    const onClick = (event: MapLayerMouseEvent) => {
        setPopupInfo(null);
        const feature = event.features && event.features[0];
        if (feature && feature.properties?.district_id) {
            const districtId = feature.properties.district_id;
            setSelectedDistrictId(districtId);

            // Auto fit bounds to the district
            const bounds = getFeatureBounds(feature);
            if (bounds[0] !== Infinity && mapRef.current) {
                mapRef.current.fitBounds(bounds, {
                    padding: getViewportPadding(),
                    duration: 1000,
                    maxZoom: 9
                });
            }
        } else {
            setSelectedDistrictId(null);
        }
    };

    // ── Smart Road-Route with TSP Optimization ────────────────────────
    const [routeData, setRouteData] = useState<any>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);
    const [popupInfo, setPopupInfo] = useState<{ place: any, stopNumber: number } | null>(null);

    // Initial route calculation fetching real road geometry
    useEffect(() => {
        let isMounted = true;

        const buildRouteGeoJson = (coords: [number, number][]) => ({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature', properties: {},
                    geometry: { type: 'LineString', coordinates: coords }
                }
            ]
        });

        const fetchAndSetRoute = async () => {
            const stopsWithCoords = journeyStops.map(stop => {
                const place = curatedPlaces.find(p => p.id === stop.placeId);
                return place ? { stop, coord: [place.lng, place.lat] as [number, number] } : null;
            }).filter(Boolean) as { stop: JourneyStop; coord: [number, number] }[];

            if (stopsWithCoords.length < 1) {
                if (isMounted) setRouteData(null);
                return;
            }

            if (stopsWithCoords.length < 2) {
                // Single stop — just show the point
                if (isMounted) {
                    setRouteData({
                        type: 'FeatureCollection',
                        features: [{
                            type: 'Feature', properties: { stopNumber: 1 },
                            geometry: { type: 'Point', coordinates: stopsWithCoords[0].coord }
                        }]
                    });
                }
                return;
            }

            const coords = stopsWithCoords.map(s => s.coord);

            // Fetch actual road geometry for the current order
            const coordStr = coords.map(c => `${c[0]},${c[1]}`).join(';');
            try {
                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`
                );
                const data = await res.json();

                if (isMounted && data.code === 'Ok' && data.routes?.[0]) {
                    setRouteData(buildRouteGeoJson(data.routes[0].geometry.coordinates));
                } else if (isMounted) {
                    // Fallback to straight lines only if API fails
                    setRouteData(buildRouteGeoJson(coords));
                }
            } catch (err) {
                if (isMounted) {
                    // Fallback to straight lines on network error
                    setRouteData(buildRouteGeoJson(coords));
                }
            }
        };

        // Don't auto-fetch if we are in the middle of a TSP optimization 
        // to avoid race conditions with setting the optimized geometry
        if (!isOptimizing) {
            fetchAndSetRoute();
        }

        return () => {
            isMounted = false;
        };
    }, [journeyStops.length, journeyStops.map(s => s.placeId).join(','), journeyStops.map(s => s.order).join(','), isOptimizing]);


    // ── Manual Optimization Trigger ───────────────────────────────────────────
    const handleRunOptimization = async (startStopId: string | null) => {
        setShowStartModal(false);
        if (journeyStops.length < 2) return;

        setIsOptimizing(true);

        let stopsWithCoords = journeyStops.map(stop => {
            const place = curatedPlaces.find(p => p.id === stop.placeId);
            return place ? { stop, coord: [place.lng, place.lat] as [number, number] } : null;
        }).filter(Boolean) as { stop: JourneyStop; coord: [number, number] }[];

        if (startStopId) {
            const startIndex = stopsWithCoords.findIndex(s => s.stop.id === startStopId);
            if (startIndex > 0) {
                const startItem = stopsWithCoords.splice(startIndex, 1)[0];
                stopsWithCoords.unshift(startItem);
            }
        }

        const coords = stopsWithCoords.map(s => s.coord);

        // Helper: build GeoJSON result from road geometry + ordered coordinates
        const buildRouteGeoJson = (geometry: [number, number][]) => ({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature', properties: {},
                    geometry: { type: 'LineString', coordinates: geometry }
                }
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
            const result = await fetchOptimizedTrip(coords, !!startStopId);

            if (result) {
                // Reorder journey stops based on OSRM's optimized waypoint order
                const optimizedStops = result.waypointOrder.map((origIdx, newIdx) => ({
                    ...stopsWithCoords[origIdx].stop,
                    order: newIdx
                }));
                // We trigger the state update which will also regenerate the straight lines via the effect,
                // but immediately overwrite it with the rich routeData to prioritize the road geometry.
                setJourneyStops(optimizedStops);

                setRouteData(buildRouteGeoJson(result.geometry));

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
                        setRouteData(buildRouteGeoJson(roadGeometry));
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
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                onLoad={fitSriLankaBounds}
                mapStyle={LIGHT_LUXURY_MAP_STYLE}
                interactiveLayerIds={['district-fills']}
                onMouseMove={onHover}
                onClick={onClick}
                onMouseLeave={() => {
                    setHoveredDistrictId(null);
                    setCursorPos(null);
                }}
                dragPan={true}
                scrollZoom={false}
                doubleClickZoom={true}
                dragRotate={false}
                touchZoomRotate={true}
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
                    </Source>
                )}

                {/* HTML Markers for Places */
                }
                {journeyStops.map((stop) => {
                    const place = curatedPlaces.find(p => p.id === stop.placeId);
                    if (!place) return null;

                    const sortedStops = [...journeyStops].sort((a, b) => a.order - b.order);
                    const displayIndex = sortedStops.findIndex(s => s.id === stop.id) + 1;

                    return (
                        <Marker
                            key={stop.id}
                            longitude={place.lng}
                            latitude={place.lat}
                            anchor="bottom"
                            onClick={e => {
                                e.originalEvent.stopPropagation();
                                setPopupInfo({ place, stopNumber: displayIndex });
                            }}
                        >
                            <div className="cursor-pointer group relative">
                                <div className="absolute -top-3 -right-3 w-[22px] h-[22px] rounded-full bg-antique-gold text-deep-emerald flex items-center justify-center text-[10px] font-extrabold shadow-md ring-2 ring-white z-10 transition-transform group-hover:scale-110">
                                    {displayIndex}
                                </div>
                                {/* SVG map pin */}
                                <div className="w-9 h-9 text-deep-emerald filter drop-shadow-lg group-hover:-translate-y-1 transition-transform">
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1.5">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                            </div>
                        </Marker>
                    );
                })}

                {/* Popup for Markers */}
                {popupInfo && (
                    <Popup
                        longitude={popupInfo.place.lng}
                        latitude={popupInfo.place.lat}
                        offset={18}
                        onClose={() => setPopupInfo(null)}
                        className="tour-popup z-50 rounded-xl overflow-hidden shadow-2xl"
                        closeButton={false}
                        focusAfterOpen={false}
                    >
                        <div className="p-1 w-52 font-sans bg-white/95 rounded-xl border border-black/5">
                            <div className="w-full h-28 relative rounded-lg overflow-hidden mb-2 bg-black/5">
                                {popupInfo.place.image && (
                                    <Image
                                        src={getPlaceThumbnailSrc(popupInfo.place.image)}
                                        alt={popupInfo.place.name}
                                        fill
                                        sizes="208px"
                                        unoptimized
                                        placeholder="blur"
                                        blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                                        className="object-cover"
                                    />
                                )}
                                <div className="absolute top-2 left-2 bg-antique-gold text-deep-emerald text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded shadow-sm">
                                    Stop {popupInfo.stopNumber}
                                </div>
                            </div>
                            <div className="px-1.5 pb-1">
                                <h4 className="font-serif font-medium text-deep-emerald text-sm mb-1">{popupInfo.place.name}</h4>
                                <p className="uppercase text-[10px] tracking-widest text-deep-emerald/60 line-clamp-1">{popupInfo.place.category.replace(/_/g, ' ')}</p>
                            </div>
                        </div>
                    </Popup>
                )}

                {/* Floating Map Controls at Bottom Center */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-4 pointer-events-none items-center">
                    {/* View Sri Lanka Reset Button */}
                    {selectedDistrictId && (
                        <div className="pointer-events-auto">
                            <button
                                onClick={() => setSelectedDistrictId(null)}
                                className="bg-white/80 backdrop-blur-xl border border-white/50 text-deep-emerald px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 planner-reset-button"
                            >
                                📍 View Sri Lanka
                            </button>
                        </div>
                    )}

                    {/* Optimize Route Button */}
                    <div className="pointer-events-auto">
                        <button
                            onClick={() => setShowStartModal(true)}
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

                {/* Start Optimization Modal Overlay */}
                {showStartModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#f4f1eb]/60 backdrop-blur-md pointer-events-auto">
                        <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-black/5 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-serif text-deep-emerald mb-2">Select Starting Point</h3>
                                <p className="text-xs text-deep-emerald/60 mb-5 leading-relaxed">Where will you begin your journey? Pick your location so we can optimize the route around it.</p>

                                <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto mb-4 custom-scrollbar pr-2">
                                    <button
                                        onClick={() => handleRunOptimization(null)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-deep-emerald/5 border border-transparent hover:border-deep-emerald/20 transition-all group"
                                    >
                                        <span className="font-semibold text-sm text-deep-emerald block">Let the algorithm decide</span>
                                        <span className="text-[10px] text-deep-emerald/50">Finds the mathematically shortest loop</span>
                                    </button>

                                    {journeyStops.map(stop => {
                                        const p = curatedPlaces.find(pl => pl.id === stop.placeId);
                                        return (
                                            <button
                                                key={stop.id}
                                                onClick={() => handleRunOptimization(stop.id)}
                                                className="w-full text-left p-3 flex items-center gap-3 rounded-xl hover:bg-deep-emerald/5 border border-transparent hover:border-deep-emerald/20 transition-all"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-black/5 overflow-hidden relative shrink-0">
                                                    {p?.image && (
                                                        <Image
                                                            src={getPlaceThumbnailSrc(p.image)}
                                                            alt={p.name}
                                                            fill
                                                            sizes="32px"
                                                            unoptimized
                                                            placeholder="blur"
                                                            blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 overflow-hidden min-w-0">
                                                    <span className="font-medium text-sm text-deep-emerald block truncate">{p?.name || stop.placeId}</span>
                                                    <span className="text-[10px] uppercase tracking-widest text-deep-emerald/50 block truncate">{p?.district || 'Unknown'} District</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setShowStartModal(false)} className="w-full py-2.5 text-center text-xs font-bold tracking-widest uppercase text-deep-emerald/40 hover:text-deep-emerald transition-colors">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </Map>
        </div>
    );
}
