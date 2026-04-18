import mongoose, { Schema, Document } from 'mongoose';

export interface IPartnerRequest extends Document {
    userId: mongoose.Types.ObjectId;
    requestType: 'VEHICLE_OWNER' | 'HOTEL_OWNER';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    businessName: string;
    contactNumber: string;
    verificationLink?: string;
    documents?: string[];
    vehicleDetails?: {
        brand?: string;
        model?: string;
        vehicleNumber?: string;
    };
    hotelDetails?: {
        location?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const PartnerRequestSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        requestType: {
            type: String,
            enum: ['VEHICLE_OWNER', 'HOTEL_OWNER'],
            required: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING'
        },
        businessName: { type: String, required: true },
        contactNumber: { type: String, required: true },
        verificationLink: { type: String },
        documents: [{ type: String }],
        vehicleDetails: {
            brand: { type: String },
            model: { type: String },
            vehicleNumber: { type: String },
        },
        hotelDetails: {
            location: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

const PartnerRequest = mongoose.models.PartnerRequest || mongoose.model<IPartnerRequest>('PartnerRequest', PartnerRequestSchema);
export default PartnerRequest;
