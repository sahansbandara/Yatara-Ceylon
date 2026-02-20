'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapWrapperProps {
    places: any[];
    selectedPlaces: string[];
    onSelectPlace: (placeId: string) => void;
    selectedDistricts: string[];
    onSelectDistrict: (districtName: string) => void;
}

export default function MapWrapper({ places, selectedPlaces, onSelectPlace, selectedDistricts, onSelectDistrict }: MapWrapperProps) {
    const center: [number, number] = [7.8731, 80.7718];
    const [geoData, setGeoData] = useState<any>(null);

    useEffect(() => {
        // Fetch Sri Lanka District GeoJSON securely from public folder
        fetch('/districts_master.json')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Could not load GeoJSON", err));
    }, []);

    if (!geoData) {
        return (
            <div className="h-[400px] w-full rounded-none flex items-center justify-center bg-off-white/50 border border-antique-gold/20">
                <Loader2 className="w-8 h-8 text-deep-emerald animate-spin" />
            </div>
        );
    }

    const onEachFeature = (feature: any, layer: any) => {
        const districtName = feature.properties.name || feature.properties.NAME_2 || feature.properties.district_name;

        layer.on({
            click: () => {
                if (districtName) onSelectDistrict(districtName);
            }
        });
    };

    const geoJsonStyle = (feature: any) => {
        const districtName = feature.properties.name || feature.properties.NAME_2 || feature.properties.district_name;
        const isSelected = selectedDistricts.some(d => d.toLowerCase() === districtName?.toLowerCase());

        return {
            fillColor: isSelected ? '#043927' : '#D4AF37',
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            fillOpacity: isSelected ? 0.8 : 0.2
        };
    };

    return (
        <div className="h-[500px] w-full border border-gray-200 relative z-0">
            {typeof window !== 'undefined' && (
                <MapContainer center={center} zoom={7.2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    />
                    <GeoJSON
                        data={geoData}
                        style={geoJsonStyle}
                        onEachFeature={onEachFeature}
                    />
                </MapContainer>
            )}
        </div>
    );
}
