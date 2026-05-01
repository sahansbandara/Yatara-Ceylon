import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

/**
 * Phone validation — uses libphonenumber-js for proper international phone parsing.
 * Accepts E.164 format like +94771234567.
 * The old regex `phoneRegex` is kept for backward compatibility with any code that still references it.
 */
export const phoneRegex = /^\+?[\d\s\-()]{7,}$/;

export const phoneSchema = z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .refine((value) => {
        const phone = parsePhoneNumberFromString(value);
        return phone?.isValid() === true;
    }, 'Enter a valid international phone number');

export const passwordPolicyText = 'Password must be at least 10 characters and include uppercase, lowercase, number, and symbol';

export const passwordSchema = z.string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol');
