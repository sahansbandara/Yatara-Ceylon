import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-change-in-production-1234567890');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export type UserRole = 'ADMIN' | 'STAFF' | 'USER' | 'VEHICLE_OWNER' | 'HOTEL_OWNER';

export interface TokenPayload {
    userId: string;
    role: UserRole;
    email: string;
    exp?: number;
}

export async function signToken(payload: Omit<TokenPayload, 'exp'>): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(JWT_EXPIRES_IN)
        .setIssuedAt()
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as TokenPayload;
    } catch {
        return null;
    }
}
