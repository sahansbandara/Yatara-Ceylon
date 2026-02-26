import mongoose, { Schema, Document } from 'mongoose';

export interface IItineraryDay {
    day: number;
    title: string;
    description: string;
    activity?: string;
}

export interface IPackage extends Document {
    title: string;
    slug: string;
    summary: string;
    fullDescription?: string;
    duration: string;
    itinerary: IItineraryDay[];
    priceMin: number;
    priceMax: number;
    price?: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    images: string[];
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    tags: string[];
    isPublished: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ItineraryDaySchema = new Schema<IItineraryDay>(
    {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        activity: String,
    },
    { _id: false }
);

const PackageSchema = new Schema<IPackage>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, lowercase: true },
        summary: { type: String, required: true },
        fullDescription: String,
        duration: { type: String, required: true },
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
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

PackageSchema.index({ slug: 1 }, { unique: true });
PackageSchema.index({ tags: 1 });
PackageSchema.index({ priceMin: 1, priceMax: 1 });

export default mongoose.models.Package ||
    mongoose.model<IPackage>('Package', PackageSchema);
