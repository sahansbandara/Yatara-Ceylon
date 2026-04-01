const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token: string | null, remoteIp?: string | null) {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!token) {
        return { success: false, error: 'Captcha verification is required' };
    }

    if (!secret) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('TURNSTILE_SECRET_KEY is not configured. Allowing captcha verification in non-production mode.');
            return { success: true };
        }

        return { success: false, error: 'Captcha verification is unavailable' };
    }

    const formData = new URLSearchParams({
        secret,
        response: token,
    });

    if (remoteIp) {
        formData.set('remoteip', remoteIp);
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
