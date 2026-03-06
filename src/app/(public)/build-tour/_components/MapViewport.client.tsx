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

interface MapViewportProps {
    /** Currently selected region from the step builder */
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
                // Ensure L is globally available for leaflet.markercluster
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

    // Init map
    useEffect(() => {
        if (!L || !mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [7.8731, 80.7718],
            zoom: 7,
            minZoom: 6,
            maxZoom: 15,
            zoomControl: false,
            attributionControl: false,
            maxBounds: [[3.5, 76.0], [12.2, 85.5]],
            maxBoundsViscosity: 0.8,
            zoomSnap: 0.5,
            zoomDelta: 0.5,
        });

        // No tile layer as user explicitly requested "only need to display sri lanka map only"

        L.control.zoom({ position: 'topright' }).addTo(map);
        mapRef.current = map;

        setTimeout(() => map.invalidateSize(), 250);

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [L]);

    // GeoJSON district boundaries — curated regions style
    useEffect(() => {
        if (!L || !mapRef.current || !geoData) return;

        if (geoJsonLayerRef.current) {
            mapRef.current.removeLayer(geoJsonLayerRef.current);
        }

        const dimStyle = {
            fillColor: '#a5d6a7', // light green
            weight: 1,
            opacity: 0.8,
            color: '#ffffff',
            fillOpacity: 0.2,
        };

        const defaultStyle = {
            fillColor: '#a5d6a7', // reference map light green
            weight: 1.5,
            opacity: 0.9,
            color: '#ffffff', // white borders
            fillOpacity: 0.85,
        };

        const hoverStyle = {
            fillColor: '#81c784',
            fillOpacity: 0.95,
            weight: 2,
            color: '#ffffff',
            opacity: 1,
        };

        const selectedStyle = {
            fillColor: '#fbc02d', // appealing highlight
            fillOpacity: 0.9,
            weight: 2,
            color: '#ffffff',
            opacity: 1,
        };

        const regionActiveStyle = {
            fillColor: '#66bb6a',
            weight: 1.5,
            opacity: 1,
            color: '#ffffff',
            fillOpacity: 0.9,
        };

        geoJsonLayerRef.current = L.geoJSON(geoData, {
            style: (feature: any) => {
                const shapeName = (feature?.properties?.shapeName || '').replace(/\s*District$/i, '').trim();
                const districtId = resolveGeoNameToId(shapeName);

                // Selected district
                if (districtId === selectedDistrictId) return selectedStyle;

                // If a region is active, highlight its districts, dim others
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

                // Luxury label tooltip
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

                // Hover
                layer.on('mouseover', () => {
                    if (districtId !== selectedDistrictId) {
                        layer.setStyle(hoverStyle);
                    }
                });
                layer.on('mouseout', () => {
                    if (districtId !== selectedDistrictId) {
                        // Re-apply appropriate style
                        if (activeRegionId) {
                            const regionOfDistrict = DISTRICT_TO_REGION[districtId];
                            layer.setStyle(regionOfDistrict === activeRegionId ? regionActiveStyle : dimStyle);
                        } else {
                            layer.setStyle(defaultStyle);
                        }
                    }
                });

                // Click — select district & zoom
                layer.on('click', () => {
                    const newId = selectedDistrictId === districtId ? null : districtId;
                    setSelectedDistrictId(newId);
                    // Use master district name (not GeoJSON shapeName) for consistent filtering
                    const masterName = district ? district.name : shapeName;
                    setDistrictFilter(newId ? masterName : null);

                    if (newId && mapRef.current) {
                        const bounds = layer.getBounds();
                        mapRef.current.fitBounds(bounds, {
                            padding: [40, 40],
                            maxZoom: 11,
                            animate: true,
                            duration: 0.6,
                        });
                    } else if (mapRef.current) {
                        mapRef.current.flyTo([7.8731, 80.7718], 8, { duration: 0.6 });
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

        // Only show markers when a district is selected
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

    // Route polyline
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
                smoothFactor: 1,
            }).addTo(mapRef.current);
        } else if (stops.length >= 2) {
            const positions = stops.map((s) => [s.place.lat, s.place.lng] as [number, number]);
            routeLayerRef.current = L.polyline(positions, {
                color: '#D4AF37',
                weight: 2,
                opacity: 0.5,
                dashArray: '8, 8',
            }).addTo(mapRef.current);
        }
    }, [L, route, stops]);

    // Fit bounds to stops
    useEffect(() => {
        if (!L || !mapRef.current || stops.length === 0) return;
        const bounds = L.latLngBounds(stops.map((s) => [s.place.lat, s.place.lng]));
        mapRef.current.fitBounds(bounds, {
            padding: [60, 60],
            maxZoom: 11,
            animate: true,
            duration: 0.8,
        });
    }, [L, stops]);

    // Fetch route when stops change
    useEffect(() => {
        const timer = setTimeout(() => { fetchRoute(); }, 500);
        return () => clearTimeout(timer);
    }, [stops, fetchRoute]);

    // Fly to region when activeRegionId changes
    useEffect(() => {
        if (!L || !mapRef.current || !activeRegionId) return;
        // Import regions dynamically to avoid circular deps
        import('@/lib/regions').then(({ getRegionById }) => {
            const region = getRegionById(activeRegionId);
            if (region) {
                mapRef.current.flyTo(region.center, region.zoom, { duration: 0.8 });
            }
        });
    }, [L, activeRegionId]);

    return (
        <div
            className="w-full h-full relative"
            style={{
                background: 'radial-gradient(circle at center, #ffffff 0%, #e0f2fe 60%, #bae6fd 100%)'
            }}
        >
            {/* SVG drop shadow filter for the polygons */}
            <svg style={{ width: 0, height: 0, position: 'absolute' }}>
                <defs>
                    <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="5" stdDeviation="6" floodColor="#0ea5e9" floodOpacity="0.3" />
                    </filter>
                </defs>
            </svg>

            <div
                ref={mapContainerRef}
                className="w-full h-full z-0"
                style={{ filter: 'url(#dropshadow)' }}
            />

            {/* Floating Stats Overlay */}
            <div className="absolute top-4 left-4 z-[1000]">
                <div className="map-stats-overlay rounded-xl px-4 py-3 flex items-center gap-5">
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

            {/* Selected district indicator & Reset Button */}
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
                                mapRef.current.flyTo([7.8731, 80.7718], 8, { duration: 0.6 });
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
