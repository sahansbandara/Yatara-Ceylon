import mongoose, { Schema, Document } from 'mongoose';
import { VehicleStatus, VehicleTypes } from '@/lib/constants';

export interface IVehicle extends Omit<Document, 'model'> {
    type: keyof typeof VehicleTypes;
    model: string;
    plateNumber?: string;
    seats: number;
    luggage?: number;
    dailyRate: number;
    status: keyof typeof VehicleStatus;
    images: string[];
    features: string[];
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
    {
        type: {
            type: String,
            required: true,
            enum: Object.values(VehicleTypes),
        },
        model: { type: String, required: true, trim: true },
        plateNumber: { type: String, trim: true },
        seats: { type: Number, required: true, min: 1 },
        luggage: { type: Number, min: 0 },
        dailyRate: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: Object.values(VehicleStatus),
            default: VehicleStatus.AVAILABLE,
            index: true,
        },
        images: [String],
        features: [String],
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

VehicleSchema.index({ type: 1, status: 1 });

export default mongoose.models.Vehicle ||
    mongoose.model<IVehicle>('Vehicle', VehicleSchema);
