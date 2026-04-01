import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const user = await User.findOne({ email: 'admin@yataraceylon.me', isDeleted: false, status: 'ACTIVE' }).select('+passwordHash');
    console.log(user);
    if (!user) return console.log('user not found');
    
    // Test bcrypt
    const bcrypt = await import('bcryptjs');
    const valid = await bcrypt.compare('Admin@123', user.passwordHash);
    console.log('Valid:', valid);
    
    // Test jose
    const { SignJWT } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key-change-in-production-1234567890');
    const token = await new SignJWT({ userId: user._id.toString(), role: user.role, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(process.env.JWT_EXPIRES_IN || '1d')
        .setIssuedAt()
        .sign(JWT_SECRET);
    console.log('Token created', token);
    
    await mongoose.disconnect();
}

test().catch(console.error);
