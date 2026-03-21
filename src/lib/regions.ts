/**
 * Signature Regions — curated groupings of districts
 * Used for the "map-lite" experience in the bespoke tour builder.
 */

export interface SignatureRegion {
    id: string;
    name: string;
    tagline: string;
    districtIds: string[];
    /** Center coordinates for map focus [lat, lng] */
    center: [number, number];
    /** Zoom level when region is selected */
    zoom: number;
    /** Gradient for cards */
    gradient: string;
    /** Icon hint for UI */
    iconHint: 'temple' | 'mountain' | 'beach' | 'wildlife' | 'city' | 'compass';
    /** Image path for region card */
    imageHint: string;
}

export const SIGNATURE_REGIONS: SignatureRegion[] = [
    {
        id: 'cultural-triangle',
        name: 'Cultural Triangle',
        tagline: 'Ancient kingdoms, sacred temples & UNESCO wonders',
        districtIds: ['ANU', 'POL', 'MTL', 'KDY', 'KUR'],
        center: [7.85, 80.55],
        zoom: 9,
        gradient: 'from-purple-900/80 via-purple-800/50 to-transparent',
        iconHint: 'temple',
        imageHint: '/images/regions/cultural-triangle.webp',
    },
    {
        id: 'tea-highlands',
        name: 'Tea Highlands',
        tagline: 'Misty peaks, emerald plantations & colonial charm',
        districtIds: ['NUA', 'BDL', 'KDY'],
        center: [7.05, 80.75],
        zoom: 10,
        gradient: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
        iconHint: 'mountain',
        imageHint: '/images/regions/tea-highlands.webp',
    },
    {
        id: 'south-coast',
        name: 'South Coast',
        tagline: 'Colonial forts, pristine beaches & golden sunsets',
        districtIds: ['GLE', 'MTR', 'KAL'],
        center: [6.15, 80.35],
        zoom: 10,
        gradient: 'from-cyan-900/80 via-cyan-800/50 to-transparent',
        iconHint: 'beach',
        imageHint: '/images/regions/south-coast.webp',
    },
    {
        id: 'wildlife-safari',
        name: 'Wildlife & Safari',
        tagline: 'Leopards, elephants & untouched wilderness',
        districtIds: ['HBT', 'MON', 'AMP'],
        center: [6.55, 81.35],
        zoom: 9,
        gradient: 'from-amber-900/80 via-amber-800/50 to-transparent',
        iconHint: 'wildlife',
        imageHint: '/images/regions/wildlife-safari.webp',
    },
    {
        id: 'city-arrival',
        name: 'Colombo & Negombo',
        tagline: 'Sovereign arrival, lagoon elegance & urban luxury',
        districtIds: ['CMB', 'GMP', 'KEG'],
        center: [7.0, 79.95],
        zoom: 10,
        gradient: 'from-indigo-900/80 via-indigo-800/50 to-transparent',
        iconHint: 'city',
        imageHint: '/images/regions/colombo-negombo.webp',
    },
    {
        id: 'east-coast',
        name: 'East Coast',
        tagline: 'Untouched surf, singing fish & seasonal paradise',
        districtIds: ['TRI', 'BAT', 'AMP'],
        center: [8.0, 81.5],
        zoom: 9,
        gradient: 'from-teal-900/80 via-teal-800/50 to-transparent',
        iconHint: 'compass',
        imageHint: '/images/regions/east-coast.webp',
    },
    {
        id: 'northern-heritage',
        name: 'Northern Heritage',
        tagline: 'Tamil culture, baobab islands & frontier discovery',
        districtIds: ['JAF', 'KIL', 'MNR', 'VAV', 'MUL'],
        center: [9.3, 80.4],
        zoom: 8,
        gradient: 'from-rose-900/80 via-rose-800/50 to-transparent',
        iconHint: 'compass',
        imageHint: '/images/regions/northern-heritage.webp',
    },
];

/** Lookup: districtId → regionId */
export const DISTRICT_TO_REGION: Record<string, string> = {};
SIGNATURE_REGIONS.forEach((r) => {
    r.districtIds.forEach((dId) => {
        DISTRICT_TO_REGION[dId] = r.id;
    });
});

/** Get region by ID */
export function getRegionById(id: string): SignatureRegion | undefined {
    return SIGNATURE_REGIONS.find((r) => r.id === id);
}

/** Get all districts for a region */
export function getDistrictIdsForRegion(regionId: string): string[] {
    return SIGNATURE_REGIONS.find((r) => r.id === regionId)?.districtIds || [];
}
