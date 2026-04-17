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
                'background-color': '#e8efe9' // subtle emerald/mint tint
            }
        },
        {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
            paint: {
                'raster-opacity': 0.75, // let some background tint show through
                'raster-contrast': 0.15,
                'raster-brightness-min': 0.05,
                'raster-saturation': -0.4 // less saturation for a premium muted look
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
