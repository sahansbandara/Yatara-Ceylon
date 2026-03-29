/**
 * Updates the Adventure & Highlands package in MongoDB
 * with full detail page content matching the PDF reference design.
 * 
 * Run: node scripts/update-adventure-highlands.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

const ItineraryDaySchema = new mongoose.Schema(
    {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        activity: String,
    },
    { _id: false }
);

const PackageSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, lowercase: true },
        summary: { type: String, required: true },
        fullDescription: String,
        duration: { type: String, required: true },
        durationDays: { type: Number, min: 1 },
        type: { type: String, enum: ['journey', 'transfer'], default: 'journey', index: true },
        style: { type: String, enum: ['cultural', 'wildlife', 'heritage', 'experiences', 'wellness', 'family', 'luxury', 'adventure', 'beach', 'marine'] },
        itinerary: [ItineraryDaySchema],
        priceMin: { type: Number, required: true, min: 0 },
        priceMax: { type: Number, required: true, min: 0 },
        price: Number,
        originalPrice: Number,
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
        images: [String],
        highlights: [String],
        inclusions: [String],
        exclusions: [String],
        tags: [String],
        isPublished: { type: Boolean, default: false, index: true },
        isFeatured: { type: Boolean, default: false, index: true },
        isFeaturedHome: { type: Boolean, default: false, index: true },
        homeRank: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

async function main() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        const updateData = {
            title: 'Adventure & Highlands',
            summary: 'A refined soft-adventure journey through Sri Lanka\'s misty mountains, rivers, waterfalls, and scenic highland routes.',
            fullDescription: 'Adventure & Highlands is a refined highland journey designed for travelers who want nature, motion, and atmosphere without sacrificing comfort. From rivers and waterfalls to tea-country roads and cool mountain air, this itinerary blends scenic transfer routes, soft adventure, and premium stays into one balanced escape through Sri Lanka\'s uplands.',
            duration: '6 Days / 5 Nights',
            durationDays: 6,
            type: 'journey',
            style: 'adventure',
            priceMin: 245000,
            priceMax: 290000,
            tags: ['Adventure', 'Highlands', 'Private', 'Scenic', 'Couples', 'Nature'],
            highlights: [
                'Scenic train and mountain-road transitions through Sri Lanka\'s most beautiful highland landscapes',
                'Guided soft-adventure experiences with comfort-focused pacing',
                'Waterfalls, rivers, forest walks, and panoramic viewpoints',
                'Boutique stays with cool-climate atmosphere and refined local character',
            ],
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival & Kitulgala',
                    description: 'Airport welcome. Transfer to Kitulgala. Settle into a riverside stay and enjoy a relaxed evening surrounded by rainforest atmosphere.',
                    activity: 'Kitulgala Riverside',
                },
                {
                    day: 2,
                    title: 'Kitulgala Adventure',
                    description: 'Enjoy a guided soft-adventure day with white-water rafting, rainforest scenery, and time to unwind by the river.',
                    activity: 'White-Water Rafting',
                },
                {
                    day: 3,
                    title: 'Kitulgala to Nuwara Eliya',
                    description: 'Drive into the highlands through winding scenic roads, tea estates, and cool mountain landscapes. Check in to a boutique hill-country stay.',
                    activity: 'Tea Country Drive',
                },
                {
                    day: 4,
                    title: 'Nuwara Eliya Highlands',
                    description: 'Visit waterfalls, viewpoints, and garden landscapes. Spend the afternoon enjoying the slower charm of Sri Lanka\'s cool-climate hill country.',
                    activity: 'Highland Viewpoints',
                },
                {
                    day: 5,
                    title: 'Nuwara Eliya to Ella',
                    description: 'Travel toward Ella with dramatic scenery, lush valleys, and iconic hill-country atmosphere. Explore selected viewpoints and relax into the final evening.',
                    activity: 'Ella Scenic Route',
                },
                {
                    day: 6,
                    title: 'Departure',
                    description: 'Enjoy a final relaxed breakfast before private transfer for onward departure.',
                    activity: 'Departure',
                },
            ],
            inclusions: [
                'Private vehicle throughout',
                'Boutique accommodation',
                'Breakfast daily',
                'Private guide / driver-guide',
                'Selected entrance fees',
                'Adventure activity coordination',
                'Scenic highland routing',
            ],
            exclusions: [
                'Flights / visa',
                'Lunch and dinner unless stated',
                'Personal expenses',
                'Travel insurance',
                'Optional premium activity upgrades',
            ],
        };

        const result = await Package.findOneAndUpdate(
            { slug: 'adventure-and-highlands' },
            { $set: updateData },
            { new: true }
        );

        if (result) {
            console.log('✅ Package updated successfully!');
            console.log(`   Title: ${result.title}`);
            console.log(`   Slug: ${result.slug}`);
            console.log(`   Duration: ${result.duration}`);
            console.log(`   Price: LKR ${result.priceMin.toLocaleString()} – ${result.priceMax.toLocaleString()}`);
            console.log(`   Tags: ${result.tags.join(', ')}`);
            console.log(`   Highlights: ${result.highlights.length} items`);
            console.log(`   Itinerary: ${result.itinerary.length} days`);
            console.log(`   Inclusions: ${result.inclusions.length} items`);
            console.log(`   Exclusions: ${result.exclusions.length} items`);
            console.log(`   Images: ${result.images.length} images (kept existing)`);
        } else {
            console.error('❌ Package with slug "adventure-and-highlands" not found in database.');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected.');
    }
}

main();
