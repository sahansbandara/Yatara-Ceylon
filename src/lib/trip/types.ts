/**
 * Trip Builder — Core Types & Constants
 */

// ─── Place (Curated POI) ────────────────────────────────────────────────────

export interface Place {
    id: string;
    name: string;
    lat: number;
    lng: number;
    district: string;
    districtId: string;
    category: PlaceCategory;
    teaser: string;
    estimatedVisitMinutes: number;
    imageHint: string;
    isHidden?: boolean;
}

// ─── Stop (Selected place in the itinerary) ─────────────────────────────────

export interface Stop {
    stopId: string;
    placeId: string;
    place: Place;
    order: number;
    notes?: string;
}

// ─── Route Result ────────────────────────────────────────────────────────────

export interface RouteResult {
    totalKm: number;
    totalHours: number;
    driveMinutes: number;
    geometry: [number, number][] | null; // [lat, lng][]
}

// ─── Filter State ────────────────────────────────────────────────────────────

export interface FilterState {
    searchQuery: string;
    categories: PlaceCategory[];
    district: string | null;
}

// ─── UI State ────────────────────────────────────────────────────────────────

export type PanelTab = 'discover' | 'stops' | 'summary';
export type TripPace = 'Relaxed' | 'Balanced' | 'Fast';

// ─── Categories ──────────────────────────────────────────────────────────────

export type PlaceCategory =
    | 'TEMPLE'
    | 'BEACH'
    | 'NATURE'
    | 'HERITAGE'
    | 'WILDLIFE'
    | 'ADVENTURE'
    | 'CITY'
    | 'FOOD'
    | 'CULTURE'
    | 'SCENIC'
    | 'OTHER';

export const CATEGORY_COLORS: Record<PlaceCategory, string> = {
    TEMPLE: '#D97706',
    BEACH: '#0EA5E9',
    NATURE: '#10B981',
    HERITAGE: '#8B5CF6',
    WILDLIFE: '#F59E0B',
    ADVENTURE: '#EF4444',
    CITY: '#6366F1',
    FOOD: '#F97316',
    CULTURE: '#EC4899',
    SCENIC: '#14B8A6',
    OTHER: '#6B7280',
};

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
    TEMPLE: 'Temples',
    BEACH: 'Beaches',
    NATURE: 'Nature',
    HERITAGE: 'Heritage',
    WILDLIFE: 'Wildlife',
    ADVENTURE: 'Adventure',
    CITY: 'City',
    FOOD: 'Food & Tea',
    CULTURE: 'Culture',
    SCENIC: 'Scenic',
    OTHER: 'Other',
};

export const ALL_CATEGORIES: PlaceCategory[] = [
    'BEACH', 'TEMPLE', 'NATURE', 'HERITAGE', 'WILDLIFE',
    'ADVENTURE', 'SCENIC', 'CULTURE', 'CITY', 'FOOD',
];

export function getCategoryColor(cat: string): string {
    return CATEGORY_COLORS[cat?.toUpperCase() as PlaceCategory] || '#6B7280';
}
