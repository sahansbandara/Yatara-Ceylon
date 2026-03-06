/**
 * Districts data module — canonical source for district metadata.
 * Merges districts_master.json with typed interfaces.
 */

import districtsData from '../../public/districts_master.json';

export interface DistrictGem {
    name: string;
}

export interface District {
    id: string;
    name: string;
    luxuryLabel: string;
    gems: string[];
    coordinates: [number, number]; // [lat, lng]
    transferStart: number; // LKR
}

// Parse and normalize districts from JSON
export const ALL_DISTRICTS: District[] = (districtsData as any).districts.map((d: any) => ({
    id: d.id,
    name: d.name,
    luxuryLabel: d.luxury_label,
    gems: d.gems || [],
    coordinates: d.coordinates as [number, number],
    transferStart: d.transfer_start,
}));

/** Lookup by district ID (e.g. "CMB") */
export function getDistrictById(id: string): District | undefined {
    return ALL_DISTRICTS.find((d) => d.id === id);
}

/** Lookup by district name (case-insensitive, strips " District") */
export function getDistrictByName(name: string): District | undefined {
    const normalized = name.replace(/\s*District$/i, '').trim().toLowerCase();
    return ALL_DISTRICTS.find((d) => d.name.toLowerCase() === normalized);
}

/** Map district name → ID for GeoJSON matching */
export const DISTRICT_NAME_TO_ID: Record<string, string> = {};
ALL_DISTRICTS.forEach((d) => {
    DISTRICT_NAME_TO_ID[d.name.toLowerCase()] = d.id;
});

/**
 * GeoJSON → Master name spelling corrections.
 * GeoJSON uses "Monaragala" but master JSON uses "Moneragala", etc.
 */
const GEO_NAME_ALIASES: Record<string, string> = {
    monaragala: 'moneragala',
};

/** Resolve a GeoJSON shapeName to a district ID, handling spelling variants */
export function resolveGeoNameToId(shapeName: string): string {
    const cleaned = shapeName.replace(/\s*District$/i, '').trim().toLowerCase();
    const aliased = GEO_NAME_ALIASES[cleaned] || cleaned;
    return DISTRICT_NAME_TO_ID[aliased] || '';
}

/** Format transfer price */
export function formatTransferPrice(lkr: number, currency: 'LKR' | 'USD' = 'LKR'): string {
    if (currency === 'USD') {
        const usd = Math.round(lkr / 320); // approximate rate
        return `$${usd.toLocaleString()}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
}
