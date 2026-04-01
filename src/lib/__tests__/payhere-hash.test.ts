/**
 * @jest-environment node
 */
import crypto from 'crypto';

// Mock the config module to provide deterministic test values
jest.mock('../payhere/config', () => ({
    PAYHERE_MERCHANT_ID: 'TEST_MERCHANT',
    PAYHERE_MERCHANT_SECRET: 'TEST_SECRET',
    PAYHERE_CURRENCY: 'LKR',
    PAYHERE_MODE: 'sandbox',
    APP_BASE_URL: 'http://localhost:3000',
    getMerchantSecret: () => 'TEST_SECRET',
    getPayhereCheckoutUrl: () => 'https://sandbox.payhere.lk/pay/checkout',
}));

import { generatePayhereHash, verifyPayhereSignature } from '../payhere/hash';

describe('PayHere hash utilities', () => {
    const merchantId = 'TEST_MERCHANT';
    const merchantSecret = 'TEST_SECRET';
    const merchantSecretHash = crypto
        .createHash('md5')
        .update(merchantSecret)
        .digest('hex')
        .toUpperCase();

    describe('generatePayhereHash', () => {
        it('should generate a valid uppercase MD5 hash', () => {
            const hash = generatePayhereHash('ORDER-001', 1000, 'LKR');
            expect(hash).toMatch(/^[A-F0-9]{32}$/);
        });

        it('should produce the correct hash for known inputs', () => {
            const orderId = 'ORDER-001';
            const amount = 1000;
            const currency = 'LKR';
            const amountFormatted = '1000.00';

            const expectedString = `${merchantId}${orderId}${amountFormatted}${currency}${merchantSecretHash}`;
            const expectedHash = crypto
                .createHash('md5')
                .update(expectedString)
                .digest('hex')
                .toUpperCase();

            const result = generatePayhereHash(orderId, amount, currency);
            expect(result).toBe(expectedHash);
        });

        it('should handle string amount input', () => {
            const hashFromNumber = generatePayhereHash('ORDER-002', 250.5, 'LKR');
            const hashFromString = generatePayhereHash('ORDER-002', '250.5', 'LKR');
            expect(hashFromNumber).toBe(hashFromString);
        });

        it('should format amount to 2 decimal places', () => {
            const hash1 = generatePayhereHash('ORDER-003', 99.9, 'LKR');
            const hash2 = generatePayhereHash('ORDER-003', '99.9', 'LKR');
            expect(hash1).toBe(hash2);
            expect(hash1).toMatch(/^[A-F0-9]{32}$/);
        });

        it('should produce different hashes for different order IDs', () => {
            const hash1 = generatePayhereHash('ORDER-A', 1000, 'LKR');
            const hash2 = generatePayhereHash('ORDER-B', 1000, 'LKR');
            expect(hash1).not.toBe(hash2);
        });

        it('should produce different hashes for different currencies', () => {
            const hashLKR = generatePayhereHash('ORDER-004', 1000, 'LKR');
            const hashUSD = generatePayhereHash('ORDER-004', 1000, 'USD');
            expect(hashLKR).not.toBe(hashUSD);
        });
    });

    describe('verifyPayhereSignature', () => {
        it('should return true for a valid signature', () => {
            const orderId = 'ORDER-100';
            const amount = '5000.00';
            const currency = 'LKR';
            const statusCode = '2';

            const hashString = `${merchantId}${orderId}${amount}${currency}${statusCode}${merchantSecretHash}`;
            const validSig = crypto
                .createHash('md5')
                .update(hashString)
                .digest('hex')
                .toUpperCase();

            const result = verifyPayhereSignature(orderId, amount, currency, statusCode, validSig);
            expect(result).toBe(true);
        });

        it('should return false for a tampered signature', () => {
            const result = verifyPayhereSignature('ORDER-100', '5000.00', 'LKR', '2', 'INVALID_SIGNATURE_00000000000');
            expect(result).toBe(false);
        });

        it('should return false when amount differs', () => {
            const orderId = 'ORDER-101';
            const currency = 'LKR';
            const statusCode = '2';

            const hashString = `${merchantId}${orderId}1000.00${currency}${statusCode}${merchantSecretHash}`;
            const sig = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

            const result = verifyPayhereSignature(orderId, '2000.00', currency, statusCode, sig);
            expect(result).toBe(false);
        });

        it('should handle numeric status code', () => {
            const orderId = 'ORDER-102';
            const amount = '100.00';
            const currency = 'LKR';
            const statusCode = 2;

            const hashString = `${merchantId}${orderId}${amount}${currency}${statusCode}${merchantSecretHash}`;
            const sig = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

            const result = verifyPayhereSignature(orderId, amount, currency, statusCode, sig);
            expect(result).toBe(true);
        });
    });
});
