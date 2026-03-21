import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    location?: string;
    images: string[];
    isPublished: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    // Luxury premium fields
    region?: string;
    shortTagline?: string;
    luxuryLabel?: string;
    heroImage?: string;
    thumbnailImage?: string;
    gallery?: string[];
    highlights?: string[];
    bestSeason?: string;
    idealNights?: string;
    travelTimeFromColombo?: string;
    travelStyleTags?: string[];
    experiences?: Array<{
        title: string;
        description: string;
        image?: string;
    }>;
    itinerary?: Array<{
        dayTitle: string;
        activities: string[];
    }>;
    stayStyles?: Array<{
        title: string;
        description: string;
        image?: string;
    }>;
    nearestAirport?: string;
    elevation?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    priority?: number;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, lowercase: true },
        description: { type: String, required: true },
        longDescription: String,
        location: String,
        images: [String],
        isPublished: { type: Boolean, default: false, index: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
        // Luxury premium fields
        region: { type: String, index: true },
        shortTagline: String,
        luxuryLabel: String,
        heroImage: String,
        thumbnailImage: String,
        gallery: [String],
        highlights: [String],
        bestSeason: String,
        idealNights: String,
        travelTimeFromColombo: String,
        travelStyleTags: [String],
        experiences: [
            {
                title: String,
                description: String,
                image: String,
            },
        ],
        itinerary: [
            {
                dayTitle: String,
                activities: [String],
            },
        ],
        stayStyles: [
            {
                title: String,
                description: String,
                image: String,
            },
        ],
        nearestAirport: String,
        elevation: String,
        coordinates: {
            lat: Number,
            lng: Number,
        },
        priority: { type: Number, default: 0 },
        seoTitle: String,
        seoDescription: String,
    },
    { timestamps: true }
);

DestinationSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Destination ||
    mongoose.model<IDestination>('Destination', DestinationSchema);
