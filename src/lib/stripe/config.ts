import Stripe from 'stripe';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
export const STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || 'lkr';
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

let _stripe: Stripe | null = null;

/** Lazy Stripe instance — only created when keys are available */
export const getStripe = (): Stripe => {
    if (!_stripe && STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.startsWith('sk_')) {
        _stripe = new Stripe(STRIPE_SECRET_KEY, { typescript: true });
    }
    if (!_stripe) {
        throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to .env');
    }
    return _stripe;
};

/**
 * Check if Stripe is configured with real keys.
 */
export const isStripeConfigured = () => {
    return (
        STRIPE_SECRET_KEY &&
        STRIPE_SECRET_KEY !== '' &&
        STRIPE_SECRET_KEY.startsWith('sk_')
    );
};
