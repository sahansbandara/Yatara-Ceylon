/**
 * @jest-environment node
 */
import { formatPrice } from '../CurrencyContext';
import { formatLKR, formatLKRCompact } from '../currency';

describe('formatPrice', () => {
    const rate = 310;

    it('should format LKR price with locale string', () => {
        const result = formatPrice(31000, 'LKR', rate);
        expect(result).toContain('LKR');
        expect(result).toContain('31');
    });

    it('should convert and format USD price', () => {
        const result = formatPrice(31000, 'USD', rate);
        expect(result).toContain('USD');
        expect(result).toContain('100');
    });

    it('should handle zero price', () => {
        expect(formatPrice(0, 'LKR', rate)).toContain('0');
        expect(formatPrice(0, 'USD', rate)).toContain('0');
    });

    it('should round USD conversion to nearest integer', () => {
        // 15500 / 310 = 50
        const result = formatPrice(15500, 'USD', rate);
        expect(result).toContain('50');
    });

    it('should handle large prices', () => {
        const result = formatPrice(1000000, 'LKR', rate);
        expect(result).toContain('LKR');
        expect(result).toContain('1,000,000');
    });
});

describe('formatLKR', () => {
    it('should format a standard price with LKR prefix', () => {
        const result = formatLKR(31000);
        expect(result).toContain('LKR');
        expect(result).toContain('31,000');
    });

    it('should handle zero', () => {
        const result = formatLKR(0);
        expect(result).toContain('LKR');
        expect(result).toContain('0');
    });

    it('should not include decimal places', () => {
        const result = formatLKR(1500.75);
        expect(result).not.toContain('.');
    });

    it('should format large numbers with commas', () => {
        const result = formatLKR(1000000);
        expect(result).toContain('1,000,000');
    });
});

describe('formatLKRCompact', () => {
    it('should format millions with M suffix', () => {
        expect(formatLKRCompact(1500000)).toBe('LKR 1.5M');
    });

    it('should format exact millions', () => {
        expect(formatLKRCompact(2000000)).toBe('LKR 2.0M');
    });

    it('should format thousands with K suffix', () => {
        expect(formatLKRCompact(45000)).toBe('LKR 45K');
    });

    it('should format exact thousands', () => {
        expect(formatLKRCompact(1000)).toBe('LKR 1K');
    });

    it('should use full format for small amounts', () => {
        const result = formatLKRCompact(500);
        expect(result).toContain('LKR');
        expect(result).toContain('500');
    });

    it('should use full format for zero', () => {
        const result = formatLKRCompact(0);
        expect(result).toContain('LKR');
        expect(result).toContain('0');
    });
});
