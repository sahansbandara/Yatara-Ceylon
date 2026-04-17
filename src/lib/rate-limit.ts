import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
    limit: number;
    windowMs: number;
}

const trackers = new Map<string, { count: number; expiresAt: number }>();

/**
 * Basic in-memory rate limiter.
 * Note: In serverless environments (Vercel), memory is not shared across instances,
 * so this is per-instance limiting. For distributed limiting, use Redis (Upstash).
 */
export async function rateLimit(req: NextRequest, config: RateLimitConfig = { limit: 10, windowMs: 60 * 1000 }) {
    // Get IP address (x-forwarded-for or fallback)
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

    const now = Date.now();
    const existing = trackers.get(ip);

    if (existing && existing.expiresAt > now) {
        if (existing.count >= config.limit) {
            return NextResponse.json(
                { message: 'Too many requests, please try again later.' },
                { status: 429, headers: { 'Retry-After': String(Math.ceil((existing.expiresAt - now) / 1000)) } }
            );
        }
        existing.count++;
    } else {
        trackers.set(ip, { count: 1, expiresAt: now + config.windowMs });

        // Cleanup expired entries periodically (simplistic)
        if (trackers.size > 1000) {
            for (const [key, val] of trackers.entries()) {
                if (val.expiresAt < now) trackers.delete(key);
            }
        }
    }

    return null; // No limit hit
}

/** Reset all tracked IPs — exposed for testing only */
export function _resetTrackers() {
    trackers.clear();
}
