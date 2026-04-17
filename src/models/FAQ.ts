import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
    question: string;
    answer: string;
    order: number;
    isPublished: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        order: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false, index: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.models.FAQ ||
    mongoose.model<IFAQ>('FAQ', FAQSchema);
