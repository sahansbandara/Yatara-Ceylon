import mongoose from 'mongoose';
import connectDB from './src/lib/mongodb.ts';
import Package from './src/models/Package.ts';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  await connectDB();
  const pkgs = await Package.find({
    isPublished: true,
    isDeleted: false,
    type: { $ne: 'transfer' },
    $or: [{ type: 'journey' }, { type: { $exists: false } }],
  }).sort({ isFeatured: -1, homeRank: -1, createdAt: -1 }).lean();
  
  pkgs.forEach((p, i) => console.log(`${i+1}. ${p.title} (type: ${p.type})`));
  
  process.exit(0);
}
run();
