'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        turnstile?: {
            render: (element: HTMLElement, options: {
                sitekey: string;
                callback: (token: string) => void;
                'expired-callback'?: () => void;
                'error-callback'?: () => void;
                theme?: 'light' | 'dark' | 'auto';
            }) => string;
            remove?: (widgetId: string) => void;
            reset?: (widgetId?: string) => void;
        };
    }
}

const SCRIPT_ID = 'cf-turnstile-script';
const DEV_BYPASS_TOKEN = 'dev-turnstile-bypass-token';

function loadTurnstileScript() {
    return new Promise<void>((resolve, reject) => {
        if (window.turnstile) {
            resolve();
            return;
        }

        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('Failed to load captcha script')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load captcha script'));
        document.head.appendChild(script);
    });
}

export default function TurnstileField({
    token,
    onTokenChange,
    onErrorChange,
    theme = 'light',
    className = '',
}: {
    token: string;
    onTokenChange: (token: string) => void;
    onErrorChange?: (error: string) => void;
    theme?: 'light' | 'dark' | 'auto';
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [error, setError] = useState('');
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    useEffect(() => {
        let cancelled = false;

        const syncError = (nextError: string) => {
            setError(nextError);
            onErrorChange?.(nextError);
        };

        if (!siteKey) {
            if (process.env.NODE_ENV !== 'production') {
                onTokenChange(DEV_BYPASS_TOKEN);
                syncError('');
            } else {
                syncError('Captcha is unavailable right now.');
            }
            return;
        }

        onTokenChange('');
        syncError('');

        void loadTurnstileScript()
            .then(() => {
                if (cancelled || !containerRef.current || !window.turnstile) return;
                containerRef.current.innerHTML = '';
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    theme,
                    callback: (nextToken: string) => {
                        onTokenChange(nextToken);
                        syncError('');
                    },
                    'expired-callback': () => {
                        onTokenChange('');
                        syncError('Captcha expired. Please verify again.');
                    },
                    'error-callback': () => {
                        onTokenChange('');
                        syncError('Captcha failed. Please try again.');
                    },
                });
            })
            .catch(() => {
                if (!cancelled) {
                    onTokenChange('');
                    syncError('Captcha failed to load. Please refresh and try again.');
                }
            });

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile?.remove) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
    }, [siteKey, onErrorChange, onTokenChange, theme]);

    return (
        <div className={className}>
            <div ref={containerRef} />
            {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
            {!token && process.env.NODE_ENV !== 'production' && !siteKey ? (
                <p className="mt-2 text-[11px] text-amber-600">Captcha is bypassed in local development because Turnstile keys are not configured.</p>
            ) : null}
        </div>
    );
}
