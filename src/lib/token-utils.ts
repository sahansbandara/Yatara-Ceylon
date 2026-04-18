import crypto from 'crypto';

export function generateOpaqueToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hashOpaqueToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function buildAppUrl(path: string) {
    const baseUrl = process.env.APP_BASE_URL
        || process.env.NEXT_PUBLIC_APP_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    return new URL(path, baseUrl).toString();
}
