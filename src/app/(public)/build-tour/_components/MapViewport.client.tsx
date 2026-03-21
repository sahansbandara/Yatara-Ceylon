'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import { getCategoryColor } from '@/lib/trip/types';
import { resolveGeoNameToId, getDistrictById } from '@/lib/districts';
import { DISTRICT_TO_REGION } from '@/lib/regions';
import type { Place } from '@/lib/trip/types';
import { MapPin, Route, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const getStoreState = () => useBuildTourStore.getState();

// Sri Lanka bounds — tight framing for 70% fill
const SRI_LANKA_BOUNDS: [[number, number], [number, number]] = [
    [5.92, 79.52],  // SW corner
    [9.85, 81.88],  // NE corner
];

interface MapViewportProps {
    activeRegionId?: string | null;
}

export default function MapViewport({ activeRegionId }: MapViewportProps) {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<any>(null);
    const routeLayerRef = useRef<any>(null);
    const geoJsonLayerRef = useRef<any>(null);

    const places = useBuildTourStore((s) => s.places);
    const stops = useBuildTourStore((s) => s.stops);
    const route = useBuildTourStore((s) => s.route);
    const fetchRoute = useBuildTourStore((s) => s.fetchRoute);
    const setDistrictFilter = useBuildTourStore((s) => s.setDistrictFilter);

    const [L, setL] = useState<any>(null);
    const [geoData, setGeoData] = useState<any>(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);

    // Load Leaflet + GeoJSON
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const leaflet = await import('leaflet');
                if (typeof window !== 'undefined') {
                    (window as any).L = leaflet.default || leaflet;
                }
                await import('leaflet.markercluster');

                const response = await fetch('/sri-lanka-districts.geojson');
                if (!response.ok) throw new Error('Failed to fetch GeoJSON');
                const geo = await response.json();

                if (cancelled) return;
                setL(leaflet.default || leaflet);
                setGeoData(geo);
            } catch (err) {
                console.error("Error loading map assets:", err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Init map — dark premium theme with tight Sri Lanka framing
    useEffect(() => {
        if (!L || !mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [7.85, 80.75],
            zoom: 8,
            minZoom: 7,
            maxZoom: 15,
            zoomControl: false,
            attributionControl: false,
            maxBounds: [[4.5, 78.0], [11.0, 83.5]],
            maxBoundsViscosity: 0.9,
            zoomSnap: 0.25,
            zoomDelta: 0.5,
        });

        // Custom zoom control — positioned right
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        mapRef.current = map;

        // Tight initial fit to Sri Lanka bounds
        setTimeout(() => {
            map.invalidateSize();
            map.fitBounds(SRI_LANKA_BOUNDS, {
                padding: [30, 40],
                animate: false,
            });
        }, 300);

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [L]);

    // GeoJSON district boundaries — elite dark theme
    useEffect(() => {
        if (!L || !mapRef.current || !geoData) return;

        if (geoJsonLayerRef.current) {
            mapRef.current.removeLayer(geoJsonLayerRef.current);
        }

        // Elite color palette for districts
        const dimStyle = {
            fillColor: '#1a3a2e',
            weight: 1,
            opacity: 0.5,
            color: 'rgba(212, 175, 55, 0.08)',
            fillOpacity: 0.4,
        };

        const defaultStyle = {
            fillColor: '#1f4d3d',
            weight: 1.5,
            opacity: 0.7,
            color: 'rgba(212, 175, 55, 0.12)',
            fillOpacity: 0.7,
        };

        const hoverStyle = {
            fillColor: '#2a6b54',
            fillOpacity: 0.85,
            weight: 2,
            color: 'rgba(212, 175, 55, 0.35)',
            opacity: 1,
        };

        const selectedStyle = {
            fillColor: '#2a6b54',
            fillOpacity: 0.9,
            weight: 2.5,
            color: '#D4AF37',
            opacity: 1,
        };

        const regionActiveStyle = {
            fillColor: '#245a47',
            weight: 1.5,
            opacity: 0.9,
            color: 'rgba(212, 175, 55, 0.2)',
            fillOpacity: 0.8,
        };

        geoJsonLayerRef.current = L.geoJSON(geoData, {
            style: (feature: any) => {
                const shapeName = (feature?.properties?.shapeName || '').replace(/\s*District$/i, '').trim();
                const districtId = resolveGeoNameToId(shapeName);

                if (districtId === selectedDistrictId) return selectedStyle;

                if (activeRegionId) {
                    const regionOfDistrict = DISTRICT_TO_REGION[districtId];
                    if (regionOfDistrict === activeRegionId) return regionActiveStyle;
                    return dimStyle;
                }

                return defaultStyle;
            },
            onEachFeature: (feature: any, layer: any) => {
                const shapeName = (feature.properties.shapeName || '').replace(/\s*District$/i, '').trim();
                const districtId = resolveGeoNameToId(shapeName);
                const district = districtId ? getDistrictById(districtId) : null;

                const tooltipContent = district
                    ? `<div class="district-tooltip-luxury">
                        <span class="district-tooltip-name">${district.name}</span>
                        <span class="district-tooltip-label">${district.luxuryLabel}</span>
                       </div>`
                    : shapeName;

                layer.bindTooltip(tooltipContent, {
                    permanent: false,
                    direction: 'center',
                    className: 'build-tour-district-tooltip',
                });

                // Hover — smooth style change
                layer.on('mouseover', () => {
                    if (districtId !== selectedDistrictId) {
                        layer.setStyle(hoverStyle);
                        layer.bringToFront();
                    }
                });
                layer.on('mouseout', () => {
                    if (districtId !== selectedDistrictId) {
                        if (activeRegionId) {
                            const regionOfDistrict = DISTRICT_TO_REGION[districtId];
                            layer.setStyle(regionOfDistrict === activeRegionId ? regionActiveStyle : dimStyle);
                        } else {
                            layer.setStyle(defaultStyle);
                        }
                    }
                });

                // Click — select district with smooth animated fitBounds
                layer.on('click', () => {
                    const newId = selectedDistrictId === districtId ? null : districtId;
                    setSelectedDistrictId(newId);
                    const masterName = district ? district.name : shapeName;
                    setDistrictFilter(newId ? masterName : null);

                    if (newId && mapRef.current) {
                        const bounds = layer.getBounds();
                        mapRef.current.fitBounds(bounds, {
                            padding: [60, 60],
                            maxZoom: 11,
                            animate: true,
                            duration: 0.9,
                        });
                    } else if (mapRef.current) {
                        // Smooth return to island overview
                        mapRef.current.fitBounds(SRI_LANKA_BOUNDS, {
                            padding: [30, 40],
                            animate: true,
                            duration: 0.8,
                        });
                    }
                });
            },
        }).addTo(mapRef.current);
    }, [L, geoData, selectedDistrictId, activeRegionId, setDistrictFilter]);

    // Place markers — ONLY shown when a district is selected
    const updateMarkers = useCallback(() => {
        if (!L || !mapRef.current) return;

        if (markersRef.current) {
            mapRef.current.removeLayer(markersRef.current);
            markersRef.current = null;
        }

        if (!selectedDistrictId) return;

        const selectedDistrict = getDistrictById(selectedDistrictId);
        if (!selectedDistrict) return;

        const districtPlaces = places.filter(
            (p: Place) => p.districtId === selectedDistrictId ||
                p.district.toLowerCase() === selectedDistrict.name.toLowerCase()
        );

        if (districtPlaces.length === 0) return;

        const cluster = L.markerClusterGroup({
            maxClusterRadius: 40,
            iconCreateFunction: (c: any) => {
                const count = c.getChildCount();
                return L.divIcon({
                    html: `<div class="build-tour-cluster">${count}</div>`,
                    className: 'build-tour-cluster-wrapper',
                    iconSize: L.point(36, 36),
                });
            },
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            animateAddingMarkers: true,
        });

        districtPlaces.forEach((place: Place) => {
            const color = getCategoryColor(place.category);
            const icon = L.divIcon({
                html: `<div class="build-tour-pin ${getStoreState().isInStops(place.id) ? 'in-stops' : ''}" style="--pin-color: ${color}">
                    <div class="pin-dot"></div>
                </div>`,
                className: 'build-tour-pin-wrapper',
                iconSize: L.point(20, 20),
                iconAnchor: L.point(10, 10),
            });

            const marker = L.marker([place.lat, place.lng], { icon });

            marker.on('popupopen', () => {
                const currentlyInStops = getStoreState().isInStops(place.id);
                const popupEl = marker.getPopup()?.getElement();
                if (popupEl) {
                    const contentDiv = popupEl.querySelector('.leaflet-popup-content');
                    if (contentDiv) {
                        contentDiv.innerHTML = `<div class="build-tour-popup">
                            <div class="popup-category" style="color: ${color}">${place.category}</div>
                            <div class="popup-name">${place.name}</div>
                            <div class="popup-district">${place.district}</div>
                            <div class="popup-teaser">${place.teaser}</div>
                            ${!currentlyInStops
                                ? `<button class="popup-add-btn" data-place-id="${place.id}">+ Add to Trip</button>`
                                : '<div class="popup-added">✓ Added</div>'
                            }
                        </div>`;

                        const btn = contentDiv.querySelector(`[data-place-id="${place.id}"]`);
                        if (btn) {
                            btn.addEventListener('click', () => {
                                getStoreState().addStop(place);
                                marker.closePopup();
                            });
                        }
                    }
                }
            });

            marker.bindPopup(
                `<div class="build-tour-popup"><div class="popup-name">${place.name}</div></div>`,
                { className: 'build-tour-popup-wrapper', maxWidth: 250 }
            );

            cluster.addLayer(marker);
        });

        mapRef.current.addLayer(cluster);
        markersRef.current = cluster;
    }, [L, places, selectedDistrictId, stops.length]);

    useEffect(() => {
        updateMarkers();
    }, [updateMarkers]);

    // Route polyline — gold luxury line
    useEffect(() => {
        if (!L || !mapRef.current) return;

        if (routeLayerRef.current) {
            mapRef.current.removeLayer(routeLayerRef.current);
            routeLayerRef.current = null;
        }

        if (route?.geometry && route.geometry.length > 0) {
            routeLayerRef.current = L.polyline(route.geometry, {
                color: '#D4AF37',
                weight: 3,
                opacity: 0.8,
                dashArray: '10, 6',
                smoothFactor: 1.5,
            }).addTo(mapRef.current);
        } else if (stops.length >= 2) {
            const positions = stops.map((s) => [s.place.lat, s.place.lng] as [number, number]);
            routeLayerRef.current = L.polyline(positions, {
                color: '#D4AF37',
                weight: 2.5,
                opacity: 0.6,
                dashArray: '8, 8',
                smoothFactor: 1.5,
            }).addTo(mapRef.current);
        }
    }, [L, route, stops]);

    // Fit bounds to stops — smooth animation
    useEffect(() => {
        if (!L || !mapRef.current || stops.length === 0) return;
        const bounds = L.latLngBounds(stops.map((s) => [s.place.lat, s.place.lng]));
        mapRef.current.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 11,
            animate: true,
            duration: 0.9,
        });
    }, [L, stops]);

    // Fetch route on stops change
    useEffect(() => {
        const timer = setTimeout(() => { fetchRoute(); }, 500);
        return () => clearTimeout(timer);
    }, [stops, fetchRoute]);

    // Fly to region
    useEffect(() => {
        if (!L || !mapRef.current || !activeRegionId) return;
        import('@/lib/regions').then(({ getRegionById }) => {
            const region = getRegionById(activeRegionId);
            if (region) {
                mapRef.current.flyTo(region.center, region.zoom, { duration: 0.9 });
            }
        });
    }, [L, activeRegionId]);

    return (
        <div className="w-full h-full relative">
            {/* Dark premium map background */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Floating Stats Overlay — glass effect */}
            <div className="absolute top-4 left-4 z-[1000]">
                <div className="map-stats-overlay rounded-xl px-4 py-2.5 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-antique-gold/70" />
                        <span className="text-white/80 text-[11px] font-serif">{stops.length}</span>
                        <span className="text-white/30 text-[9px] font-nav uppercase tracking-wider">stops</span>
                    </div>
                    {route && (
                        <>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-1.5">
                                <Route className="w-3.5 h-3.5 text-antique-gold/70" />
                                <span className="text-white/80 text-[11px] font-serif">~{route.totalKm}</span>
                                <span className="text-white/30 text-[9px] font-nav uppercase tracking-wider">km</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-antique-gold/70" />
                                <span className="text-white/80 text-[11px] font-serif">~{route.totalHours}</span>
                                <span className="text-white/30 text-[9px] font-nav uppercase tracking-wider">hrs</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Selected district badge + Reset */}
            {selectedDistrictId && (
                <div className="absolute top-4 right-16 z-[1000] flex flex-col items-end gap-2">
                    <div className="map-stats-overlay rounded-full px-4 py-2 flex items-center gap-2.5 border border-antique-gold/30 bg-deep-emerald/80 backdrop-blur-md">
                        <span className="text-antique-gold text-[10px] font-nav uppercase tracking-wider">
                            {getDistrictById(selectedDistrictId)?.name || selectedDistrictId}
                        </span>
                        <span className="text-white/40 text-[9px] font-light">
                            {getDistrictById(selectedDistrictId)?.luxuryLabel}
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedDistrictId(null);
                            setDistrictFilter(null);
                            if (mapRef.current) {
                                mapRef.current.fitBounds(SRI_LANKA_BOUNDS, {
                                    padding: [30, 40],
                                    animate: true,
                                    duration: 0.8,
                                });
                            }
                        }}
                        className="px-4 py-2 bg-antique-gold/10 hover:bg-antique-gold/20 border border-antique-gold/50 text-antique-gold rounded-full text-[10px] font-nav uppercase tracking-wider transition-all backdrop-blur-md shadow-lg"
                    >
                        Reset Map
                    </button>
                </div>
            )}
        </div>
    );
}
