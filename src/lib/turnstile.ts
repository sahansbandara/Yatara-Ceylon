const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type TurnstileVerifyResponse = {
    success?: boolean;
    hostname?: string;
    action?: string;
    challenge_ts?: string;
    cdata?: string;
    'error-codes'?: string[];
};

function getTurnstileRemoteIp(remoteIp?: string | null) {
    if (!remoteIp) {
        return null;
    }

    const forwardedIp = remoteIp.split(',')[0]?.trim();
    return forwardedIp || null;
}

function logTurnstileFailure(
    message: string,
    details: Record<string, unknown>
) {
    console.error(`[Turnstile] ${message}`, details);
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

    const diagnosticContext = {
        tokenPresent: Boolean(token),
        remoteIpProvided: Boolean(forwardedIp),
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    };

    const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    if (!response.ok) {
        const responseText = await response.text().catch(() => '');
        logTurnstileFailure('siteverify HTTP failure', {
            ...diagnosticContext,
            status: response.status,
            statusText: response.statusText,
            responseText: responseText.slice(0, 300) || null,
        });
        return { success: false, error: 'Captcha verification failed' };
    }

    const data = await response.json() as TurnstileVerifyResponse;
    if (!data.success) {
        logTurnstileFailure('siteverify rejected token', {
            ...diagnosticContext,
            errorCodes: Array.isArray(data['error-codes']) ? data['error-codes'] : [],
            hostname: data.hostname || null,
            action: data.action || null,
            challengeTs: data.challenge_ts || null,
            cdataPresent: Boolean(data.cdata),
        });
        return { success: false, error: 'Captcha verification failed' };
    }

    return { success: true };
}
