import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookingPartnerAssignment extends Document {
    bookingId: Types.ObjectId;
    partnerId: Types.ObjectId;
    serviceId?: Types.ObjectId;
    agreedRate: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingPartnerAssignmentSchema = new Schema<IBookingPartnerAssignment>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            index: true,
        },
        partnerId: {
            type: Schema.Types.ObjectId,
            ref: 'Partner',
            required: true,
        },
        serviceId: { type: Schema.Types.ObjectId, ref: 'PartnerService' },
        agreedRate: { type: Number, required: true, min: 0 },
        notes: String,
    },
    { timestamps: true }
);

BookingPartnerAssignmentSchema.index({ bookingId: 1, partnerId: 1 });

export default mongoose.models.BookingPartnerAssignment ||
    mongoose.model<IBookingPartnerAssignment>(
        'BookingPartnerAssignment',
        BookingPartnerAssignmentSchema
    );
