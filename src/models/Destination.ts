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
    },
    { timestamps: true }
);

DestinationSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Destination ||
    mongoose.model<IDestination>('Destination', DestinationSchema);
