'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
// const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapWrapperProps {
    places: any[];
    selectedPlaces: string[];
    onSelectPlace: (placeId: string) => void;
}

export default function MapWrapper({ places, selectedPlaces, onSelectPlace }: MapWrapperProps) {
    // Center of Sri Lanka
    const center: [number, number] = [7.8731, 80.7718];

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
            {/* Note: MapContainer needs explicit height */}
            {typeof window !== 'undefined' && (
                <MapContainer center={center} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {places.map(place => (
                        place.coords && place.coords.lat && place.coords.lng && (
                            <Marker
                                key={place._id}
                                position={[place.coords.lat, place.coords.lng]}
                                icon={icon}
                                eventHandlers={{
                                    click: () => onSelectPlace(place._id),
                                }}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <h3 className="font-bold">{place.name}</h3>
                                        <p className="text-xs">{place.category}</p>
                                        <button
                                            onClick={() => onSelectPlace(place._id)}
                                            className={`mt-2 px-3 py-1 rounded text-xs font-bold ${selectedPlaces.includes(place._id) ? 'bg-red-500 text-white' : 'bg-ocean-600 text-white'}`}
                                        >
                                            {selectedPlaces.includes(place._id) ? 'Remove' : 'Add to Plan'}
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>
            )}
        </div>
    );
}
