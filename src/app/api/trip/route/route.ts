import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RouteRequestSchema = z.object({
    coordinates: z
        .array(z.tuple([z.number(), z.number()]))
        .min(2, 'At least 2 coordinates required')
        .max(25, 'Maximum 25 waypoints'),
    profile: z.enum(['driving', 'cycling', 'walking']).optional().default('driving'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = RouteRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { coordinates, profile } = parsed.data;

        // Build OSRM coordinate string: "lng,lat;lng,lat;..."
        const coordStr = coordinates.map(([lat, lng]) => `${lng},${lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/${profile}/${coordStr}?overview=full&geometries=geojson&steps=false`;

        const osrmRes = await fetch(url, {
            headers: { 'User-Agent': 'YataraCeylon/1.0' },
        });

        if (!osrmRes.ok) {
            return NextResponse.json(
                { error: 'Routing service unavailable' },
                { status: 502 }
            );
        }

        const data = await osrmRes.json();

        if (data.code !== 'Ok' || !data.routes?.[0]) {
            return NextResponse.json(
                { error: 'No route found' },
                { status: 404 }
            );
        }

        const route = data.routes[0];
        // Flip coordinates from [lng, lat] to [lat, lng] for Leaflet
        const geometry: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
        );

        return NextResponse.json({
            totalKm: Math.round(route.distance / 1000),
            totalHours: Math.round((route.duration / 3600) * 10) / 10,
            driveMinutes: Math.round(route.duration / 60),
            geometry,
        });
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
