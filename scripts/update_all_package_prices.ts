import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Package from '../src/models/Package';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('Missing MONGODB_URI in .env.local');
  process.exit(1);
}

async function updatePrices() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('Connected to MongoDB.');

    const packages = await Package.find({});
    
    for (const pkg of packages) {
      const updates: any = {};
      
      if (pkg.priceMin) updates.priceMin = pkg.priceMin / 10;
      if (pkg.priceMax) updates.priceMax = pkg.priceMax / 10;
      if (pkg.price) updates.price = pkg.price / 10;
      if (pkg.originalPrice) updates.originalPrice = pkg.originalPrice / 10;

      await Package.updateOne({ _id: pkg._id }, { $set: updates });
      console.log(`Updated ${pkg.slug}: ${pkg.priceMin} -> ${updates.priceMin}`);
    }

    console.log(`Successfully updated ${packages.length} packages.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating data:', error);
    process.exit(1);
  }
}

updatePrices();
