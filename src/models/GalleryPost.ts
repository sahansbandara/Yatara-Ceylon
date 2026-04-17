import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryPost extends Document {
    type: 'IMAGE' | 'BLOG';
    title: string;
    content?: string;
    images: string[];
    tags: string[];
    isPublished: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const GalleryPostSchema = new Schema<IGalleryPost>(
    {
        type: { type: String, enum: ['IMAGE', 'BLOG'], required: true },
        title: { type: String, required: true, trim: true },
        content: String,
        images: [String],
        tags: [String],
        isPublished: { type: Boolean, default: false, index: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.models.GalleryPost ||
    mongoose.model<IGalleryPost>('GalleryPost', GalleryPostSchema);
