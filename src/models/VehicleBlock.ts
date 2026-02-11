import mongoose, { Schema, Document, Types } from 'mongoose';
import { VehicleBlockReasons } from '@/lib/constants';

export interface IVehicleBlock extends Document {
    vehicleId: Types.ObjectId;
    from: Date;
    to: Date;
    reason: keyof typeof VehicleBlockReasons;
    bookingId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const VehicleBlockSchema = new Schema<IVehicleBlock>(
    {
        vehicleId: {
            type: Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
            index: true,
        },
        from: { type: Date, required: true },
        to: { type: Date, required: true },
        reason: {
            type: String,
            required: true,
            enum: Object.values(VehicleBlockReasons),
        },
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    },
    { timestamps: true }
);

VehicleBlockSchema.index({ vehicleId: 1, from: 1, to: 1 });

export default mongoose.models.VehicleBlock ||
    mongoose.model<IVehicleBlock>('VehicleBlock', VehicleBlockSchema);
