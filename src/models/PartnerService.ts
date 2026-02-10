import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPartnerService extends Document {
    partnerId: Types.ObjectId;
    serviceName: string;
    rate: number;
    unit: string;
    description?: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PartnerServiceSchema = new Schema<IPartnerService>(
    {
        partnerId: {
            type: Schema.Types.ObjectId,
            ref: 'Partner',
            required: true,
            index: true,
        },
        serviceName: { type: String, required: true, trim: true },
        rate: { type: Number, required: true, min: 0 },
        unit: {
            type: String,
            required: true,
            enum: ['PER_DAY', 'PER_TRIP', 'PER_PERSON', 'PER_NIGHT', 'FLAT'],
        },
        description: String,
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.models.PartnerService ||
    mongoose.model<IPartnerService>('PartnerService', PartnerServiceSchema);
