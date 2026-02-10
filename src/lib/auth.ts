import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const COOKIE_NAME = 'toms_token';

export interface TokenPayload {
    userId: string;
    role: 'ADMIN' | 'STAFF';
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

export function setAuthCookie(token: string): string {
    const isProduction = process.env.NODE_ENV === 'production';
    return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${isProduction ? '; Secure' : ''}`;
}

export function clearAuthCookie(): string {
    return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`;
}

export async function getSessionUser(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function getTokenFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;
    return cookieHeader
        .split(';')
        .find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
        ?.split('=')[1] || null;
}
