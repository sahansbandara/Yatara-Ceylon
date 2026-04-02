const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function getTurnstileRemoteIp(remoteIp?: string | null) {
    if (!remoteIp) {
        return null;
    }

    const forwardedIp = remoteIp.split(',')[0]?.trim();
    return forwardedIp || null;
}

export async function verifyTurnstileToken(token: string | null, remoteIp?: string | null) {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('TURNSTILE_SECRET_KEY is not configured. Allowing captcha verification in non-production mode.');
            return { success: true };
        }

        return { success: false, error: 'Captcha verification is unavailable' };
    }

    if (!token) {
        return { success: false, error: 'Captcha verification is required' };
    }

    const formData = new URLSearchParams({
        secret,
        response: token,
    });

    const forwardedIp = getTurnstileRemoteIp(remoteIp);
    if (forwardedIp) {
        formData.set('remoteip', forwardedIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    if (!response.ok) {
        return { success: false, error: 'Captcha verification failed' };
    }

    const data = await response.json();
    if (!data.success) {
        return { success: false, error: 'Captcha verification failed' };
    }

    return { success: true };
}
