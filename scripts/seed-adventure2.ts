import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import Package from './src/models/Package';

const adventurePackage = {
    title: "Adventure & Highlands",
    slug: "adventure-and-highlands",
    subtitle: "A refined soft-adventure journey through Sri Lanka’s misty mountains, rivers, waterfalls, and scenic highland routes.",
    summary: "Misty peaks, wild rivers, and refined adventure escapes.",
    fullDescription: "Adventure & Highlands is a refined highland journey designed for travelers who want nature, motion, and atmosphere without sacrificing comfort. From rivers and waterfalls to tea-country roads and cool mountain air, this itinerary blends scenic transfer routes, soft adventure, and premium stays into one balanced escape through Sri Lanka’s uplands.",
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    type: "journey",
    style: "adventure",
    priceMin: 245000,
    priceMax: 290000,
    price: 245000,
    rating: 5,
    reviewCount: 0,
    images: [
        "/images/packages/adventure-and-highlands/hero.webp",
        "/images/packages/adventure-and-highlands/gallery-1.webp",
        "/images/packages/adventure-and-highlands/gallery-2.webp",
        "/images/packages/adventure-and-highlands/gallery-3.webp"
    ],
    highlights: [
        "Scenic train and mountain-road transitions through Sri Lanka’s most beautiful highland landscapes",
        "Guided soft-adventure experiences with comfort-focused pacing",
        "Waterfalls, rivers, forest walks, and panoramic viewpoints",
        "Boutique stays with cool-climate atmosphere and refined local character"
    ],
    inclusions: [
        "Private vehicle throughout",
        "Boutique accommodation",
        "Breakfast daily",
        "Private guide / driver-guide",
        "Selected entrance fees",
        "Adventure activity coordination",
        "Scenic highland routing"
    ],
    exclusions: [
        "Flights / visa",
        "Lunch and dinner unless stated",
        "Personal expenses",
        "Travel insurance",
        "Optional premium activity upgrades"
    ],
    tags: ["ADVENTURE", "HIGHLANDS", "PRIVATE", "SCENIC", "COUPLES", "NATURE"],
    isPublished: true,
    isFeatured: true,
    isFeaturedHome: true,
    homeRank: 1,
    itinerary: [
        {
            day: 1,
            title: "Arrival & Kitulgala",
            description: "Airport welcome. Transfer to Kitulgala. Settle into a riverside stay and enjoy a relaxed evening surrounded by rainforest atmosphere.",
            activity: "KITULGALA RIVERSIDE"
        },
        {
            day: 2,
            title: "Kitulgala Adventure",
            description: "Enjoy a guided soft-adventure day with white-water rafting, rainforest scenery, and time to unwind by the river.",
            activity: "WHITE-WATER RAFTING"
        },
        {
            day: 3,
            title: "Kitulgala to Nuwara Eliya",
            description: "Drive into the highlands through winding scenic roads, tea estates, and cool mountain landscapes. Check in to a boutique hill-country stay.",
            activity: "TEA COUNTRY DRIVE"
        },
        {
            day: 4,
            title: "Nuwara Eliya Highlands",
            description: "Visit waterfalls, viewpoints, and garden landscapes. Spend the afternoon enjoying the slower charm of Sri Lanka’s cool-climate hill country.",
            activity: "HIGHLAND VIEWPOINTS"
        },
        {
            day: 5,
            title: "Nuwara Eliya to Ella",
            description: "Travel toward Ella with dramatic scenery, lush valleys, and iconic hill-country atmosphere. Explore selected viewpoints and relax into the final evening.",
            activity: "ELLA SCENIC ROUTE"
        },
        {
            day: 6,
            title: "Departure",
            description: "Enjoy a final relaxed breakfast before private transfer for onward departure.",
            activity: "DEPARTURE"
        }
    ]
};

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        const result = await Package.findOneAndUpdate(
            { slug: adventurePackage.slug },
            { $set: adventurePackage },
            { upsert: true, new: true }
        );
        console.log(`Upserted: ${result.title}`);
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

run();
