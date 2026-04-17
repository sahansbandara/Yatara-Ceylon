import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    email?: string;
    phone: string;
    notes?: string;
    bookingHistory: Types.ObjectId[];
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        notes: String,
        bookingHistory: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ email: 1 });

export default mongoose.models.Customer ||
    mongoose.model<ICustomer>('Customer', CustomerSchema);
