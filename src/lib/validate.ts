import { NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

// Validate request body against a Zod schema
export async function validateBody<T>(
    request: Request,
    schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { data, error: null };
    } catch (err) {
        if (err instanceof ZodError) {
            return {
                data: null,
                error: NextResponse.json(
                    {
                        error: 'Validation failed',
                        details: err.errors.map((e) => ({
                            field: e.path.join('.'),
                            message: e.message,
                        })),
                    },
                    { status: 400 }
                ),
            };
        }
        return {
            data: null,
            error: NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            ),
        };
    }
}

// Validate query parameters
export function validateQuery<T>(
    url: string,
    schema: ZodSchema<T>
): { data: T; error: null } | { data: null; error: NextResponse } {
    try {
        const { searchParams } = new URL(url);
        const params = Object.fromEntries(searchParams.entries());
        const data = schema.parse(params);
        return { data, error: null };
    } catch (err) {
        if (err instanceof ZodError) {
            return {
                data: null,
                error: NextResponse.json(
                    {
                        error: 'Invalid query parameters',
                        details: err.errors.map((e) => ({
                            field: e.path.join('.'),
                            message: e.message,
                        })),
                    },
                    { status: 400 }
                ),
            };
        }
        return {
            data: null,
            error: NextResponse.json(
                { error: 'Invalid query parameters' },
                { status: 400 }
            ),
        };
    }
}
