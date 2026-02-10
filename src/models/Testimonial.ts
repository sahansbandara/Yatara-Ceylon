import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    name: string;
    country?: string;
    avatar?: string;
    rating: number;
    comment: string;
    tour?: string;
    isPublished: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: { type: String, required: true, trim: true },
        country: String,
        avatar: String,
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        tour: String,
        isPublished: { type: Boolean, default: false, index: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.models.Testimonial ||
    mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
