const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

const PackageSchema = new mongoose.Schema(
    {
        priceMin: { type: Number },
        priceMax: { type: Number },
        price: { type: Number },
        originalPrice: { type: Number },
    },
    { strict: false } // allow querying and updating other fields without defining full schema
);

const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

async function main() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        const packages = await Package.find({});
        console.log(`Found ${packages.length} packages.`);

        for (const pkg of packages) {
            const updates = {};
            
            if (pkg.priceMin) updates.priceMin = pkg.priceMin / 10;
            if (pkg.priceMax) updates.priceMax = pkg.priceMax / 10;
            if (pkg.price) updates.price = pkg.price / 10;
            if (pkg.originalPrice) updates.originalPrice = pkg.originalPrice / 10;

            if (Object.keys(updates).length > 0) {
                await Package.updateOne({ _id: pkg._id }, { $set: updates });
                console.log(`Updated ${pkg.title || pkg.slug}: priceMin changed from ${pkg.priceMin} to ${updates.priceMin}`);
            }
        }

        console.log('✅ All package prices successfully updated!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected.');
    }
}

main();
