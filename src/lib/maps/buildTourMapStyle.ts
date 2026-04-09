import type { StyleSpecification } from 'maplibre-gl';

export const LIGHT_LUXURY_MAP_STYLE: StyleSpecification = {
    version: 8,
    name: 'Yatara Ceylon Light Luxury',
    sources: {
        'osm': {
            type: 'raster',
            tiles: [
                'https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }
    },
    layers: [
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#f8f6f2'
            }
        },
        {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
            paint: {
                'raster-opacity': 0.8,
                'raster-contrast': 0.1,
                'raster-brightness-min': 0.1,
                'raster-saturation': -0.2
            }
        }
    ]
};

export const SRI_LANKA_BOUNDS: [number, number, number, number] = [
    79.5, // minLng (West)
    5.8,  // minLat (South)
    82.0, // maxLng (East)
    9.9   // maxLat (North)
];
