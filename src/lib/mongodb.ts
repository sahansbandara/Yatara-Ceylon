import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('Creating new MongoDB connection promise...');
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        });
    }

    try {
        console.log('Awaiting MongoDB connection...');
        cached.conn = await cached.promise;
        console.log('MongoDB connected successfully');
    } catch (e) {
        console.error('MongoDB connection failed:', e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
