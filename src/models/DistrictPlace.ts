import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDistrictPlace extends Document {
    districtId: Types.ObjectId;
    name: string;
    category: string;
    description?: string;
    coords?: { lat: number; lng: number };
    images: string[];
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const DistrictPlaceSchema = new Schema<IDistrictPlace>(
    {
        districtId: {
            type: Schema.Types.ObjectId,
            ref: 'District',
            required: true,
            index: true,
        },
        name: { type: String, required: true, trim: true },
        category: {
            type: String,
            required: true,
            enum: [
                'TEMPLE',
                'BEACH',
                'NATURE',
                'HERITAGE',
                'WILDLIFE',
                'ADVENTURE',
                'CITY',
                'FOOD',
                'OTHER',
            ],
        },
        description: String,
        coords: {
            lat: Number,
            lng: Number,
        },
        images: [String],
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

DistrictPlaceSchema.index({ districtId: 1, isActive: 1 });

export default mongoose.models.DistrictPlace ||
    mongoose.model<IDistrictPlace>('DistrictPlace', DistrictPlaceSchema);
