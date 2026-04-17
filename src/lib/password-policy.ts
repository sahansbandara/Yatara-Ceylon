import { z } from 'zod';

export const phoneRegex = /^\+?[\d\s\-()]{7,}$/;

export const passwordPolicyText = 'Password must be at least 10 characters and include uppercase, lowercase, number, and symbol';

export const passwordSchema = z.string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one symbol');
