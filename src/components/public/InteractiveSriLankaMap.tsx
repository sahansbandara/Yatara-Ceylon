'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Loader2, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamically import Leaflet components (SSR: false)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

import 'leaflet/dist/leaflet.css';

// Types matching yatara-districts.json
interface YataraDistrict {
    id: string;
    name: string;
    luxury_label: string;
    gems: string[];
    coordinates: [number, number];
    transfer_start: number;
}

interface Place {
    _id: string;
    name: string;
    images: string[];
    category: string;
    districtId: any;
}

// Name normalization map: GeoJSON name → Yatara name (handles spelling differences)
const NAME_MAP: Record<string, string> = {
    'Monaragala': 'Moneragala',
};

// Helper: extract district name from GeoJSON shapeName (e.g. "Jaffna District" → "Jaffna")
function extractDistrictName(shapeName: string): string {
    const raw = shapeName.replace(/\s*District$/i, '').trim();
    return NAME_MAP[raw] || raw;
}

export default function InteractiveSriLankaMap() {
    const [geoData, setGeoData] = useState<any>(null);
    const [districts, setDistricts] = useState<YataraDistrict[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<YataraDistrict | null>(null);
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);
    const geoJsonRef = useRef<any>(null);

    // Sri Lanka bounds for restricting the map view
    const sriLankaBounds: [[number, number], [number, number]] = [
        [5.7, 79.2],  // Southwest corner
        [10.0, 82.2]  // Northeast corner
    ];
    const center: [number, number] = [7.8731, 80.7718];

    // 1. Fetch GeoJSON boundary data + district metadata on mount
    useEffect(() => {
        Promise.all([
            fetch('/sri-lanka-districts.geojson').then(res => res.json()),
            fetch('/yatara-districts.json').then(res => res.json()),
        ])
            .then(([geoJson, yataraData]) => {
                setGeoData(geoJson);
                setDistricts(yataraData.districts);
            })
            .catch(err => console.error("Failed to load map data", err));
    }, []);

    // 2. Fetch places when a district is selected
    useEffect(() => {
        if (!selectedDistrict) return;

        setLoadingPlaces(true);
        fetch('/api/districts')
            .then(res => res.json())
            .then(data => {
                const districtArray = Array.isArray(data) ? data : (data.districts || data.data || []);
                const matchingDistrict = districtArray.find(
                    (d: any) => d.name?.toLowerCase() === selectedDistrict.name?.toLowerCase()
                );
                if (matchingDistrict) {
                    return fetch(`/api/places?districtId=${matchingDistrict._id}`);
                }
                throw new Error("District not found in database");
            })
            .then(res => res.json())
            .then(data => {
                const placesArray = Array.isArray(data) ? data : (data.places || data.data || []);
                setPlaces(placesArray);
            })
            .catch(err => {
                console.warn(err);
                setPlaces([]);
            })
            .finally(() => setLoadingPlaces(false));
    }, [selectedDistrict]);

    // 3. Re-style polygons whenever selection or hover changes
    useEffect(() => {
        if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer((layer: any) => {
                const name = extractDistrictName(layer.feature.properties.shapeName || '');
                const isSelected = selectedDistrict?.name?.toLowerCase() === name.toLowerCase();
                const isHovered = hoveredDistrict?.toLowerCase() === name.toLowerCase();
                layer.setStyle(getDistrictStyle(name, isSelected, isHovered));
            });
        }
    }, [selectedDistrict, hoveredDistrict]);

    // Style function for each district polygon
    const getDistrictStyle = (name: string, isSelected: boolean, isHovered: boolean) => {
        if (isSelected) {
            return {
                fillColor: '#043927',
                weight: 2.5,
                opacity: 1,
                color: '#D4AF37',
                fillOpacity: 0.85,
            };
        }
        if (isHovered) {
            return {
                fillColor: '#065f46',
                weight: 2,
                opacity: 1,
                color: '#D4AF37',
                fillOpacity: 0.55,
            };
        }
        return {
            fillColor: '#16a34a',
            weight: 1.5,
            opacity: 1,
            color: '#ffffff',
            fillOpacity: 0.25,
        };
    };

    // Initial style for GeoJSON (applied once on load)
    const initialStyle = () => ({
        fillColor: '#16a34a',
        weight: 1.5,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0.25,
    });

    // Handle click on a district polygon
    const handleDistrictClick = useCallback((districtName: string) => {
        const match = districts.find(
            d => d.name.toLowerCase() === districtName.toLowerCase()
        );
        if (match) {
            setSelectedDistrict(match);
        }
    }, [districts]);

    // GeoJSON event handlers
    const onEachFeature = useCallback((feature: any, layer: any) => {
        const shapeName = feature.properties.shapeName || '';
        const districtName = extractDistrictName(shapeName);

        // Add permanent label tooltip
        layer.bindTooltip(districtName, {
            permanent: false,
            direction: 'center',
            className: 'district-tooltip',
        });

        layer.on({
            click: () => handleDistrictClick(districtName),
            mouseover: () => setHoveredDistrict(districtName),
            mouseout: () => setHoveredDistrict(null),
        });
    }, [handleDistrictClick]);

    // Loading state
    if (!geoData || districts.length === 0) {
        return (
            <div className="h-[600px] w-full flex items-center justify-center bg-off-white border border-antique-gold/20">
                <Loader2 className="w-8 h-8 text-deep-emerald animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-full min-h-[600px] md:min-h-[800px] border border-antique-gold/20 shadow-2xl overflow-hidden bg-off-white">

            {/* Left: Map Container */}
            <div className="w-full lg:w-2/3 h-[450px] lg:h-auto relative z-0" style={{ background: 'linear-gradient(135deg, #f0f4f0 0%, #e8efe8 50%, #f0f4f0 100%)' }}>
                {typeof window !== 'undefined' && (
                    <MapContainer
                        center={center}
                        zoom={7.5}
                        minZoom={7}
                        maxZoom={11}
                        zoomControl={false}
                        scrollWheelZoom={true}
                        dragging={true}
                        maxBounds={sriLankaBounds}
                        maxBoundsViscosity={1.0}
                        style={{ height: '100%', width: '100%', background: 'transparent' }}
                        attributionControl={false}
                    >
                        {/* No TileLayer = clean background, only district polygons visible */}
                        <GeoJSON
                            ref={geoJsonRef}
                            data={geoData}
                            style={initialStyle}
                            onEachFeature={onEachFeature}
                        />
                    </MapContainer>
                )}

                {/* Map Overlay Instructions */}
                <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md border border-antique-gold/30 p-4 shadow-lg flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-deep-emerald animate-pulse" />
                    <p className="font-serif text-deep-emerald tracking-widest text-sm font-semibold uppercase">
                        Select a district to explore
                    </p>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md border border-antique-gold/30 p-3 shadow-lg">
                    <div className="flex items-center gap-4 text-xs font-light text-deep-emerald/70">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#16a34a', opacity: 0.4 }} />
                            <span>District</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#043927', opacity: 0.9 }} />
                            <span>Selected</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Side Panel for Place Cards */}
            <div className="w-full lg:w-1/3 bg-white flex flex-col border-t lg:border-t-0 lg:border-l border-antique-gold/20 relative z-10 h-[400px] lg:h-auto">
                <div className="p-8 pb-4 border-b border-deep-emerald/10 bg-deep-emerald/5">
                    <h2 className="text-3xl font-serif text-deep-emerald tracking-wide">
                        {selectedDistrict?.name || 'Discover Ceylon'}
                    </h2>
                    <p className="text-deep-emerald/60 font-light mt-1 text-sm tracking-widest uppercase">
                        {selectedDistrict ? selectedDistrict.luxury_label : 'Interactive Map Explorer'}
                    </p>

                    {selectedDistrict && (
                        <div className="mt-4 pt-4 border-t border-deep-emerald/10">
                            <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-antique-gold bg-antique-gold/10 px-3 py-1">
                                Transfers start at LKR {selectedDistrict.transfer_start.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-off-white/30 custom-scrollbar">
                    {!selectedDistrict ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                            <MapPin className="w-12 h-12 text-antique-gold" strokeWidth={1} />
                            <p className="font-serif text-deep-emerald tracking-wide text-lg">
                                Your journey begins here.
                            </p>
                            <p className="font-light text-sm text-deep-emerald/70 max-w-[200px]">
                                Click directly on any district on the map to uncover elite destinations.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8 pb-10">

                            {/* Yatara Gems Display */}
                            <div className="space-y-4">
                                <h4 className="font-serif text-antique-gold tracking-widest uppercase text-xs">Curated Local Gems</h4>
                                <ul className="space-y-2">
                                    {selectedDistrict.gems.map((gem, index) => (
                                        <li key={index} className="flex items-center text-sm font-light text-deep-emerald tracking-wide">
                                            <div className="w-1.5 h-1.5 rounded-full bg-antique-gold mr-3"></div>
                                            {gem}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CMS places fetch display */}
                            <div>
                                <h4 className="font-serif text-antique-gold tracking-widest uppercase text-xs mb-4">Partner Estates & Attractions</h4>
                                {loadingPlaces ? (
                                    <div className="py-8 flex flex-col items-center justify-center space-y-4">
                                        <Loader2 className="w-8 h-8 text-antique-gold animate-spin" />
                                    </div>
                                ) : places.length === 0 ? (
                                    <div className="flex items-center gap-3 p-4 border border-deep-emerald/10 bg-white">
                                        <Search className="w-5 h-5 text-antique-gold opacity-50" strokeWidth={1} />
                                        <p className="font-light text-deep-emerald/60 text-xs">
                                            Concierge access recommended for this region.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {places.map((place) => (
                                            <div key={place._id} className="group bg-white border border-deep-emerald/5 hover:border-antique-gold/40 transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer">
                                                <div className="relative h-40 w-full bg-deep-emerald/10 overflow-hidden">
                                                    {place.images && place.images.length > 0 ? (
                                                        <Image
                                                            src={place.images[0]}
                                                            alt={place.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <MapPin className="w-8 h-8 text-antique-gold/30" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 right-3 bg-deep-emerald/80 backdrop-blur-md px-2 py-1 font-serif text-[10px] uppercase tracking-widest text-antique-gold">
                                                        {place.category}
                                                    </div>
                                                </div>
                                                <div className="p-4 flex items-center justify-between bg-white transform transition-transform group-hover:-translate-y-1">
                                                    <h3 className="font-serif text-md text-deep-emerald group-hover:text-antique-gold transition-colors">
                                                        {place.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {selectedDistrict && (
                    <div className="p-4 border-t border-antique-gold/20 bg-white">
                        <Button className="w-full h-12 rounded-none bg-deep-emerald hover:bg-deep-emerald/90 text-antique-gold font-serif uppercase tracking-widest text-xs transition-colors border border-transparent hover:border-antique-gold/50 shadow-md">
                            Add to Bespoke Itinerary
                        </Button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(4, 57, 39, 0.05); 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.5); 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 1); 
                }
                .district-tooltip {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(212, 175, 55, 0.4) !important;
                    color: #043927 !important;
                    font-family: 'Georgia', serif !important;
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    letter-spacing: 0.05em !important;
                    padding: 6px 12px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                    border-radius: 0 !important;
                }
                .district-tooltip::before {
                    border-top-color: rgba(212, 175, 55, 0.4) !important;
                }
                .leaflet-container {
                    background: transparent !important;
                }
            `}</style>
        </div>
    );
}
