/**
 * Seed script: sync static destinations from src/data/destinations.ts into MongoDB.
 * Uses upsert (findOneAndUpdate) on slug so it's safe to run multiple times.
 *
 * Usage:  npx tsx src/scripts/seed-destinations.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import Destination from '../models/Destination';
import { DESTINATIONS } from '../data/destinations';

async function seedDestinations() {
    await connectDB();

    let created = 0;
    let updated = 0;

    for (const d of DESTINATIONS) {
        const result = await Destination.findOneAndUpdate(
            { slug: d.slug },
            {
                $setOnInsert: {
                    isPublished: true,
                    isDeleted: false,
                },
                $set: {
                    title: d.title,
                    slug: d.slug,
                    description: d.description,
                    longDescription: d.longDescription,
                    location: d.location,
                    images: d.images,
                    region: d.region,
                    luxuryLabel: d.luxuryLabel,
                    bestSeason: d.bestSeason,
                    idealNights: d.idealNights,
                    travelStyleTags: d.travelStyleTags,
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (result.createdAt && result.updatedAt &&
            Math.abs(result.createdAt.getTime() - result.updatedAt.getTime()) < 1000) {
            created++;
        } else {
            updated++;
        }
    }

    console.log(`✅ Seed complete: ${created} created, ${updated} updated out of ${DESTINATIONS.length} total.`);
    await mongoose.disconnect();
    process.exit(0);
}

seedDestinations().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
