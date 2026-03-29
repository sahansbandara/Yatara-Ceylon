import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Package from './src/models/Package';

dotenv.config({ path: '.env.local' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const pkgs = await Package.find({ isPublished: true, isDeleted: false }).lean();
    console.log(`Found ${pkgs.length} published packages.`);
    process.exit(0);
}
check();
