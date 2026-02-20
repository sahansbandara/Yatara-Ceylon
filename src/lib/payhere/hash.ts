import crypto from 'crypto';
import { PAYHERE_MERCHANT_ID, PAYHERE_MERCHANT_SECRET } from './config';

/**
 * Generate PayHere hash for creating a payment.
 * hash = UPPER(MD5(merchant_id + order_id + amount_2dp + currency + UPPER(MD5(merchant_secret))))
 */
export const generatePayhereHash = (orderId: string, amount: string | number, currency: string) => {
    const amountFormatted = parseFloat(amount.toString()).toFixed(2);

    const merchantSecretHash = crypto
        .createHash('md5')
        .update(PAYHERE_MERCHANT_SECRET)
        .digest('hex')
        .toUpperCase();

    const hashString = `${PAYHERE_MERCHANT_ID}${orderId}${amountFormatted}${currency}${merchantSecretHash}`;

    return crypto
        .createHash('md5')
        .update(hashString)
        .digest('hex')
        .toUpperCase();
};

/**
 * Verify MD5 signature from PayHere notification.
 * localSig = UPPER(MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + UPPER(MD5(merchant_secret))))
 */
export const verifyPayhereSignature = (
    orderId: string,
    payhereAmount: string | number,
    payhereCurrency: string,
    statusCode: string | number,
    md5sig: string
) => {
    const merchantSecretHash = crypto
        .createHash('md5')
        .update(PAYHERE_MERCHANT_SECRET)
        .digest('hex')
        .toUpperCase();

    const hashString = `${PAYHERE_MERCHANT_ID}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${merchantSecretHash}`;

    const expectedSig = crypto
        .createHash('md5')
        .update(hashString)
        .digest('hex')
        .toUpperCase();

    return expectedSig === md5sig;
};
