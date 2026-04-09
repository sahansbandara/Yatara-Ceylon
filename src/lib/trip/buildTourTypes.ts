export type District = {
    id: string;
    name: string;
    center: [number, number]; // [lng, lat] for MapLibre
    description: string;
    heroImage: string;
};

export type Place = {
    id: string;
    districtId: string;
    name: string;
    category: string;
    coordinates: [number, number]; // [lng, lat]
    image: string;
    visitDuration: string;
};

export type JourneyStop = {
    id: string;
    placeId: string;
    day: number;
    order: number;
};
