import { generateOpaqueToken, hashOpaqueToken } from '@/lib/token-utils';

export const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24;
export const PASSWORD_RESET_TTL_MS = 1000 * 60 * 60;
export const LOGIN_LOCKOUT_THRESHOLD = 5;
export const LOGIN_LOCKOUT_TTL_MS = 1000 * 60 * 15;

export function issueEmailVerificationState() {
    const token = generateOpaqueToken();
    return {
        token,
        tokenHash: hashOpaqueToken(token),
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
    };
}

export function issuePasswordResetState() {
    const token = generateOpaqueToken();
    return {
        token,
        tokenHash: hashOpaqueToken(token),
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
    };
}
