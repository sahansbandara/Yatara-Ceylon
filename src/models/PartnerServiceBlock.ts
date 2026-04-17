import mongoose, { Schema, Document, Types } from 'mongoose';
import { ServiceBlockReasons } from '@/lib/constants';

export interface IPartnerServiceBlock extends Document {
    serviceId: Types.ObjectId;
    from: Date;
    to: Date;
    reason: keyof typeof ServiceBlockReasons;
    bookingId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PartnerServiceBlockSchema = new Schema<IPartnerServiceBlock>(
    {
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: 'PartnerService',
            required: true,
            index: true,
        },
        from: { type: Date, required: true },
        to: { type: Date, required: true },
        reason: {
            type: String,
            required: true,
            enum: Object.values(ServiceBlockReasons),
        },
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    },
    { timestamps: true }
);

PartnerServiceBlockSchema.index({ serviceId: 1, from: 1, to: 1 });

export default mongoose.models.PartnerServiceBlock ||
    mongoose.model<IPartnerServiceBlock>('PartnerServiceBlock', PartnerServiceBlockSchema);
