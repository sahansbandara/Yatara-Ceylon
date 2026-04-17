import mongoose, { Schema, Document } from 'mongoose';
import { PartnerStatus, PartnerTypes } from '@/lib/constants';

export interface IPartner extends Document {
    ownerId?: mongoose.Types.ObjectId;
    type: keyof typeof PartnerTypes;
    name: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    address?: string;
    status: keyof typeof PartnerStatus;
    notes?: string;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
        type: {
            type: String,
            enum: Object.values(PartnerTypes),
            required: true,
        },
        name: { type: String, required: true, trim: true },
        contactPerson: String,
        phone: { type: String, required: true, trim: true },
        email: { type: String, lowercase: true, trim: true },
        address: String,
        status: {
            type: String,
            enum: Object.values(PartnerStatus),
            default: PartnerStatus.ACTIVE,
            index: true,
        },
        notes: String,
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

PartnerSchema.index({ type: 1, status: 1 });

export default mongoose.models.Partner ||
    mongoose.model<IPartner>('Partner', PartnerSchema);
