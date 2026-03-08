export const PAYHERE_MODE = process.env.PAYHERE_MODE || 'sandbox';
export const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '';
export const PAYHERE_CURRENCY = process.env.PAYHERE_CURRENCY || 'LKR';
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Two merchant secrets — one per domain registered in PayHere
const PAYHERE_SECRET_NOWWW = process.env.PAYHERE_MERCHANT_SECRET || '';
const PAYHERE_SECRET_WWW = process.env.PAYHERE_MERCHANT_SECRET_WWW || '';

/** Auto-select the correct Merchant Secret based on APP_BASE_URL */
export const getMerchantSecret = (): string => {
    const url = APP_BASE_URL.toLowerCase();
    if (url.includes('www.')) return PAYHERE_SECRET_WWW || PAYHERE_SECRET_NOWWW;
    return PAYHERE_SECRET_NOWWW || PAYHERE_SECRET_WWW;
};

// Keep backward compat for imports that use PAYHERE_MERCHANT_SECRET directly
export const PAYHERE_MERCHANT_SECRET = PAYHERE_SECRET_NOWWW;

export const getPayhereCheckoutUrl = () => {
    return PAYHERE_MODE === 'sandbox'
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout';
};
