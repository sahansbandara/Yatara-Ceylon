/**
 * @jest-environment node
 */
import { haversineDistance, calculateRouteStats, computePolygonCentroid } from '../tourUtils';

describe('tourUtils', () => {
    describe('haversineDistance', () => {
        it('should return 0 for the same point', () => {
            const point = { lat: 7.2906, lng: 80.6337 }; // Kandy
            expect(haversineDistance(point, point)).toBe(0);
        });

        it('should calculate distance between Colombo and Kandy (~115 km)', () => {
            const colombo = { lat: 6.9271, lng: 79.8612 };
            const kandy = { lat: 7.2906, lng: 80.6337 };
            const distance = haversineDistance(colombo, kandy);
            // Straight-line distance is approximately 92-95 km
            expect(distance).toBeGreaterThan(85);
            expect(distance).toBeLessThan(105);
        });

        it('should calculate distance between Colombo and Galle (~120 km)', () => {
            const colombo = { lat: 6.9271, lng: 79.8612 };
            const galle = { lat: 6.0535, lng: 80.2210 };
            const distance = haversineDistance(colombo, galle);
            expect(distance).toBeGreaterThan(90);
            expect(distance).toBeLessThan(110);
        });

        it('should be symmetric (A→B equals B→A)', () => {
            const a = { lat: 6.9271, lng: 79.8612 };
            const b = { lat: 7.2906, lng: 80.6337 };
            expect(haversineDistance(a, b)).toBeCloseTo(haversineDistance(b, a), 10);
        });

        it('should handle large distances (approximately half Earth circumference)', () => {
            const pointA = { lat: 0, lng: 0 };
            const pointB = { lat: 0, lng: 180 };
            const distance = haversineDistance(pointA, pointB);
            // Half circumference ≈ 20,015 km
            expect(distance).toBeGreaterThan(19500);
            expect(distance).toBeLessThan(20500);
        });
    });

    describe('calculateRouteStats', () => {
        it('should return zeros for fewer than 2 places', () => {
            expect(calculateRouteStats([])).toEqual({ totalKm: 0, totalHours: 0 });
            expect(calculateRouteStats([{ name: 'A', coords: { lat: 0, lng: 0 } }])).toEqual({ totalKm: 0, totalHours: 0 });
        });

        it('should calculate total distance with road factor (1.4x)', () => {
            const places = [
                { name: 'Colombo', coords: { lat: 6.9271, lng: 79.8612 } },
                { name: 'Kandy', coords: { lat: 7.2906, lng: 80.6337 } },
            ];
            const result = calculateRouteStats(places);
            // Haversine ≈ 93 km × 1.4 ≈ 130 km
            expect(result.totalKm).toBeGreaterThan(100);
            expect(result.totalKm).toBeLessThan(160);
            // At 40 km/h → ~3.25 hours
            expect(result.totalHours).toBeGreaterThan(2);
            expect(result.totalHours).toBeLessThan(5);
        });

        it('should skip segments where coords are missing', () => {
            const places = [
                { name: 'A', coords: { lat: 6.9271, lng: 79.8612 } },
                { name: 'B' }, // no coords
                { name: 'C', coords: { lat: 7.2906, lng: 80.6337 } },
            ];
            const result = calculateRouteStats(places);
            // Only A→B and B→C segments, but B has no coords, so both are skipped
            expect(result.totalKm).toBe(0);
        });

        it('should sum distances across multiple stops', () => {
            const places = [
                { name: 'Colombo', coords: { lat: 6.9271, lng: 79.8612 } },
                { name: 'Kandy', coords: { lat: 7.2906, lng: 80.6337 } },
                { name: 'Galle', coords: { lat: 6.0535, lng: 80.2210 } },
            ];
            const result = calculateRouteStats(places);
            // Should be greater than Colombo→Kandy alone
            const twoStops = calculateRouteStats(places.slice(0, 2));
            expect(result.totalKm).toBeGreaterThan(twoStops.totalKm);
        });
    });

    describe('computePolygonCentroid', () => {
        it('should compute centroid of a simple Polygon', () => {
            const feature = {
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [79.0, 6.0],
                            [81.0, 6.0],
                            [81.0, 8.0],
                            [79.0, 8.0],
                            [79.0, 6.0], // closed ring
                        ],
                    ],
                },
            };
            const centroid = computePolygonCentroid(feature);
            expect(centroid).not.toBeNull();
            // Average of lngs: (79+81+81+79+79)/5 = 79.8
            // Average of lats: (6+6+8+8+6)/5 = 6.8
            expect(centroid!.lng).toBeCloseTo(79.8, 1);
            expect(centroid!.lat).toBeCloseTo(6.8, 1);
        });

        it('should compute centroid of a MultiPolygon (uses first polygon)', () => {
            const feature = {
                geometry: {
                    type: 'MultiPolygon',
                    coordinates: [
                        [
                            [
                                [80.0, 7.0],
                                [82.0, 7.0],
                                [82.0, 9.0],
                                [80.0, 9.0],
                                [80.0, 7.0],
                            ],
                        ],
                        [
                            // second polygon — should be ignored
                            [
                                [0.0, 0.0],
                                [1.0, 0.0],
                                [1.0, 1.0],
                                [0.0, 0.0],
                            ],
                        ],
                    ],
                },
            };
            const centroid = computePolygonCentroid(feature);
            expect(centroid).not.toBeNull();
            // Average lng: (80+82+82+80+80)/5 = 80.8
            expect(centroid!.lng).toBeCloseTo(80.8, 1);
            // Average lat: (7+7+9+9+7)/5 = 7.8 (closed ring includes repeated first point)
            expect(centroid!.lat).toBeCloseTo(7.8, 1);
        });

        it('should return null for invalid input', () => {
            expect(computePolygonCentroid({})).toBeNull();
            expect(computePolygonCentroid(null)).toBeNull();
            expect(computePolygonCentroid({ geometry: { type: 'Point', coordinates: [0, 0] } })).toBeNull();
        });

        it('should return null for empty coordinates', () => {
            const feature = {
                geometry: {
                    type: 'Polygon',
                    coordinates: [[]],
                },
            };
            expect(computePolygonCentroid(feature)).toBeNull();
        });
    });
});
