import mongoose, { Schema, Document } from 'mongoose';

export interface IDistrict extends Document {
    name: string;
    geojsonId: string;
    province: string;
    meta?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const DistrictSchema = new Schema<IDistrict>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        geojsonId: { type: String, required: true, unique: true },
        province: { type: String, required: true },
        meta: Schema.Types.Mixed,
    },
    { timestamps: true }
);

export default mongoose.models.District ||
    mongoose.model<IDistrict>('District', DistrictSchema);
