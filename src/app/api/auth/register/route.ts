import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['USER', 'VEHICLE_OWNER', 'HOTEL_OWNER']).default('USER'),
});

export async function POST(request: NextRequest) {
    try {
        // Rate Limiting
        const limitError = await rateLimit(request);
        if (limitError) return limitError;

        const body = await request.json();
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, phone, password, role } = result.data;
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password and create user
        const passwordHash = await hashPassword(password);

        // Partner roles need approval, regular users are active immediately
        const status = role === 'USER' ? 'ACTIVE' : 'PENDING_APPROVAL';

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone: phone || undefined,
            passwordHash,
            role,
            status,
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
