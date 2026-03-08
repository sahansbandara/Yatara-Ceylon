import Stripe from 'stripe';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
export const STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || 'lkr';
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
    typescript: true,
});

/**
 * Check if Stripe is configured with real keys.
 * If not, we fall back to dev-mode simulation.
 */
export const isStripeConfigured = () => {
    return (
        STRIPE_SECRET_KEY &&
        STRIPE_SECRET_KEY !== '' &&
        STRIPE_SECRET_KEY.startsWith('sk_')
    );
};
