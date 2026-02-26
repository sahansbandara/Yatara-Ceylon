/**
 * Tour planning utilities — distance calculation and OSRM routing
 */

interface Coords {
    lat: number;
    lng: number;
}

/**
 * Haversine formula — straight-line distance between two geo-coordinates in km
 */
export function haversineDistance(a: Coords, b: Coords): number {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const h = sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

/**
 * Fallback: local calculation using haversine + road factor
 */
export function calculateRouteStats(
    places: Array<{ coords?: Coords; name: string }>
): { totalKm: number; totalHours: number } {
    if (places.length < 2) return { totalKm: 0, totalHours: 0 };
    const ROAD_FACTOR = 1.4;
    const AVG_SPEED = 40;
    let totalKm = 0;
    for (let i = 0; i < places.length - 1; i++) {
        const a = places[i].coords;
        const b = places[i + 1].coords;
        if (a && b) totalKm += haversineDistance(a, b) * ROAD_FACTOR;
    }
    return {
        totalKm: Math.round(totalKm),
        totalHours: Math.round((totalKm / AVG_SPEED) * 10) / 10,
    };
}

/**
 * Fetch real route from OSRM public API
 * Returns distance (km), duration (hours) and GeoJSON geometry for the route polyline
 */
export async function fetchOSRMRoute(
    places: Array<{ coords: Coords }>
): Promise<{
    totalKm: number;
    totalHours: number;
    geometry: [number, number][] | null; // [lat, lng][]
}> {
    if (places.length < 2) return { totalKm: 0, totalHours: 0, geometry: null };

    // OSRM expects "lng,lat" pairs separated by ";"
    const coordStr = places.map(p => `${p.coords.lng},${p.coords.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.code !== 'Ok' || !data.routes?.[0]) {
            throw new Error('OSRM returned no route');
        }
        const route = data.routes[0];
        // OSRM geometry is [lng, lat] — flip to [lat, lng] for Leaflet
        const geometry: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
        );
        return {
            totalKm: Math.round(route.distance / 1000),
            totalHours: Math.round((route.duration / 3600) * 10) / 10,
            geometry,
        };
    } catch (err) {
        console.warn('OSRM fetch failed, falling back to haversine', err);
        // Fallback
        const stats = calculateRouteStats(places.map(p => ({ ...p, name: '' })));
        return { ...stats, geometry: null };
    }
}

/**
 * Compute centroid of a GeoJSON polygon manually (no Turf dependency issue)
 * For multi-polygon, we use the first polygon
 */
export function computePolygonCentroid(feature: any): Coords | null {
    try {
        let coords: number[][] = [];
        const geom = feature.geometry;
        if (geom.type === 'Polygon') {
            coords = geom.coordinates[0]; // outer ring
        } else if (geom.type === 'MultiPolygon') {
            coords = geom.coordinates[0][0]; // first polygon's outer ring
        }
        if (coords.length === 0) return null;
        let sumLat = 0, sumLng = 0;
        for (const c of coords) {
            sumLng += c[0];
            sumLat += c[1];
        }
        return { lat: sumLat / coords.length, lng: sumLng / coords.length };
    } catch {
        return null;
    }
}
