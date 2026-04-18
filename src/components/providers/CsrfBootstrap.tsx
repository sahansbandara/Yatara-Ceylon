'use client';

import { useEffect } from 'react';

const CSRF_COOKIE_NAME = 'toms_csrf';
const CSRF_HEADER_NAME = 'x-csrf-token';

function readCookie(name: string) {
    if (typeof document === 'undefined') return null;

    return document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.slice(name.length + 1) || null;
}

async function ensureCsrfCookie(originalFetch: typeof window.fetch) {
    if (readCookie(CSRF_COOKIE_NAME)) return readCookie(CSRF_COOKIE_NAME);

    const response = await originalFetch('/api/auth/csrf', {
        method: 'GET',
        credentials: 'same-origin',
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return payload.csrfToken || readCookie(CSRF_COOKIE_NAME);
}

export function CsrfBootstrap() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const originalFetch = window.fetch.bind(window);
        let csrfReady: Promise<string | null> | null = null;

        const needsCsrf = (input: RequestInfo | URL, init?: RequestInit) => {
            const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
            if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
                return false;
            }

            const url = typeof input === 'string'
                ? input
                : input instanceof URL
                    ? input.toString()
                    : input.url;

            return url.startsWith('/api/') && !url.startsWith('/api/auth/csrf');
        };

        window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            if (!needsCsrf(input, init)) {
                return originalFetch(input, init);
            }

            csrfReady ??= ensureCsrfCookie(originalFetch);
            const csrfToken = await csrfReady;

            const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
            if (csrfToken) {
                headers.set(CSRF_HEADER_NAME, csrfToken);
            }

            return originalFetch(input, {
                ...init,
                credentials: init?.credentials || 'same-origin',
                headers,
            });
        };

        void ensureCsrfCookie(originalFetch);

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    return null;
}
