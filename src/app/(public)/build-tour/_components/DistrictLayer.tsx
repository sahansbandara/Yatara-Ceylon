'use client';

import { useMemo, useState, useEffect } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';

interface DistrictLayerProps {
    hoveredDistrictId: string | null;
    selectedDistrictId: string | null;
}

export default function DistrictLayer({ hoveredDistrictId, selectedDistrictId }: DistrictLayerProps) {
    const [geoData, setGeoData] = useState<any>(null);

    useEffect(() => {
        // Fetch the full Sri Lanka districts GeoJSON map
        fetch('/sri-lanka-districts.geojson')
            .then(res => res.json())
            .then(data => {
                // Map the features to add a consistent lowercase 'district_id' matching our data
                const features = data.features.map((f: any) => {
                    // GeoJSON uses 'shapeName' e.g. "Jaffna District", "Nuwara Eliya District"
                    const rawName: string = f.properties.shapeName || f.properties.NAME_1 || f.properties.name || '';
                    // Strip trailing " District" and trim
                    const name = rawName.replace(/\s*District$/i, '').trim();
                    let districtId = name.toLowerCase().replace(/\s+/g, '');
                    if (districtId === 'monaragala') districtId = 'moneragala';
                    return {
                        ...f,
                        properties: {
                            ...f.properties,
                            district_id: districtId, // Extracted for simple styling matches
                            district_name: name
                        },
                        id: districtId // Ensure Maplibre has an explicit id
                    };
                });

                setGeoData({
                    type: 'FeatureCollection',
                    features
                });
            })
            .catch(err => console.error("Failed to load district GeoJSON", err));
    }, []);

    const data = useMemo(() => {
        if (!geoData) return null;
        return {
            type: 'FeatureCollection' as const,
            features: geoData.features
        };
    }, [geoData]);

    // Emerald brand color: #043927, Gold: #D4AF37
    if (!data) return null;
    return (
        <Source
            id="districts"
            type="geojson"
            data={data}
            promoteId="district_id" // Use this property as the feature ID for state (hover/click)
        >
            {/* Main polygon fill */}
            <Layer
                id="district-fills"
                type="fill"
                paint={{
                    'fill-color': [
                        'case',
                        ['==', ['get', 'district_id'], selectedDistrictId], '#043927', // Active
                        ['==', ['get', 'district_id'], hoveredDistrictId], '#043927',  // Hover
                        'transparent'                                                // Default
                    ],
                    'fill-opacity': [
                        'case',
                        ['==', ['get', 'district_id'], selectedDistrictId], 0.25, // Active opacity
                        ['==', ['get', 'district_id'], hoveredDistrictId], 0.1,   // Hover wash
                        0                                                         // Default transparent
                    ]
                }}
            />

            {/* Polygon outline */}
            <Layer
                id="district-borders"
                type="line"
                paint={{
                    'line-color': [
                        'case',
                        ['==', ['get', 'district_id'], selectedDistrictId], '#D4AF37', // Active gold
                        ['==', ['get', 'district_id'], hoveredDistrictId], '#043927',  // Hover medium emerald
                        'rgba(4, 57, 39, 0.15)'                                        // Default thin muted emerald
                    ],
                    'line-width': [
                        'case',
                        ['==', ['get', 'district_id'], selectedDistrictId], 2,
                        ['==', ['get', 'district_id'], hoveredDistrictId], 1.5,
                        1
                    ]
                }}
            />
        </Source>
    );
}
