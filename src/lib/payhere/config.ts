export const PAYHERE_MODE = process.env.PAYHERE_MODE || 'sandbox';
export const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '';
export const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || '';
export const PAYHERE_CURRENCY = process.env.PAYHERE_CURRENCY || 'LKR';
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const getPayhereCheckoutUrl = () => {
    return PAYHERE_MODE === 'sandbox'
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout';
};
