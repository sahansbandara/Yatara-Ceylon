import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We need to define or import the schema
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
        type: { type: String, enum: ['journey', 'transfer'], default: 'journey' },
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
        isPublished: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        isFeaturedHome: { type: Boolean, default: false },
        homeRank: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

const adventurePackage = {
    title: "Adventure & Highlands",
    slug: "adventure-and-highlands",
    summary: "A refined soft-adventure journey through Sri Lanka’s misty mountains, rivers, waterfalls, and scenic highland routes.",
    fullDescription: "A refined soft-adventure journey through Sri Lanka’s misty mountains, rivers, waterfalls, and scenic highland routes.",
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    type: "journey",
    style: "adventure",
    priceMin: 1800,
    priceMax: 3500,
    price: 1800,
    rating: 5,
    reviewCount: 12,
    images: [
        "/images/packages/adventure-and-highlands/hero.webp",
        "/images/packages/adventure-and-highlands/gallery-1.webp",
        "/images/packages/adventure-and-highlands/gallery-2.webp",
        "/images/packages/adventure-and-highlands/gallery-3.webp"
    ],
    highlights: [
        "White Water Rafting in Kitulgala",
        "Scenic Train Ride to Ella",
        "Hiking Little Adam's Peak & Nine Arch Bridge",
        "Horton Plains National Park",
        "Boutique Highland Lodges"
    ],
    inclusions: [
        "Luxury Boutique Accommodation",
        "Private English-Speaking Guide",
        "All Adventure Activity Fees",
        "Private Premium Transport",
        "Daily Breakfast & Selected Dinners"
    ],
    exclusions: [
        "International Flights",
        "Visa Fees",
        "Personal Expenses"
    ],
    tags: ["ADVENTURE", "HIGHLANDS", "PRIVATE", "SCENIC"],
    isPublished: true,
    isFeatured: true,
    isFeaturedHome: false,
    homeRank: 0,
    itinerary: [
        {
            day: 1,
            title: "Arrival & Kitulgala Rapids",
            description: "Begin your journey by heading straight to Kitulgala, the adventure capital. Enjoy an exhilarating white-water rafting session followed by a peaceful evening at a luxury riverside lodge.",
            activity: "White Water Rafting"
        },
        {
            day: 2,
            title: "Ascent to Nuwara Eliya",
            description: "Drive through winding mountain roads past lush tea estates. Visit a historic tea factory before settling into a colonial-era boutique hotel in 'Little England'.",
            activity: "Tea Factory Tour & Scenic Drive"
        },
        {
            day: 3,
            title: "Horton Plains & World's End",
            description: "An early morning trek across the majestic Horton Plains to the dramatic World's End precipice. Rest and rejuvenate at your estate bungalow in the afternoon.",
            activity: "Horton Plains Trek"
        },
        {
            day: 4,
            title: "The Iconic Train to Ella",
            description: "Board the famous highland observation carriage for one of the most scenic railway journeys in the world, traversing valleys, waterfalls, and pine forests to reach Ella.",
            activity: "Scenic Train Ride"
        },
        {
            day: 5,
            title: "Ella's Peaks & Valleys",
            description: "Hike up Little Adam's Peak for panoramic views, walk along the historic Nine Arch Bridge, and optionally take a thrilling zip-line ride above the tea plantations.",
            activity: "Hiking & Zip-lining"
        },
        {
            day: 6,
            title: "Descent & Departure",
            description: "Descend from the misty mountains via the scenic southern route back to Colombo or the airport, concluding your signature highland adventure.",
            activity: "Transfer"
        }
    ]
};

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to DB');
        
        // Upsert the package based on slug
        const result = await Package.findOneAndUpdate(
            { slug: adventurePackage.slug },
            { $set: adventurePackage },
            { upsert: true, new: true }
        );
        
        console.log(`Successfully upserted package: ${result.title}`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        process.exit(0);
    }
}

run();
